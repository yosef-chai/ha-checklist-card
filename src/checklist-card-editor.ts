import { LitElement, html } from 'lit';
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
} from '@mdi/js';

import { editorStyles } from './checklist-card-editor.styles';
import { localize } from './localize';
import { preloadEditorComponents } from './preload-editor';
import { ensureCheckId, makeEmptyCondition } from './utils';
import type { HomeAssistant, CardConfig, CheckRule, StateCondition, LayoutConfig } from './types';

/**
 * Visual configuration editor for {@link ChecklistCard}, rendered inside the
 * Home Assistant card editor panel.
 *
 * @element checklist-card-editor
 * @fires config-changed - Dispatched with the updated {@link CardConfig} on every field change.
 */
@customElement('checklist-card-editor')
export class ChecklistCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: CardConfig;
  @state() private _selectedCheck = 0;
  @state() private _useHaTabs = false;
  @state() private _useHaYamlEditor = false;
  @state() private _pickersReady = false;
  @state() private _yamlMode = false;
  @state() private _hasClipboard = false;
  @state() private _yamlError: string | null = null;
  private _pickerLoadStarted = false;
  private _yamlDebounceTimer: number | null = null;
  private _onStorageEvent = (ev: StorageEvent) => {
    if (ev.key === ChecklistCardEditor.CLIPBOARD_KEY) {
      this._hasClipboard = !!this._readClipboard();
    }
  };

  private static readonly CLIPBOARD_KEY = 'checklistCardCheckClipboard';

  protected firstUpdated() {
    this._useHaTabs =
      !!customElements.get('ha-tab-group') &&
      !!customElements.get('ha-tab-group-tab');
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

  static styles = editorStyles;

  setConfig(config: CardConfig) {
    this._config = {
      ...config,
      checks: config.checks ? config.checks.map(ensureCheckId) : [],
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

  private _updateConfig(updates: Partial<CardConfig>) {
    this._config = { ...this._config, ...updates };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  private _updateCheck(index: number, field: keyof CheckRule, value: any) {
    const checks = this._config.checks.map((check, i) =>
      i === index ? { ...check, [field]: value } : check
    );
    this._updateConfig({ checks });
  }

  private async _updateCondition(
    checkIndex: number,
    condIdx: number,
    field: keyof StateCondition,
    value: string,
    el?: any
  ) {
    const checks = this._config.checks.map((check, i) => {
      if (i !== checkIndex) return check;
      const conditions = check.conditions.map((cond, j) =>
        j === condIdx ? { ...cond, [field]: value } : cond
      );
      return { ...check, conditions };
    });
    this._updateConfig({ checks });

    if (el) {
      await this.updateComplete;
      el.value = value;
    }
  }

  private _addCondition(checkIndex: number) {
    const checks = this._config.checks.map((check, i) => {
      if (i !== checkIndex) return check;
      const baseState = check.conditions[0]?.state || 'off';
      const newCondition: StateCondition = { ...makeEmptyCondition(), state: baseState };
      return { ...check, conditions: [...check.conditions, newCondition] };
    });
    this._updateConfig({ checks });
  }

  private _removeCondition(checkIndex: number, condIdx: number) {
    const checks = this._config.checks.map((check, i) => {
      if (i !== checkIndex) return check;
      const conditions = check.conditions.filter((_, j) => j !== condIdx);
      let defaultIdx = check.default_condition_index;
      if (defaultIdx >= conditions.length) defaultIdx = 0;
      return { ...check, conditions, default_condition_index: defaultIdx };
    });
    this._updateConfig({ checks });
  }

  private _setDefaultCondition(checkIndex: number, condIdx: number) {
    const checks = this._config.checks.map((check, i) =>
      i === checkIndex ? { ...check, default_condition_index: condIdx } : check
    );
    this._updateConfig({ checks });
  }

  private _setConditionsMode(checkIndex: number, mode: 'any' | 'all') {
    const checks = this._config.checks.map((check, i) =>
      i === checkIndex ? { ...check, conditions_mode: mode } : check
    );
    this._updateConfig({ checks });
  }

  private _entityChanged(index: number, entityId: string) {
    const checks = this._config.checks.map((check, i) => {
      if (i !== index) return check;
      const newCheck = { ...check, entity: entityId || '' };
      if (entityId && this.hass.states[entityId] && !newCheck.name) {
        newCheck.name = this.hass.states[entityId].attributes.friendly_name || entityId;
      }
      const firstState = this._getPossibleStates(entityId)[0] || '';
      newCheck.conditions = (check.conditions || []).map(c => ({
        ...c,
        state: firstState,
        attribute: '',
        attribute_value: '',
      }));
      return newCheck;
    });
    this._updateConfig({ checks });
  }

  private _addCheck() {
    const checks = [
      ...(this._config.checks || []),
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        entity: '',
        name: '',
        conditions: [makeEmptyCondition()],
        conditions_mode: 'any' as const,
        default_condition_index: 0,
        severity: 'info' as const,
      },
    ];
    this._updateConfig({ checks });
  }

  private _removeCheck(index: number) {
    const checks = this._config.checks.filter((_, i) => i !== index);
    this._updateConfig({ checks });
  }

  private _handleSelectedCheck = (ev: CustomEvent) => {
    const detail = ev.detail as { name?: string | number; index?: number } | undefined;
    const raw = detail?.name !== undefined ? detail.name : detail?.index;
    const idx = typeof raw === 'string' ? parseInt(raw, 10) : raw;
    if (typeof idx === 'number' && Number.isFinite(idx)) {
      this._selectedCheck = idx;
    }
  };

  private _handleAddCheck = () => {
    const clip = this._readClipboard();
    if (clip) {
      const pasted: CheckRule = {
        ...JSON.parse(JSON.stringify(clip)),
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
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
    this._removeCheck(this._selectedCheck);
    this._selectedCheck = Math.max(0, Math.min(this._selectedCheck, total - 2));
  };

  private _handleCutCheck = () => {
    const source = this._config.checks?.[this._selectedCheck];
    if (!source) return;
    this._writeClipboard(source);
    this._handleDeleteSelectedCheck();
  };

  private _toggleYamlMode = () => {
    this._yamlMode = !this._yamlMode;
    this._yamlError = null;
  };

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
    const next: CheckRule = {
      ...(obj as CheckRule),
      id: obj.id || current.id,
    };
    const checks = [...this._config.checks];
    checks[index] = next;
    this._updateConfig({ checks });
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
        const parsed = JSON.parse(value);
        const err = this._applyParsedCheck(parsed, index);
        this._yamlError = err;
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
    const err = this._applyParsedCheck(detail.value, this._selectedCheck);
    this._yamlError = err;
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
    const copy: CheckRule = {
      ...JSON.parse(JSON.stringify(source)),
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
    const target = this._selectedCheck + 1;
    const checks = [...this._config.checks];
    checks.splice(target, 0, copy);
    this._selectedCheck = target;
    this._updateConfig({ checks });
  };

  private _isCheckValid(check: CheckRule | undefined): boolean {
    if (!check) return false;
    if (!check.entity || !check.entity.trim()) return false;
    if (!Array.isArray(check.conditions) || check.conditions.length === 0) return false;
    return true;
  }

  private _updateLayout(updates: Partial<LayoutConfig>) {
    const current = this._config.layout || { mode: 'columns', count: 1 };
    this._updateConfig({ layout: { ...current, ...updates } });
  }

  // ---- Layout / Sorting / Display panels (HA ha-form schemas) ----
  //
  // Schema field names are flat (`layout_mode`, `layout_count`) rather than
  // nested under `layout.*`. This keeps `computeLabel`/`computeHelper` simple:
  // each name maps unambiguously to a localize key, and conditional labels
  // (e.g. `count_helper_col` vs `count_helper_row`) read the *current*
  // `_config.layout.mode` from the live config rather than from the schema —
  // see `_computeLabel`/`_computeHelper` below.

  private _appearanceData() {
    const layout = this._config.layout || { mode: 'columns', count: 1 };
    return {
      layout_mode: layout.mode === 'rows' ? 'rows' : 'columns',
      layout_count: layout.count || 1,
      text_mode: this._config.text_mode || 'clip',
    };
  }

  private _sortingData() {
    return {
      sort: this._config.sort || 'manual',
      sort_direction: this._config.sort_direction || 'asc',
    };
  }

  private _displayData() {
    return {
      show_ok_section: this._config.show_ok_section || 'inline',
    };
  }

  // Schemas memoized on the inputs that actually change them (language for
  // localized option labels; `sort` for conditional sort_direction field).
  private _appearanceSchema = memoizeOne((_lang: string) => [
    {
      name: '',
      type: 'grid',
      schema: [
        {
          name: 'layout_mode',
          selector: {
            select: {
              mode: 'list',
              options: [
                { value: 'columns', label: localize(this.hass, 'layout_col') },
                { value: 'rows', label: localize(this.hass, 'layout_row') },
              ],
            },
          },
        },
        {
          name: 'layout_count',
          selector: { number: { min: 1, max: 12, step: 1, mode: 'box' } },
        },
      ],
    },
    {
      name: 'text_mode',
      selector: {
        select: {
          mode: 'box',
          options: [
            { value: 'clip', label: localize(this.hass, 'text_mode_clip') },
            { value: 'scroll', label: localize(this.hass, 'text_mode_scroll') },
          ],
        },
      },
    },
  ]);

  private _sortingSchema = memoizeOne((sort: string, _lang: string) => {
    const sortField = {
      name: 'sort',
      selector: {
        select: {
          mode: 'dropdown',
          options: [
            { value: 'manual', label: localize(this.hass, 'sort_manual') },
            { value: 'status', label: localize(this.hass, 'sort_status') },
            { value: 'alphabetical', label: localize(this.hass, 'sort_alphabetical') },
            { value: 'domain', label: localize(this.hass, 'sort_domain') },
            { value: 'severity', label: localize(this.hass, 'sort_severity') },
            { value: 'last_changed', label: localize(this.hass, 'sort_last_changed') },
          ],
        },
      },
    };
    if (sort === 'manual') return [sortField];
    return [
      sortField,
      {
        name: 'sort_direction',
        selector: {
          select: {
            mode: 'list',
            options: [
              { value: 'asc', label: localize(this.hass, 'sort_asc') },
              { value: 'desc', label: localize(this.hass, 'sort_desc') },
            ],
          },
        },
      },
    ];
  });

  private _displaySchema = memoizeOne((_lang: string) => [
    {
      name: 'show_ok_section',
      selector: {
        select: {
          mode: 'list',
          options: [
            { value: 'inline', label: localize(this.hass, 'show_ok_inline') },
            { value: 'collapsed', label: localize(this.hass, 'show_ok_collapsed') },
            { value: 'hidden', label: localize(this.hass, 'show_ok_hidden') },
          ],
        },
      },
    },
  ]);

  // computeLabel/Helper read live config (not just schema.name) so that
  // labels like "Number of columns" vs "Items per column" track the current
  // `layout.mode` even though the schema field name is the same.
  private _computeLabel = (schema: { name: string }): string => {
    const layout = this._config?.layout || { mode: 'columns', count: 1 };
    const map: Record<string, string> = {
      layout_mode: 'layout_dir',
      layout_count: layout.mode === 'rows' ? 'max_items_row' : 'max_items_col',
      text_mode: 'text_mode_label',
      sort: 'sort_mode',
      sort_direction: 'sort_direction',
      show_ok_section: 'show_ok_section',
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
    };
    const key = map[schema.name];
    return key ? localize(this.hass, key) : undefined;
  };

  private _appearanceChanged = (ev: CustomEvent) => {
    ev.stopPropagation();
    const v = ev.detail.value || {};
    const layout = this._config.layout || { mode: 'columns', count: 1 };
    const updates: Partial<CardConfig> = {};
    const newCount = Math.max(1, Math.min(12, Number(v.layout_count) || 1));
    if (v.layout_mode !== layout.mode || newCount !== layout.count) {
      updates.layout = { mode: v.layout_mode === 'rows' ? 'rows' : 'columns', count: newCount };
    }
    if (v.text_mode && v.text_mode !== (this._config.text_mode || 'clip')) {
      updates.text_mode = v.text_mode;
    }
    if (Object.keys(updates).length) this._updateConfig(updates);
  };

  private _sortingChanged = (ev: CustomEvent) => {
    ev.stopPropagation();
    const v = ev.detail.value || {};
    const updates: Partial<CardConfig> = {};
    if (v.sort && v.sort !== (this._config.sort || 'manual')) updates.sort = v.sort;
    if (v.sort_direction && v.sort_direction !== (this._config.sort_direction || 'asc')) {
      updates.sort_direction = v.sort_direction;
    }
    if (Object.keys(updates).length) this._updateConfig(updates);
  };

  private _displayChanged = (ev: CustomEvent) => {
    ev.stopPropagation();
    const v = ev.detail.value || {};
    if (v.show_ok_section && v.show_ok_section !== (this._config.show_ok_section || 'inline')) {
      this._updateConfig({ show_ok_section: v.show_ok_section });
    }
  };

  private _getPossibleStates(entityId: string): string[] {
    if (!entityId || !this.hass?.states[entityId]) {
      return ['on', 'off', 'unavailable', 'unknown'];
    }

    const stateObj = this.hass.states[entityId];
    const domain = entityId.split('.')[0];
    const attrs = stateObj.attributes || {};
    let states: string[] = [];

    if (Array.isArray(attrs.options)) states = [...attrs.options];
    else if (Array.isArray(attrs.hvac_modes)) states = [...attrs.hvac_modes];
    else if (Array.isArray(attrs.operation_list)) states = [...attrs.operation_list];
    else if (Array.isArray(attrs.state_list)) states = [...attrs.state_list];
    else {
      switch (domain) {
        case 'alarm_control_panel': states = ['disarmed', 'armed_home', 'armed_away', 'armed_night', 'pending', 'triggered']; break;
        case 'binary_sensor': case 'input_boolean': case 'switch': case 'light': case 'fan': case 'remote': case 'siren': case 'humidifier': case 'calendar': states = ['on', 'off']; break;
        case 'button': case 'scene': states = ['unknown']; break;
        case 'camera': states = ['idle', 'recording', 'streaming']; break;
        case 'climate': states = ['off', 'heat', 'cool', 'auto', 'dry', 'fan_only', 'heat_cool']; break;
        case 'cover': case 'valve': states = ['open', 'closed', 'opening', 'closing']; break;
        case 'device_tracker': case 'person': states = ['home', 'not_home']; break;
        case 'lawn_mower': states = ['mowing', 'docked', 'paused', 'error']; break;
        case 'lock': states = ['locked', 'unlocked', 'jammed']; break;
        case 'media_player': states = ['playing', 'paused', 'idle', 'standby', 'on', 'off']; break;
        case 'number': case 'input_number': states = [String(attrs.min || '0'), String(attrs.max || '100')]; break;
        case 'vacuum': states = ['cleaning', 'docked', 'idle', 'returning', 'paused', 'error']; break;
        case 'water_heater': states = ['off', 'eco', 'electric', 'gas', 'heat_pump']; break;
        case 'input_text': case 'text': states = []; break;
        default:
          for (const key of Object.keys(attrs)) {
            if (Array.isArray(attrs[key]) && (key.endsWith('_modes') || key.endsWith('_list') || key.endsWith('_options') || key === 'options')) {
              states = attrs[key].map(String);
              break;
            }
          }
          if (states.length === 0) states = ['on', 'off'];
      }
    }

    const current = stateObj.state;
    if (current && !states.includes(current)) states.unshift(current);
    if (!states.includes('unavailable')) states.push('unavailable');
    if (!states.includes('unknown')) states.push('unknown');

    return [...new Set(states)];
  }

  private _getPossibleAttributeValues(entityId: string, attribute: string): string[] {
    if (!entityId || !attribute || !this.hass?.states[entityId]) return ['true', 'false', 'on', 'off'];

    const stateObj = this.hass.states[entityId];
    const attrs = stateObj.attributes || {};

    const candidates = [
      attribute.endsWith('s') ? attribute : `${attribute}s`,
      `${attribute}_list`,
      `${attribute}_options`,
    ];
    for (const key of candidates) {
      if (Array.isArray(attrs[key])) return [...new Set(attrs[key].map(String))];
    }

    if (Array.isArray(attrs[attribute])) return [...new Set(attrs[attribute].map(String))];

    const attrLower = attribute.toLowerCase();
    if (attrLower === 'brightness' || attrLower === 'brightness_pct') return Array.from({ length: 11 }, (_, i) => String(i * 10));
    if (attrLower === 'color_temp' || attrLower === 'color_temp_kelvin') return Array.from({ length: 35 }, (_, i) => String(153 + i * 10));
    if (typeof attrs[attribute] === 'boolean') return ['true', 'false'];
    
    if (typeof attrs[attribute] === 'number') {
      const cur = attrs[attribute] as number;
      const min = typeof attrs.min === 'number' ? attrs.min : 0;
      const max = typeof attrs.max === 'number' ? attrs.max : 100;
      const step = (max - min) / 10;
      const range = Array.from({ length: 11 }, (_, i) => String(Math.round(min + i * step)));
      if (!range.includes(String(cur))) range.unshift(String(cur));
      return [...new Set(range)];
    }

    const current = attrs[attribute];
    if (current !== undefined && current !== null) return [String(current)];

    return [];
  }

  private _getPossibleAttributes(entityId: string): string[] {
    if (!entityId || !this.hass?.states[entityId]?.attributes) return [];
    return Object.keys(this.hass.states[entityId].attributes).sort();
  }

  render() {
    if (!this.hass || !this._config) return html``;

    // The card's static getConfigElement() preloads HA pickers before the editor
    // mounts, so this branch is normally skipped. It remains as a safety net for
    // edge cases (e.g. the editor element being constructed directly) where the
    // preload hasn't completed by the time render() runs.
    if (!this._pickersReady) {
      const ready = !!customElements.get('ha-form') && !!customElements.get('ha-entity-picker');
      if (ready) {
        this._pickersReady = true;
      } else {
        if (!this._pickerLoadStarted) {
          this._pickerLoadStarted = true;
          preloadEditorComponents().finally(() => { this._pickersReady = true; });
        }
        return html`
          <div style="padding: 32px; text-align: center; color: var(--secondary-text-color);">
            <ha-circular-progress indeterminate></ha-circular-progress>
            <div style="margin-top: 16px;">${localize(this.hass, 'loading')}</div>
          </div>
        `;
      }
    }

    const checks = this._config.checks || [];

    return html`
      <div class="config-container" dir=${this.hass?.translationMetadata?.dir || (this.hass?.language === 'he' ? 'rtl' : 'ltr')}>
        <ha-textfield
          label=${localize(this.hass, 'editor_title')}
          .value=${this._config.title || ''}
          @input=${(e: Event) => this._updateConfig({ title: (e.target as HTMLInputElement).value })}
        ></ha-textfield>

        <div class="panels">
          <ha-expansion-panel outlined expanded>
            <ha-svg-icon slot="leading-icon" .path=${mdiPalette}></ha-svg-icon>
            <h3 slot="header">${localize(this.hass, 'appearance_section')}</h3>
            <div class="panel-content">
              <ha-form
                .hass=${this.hass}
                .data=${this._appearanceData()}
                .schema=${this._appearanceSchema(this.hass?.language || 'en')}
                .computeLabel=${this._computeLabel}
                .computeHelper=${this._computeHelper}
                @value-changed=${this._appearanceChanged}
              ></ha-form>
            </div>
          </ha-expansion-panel>

          <ha-expansion-panel outlined>
            <ha-svg-icon slot="leading-icon" .path=${mdiSort}></ha-svg-icon>
            <h3 slot="header">${localize(this.hass, 'sorting_section')}</h3>
            <div class="panel-content">
              <ha-form
                .hass=${this.hass}
                .data=${this._sortingData()}
                .schema=${this._sortingSchema(this._config.sort || 'manual', this.hass?.language || 'en')}
                .computeLabel=${this._computeLabel}
                .computeHelper=${this._computeHelper}
                @value-changed=${this._sortingChanged}
              ></ha-form>
            </div>
          </ha-expansion-panel>

          <ha-expansion-panel outlined>
            <ha-svg-icon slot="leading-icon" .path=${mdiEyeOutline}></ha-svg-icon>
            <h3 slot="header">${localize(this.hass, 'display_section')}</h3>
            <div class="panel-content">
              <ha-form
                .hass=${this.hass}
                .data=${this._displayData()}
                .schema=${this._displaySchema(this.hass?.language || 'en')}
                .computeLabel=${this._computeLabel}
                .computeHelper=${this._computeHelper}
                @value-changed=${this._displayChanged}
              ></ha-form>
            </div>
          </ha-expansion-panel>
        </div>

        <div class="divider"></div>
        <h3 class="section-title">${localize(this.hass, 'entities_section')}</h3>

        ${this._renderChecksSection(checks)}
      </div>
    `;
  }

  private _renderChecksSection(checks: CheckRule[]) {
    if (checks.length === 0) {
      return html`
        <div class="empty-state">${localize(this.hass, 'no_checks_yet')}</div>
        <ha-button class="add-btn" outlined @click=${this._handleAddCheck}>
          <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
          ${localize(this.hass, 'add_check')}
        </ha-button>
      `;
    }

    // Clamp _selectedCheck defensively (e.g. after external config replace).
    const selected = Math.min(this._selectedCheck, checks.length - 1);
    const current = checks[selected];

    return html`
      <div class="check-toolbar">
        ${this._useHaTabs
          ? html`
              <ha-tab-group @wa-tab-show=${this._handleSelectedCheck}>
                ${checks.map(
                  (c, i) => html`
                    <ha-tab-group-tab
                      slot="nav"
                      .panel=${i}
                      .active=${i === selected}
                      class=${this._isCheckValid(c) ? '' : 'invalid'}
                    >${i + 1}</ha-tab-group-tab>
                  `,
                )}
              </ha-tab-group>
            `
          : html`
              <mwc-tab-bar
                .activeIndex=${selected}
                @MDCTabBar:activated=${this._handleSelectedCheck}
              >
                ${checks.map(
                  (c, i) => html`
                    <mwc-tab
                      .label=${String(i + 1)}
                      class=${this._isCheckValid(c) ? '' : 'invalid'}
                    ></mwc-tab>
                  `,
                )}
              </mwc-tab-bar>
            `}
        <ha-icon-button
          .label=${this._hasClipboard
            ? localize(this.hass, 'paste_check')
            : localize(this.hass, 'add_check')}
          .path=${mdiPlus}
          @click=${this._handleAddCheck}
        ></ha-icon-button>
      </div>

      <div class="check-editor">
        <div class="check-options">
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
        ${this._yamlMode
          ? html`
              <div class="yaml-editor">
                ${this._useHaYamlEditor
                  ? html`
                      <ha-yaml-editor
                        .hass=${this.hass}
                        .defaultValue=${current}
                        @value-changed=${this._handleHaYamlChange}
                      ></ha-yaml-editor>
                    `
                  : html`
                      <textarea
                        spellcheck="false"
                        .value=${JSON.stringify(current, null, 2)}
                        @input=${(e: Event) => this._handleYamlInput(e, selected)}
                      ></textarea>
                      <div class="yaml-hint">${localize(this.hass, 'yaml_hint_json')}</div>
                    `}
                ${this._yamlError ? html`<div class="yaml-error">${this._yamlError}</div>` : ''}
              </div>
            `
          : this._renderCheckEditor(current, selected)}
      </div>
    `;
  }

  private _renderCheckEditor(check: CheckRule, index: number) {
    const conditions = check.conditions || [];
    const isMulti = conditions.length > 1;

    return html`
      <div class="check-editor-content">
        <ha-entity-picker
          label=${localize(this.hass, 'select_entity')}
          .hass=${this.hass}
          .value=${check.entity}
          allow-custom-entity
          @value-changed=${(e: CustomEvent) => this._entityChanged(index, e.detail.value)}
        ></ha-entity-picker>

        <ha-textfield
          label=${localize(this.hass, 'display_name')}
          .value=${check.name || ''}
          @input=${(e: Event) => this._updateCheck(index, 'name', (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <details class="advanced-block">
          <summary class="advanced-summary">${localize(this.hass, 'advanced_settings')}</summary>
          <div class="advanced-content">
            <div class="select-wrapper">
              <label>${localize(this.hass, 'severity')}</label>
              <select
                .value=${check.severity || 'info'}
                @change=${(e: Event) => this._updateCheck(index, 'severity', (e.target as HTMLSelectElement).value)}
              >
                <option value="info" ?selected=${check.severity === 'info' || !check.severity}>${localize(this.hass, 'severity_info')}</option>
                <option value="warning" ?selected=${check.severity === 'warning'}>${localize(this.hass, 'severity_warning')}</option>
                <option value="critical" ?selected=${check.severity === 'critical'}>${localize(this.hass, 'severity_critical')}</option>
              </select>
            </div>
            <ha-icon-picker
              .hass=${this.hass}
              .label=${localize(this.hass, 'icon_override')}
              .value=${check.icon || ''}
              @value-changed=${(e: CustomEvent) => this._updateCheck(index, 'icon', e.detail.value)}
            ></ha-icon-picker>
            <ha-textfield
              label=${localize(this.hass, 'color_override')}
              .value=${check.color || ''}
              @input=${(e: Event) => this._updateCheck(index, 'color', (e.target as HTMLInputElement).value)}
            ></ha-textfield>
          </div>
        </details>

        ${isMulti ? html`
          <div class="select-wrapper">
            <label>${localize(this.hass, 'check_condition')}</label>
            <select
              .value=${check.conditions_mode === 'all' ? 'all' : 'any'}
              @change=${(e: Event) => this._setConditionsMode(index, (e.target as HTMLSelectElement).value as 'any' | 'all')}
            >
              <option value="any" ?selected=${check.conditions_mode !== 'all'}>${localize(this.hass, 'cond_any')}</option>
              <option value="all" ?selected=${check.conditions_mode === 'all'}>${localize(this.hass, 'cond_all')}</option>
            </select>
          </div>
        ` : ''}

        <div class="conditions-section">
          ${conditions.map((condition, condIdx) => html`
            <div class="condition-item">
              <div class="condition-header">
                <span class="condition-title">
                  ${isMulti ? `${localize(this.hass, 'ok_state')} ${condIdx + 1}` : localize(this.hass, 'ok_state')}
                </span>
                <div class="condition-actions">
                  ${isMulti && check.conditions_mode !== 'all' ? html`
                    <ha-formfield label=${check.default_condition_index === condIdx ? localize(this.hass, 'default_fix_star') : localize(this.hass, 'default_fix')}>
                      <ha-radio
                        name="default_${check.id}"
                        .checked=${check.default_condition_index === condIdx}
                        @change=${() => this._setDefaultCondition(index, condIdx)}
                      ></ha-radio>
                    </ha-formfield>
                  ` : ''}
                  ${isMulti ? html`
                    <ha-button @click=${() => this._removeCondition(index, condIdx)} style="--mdc-theme-primary: var(--error-color);">
                      ${localize(this.hass, 'remove_state')}
                    </ha-button>
                  ` : ''}
                </div>
              </div>

              <div class="select-wrapper">
                <label>${localize(this.hass, 'attr_check')}</label>
                <select
                  .value=${condition.attribute || ''}
                  @change=${(e: Event) => this._updateCondition(index, condIdx, 'attribute', (e.target as HTMLSelectElement).value, e.target)}
                >
                  <option value="" ?selected=${!condition.attribute}>${localize(this.hass, 'no_attr')}</option>
                  ${this._getPossibleAttributes(check.entity).map(attr => html`
                    <option value=${attr} ?selected=${condition.attribute === attr}>${attr}</option>
                  `)}
                </select>
              </div>

              ${condition.attribute && condition.attribute.trim() !== '' ? html`
                <div class="select-wrapper">
                  <label>${localize(this.hass, 'attr_val')}</label>
                  <select
                    .value=${condition.attribute_value || ''}
                    @change=${(e: Event) => this._updateCondition(index, condIdx, 'attribute_value', (e.target as HTMLSelectElement).value, e.target)}
                  >
                    ${[...new Set([
                      ...(condition.attribute_value ? [condition.attribute_value] : []),
                      ...this._getPossibleAttributeValues(check.entity, condition.attribute),
                    ])].map(val => html`
                      <option value=${val} ?selected=${condition.attribute_value === val}>${val}</option>
                    `)}
                  </select>
                </div>
              ` : html`
                <div class="select-wrapper">
                  <label>${localize(this.hass, 'ok_state')}</label>
                  <select
                    .value=${condition.state || 'on'}
                    @change=${(e: Event) => this._updateCondition(index, condIdx, 'state', (e.target as HTMLSelectElement).value, e.target)}
                  >
                    ${[...new Set([
                      ...(condition.state ? [condition.state] : []),
                      ...this._getPossibleStates(check.entity),
                    ])].map(s => html`
                      <option value=${s} ?selected=${condition.state === s}>${s}</option>
                    `)}
                  </select>
                </div>
              `}

              <ha-textfield
                label=${localize(this.hass, 'custom_fix')}
                .value=${condition.fix_service || ''}
                @input=${(e: Event) => this._updateCondition(index, condIdx, 'fix_service', (e.target as HTMLInputElement).value)}
              ></ha-textfield>
              <div class="json-hint">${localize(this.hass, 'custom_fix_hint')}</div>

              <div class="divider"></div>
              <div class="prereq-title">${localize(this.hass, 'prereq_entity')}</div>

              <ha-entity-picker
                .hass=${this.hass}
                .value=${condition.prerequisite_entity || ''}
                allow-custom-entity
                @value-changed=${(e: CustomEvent) => this._updateCondition(index, condIdx, 'prerequisite_entity', e.detail.value)}
              ></ha-entity-picker>

              ${condition.prerequisite_entity && condition.prerequisite_entity.trim() !== '' ? html`
                <div class="select-wrapper">
                  <label>${localize(this.hass, 'attr_check')}</label>
                  <select
                    .value=${condition.prerequisite_attribute || ''}
                    @change=${(e: Event) => this._updateCondition(index, condIdx, 'prerequisite_attribute', (e.target as HTMLSelectElement).value, e.target)}
                  >
                    <option value="" ?selected=${!condition.prerequisite_attribute}>${localize(this.hass, 'no_attr')}</option>
                    ${this._getPossibleAttributes(condition.prerequisite_entity).map(attr => html`
                      <option value=${attr} ?selected=${condition.prerequisite_attribute === attr}>${attr}</option>
                    `)}
                  </select>
                </div>

                ${condition.prerequisite_attribute && condition.prerequisite_attribute.trim() !== '' ? html`
                  <div class="select-wrapper">
                    <label>${localize(this.hass, 'attr_val')}</label>
                    <select
                      .value=${condition.prerequisite_attribute_value || ''}
                      @change=${(e: Event) => this._updateCondition(index, condIdx, 'prerequisite_attribute_value', (e.target as HTMLSelectElement).value, e.target)}
                    >
                      ${[...new Set([
                        ...(condition.prerequisite_attribute_value ? [condition.prerequisite_attribute_value] : []),
                        ...this._getPossibleAttributeValues(condition.prerequisite_entity, condition.prerequisite_attribute),
                      ])].map(val => html`
                        <option value=${val} ?selected=${condition.prerequisite_attribute_value === val}>${val}</option>
                      `)}
                    </select>
                  </div>
                  <div class="json-hint">${localize(this.hass, 'prereq_hint')}</div>
                ` : html`
                  <div class="select-wrapper">
                    <label>${localize(this.hass, 'prereq_state')}</label>
                    <select
                      .value=${condition.prerequisite_state || 'on'}
                      @change=${(e: Event) => this._updateCondition(index, condIdx, 'prerequisite_state', (e.target as HTMLSelectElement).value, e.target)}
                    >
                      ${[...new Set([
                        ...(condition.prerequisite_state ? [condition.prerequisite_state] : []),
                        ...this._getPossibleStates(condition.prerequisite_entity),
                      ])].map(s => html`
                        <option value=${s} ?selected=${(condition.prerequisite_state || 'on') === s}>${s}</option>
                      `)}
                    </select>
                  </div>
                  <div class="json-hint">${localize(this.hass, 'prereq_hint')}</div>
                `}
              ` : ''}
            </div>
          `)}

          <ha-button outlined @click=${() => this._addCondition(index)}>
            <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
            ${localize(this.hass, 'add_state')}
          </ha-button>
        </div>
      </div>
    `;
  }
}
