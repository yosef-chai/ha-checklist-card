import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HassEntity } from 'home-assistant-js-websocket';
import { actionHandler } from './action-handler';
import { localize } from './localize';
import { evaluateExpectedState, checkCondition, STATES_REF_PATTERN_GLOBAL } from './conditions';
import { MarqueeController, renderMarqueeBody } from './marquee-controller';
import type { CheckRule, HomeAssistant, StateCondition } from './types';

/**
 * Single row component that renders one {@link CheckRule} inside a checklist card.
 * Dispatches bubbling events for fix, snooze, and unsnooze actions.
 *
 * @element checklist-card-item
 * @fires fix-requested - Requests the parent card to execute the fix service for this rule.
 * @fires snooze-requested - Requests the parent card to open the snooze dialog for this rule.
 * @fires unsnooze-requested - Requests the parent card to cancel the active snooze for this rule.
 */
@customElement('checklist-card-item')
export class ChecklistCardItem extends LitElement {
  @property({ attribute: false }) public stateObj!: HassEntity | undefined;
  @property({ attribute: false }) public rule!: CheckRule;
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public isProblem = false;
  @property({ type: Boolean }) public isFixing = false;
  @property({ type: String }) public severity: 'info' | 'warning' | 'critical' = 'info';
  @property({ type: Boolean }) public isSnoozed = false;
  @property({ type: Number }) public snoozeUntil: number | null = null;
  @property({ type: Boolean }) public marqueeEnabled = false;

  @state() private _isTitleOverflowing = false;
  @state() private _isStateOverflowing = false;

  private _marquee = new MarqueeController(this, [
    { parent: '.entity-name', setOverflow: (v) => { this._isTitleOverflowing = v; } },
    { parent: '.entity-state', setOverflow: (v) => { this._isStateOverflowing = v; } },
  ]);

  static styles = css`
    :host {
      display: block;
    }

    .check-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04);
      padding: 12px 16px;
      border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1);
      border-radius: 12px;
      transition: background-color 0.2s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      outline: none;
    }
    .check-item:hover {
      background-color: rgba(128, 128, 128, 0.1);
    }
    .check-item.is-snoozed {
      opacity: 0.75;
    }
    .check-item:focus-visible {
      background-color: rgba(128, 128, 128, 0.1);
    }

    .entity-info-container {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      min-width: 0;
    }

    .icon-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--secondary-background-color);
      color: var(--primary-text-color);
      flex-shrink: 0;
    }

    .icon-wrapper.problem {
      background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
      color: var(--secondary-text-color, #9e9e9e);
    }
    .icon-wrapper.ok {
      background-color: rgba(76, 175, 80, 0.2);
      color: #4caf50;
    }
    .icon-wrapper.snoozed {
      background-color: rgba(229, 155, 45, 0.18);
      color: #e59b2dff;
    }

    .check-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .entity-name {
      font-weight: 500;
      font-size: 14px;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
    }

    .entity-state {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
    }

    /* See checklist-card.styles.ts for the design rationale; mirrored here
       because shadow-DOM scoping forces each component to declare its own. */
    .marquee-track {
      display: inline-flex;
      flex-wrap: nowrap;
      will-change: transform;
    }
    .entity-name.overflowing,
    .entity-state.overflowing {
      text-overflow: clip;
    }
    .entity-name.overflowing .marquee-inner,
    .entity-state.overflowing .marquee-inner {
      flex-shrink: 0;
      padding-inline-end: 2em;
    }

    :host(.marquee-enabled) .entity-name.overflowing .marquee-track,
    :host(.marquee-enabled) .entity-state.overflowing .marquee-track {
      animation: marquee-scroll var(--marquee-duration, 12s) linear infinite;
    }

    :host(.marquee-enabled[dir="rtl"]) .entity-name.overflowing .marquee-track,
    :host(.marquee-enabled[dir="rtl"]) .entity-state.overflowing .marquee-track {
      animation-name: marquee-scroll-rtl;
    }

    .entity-name.overflowing:hover .marquee-track,
    .entity-state.overflowing:hover .marquee-track,
    .entity-name.overflowing:focus-within .marquee-track,
    .entity-state.overflowing:focus-within .marquee-track {
      animation-play-state: paused;
    }

    @keyframes marquee-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes marquee-scroll-rtl {
      from { transform: translateX(0); }
      to   { transform: translateX(50%); }
    }

    @media (prefers-reduced-motion: reduce) {
      .entity-name.overflowing .marquee-track,
      .entity-state.overflowing .marquee-track {
        animation: none !important;
        transform: none !important;
      }
    }

    .fix-btn {
      background-color: #e59b2dff;
      color: #ffffff;
      border: none;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      margin-inline-start: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 60px;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }
    .fix-btn[disabled] {
      background-color: var(--disabled-text-color);
      cursor: not-allowed;
      opacity: 0.7;
    }

    .spinner {
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid #fff;
      border-radius: 50%;
      width: 14px;
      height: 14px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .ok-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--success-color, #4caf50);
      font-size: 13px;
      font-weight: 500;
    }

    .snooze-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      margin-inline-start: 12px;
      flex-shrink: 0;
    }

    .snooze-badge {
      display: flex;
      align-items: center;
      gap: 3px;
      color: #e59b2dff;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }
    .snooze-badge ha-icon {
      --mdc-icon-size: 14px;
      color: #e59b2dff;
    }

    .unsnooze-btn {
      background-color: transparent;
      color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
      border-radius: 12px;
      padding: 4px 10px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
    }
    .unsnooze-btn:hover {
      background-color: var(--secondary-background-color);
    }

  `;

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    // Re-render whenever a non-hass prop actually changed.
    for (const key of changedProps.keys()) {
      if (key !== 'hass') return true;
    }

    // hass-only change: only re-render if something this row actually uses changed.
    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (!oldHass || !this.hass) return true;

    // Watched entity's state changed.
    if (oldHass.states?.[this.rule.entity] !== this.hass.states?.[this.rule.entity]) {
      return true;
    }

    // Any prerequisite entity changed (needed for condition evaluation in templates).
    for (const cond of this.rule.conditions ?? []) {
      const prereq = cond.prerequisite_entity;
      if (prereq && oldHass.states?.[prereq] !== this.hass.states?.[prereq]) {
        return true;
      }
    }

    // Dynamic `states('...')` references inside expected-state strings.
    for (const cond of this.rule.conditions ?? []) {
      for (const val of [cond.state, cond.attribute_value, cond.prerequisite_state, cond.prerequisite_attribute_value]) {
        if (!val || !val.includes('states(')) continue;
        STATES_REF_PATTERN_GLOBAL.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = STATES_REF_PATTERN_GLOBAL.exec(val)) !== null) {
          const id = m[1];
          if (id && oldHass.states?.[id] !== this.hass.states?.[id]) return true;
        }
      }
    }

    // Language, direction, or user identity change (affects localize output / confirmation exemptions / marquee direction).
    if (oldHass.language !== this.hass.language) return true;
    if (oldHass.user?.id !== this.hass.user?.id) return true;
    const oldDir = oldHass.translationMetadata?.dir ?? (oldHass.language === 'he' ? 'rtl' : 'ltr');
    const newDir = this.hass.translationMetadata?.dir ?? (this.hass.language === 'he' ? 'rtl' : 'ltr');
    if (oldDir !== newDir) return true;

    return false;
  }

  private _handleAction(ev: CustomEvent) {
    const action = ev.detail.action;
    if (action === 'fix') return;

    // Hold / double-tap open the snooze dialog when no custom action is configured.
    if (action === 'hold' && !this.rule.hold_action) {
      this.dispatchEvent(new CustomEvent('snooze-requested', {
        detail: { ruleId: this.rule.id },
        bubbles: true,
        composed: true,
      }));
      return;
    }
    if (action === 'double_tap' && this.isProblem && !this.isSnoozed && !this.rule.double_tap_action) {
      this.dispatchEvent(new CustomEvent('snooze-requested', {
        detail: { ruleId: this.rule.id },
        bubbles: true,
        composed: true,
      }));
      return;
    }

    const config = {
      entity: this.rule.entity,
      tap_action: this.rule.tap_action || { action: 'more-info' },
      hold_action: this.rule.hold_action || { action: 'none' },
      double_tap_action: this.rule.double_tap_action || { action: 'none' },
    };

    const event = new CustomEvent('hass-action', {
      detail: { config, action },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }



  private _handleUnsnoozeClick(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('unsnooze-requested', {
      detail: { ruleId: this.rule.id },
      bubbles: true,
      composed: true,
    }));
  }

  private _formatSnoozeTime(): string {
    if (!this.snoozeUntil) return '';
    const d = new Date(this.snoozeUntil);
    const now = new Date();
    const opts: Intl.DateTimeFormatOptions =
      d.toDateString() === now.toDateString()
        ? { hour: '2-digit', minute: '2-digit' }
        : { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return d.toLocaleString(this.hass?.language ?? 'en', opts);
  }

  private _handleFixClick(e: Event) {
    e.stopPropagation();
    if (this.isFixing) return;

    if (this.rule.confirmation) {
      let text = localize(this.hass, 'confirm_fix', { name: this.rule.name || this.rule.entity });
      if (typeof this.rule.confirmation === 'object') {
        if (this.rule.confirmation.exemptions?.some(ex => ex.user === this.hass.user?.id)) {
          // user is in exemption list — skip the confirmation dialog
        } else {
          text = this.rule.confirmation.text || text;
          if (!window.confirm(text)) return;
        }
      } else if (this.rule.confirmation === true) {
        if (!window.confirm(text)) return;
      }
    }

    const actionConfig = this.rule.fix_action;
    if (actionConfig && actionConfig.action !== 'fix') {
      const event = new CustomEvent('hass-action', {
        detail: { config: { entity: this.rule.entity, tap_action: actionConfig }, action: 'tap' },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
      return;
    }

    this.dispatchEvent(new CustomEvent('fix-requested', {
      detail: { ruleId: this.rule.id },
      bubbles: true,
      composed: true,
    }));
  }

  private _renderTitleSpan(displayName: string) {
    const showMarquee = this._isTitleOverflowing && this.marqueeEnabled;
    const content = html`${displayName}${this.rule.show_last_changed && this.stateObj ? html`
      <span style="font-size: 0.8em; opacity: 0.7; margin-inline-start: 4px;">
        <ha-relative-time .hass=${this.hass} .datetime=${this.stateObj.last_changed}></ha-relative-time>
      </span>
    ` : ''}`;
    const colorStyle = this.rule.color ? `color: ${this.rule.color}` : '';
    return html`
      <span class="entity-name ${showMarquee ? 'overflowing' : ''}" style=${colorStyle}>
        ${renderMarqueeBody(content, showMarquee)}
      </span>
    `;
  }

  private _renderStateSpan(content: unknown) {
    const showMarquee = this._isStateOverflowing && this.marqueeEnabled;
    return html`
      <span class="entity-state ${showMarquee ? 'overflowing' : ''}">
        ${renderMarqueeBody(content, showMarquee)}
      </span>
    `;
  }

  private _renderSingleConditionStatus(condition: StateCondition, currentState: string) {
    const expectedState = evaluateExpectedState(this.hass, condition.state);
    const hasAttr = !!condition.attribute?.trim();
    const expectedAttrValue = hasAttr
      ? evaluateExpectedState(this.hass, condition.attribute_value || condition.state)
      : null;

    const content = html`${localize(this.hass, 'current_state')}: ${currentState} (${localize(this.hass, 'required')}: ${expectedState})${hasAttr ? html` · ${localize(this.hass, 'attribute')} ${condition.attribute}: ${this.stateObj?.attributes?.[condition.attribute!] ?? localize(this.hass, 'not_exists')} (${localize(this.hass, 'required')}: ${expectedAttrValue})` : ''}`;
    return this._renderStateSpan(content);
  }

  private _renderMultiConditionStatus(currentState: string) {
    if (this.rule.conditions_mode === 'any') {
      const stateList = this.rule.conditions.map(c => evaluateExpectedState(this.hass, c.state)).join(', ');
      const defaultIdx = this.rule.default_condition_index ?? 0;
      const fixTarget = evaluateExpectedState(
        this.hass,
        this.rule.conditions[defaultIdx]?.state ?? this.rule.conditions[0]?.state
      );
      const content = html`${localize(this.hass, 'current_state')}: ${currentState} · ${localize(this.hass, 'accepted_one_of')}: ${stateList} · ${localize(this.hass, 'fix_target')}: ${fixTarget}`;
      return this._renderStateSpan(content);
    }

    const failingConditions = this.stateObj
      ? this.rule.conditions.filter(c => !checkCondition(this.hass, this.stateObj!, c))
      : this.rule.conditions;
    const failInfo = failingConditions.map(c => {
      const s = evaluateExpectedState(this.hass, c.state);
      const attrPart = c.attribute?.trim() ? ` | ${c.attribute}=${evaluateExpectedState(this.hass, c.attribute_value || c.state)}` : '';
      return `${localize(this.hass, 'status')}=${s}${attrPart}`;
    }).join(' · ');
    const content = html`${localize(this.hass, 'current_state')}: ${currentState} · ${localize(this.hass, 'required')}: ${failInfo}`;
    return this._renderStateSpan(content);
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    const dir = this.hass?.translationMetadata?.dir ?? (this.hass?.language === 'he' ? 'rtl' : 'ltr');
    this.setAttribute('dir', dir);
    this.classList.toggle('marquee-enabled', this.marqueeEnabled);
    // MarqueeController re-measures via hostUpdated() automatically.
  }

  render() {
    const currentState = this.stateObj?.state ?? localize(this.hass, 'unavailable');
    const isMulti = this.rule.conditions.length > 1;
    const displayName = this.rule.name || this.stateObj?.attributes?.friendly_name || this.rule.entity;

    const role = 'listitem';
    const ariaLabel = `${displayName}, ${localize(this.hass, this.isProblem ? 'status_problem' : 'status_ok')}`;

    let icon = this.rule.icon;

    return html`
      <div
        class="check-item${this.isSnoozed ? ' is-snoozed' : ''}"
        role=${role}
        aria-label=${ariaLabel}
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
      hasHold: true,
      hasDoubleClick: true
    })}
        tabindex="0"
      >
        <ha-ripple></ha-ripple>
        <div class="entity-info-container">
          <div class="icon-wrapper ${this.isSnoozed ? 'snoozed' : this.isProblem ? 'problem' : 'ok'}">
            ${icon
        ? html`<ha-icon .icon=${icon}></ha-icon>`
        : html`<ha-state-icon class="entity-icon" .hass=${this.hass} .stateObj=${this.stateObj}></ha-state-icon>`
      }
          </div>
          <div class="check-text">
            ${this._renderTitleSpan(displayName)}
            ${this.isProblem || this.isSnoozed
        ? isMulti
          ? this._renderMultiConditionStatus(currentState)
          : this._renderSingleConditionStatus(this.rule.conditions[0], currentState)
        : this._renderStateSpan(html`${localize(this.hass, 'status')}: ${currentState}`)
      }
          </div>
        </div>
        ${this.isSnoozed ? html`
          <div class="snooze-actions">
            <span class="snooze-badge">
              <ha-icon icon="mdi:alarm-snooze"></ha-icon>
              ${this.snoozeUntil ? localize(this.hass, 'snoozed_until', { time: this._formatSnoozeTime() }) : localize(this.hass, 'snooze')}
            </span>
            <button class="unsnooze-btn" @click=${this._handleUnsnoozeClick}>
              ${localize(this.hass, 'unsnooze')}
            </button>
          </div>
        ` : this.isProblem ? html`
          <button
            class="fix-btn"
            @click=${this._handleFixClick}
            ?disabled=${this.isFixing}
            aria-label=${localize(this.hass, 'fix')}
            aria-busy=${this.isFixing}
          >
            ${this.isFixing
          ? html`<div class="spinner"></div>`
          : html`${localize(this.hass, 'fix')}`
        }
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
  }
}
