import { a as e, c as t, d as n, f as r, g as i, h as a, i as o, l as s, m as c, n as l, o as u, p as d, r as f, s as p, u as m } from "./checklist-card-editor-z_F0kS6E.mjs";
//#region src/checklist-card.styles.ts
var h = i`
  :host {
    display: block;
    container-type: inline-size;
    font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
    height: 100%;
  }

  ha-card {
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--secondary-background-color);
    transition: background-color 0.3s ease;
  }
  .status-icon ha-icon { --mdc-icon-size: 24px; }

  .status-icon.success {
    background-color: rgba(var(--rgb-success-color, 76, 175, 80), 0.15);
    color: var(--success-color, #4caf50);
  }
  .status-icon.error {
    background-color: rgba(var(--rgb-error-color, 244, 67, 54), 0.15);
    color: var(--error-color, #f44336);
  }

  .title {
    color: var(--ha-card-header-color, var(--primary-text-color));
    font-family: var(--ha-card-header-font-family, inherit);
    font-size: var(--ha-card-header-font-size, 20px);
    font-weight: 500;
    letter-spacing: -0.012em;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 14px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  .fix-all-btn {
    background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    transition: opacity 0.2s;
  }
  .fix-all-btn:hover:not([disabled]) {
    opacity: 0.8;
  }

  .check-list {
    padding: 4px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .check-list::-webkit-scrollbar { width: 6px; }
  .check-list::-webkit-scrollbar-track { background: transparent; }
  .check-list::-webkit-scrollbar-thumb { background-color: var(--divider-color); border-radius: 3px; }



  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-inline-start: auto;
  }

  .ok-toggle-btn {
    background-color: transparent;
    color: var(--secondary-text-color);
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: background-color 0.2s;
    white-space: nowrap;
  }
  .ok-toggle-btn:hover {
    background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
  }
  .ok-toggle-btn ha-icon {
    --mdc-icon-size: 18px;
    color: var(--success-color, #4caf50);
  }

  button.fix-btn[disabled], .fix-all-btn[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .spinner {
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    border: 2px solid currentColor;
    border-radius: 50%;
    border-left-color: transparent;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @container (max-width: 450px) {
    .header { flex-direction: column; align-items: flex-start; }
    .fix-all-btn { width: 100%; margin-top: 8px; }
  }
`;
//#endregion
//#region src/conditions.ts
function g(e, t) {
	if (!t || !t.includes("states(")) return t;
	try {
		let n = t.match(/states\(['"]([^'"]+)['"]\)/);
		if (n?.[1] && e.states[n[1]]) return e.states[n[1]].state;
	} catch (e) {
		console.warn("Error parsing expected pattern", e);
	}
	return t;
}
function _(e, t, n) {
	if (n.prerequisite_entity?.trim()) {
		let t = e.states[n.prerequisite_entity];
		if (t) {
			let r;
			if (n.prerequisite_attribute?.trim()) {
				let i = t.attributes?.[n.prerequisite_attribute], a = n.prerequisite_attribute_value?.trim() ? n.prerequisite_attribute_value : n.prerequisite_state || "on";
				if (a = g(e, a), a.startsWith("!=")) {
					let e = a.slice(2).split(",").map((e) => e.trim());
					r = i !== void 0 && !e.includes(String(i));
				} else {
					let e = a.split(",").map((e) => e.trim());
					r = i !== void 0 && e.includes(String(i));
				}
			} else {
				let i = n.prerequisite_state || "on";
				i = g(e, i), r = i.startsWith("!=") ? !i.slice(2).split(",").map((e) => e.trim()).includes(t.state) : i.split(",").map((e) => e.trim()).includes(t.state);
			}
			if (!r) return !0;
		}
	}
	let r = t.state;
	if (r === "unavailable" || r === "unknown") return !1;
	if (n.attribute?.trim()) {
		let r = t.attributes?.[n.attribute], i = g(e, n.attribute_value?.trim() ? n.attribute_value : n.state);
		return r !== void 0 && String(r) === String(i);
	}
	return r === g(e, n.state);
}
function v(e, t) {
	if (!t.entity) return !1;
	let n = e.states[t.entity];
	if (!n) return !0;
	let r = t.conditions.map((t) => _(e, n, t));
	return t.conditions_mode === "all" ? !r.every(Boolean) : !r.some(Boolean);
}
//#endregion
//#region src/action-handler.ts
var y = class extends HTMLElement {
	constructor(...e) {
		super(...e), this.holdTime = 500;
	}
	bind(e, t) {
		if (e.__actionHandlerBound) {
			e.__actionHandlerOptions = t;
			return;
		}
		e.__actionHandlerBound = !0, e.__actionHandlerOptions = t;
		let n, r = !1, i, a = () => e.__actionHandlerOptions, o = () => {
			n &&= (clearTimeout(n), void 0);
		}, s = (t) => {
			let n = new CustomEvent("action", {
				detail: { action: t },
				bubbles: !0,
				composed: !0
			});
			e.dispatchEvent(n);
		};
		e.addEventListener("pointerdown", (e) => {
			r = !1, o(), a()?.hasHold && (n = window.setTimeout(() => {
				r = !0, s("hold");
			}, this.holdTime));
		}, { passive: !0 }), e.addEventListener("pointerup", (e) => {
			o(), !r && (a()?.hasDoubleClick ? i ? (clearTimeout(i), i = void 0, s("double_tap")) : i = window.setTimeout(() => {
				i = void 0, s("tap");
			}, 250) : s("tap"));
		}), e.addEventListener("pointercancel", o), e.addEventListener("pointerleave", o);
	}
};
customElements.define("checklist-action-handler", y);
var b = document.createElement("checklist-action-handler"), x = s(class extends m {
	constructor(e) {
		super(e);
	}
	render(e) {}
	update(e, [t]) {
		return b.bind(e.element, t), this.render(t);
	}
}), S = class extends c {
	constructor(...e) {
		super(...e), this.isProblem = !1, this.isFixing = !1, this.severity = "info";
	}
	static {
		this.styles = i`
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
    }

    .entity-state {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }



    .fix-btn {
      background-color: #f8aa35;
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


  `;
	}
	shouldUpdate(e) {
		for (let t of e.keys()) if (t !== "hass") return !0;
		let t = e.get("hass");
		if (!t || !this.hass || t.states?.[this.rule.entity] !== this.hass.states?.[this.rule.entity]) return !0;
		for (let e of this.rule.conditions ?? []) {
			let n = e.prerequisite_entity;
			if (n && t.states?.[n] !== this.hass.states?.[n]) return !0;
		}
		for (let e of this.rule.conditions ?? []) for (let n of [
			e.state,
			e.attribute_value,
			e.prerequisite_state,
			e.prerequisite_attribute_value
		]) {
			if (!n || !n.includes("states(")) continue;
			let e = n.match(/states\(['"]([^'"]+)['"]\)/)?.[1];
			if (e && t.states?.[e] !== this.hass.states?.[e]) return !0;
		}
		return t.language !== this.hass.language || t.user?.id !== this.hass.user?.id;
	}
	_handleAction(e) {
		let t = e.detail.action;
		if (t === "fix") return;
		let n = {
			entity: this.rule.entity,
			tap_action: this.rule.tap_action || { action: "more-info" },
			hold_action: this.rule.hold_action || { action: "more-info" },
			double_tap_action: this.rule.double_tap_action || { action: "none" }
		}, r = new CustomEvent("hass-action", {
			detail: {
				config: n,
				action: t
			},
			bubbles: !0,
			composed: !0
		});
		this.dispatchEvent(r);
	}
	_handleFixClick(e) {
		if (e.stopPropagation(), this.isFixing) return;
		if (this.rule.confirmation) {
			let e = u(this.hass, "confirm_fix", { name: this.rule.name || this.rule.entity });
			if (typeof this.rule.confirmation == "object") {
				if (!this.rule.confirmation.exemptions?.some((e) => e.user === this.hass.user?.id) && (e = this.rule.confirmation.text || e, !window.confirm(e))) return;
			} else if (this.rule.confirmation === !0 && !window.confirm(e)) return;
		}
		let t = this.rule.fix_action;
		if (t && t.action !== "fix") {
			let e = new CustomEvent("hass-action", {
				detail: {
					config: {
						entity: this.rule.entity,
						tap_action: t
					},
					action: "tap"
				},
				bubbles: !0,
				composed: !0
			});
			this.dispatchEvent(e);
			return;
		}
		this.dispatchEvent(new CustomEvent("fix-requested", {
			detail: { ruleId: this.rule.id },
			bubbles: !0,
			composed: !0
		}));
	}
	_renderSingleConditionStatus(e, t) {
		let n = g(this.hass, e.state), r = !!e.attribute?.trim(), i = r ? g(this.hass, e.attribute_value || e.state) : null;
		return a`
      <span class="entity-state">
        ${u(this.hass, "current_state")}: ${t}
        (${u(this.hass, "required")}: ${n})
      </span>
      ${r ? a`
        <span class="entity-state">
          ${u(this.hass, "attribute")} <strong>${e.attribute}</strong>:
          <strong>${this.stateObj?.attributes?.[e.attribute] ?? u(this.hass, "not_exists")}</strong>
          (${u(this.hass, "required")}: ${i})
        </span>
      ` : ""}
    `;
	}
	_renderMultiConditionStatus(e) {
		if (this.rule.conditions_mode === "any") {
			let t = this.rule.conditions.map((e) => g(this.hass, e.state)).join(", "), n = this.rule.default_condition_index ?? 0, r = g(this.hass, this.rule.conditions[n]?.state ?? this.rule.conditions[0]?.state);
			return a`
        <span class="entity-state">${u(this.hass, "current_state")}: <strong>${e}</strong></span>
        <span class="entity-state">${u(this.hass, "accepted_one_of")}: ${t}</span>
        <span class="entity-state">${u(this.hass, "fix_target")}: <strong>${r}</strong></span>
      `;
		}
		let t = this.stateObj ? this.rule.conditions.filter((e) => !_(this.hass, this.stateObj, e)) : this.rule.conditions;
		return a`
      <span class="entity-state">${u(this.hass, "current_state")}: ${e}</span>
      ${t.map((e) => a`
        <span class="entity-state">
          ${u(this.hass, "required")}: ${u(this.hass, "status")}=${g(this.hass, e.state)}${e.attribute?.trim() ? a` | ${e.attribute}=${g(this.hass, e.attribute_value || e.state)}` : ""}
        </span>
      `)}
    `;
	}
	render() {
		let e = this.stateObj?.state ?? u(this.hass, "unavailable"), t = this.rule.conditions.length > 1, n = this.rule.name || this.stateObj?.attributes?.friendly_name || this.rule.entity, r = `${n}, ${u(this.hass, this.isProblem ? "status_problem" : "status_ok")}`, i = this.rule.icon;
		return a`
      <div
        class="check-item"
        role=${"listitem"}
        aria-label=${r}
        @action=${this._handleAction}
        .actionHandler=${x({
			hasHold: !0,
			hasDoubleClick: !0
		})}
        tabindex="0"
      >
        <ha-ripple></ha-ripple>
        <div class="entity-info-container">
          <div class="icon-wrapper ${this.isProblem ? "problem" : "ok"}">
            ${i ? a`<ha-icon .icon=${i}></ha-icon>` : a`<ha-state-icon class="entity-icon" .hass=${this.hass} .stateObj=${this.stateObj}></ha-state-icon>`}
          </div>
          <div class="check-text">
            <span class="entity-name" style=${this.rule.color ? `color: ${this.rule.color}` : ""}>
              ${n}
              ${this.rule.show_last_changed && this.stateObj ? a`
                <span style="font-size: 0.8em; opacity: 0.7; margin-inline-start: 4px;">
                  <ha-relative-time .hass=${this.hass} .datetime=${this.stateObj.last_changed}></ha-relative-time>
                </span>
              ` : ""}
            </span>
            ${this.isProblem ? t ? this._renderMultiConditionStatus(e) : this._renderSingleConditionStatus(this.rule.conditions[0], e) : a`<span class="entity-state">
                  ${u(this.hass, "status")}: ${e}
                </span>`}
          </div>
        </div>
        ${this.isProblem ? a`
          <button 
            class="fix-btn" 
            @click=${this._handleFixClick} 
            ?disabled=${this.isFixing}
            aria-label=${u(this.hass, "fix")}
            aria-busy=${this.isFixing}
          >
            ${this.isFixing ? a`<div class="spinner"></div>` : a`
                  ${u(this.hass, "fix")}
                `}
          </button>
        ` : a`
          <div style="min-width: 60px; display: flex; justify-content: flex-end; align-items: center;">
            <span class="ok-badge">
              <ha-icon icon="mdi:check" style="--mdc-icon-size: 18px;"></ha-icon>
              ${u(this.hass, "ok")}
            </span>
          </div>
        `}
      </div>
    `;
	}
};
l([r({ attribute: !1 })], S.prototype, "stateObj", void 0), l([r({ attribute: !1 })], S.prototype, "rule", void 0), l([r({ attribute: !1 })], S.prototype, "hass", void 0), l([r({ type: Boolean })], S.prototype, "isProblem", void 0), l([r({ type: Boolean })], S.prototype, "isFixing", void 0), l([r({ type: String })], S.prototype, "severity", void 0), S = l([d("checklist-card-item")], S);
//#endregion
//#region src/checklist-card.ts
var C = class extends c {
	constructor(...e) {
		super(...e), this._isFixingAll = !1, this._fixingItems = /* @__PURE__ */ new Set(), this._errorBanner = null, this._showOkExpanded = !1, this._problemIds = /* @__PURE__ */ new Set(), this._checksToDisplay = [], this._listStyle = "display: flex; flex-direction: column; gap: 12px;", this._watchedEntityIds = [];
	}
	static {
		this.styles = h;
	}
	static getConfigElement() {
		return import("./checklist-card-editor-z_F0kS6E.mjs").then((e) => e.t).then(() => document.createElement("checklist-card-editor"));
	}
	getCardSize() {
		let e = this._config?.checks?.length ?? 1, t = this._layoutCols(), n = Math.ceil(e / t);
		return Math.max(2, Math.ceil(n * 1.2) + 2);
	}
	getGridOptions() {
		let e = (e) => Math.max(1, Math.min(12, e)), t = this._config?.checks?.length ?? 1, n = this._config?.layout ?? {
			mode: "columns",
			count: 1
		};
		if (n.mode === "rows") {
			let r = Math.max(1, n.count || 1);
			return {
				columns: e(Math.max(6, Math.ceil(t / r) * 2)),
				rows: Math.max(3, Math.ceil(r * 1.3) + 2),
				min_columns: e(4),
				min_rows: 2
			};
		}
		let r = this._layoutCols(), i = Math.ceil(t / r);
		return {
			columns: e(r * 3),
			rows: Math.max(3, Math.ceil(i * 1.3) + 2),
			min_columns: e(Math.max(2, r * 2)),
			min_rows: 2
		};
	}
	_layoutCols() {
		let e = this._config?.layout;
		return e?.mode === "columns" ? Math.max(1, e.count || 1) : 1;
	}
	static getStubConfig() {
		return {
			type: "custom:checklist-card",
			title: p("title"),
			checks: [{
				id: Date.now().toString(),
				entity: "",
				name: "",
				conditions: [{
					state: "off",
					attribute: "",
					attribute_value: "",
					fix_service: ""
				}],
				conditions_mode: "any",
				default_condition_index: 0
			}],
			layout: {
				mode: "columns",
				count: 1
			},
			sort: "status"
		};
	}
	setConfig(e) {
		if (!e || !e.checks) throw Error(u(this.hass, "config_error"));
		let t = o(e);
		this._config = {
			...t,
			checks: t.checks.map(f)
		};
	}
	connectedCallback() {
		super.connectedCallback();
	}
	disconnectedCallback() {
		super.disconnectedCallback();
	}
	shouldUpdate(e) {
		if (e.size > 1 || !e.has("hass")) return !0;
		let t = e.get("hass");
		return !t || this._watchedEntityIds.length === 0 ? !0 : this._watchedEntityIds.some((e) => t.states?.[e] !== this.hass.states?.[e]);
	}
	willUpdate(e) {
		super.willUpdate(e), e.has("_config") && (this._watchedEntityIds = this._collectWatchedEntityIds(), this._listStyle = this._computeListStyle()), (e.has("_config") || e.has("hass")) && (this._problemIds = this._calculateProblemIds(), this._checksToDisplay = this._computeChecksToDisplay());
	}
	_collectWatchedEntityIds() {
		let e = /* @__PURE__ */ new Set(), t = /states\(['"]([^'"]+)['"]\)/g, n = (n) => {
			if (!n || !n.includes("states(")) return;
			let r;
			for (t.lastIndex = 0; (r = t.exec(n)) !== null;) r[1] && e.add(r[1]);
		};
		for (let t of this._config.checks) {
			t.entity && e.add(t.entity);
			for (let r of t.conditions ?? []) r.prerequisite_entity && e.add(r.prerequisite_entity), n(r.state), n(r.attribute_value), n(r.prerequisite_state), n(r.prerequisite_attribute_value);
		}
		return Array.from(e);
	}
	_computeListStyle() {
		let e = this._config?.layout ?? {
			mode: "columns",
			count: 1
		};
		return e.mode === "columns" ? e.count <= 1 ? "display: flex; flex-direction: column; gap: 12px;" : `display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, max(250px, calc(100% / ${e.count} - 12px))), 1fr)); gap: 12px; align-items: start; align-content: start;` : e.mode === "rows" ? `display: grid; grid-template-rows: repeat(${e.count}, auto); grid-auto-flow: column; gap: 12px; align-items: start; align-content: start; overflow-x: auto; padding-bottom: 8px;` : "display: flex; flex-direction: column; gap: 12px;";
	}
	_computeChecksToDisplay() {
		let e = [...this._config.checks].filter((e) => !!e.entity);
		return this._config.sort === "manual" ? this._config.sort_direction === "desc" && e.reverse() : e.sort((e, t) => {
			let n = 0, r = 0;
			switch (this._config.sort) {
				case "status":
					n = +!this._problemIds.has(e.id), r = +!this._problemIds.has(t.id);
					break;
				case "alphabetical":
					n = (e.name || e.entity).toLowerCase(), r = (t.name || t.entity).toLowerCase();
					break;
				case "domain":
					n = e.entity.split(".")[0], r = t.entity.split(".")[0];
					break;
				case "severity":
					let i = {
						critical: 0,
						warning: 1,
						info: 2
					};
					n = i[e.severity || "info"], r = i[t.severity || "info"];
					break;
				case "last_changed":
					n = new Date(this.hass.states[e.entity]?.last_changed || 0).getTime(), r = new Date(this.hass.states[t.entity]?.last_changed || 0).getTime();
					break;
			}
			return n < r ? this._config.sort_direction === "desc" ? 1 : -1 : n > r ? this._config.sort_direction === "desc" ? -1 : 1 : 0;
		}), e;
	}
	_calculateProblemIds() {
		return !this.hass || !this._config?.checks ? /* @__PURE__ */ new Set() : new Set(this._config.checks.filter((e) => v(this.hass, e)).map((e) => e.id));
	}
	async _fixCondition(t, n) {
		let r = t.split(".")[0], i = { entity_id: t };
		if (n.fix_service?.trim()) {
			let e = n.fix_service.trim();
			try {
				if (e.startsWith("{")) {
					let t = JSON.parse(e), n = t.perform_action || t.action || t.service;
					if (typeof n != "string" || !n.includes(".")) throw Error("custom fix_service is missing a valid \"service\" / \"perform_action\" field");
					let [r, a] = n.split(".");
					if (!r || !a) throw Error(`invalid service identifier: ${n}`);
					let o = {
						...t.service_data || {},
						...t.data || {}
					}, s = t.target && Object.keys(t.target).length > 0 ? o : {
						...i,
						...o
					};
					await this.hass.callService(r, a, s, t.target);
				} else if (e.includes(".")) {
					let [t, n] = e.split(".");
					if (!t || !n) throw Error(`invalid service identifier: ${e}`);
					await this.hass.callService(t, n, i);
				} else throw Error(`fix_service must be "domain.service" or a JSON object, got: ${e}`);
			} catch (e) {
				console.error(u(this.hass, "fix_process_error") + " (Parse/Execute):", e), this._errorBanner = u(this.hass, "fix_process_error") + " - " + String(e);
			}
			return;
		}
		let a = e(r, g(this.hass, n.state), n);
		try {
			await this.hass.callService(a.domain || r, a.service, {
				...i,
				...a.serviceData
			});
		} catch (e) {
			console.error("Service call failed", e), this._errorBanner = u(this.hass, "fix_process_error") + " - " + String(e);
		}
	}
	async _fixIssue(e) {
		this._fixingItems = new Set([...this._fixingItems, e.id]), this._errorBanner = null;
		try {
			if (e.conditions_mode === "any") {
				let t = e.default_condition_index ?? 0, n = e.conditions[t] ?? e.conditions[0];
				n && await this._fixCondition(e.entity, n);
			} else for (let t = 0; t < e.conditions.length; t++) {
				let n = e.conditions[t], r = this.hass.states[e.entity];
				(!r || !_(this.hass, r, n)) && (await this._fixCondition(e.entity, n), t < e.conditions.length - 1 && await new Promise((e) => setTimeout(e, 300)));
			}
		} catch (e) {
			console.error(u(this.hass, "fix_process_error"), e), this._errorBanner = u(this.hass, "fix_process_error");
		} finally {
			let t = new Set(this._fixingItems);
			t.delete(e.id), this._fixingItems = t;
		}
	}
	async _fixAll() {
		this._isFixingAll = !0, this._errorBanner = null;
		let e = {
			critical: 0,
			warning: 1,
			info: 2
		}, t = this._config.checks.filter((e) => e.entity && this._problemIds.has(e.id)).sort((t, n) => e[t.severity || "info"] - e[n.severity || "info"]);
		for (let e of t) await this._fixIssue(e), await new Promise((e) => setTimeout(e, 300));
		this._isFixingAll = !1;
	}
	_handleFixRequested(e) {
		let t = this._config.checks.find((t) => t.id === e.detail.ruleId);
		t && this._fixIssue(t);
	}
	render() {
		if (!this._config) return a``;
		let e = this._problemIds.size, t = e > 0, n = this.hass?.translationMetadata?.dir ?? (this.hass?.language === "he" ? "rtl" : "ltr"), r = this._checksToDisplay.filter((e) => this._problemIds.has(e.id)), i = this._checksToDisplay.filter((e) => !this._problemIds.has(e.id)), o = this._config.show_ok_section || "inline";
		return e === 0 && o === "hidden" ? (this.style.display = "none", a``) : (this.style.display = "", a`
      <ha-card dir=${n} role="region" aria-label=${this._config.title || u(this.hass, "title")}>
        ${this._errorBanner ? a`
          <ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${() => this._errorBanner = null}>
            ${this._errorBanner}
          </ha-alert>
        ` : ""}

        <div class="header">
          <div class="header-content">
            <span class="status-icon ${t ? "error" : "success"}">
              <ha-icon icon="${t ? "mdi:alert" : "mdi:check-circle"}"></ha-icon>
            </span>
            <div>
              <div class="title">${this._config.title || u(this.hass, "title")}</div>
              <div class="subtitle" aria-live="polite">
                ${t ? u(this.hass, "problems_found", { count: e }) : u(this.hass, "all_good")}
              </div>
            </div>
          </div>

          <div class="header-actions">
            ${o === "collapsed" && i.length > 0 ? a`
              <button class="ok-toggle-btn" @click=${() => this._showOkExpanded = !this._showOkExpanded}>
                <ha-icon icon="mdi:check-circle"></ha-icon>
                ${this._showOkExpanded ? u(this.hass, "hide_ok_items_btn", { count: i.length }) : u(this.hass, "show_ok_items_btn", { count: i.length })}
              </button>
            ` : ""}

            ${r.length > 0 ? a`
              <button class="fix-all-btn" @click=${this._fixAll} ?disabled=${this._isFixingAll} aria-label=${u(this.hass, "fix_all")}>
                ${this._isFixingAll ? a`<div class="spinner"></div>` : u(this.hass, "fix_all")}
              </button>
            ` : ""}
          </div>
        </div>

        <div class="check-list" style="${this._listStyle}" role="list" @fix-requested=${this._handleFixRequested}>
          ${this._renderItems(o === "inline" ? this._checksToDisplay : r)}
          ${o === "collapsed" && this._showOkExpanded ? this._renderItems(i) : ""}
        </div>
      </ha-card>
    `);
	}
	_renderItems(e) {
		return t(e, (e) => e.id, (e) => a`
        <checklist-card-item
          .rule=${e}
          .hass=${this.hass}
          .stateObj=${this.hass.states[e.entity]}
          .isProblem=${this._problemIds.has(e.id)}
          .isFixing=${this._fixingItems.has(e.id)}
          .severity=${e.severity || "info"}
        ></checklist-card-item>
      `);
	}
};
l([r({ attribute: !1 })], C.prototype, "hass", void 0), l([n()], C.prototype, "_config", void 0), l([n()], C.prototype, "_isFixingAll", void 0), l([n()], C.prototype, "_fixingItems", void 0), l([n()], C.prototype, "_errorBanner", void 0), l([n()], C.prototype, "_showOkExpanded", void 0), C = l([d("checklist-card")], C), window.customCards = window.customCards || [], window.customCards.push({
	type: "checklist-card",
	name: p("card_name"),
	description: p("card_description"),
	preview: !0,
	documentationURL: "https://github.com/yosef-chai/ha-checklist-card"
});
//#endregion
