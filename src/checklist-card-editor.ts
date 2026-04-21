/**
 * @file checklist-card-editor.ts
 * @description Visual configuration editor for the Checklist Card.
 *
 * Registers the `<checklist-card-editor>` custom element, which is returned
 * by {@link ChecklistCard.getConfigElement} and rendered inside the HA
 * dashboard card editor panel.
 *
 * The editor follows the standard HA custom-card editor pattern:
 * - Receives the current config via {@link ChecklistCardEditor.setConfig}.
 * - Emits a `"config-changed"` `CustomEvent` with the updated config in
 *   `event.detail.config` whenever any field changes.
 * - All state mutations produce a fresh config object (immutable update
 *   pattern) to make change detection straightforward for Lit.
 *
 * ## Drag-and-drop reordering
 * Check items support HTML5 drag-and-drop reordering as well as Up/Down
 * arrow buttons for accessibility. The `_draggedIndex` and `_dropTargetIndex`
 * states drive the visual feedback (dragging / drop-target CSS classes).
 *
 * ## HA component availability
 * The editor uses HA-provided web components (`ha-entity-picker`,
 * `ha-textfield`, etc.). Because these are registered asynchronously by the
 * HA frontend, the editor waits for `hui-glance-card` to be available as a
 * proxy signal that all required components have been defined, then re-renders.
 */

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { editorStyles } from './checklist-card-editor.styles';
import { localize } from './localize';
import { ensureCheckId, makeEmptyCondition } from './utils';
import type { HomeAssistant, CardConfig, CheckRule, StateCondition, LayoutConfig } from './types';

/**
 * `<checklist-card-editor>` — Visual editor panel for the Checklist Card.
 *
 * Rendered by the HA dashboard inside the card editor drawer. Emits
 * `"config-changed"` events that HA listens to in order to update the live
 * YAML and card preview.
 *
 * @customElement checklist-card-editor
 */
@customElement('checklist-card-editor')
export class ChecklistCardEditor extends LitElement {
  /** Injected by HA; provides entity state data and language for the UI. */
  @property({ attribute: false }) public hass!: HomeAssistant;

  /** Current working copy of the card config. Mutated immutably via {@link _updateConfig}. */
  @state() private _config!: CardConfig;

  /** Index of the check item currently being dragged, or `null` when idle. */
  @state() private _draggedIndex: number | null = null;

  /** Index of the drop target during a drag operation, or `null` when idle. */
  @state() private _dropTargetIndex: number | null = null;

  /**
   * Collapse state for each check item, keyed by check rule `id`.
   * `true` = collapsed (summary view), `false` / missing = expanded.
   */
  @state() private _collapsed: Record<string, boolean> = {};

  /**
   * Cached reference to the `hui-glance-card` custom element constructor.
   * Used as a proxy to detect when all HA editor components have been
   * registered. `null` until the element is found in the custom element registry.
   */
  private _glanceCard: any = null;

  static styles = editorStyles;

  // ── Lovelace editor contract ────────────────────────────────────────────

  /**
   * Called by HA when the editor is first opened or when the YAML config
   * is changed externally. Normalises all check rules via {@link ensureCheckId}.
   *
   * @param config - The current card configuration.
   */
  setConfig(config: CardConfig) {
    this._config = {
      ...config,
      checks: config.checks.map(ensureCheckId),
    };
  }

  // ── Config mutation helpers ─────────────────────────────────────────────

  /**
   * Merges a partial update into the current config and emits the standard
   * `"config-changed"` event that HA listens to. All editor mutations funnel
   * through this method to ensure the event is always fired.
   *
   * @param updates - Partial {@link CardConfig} fields to merge.
   */
  private _updateConfig(updates: Partial<CardConfig>) {
    this._config = { ...this._config, ...updates };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Updates a single field of a check rule at the given index.
   *
   * @param index - Zero-based position of the rule in `_config.checks`.
   * @param field - The {@link CheckRule} key to update.
   * @param value - The new value.
   */
  private _updateCheck(index: number, field: keyof CheckRule, value: any) {
    const checks = this._config.checks.map((check, i) =>
      i === index ? { ...check, [field]: value } : check
    );
    this._updateConfig({ checks });
  }

  /**
   * Updates a single field of a specific condition within a check rule.
   * After the config update, the `<select>` element's `.value` is manually
   * restored to work around Lit property-binding timing issues with native
   * `<select>` elements.
   *
   * @param checkIndex - Index of the parent check rule.
   * @param condIdx - Index of the condition within the rule's `conditions` array.
   * @param field - The {@link StateCondition} key to update.
   * @param value - The new value.
   * @param el - Optional `<select>` or `<input>` element whose `.value` should
   *   be re-synced after the update.
   */
  private async _updateCondition(
    checkIndex: number,
    condIdx: number,
    field: keyof StateCondition,
    value: string,
    el?: HTMLSelectElement | HTMLInputElement
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

  /**
   * Appends a new empty condition to the specified check rule. The new
   * condition inherits the `state` value of the first condition as a
   * sensible default.
   *
   * @param checkIndex - Index of the check rule to add a condition to.
   */
  private _addCondition(checkIndex: number) {
    const checks = this._config.checks.map((check, i) => {
      if (i !== checkIndex) return check;
      const baseState = check.conditions[0]?.state || 'off';
      const newCondition: StateCondition = { ...makeEmptyCondition(), state: baseState };
      return { ...check, conditions: [...check.conditions, newCondition] };
    });
    this._updateConfig({ checks });
  }

  /**
   * Removes a condition at `condIdx` from the specified check rule. Adjusts
   * `default_condition_index` if it pointed at or beyond the removed item.
   *
   * @param checkIndex - Index of the parent check rule.
   * @param condIdx - Index of the condition to remove.
   */
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

  /**
   * Sets the `default_condition_index` for a check rule, designating which
   * condition's fix action is used when `conditions_mode` is `"any"`.
   *
   * @param checkIndex - Index of the check rule.
   * @param condIdx - Index of the condition to mark as default.
   */
  private _setDefaultCondition(checkIndex: number, condIdx: number) {
    const checks = this._config.checks.map((check, i) =>
      i === checkIndex ? { ...check, default_condition_index: condIdx } : check
    );
    this._updateConfig({ checks });
  }

  /**
   * Updates the `conditions_mode` of a check rule.
   *
   * @param checkIndex - Index of the check rule.
   * @param mode - `"any"` (OR) or `"all"` (AND).
   */
  private _setConditionsMode(checkIndex: number, mode: 'any' | 'all') {
    const checks = this._config.checks.map((check, i) =>
      i === checkIndex ? { ...check, conditions_mode: mode } : check
    );
    this._updateConfig({ checks });
  }

  /**
   * Handles entity selection from `<ha-entity-picker>`. When a new entity is
   * chosen and no display name has been set, auto-populates the name from the
   * entity's `friendly_name` attribute.
   *
   * @param index - Index of the check rule.
   * @param entityId - Newly selected entity ID.
   */
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

  /**
   * Appends a new blank check rule to the end of the checks list.
   */
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

  /**
   * Removes the check rule at `index`.
   *
   * @param index - Zero-based index of the rule to remove.
   */
  private _removeCheck(index: number) {
    const checks = this._config.checks.filter((_, i) => i !== index);
    this._updateConfig({ checks });
  }

  /**
   * Toggles the collapsed/expanded state of the check item identified by `id`.
   *
   * @param id - The `id` of the {@link CheckRule} to toggle.
   */
  private _toggleCollapse(id: string) {
    this._collapsed = {
      ...this._collapsed,
      [id]: !(this._collapsed[id] ?? false),
    };
  }

  /**
   * Moves a check rule one position up or down in the list.
   *
   * @param index - Current index of the rule.
   * @param direction - `"up"` to move towards the start, `"down"` towards the end.
   */
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

  // ── Drag-and-drop handlers ──────────────────────────────────────────────

  /**
   * Initiates a drag operation for the check item at `index`.
   *
   * @param e - The native `DragEvent`.
   * @param index - Index of the item being dragged.
   */
  private _dragStart(e: DragEvent, index: number) {
    this._draggedIndex = index;
    this._dropTargetIndex = null;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
    }
  }

  /**
   * Updates the drop-target indicator as the dragged item moves over other
   * check items.
   *
   * @param e - The native `DragEvent`.
   * @param index - Index of the item currently under the cursor.
   */
  private _handleDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    this._dropTargetIndex = index;
  }

  /**
   * Completes the drag-and-drop reorder by splicing the dragged item to its
   * new position.
   *
   * @param e - The native `DragEvent`.
   * @param dropIndex - Index of the drop target item.
   */
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

  /** Cleans up drag state when a drag operation ends without a successful drop. */
  private _dragEnd() {
    this._draggedIndex = null;
    this._dropTargetIndex = null;
  }

  // ── Layout helpers ──────────────────────────────────────────────────────

  /**
   * Merges a partial update into the current {@link LayoutConfig}.
   *
   * @param updates - Partial layout fields to apply.
   */
  private _updateLayout(updates: Partial<LayoutConfig>) {
    const current = this._config.layout || { mode: 'columns', count: 1 };
    this._updateConfig({ layout: { ...current, ...updates } });
  }

  // ── Entity introspection helpers ────────────────────────────────────────

  /**
   * Returns a domain-aware list of likely state values for `entityId`.
   * Used to populate the OK-state `<select>` dropdown in the editor.
   * Always includes the entity's current live state and `"unavailable"` /
   * `"unknown"` as fallback options.
   *
   * @param entityId - The entity to introspect.
   * @returns Deduplicated array of state strings.
   */
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

  /**
   * Returns a list of plausible values for a given entity attribute. Provides
   * semantic suggestions for well-known attributes (`brightness`, `hvac_mode`,
   * etc.) and falls back to the attribute's current value for unknown ones.
   *
   * @param entityId - The entity to introspect.
   * @param attribute - The attribute name to suggest values for.
   * @returns Deduplicated array of string values.
   */
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

  /**
   * Returns all attribute names exposed by the entity, sorted alphabetically.
   * Used to populate the attribute `<select>` in the editor.
   *
   * @param entityId - The entity to introspect.
   * @returns Sorted array of attribute keys, or an empty array when the entity
   *   is not found.
   */
  private _getPossibleAttributes(entityId: string): string[] {
    if (!entityId || !this.hass?.states[entityId]?.attributes) return [];
    return Object.keys(this.hass.states[entityId].attributes).sort();
  }

  // ── Render ───────────────────────────────────────────────────────────────

  /** @internal */
  render() {
    if (!this.hass || !this._config) return html``;

    // Wait for HA editor components to be registered before rendering.
    // hui-glance-card serves as a reliable availability signal.
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
          <div class="select-wrapper">
            <label>${localize(this.hass, 'show_ok')}</label>
            <select @change=${(e: Event) => this._updateConfig({ show_ok_items: (e.target as HTMLSelectElement).value === 'true' })}>
              <option value="true" ?selected=${this._config.show_ok_items !== false}>${localize(this.hass, 'show_ok_yes')}</option>
              <option value="false" ?selected=${this._config.show_ok_items === false}>${localize(this.hass, 'show_ok_no')}</option>
            </select>
          </div>

          <div class="select-wrapper">
            <label>${localize(this.hass, 'layout_dir')}</label>
            <select @change=${(e: Event) => this._updateLayout({ mode: (e.target as HTMLSelectElement).value as 'columns' | 'rows' })}>
              <option value="columns" ?selected=${layout.mode === 'columns'}>${localize(this.hass, 'layout_col')}</option>
              <option value="rows" ?selected=${layout.mode === 'rows'}>${localize(this.hass, 'layout_row')}</option>
            </select>
          </div>

          <div class="select-wrapper">
            <label>${layout.mode === 'columns' ? localize(this.hass, 'max_items_col') : localize(this.hass, 'max_items_row')}</label>
            <input
              class="number-input"
              type="number"
              min="1"
              max="10"
              .value=${String(layout.count || 1)}
              @input=${(e: Event) => {
                const val = parseInt((e.target as HTMLInputElement).value, 10);
                if (!isNaN(val) && val >= 1) this._updateLayout({ count: val });
              }}
            />
          </div>
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
                <div style="display:flex; align-items:center;">
                  <span class="drag-handle" draggable="true"
                        @dragstart=${(e: DragEvent) => this._dragStart(e, index)}>☰</span>
                  <button class="move-btn" .disabled=${index === 0} @click=${() => this._moveCheck(index, 'up')}>
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </button>
                  <button class="move-btn" .disabled=${index === checks.length - 1} @click=${() => this._moveCheck(index, 'down')}>
                    <ha-icon icon="mdi:arrow-down"></ha-icon>
                  </button>
                  <ha-icon class="collapse-icon"
                           icon="${isCollapsed ? 'mdi:chevron-right' : 'mdi:chevron-down'}"
                           @click=${() => this._toggleCollapse(check.id)}>
                  </ha-icon>
                  <strong>${localize(this.hass, 'check_num')}${index + 1}</strong>
                </div>
                <button class="remove-btn" @click=${() => this._removeCheck(index)}>${localize(this.hass, 'remove')}</button>
              </div>

              ${!isCollapsed ? html`
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
                    <select @change=${(e: Event) => this._setConditionsMode(index, (e.target as HTMLSelectElement).value as 'any' | 'all')}>
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
                            <label class="default-label ${check.default_condition_index === condIdx ? 'is-default' : ''}">
                              <input type="radio"
                                     name="default_${check.id}"
                                     .checked=${check.default_condition_index === condIdx}
                                     @change=${() => this._setDefaultCondition(index, condIdx)}>
                              ${check.default_condition_index === condIdx
                                ? localize(this.hass, 'default_fix_star')
                                : localize(this.hass, 'default_fix')}
                            </label>
                          ` : ''}
                          ${isMulti ? html`
                            <button class="remove-condition-btn" @click=${() => this._removeCondition(index, condIdx)}>
                              ${localize(this.hass, 'remove_state')}
                            </button>
                          ` : ''}
                        </div>
                      </div>

                      <div class="divider" style="margin: 12px 0; border-top: 1px dashed var(--divider-color); opacity: 0.7;"></div>
                      <div style="font-size: 13px; font-weight: 500; color: var(--primary-color); margin-bottom: 8px;">${localize(this.hass, 'prereq_entity')}</div>

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
                            @change=${(e: Event) => this._updateCondition(index, condIdx, 'prerequisite_attribute', (e.target as HTMLSelectElement).value, e.target as HTMLSelectElement)}
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
                              @change=${(e: Event) => this._updateCondition(index, condIdx, 'prerequisite_attribute_value', (e.target as HTMLSelectElement).value, e.target as HTMLSelectElement)}
                            >
                              ${[...new Set([
                                ...(condition.prerequisite_attribute_value ? [condition.prerequisite_attribute_value] : []),
                                ...this._getPossibleAttributeValues(condition.prerequisite_entity, condition.prerequisite_attribute),
                              ])].map(val => html`
                                <option value=${val} ?selected=${condition.prerequisite_attribute_value === val}>${val}</option>
                              `)}
                            </select>
                            <div class="json-hint">${localize(this.hass, 'prereq_hint')}</div>
                          </div>
                        ` : html`
                          <div class="select-wrapper">
                            <label>${localize(this.hass, 'prereq_state')}</label>
                            <select
                              .value=${condition.prerequisite_state || 'on'}
                              @change=${(e: Event) => this._updateCondition(index, condIdx, 'prerequisite_state', (e.target as HTMLSelectElement).value, e.target as HTMLSelectElement)}
                            >
                              ${[...new Set([
                                ...(condition.prerequisite_state ? [condition.prerequisite_state] : []),
                                ...this._getPossibleStates(condition.prerequisite_entity),
                              ])].map(s => html`
                                <option value=${s} ?selected=${(condition.prerequisite_state || 'on') === s}>${s}</option>
                              `)}
                            </select>
                            <div class="json-hint">${localize(this.hass, 'prereq_hint')}</div>
                          </div>
                        `}
                      ` : ''}

                      <div class="divider" style="margin: 12px 0; border-top: 1px dashed var(--divider-color); opacity: 0.7;"></div>

                      <div class="select-wrapper">
                        <label>${localize(this.hass, 'attr_check')}</label>
                        <select
                          .value=${condition.attribute || ''}
                          @change=${(e: Event) => this._updateCondition(index, condIdx, 'attribute', (e.target as HTMLSelectElement).value, e.target as HTMLSelectElement)}
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
                            @change=${(e: Event) => this._updateCondition(index, condIdx, 'attribute_value', (e.target as HTMLSelectElement).value, e.target as HTMLSelectElement)}
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
                            @change=${(e: Event) => this._updateCondition(index, condIdx, 'state', (e.target as HTMLSelectElement).value, e.target as HTMLSelectElement)}
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

                  <button class="add-condition-btn" @click=${() => this._addCondition(index)}>
                    ${localize(this.hass, 'add_state')}
                  </button>
                </div>
              ` : html`
                <div style="font-size:13px; color:var(--secondary-text-color);">
                  ${localize(this.hass, 'entity')}: ${check.entity || localize(this.hass, 'not_selected')} |
                  ${isMulti
                    ? html`${check.conditions_mode === 'all' ? localize(this.hass, 'every') : localize(this.hass, 'one_of')}: ${conditions.map(c => c.state).join(', ')}`
                    : html`${localize(this.hass, 'status')}: ${conditions[0]?.state || '—'}${conditions[0]?.attribute ? html` | ${conditions[0].attribute}=${conditions[0].attribute_value || '—'}` : ''}`}
                </div>
              `}
            </div>
          `;
        })}

        <button class="add-btn" @click=${this._addCheck}>${localize(this.hass, 'add_check')}</button>
      </div>
    `;
  }
}
