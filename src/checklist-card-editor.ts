import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import memoizeOne from 'memoize-one';
import {
  mdiPalette,
  mdiSort,
  mdiEyeOutline,
  mdiDrag,
  mdiArrowUp,
  mdiArrowDown,
  mdiDelete,
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
  @state() private _draggedIndex: number | null = null;
  @state() private _dropTargetIndex: number | null = null;
  @state() private _collapsed: Record<string, boolean> = {};
  @state() private _pickersReady = false;
  private _pickerLoadStarted = false;

  static styles = editorStyles;

  setConfig(config: CardConfig) {
    this._config = {
      ...config,
      checks: config.checks ? config.checks.map(ensureCheckId) : [],
    };
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

  private _expansionChanged(id: string, ev: CustomEvent) {
    ev.stopPropagation();
    const expanded = (ev.detail as { expanded?: boolean })?.expanded;
    if (typeof expanded !== 'boolean') return;
    const isCollapsed = !expanded;
    if ((this._collapsed[id] ?? false) === isCollapsed) return;
    this._collapsed = { ...this._collapsed, [id]: isCollapsed };
  }

  private _moveCheck(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === (this._config.checks?.length || 0) - 1) return;

    const checks = [...(this._config.checks || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = checks[index];
    checks[index] = checks[newIndex];
    checks[newIndex] = temp;

    this._updateConfig({ checks });
  }

  private _dragStart(e: DragEvent, index: number) {
    this._draggedIndex = index;
    this._dropTargetIndex = null;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
    }
  }

  private _handleDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    this._dropTargetIndex = index;
  }

  private _drop(e: DragEvent, dropIndex: number) {
    e.preventDefault();
    if (this._draggedIndex === null || this._draggedIndex === dropIndex) {
      this._draggedIndex = null;
      this._dropTargetIndex = null;
      return;
    }
    const checks = [...(this._config.checks || [])];
    const item = checks.splice(this._draggedIndex, 1)[0];
    checks.splice(dropIndex, 0, item);
    this._draggedIndex = null;
    this._dropTargetIndex = null;
    this._updateConfig({ checks });
  }

  private _dragEnd() {
    this._draggedIndex = null;
    this._dropTargetIndex = null;
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

        ${repeat(checks, (check) => check.id, (check, index) => {
          const isCollapsed = this._collapsed[check.id] ?? false;
          const conditions = check.conditions || [];
          const isMulti = conditions.length > 1;
          const headerLabel = check.name
            ? check.name
            : check.entity
              ? (this.hass.states[check.entity]?.attributes?.friendly_name || check.entity)
              : `${localize(this.hass, 'check_num')}${index + 1}`;
          const headerSubtitle = check.entity
            ? `${localize(this.hass, 'check_num')}${index + 1} · ${check.entity}`
            : `${localize(this.hass, 'check_num')}${index + 1} · ${localize(this.hass, 'not_selected')}`;

          return html`
            <div class="check-item ${this._draggedIndex === index ? 'dragging' : ''} ${this._dropTargetIndex === index ? 'drop-target' : ''}"
                 data-drop-text=${localize(this.hass, 'drag_here')}
                 @dragover=${(e: DragEvent) => this._handleDragOver(e, index)}
                 @drop=${(e: DragEvent) => this._drop(e, index)}
                 @dragend=${this._dragEnd}>

              <ha-expansion-panel
                outlined
                .expanded=${!isCollapsed}
                @expanded-changed=${(e: CustomEvent) => this._expansionChanged(check.id, e)}
              >
                <span
                  slot="leading-icon"
                  class="drag-handle"
                  draggable="true"
                  title=${localize(this.hass, 'drag_here')}
                  @dragstart=${(e: DragEvent) => this._dragStart(e, index)}
                  @click=${(e: Event) => e.stopPropagation()}
                >
                  <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                </span>
                <div slot="header" class="check-panel-header">
                  <span class="check-panel-title">${headerLabel}</span>
                  <span class="check-panel-subtitle">${headerSubtitle}</span>
                </div>
                <div slot="icons" class="check-panel-actions" @click=${(e: Event) => e.stopPropagation()}>
                  <ha-icon-button
                    .label=${localize(this.hass, 'check_num') + (index + 1) + ' ↑'}
                    .path=${mdiArrowUp}
                    .disabled=${index === 0}
                    @click=${(e: Event) => { e.stopPropagation(); this._moveCheck(index, 'up'); }}
                  ></ha-icon-button>
                  <ha-icon-button
                    .label=${localize(this.hass, 'check_num') + (index + 1) + ' ↓'}
                    .path=${mdiArrowDown}
                    .disabled=${index === checks.length - 1}
                    @click=${(e: Event) => { e.stopPropagation(); this._moveCheck(index, 'down'); }}
                  ></ha-icon-button>
                  <ha-icon-button
                    class="remove-btn"
                    .label=${localize(this.hass, 'remove')}
                    .path=${mdiDelete}
                    @click=${(e: Event) => { e.stopPropagation(); this._removeCheck(index); }}
                  ></ha-icon-button>
                </div>

                <div class="panel-content">
                  <div style="display: flex; flex-direction: column; gap: 16px;">
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
                  

                  <details style="padding: 12px; background: rgba(0,0,0,0.02); border-radius: 8px; border: 1px solid var(--divider-color);">
                    <summary style="cursor: pointer; font-weight: 500;">${localize(this.hass, 'advanced_settings')}</summary>
                    <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
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
                </div>
              </ha-expansion-panel>
            </div>
          `;
        })}

        <ha-button class="add-btn" outlined @click=${this._addCheck}>
          <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
          ${localize(this.hass, 'add_check')}
        </ha-button>
      </div>
    `;
  }
}
