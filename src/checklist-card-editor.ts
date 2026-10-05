import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import memoizeOne from 'memoize-one';
import {
  mdiPalette,
  mdiSort,
  mdiEyeOutline,
  mdiDelete,
  mdiPlus,
  mdiContentCopy,
  mdiContentCut,
  mdiCodeBraces,
  mdiListBoxOutline,
  mdiTune,
  mdiGestureTap,
  mdiLinkVariant,
} from '@mdi/js';

import { editorStyles } from './checklist-card-editor.styles';
import { localize } from './localize';
import { preloadEditorComponents } from './preload-editor';
import { ensureCheckId, makeEmptyCondition, newCheckId as newId } from './utils';
import type { HomeAssistant, CardConfig, CheckRule, StateCondition, LayoutConfig } from './types';

// Loose shape of an ha-form schema entry. ha-form is HA's public, selector-based
// form renderer (the same one getConfigForm() uses), so it is the supported way
// to build editor fields instead of individual internal input elements.
type FormSchema = Record<string, unknown>;

// Optional check fields managed by the check form; empty values are removed
// from the saved YAML instead of being stored as "".
const CHECK_FORM_FIELDS = [
  'entity', 'name', 'severity', 'icon', 'color', 'show_last_changed',
  'tap_action', 'hold_action', 'double_tap_action',
] as const;

const CONDITION_FORM_FIELDS = [
  'attribute', 'attribute_value', 'fix_service',
  'prerequisite_entity', 'prerequisite_attribute', 'prerequisite_state', 'prerequisite_attribute_value',
] as const;

const isEmpty = (v: unknown) =>
  v === undefined || v === null || v === '' || (typeof v === 'object' && !Array.isArray(v) && Object.keys(v as object).length === 0);

/**
 * Visual configuration editor for {@link ChecklistCard}, rendered inside the
 * Home Assistant card editor panel. Layout follows HA's own stack card editor
 * (tab per check + toolbar), and every field is rendered through ha-form selectors.
 *
 * @element checklist-card-editor
 * @fires config-changed - Dispatched with the updated {@link CardConfig} on every field change.
 */
@customElement('checklist-card-editor')
export class ChecklistCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: CardConfig;
  @state() private _selectedCheck = 0;
  @state() private _useHaYamlEditor = false;
  @state() private _pickersReady = false;
  @state() private _yamlMode = false;
  @state() private _hasClipboard = false;
  @state() private _yamlError: string | null = null;
  private _pickerLoadStarted = false;
  private _yamlDebounceTimer: number | null = null;
  private _schemaCache = new Map<string, FormSchema[]>();
  private _onStorageEvent = (ev: StorageEvent) => {
    if (ev.key === ChecklistCardEditor.CLIPBOARD_KEY) {
      this._hasClipboard = !!this._readClipboard();
    }
  };

  private static readonly CLIPBOARD_KEY = 'checklistCardCheckClipboard';

  static styles = editorStyles;

  protected firstUpdated() {
    this._useHaYamlEditor = !!customElements.get('ha-yaml-editor');
    this._hasClipboard = !!this._readClipboard();
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('storage', this._onStorageEvent);
  }

  disconnectedCallback(): void {
    window.removeEventListener('storage', this._onStorageEvent);
    if (this._yamlDebounceTimer !== null) {
      window.clearTimeout(this._yamlDebounceTimer);
      this._yamlDebounceTimer = null;
    }
    super.disconnectedCallback();
  }

  setConfig(config: CardConfig) {
    this._config = {
      ...config,
      checks: Array.isArray(config.checks) ? config.checks.map((c, i) => ensureCheckId(c, i)) : [],
    };
    // Clamp selection to a valid range when an external YAML edit reduces or
    // empties the checks list. Avoids the editor pointing at a removed check.
    const total = this._config.checks.length;
    if (total === 0) {
      this._selectedCheck = 0;
    } else if (this._selectedCheck >= total) {
      this._selectedCheck = total - 1;
    }
  }

  // ---- Clipboard (sessionStorage, shared between editor instances) ----

  private _readClipboard(): CheckRule | null {
    try {
      const raw = sessionStorage.getItem(ChecklistCardEditor.CLIPBOARD_KEY);
      return raw ? JSON.parse(raw) as CheckRule : null;
    } catch {
      return null;
    }
  }

  private _writeClipboard(check: CheckRule | null) {
    try {
      if (check === null) sessionStorage.removeItem(ChecklistCardEditor.CLIPBOARD_KEY);
      else sessionStorage.setItem(ChecklistCardEditor.CLIPBOARD_KEY, JSON.stringify(check));
    } catch { /* ignore quota / disabled storage */ }
    this._hasClipboard = !!check;
  }

  // ---- Config mutation ----

  private _updateConfig(updates: Partial<CardConfig>) {
    const next = { ...this._config, ...updates };
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) delete (next as unknown as Record<string, unknown>)[key];
    }
    this._config = next;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  private _replaceCheck(index: number, check: CheckRule) {
    const checks = this._config.checks.map((c, i) => (i === index ? check : c));
    this._updateConfig({ checks });
  }

  private _addCondition(checkIndex: number) {
    const check = this._config.checks[checkIndex];
    if (!check) return;
    const newCondition: StateCondition = { ...makeEmptyCondition(), state: check.conditions[0]?.state || 'off' };
    this._replaceCheck(checkIndex, { ...check, conditions: [...check.conditions, newCondition] });
  }

  private _removeCondition(checkIndex: number, condIdx: number) {
    const check = this._config.checks[checkIndex];
    if (!check) return;
    const conditions = check.conditions.filter((_, j) => j !== condIdx);
    let defaultIdx = check.default_condition_index ?? 0;
    if (defaultIdx === condIdx) defaultIdx = 0;
    else if (defaultIdx > condIdx) defaultIdx -= 1;
    this._replaceCheck(checkIndex, { ...check, conditions, default_condition_index: defaultIdx });
  }

  private _addCheck() {
    const checks = [
      ...(this._config.checks || []),
      {
        id: newId(),
        entity: '',
        conditions: [makeEmptyCondition()],
        conditions_mode: 'any' as const,
        default_condition_index: 0,
      },
    ];
    this._updateConfig({ checks });
  }

  // ---- Toolbar handlers (mirror HA's hui-stack-card-editor) ----

  private _handleSelectedCheck = (ev: CustomEvent) => {
    const raw = (ev.detail as { name?: string | number } | undefined)?.name;
    const idx = typeof raw === 'string' ? parseInt(raw, 10) : raw;
    if (typeof idx === 'number' && Number.isFinite(idx)) {
      this._selectedCheck = idx;
      this._yamlError = null;
    }
  };

  private _handleAddCheck = () => {
    const clip = this._readClipboard();
    if (clip) {
      const pasted: CheckRule = { ...JSON.parse(JSON.stringify(clip)), id: newId() };
      const checks = [...(this._config.checks || []), pasted];
      this._writeClipboard(null);
      this._selectedCheck = checks.length - 1;
      this._updateConfig({ checks });
      return;
    }
    this._addCheck();
    this._selectedCheck = (this._config.checks?.length || 1) - 1;
  };

  private _handleDeleteSelectedCheck = () => {
    const total = this._config.checks?.length || 0;
    if (total === 0) return;
    const checks = this._config.checks.filter((_, i) => i !== this._selectedCheck);
    this._selectedCheck = Math.max(0, Math.min(this._selectedCheck, total - 2));
    this._updateConfig({ checks });
  };

  private _handleCutCheck = () => {
    const source = this._config.checks?.[this._selectedCheck];
    if (!source) return;
    this._writeClipboard(source);
    this._handleDeleteSelectedCheck();
  };

  private _handleMoveCheck = (ev: Event) => {
    const move = (ev.currentTarget as HTMLElement & { move?: number }).move;
    if (move !== -1 && move !== 1) return;
    const source = this._selectedCheck;
    const target = source + move;
    const checks = [...(this._config.checks || [])];
    if (target < 0 || target >= checks.length) return;
    const [item] = checks.splice(source, 1);
    checks.splice(target, 0, item);
    this._selectedCheck = target;
    this._updateConfig({ checks });
  };

  private _handleDuplicateCheck = () => {
    const source = this._config.checks?.[this._selectedCheck];
    if (!source) return;
    const copy: CheckRule = { ...JSON.parse(JSON.stringify(source)), id: newId() };
    const target = this._selectedCheck + 1;
    const checks = [...this._config.checks];
    checks.splice(target, 0, copy);
    this._selectedCheck = target;
    this._updateConfig({ checks });
  };

  private _toggleYamlMode = () => {
    this._yamlMode = !this._yamlMode;
    this._yamlError = null;
  };

  // ---- Per-check code editor ----

  private _applyParsedCheck(parsed: unknown, index: number): string | null {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return 'Object expected';
    }
    const current = this._config.checks[index];
    if (!current) return 'Check no longer exists';
    const obj = parsed as Partial<CheckRule>;
    if (!Array.isArray(obj.conditions) || obj.conditions.length === 0) {
      return '`conditions` must be a non-empty array';
    }
    this._replaceCheck(index, ensureCheckId({ ...obj, id: obj.id || current.id }));
    return null;
  }

  private _handleYamlInput = (ev: Event, index: number) => {
    const value = (ev.target as HTMLTextAreaElement).value;
    if (this._yamlDebounceTimer !== null) {
      window.clearTimeout(this._yamlDebounceTimer);
    }
    this._yamlDebounceTimer = window.setTimeout(() => {
      this._yamlDebounceTimer = null;
      try {
        this._yamlError = this._applyParsedCheck(JSON.parse(value), index);
      } catch (err) {
        this._yamlError = (err as Error).message;
      }
    }, 250);
  };

  private _handleHaYamlChange = (ev: CustomEvent) => {
    ev.stopPropagation();
    const detail = ev.detail as { value: unknown; isValid: boolean };
    if (!detail.isValid) {
      this._yamlError = 'Invalid YAML';
      return;
    }
    this._yamlError = this._applyParsedCheck(detail.value, this._selectedCheck);
  };

  private _isCheckValid(check: CheckRule | undefined): boolean {
    if (!check) return false;
    if (!check.entity || !check.entity.trim()) return false;
    return Array.isArray(check.conditions) && check.conditions.length > 0;
  }

  // ---- Card-level form ----
  //
  // Field names are flat (`layout_mode`, `layout_count`) rather than nested
  // under `layout.*`, so expandable sections can use `flatten` and each name
  // maps unambiguously to a localize key.

  private _cardData() {
    const layout: LayoutConfig = this._config.layout || { mode: 'columns', count: 1 };
    return {
      title: this._config.title ?? '',
      layout_mode: layout.mode === 'rows' ? 'rows' : 'columns',
      layout_count: layout.count || 1,
      text_mode: this._config.text_mode || 'clip',
      sort: this._config.sort || 'manual',
      sort_direction: this._config.sort_direction || 'asc',
      show_ok_section: this._config.show_ok_section || 'inline',
    };
  }

  private _cardSchema = memoizeOne((sort: string, _lang: string): FormSchema[] => {
    const l = (key: string) => localize(this.hass, key);
    const sortingFields: FormSchema[] = [
      {
        name: 'sort',
        required: true,
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'manual', label: l('sort_manual') },
              { value: 'status', label: l('sort_status') },
              { value: 'alphabetical', label: l('sort_alphabetical') },
              { value: 'domain', label: l('sort_domain') },
              { value: 'severity', label: l('sort_severity') },
              { value: 'last_changed', label: l('sort_last_changed') },
            ],
          },
        },
      },
    ];
    if (sort !== 'manual') {
      sortingFields.push({
        name: 'sort_direction',
        selector: {
          select: {
            mode: 'list',
            options: [
              { value: 'asc', label: l('sort_asc') },
              { value: 'desc', label: l('sort_desc') },
            ],
          },
        },
      });
    }

    return [
      { name: 'title', selector: { text: {} } },
      {
        name: 'appearance',
        type: 'expandable',
        flatten: true,
        title: l('appearance_section'),
        iconPath: mdiPalette,
        schema: [
          {
            name: '',
            type: 'grid',
            schema: [
              {
                name: 'layout_mode',
                required: true,
                selector: {
                  select: {
                    mode: 'dropdown',
                    options: [
                      { value: 'columns', label: l('layout_col') },
                      { value: 'rows', label: l('layout_row') },
                    ],
                  },
                },
              },
              { name: 'layout_count', required: true, selector: { number: { min: 1, max: 12, step: 1, mode: 'box' } } },
            ],
          },
          {
            name: 'text_mode',
            selector: {
              select: {
                mode: 'list',
                options: [
                  { value: 'clip', label: l('text_mode_clip') },
                  { value: 'scroll', label: l('text_mode_scroll') },
                ],
              },
            },
          },
        ],
      },
      {
        name: 'sorting',
        type: 'expandable',
        flatten: true,
        title: l('sorting_section'),
        iconPath: mdiSort,
        schema: sortingFields,
      },
      {
        name: 'display',
        type: 'expandable',
        flatten: true,
        title: l('display_section'),
        iconPath: mdiEyeOutline,
        schema: [
          {
            name: 'show_ok_section',
            selector: {
              select: {
                mode: 'list',
                options: [
                  { value: 'inline', label: l('show_ok_inline') },
                  { value: 'collapsed', label: l('show_ok_collapsed') },
                  { value: 'hidden', label: l('show_ok_hidden') },
                ],
              },
            },
          },
        ],
      },
    ];
  });

  private _cardChanged = (ev: CustomEvent) => {
    ev.stopPropagation();
    const v = (ev.detail.value || {}) as Record<string, any>;
    const current = this._cardData();
    const updates: Partial<CardConfig> = {};

    if ((v.title ?? '') !== current.title) updates.title = v.title || undefined;

    const mode = v.layout_mode === 'rows' ? 'rows' : 'columns';
    const count = Math.max(1, Math.min(12, Math.round(Number(v.layout_count)) || 1));
    if (mode !== current.layout_mode || count !== current.layout_count) {
      updates.layout = { mode, count };
    }
    if (v.text_mode && v.text_mode !== current.text_mode) updates.text_mode = v.text_mode;
    if (v.sort && v.sort !== current.sort) updates.sort = v.sort;
    if (v.sort_direction && v.sort_direction !== current.sort_direction) updates.sort_direction = v.sort_direction;
    if (v.show_ok_section && v.show_ok_section !== current.show_ok_section) {
      updates.show_ok_section = v.show_ok_section;
    }
    if (Object.keys(updates).length) this._updateConfig(updates);
  };

  // ---- Check-level form ----

  private _checkData(check: CheckRule) {
    return {
      entity: check.entity || '',
      name: check.name || '',
      severity: check.severity || 'info',
      icon: check.icon || '',
      color: check.color || '',
      show_last_changed: !!check.show_last_changed,
      confirmation: !!check.confirmation,
      conditions_mode: check.conditions_mode === 'all' ? 'all' : 'any',
      default_condition_index: String(check.default_condition_index ?? 0),
      tap_action: check.tap_action,
      hold_action: check.hold_action,
      double_tap_action: check.double_tap_action,
    };
  }

  private _checkSchema = memoizeOne(
    (conditionCount: number, mode: string, confirmationIsObject: boolean, _lang: string): FormSchema[] => {
      const l = (key: string) => localize(this.hass, key);
      const schema: FormSchema[] = [
        { name: 'entity', required: true, selector: { entity: {} } },
        { name: 'name', selector: { text: {} } },
      ];

      if (conditionCount > 1) {
        schema.push({
          name: 'conditions_mode',
          selector: {
            select: {
              mode: 'list',
              options: [
                { value: 'any', label: l('cond_any') },
                { value: 'all', label: l('cond_all') },
              ],
            },
          },
        });
        if (mode !== 'all') {
          schema.push({
            name: 'default_condition_index',
            required: true,
            selector: {
              select: {
                mode: 'dropdown',
                options: Array.from({ length: conditionCount }, (_, i) => ({
                  value: String(i),
                  label: localize(this.hass, 'condition_n', { n: i + 1 }),
                })),
              },
            },
          });
        }
      }

      const advanced: FormSchema[] = [
        {
          name: '',
          type: 'grid',
          schema: [
            {
              name: 'severity',
              required: true,
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'info', label: l('severity_info') },
                    { value: 'warning', label: l('severity_warning') },
                    { value: 'critical', label: l('severity_critical') },
                  ],
                },
              },
            },
            { name: 'icon', selector: { icon: {} }, context: { icon_entity: 'entity' } },
          ],
        },
        { name: 'color', selector: { text: {} } },
        { name: 'show_last_changed', selector: { boolean: {} } },
      ];
      // An object confirmation ({ text, exemptions }) is YAML-only; don't let the
      // boolean toggle overwrite it.
      if (!confirmationIsObject) advanced.push({ name: 'confirmation', selector: { boolean: {} } });

      schema.push(
        {
          name: 'advanced',
          type: 'expandable',
          flatten: true,
          title: l('advanced_settings'),
          iconPath: mdiTune,
          schema: advanced,
        },
        {
          name: 'interactions',
          type: 'expandable',
          flatten: true,
          title: l('interactions_section'),
          iconPath: mdiGestureTap,
          schema: [
            { name: 'tap_action', selector: { ui_action: { default_action: 'more-info' } } },
            { name: 'hold_action', selector: { ui_action: {} } },
            { name: 'double_tap_action', selector: { ui_action: {} } },
          ],
        },
      );
      return schema;
    },
  );

  private _checkChanged(ev: CustomEvent, index: number) {
    ev.stopPropagation();
    const check = this._config.checks[index];
    if (!check) return;
    const v = (ev.detail.value || {}) as Record<string, any>;
    const next: Record<string, any> = { ...check };

    for (const field of CHECK_FORM_FIELDS) {
      if (field === 'severity' && v.severity === 'info') delete next.severity;
      else if (field === 'show_last_changed' && !v.show_last_changed) delete next.show_last_changed;
      else if (isEmpty(v[field])) delete next[field];
      else next[field] = v[field];
    }
    next.entity = v.entity || '';

    if (typeof check.confirmation !== 'object') {
      if (v.confirmation) next.confirmation = true;
      else delete next.confirmation;
    }
    if (v.conditions_mode === 'any' || v.conditions_mode === 'all') next.conditions_mode = v.conditions_mode;
    const defaultIdx = parseInt(v.default_condition_index, 10);
    if (Number.isFinite(defaultIdx)) next.default_condition_index = defaultIdx;

    // A different entity has different states/attributes: reset the conditions
    // to the new entity's first state so they don't silently keep stale values.
    if (next.entity !== check.entity) {
      const firstState = this._possibleStates(next.entity)[0] || '';
      next.conditions = (check.conditions || []).map(c => {
        const cond: StateCondition = { ...c, state: firstState };
        delete cond.attribute;
        delete cond.attribute_value;
        return cond;
      });
    }

    this._replaceCheck(index, next as CheckRule);
  }

  // ---- Condition form ----

  private _conditionSchema(
    entity: string,
    attribute: string,
    prereqEntity: string,
    prereqAttribute: string,
  ): FormSchema[] {
    const lang = this.hass?.language || 'en';
    const key = JSON.stringify([entity, attribute, prereqEntity, prereqAttribute, lang]);
    const cached = this._schemaCache.get(key);
    if (cached) return cached;

    const entityId = entity || undefined;
    const prereqId = prereqEntity || undefined;
    const prereqFields: FormSchema[] = [{ name: 'prerequisite_entity', selector: { entity: {} } }];
    if (prereqEntity) {
      prereqFields.push({ name: 'prerequisite_attribute', selector: { attribute: { entity_id: prereqId } } });
      prereqFields.push(prereqAttribute
        ? { name: 'prerequisite_attribute_value', selector: { state: { entity_id: prereqId, attribute: prereqAttribute } } }
        : { name: 'prerequisite_state', selector: { state: { entity_id: prereqId } } });
    }

    const schema: FormSchema[] = [
      { name: 'attribute', selector: { attribute: { entity_id: entityId } } },
      attribute
        ? { name: 'attribute_value', required: true, selector: { state: { entity_id: entityId, attribute } } }
        : { name: 'state', required: true, selector: { state: { entity_id: entityId } } },
      { name: 'fix_service', selector: { text: {} } },
      {
        name: 'prerequisite',
        type: 'expandable',
        flatten: true,
        title: localize(this.hass, 'prereq_section'),
        iconPath: mdiLinkVariant,
        expanded: !!prereqEntity,
        schema: prereqFields,
      },
    ];
    if (this._schemaCache.size > 200) this._schemaCache.clear();
    this._schemaCache.set(key, schema);
    return schema;
  }

  private _conditionData(condition: StateCondition) {
    return {
      state: condition.state ?? '',
      attribute: condition.attribute || '',
      attribute_value: condition.attribute_value || '',
      fix_service: condition.fix_service || '',
      prerequisite_entity: condition.prerequisite_entity || '',
      prerequisite_attribute: condition.prerequisite_attribute || '',
      prerequisite_state: condition.prerequisite_state || '',
      prerequisite_attribute_value: condition.prerequisite_attribute_value || '',
    };
  }

  private _conditionChanged(ev: CustomEvent, checkIndex: number, condIdx: number) {
    ev.stopPropagation();
    const check = this._config.checks[checkIndex];
    const condition = check?.conditions[condIdx];
    if (!check || !condition) return;
    const v = (ev.detail.value || {}) as Record<string, any>;
    const next: Record<string, any> = { ...condition, state: v.state ?? '' };

    for (const field of CONDITION_FORM_FIELDS) {
      if (isEmpty(v[field])) delete next[field];
      else next[field] = String(v[field]);
    }
    if (!next.attribute) delete next.attribute_value;
    if (!next.prerequisite_entity) {
      delete next.prerequisite_attribute;
      delete next.prerequisite_state;
      delete next.prerequisite_attribute_value;
    } else if (next.prerequisite_entity !== condition.prerequisite_entity) {
      delete next.prerequisite_attribute;
      delete next.prerequisite_attribute_value;
    }
    if (!next.prerequisite_attribute) delete next.prerequisite_attribute_value;

    const conditions = check.conditions.map((c, j) => (j === condIdx ? next as StateCondition : c));
    this._replaceCheck(checkIndex, { ...check, conditions });
  }

  private _possibleStates(entityId: string): string[] {
    const stateObj = entityId ? this.hass?.states[entityId] : undefined;
    if (!stateObj) return ['on', 'off'];
    const attrs = stateObj.attributes || {};
    for (const key of ['options', 'hvac_modes', 'operation_list']) {
      if (Array.isArray(attrs[key]) && attrs[key].length) return attrs[key].map(String);
    }
    return [stateObj.state];
  }

  // ---- Labels / helpers ----

  private _computeLabel = (schema: { name: string }): string => {
    const layout = this._config?.layout || { mode: 'columns', count: 1 };
    const map: Record<string, string> = {
      title: 'editor_title',
      layout_mode: 'layout_dir',
      layout_count: layout.mode === 'rows' ? 'max_items_row' : 'max_items_col',
      text_mode: 'text_mode_label',
      sort: 'sort_mode',
      sort_direction: 'sort_direction',
      show_ok_section: 'show_ok_section',
      entity: 'select_entity',
      name: 'display_name',
      severity: 'severity',
      icon: 'icon_override',
      color: 'color_override',
      show_last_changed: 'show_last_changed',
      confirmation: 'confirmation',
      conditions_mode: 'check_condition',
      default_condition_index: 'default_fix',
      tap_action: 'tap_action',
      hold_action: 'hold_action',
      double_tap_action: 'double_tap_action',
      state: 'ok_state',
      attribute: 'attr_check',
      attribute_value: 'attr_val',
      fix_service: 'custom_fix',
      prerequisite_entity: 'prereq_entity',
      prerequisite_attribute: 'attr_check',
      prerequisite_state: 'prereq_state',
      prerequisite_attribute_value: 'attr_val',
    };
    const key = map[schema.name];
    return key ? localize(this.hass, key) : schema.name;
  };

  private _computeHelper = (schema: { name: string }): string | undefined => {
    const layout = this._config?.layout || { mode: 'columns', count: 1 };
    const map: Record<string, string> = {
      layout_mode: 'layout_dir_helper',
      layout_count: layout.mode === 'rows' ? 'count_helper_row' : 'count_helper_col',
      text_mode: 'text_mode_helper',
      show_ok_section: 'show_ok_helper',
      name: 'display_name_helper',
      severity: 'severity_helper',
      color: 'color_helper',
      default_condition_index: 'default_fix_helper',
      hold_action: 'hold_action_helper',
      double_tap_action: 'double_tap_action_helper',
      state: 'ok_state_helper',
      fix_service: 'custom_fix_hint',
      prerequisite_state: 'prereq_hint',
      prerequisite_attribute_value: 'prereq_hint',
    };
    const key = map[schema.name];
    return key ? localize(this.hass, key) : undefined;
  };

  // ---- Rendering ----

  render() {
    if (!this.hass || !this._config) return nothing;

    // The card's static getConfigElement() preloads HA pickers before the editor
    // mounts, so this branch is normally skipped. It remains as a safety net for
    // edge cases (e.g. the editor element being constructed directly).
    if (!this._pickersReady) {
      if (customElements.get('ha-form') && customElements.get('ha-entity-picker')) {
        this._pickersReady = true;
      } else {
        if (!this._pickerLoadStarted) {
          this._pickerLoadStarted = true;
          preloadEditorComponents().finally(() => { this._pickersReady = true; });
        }
        return html`<div class="loading">${localize(this.hass, 'loading')}</div>`;
      }
    }

    const lang = this.hass.language || 'en';
    const checks = this._config.checks || [];

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._cardData()}
        .schema=${this._cardSchema(this._config.sort || 'manual', lang)}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._cardChanged}
      ></ha-form>

      <h3 class="section-title">${localize(this.hass, 'entities_section')}</h3>
      ${this._renderChecksSection(checks)}
    `;
  }

  private _renderChecksSection(checks: CheckRule[]) {
    if (checks.length === 0) {
      return html`
        <div class="empty-state">
          <p>${localize(this.hass, 'no_checks_yet')}</p>
          <ha-button appearance="filled" @click=${this._handleAddCheck}>
            <ha-svg-icon slot="start" .path=${mdiPlus}></ha-svg-icon>
            ${localize(this.hass, this._hasClipboard ? 'paste_check' : 'add_check')}
          </ha-button>
        </div>
      `;
    }

    const selected = Math.min(this._selectedCheck, checks.length - 1);
    const current = checks[selected];

    return html`
      <div class="card-config">
        <div class="toolbar">
          <ha-tab-group @wa-tab-show=${this._handleSelectedCheck}>
            ${checks.map((c, i) => html`
              <ha-tab-group-tab
                slot="nav"
                .panel=${i}
                .active=${i === selected}
                class=${this._isCheckValid(c) ? '' : 'invalid'}
              >${i + 1}</ha-tab-group-tab>
            `)}
          </ha-tab-group>
          <ha-icon-button
            .label=${localize(this.hass, this._hasClipboard ? 'paste_check' : 'add_check')}
            .path=${mdiPlus}
            @click=${this._handleAddCheck}
          ></ha-icon-button>
        </div>

        <div id="editor">
          <div id="card-options">
            <ha-icon-button
              class="gui-mode-button"
              .label=${localize(this.hass, this._yamlMode ? 'show_visual_editor' : 'show_code_editor')}
              .path=${this._yamlMode ? mdiListBoxOutline : mdiCodeBraces}
              @click=${this._toggleYamlMode}
            ></ha-icon-button>
            <ha-icon-button-arrow-prev
              .disabled=${selected === 0}
              .label=${localize(this.hass, 'move_before')}
              .move=${-1}
              @click=${this._handleMoveCheck}
            ></ha-icon-button-arrow-prev>
            <ha-icon-button-arrow-next
              .disabled=${selected === checks.length - 1}
              .label=${localize(this.hass, 'move_after')}
              .move=${1}
              @click=${this._handleMoveCheck}
            ></ha-icon-button-arrow-next>
            <ha-icon-button
              .label=${localize(this.hass, 'duplicate')}
              .path=${mdiContentCopy}
              @click=${this._handleDuplicateCheck}
            ></ha-icon-button>
            <ha-icon-button
              .label=${localize(this.hass, 'cut_check')}
              .path=${mdiContentCut}
              @click=${this._handleCutCheck}
            ></ha-icon-button>
            <ha-icon-button
              class="delete-btn"
              .label=${localize(this.hass, 'remove')}
              .path=${mdiDelete}
              @click=${this._handleDeleteSelectedCheck}
            ></ha-icon-button>
          </div>
          ${this._yamlMode ? this._renderYamlEditor(current, selected) : this._renderCheckEditor(current, selected)}
        </div>
      </div>
    `;
  }

  private _renderYamlEditor(check: CheckRule, index: number) {
    return html`
      <div class="yaml-editor">
        ${this._useHaYamlEditor
          ? html`
              <ha-yaml-editor
                .hass=${this.hass}
                .defaultValue=${check}
                @value-changed=${this._handleHaYamlChange}
              ></ha-yaml-editor>
            `
          : html`
              <textarea
                spellcheck="false"
                .value=${JSON.stringify(check, null, 2)}
                @input=${(e: Event) => this._handleYamlInput(e, index)}
              ></textarea>
              <div class="hint">${localize(this.hass, 'yaml_hint_json')}</div>
            `}
        ${this._yamlError ? html`<div class="yaml-error">${this._yamlError}</div>` : nothing}
      </div>
    `;
  }

  private _renderCheckEditor(check: CheckRule, index: number) {
    const conditions = check.conditions || [];
    const isMulti = conditions.length > 1;
    const lang = this.hass.language || 'en';

    return html`
      <div class="check-editor-content">
        <ha-form
          .hass=${this.hass}
          .data=${this._checkData(check)}
          .schema=${this._checkSchema(
            conditions.length,
            check.conditions_mode === 'all' ? 'all' : 'any',
            typeof check.confirmation === 'object',
            lang,
          )}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${(e: CustomEvent) => this._checkChanged(e, index)}
        ></ha-form>

        <div class="conditions">
          ${conditions.map((condition, condIdx) => html`
            <div class="condition-item">
              <div class="condition-header">
                <span class="condition-title">
                  ${isMulti
                    ? localize(this.hass, 'condition_n', { n: condIdx + 1 })
                    : localize(this.hass, 'condition_single')}
                </span>
                ${isMulti ? html`
                  <ha-icon-button
                    class="delete-btn"
                    .label=${localize(this.hass, 'remove_state')}
                    .path=${mdiDelete}
                    @click=${() => this._removeCondition(index, condIdx)}
                  ></ha-icon-button>
                ` : nothing}
              </div>
              <ha-form
                .hass=${this.hass}
                .data=${this._conditionData(condition)}
                .schema=${this._conditionSchema(
                  check.entity,
                  condition.attribute || '',
                  condition.prerequisite_entity || '',
                  condition.prerequisite_attribute || '',
                )}
                .computeLabel=${this._computeLabel}
                .computeHelper=${this._computeHelper}
                @value-changed=${(e: CustomEvent) => this._conditionChanged(e, index, condIdx)}
              ></ha-form>
            </div>
          `)}

          <ha-button appearance="plain" @click=${() => this._addCondition(index)}>
            <ha-svg-icon slot="start" .path=${mdiPlus}></ha-svg-icon>
            ${localize(this.hass, 'add_state')}
          </ha-button>
        </div>
      </div>
    `;
  }
}
