/**
 * @file checklist-card.ts
 * @description Main display component for the Checklist Card custom card.
 *
 * Registers the `<checklist-card>` custom element and implements the full
 * Lovelace custom-card contract:
 * - `setConfig()` — called by HA when the YAML config changes.
 * - `getConfigElement()` — returns the visual editor element.
 * - `getStubConfig()` — returns a localised default config for the card picker.
 * - `hass` property — receives live HA state updates from the dashboard.
 */

import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import type { HassEntity } from 'home-assistant-js-websocket';

import { cardStyles } from './checklist-card.styles';
import { localize, localizeStatic } from './localize';
import { ensureCheckId, getStandardServiceCall } from './utils';
import type { HomeAssistant, CardConfig, CheckRule, StateCondition } from './types';
import { DELAY_BETWEEN_SERVICES } from './types';

/**
 * `<checklist-card>` — Lovelace custom card that monitors a list of HA
 * entities against configurable state conditions and provides one-click
 * remediation actions.
 *
 * @customElement checklist-card
 *
 * @property {HomeAssistant} hass - Injected by the HA dashboard on every state
 *   update. Triggers a selective re-evaluation of only the watched entities.
 */
@customElement('checklist-card')
export class ChecklistCard extends LitElement {
  /** Injected by the HA dashboard; updated on every state change. */
  @property({ attribute: false }) public hass!: HomeAssistant;

  /** Parsed and normalised card configuration. Set via {@link setConfig}. */
  @state() private _config!: CardConfig;

  /**
   * Whether the "Fix All" operation is currently running. Kept as `@state`
   * so the spinner is shown immediately upon click without waiting for a
   * `hass` update.
   */
  @state() private _isFixingAll = false;

  /**
   * Set of check rule IDs whose individual fix action is in progress. Kept as
   * `@state` for the same reason as {@link _isFixingAll}.
   */
  @state() private _fixingItems: Set<string> = new Set();

  /**
   * IDs of rules that are currently in a problem state. Computed in
   * `willUpdate()` from `hass` and `_config`; **not** a `@state` property to
   * avoid a second render cycle per `hass` update.
   */
  private _problemIds: Set<string> = new Set();

  /**
   * Filtered and ordered subset of `_config.checks` that should be rendered.
   * Respects the `show_ok_items` flag. Computed in `willUpdate()`.
   */
  private _checksToDisplay: CheckRule[] = [];

  /**
   * Inline CSS string for the check-list container. Computed once in
   * `willUpdate()` when `_config` changes, avoiding repeated string
   * construction on every render.
   */
  private _listStyle = 'display: flex; flex-direction: column; gap: 12px;';

  /**
   * Flat list of entity IDs (main entities + prerequisite entities) whose
   * state changes should trigger a problem-set recalculation. Used to short-
   * circuit `willUpdate()` when unrelated entities change.
   */
  private _watchedEntityIds: string[] = [];

  static styles = cardStyles;

  // ── Lovelace card contract ──────────────────────────────────────────────

  /**
   * Returns the visual editor element tag. Called by HA when the user opens
   * the card editor from the dashboard UI.
   *
   * @returns The `<checklist-card-editor>` element.
   */
  static getConfigElement() {
    return document.createElement('checklist-card-editor');
  }

  /**
   * Returns the card height in Lovelace masonry grid units (1 unit ≈ 50 px).
   * Accounts for the internal layout so a multi-column arrangement correctly
   * reports a shorter card than a single-column one with the same item count.
   */
  getCardSize(): number {
    const checks = this._config?.checks?.length ?? 1;
    const cols = this._layoutCols();
    const itemsPerCol = Math.ceil(checks / cols);
    // Header ≈ 80 px (1.6 units) + each item ≈ 60 px (1.2 units) + padding
    return Math.max(2, Math.ceil(itemsPerCol * 1.2) + 2);
  }

  /**
   * Returns default sizing constraints for the Lovelace sections (grid) view.
   * Columns and rows are derived from the internal layout configuration so
   * the suggested card footprint matches what the user configured:
   * - More check-columns → wider suggested card (each needs ≈ 3 grid columns)
   * - Fewer items per column → shorter suggested card
   * - Rows mode → wider card (items scroll horizontally)
   */
  getGridOptions() {
    const checks = this._config?.checks?.length ?? 1;
    const layout = this._config?.layout ?? { mode: 'columns', count: 1 };

    if (layout.mode === 'rows') {
      const rowCount = Math.max(1, layout.count || 1);
      return {
        columns: Math.min(12, Math.max(6, Math.ceil(checks / rowCount) * 2)),
        rows: Math.max(3, Math.ceil(rowCount * 1.3) + 2),
        min_columns: 4,
        max_columns: 12,
        min_rows: 2,
      };
    }

    const cols = this._layoutCols();
    const itemsPerCol = Math.ceil(checks / cols);
    return {
      columns: Math.min(12, cols * 3),
      rows: Math.max(3, Math.ceil(itemsPerCol * 1.3) + 2),
      min_columns: Math.min(12, Math.max(2, cols * 2)),
      max_columns: 12,
      min_rows: 2,
    };
  }

  /** Number of check-item columns from the current layout config. */
  private _layoutCols(): number {
    const layout = this._config?.layout;
    return layout?.mode === 'columns' ? Math.max(1, layout.count || 1) : 1;
  }

  /**
   * Returns a localised default configuration used when the card is added
   * from the card picker without any prior configuration. The title is
   * resolved via {@link localizeStatic} so it matches the browser locale
   * before `hass` is available.
   *
   * @returns A minimal valid {@link CardConfig}.
   */
  static getStubConfig(): CardConfig {
    return {
      type: 'custom:checklist-card',
      title: localizeStatic('title'),
      checks: [{
        id: Date.now().toString(),
        entity: '',
        name: '',
        conditions: [{ state: 'off', attribute: '', attribute_value: '', fix_service: '' }],
        conditions_mode: 'any',
        default_condition_index: 0,
      }],
      layout: { mode: 'columns', count: 1 },
    };
  }

  /**
   * Called by Home Assistant whenever the card's YAML configuration changes.
   * Normalises each check rule with {@link ensureCheckId} to guarantee stable
   * IDs for Lit's keyed `repeat` directive.
   *
   * @param config - Raw configuration object from the dashboard YAML.
   * @throws {Error} When `config` is missing or has no `checks` array.
   */
  setConfig(config: CardConfig) {
    if (!config || !config.checks) throw new Error(localize(this.hass, 'config_error'));
    this._config = {
      ...config,
      checks: config.checks.map(ensureCheckId),
    };
  }

  // ── Lit lifecycle ───────────────────────────────────────────────────────

  /**
   * Runs before every render to recompute derived state. Updates
   * {@link _problemIds}, {@link _checksToDisplay}, and {@link _listStyle}
   * only when necessary:
   *
   * - **`_config` changed** — full recompute of all derived state.
   * - **`hass` changed** — recomputes problem state only when at least one
   *   watched entity has a different state object reference.
   *
   * This selective update strategy ensures the card performs O(watched-entities)
   * work on each HA tick rather than iterating the full entity registry.
   *
   * @param changedProps - Map of changed reactive property names to their
   *   previous values, provided by Lit.
   */
  protected willUpdate(changedProps: PropertyValues): void {
    super.willUpdate(changedProps);

    if (changedProps.has('_config')) {
      this._watchedEntityIds = this._collectWatchedEntityIds();
      this._listStyle = this._computeListStyle();
      this._problemIds = this._calculateProblemIds();
      this._checksToDisplay = this._computeChecksToDisplay();
      return;
    }

    if (changedProps.has('hass')) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;

      if (oldHass && this._watchedEntityIds.length > 0) {
        const hasRelevantChange = this._watchedEntityIds.some(id =>
          oldHass.states?.[id] !== this.hass.states?.[id]
        );
        if (!hasRelevantChange) return;
      }

      this._problemIds = this._calculateProblemIds();
      this._checksToDisplay = this._computeChecksToDisplay();
    }
  }

  // ── Private helpers ─────────────────────────────────────────────────────

  /**
   * Builds the flat list of entity IDs that the card must watch for state
   * changes. Includes both primary entities and prerequisite entities
   * referenced inside conditions.
   *
   * @returns Deduplicated array of entity IDs.
   */
  private _collectWatchedEntityIds(): string[] {
    const ids = new Set<string>();
    for (const rule of this._config.checks) {
      if (rule.entity) ids.add(rule.entity);
      for (const cond of rule.conditions ?? []) {
        if (cond.prerequisite_entity) ids.add(cond.prerequisite_entity);
      }
    }
    return Array.from(ids);
  }

  /**
   * Computes the inline CSS string for the `.check-list` container based on
   * the current {@link LayoutConfig}. Result is cached in {@link _listStyle}
   * and only recalculated when `_config` changes.
   *
   * @returns CSS string suitable for use as an inline `style` attribute.
   */
  private _computeListStyle(): string {
    const layout = this._config?.layout ?? { mode: 'columns', count: 1 };

    if (layout.mode === 'columns') {
      if (layout.count <= 1) return 'display: flex; flex-direction: column; gap: 12px;';
      return `display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, max(250px, calc(100% / ${layout.count} - 12px))), 1fr)); gap: 12px; align-items: start;`;
    }

    if (layout.mode === 'rows') {
      return `display: grid; grid-template-rows: repeat(${layout.count}, auto); grid-auto-flow: column; gap: 12px; align-items: start; overflow-x: auto; padding-bottom: 8px;`;
    }

    return 'display: flex; flex-direction: column; gap: 12px;';
  }

  /**
   * Filters `_config.checks` to produce the list of check items that should
   * be rendered, honouring the `show_ok_items` flag.
   *
   * @returns Ordered array of {@link CheckRule}s to render.
   */
  private _computeChecksToDisplay(): CheckRule[] {
    return this._config.checks.filter(c => {
      if (!c.entity) return false;
      if (this._config.show_ok_items === false && !this._problemIds.has(c.id)) return false;
      return true;
    });
  }

  /**
   * Evaluates a state string that may contain the `states('entity_id')`
   * pattern, resolving it to the live state of the referenced entity.
   * Returns the original string unchanged when no pattern is detected.
   *
   * @param expected - A literal state string or one containing `states(…)`.
   * @returns The resolved state string.
   */
  private _evaluateExpectedState(expected: string): string {
    if (!expected || !expected.includes('states(')) return expected;
    try {
      const match = expected.match(/states\(['"]([^'"]+)['"]\)/);
      if (match?.[1] && this.hass.states[match[1]]) {
        return this.hass.states[match[1]].state;
      }
    } catch (e) {
      console.warn(localize(this.hass, 'expected_pattern_error'), e);
    }
    return expected;
  }

  /**
   * Evaluates a single {@link StateCondition} against the provided entity
   * state object. Handles prerequisite checks, attribute checks, and
   * state comparisons in that order.
   *
   * **Prerequisite logic:** When a prerequisite entity is defined and its
   * state does *not* match the required value, the condition is considered
   * satisfied (returns `true`) to suppress fix prompts when the prerequisite
   * is not met.
   *
   * @param stateObj - The current HA state object for the entity being checked.
   * @param condition - The condition to evaluate.
   * @returns `true` if the condition passes (entity is OK), `false` otherwise.
   */
  private _checkCondition(stateObj: HassEntity, condition: StateCondition): boolean {
    if (condition.prerequisite_entity?.trim()) {
      const prereqObj = this.hass.states[condition.prerequisite_entity];
      if (prereqObj) {
        let prereqMet: boolean;

        if (condition.prerequisite_attribute?.trim()) {
          const attrValue = prereqObj.attributes?.[condition.prerequisite_attribute];
          let expected = condition.prerequisite_attribute_value?.trim()
            ? condition.prerequisite_attribute_value
            : condition.prerequisite_state || 'on';
          expected = this._evaluateExpectedState(expected);

          if (expected.startsWith('!=')) {
            const denied = expected.slice(2).split(',').map(s => s.trim());
            prereqMet = attrValue !== undefined && !denied.includes(String(attrValue));
          } else {
            const allowed = expected.split(',').map(s => s.trim());
            prereqMet = attrValue !== undefined && allowed.includes(String(attrValue));
          }
        } else {
          let expected = condition.prerequisite_state || 'on';
          expected = this._evaluateExpectedState(expected);

          if (expected.startsWith('!=')) {
            const denied = expected.slice(2).split(',').map(s => s.trim());
            prereqMet = !denied.includes(prereqObj.state);
          } else {
            const allowed = expected.split(',').map(s => s.trim());
            prereqMet = allowed.includes(prereqObj.state);
          }
        }

        // Prerequisite not met → treat condition as satisfied (skip fix prompt)
        if (!prereqMet) return true;
      }
    }

    const currentState = stateObj.state;
    if (currentState === 'unavailable' || currentState === 'unknown') return false;

    if (condition.attribute?.trim()) {
      const attrValue = stateObj.attributes?.[condition.attribute];
      const expectedAttrValue = this._evaluateExpectedState(
        condition.attribute_value?.trim() ? condition.attribute_value : condition.state
      );
      return attrValue !== undefined && String(attrValue) === String(expectedAttrValue);
    }

    return currentState === this._evaluateExpectedState(condition.state);
  }

  /**
   * Determines whether a {@link CheckRule} is currently in a problem state
   * by running all its conditions through {@link _checkCondition} and applying
   * the configured `conditions_mode` logic.
   *
   * @param rule - The check rule to evaluate.
   * @returns `true` when the entity fails the check (problem detected).
   */
  private _isRuleProblem(rule: CheckRule): boolean {
    if (!rule.entity) return false;
    const stateObj = this.hass.states[rule.entity];
    if (!stateObj) return true;

    const results = rule.conditions.map(c => this._checkCondition(stateObj, c));
    return rule.conditions_mode === 'all' ? !results.every(Boolean) : !results.some(Boolean);
  }

  /**
   * Iterates all configured check rules and returns the set of IDs that are
   * currently in a problem state.
   *
   * @returns A `Set` of problem rule IDs (empty when all checks pass).
   */
  private _calculateProblemIds(): Set<string> {
    if (!this.hass || !this._config?.checks) return new Set();
    return new Set(
      this._config.checks.filter(rule => this._isRuleProblem(rule)).map(rule => rule.id)
    );
  }

  // ── Fix actions ─────────────────────────────────────────────────────────

  /**
   * Calls the appropriate HA service to bring a single condition into its
   * OK state. Supports three fix strategies in priority order:
   *
   * 1. **JSON custom payload** — `fix_service` is a JSON string with a
   *    `service` key and optional `data` object.
   * 2. **Simple service string** — `fix_service` is `"domain.service"`.
   * 3. **Auto-inferred service** — determined by {@link getStandardServiceCall}
   *    based on the entity domain and expected state.
   *
   * @param entityId - The entity to fix.
   * @param condition - The failing condition that defines the target state.
   */
  private async _fixCondition(entityId: string, condition: StateCondition) {
    const domain = entityId.split('.')[0];
    const baseServiceData = { entity_id: entityId };

    if (condition.fix_service?.trim()) {
      const fs = condition.fix_service.trim();
      try {
        if (fs.startsWith('{')) {
          const payload = JSON.parse(fs) as { service: string; data?: Record<string, unknown> };
          const [d, s] = payload.service.split('.');
          await this.hass.callService(d, s, { ...baseServiceData, ...payload.data });
        } else if (fs.includes('.')) {
          const [d, s] = fs.split('.');
          await this.hass.callService(d, s, baseServiceData);
        }
      } catch (e) {
        console.error(localize(this.hass, 'fix_process_error') + ' (Parse/Execute):', e);
      }
      return;
    }

    const expected = this._evaluateExpectedState(condition.state);
    const callDetails = getStandardServiceCall(domain, expected);

    // Special case: light brightness attribute fix
    if (condition.attribute?.trim() && condition.attribute_value?.trim()) {
      const attrVal = this._evaluateExpectedState(condition.attribute_value);
      if (domain === 'light' && condition.attribute === 'brightness' && callDetails.service === 'turn_on') {
        const brightness = parseInt(attrVal, 10);
        if (!isNaN(brightness)) callDetails.serviceData.brightness = brightness;
      }
    }

    await this.hass.callService(domain, callDetails.service, { ...baseServiceData, ...callDetails.serviceData });
  }

  /**
   * Orchestrates the fix action for a single check rule. Marks the rule as
   * "fixing" (shows a spinner), calls the relevant service(s), then clears
   * the fixing state.
   *
   * In `"any"` mode, only the condition at `default_condition_index` is
   * applied. In `"all"` mode, every currently-failing condition is applied
   * sequentially with a {@link DELAY_BETWEEN_SERVICES} pause between calls.
   *
   * @param rule - The check rule whose fix action should be executed.
   */
  private async _fixIssue(rule: CheckRule) {
    this._fixingItems = new Set([...this._fixingItems, rule.id]);

    try {
      const stateObj = this.hass.states[rule.entity];

      if (rule.conditions_mode === 'any') {
        const idx = rule.default_condition_index ?? 0;
        await this._fixCondition(rule.entity, rule.conditions[idx] ?? rule.conditions[0]);
      } else {
        for (const condition of rule.conditions) {
          if (!stateObj || !this._checkCondition(stateObj, condition)) {
            await this._fixCondition(rule.entity, condition);
            if (rule.conditions.length > 1) {
              await new Promise(r => setTimeout(r, DELAY_BETWEEN_SERVICES));
            }
          }
        }
      }
    } catch (e) {
      console.error(localize(this.hass, 'fix_process_error'), e);
    } finally {
      const remaining = new Set(this._fixingItems);
      remaining.delete(rule.id);
      this._fixingItems = remaining;
    }
  }

  /**
   * Iterates all problem rules and calls {@link _fixIssue} for each one in
   * order, with a {@link DELAY_BETWEEN_SERVICES} pause between rules.
   * Sets {@link _isFixingAll} to show the global spinner and prevent
   * duplicate submissions.
   */
  private async _fixAll() {
    this._isFixingAll = true;
    for (const rule of this._config.checks) {
      if (!rule.entity || !this._problemIds.has(rule.id)) continue;
      await this._fixIssue(rule);
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_SERVICES));
    }
    this._isFixingAll = false;
  }

  // ── Render helpers ───────────────────────────────────────────────────────

  /**
   * Renders the status sub-text for a check item with exactly one condition.
   * Shows the current state vs. the required state, and additionally shows
   * attribute info when an attribute check is configured.
   *
   * @param condition - The single condition of the failing rule.
   * @param stateObj - Live HA state object for the entity (may be undefined).
   * @param currentState - Human-readable current state string.
   * @returns A Lit `TemplateResult` fragment.
   */
  private _renderSingleConditionStatus(condition: StateCondition, stateObj: HassEntity | undefined, currentState: string) {
    const expectedState = this._evaluateExpectedState(condition.state);
    const hasAttr = !!condition.attribute?.trim();
    const expectedAttrValue = hasAttr
      ? this._evaluateExpectedState(condition.attribute_value || condition.state)
      : null;

    return html`
      <span class="entity-state">
        ${localize(this.hass, 'current_state')}: ${currentState}
        (${localize(this.hass, 'required')}: ${expectedState})
      </span>
      ${hasAttr ? html`
        <span class="entity-state">
          ${localize(this.hass, 'attribute')} <strong>${condition.attribute}</strong>:
          <strong>${stateObj?.attributes?.[condition.attribute!] ?? localize(this.hass, 'not_exists')}</strong>
          (${localize(this.hass, 'required')}: ${expectedAttrValue})
        </span>
      ` : ''}
    `;
  }

  /**
   * Renders the status sub-text for a check item with multiple conditions.
   * Adapts the display based on `conditions_mode`:
   * - `"any"` — shows accepted states and the current fix target.
   * - `"all"` — lists each currently-failing condition's requirements.
   *
   * @param rule - The check rule being rendered.
   * @param stateObj - Live HA state object for the entity (may be undefined).
   * @param currentState - Human-readable current state string.
   * @returns A Lit `TemplateResult` fragment.
   */
  private _renderMultiConditionStatus(rule: CheckRule, stateObj: HassEntity | undefined, currentState: string) {
    if (rule.conditions_mode === 'any') {
      const stateList = rule.conditions.map(c => this._evaluateExpectedState(c.state)).join(', ');
      const defaultIdx = rule.default_condition_index ?? 0;
      const fixTarget = this._evaluateExpectedState(
        rule.conditions[defaultIdx]?.state ?? rule.conditions[0]?.state
      );
      return html`
        <span class="entity-state">${localize(this.hass, 'current_state')}: <strong>${currentState}</strong></span>
        <span class="entity-state">${localize(this.hass, 'accepted_one_of')}: ${stateList}</span>
        <span class="entity-state">${localize(this.hass, 'fix_target')}: <strong>${fixTarget}</strong></span>
      `;
    }

    const failingConditions = stateObj
      ? rule.conditions.filter(c => !this._checkCondition(stateObj, c))
      : rule.conditions;
    return html`
      <span class="entity-state">${localize(this.hass, 'current_state')}: ${currentState}</span>
      ${failingConditions.map(c => html`
        <span class="entity-state">
          ${localize(this.hass, 'required')}: ${localize(this.hass, 'status')}=${this._evaluateExpectedState(c.state)}${c.attribute?.trim() ? html` | ${c.attribute}=${this._evaluateExpectedState(c.attribute_value || c.state)}` : ''}
        </span>
      `)}
    `;
  }

  // ── Render ───────────────────────────────────────────────────────────────

  /** @internal */
  render() {
    if (!this._config) return html``;

    const problemCount = this._problemIds.size;
    const hasProblems = problemCount > 0;
    const hasChecks = this._checksToDisplay.length > 0;
    const dir = this.hass?.translationMetadata?.dir ?? (this.hass?.language === 'he' ? 'rtl' : 'ltr');

    return html`
      <ha-card dir=${dir}>
        <div class="header">
          <div class="header-content">
            <span class="status-icon ${hasProblems ? 'error' : 'success'}">
              <ha-icon icon="${hasProblems ? 'mdi:alert' : 'mdi:check-circle'}"></ha-icon>
            </span>
            <div>
              <div class="title">${this._config.title || localize(this.hass, 'title')}</div>
              <div class="subtitle">
                ${hasProblems
        ? localize(this.hass, 'problems_found', { count: problemCount })
        : localize(this.hass, 'all_good')}
              </div>
            </div>
          </div>

          ${hasChecks && hasProblems ? html`
            <button class="fix-all-btn" @click=${this._fixAll} ?disabled=${this._isFixingAll}>
              ${this._isFixingAll ? html`<div class="spinner"></div>` : localize(this.hass, 'fix_all')}
            </button>
          ` : ''}
        </div>

        ${hasChecks ? html`
          <div class="check-list" style="${this._listStyle}">
            ${repeat(this._checksToDisplay, c => c.id, c => {
          const isProblem = this._problemIds.has(c.id);
          const stateObj = this.hass.states[c.entity];
          const currentState = stateObj?.state ?? localize(this.hass, 'unavailable');
          const isMulti = c.conditions.length > 1;
          const displayName = c.name || stateObj?.attributes?.friendly_name || c.entity;

          return html`
                <div class="check-item">
                  <div class="entity-info-container">
                    <div class="icon-wrapper ${isProblem ? 'problem' : 'ok'}">
                      <ha-state-icon
                        class="entity-icon"
                        .hass=${this.hass}
                        .stateObj=${stateObj}
                      ></ha-state-icon>
                    </div>
                    <div class="check-text">
                      <span class="entity-name">${displayName}</span>
                      ${isProblem
              ? isMulti
                ? this._renderMultiConditionStatus(c, stateObj, currentState)
                : this._renderSingleConditionStatus(c.conditions[0], stateObj, currentState)
              : html`<span class="entity-state">${localize(this.hass, 'status')}: ${currentState}</span>`}
                    </div>
                  </div>
                  ${isProblem ? html`
                    <button class="fix-btn" @click=${() => this._fixIssue(c)} ?disabled=${this._fixingItems.has(c.id)}>
                      ${this._fixingItems.has(c.id) ? html`<div class="spinner"></div>` : localize(this.hass, 'fix')}
                    </button>
                  ` : html`
                    <div style="min-width: 60px; display: flex; justify-content: flex-end; align-items: center;">
                      <span class="ok-badge">
                        <ha-icon icon="mdi:check" style="--mdc-icon-size: 18px;"></ha-icon>
                        ${localize(this.hass, 'ok')}
                      </span>
                    </div>
                  `}
                </div>
              `;
        })}
          </div>
        ` : ''}
      </ha-card>
    `;
  }
}
