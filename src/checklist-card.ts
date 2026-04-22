import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { cardStyles } from './checklist-card.styles';
import { localize, localizeStatic } from './localize';
import { ensureCheckId, getStandardServiceCall, ensureDefaults } from './utils';
import { isRuleProblem, checkCondition, evaluateExpectedState } from './conditions';
import type { HomeAssistant, CardConfig, CheckRule, StateCondition } from './types';
import { DELAY_BETWEEN_SERVICES } from './types';
import './checklist-card-item'; // Import the item component

@customElement('checklist-card')
export class ChecklistCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: CardConfig;
  @state() private _isFixingAll = false;
  @state() private _fixingItems: Set<string> = new Set();
  @state() private _errorBanner: string | null = null;
  @state() private _showOkExpanded = false;
  private _problemIds: Set<string> = new Set();
  private _checksToDisplay: CheckRule[] = [];
  private _listStyle = 'display: flex; flex-direction: column; gap: 12px;';
  private _watchedEntityIds: string[] = [];

  static styles = cardStyles;

  static getConfigElement() {
    return import('./checklist-card-editor').then(() => document.createElement('checklist-card-editor'));
  }

  getCardSize(): number {
    const checks = this._config?.checks?.length ?? 1;
    const cols = this._layoutCols();
    const itemsPerCol = Math.ceil(checks / cols);
    return Math.max(2, Math.ceil(itemsPerCol * 1.2) + 2);
  }

  getGridOptions() {
    // HA Sections view caps section width at 12 columns; clamp every value we return.
    const clampCols = (n: number) => Math.max(1, Math.min(12, n));
    const checks = this._config?.checks?.length ?? 1;
    const layout = this._config?.layout ?? { mode: 'columns', count: 1 };

    if (layout.mode === 'rows') {
      const rowCount = Math.max(1, layout.count || 1);
      return {
        columns: clampCols(Math.max(6, Math.ceil(checks / rowCount) * 2)),
        rows: Math.max(3, Math.ceil(rowCount * 1.3) + 2),
        min_columns: clampCols(4),
        min_rows: 2,
      };
    }

    const cols = this._layoutCols();
    const itemsPerCol = Math.ceil(checks / cols);
    return {
      columns: clampCols(cols * 3),
      rows: Math.max(3, Math.ceil(itemsPerCol * 1.3) + 2),
      min_columns: clampCols(Math.max(2, cols * 2)),
      min_rows: 2,
    };
  }

  private _layoutCols(): number {
    const layout = this._config?.layout;
    return layout?.mode === 'columns' ? Math.max(1, layout.count || 1) : 1;
  }

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
      sort: 'status'
    };
  }

  setConfig(config: CardConfig) {
    if (!config || !config.checks) throw new Error(localize(this.hass, 'config_error'));
    const safeConfig = ensureDefaults(config);
    this._config = {
      ...safeConfig,
      checks: safeConfig.checks.map(ensureCheckId),
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    // Always update when config, internal state, or non-hass props change.
    if (changedProps.size > 1 || !changedProps.has('hass')) return true;

    // hass-only change: skip re-render unless a watched entity actually changed.
    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (!oldHass) return true;
    if (this._watchedEntityIds.length === 0) return true;

    return this._watchedEntityIds.some(
      id => oldHass.states?.[id] !== this.hass.states?.[id]
    );
  }

  protected willUpdate(changedProps: PropertyValues): void {
    super.willUpdate(changedProps);

    if (changedProps.has('_config')) {
      this._watchedEntityIds = this._collectWatchedEntityIds();
      this._listStyle = this._computeListStyle();
    }

    // Recompute derived state whenever config or a watched entity changed.
    // (shouldUpdate has already filtered out irrelevant hass updates.)
    if (changedProps.has('_config') || changedProps.has('hass')) {
      this._problemIds = this._calculateProblemIds();
      this._checksToDisplay = this._computeChecksToDisplay();
    }
  }

  private _collectWatchedEntityIds(): string[] {
    const ids = new Set<string>();
    const statesPattern = /states\(['"]([^'"]+)['"]\)/g;
    const collectFromTemplate = (val: string | undefined) => {
      if (!val || !val.includes('states(')) return;
      let m: RegExpExecArray | null;
      statesPattern.lastIndex = 0;
      while ((m = statesPattern.exec(val)) !== null) {
        if (m[1]) ids.add(m[1]);
      }
    };

    for (const rule of this._config.checks) {
      if (rule.entity) ids.add(rule.entity);
      for (const cond of rule.conditions ?? []) {
        if (cond.prerequisite_entity) ids.add(cond.prerequisite_entity);
        collectFromTemplate(cond.state);
        collectFromTemplate(cond.attribute_value);
        collectFromTemplate(cond.prerequisite_state);
        collectFromTemplate(cond.prerequisite_attribute_value);
      }
    }
    return Array.from(ids);
  }

  private _computeListStyle(): string {
    const layout = this._config?.layout ?? { mode: 'columns', count: 1 };

    if (layout.mode === 'columns') {
      if (layout.count <= 1) return 'display: flex; flex-direction: column; gap: 12px;';
      return `display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, max(250px, calc(100% / ${layout.count} - 12px))), 1fr)); gap: 12px; align-items: start; align-content: start;`;
    }

    if (layout.mode === 'rows') {
      return `display: grid; grid-template-rows: repeat(${layout.count}, auto); grid-auto-flow: column; gap: 12px; align-items: start; align-content: start; overflow-x: auto; padding-bottom: 8px;`;
    }

    return 'display: flex; flex-direction: column; gap: 12px;';
  }

  private _computeChecksToDisplay(): CheckRule[] {
    let sorted = [...this._config.checks].filter(c => !!c.entity);

    if (this._config.sort !== 'manual') {
      sorted.sort((a, b) => {
        let valA: any = 0;
        let valB: any = 0;

        switch (this._config.sort) {
          case 'status':
            valA = this._problemIds.has(a.id) ? 0 : 1;
            valB = this._problemIds.has(b.id) ? 0 : 1;
            break;
          case 'alphabetical':
            valA = (a.name || a.entity).toLowerCase();
            valB = (b.name || b.entity).toLowerCase();
            break;
          case 'domain':
            valA = a.entity.split('.')[0];
            valB = b.entity.split('.')[0];
            break;
          case 'severity':
            const sevWeight = { 'critical': 0, 'warning': 1, 'info': 2 };
            valA = sevWeight[a.severity || 'info'];
            valB = sevWeight[b.severity || 'info'];
            break;
          case 'last_changed':
            valA = new Date(this.hass.states[a.entity]?.last_changed || 0).getTime();
            valB = new Date(this.hass.states[b.entity]?.last_changed || 0).getTime();
            break;
        }

        if (valA < valB) return this._config.sort_direction === 'desc' ? 1 : -1;
        if (valA > valB) return this._config.sort_direction === 'desc' ? -1 : 1;
        return 0;
      });
    } else if (this._config.sort_direction === 'desc') {
      sorted.reverse();
    }

    return sorted;
  }

  private _calculateProblemIds(): Set<string> {
    if (!this.hass || !this._config?.checks) return new Set();
    return new Set(
      this._config.checks.filter(rule => isRuleProblem(this.hass, rule)).map(rule => rule.id)
    );
  }

  private async _fixCondition(entityId: string, condition: StateCondition) {
    const domain = entityId.split('.')[0];
    const baseServiceData = { entity_id: entityId };

    if (condition.fix_service?.trim()) {
      const fs = condition.fix_service.trim();
      try {
        if (fs.startsWith('{')) {
          const payload = JSON.parse(fs) as {
            service?: string;
            action?: string;
            perform_action?: string;
            data?: Record<string, unknown>;
            service_data?: Record<string, unknown>;
            target?: { entity_id?: string | string[]; device_id?: string | string[]; area_id?: string | string[] };
          };
          // Accept modern `perform_action`/`action` alongside legacy `service` (HA renamed in 2024).
          const svcStr = payload.perform_action || payload.action || payload.service;
          if (typeof svcStr !== 'string' || !svcStr.includes('.')) {
            throw new Error('custom fix_service is missing a valid "service" / "perform_action" field');
          }
          const [d, s] = svcStr.split('.');
          if (!d || !s) throw new Error(`invalid service identifier: ${svcStr}`);
          const mergedData = { ...(payload.service_data || {}), ...(payload.data || {}) };
          // If the user supplied a custom target, respect it; otherwise default to our entity.
          const hasTarget = payload.target && Object.keys(payload.target).length > 0;
          const serviceData = hasTarget ? mergedData : { ...baseServiceData, ...mergedData };
          await this.hass.callService(d, s, serviceData, payload.target);
        } else if (fs.includes('.')) {
          const [d, s] = fs.split('.');
          if (!d || !s) throw new Error(`invalid service identifier: ${fs}`);
          await this.hass.callService(d, s, baseServiceData);
        } else {
          throw new Error(`fix_service must be "domain.service" or a JSON object, got: ${fs}`);
        }
      } catch (e) {
        console.error(localize(this.hass, 'fix_process_error') + ' (Parse/Execute):', e);
        this._errorBanner = localize(this.hass, 'fix_process_error') + ' - ' + String(e);
      }
      return;
    }

    const expected = evaluateExpectedState(this.hass, condition.state);
    const callDetails = getStandardServiceCall(domain, expected, condition);

    try {
      await this.hass.callService(callDetails.domain || domain, callDetails.service, { ...baseServiceData, ...callDetails.serviceData });
    } catch (e) {
       console.error("Service call failed", e);
       this._errorBanner = localize(this.hass, 'fix_process_error') + ' - ' + String(e);
    }
  }

  private async _fixIssue(rule: CheckRule) {
    this._fixingItems = new Set([...this._fixingItems, rule.id]);
    this._errorBanner = null;

    try {
      if (rule.conditions_mode === 'any') {
        const idx = rule.default_condition_index ?? 0;
        const condition = rule.conditions[idx] ?? rule.conditions[0];
        if (condition) await this._fixCondition(rule.entity, condition);
      } else {
        // Re-read the entity state on every iteration so a prior fix that already
        // satisfied a later condition isn't redundantly re-applied.
        for (let i = 0; i < rule.conditions.length; i++) {
          const condition = rule.conditions[i];
          const stateObj = this.hass.states[rule.entity];
          if (!stateObj || !checkCondition(this.hass, stateObj, condition)) {
            await this._fixCondition(rule.entity, condition);
            if (i < rule.conditions.length - 1) {
              await new Promise(r => setTimeout(r, DELAY_BETWEEN_SERVICES));
            }
          }
        }
      }
    } catch (e) {
      console.error(localize(this.hass, 'fix_process_error'), e);
      this._errorBanner = localize(this.hass, 'fix_process_error');
    } finally {
      const remaining = new Set(this._fixingItems);
      remaining.delete(rule.id);
      this._fixingItems = remaining;
    }
  }

  private async _fixAll() {
    this._isFixingAll = true;
    this._errorBanner = null;
    
    const sevWeight = { 'critical': 0, 'warning': 1, 'info': 2 };
    const problems = this._config.checks
      .filter(rule => rule.entity && this._problemIds.has(rule.id))
      .sort((a, b) => sevWeight[a.severity || 'info'] - sevWeight[b.severity || 'info']);
      
    for (const rule of problems) {
      await this._fixIssue(rule);
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_SERVICES));
    }
    this._isFixingAll = false;
  }

  private _handleFixRequested(e: CustomEvent) {
    const rule = this._config.checks.find(r => r.id === e.detail.ruleId);
    if (rule) this._fixIssue(rule);
  }



  render() {
    if (!this._config) return html``;

    const problemCount = this._problemIds.size;
    const hasProblems = problemCount > 0;
    const dir = this.hass?.translationMetadata?.dir ?? (this.hass?.language === 'he' ? 'rtl' : 'ltr');

    const problems = this._checksToDisplay.filter(c => this._problemIds.has(c.id));
    const oks = this._checksToDisplay.filter(c => !this._problemIds.has(c.id));
    
    const showOkMode = this._config.show_ok_section || 'inline';

    if (problemCount === 0 && showOkMode === 'hidden') {
      this.style.display = 'none';
      return html``;
    } else {
      this.style.display = '';
    }

    return html`
      <ha-card dir=${dir} role="region" aria-label=${this._config.title || localize(this.hass, 'title')}>
        ${this._errorBanner ? html`
          <ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${() => this._errorBanner = null}>
            ${this._errorBanner}
          </ha-alert>
        ` : ''}

        <div class="header">
          <div class="header-content">
            <span class="status-icon ${hasProblems ? 'error' : 'success'}">
              <ha-icon icon="${hasProblems ? 'mdi:alert' : 'mdi:check-circle'}"></ha-icon>
            </span>
            <div>
              <div class="title">${this._config.title || localize(this.hass, 'title')}</div>
              <div class="subtitle" aria-live="polite">
                ${hasProblems
                  ? localize(this.hass, 'problems_found', { count: problemCount })
                  : localize(this.hass, 'all_good')}
              </div>
            </div>
          </div>

          <div class="header-actions">
            ${showOkMode === 'collapsed' && oks.length > 0 ? html`
              <button class="ok-toggle-btn" @click=${() => this._showOkExpanded = !this._showOkExpanded}>
                <ha-icon icon="mdi:check-circle"></ha-icon>
                ${this._showOkExpanded ? localize(this.hass, 'hide_ok_items_btn', { count: oks.length }) : localize(this.hass, 'show_ok_items_btn', { count: oks.length })}
              </button>
            ` : ''}

            ${problems.length > 0 ? html`
              <button class="fix-all-btn" @click=${this._fixAll} ?disabled=${this._isFixingAll} aria-label=${localize(this.hass, 'fix_all')}>
                ${this._isFixingAll ? html`<div class="spinner"></div>` : localize(this.hass, 'fix_all')}
              </button>
            ` : ''}
          </div>
        </div>

        <div class="check-list" style="${this._listStyle}" role="list" @fix-requested=${this._handleFixRequested}>
          ${this._renderItems(showOkMode === 'inline' ? this._checksToDisplay : problems)}
          ${showOkMode === 'collapsed' && this._showOkExpanded ? this._renderItems(oks) : ''}
        </div>
      </ha-card>
    `;
  }

  private _renderItems(items: CheckRule[]) {
    return repeat(
      items,
      c => c.id,
      c => html`
        <checklist-card-item
          .rule=${c}
          .hass=${this.hass}
          .stateObj=${this.hass.states[c.entity]}
          .isProblem=${this._problemIds.has(c.id)}
          .isFixing=${this._fixingItems.has(c.id)}
          .severity=${c.severity || 'info'}
        ></checklist-card-item>
      `
    );
  }
}
