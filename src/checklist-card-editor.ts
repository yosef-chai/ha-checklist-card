/**
 * @file checklist-card-editor.ts
 * @description Visual configuration editor for the Checklist Card.
 *
 * Registers the `<checklist-card-editor>` custom element, which is returned
 * by {@link ChecklistCard.getConfigElement} and rendered inside the HA
 * dashboard card editor panel.
 *
 * ...
 */

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { editorStyles } from './checklist-card-editor.styles';
import { localize } from './localize';
import { ensureCheckId, makeEmptyCondition } from './utils';
import type { HomeAssistant, CardConfig, CheckRule, StateCondition, LayoutConfig } from './types';

@customElement('checklist-card-editor')
export class ChecklistCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: CardConfig;
  @state() private _draggedIndex: number | null = null;
  @state() private _dropTargetIndex: number | null = null;
  @state() private _collapsed: Record<string, boolean> = {};
  private _glanceCard: any = null;

  static styles = editorStyles;

  setConfig(config: CardConfig) {
    this._config = {
      ...config,
      checks: config.checks.map(ensureCheckId),
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
      },
    ];
    this._updateConfig({ checks });
  }

  private _removeCheck(index: number) {
    const checks = this._config.checks.filter((_, i) => i !== index);
    this._updateConfig({ checks });
  }

  private _toggleCollapse(id: string) {
    this._collapsed = {
      ...this._collapsed,
      [id]: !(this._collapsed[id] ?? false),
    };
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

  private _getPossibleStates(entityId: string): string[] {
    if (!entityId || !this.hass?.states[entityId]) {
      return ['on', 'off', 'unavailable', 'unknown'];
    }

    const stateObj = this.hass.states[entityId];
    const domain = entityId.split('.')[0];
    let states: string[] = [];

    switch (domain) {
      case 'light':
      case 'switch':
      case 'input_boolean':
      case 'fan':
      case 'binary_sensor':
        states = ['on', 'off'];
        break;
      case 'lock':
        states = ['locked', 'unlocked'];
        break;
      case 'cover':
        states = ['open', 'closed', 'opening', 'closing'];
        break;
      case 'climate':
        states = stateObj.attributes?.hvac_modes || ['off', 'heat', 'cool', 'auto', 'dry', 'fan_only', 'heat_cool'];
        break;
      case 'select':
      case 'input_select':
        states = stateObj.attributes?.options || [];
        break;
      case 'number':
      case 'input_number':
        states = ['0', '50', '100'];
        break;
      case 'media_player':
        states = ['playing', 'paused', 'idle', 'off', 'on'];
        break;
      case 'vacuum':
        states = ['cleaning', 'docked', 'idle', 'returning', 'paused'];
        break;
      default:
        states = ['on', 'off'];
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
    let values: string[] = [];

    switch (attribute.toLowerCase()) {
      case 'brightness':
      case 'brightness_pct':
        values = Array.from({ length: 11 }, (_, i) => String(i * 10));
        break;
      case 'color_temp':
      case 'color_temp_kelvin':
        values = Array.from({ length: 35 }, (_, i) => String(153 + i * 10));
        break;
      case 'hvac_mode':
      case 'hvac_modes':
        values = stateObj.attributes?.hvac_modes || ['off', 'heat', 'cool', 'auto'];
        break;
      case 'preset_mode':
      case 'preset_modes':
        values = stateObj.attributes?.preset_modes || [];
        break;
      case 'fan_mode':
      case 'fan_modes':
        values = stateObj.attributes?.fan_modes || [];
        break;
      case 'swing_mode':
      case 'swing_modes':
        values = stateObj.attributes?.swing_modes || [];
        break;
      default:
        if (Array.isArray(stateObj.attributes?.[`${attribute}_options`])) {
          values = stateObj.attributes[`${attribute}_options`];
        } else if (typeof stateObj.attributes?.[attribute] === 'boolean') {
          values = ['true', 'false'];
        } else {
          const current = stateObj.attributes?.[attribute];
          if (current !== undefined) values = [String(current)];
        }
    }
    return [...new Set(values.map(v => String(v)))];
  }

  private _getPossibleAttributes(entityId: string): string[] {
    if (!entityId || !this.hass?.states[entityId]?.attributes) return [];
    return Object.keys(this.hass.states[entityId].attributes).sort();
  }

  /** @internal */
  render() {
    if (!this.hass || !this._config) return html``;

    if (!this._glanceCard) {
      this._glanceCard = customElements.get('hui-glance-card');
      if (this._glanceCard) {
        this._glanceCard.getConfigElement().then(() => this.requestUpdate());
      }
      return html`
        <div style="padding: 32px; text-align: center; color: var(--secondary-text-color);">
          <ha-circular-progress indeterminate></ha-circular-progress>
          <div style="margin-top: 16px;">${localize(this.hass, 'loading')}</div>
        </div>
      `;
    }

    const checks = this._config.checks || [];
    const layout = this._config.layout || { mode: 'columns', count: 1 };

    return html`
      <div class="config-container" dir=${this.hass?.translationMetadata?.dir || (this.hass?.language === 'he' ? 'rtl' : 'ltr')}>
        <ha-textfield
          label=${localize(this.hass, 'editor_title')}
          .value=${this._config.title || ''}
          @input=${(e: Event) => this._updateConfig({ title: (e.target as HTMLInputElement).value })}
        ></ha-textfield>

        <div class="divider"></div>
        <h3 class="section-title">${localize(this.hass, 'layout_section')}</h3>

        <div class="layout-grid">
          <ha-formfield label=${localize(this.hass, 'show_ok')}>
            <ha-switch
              .checked=${this._config.show_ok_items !== false}
              @change=${(e: Event) => this._updateConfig({ show_ok_items: (e.target as any).checked })}
            ></ha-switch>
          </ha-formfield>

          <div class="select-wrapper">
            <label>${localize(this.hass, 'layout_dir')}</label>
            <select
              .value=${layout.mode === 'rows' ? 'rows' : 'columns'}
              @change=${(e: Event) => this._updateLayout({ mode: (e.target as HTMLSelectElement).value as 'columns' | 'rows' })}
            >
              <option value="columns" ?selected=${layout.mode === 'columns'}>${localize(this.hass, 'layout_col')}</option>
              <option value="rows" ?selected=${layout.mode === 'rows'}>${localize(this.hass, 'layout_row')}</option>
            </select>
          </div>

          <ha-textfield
            label=${layout.mode === 'columns' ? localize(this.hass, 'max_items_col') : localize(this.hass, 'max_items_row')}
            type="number"
            min="1"
            max="10"
            .value=${String(layout.count || 1)}
            @input=${(e: Event) => {
              const val = parseInt((e.target as HTMLInputElement).value, 10);
              if (!isNaN(val) && val >= 1) this._updateLayout({ count: val });
            }}
          ></ha-textfield>
        </div>

        <div class="divider"></div>
        <h3 class="section-title">${localize(this.hass, 'entities_section')}</h3>

        ${repeat(checks, (check) => check.id, (check, index) => {
          const isCollapsed = this._collapsed[check.id] ?? false;
          const conditions = check.conditions || [];
          const isMulti = conditions.length > 1;

          return html`
            <div class="check-item ${this._draggedIndex === index ? 'dragging' : ''} ${this._dropTargetIndex === index ? 'drop-target' : ''}"
                 data-drop-text=${localize(this.hass, 'drag_here')}
                 @dragover=${(e: DragEvent) => this._handleDragOver(e, index)}
                 @drop=${(e: DragEvent) => this._drop(e, index)}
                 @dragend=${this._dragEnd}>

              <div class="check-header">
                <div class="check-header-left">
                  <span class="drag-handle" draggable="true"
                        @dragstart=${(e: DragEvent) => this._dragStart(e, index)}>
                    <ha-icon icon="mdi:drag"></ha-icon>
                  </span>
                  <ha-icon-button .disabled=${index === 0} @click=${() => this._moveCheck(index, 'up')}>
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button .disabled=${index === checks.length - 1} @click=${() => this._moveCheck(index, 'down')}>
                    <ha-icon icon="mdi:arrow-down"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button @click=${() => this._toggleCollapse(check.id)}>
                    <ha-icon icon="${isCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'}"></ha-icon>
                  </ha-icon-button>
                  <strong>${localize(this.hass, 'check_num')}${index + 1}</strong>
                </div>
                <ha-button class="remove-btn" @click=${() => this._removeCheck(index)} style="--mdc-theme-primary: var(--error-color);">
                  ${localize(this.hass, 'remove')}
                </ha-button>
              </div>

              ${!isCollapsed ? html`
                <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 8px;">
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

                        <div class="divider"></div>
                        <div class="prereq-title" style="color: var(--primary-text-color);">${localize(this.hass, 'check_condition')}</div>

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
                      </div>
                    `)}

                    <ha-button outlined @click=${() => this._addCondition(index)}>
                      <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
                      ${localize(this.hass, 'add_state')}
                    </ha-button>
                  </div>
                </div>
              ` : html`
                <div style="font-size:13px; color:var(--secondary-text-color); margin-top: 8px;">
                  ${localize(this.hass, 'entity')}: ${check.entity || localize(this.hass, 'not_selected')} |
                  ${isMulti
                    ? html`${check.conditions_mode === 'all' ? localize(this.hass, 'every') : localize(this.hass, 'one_of')}: ${conditions.map(c => c.state).join(', ')}`
                    : html`${localize(this.hass, 'status')}: ${conditions[0]?.state || '—'}${conditions[0]?.attribute ? html` | ${conditions[0].attribute}=${conditions[0].attribute_value || '—'}` : ''}`}
                </div>
              `}
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
