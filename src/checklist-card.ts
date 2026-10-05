import { LitElement, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { cardStyles } from './checklist-card.styles';
import { localize, localizeStatic } from './localize';
import { canFixRule, ensureCheckId, getStandardServiceCall, ensureDefaults, entityDisplayName, newCheckId } from './utils';
import { isRuleProblem, checkCondition, evaluateExpectedState, STATES_REF_PATTERN_GLOBAL } from './conditions';
import type { HomeAssistant, CardConfig, CheckRule, StateCondition, SnoozeData } from './types';
import { DELAY_BETWEEN_SERVICES } from './types';
import { MarqueeController, renderMarqueeBody } from './marquee-controller';
import { preloadEditorComponents, schedulePreloadEditorComponents } from './preload-editor';
import './checklist-card-item';

/**
 * Lovelace card that monitors a list of entity state checks, highlights
 * problems, and provides one-click service calls to resolve them.
 *
 * @element checklist-card
 */
@customElement('checklist-card')
export class ChecklistCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  // Set by HA's hui-card while the card is shown in the editor preview / edit mode.
  @property({ type: Boolean }) public preview = false;

  @state() private _config!: CardConfig;
  @state() private _isFixingAll = false;
  @state() private _fixingItems: Set<string> = new Set();
  @state() private _errorBanner: string | null = null;
  @state() private _showOkExpanded = false;
  @state() private _showSnoozedExpanded = false;
  @state() private _snoozeData: SnoozeData = {};
  @state() private _snoozeDialogRule: CheckRule | null = null;
  @state() private _customSnoozeHours = '';
  @state() private _confirmRules: CheckRule[] | null = null;
  @query('dialog') private _dialogEl?: HTMLDialogElement;
  @state() private _isTitleOverflowing = false;
  @state() private _isSubtitleOverflowing = false;
  private _problemIds: Set<string> = new Set();
  private _snoozedIds: Set<string> = new Set();
  private _checksToDisplay: CheckRule[] = [];
  private _listStyle = 'display: flex; flex-direction: column; gap: 12px;';
  private _watchedEntityIds: string[] = [];
  private _snoozeTimer: number | null = null;
  private _snoozeDataLoaded = false;
  private _isHidden = false;
  private _marquee = new MarqueeController(this, [
    { parent: '.title', setOverflow: (v) => { this._isTitleOverflowing = v; } },
    { parent: '.subtitle', setOverflow: (v) => { this._isSubtitleOverflowing = v; } },
  ]);

  static styles = cardStyles;

  static async getConfigElement() {
    // Preload HA's editor-only components (ha-form, ha-entity-picker, ha-icon-picker, ...)
    // BEFORE returning the editor element — otherwise the editor mounts first and has to
    // show a "loading" placeholder while the pickers register, which flashes briefly on open.
    // HA awaits this promise, so any work done here happens behind HA's own dialog spinner.
    await Promise.all([
      import('./checklist-card-editor'),
      preloadEditorComponents(),
    ]);
    return document.createElement('checklist-card-editor');
  }

  getCardSize(): number {
    const checks = this._config?.checks?.length ?? 1;
    const cols = this._layoutCols();
    const itemsPerCol = Math.ceil(checks / cols);
    return Math.max(2, Math.ceil(itemsPerCol * 1.2) + 2);
  }

  getGridOptions() {
    // A list card reads best at full section width (like HA's entities card).
    // Height follows the content, which changes with the number of problems.
    // Multi-column layouts need the whole width; a single list can shrink to half.
    const multiColumn = this._config?.layout?.mode === 'columns' && this._layoutCols() > 1;
    return {
      columns: 12,
      rows: 'auto' as const,
      min_columns: multiColumn ? 12 : 6,
      min_rows: 2,
    };
  }


  private _layoutCols(): number {
    const layout = this._config?.layout;
    return layout?.mode === 'columns' ? Math.max(1, layout.count || 1) : 1;
  }

  // HA passes the entities shown on the dashboard (and a fallback list), so the
  // card picker preview can show a real check instead of an empty card.
  static getStubConfig(_hass?: HomeAssistant, entities: string[] = [], entitiesFallback: string[] = []): CardConfig {
    const candidates = [...entities, ...entitiesFallback];
    const entity = candidates.find(e => /^(light|switch|input_boolean|fan|lock)\./.test(e)) ?? '';
    const okState = entity.startsWith('lock.') ? 'locked' : 'off';
    return {
      type: 'custom:checklist-card',
      title: localizeStatic('title'),
      checks: [{
        id: newCheckId(),
        entity,
        conditions: [{ state: okState }],
        conditions_mode: 'any',
        default_condition_index: 0,
      }],
      layout: { mode: 'columns', count: 1 },
      sort: 'status',
    };
  }

  setConfig(config: CardConfig) {
    if (!config || !Array.isArray(config.checks) || config.checks.some(c => !c || typeof c !== 'object')) {
      throw new Error(localize(this.hass, 'config_error'));
    }
    const safeConfig = ensureDefaults(config);
    this._config = {
      ...safeConfig,
      checks: safeConfig.checks.map((c, i) => ensureCheckId(c, i)),
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._scheduleNextSnoozeExpiry();
    // Warm up HA's editor components (ha-form, ha-entity-picker, ...) during
    // idle time so opening the visual editor is instant instead of waiting
    // for HA to lazy-load them on first open.
    schedulePreloadEditorComponents();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearSnoozeTimer();
  }

  private _clearSnoozeTimer() {
    if (this._snoozeTimer !== null) {
      clearTimeout(this._snoozeTimer);
      this._snoozeTimer = null;
    }
  }

  // Wake up exactly when the next snooze expires instead of polling every minute.
  // Keeps the event loop quiet when nothing is snoozed.
  private _scheduleNextSnoozeExpiry() {
    this._clearSnoozeTimer();
    const now = Date.now();
    let nextExpiry = Infinity;
    for (const expiry of Object.values(this._snoozeData)) {
      if (expiry > now && expiry < nextExpiry) nextExpiry = expiry;
    }
    if (!isFinite(nextExpiry)) return;
    // Cap at the 32-bit setTimeout limit; anything longer re-schedules on the next firing.
    const delay = Math.min(nextExpiry - now + 50, 2_147_483_000);
    this._snoozeTimer = window.setTimeout(() => {
      this._snoozeTimer = null;
      this._snoozedIds = this._calculateSnoozedIds();
      this._problemIds = this._calculateProblemIds();
      this.requestUpdate();
      this._scheduleNextSnoozeExpiry();
    }, Math.max(0, delay));
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('hass') && this.hass && !this._snoozeDataLoaded) {
      this._snoozeDataLoaded = true;
      this._loadSnoozeData();
    }
    const dir = this.hass?.translationMetadata?.dir ?? (this.hass?.language === 'he' ? 'rtl' : 'ltr');
    this.setAttribute('dir', dir);
    const marqueeEnabled = this._config?.text_mode === 'scroll';
    this.classList.toggle('marquee-enabled', marqueeEnabled);
    // MarqueeController re-measures via hostUpdated() automatically.

    // show_ok_section: hidden + nothing to report → hide the whole card.
    // hui-card reads `hidden` on card-visibility-changed, so the sections grid
    // drops the empty slot instead of leaving a gap. Never hide in the editor preview.
    const hide = !this.preview && this._shouldHideCard();
    if (hide !== this._isHidden) {
      this._isHidden = hide;
      this.hidden = hide;
      this.dispatchEvent(new CustomEvent('card-visibility-changed', {
        detail: { value: !hide },
        bubbles: true,
        composed: true,
      }));
    }

    const dialog = this._dialogEl;
    if (dialog && !dialog.open) dialog.showModal();
  }

  private _shouldHideCard(): boolean {
    return !!this._config
      && this._config.show_ok_section === 'hidden'
      && this._problemIds.size === 0
      && this._snoozedIds.size === 0;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    // Always update when config, internal state, or non-hass props change.
    if (changedProps.size > 1 || !changedProps.has('hass')) return true;

    // hass-only change: skip re-render unless a watched entity actually changed.
    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (!oldHass) return true;
    if (this._watchedEntityIds.length === 0) return true;
    if (oldHass.language !== this.hass.language) return true;

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

    // Recompute derived state whenever config, hass, or snooze data changed.
    if (changedProps.has('_config') || changedProps.has('hass') || changedProps.has('_snoozeData')) {
      this._snoozedIds = this._calculateSnoozedIds();
      this._problemIds = this._calculateProblemIds();
      this._checksToDisplay = this._computeChecksToDisplay();
    }

    // Re-aim the timer at the soonest expiry whenever the snooze map changes.
    if (changedProps.has('_snoozeData')) {
      this._scheduleNextSnoozeExpiry();
    }
  }

  private _collectWatchedEntityIds(): string[] {
    const ids = new Set<string>();
    const collectFromTemplate = (val: string | undefined) => {
      if (!val || !val.includes('states(')) return;
      let m: RegExpExecArray | null;
      STATES_REF_PATTERN_GLOBAL.lastIndex = 0;
      while ((m = STATES_REF_PATTERN_GLOBAL.exec(val)) !== null) {
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
    const sorted = [...this._config.checks].filter(c => !!c.entity);

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
          case 'severity': {
            const sevWeight = { 'critical': 0, 'warning': 1, 'info': 2 };
            valA = sevWeight[a.severity || 'info'];
            valB = sevWeight[b.severity || 'info'];
            break;
          }
          case 'last_changed':
            valA = new Date(this.hass?.states[a.entity]?.last_changed || 0).getTime();
            valB = new Date(this.hass?.states[b.entity]?.last_changed || 0).getTime();
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

  private _calculateSnoozedIds(): Set<string> {
    if (!this._config?.checks) return new Set();
    const now = Date.now();
    return new Set(
      this._config.checks
        .filter(rule => rule.entity && this._snoozeData[rule.id] && this._snoozeData[rule.id] > now)
        .map(rule => rule.id)
    );
  }

  private _calculateProblemIds(): Set<string> {
    if (!this.hass || !this._config?.checks) return new Set();
    return new Set(
      this._config.checks
        .filter(rule => isRuleProblem(this.hass, rule) && !this._snoozedIds.has(rule.id))
        .map(rule => rule.id)
    );
  }

  private async _loadSnoozeData() {
    if (!this.hass?.callWS) return;
    try {
      const result = await this.hass.callWS<{ value: SnoozeData | null }>({
        type: 'frontend/get_user_data',
        key: 'checklist_card_snooze_v1',
      });
      if (result?.value && typeof result.value === 'object') {
        // Prune already-expired entries on load
        const now = Date.now();
        const pruned: SnoozeData = {};
        for (const [id, expiry] of Object.entries(result.value)) {
          if (expiry > now) pruned[id] = expiry;
        }
        this._snoozeData = pruned;
      }
    } catch (e) {
      console.warn('[checklist-card] Could not load snooze data:', e);
    }
  }

  private async _saveSnoozeData() {
    if (!this.hass?.callWS) return;
    try {
      await this.hass.callWS({
        type: 'frontend/set_user_data',
        key: 'checklist_card_snooze_v1',
        value: this._snoozeData,
      });
    } catch (e) {
      console.warn('[checklist-card] Could not save snooze data:', e);
    }
  }

  private async _snoozeItem(rule: CheckRule, hours: number) {
    const expiry = Date.now() + hours * 3_600_000;
    this._snoozeData = { ...this._snoozeData, [rule.id]: expiry };
    this._closeDialog();
    await this._saveSnoozeData();
  }

  private async _unsnoozeItem(ruleId: string) {
    const updated = { ...this._snoozeData };
    delete updated[ruleId];
    this._snoozeData = updated;
    await this._saveSnoozeData();
  }

  private _formatSnoozeExpiry(expiry: number): string {
    const d = new Date(expiry);
    const now = new Date();
    const lang = this.hass?.language ?? 'en';
    const opts: Intl.DateTimeFormatOptions =
      d.toDateString() === now.toDateString()
        ? { hour: '2-digit', minute: '2-digit' }
        : { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return d.toLocaleString(lang, opts);
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

  private _needsConfirmation(rule: CheckRule): boolean {
    const confirmation = rule.confirmation;
    if (!confirmation) return false;
    if (typeof confirmation === 'object'
      && confirmation.exemptions?.some(ex => ex.user === this.hass?.user?.id)) {
      return false;
    }
    return true;
  }

  private _problemRulesBySeverity(): CheckRule[] {
    const sevWeight = { 'critical': 0, 'warning': 1, 'info': 2 };
    return this._config.checks
      .filter(rule => rule.entity && this._problemIds.has(rule.id) && canFixRule(rule))
      .sort((a, b) => sevWeight[a.severity || 'info'] - sevWeight[b.severity || 'info']);
  }

  private _handleFixAllClick() {
    const problems = this._problemRulesBySeverity();
    if (problems.length === 0) return;
    if (problems.some(rule => this._needsConfirmation(rule))) {
      this._confirmRules = problems;
      return;
    }
    this._fixAll(problems);
  }

  private async _fixAll(problems: CheckRule[]) {
    this._isFixingAll = true;
    this._errorBanner = null;
    try {
      for (const rule of problems) {
        await this._fixIssue(rule);
        await new Promise(r => setTimeout(r, DELAY_BETWEEN_SERVICES));
      }
    } finally {
      this._isFixingAll = false;
    }
  }

  private _handleFixRequested(e: CustomEvent) {
    const rule = this._config.checks.find(r => r.id === e.detail.ruleId);
    if (!rule) return;
    if (this._needsConfirmation(rule)) {
      this._confirmRules = [rule];
      return;
    }
    this._fixIssue(rule);
  }

  private _handleConfirm() {
    const rules = this._confirmRules;
    this._closeDialog();
    if (!rules) return;
    if (rules.length === 1) this._fixIssue(rules[0]);
    else this._fixAll(rules);
  }

  private _closeDialog() {
    this._snoozeDialogRule = null;
    this._confirmRules = null;
    this._customSnoozeHours = '';
  }

  private _handleDialogClick(ev: MouseEvent) {
    // A click on the <dialog> element itself (not its content) is a backdrop click.
    if (ev.target === ev.currentTarget) this._closeDialog();
  }

  private _handleDialogCancel(ev: Event) {
    // Escape key: let Lit drive the close so state and DOM stay in sync.
    ev.preventDefault();
    this._closeDialog();
  }

  private _handleSnoozeRequested(e: CustomEvent) {
    const rule = this._config.checks.find(r => r.id === e.detail.ruleId);
    if (rule) this._snoozeDialogRule = rule;
  }

  private _handleUnsnoozeRequested(e: CustomEvent) {
    this._unsnoozeItem(e.detail.ruleId);
  }

  private _handleCustomSnooze() {
    const hours = parseFloat(this._customSnoozeHours);
    if (this._snoozeDialogRule && hours > 0 && hours <= 8760) {
      this._snoozeItem(this._snoozeDialogRule, hours);
    }
  }

  render() {
    if (!this._config || !this.hass) return nothing;

    const problemCount = this._problemIds.size;
    const hasProblems = problemCount > 0;
    const dir = this.hass.translationMetadata?.dir ?? (this.hass.language === 'he' ? 'rtl' : 'ltr');
    const snoozedCount = this._snoozedIds.size;

    const problems = this._checksToDisplay.filter(c => this._problemIds.has(c.id));
    const oks = this._checksToDisplay.filter(c => !this._problemIds.has(c.id) && !this._snoozedIds.has(c.id));
    const snoozed = this._config.checks.filter(c => c.entity && this._snoozedIds.has(c.id));

    const showOkMode = this._config.show_ok_section || 'inline';

    // In manual sort + inline mode, respect the user's exact ordering instead of
    // floating problems to the top. For non-manual sorts, problems-first is the
    // intended behaviour (the sort_status mode would otherwise be redundant).
    const useManualInlineOrder =
      (this._config.sort || 'manual') === 'manual' && showOkMode === 'inline';
    const inlineItems = showOkMode === 'inline'
      ? (useManualInlineOrder
          ? this._checksToDisplay.filter(c => !this._snoozedIds.has(c.id))
          : [...problems, ...oks])
      : problems;

    if (!this.preview && this._shouldHideCard()) return nothing;

    return html`
      <ha-card dir=${dir} role="region" aria-label=${this._config.title || localize(this.hass, 'title')}>
        ${this._errorBanner ? html`
          <div class="error-banner" role="alert">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            <span class="error-text">${this._errorBanner}</span>
            <button class="icon-btn" aria-label=${localize(this.hass, 'dismiss')} @click=${() => { this._errorBanner = null; }}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
        ` : ''}

        <div class="header">
          <div class="header-content">
            <span class="status-icon ${hasProblems ? 'error' : 'success'}">
              <ha-icon icon="${hasProblems ? 'mdi:alert' : 'mdi:check-circle'}"></ha-icon>
            </span>
            <div class="header-text">
              ${this._renderHeaderTitle()}
              ${this._renderHeaderSubtitle(hasProblems, problemCount, snoozedCount)}
            </div>
          </div>

          <div class="header-actions">
            ${showOkMode === 'collapsed' && oks.length > 0 ? html`
              <button class="ok-toggle-btn" @click=${() => this._showOkExpanded = !this._showOkExpanded}>
                <ha-icon icon="mdi:check-circle"></ha-icon>
                ${this._showOkExpanded ? localize(this.hass, 'hide_ok_items_btn', { count: oks.length }) : localize(this.hass, 'show_ok_items_btn', { count: oks.length })}
              </button>
            ` : ''}

            ${snoozed.length > 0 ? html`
              <button class="ok-toggle-btn" @click=${() => this._showSnoozedExpanded = !this._showSnoozedExpanded}>
                <ha-icon icon="mdi:alarm-snooze" style="color: var(--warning-color, #e59b2d);"></ha-icon>
                ${this._showSnoozedExpanded
          ? localize(this.hass, 'snoozed_section_hide', { count: snoozed.length })
          : localize(this.hass, 'snoozed_section_show', { count: snoozed.length })}
              </button>
            ` : ''}

            ${problems.some(canFixRule) ? html`
              <button class="fix-all-btn" @click=${this._handleFixAllClick} ?disabled=${this._isFixingAll} aria-label=${localize(this.hass, 'fix_all')}>
                ${this._isFixingAll ? html`<div class="spinner"></div>` : localize(this.hass, 'fix_all')}
              </button>
            ` : ''}
          </div>
        </div>

        <div
          class="check-list"
          style="${this._listStyle}"
          role="list"
          @fix-requested=${this._handleFixRequested}
          @snooze-requested=${this._handleSnoozeRequested}
          @unsnooze-requested=${this._handleUnsnoozeRequested}
        >
          ${this._renderItems(inlineItems)}
          ${showOkMode === 'collapsed' && this._showOkExpanded ? this._renderItems(oks) : ''}
          ${this._showSnoozedExpanded ? this._renderSnoozedItems(snoozed) : ''}
        </div>
      </ha-card>

      ${this._renderDialog()}
    `;
  }

  private _renderDialog() {
    const snoozeRule = this._snoozeDialogRule;
    const confirmRules = this._confirmRules;
    if (!snoozeRule && !confirmRules) return nothing;

    const heading = snoozeRule
      ? localize(this.hass, 'snooze_dialog_title')
      : localize(this.hass, 'confirm_title');

    return html`
      <dialog
        aria-labelledby="dialog-heading"
        @click=${this._handleDialogClick}
        @cancel=${this._handleDialogCancel}
      >
        <div class="dialog-surface">
          <h2 class="dialog-heading" id="dialog-heading">${heading}</h2>
          ${snoozeRule ? this._renderSnoozeBody(snoozeRule) : this._renderConfirmBody(confirmRules!)}
        </div>
      </dialog>
    `;
  }

  private _renderSnoozeBody(rule: CheckRule) {
    const hours = parseFloat(this._customSnoozeHours);
    const customValid = hours > 0 && hours <= 8760;
    return html`
      <div class="dialog-body">
        <div class="snooze-dialog-entity">${entityDisplayName(this.hass, rule)}</div>
        <p class="snooze-dialog-desc">${localize(this.hass, 'snooze_dialog_desc')}</p>
        <div class="snooze-presets">
          ${([1, 2, 4, 8, 24, 72] as const).map((h, i) => html`
            <button class="chip-btn" @click=${() => this._snoozeItem(rule, h)}>
              ${localize(this.hass, (['snooze_1h', 'snooze_2h', 'snooze_4h', 'snooze_8h', 'snooze_24h', 'snooze_3d'] as const)[i])}
            </button>
          `)}
        </div>
        <label class="snooze-custom-label" for="snooze-hours">${localize(this.hass, 'snooze_custom_label')}</label>
        <input
          id="snooze-hours"
          type="number"
          inputmode="decimal"
          class="snooze-custom-input"
          min="0.5"
          max="8760"
          step="0.5"
          .value=${this._customSnoozeHours}
          @input=${(e: Event) => { this._customSnoozeHours = (e.target as HTMLInputElement).value; }}
          @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter' && customValid) this._handleCustomSnooze(); }}
          placeholder=${localize(this.hass, 'snooze_custom_placeholder')}
        />
      </div>
      <div class="dialog-footer">
        <button class="dialog-btn" @click=${this._closeDialog}>${localize(this.hass, 'cancel')}</button>
        <button class="dialog-btn primary" ?disabled=${!customValid} @click=${this._handleCustomSnooze}>
          ${localize(this.hass, 'snooze_confirm_btn')}
        </button>
      </div>
    `;
  }

  private _renderConfirmBody(rules: CheckRule[]) {
    let text: string;
    if (rules.length === 1) {
      const rule = rules[0];
      const custom = typeof rule.confirmation === 'object' ? rule.confirmation.text : undefined;
      text = custom || localize(this.hass, 'confirm_fix', { name: entityDisplayName(this.hass, rule) });
    } else {
      text = localize(this.hass, 'confirm_fix_all', { count: rules.length });
    }
    return html`
      <div class="dialog-body">
        <p class="confirm-text">${text}</p>
        ${rules.length > 1 ? html`
          <ul class="confirm-list">
            ${rules.map(rule => html`<li>${entityDisplayName(this.hass, rule)}</li>`)}
          </ul>
        ` : nothing}
      </div>
      <div class="dialog-footer">
        <button class="dialog-btn" @click=${this._closeDialog}>${localize(this.hass, 'cancel')}</button>
        <button class="dialog-btn primary" autofocus @click=${this._handleConfirm}>
          ${localize(this.hass, rules.length > 1 ? 'fix_all' : 'fix')}
        </button>
      </div>
    `;
  }

  private _renderHeaderTitle() {
    const marqueeEnabled = this._config?.text_mode === 'scroll';
    const showMarquee = this._isTitleOverflowing && marqueeEnabled;
    const content = this._config.title || localize(this.hass, 'title');
    return html`
      <div class="title ${showMarquee ? 'overflowing' : ''}">
        ${renderMarqueeBody(content, showMarquee)}
      </div>
    `;
  }

  private _renderHeaderSubtitle(hasProblems: boolean, problemCount: number, snoozedCount: number) {
    const marqueeEnabled = this._config?.text_mode === 'scroll';
    const showMarquee = this._isSubtitleOverflowing && marqueeEnabled;
    const content = html`${hasProblems
      ? localize(this.hass, 'problems_found', { count: problemCount })
      : localize(this.hass, 'all_good')}${snoozedCount > 0 ? html`
        <span class="snooze-count-badge">
          <ha-icon icon="mdi:alarm-snooze" style="--mdc-icon-size: 13px; vertical-align: middle;"></ha-icon>
          ${snoozedCount}
        </span>
      ` : ''}`;
    return html`
      <div class="subtitle ${showMarquee ? 'overflowing' : ''}" aria-live="polite">
        ${renderMarqueeBody(content, showMarquee)}
      </div>
    `;
  }

  private _renderItems(items: CheckRule[]) {
    const marqueeEnabled = this._config?.text_mode === 'scroll';
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
          .marqueeEnabled=${marqueeEnabled}
        ></checklist-card-item>
      `
    );
  }

  private _renderSnoozedItems(items: CheckRule[]) {
    const marqueeEnabled = this._config?.text_mode === 'scroll';
    return repeat(
      items,
      c => c.id,
      c => html`
        <checklist-card-item
          .rule=${c}
          .hass=${this.hass}
          .stateObj=${this.hass.states[c.entity]}
          .isProblem=${false}
          .isFixing=${false}
          .isSnoozed=${true}
          .snoozeUntil=${this._snoozeData[c.id] ?? null}
          .severity=${c.severity || 'info'}
          .marqueeEnabled=${marqueeEnabled}
        ></checklist-card-item>
      `
    );
  }
}
