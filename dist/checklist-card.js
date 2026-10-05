//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, n = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, r, i, a, o, s, c, l, u, d, f = t((() => {
	r = globalThis, i = r.ShadowRoot && (r.ShadyCSS === void 0 || r.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, a = Symbol(), o = /* @__PURE__ */ new WeakMap(), s = class {
		constructor(e, t, n) {
			if (this._$cssResult$ = !0, n !== a) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
			this.cssText = e, this.t = t;
		}
		get styleSheet() {
			let e = this.o, t = this.t;
			if (i && e === void 0) {
				let n = t !== void 0 && t.length === 1;
				n && (e = o.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && o.set(t, e));
			}
			return e;
		}
		toString() {
			return this.cssText;
		}
	}, c = (e) => new s(typeof e == "string" ? e : e + "", void 0, a), l = (e, ...t) => {
		let n = e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
			if (!0 === e._$cssResult$) return e.cssText;
			if (typeof e == "number") return e;
			throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
		})(n) + e[r + 1], e[0]);
		return new s(n, e, a);
	}, u = (e, t) => {
		if (i) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
		else for (let n of t) {
			let t = document.createElement("style"), i = r.litNonce;
			i !== void 0 && t.setAttribute("nonce", i), t.textContent = n.cssText, e.appendChild(t);
		}
	}, d = i ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
		let t = "";
		for (let n of e.cssRules) t += n.cssText;
		return c(t);
	})(e) : e;
})), p, m, ee, te, ne, re, h, ie, ae, oe, g, _, se, ce, v, le = t((() => {
	f(), {is: p, defineProperty: m, getOwnPropertyDescriptor: ee, getOwnPropertyNames: te, getOwnPropertySymbols: ne, getPrototypeOf: re} = Object, h = globalThis, ie = h.trustedTypes, ae = ie ? ie.emptyScript : "", oe = h.reactiveElementPolyfillSupport, g = (e, t) => e, _ = {
		toAttribute(e, t) {
			switch (t) {
				case Boolean:
					e = e ? ae : null;
					break;
				case Object:
				case Array: e = e == null ? e : JSON.stringify(e);
			}
			return e;
		},
		fromAttribute(e, t) {
			let n = e;
			switch (t) {
				case Boolean:
					n = e !== null;
					break;
				case Number:
					n = e === null ? null : Number(e);
					break;
				case Object:
				case Array: try {
					n = JSON.parse(e);
				} catch {
					n = null;
				}
			}
			return n;
		}
	}, se = (e, t) => !p(e, t), ce = {
		attribute: !0,
		type: String,
		converter: _,
		reflect: !1,
		useDefault: !1,
		hasChanged: se
	}, Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap(), v = class extends HTMLElement {
		static addInitializer(e) {
			this._$Ei(), (this.l ??= []).push(e);
		}
		static get observedAttributes() {
			return this.finalize(), this._$Eh && [...this._$Eh.keys()];
		}
		static createProperty(e, t = ce) {
			if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
				let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
				r !== void 0 && m(this.prototype, e, r);
			}
		}
		static getPropertyDescriptor(e, t, n) {
			let { get: r, set: i } = ee(this.prototype, e) ?? {
				get() {
					return this[t];
				},
				set(e) {
					this[t] = e;
				}
			};
			return {
				get: r,
				set(t) {
					let a = r?.call(this);
					i?.call(this, t), this.requestUpdate(e, a, n);
				},
				configurable: !0,
				enumerable: !0
			};
		}
		static getPropertyOptions(e) {
			return this.elementProperties.get(e) ?? ce;
		}
		static _$Ei() {
			if (this.hasOwnProperty(g("elementProperties"))) return;
			let e = re(this);
			e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
		}
		static finalize() {
			if (this.hasOwnProperty(g("finalized"))) return;
			if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(g("properties"))) {
				let e = this.properties, t = [...te(e), ...ne(e)];
				for (let n of t) this.createProperty(n, e[n]);
			}
			let e = this[Symbol.metadata];
			if (e !== null) {
				let t = litPropertyMetadata.get(e);
				if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
			}
			this._$Eh = /* @__PURE__ */ new Map();
			for (let [e, t] of this.elementProperties) {
				let n = this._$Eu(e, t);
				n !== void 0 && this._$Eh.set(n, e);
			}
			this.elementStyles = this.finalizeStyles(this.styles);
		}
		static finalizeStyles(e) {
			let t = [];
			if (Array.isArray(e)) {
				let n = new Set(e.flat(Infinity).reverse());
				for (let e of n) t.unshift(d(e));
			} else e !== void 0 && t.push(d(e));
			return t;
		}
		static _$Eu(e, t) {
			let n = t.attribute;
			return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
		}
		constructor() {
			super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
		}
		_$Ev() {
			this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
		}
		addController(e) {
			(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
		}
		removeController(e) {
			this._$EO?.delete(e);
		}
		_$E_() {
			let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
			for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
			e.size > 0 && (this._$Ep = e);
		}
		createRenderRoot() {
			let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
			return u(e, this.constructor.elementStyles), e;
		}
		connectedCallback() {
			this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
		}
		enableUpdating(e) {}
		disconnectedCallback() {
			this._$EO?.forEach((e) => e.hostDisconnected?.());
		}
		attributeChangedCallback(e, t, n) {
			this._$AK(e, n);
		}
		_$ET(e, t) {
			let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
			if (r !== void 0 && !0 === n.reflect) {
				let i = (n.converter?.toAttribute === void 0 ? _ : n.converter).toAttribute(t, n.type);
				this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
			}
		}
		_$AK(e, t) {
			let n = this.constructor, r = n._$Eh.get(e);
			if (r !== void 0 && this._$Em !== r) {
				let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? _ : e.converter;
				this._$Em = r;
				let a = i.fromAttribute(t, e.type);
				this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
			}
		}
		requestUpdate(e, t, n, r = !1, i) {
			if (e !== void 0) {
				let a = this.constructor;
				if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? se)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
				this.C(e, t, n);
			}
			!1 === this.isUpdatePending && (this._$ES = this._$EP());
		}
		C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
			n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
		}
		async _$EP() {
			this.isUpdatePending = !0;
			try {
				await this._$ES;
			} catch (e) {
				Promise.reject(e);
			}
			let e = this.scheduleUpdate();
			return e != null && await e, !this.isUpdatePending;
		}
		scheduleUpdate() {
			return this.performUpdate();
		}
		performUpdate() {
			if (!this.isUpdatePending) return;
			if (!this.hasUpdated) {
				if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
					for (let [e, t] of this._$Ep) this[e] = t;
					this._$Ep = void 0;
				}
				let e = this.constructor.elementProperties;
				if (e.size > 0) for (let [t, n] of e) {
					let { wrapped: e } = n, r = this[t];
					!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
				}
			}
			let e = !1, t = this._$AL;
			try {
				e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
			} catch (t) {
				throw e = !1, this._$EM(), t;
			}
			e && this._$AE(t);
		}
		willUpdate(e) {}
		_$AE(e) {
			this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
		}
		_$EM() {
			this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
		}
		get updateComplete() {
			return this.getUpdateComplete();
		}
		getUpdateComplete() {
			return this._$ES;
		}
		shouldUpdate(e) {
			return !0;
		}
		update(e) {
			this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
		}
		updated(e) {}
		firstUpdated(e) {}
	}, v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[g("elementProperties")] = /* @__PURE__ */ new Map(), v[g("finalized")] = /* @__PURE__ */ new Map(), oe?.({ ReactiveElement: v }), (h.reactiveElementVersions ??= []).push("2.1.2");
}));
//#endregion
//#region node_modules/lit-html/lit-html.js
function ue(e, t) {
	if (!he(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return pe === void 0 ? t : pe.createHTML(t);
}
function y(e, t, n = e, r) {
	if (t === A) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = E(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = y(e, i._$AS(e, t.values), i, r)), t;
}
var de, fe, b, pe, x, S, C, me, w, T, E, he, ge, _e, D, ve, ye, O, be, xe, Se, Ce, k, A, j, we, M, Te, Ee, De, N, P, Oe, ke, Ae, je, Me, Ne, Pe, F = t((() => {
	de = globalThis, fe = (e) => e, b = de.trustedTypes, pe = b ? b.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, x = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, C = "?" + S, me = `<${C}>`, w = document, T = () => w.createComment(""), E = (e) => e === null || typeof e != "object" && typeof e != "function", he = Array.isArray, ge = (e) => he(e) || typeof e?.[Symbol.iterator] == "function", _e = "[ 	\n\f\r]", D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ve = /-->/g, ye = />/g, O = RegExp(`>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), be = /'/g, xe = /"/g, Se = /^(?:script|style|textarea|title)$/i, Ce = (e) => (t, ...n) => ({
		_$litType$: e,
		strings: t,
		values: n
	}), k = Ce(1), Ce(2), Ce(3), A = Symbol.for("lit-noChange"), j = Symbol.for("lit-nothing"), we = /* @__PURE__ */ new WeakMap(), M = w.createTreeWalker(w, 129), Te = (e, t) => {
		let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = D;
		for (let t = 0; t < n; t++) {
			let n = e[t], s, c, l = -1, u = 0;
			for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === D ? c[1] === "!--" ? o = ve : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = O) : (Se.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = O) : o = ye : o === O ? c[0] === ">" ? (o = i ?? D, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? O : c[3] === "\"" ? xe : be) : o === xe || o === be ? o = O : o === ve || o === ye ? o = D : (o = O, i = void 0);
			let d = o === O && e[t + 1].startsWith("/>") ? " " : "";
			a += o === D ? n + me : l >= 0 ? (r.push(s), n.slice(0, l) + x + n.slice(l) + S + d) : n + S + (l === -2 ? t : d);
		}
		return [ue(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
	}, Ee = class e {
		constructor({ strings: t, _$litType$: n }, r) {
			let i;
			this.parts = [];
			let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Te(t, n);
			if (this.el = e.createElement(l, r), M.currentNode = this.el.content, n === 2 || n === 3) {
				let e = this.el.content.firstChild;
				e.replaceWith(...e.childNodes);
			}
			for (; (i = M.nextNode()) !== null && c.length < s;) {
				if (i.nodeType === 1) {
					if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(x)) {
						let t = u[o++], n = i.getAttribute(e).split(S), r = /([.?@])?(.*)/.exec(t);
						c.push({
							type: 1,
							index: a,
							name: r[2],
							strings: n,
							ctor: r[1] === "." ? Oe : r[1] === "?" ? ke : r[1] === "@" ? Ae : P
						}), i.removeAttribute(e);
					} else e.startsWith(S) && (c.push({
						type: 6,
						index: a
					}), i.removeAttribute(e));
					if (Se.test(i.tagName)) {
						let e = i.textContent.split(S), t = e.length - 1;
						if (t > 0) {
							i.textContent = b ? b.emptyScript : "";
							for (let n = 0; n < t; n++) i.append(e[n], T()), M.nextNode(), c.push({
								type: 2,
								index: ++a
							});
							i.append(e[t], T());
						}
					}
				} else if (i.nodeType === 8) if (i.data === C) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(S, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += S.length - 1;
				}
				a++;
			}
		}
		static createElement(e, t) {
			let n = w.createElement("template");
			return n.innerHTML = e, n;
		}
	}, De = class {
		constructor(e, t) {
			this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
		}
		get parentNode() {
			return this._$AM.parentNode;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		u(e) {
			let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? w).importNode(t, !0);
			M.currentNode = r;
			let i = M.nextNode(), a = 0, o = 0, s = n[0];
			for (; s !== void 0;) {
				if (a === s.index) {
					let t;
					s.type === 2 ? t = new N(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new je(i, this, e)), this._$AV.push(t), s = n[++o];
				}
				a !== s?.index && (i = M.nextNode(), a++);
			}
			return M.currentNode = w, r;
		}
		p(e) {
			let t = 0;
			for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
		}
	}, N = class e {
		get _$AU() {
			return this._$AM?._$AU ?? this._$Cv;
		}
		constructor(e, t, n, r) {
			this.type = 2, this._$AH = j, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
		}
		get parentNode() {
			let e = this._$AA.parentNode, t = this._$AM;
			return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
		}
		get startNode() {
			return this._$AA;
		}
		get endNode() {
			return this._$AB;
		}
		_$AI(e, t = this) {
			e = y(this, e, t), E(e) ? e === j || e == null || e === "" ? (this._$AH !== j && this._$AR(), this._$AH = j) : e !== this._$AH && e !== A && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ge(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
		}
		O(e) {
			return this._$AA.parentNode.insertBefore(e, this._$AB);
		}
		T(e) {
			this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
		}
		_(e) {
			this._$AH !== j && E(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
		}
		$(e) {
			let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ee.createElement(ue(n.h, n.h[0]), this.options)), n);
			if (this._$AH?._$AD === r) this._$AH.p(t);
			else {
				let e = new De(r, this), n = e.u(this.options);
				e.p(t), this.T(n), this._$AH = e;
			}
		}
		_$AC(e) {
			let t = we.get(e.strings);
			return t === void 0 && we.set(e.strings, t = new Ee(e)), t;
		}
		k(t) {
			he(this._$AH) || (this._$AH = [], this._$AR());
			let n = this._$AH, r, i = 0;
			for (let a of t) i === n.length ? n.push(r = new e(this.O(T()), this.O(T()), this, this.options)) : r = n[i], r._$AI(a), i++;
			i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
		}
		_$AR(e = this._$AA.nextSibling, t) {
			for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
				let t = fe(e).nextSibling;
				fe(e).remove(), e = t;
			}
		}
		setConnected(e) {
			this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
		}
	}, P = class {
		get tagName() {
			return this.element.tagName;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		constructor(e, t, n, r, i) {
			this.type = 1, this._$AH = j, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = j;
		}
		_$AI(e, t = this, n, r) {
			let i = this.strings, a = !1;
			if (i === void 0) e = y(this, e, t, 0), a = !E(e) || e !== this._$AH && e !== A, a && (this._$AH = e);
			else {
				let r = e, o, s;
				for (e = i[0], o = 0; o < i.length - 1; o++) s = y(this, r[n + o], t, o), s === A && (s = this._$AH[o]), a ||= !E(s) || s !== this._$AH[o], s === j ? e = j : e !== j && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
			}
			a && !r && this.j(e);
		}
		j(e) {
			e === j ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
		}
	}, Oe = class extends P {
		constructor() {
			super(...arguments), this.type = 3;
		}
		j(e) {
			this.element[this.name] = e === j ? void 0 : e;
		}
	}, ke = class extends P {
		constructor() {
			super(...arguments), this.type = 4;
		}
		j(e) {
			this.element.toggleAttribute(this.name, !!e && e !== j);
		}
	}, Ae = class extends P {
		constructor(e, t, n, r, i) {
			super(e, t, n, r, i), this.type = 5;
		}
		_$AI(e, t = this) {
			if ((e = y(this, e, t, 0) ?? j) === A) return;
			let n = this._$AH, r = e === j && n !== j || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== j && (n === j || r);
			r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
		}
		handleEvent(e) {
			typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
		}
	}, je = class {
		constructor(e, t, n) {
			this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		_$AI(e) {
			y(this, e);
		}
	}, Me = {
		M: x,
		P: S,
		A: C,
		C: 1,
		L: Te,
		R: De,
		D: ge,
		V: y,
		I: N,
		H: P,
		N: ke,
		U: Ae,
		B: Oe,
		F: je
	}, Ne = de.litHtmlPolyfillSupport, Ne?.(Ee, N), (de.litHtmlVersions ??= []).push("3.3.3"), Pe = (e, t, n) => {
		let r = n?.renderBefore ?? t, i = r._$litPart$;
		if (i === void 0) {
			let e = n?.renderBefore ?? null;
			r._$litPart$ = i = new N(t.insertBefore(T(), e), e, void 0, n ?? {});
		}
		return i._$AI(e), i;
	};
})), I, L, Fe, Ie = t((() => {
	le(), le(), F(), F(), I = globalThis, L = class extends v {
		constructor() {
			super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
		}
		createRenderRoot() {
			let e = super.createRenderRoot();
			return this.renderOptions.renderBefore ??= e.firstChild, e;
		}
		update(e) {
			let t = this.render();
			this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Pe(t, this.renderRoot, this.renderOptions);
		}
		connectedCallback() {
			super.connectedCallback(), this._$Do?.setConnected(!0);
		}
		disconnectedCallback() {
			super.disconnectedCallback(), this._$Do?.setConnected(!1);
		}
		render() {
			return A;
		}
	}, L._$litElement$ = !0, L.finalized = !0, I.litElementHydrateSupport?.({ LitElement: L }), Fe = I.litElementPolyfillSupport, Fe?.({ LitElement: L }), (I.litElementVersions ??= []).push("4.2.2");
})), Le = t((() => {})), R = t((() => {
	le(), F(), Ie(), Le();
})), Re, ze = t((() => {
	Re = (e) => (t, n) => {
		n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
			customElements.define(e, t);
		});
	};
}));
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
function z(e) {
	return (t, n) => typeof n == "object" ? Ve(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
var Be, Ve, He = t((() => {
	le(), Be = {
		attribute: !0,
		type: String,
		converter: _,
		reflect: !1,
		hasChanged: se
	}, Ve = (e = Be, t, n) => {
		let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
		if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
			let { name: r } = n;
			return {
				set(n) {
					let i = t.get.call(this);
					t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
				},
				init(t) {
					return t !== void 0 && this.C(r, void 0, e, t), t;
				}
			};
		}
		if (r === "setter") {
			let { name: r } = n;
			return function(n) {
				let i = this[r];
				t.call(this, n), this.requestUpdate(r, i, e, !0, n);
			};
		}
		throw Error("Unsupported decorator location: " + r);
	};
}));
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function B(e) {
	return z({
		...e,
		state: !0,
		attribute: !1
	});
}
var Ue = t((() => {
	He();
})), We = t((() => {})), Ge, Ke = t((() => {
	Ge = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
}));
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function qe(e, t) {
	return (n, r, i) => {
		let a = (t) => t.renderRoot?.querySelector(e) ?? null;
		if (t) {
			let { get: e, set: t } = typeof r == "object" ? n : i ?? (() => {
				let e = Symbol();
				return {
					get() {
						return this[e];
					},
					set(t) {
						this[e] = t;
					}
				};
			})();
			return Ge(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return Ge(n, r, { get() {
			return a(this);
		} });
	};
}
var Je = t((() => {
	Ke();
})), Ye = t((() => {})), Xe = t((() => {})), Ze = t((() => {})), Qe = t((() => {})), $e = t((() => {
	ze(), He(), Ue(), We(), Je(), Ye(), Xe(), Ze(), Qe();
}));
R(), $e();
var et = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, tt = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), nt = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
};
//#endregion
//#region node_modules/lit-html/directive-helpers.js
F();
var { I: rt } = Me, it = (e) => e, at = () => document.createComment(""), V = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new rt(r.insertBefore(at(), i), r.insertBefore(at(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = it(e).nextSibling;
				it(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, H = (e, t, n = e) => (e._$AI(t, n), e), ot = {}, st = (e, t = ot) => e._$AH = t, ct = (e) => e._$AH, lt = (e) => {
	e._$AR(), e._$AA.remove();
};
//#endregion
//#region node_modules/lit-html/directives/repeat.js
F();
var ut = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, dt = tt(class extends nt {
	constructor(e) {
		if (super(e), e.type !== et.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, t, n) {
		let r;
		n === void 0 ? n = t : t !== void 0 && (r = t);
		let i = [], a = [], o = 0;
		for (let t of e) i[o] = r ? r(t, o) : o, a[o] = n(t, o), o++;
		return {
			values: a,
			keys: i
		};
	}
	render(e, t, n) {
		return this.dt(e, t, n).values;
	}
	update(e, [t, n, r]) {
		let i = ct(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = H(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = H(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = H(i[d], a[m]), V(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = H(i[f], a[p]), V(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = ut(o, p, m), u = ut(s, d, f)), l.has(s[d])) if (l.has(s[f])) {
			let t = u.get(o[p]), n = t === void 0 ? null : i[t];
			if (n === null) {
				let t = V(e, i[d]);
				H(t, a[p]), c[p] = t;
			} else c[p] = H(n, a[p]), V(e, i[d], n), i[t] = null;
			p++;
		} else lt(i[f]), f--;
		else lt(i[d]), d++;
		for (; p <= m;) {
			let t = V(e, c[m + 1]);
			H(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && lt(e);
		}
		return this.ut = o, st(e, c), A;
	}
}), ft = l`
  :host {
    display: block;
    container-type: inline-size;
    font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
    height: 100%;
  }
  :host([hidden]) {
    display: none;
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
    gap: 12px;
    /* No flex-wrap here: we want children to *shrink* (with ellipsis on the
       title) before the actions get bumped to a new line. The container query
       at the bottom of this file stacks them vertically only when there
       genuinely isn't enough width. */
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1 1 auto;
    /* Allow flex children to shrink below their intrinsic width so the title
       ellipsizes instead of pushing the actions to a new row. */
    min-width: 0;
  }

  /* Title + subtitle stack — also needs min-width: 0 so the nowrap text
     inside actually clamps to its container instead of growing it. */
  .header-text {
    min-width: 0;
    flex: 1 1 auto;
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
    /* Stay perfectly round — never let flex squish it. */
    flex-shrink: 0;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
  }

  .subtitle {
    font-size: 14px;
    color: var(--secondary-text-color);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
  }

  /* Marquee: a track holds two identical inner spans side-by-side and slides
     by exactly half its own width, so the second copy seamlessly takes the
     place of the first. The trailing gap on each inner creates breathing
     room between cycles. */
  .marquee-track {
    display: inline-flex;
    flex-wrap: nowrap;
    will-change: transform;
  }
  .title.overflowing,
  .subtitle.overflowing {
    /* Hide the ellipsis once the text is scrolling — it would clip mid-glyph. */
    text-overflow: clip;
  }
  .title.overflowing .marquee-inner,
  .subtitle.overflowing .marquee-inner {
    flex-shrink: 0;
    padding-inline-end: 2em;
  }

  :host(.marquee-enabled) .title.overflowing .marquee-track,
  :host(.marquee-enabled) .subtitle.overflowing .marquee-track {
    animation: marquee-scroll var(--marquee-duration, 12s) linear infinite;
  }

  :host(.marquee-enabled[dir="rtl"]) .title.overflowing .marquee-track,
  :host(.marquee-enabled[dir="rtl"]) .subtitle.overflowing .marquee-track {
    animation-name: marquee-scroll-rtl;
  }

  /* Pause when the user hovers/focuses, so the text can be read in full. */
  .title.overflowing:hover .marquee-track,
  .subtitle.overflowing:hover .marquee-track,
  .title.overflowing:focus-within .marquee-track,
  .subtitle.overflowing:focus-within .marquee-track {
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
    .title.overflowing .marquee-track,
    .subtitle.overflowing .marquee-track {
      animation: none !important;
      transform: none !important;
    }
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
    /* Actions keep their natural width and never shrink — the title (with
       ellipsis) absorbs any width pressure first. */
    flex-shrink: 0;
    flex-wrap: wrap;
    justify-content: flex-end;
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

  /* Narrow card: stack the header so title and actions each get a full row.
     Below this width even an ellipsized title leaves no useful room next to
     the action buttons. */
  @container (max-width: 380px) {
    .header {
      flex-direction: column;
      align-items: stretch;
      margin-bottom: 16px;
    }
    .header-content { width: 100%; }
    .header-actions {
      width: 100%;
      margin-inline-start: 0;
      justify-content: flex-start;
    }
    .fix-all-btn,
    .ok-toggle-btn {
      flex: 1 1 auto;
    }
  }

  /* Tighter padding and smaller status circle on very narrow cards. */
  @container (max-width: 280px) {
    ha-card { padding: 12px; }
    .header { margin-bottom: 12px; }
    .status-icon { width: 32px; height: 32px; }
    .status-icon ha-icon { --mdc-icon-size: 18px; }
    .title { font-size: 16px; }
    .subtitle { font-size: 12px; }
    .fix-all-btn,
    .ok-toggle-btn {
      padding: 6px 12px;
      font-size: 13px;
    }
  }

  /* Snooze count badge in subtitle */
  .snooze-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    margin-inline-start: 6px;
    color: var(--warning-color, #e59b2d);
    font-size: 13px;
  }

  /* Inline error banner (replaces ha-alert, which cards cannot rely on). */
  .error-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-block: 8px;
    padding-inline: 12px 8px;
    border-radius: var(--ha-border-radius-md, 8px);
    background-color: rgba(var(--rgb-error-color, 219, 68, 55), 0.12);
    color: var(--primary-text-color);
    font-size: 14px;
  }
  .error-banner > ha-icon {
    color: var(--error-color, #db4437);
    flex-shrink: 0;
  }
  .error-text {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--secondary-text-color);
    cursor: pointer;
    flex-shrink: 0;
    --mdc-icon-size: 18px;
  }
  .icon-btn:hover {
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
  }

  /* Native modal <dialog>: renders in the top layer (escapes ha-card clipping)
     and is styled with HA's dialog tokens so it matches built-in dialogs. */
  dialog {
    box-sizing: border-box;
    width: min(400px, calc(100vw - 32px));
    max-height: calc(100vh - 32px);
    padding: 0;
    border: none;
    border-radius: var(--ha-dialog-border-radius, var(--ha-border-radius-3xl, 24px));
    background: var(--ha-dialog-surface-background, var(--card-background-color, var(--primary-background-color, #fff)));
    color: var(--primary-text-color);
    box-shadow: var(--dialog-box-shadow, var(--ha-box-shadow-l, 0 8px 32px rgba(0, 0, 0, 0.3)));
    font-family: var(--ha-font-family-body, var(--primary-font-family, inherit));
  }
  dialog::backdrop {
    background: var(--mdc-dialog-scrim-color, rgba(0, 0, 0, 0.32));
  }
  .dialog-surface {
    display: flex;
    flex-direction: column;
  }
  .dialog-heading {
    margin: 0;
    padding: 24px 24px 0;
    font-size: var(--ha-font-size-2xl, 24px);
    font-weight: var(--ha-font-weight-normal, 400);
    line-height: 1.3;
  }
  .dialog-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 24px;
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 8px 24px 24px;
  }
  .dialog-btn {
    min-height: 40px;
    padding: 0 16px;
    border: none;
    border-radius: var(--ha-border-radius-pill, 9999px);
    background: transparent;
    color: var(--primary-color);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .dialog-btn:hover:not([disabled]) {
    background-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
  }
  .dialog-btn.primary {
    background-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .dialog-btn.primary:hover:not([disabled]) {
    background-color: var(--primary-color);
    opacity: 0.9;
  }
  .dialog-btn[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .dialog-btn:focus-visible,
  .chip-btn:focus-visible,
  .icon-btn:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .confirm-text {
    margin: 0;
    font-size: 14px;
    color: var(--primary-text-color);
  }
  .confirm-list {
    margin: 0;
    padding-inline-start: 20px;
    font-size: 14px;
    color: var(--secondary-text-color);
  }

  .snooze-dialog-entity {
    font-weight: 600;
    font-size: 15px;
    color: var(--primary-text-color);
  }

  .snooze-dialog-desc {
    margin: 0;
    font-size: 13px;
    color: var(--secondary-text-color);
  }

  .snooze-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .chip-btn {
    min-height: 32px;
    padding: 0 14px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: var(--ha-border-radius-md, 8px);
    background-color: transparent;
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
    transition: background-color 0.15s;
  }
  .chip-btn:hover {
    background-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    border-color: var(--primary-color);
  }

  .snooze-custom-label {
    margin-top: 4px;
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  .snooze-custom-input {
    box-sizing: border-box;
    width: 100%;
    min-height: 40px;
    padding: 0 12px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
    border-radius: var(--ha-border-radius-md, 8px);
    background: var(--ha-color-form-background, var(--card-background-color));
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
  }
  .snooze-custom-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }
`;
//#endregion
//#region src/localize.ts
function U(e, t, n) {
	return mt(e?.language ?? "en", t, n);
}
function pt(e) {
	return mt((typeof navigator < "u" ? navigator.language : "en").split("-")[0].toLowerCase(), e);
}
function mt(e, t, n) {
	let r = e in W ? e : "en", i = (n?.count === 1 ? W[r][`${t}_one`] : void 0) ?? W[r][t] ?? W.en[t] ?? t;
	if (n) for (let [e, t] of Object.entries(n)) i = i.replaceAll(`{${e}}`, String(t));
	return i;
}
var W, ht = t((() => {
	W = {
		en: {
			card_name: "Checklist Card",
			card_description: "Check entity states and quickly fix any issues.",
			title: "Checklist",
			status: "Status",
			all_good: "All good!",
			problems_found: "Found {count} problems",
			problems_found_one: "Found 1 problem",
			fix_all: "Fix all",
			fix: "Fix",
			ok: "OK",
			show_ok_items_btn: "Show {count} OK items",
			show_ok_items_btn_one: "Show 1 OK item",
			hide_ok_items_btn: "Hide {count} OK items",
			hide_ok_items_btn_one: "Hide 1 OK item",
			unavailable: "Unavailable",
			required: "Required",
			attribute: "Attribute",
			not_exists: "Missing",
			current_state: "Current state",
			accepted_one_of: "Accepted",
			fix_target: "Fix target",
			config_error: "Invalid configuration: \"checks\" must be a list",
			fix_process_error: "Could not fix the entity",
			status_problem: "Problem",
			status_ok: "OK",
			cancel: "Cancel",
			dismiss: "Dismiss",
			confirm_title: "Confirm fix",
			confirm_fix: "Fix {name}?",
			confirm_fix_all: "Fix all {count} problems?",
			snooze: "Snoozed",
			snooze_dialog_title: "Snooze check",
			snooze_dialog_desc: "Ignore this check for:",
			snooze_1h: "1 hour",
			snooze_2h: "2 hours",
			snooze_4h: "4 hours",
			snooze_8h: "8 hours",
			snooze_24h: "1 day",
			snooze_3d: "3 days",
			snooze_custom_label: "Custom duration (hours)",
			snooze_custom_placeholder: "For example: 1.5",
			snooze_confirm_btn: "Snooze",
			unsnooze: "Unsnooze",
			snoozed_section_show: "Show {count} snoozed items",
			snoozed_section_show_one: "Show 1 snoozed item",
			snoozed_section_hide: "Hide {count} snoozed items",
			snoozed_section_hide_one: "Hide 1 snoozed item",
			snoozed_until: "Snoozed until {time}",
			loading: "Loading Home Assistant editor components…",
			editor_title: "Title",
			appearance_section: "Appearance",
			sorting_section: "Sorting",
			display_section: "Display",
			layout_dir: "Item arrangement",
			layout_dir_helper: "Vertical list or horizontal scroll",
			layout_col: "Columns (vertical list)",
			layout_row: "Rows (horizontal scroll)",
			max_items_col: "Number of columns",
			max_items_row: "Items per column",
			count_helper_col: "Number of columns to spread items across",
			count_helper_row: "Items stacked in each column before scrolling sideways",
			text_mode_label: "Long text",
			text_mode_helper: "Scroll long names horizontally instead of cutting them off",
			text_mode_clip: "Clip",
			text_mode_scroll: "Auto-scroll",
			sort_mode: "Sort by",
			sort_manual: "Manual",
			sort_status: "Status (problems first)",
			sort_alphabetical: "Alphabetical",
			sort_domain: "Domain",
			sort_severity: "Severity",
			sort_last_changed: "Last changed",
			sort_direction: "Sort direction",
			sort_asc: "Ascending",
			sort_desc: "Descending",
			show_ok_section: "OK items",
			show_ok_helper: "How to show items that are OK",
			show_ok_inline: "In the list, mixed with problems",
			show_ok_collapsed: "In a collapsed section",
			show_ok_hidden: "Hidden (the card hides itself when everything is OK)",
			entities_section: "Checks",
			no_checks_yet: "No checks yet. Add one to get started.",
			add_check: "Add check",
			paste_check: "Paste check",
			move_before: "Move check before",
			move_after: "Move check after",
			duplicate: "Duplicate check",
			cut_check: "Cut check",
			remove: "Delete check",
			show_code_editor: "Show code editor",
			show_visual_editor: "Show visual editor",
			yaml_hint_json: "JSON syntax, applied after a short pause.",
			select_entity: "Entity",
			display_name: "Name",
			display_name_helper: "Leave empty to use the entity name",
			check_condition: "OK when",
			cond_any: "Any condition is met (OR)",
			cond_all: "All conditions are met (AND)",
			default_fix: "Condition used by Fix",
			default_fix_helper: "Fix sets the entity to this condition",
			condition_n: "Condition {n}",
			condition_single: "OK condition",
			remove_state: "Delete condition",
			add_state: "Add condition",
			advanced_settings: "Advanced",
			severity: "Severity",
			severity_helper: "Sets the order for Fix all and for sorting by severity",
			severity_info: "Info",
			severity_warning: "Warning",
			severity_critical: "Critical",
			icon_override: "Icon",
			color_override: "Name color",
			color_helper: "Any CSS color, for example #1976d2 or var(--accent-color)",
			show_last_changed: "Show time since last change",
			confirmation: "Ask for confirmation before fixing",
			interactions_section: "Interactions",
			tap_action: "Tap behavior",
			hold_action: "Hold behavior",
			hold_action_helper: "Default: open the snooze dialog",
			double_tap_action: "Double tap behavior",
			double_tap_action_helper: "Default: snooze a problem",
			ok_state: "OK state",
			ok_state_helper: "You can also enter states('entity_id') to compare with another entity",
			attr_check: "Attribute (optional)",
			attr_val: "OK attribute value",
			custom_fix: "Custom fix action (optional)",
			custom_fix_hint: "domain.action, or JSON: {\"perform_action\": \"light.turn_on\", \"data\": {\"brightness_pct\": 50}}",
			prereq_section: "Only check when",
			prereq_entity: "Prerequisite entity",
			prereq_state: "Prerequisite state",
			prereq_hint: "Separate values with commas for OR; prefix with != to negate (for example !=off)"
		},
		he: {
			card_name: "כרטיס בדיקות",
			card_description: "בדיקת מצב ישויות ותיקון מהיר של תקלות.",
			title: "בדיקות",
			status: "מצב",
			all_good: "הכול תקין!",
			problems_found: "נמצאו {count} תקלות",
			problems_found_one: "נמצאה תקלה אחת",
			fix_all: "לתקן הכול",
			fix: "תיקון",
			ok: "תקין",
			show_ok_items_btn: "הצגת {count} תקינים",
			show_ok_items_btn_one: "הצגת פריט תקין אחד",
			hide_ok_items_btn: "הסתרת {count} תקינים",
			hide_ok_items_btn_one: "הסתרת פריט תקין אחד",
			unavailable: "לא זמין",
			required: "נדרש",
			attribute: "מאפיין",
			not_exists: "חסר",
			current_state: "מצב נוכחי",
			accepted_one_of: "מצבים תקינים",
			fix_target: "יעד התיקון",
			config_error: "הגדרה לא תקינה: \"checks\" חייב להיות רשימה",
			fix_process_error: "לא הצלחנו לתקן את הישות",
			status_problem: "תקלה",
			status_ok: "תקין",
			cancel: "ביטול",
			dismiss: "סגירה",
			confirm_title: "אישור תיקון",
			confirm_fix: "לתקן את {name}?",
			confirm_fix_all: "לתקן את כל {count} התקלות?",
			snooze: "נדחה",
			snooze_dialog_title: "דחיית בדיקה",
			snooze_dialog_desc: "להתעלם מהבדיקה הזו למשך:",
			snooze_1h: "שעה",
			snooze_2h: "שעתיים",
			snooze_4h: "4 שעות",
			snooze_8h: "8 שעות",
			snooze_24h: "יום",
			snooze_3d: "3 ימים",
			snooze_custom_label: "משך אחר (בשעות)",
			snooze_custom_placeholder: "לדוגמה: 1.5",
			snooze_confirm_btn: "דחייה",
			unsnooze: "ביטול דחייה",
			snoozed_section_show: "הצגת {count} דחויים",
			snoozed_section_show_one: "הצגת פריט דחוי אחד",
			snoozed_section_hide: "הסתרת {count} דחויים",
			snoozed_section_hide_one: "הסתרת פריט דחוי אחד",
			snoozed_until: "נדחה עד {time}",
			loading: "טוען את רכיבי העריכה של Home Assistant…",
			editor_title: "כותרת",
			appearance_section: "מראה",
			sorting_section: "מיון",
			display_section: "תצוגה",
			layout_dir: "סידור הפריטים",
			layout_dir_helper: "רשימה אנכית או גלילה אופקית",
			layout_col: "עמודות (רשימה אנכית)",
			layout_row: "שורות (גלילה אופקית)",
			max_items_col: "מספר עמודות",
			max_items_row: "פריטים בעמודה",
			count_helper_col: "על כמה עמודות לפרוס את הפריטים",
			count_helper_row: "כמה פריטים בכל עמודה לפני גלילה הצידה",
			text_mode_label: "טקסט ארוך",
			text_mode_helper: "שמות ארוכים ייגללו לרוחב במקום להיחתך",
			text_mode_clip: "חיתוך",
			text_mode_scroll: "גלילה אוטומטית",
			sort_mode: "מיון לפי",
			sort_manual: "ידני",
			sort_status: "מצב (תקלות קודם)",
			sort_alphabetical: "א״ב",
			sort_domain: "סוג ישות",
			sort_severity: "חומרה",
			sort_last_changed: "שינוי אחרון",
			sort_direction: "כיוון המיון",
			sort_asc: "עולה",
			sort_desc: "יורד",
			show_ok_section: "פריטים תקינים",
			show_ok_helper: "איך להציג פריטים שהם תקינים",
			show_ok_inline: "ברשימה, יחד עם התקלות",
			show_ok_collapsed: "באזור מקופל",
			show_ok_hidden: "מוסתרים (הכרטיס נעלם כשהכול תקין)",
			entities_section: "בדיקות",
			no_checks_yet: "עדיין אין בדיקות. אפשר להוסיף בדיקה ראשונה.",
			add_check: "הוספת בדיקה",
			paste_check: "הדבקת בדיקה",
			move_before: "הזזה אחורה",
			move_after: "הזזה קדימה",
			duplicate: "שכפול בדיקה",
			cut_check: "גזירת בדיקה",
			remove: "מחיקת בדיקה",
			show_code_editor: "עורך קוד",
			show_visual_editor: "עורך חזותי",
			yaml_hint_json: "תחביר JSON, נשמר אחרי הפסקה קצרה בהקלדה.",
			select_entity: "ישות",
			display_name: "שם",
			display_name_helper: "ריק = שם הישות",
			check_condition: "תקין כאשר",
			cond_any: "אחד התנאים מתקיים (OR)",
			cond_all: "כל התנאים מתקיימים (AND)",
			default_fix: "התנאי שהתיקון יחיל",
			default_fix_helper: "לחיצה על \"תיקון\" תעביר את הישות למצב הזה",
			condition_n: "תנאי {n}",
			condition_single: "תנאי תקינות",
			remove_state: "מחיקת תנאי",
			add_state: "הוספת תנאי",
			advanced_settings: "מתקדם",
			severity: "חומרה",
			severity_helper: "קובעת את סדר התיקון ב\"לתקן הכול\" ובמיון לפי חומרה",
			severity_info: "מידע",
			severity_warning: "אזהרה",
			severity_critical: "קריטי",
			icon_override: "סמל",
			color_override: "צבע השם",
			color_helper: "כל צבע CSS, למשל ‎#1976d2 או var(--accent-color)",
			show_last_changed: "הצגת הזמן מאז השינוי האחרון",
			confirmation: "לבקש אישור לפני תיקון",
			interactions_section: "אינטראקציות",
			tap_action: "פעולה בהקשה",
			hold_action: "פעולה בלחיצה ארוכה",
			hold_action_helper: "ברירת מחדל: חלון הדחייה",
			double_tap_action: "פעולה בהקשה כפולה",
			double_tap_action_helper: "ברירת מחדל: דחיית תקלה",
			ok_state: "מצב תקין",
			ok_state_helper: "אפשר גם להזין states('entity_id') כדי להשוות לישות אחרת",
			attr_check: "מאפיין (לא חובה)",
			attr_val: "ערך תקין למאפיין",
			custom_fix: "פעולת תיקון מותאמת (לא חובה)",
			custom_fix_hint: "domain.action, או JSON: {\"perform_action\": \"light.turn_on\", \"data\": {\"brightness_pct\": 50}}",
			prereq_section: "לבדוק רק כאשר",
			prereq_entity: "ישות תנאי",
			prereq_state: "מצב נדרש",
			prereq_hint: "פסיק בין ערכים = OR; ‏!= בהתחלה = שלילה (למשל ‎!=off)"
		}
	};
}));
//#endregion
//#region src/utils.ts
function gt(e, t) {
	if (t.name) return t.name;
	let n = e?.states[t.entity];
	if (!n) return t.entity;
	if (typeof e?.formatEntityName == "function") try {
		let t = e.formatEntityName(n, [{ type: "device" }, { type: "entity" }], { separator: " · " });
		if (t) return t;
	} catch {}
	return n.attributes?.friendly_name || t.entity;
}
function _t(e, t) {
	let n = t === void 0 ? G() : `${e.entity || "check"}-${t}`;
	return {
		...e,
		id: e.id || n,
		entity: e.entity || "",
		conditions_mode: e.conditions_mode || "any",
		default_condition_index: e.default_condition_index ?? 0,
		conditions: e.conditions || []
	};
}
function vt(e) {
	return e.fix_action && e.fix_action.action !== "fix" ? e.fix_action.action !== "none" : St.has(e.entity.split(".")[0]) ? e.conditions_mode === "all" ? e.conditions.length > 0 && e.conditions.every((e) => e.fix_service?.trim()) : !!(e.conditions[e.default_condition_index ?? 0] ?? e.conditions[0])?.fix_service?.trim() : !0;
}
function G() {
	return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function yt() {
	return { state: "off" };
}
function bt(e) {
	let t = { ...e };
	return t.show_ok_section ||= "inline", t.sort ||= "manual", t.sort_direction ||= "asc", t;
}
function xt(e, t, n) {
	let r = "", i = {};
	if (n?.attribute?.trim()) {
		let a = t, o = parseFloat(a);
		if (e === "light") return r = "turn_on", n.attribute === "brightness" || n.attribute === "brightness_pct" ? isNaN(o) || (i[n.attribute] = o) : [
			"color_temp",
			"color_temp_kelvin",
			"effect"
		].includes(n.attribute) && (i[n.attribute] = n.attribute === "effect" ? a : o), {
			service: r,
			serviceData: i
		};
		if (e === "climate") {
			if (n.attribute === "temperature" && !isNaN(o)) return {
				service: "set_temperature",
				serviceData: { temperature: o }
			};
			if (n.attribute === "fan_mode") return {
				service: "set_fan_mode",
				serviceData: { fan_mode: a }
			};
			if (n.attribute === "preset_mode") return {
				service: "set_preset_mode",
				serviceData: { preset_mode: a }
			};
			if (n.attribute === "swing_mode") return {
				service: "set_swing_mode",
				serviceData: { swing_mode: a }
			};
		}
		if (e === "water_heater" && n.attribute === "temperature" && !isNaN(o)) return {
			service: "set_temperature",
			serviceData: { temperature: o }
		};
		if (e === "humidifier") {
			if (n.attribute === "humidity" && !isNaN(o)) return {
				service: "set_humidity",
				serviceData: { humidity: o }
			};
			if (n.attribute === "mode") return {
				service: "set_mode",
				serviceData: { mode: a }
			};
		}
		if (e === "media_player") {
			if (n.attribute === "volume_level" && !isNaN(o)) return {
				service: "volume_set",
				serviceData: { volume_level: o }
			};
			if (n.attribute === "source") return {
				service: "select_source",
				serviceData: { source: a }
			};
		}
	}
	switch (e) {
		case "switch":
		case "light":
		case "input_boolean":
		case "fan":
		case "siren":
		case "remote":
		case "automation":
		case "script":
		case "camera":
		case "group":
			r = t === "off" ? "turn_off" : "turn_on";
			break;
		case "lock":
			r = t === "unlocked" ? "unlock" : t === "open" ? "open" : "lock";
			break;
		case "cover":
			t === "open" ? r = "open_cover" : t === "closed" ? r = "close_cover" : t === "stopped" ? r = "stop_cover" : isNaN(parseFloat(t)) ? r = t === "off" ? "close_cover" : "open_cover" : (r = "set_cover_position", i.position = parseFloat(t));
			break;
		case "valve":
			t === "open" ? r = "open_valve" : t === "closed" ? r = "close_valve" : isNaN(parseFloat(t)) ? r = t === "off" ? "close_valve" : "open_valve" : (r = "set_valve_position", i.position = parseFloat(t));
			break;
		case "climate":
			r = "set_hvac_mode", i.hvac_mode = t;
			break;
		case "water_heater":
			r = "set_operation_mode", i.operation_mode = t;
			break;
		case "humidifier":
			r = t === "off" ? "turn_off" : "turn_on";
			break;
		case "select":
		case "input_select":
			r = "select_option", i.option = t;
			break;
		case "number":
		case "input_number":
			r = "set_value", i.value = parseFloat(t);
			break;
		case "text":
		case "input_text":
			r = "set_value", i.value = t;
			break;
		case "datetime":
		case "input_datetime":
		case "date":
		case "time":
			r = "set_datetime", i.datetime = t;
			break;
		case "counter":
			t === "increment" || t === "decrement" ? r = t : (r = "set_value", i.value = parseInt(t, 10));
			break;
		case "timer":
			r = t === "active" ? "start" : t === "paused" ? "pause" : "cancel";
			break;
		case "button":
		case "input_button":
			r = "press";
			break;
		case "scene":
			r = "turn_on";
			break;
		case "vacuum":
			r = ["docked", "returning"].includes(t) ? "return_to_base" : ["cleaning", "running"].includes(t) ? "start" : t === "paused" ? "pause" : "stop";
			break;
		case "alarm_control_panel":
			r = t === "armed_home" ? "alarm_arm_home" : t === "armed_away" ? "alarm_arm_away" : t === "armed_night" ? "alarm_arm_night" : t === "armed_vacation" ? "alarm_arm_vacation" : t === "armed_custom_bypass" ? "alarm_arm_custom_bypass" : "alarm_disarm";
			break;
		case "media_player":
			r = t === "playing" ? "media_play" : t === "paused" ? "media_pause" : t === "idle" ? "media_stop" : t === "off" ? "turn_off" : "turn_on";
			break;
		case "notify":
			r = "send_message", i.message = t;
			break;
		case "lawn_mower":
			r = t === "mowing" ? "start_mowing" : t === "docked" ? "dock" : t === "paused" ? "pause" : "start_mowing";
			break;
		default: r = t === "off" ? "turn_off" : "turn_on";
	}
	return {
		service: r,
		serviceData: i
	};
}
var St, Ct = t((() => {
	St = /* @__PURE__ */ new Set([
		"binary_sensor",
		"sensor",
		"device_tracker",
		"person",
		"sun",
		"weather",
		"zone",
		"calendar",
		"event",
		"image",
		"air_quality",
		"geo_location"
	]);
}));
ht(), Ct();
var wt = /states\(['"]([^'"]+)['"]\)/, Tt = /states\(['"]([^'"]+)['"]\)/g;
function K(e, t) {
	if (!t || !t.includes("states(")) return t;
	try {
		let n = wt.exec(t);
		if (n?.[1] && e.states[n[1]]) return e.states[n[1]].state;
	} catch (e) {
		console.warn("Error parsing expected pattern", e);
	}
	return t;
}
function Et(e, t, n) {
	if (n.prerequisite_entity?.trim()) {
		let t = e.states[n.prerequisite_entity];
		if (t) {
			let r;
			if (n.prerequisite_attribute?.trim()) {
				let i = t.attributes?.[n.prerequisite_attribute], a = n.prerequisite_attribute_value?.trim() ? n.prerequisite_attribute_value : n.prerequisite_state || "on";
				if (a = K(e, a), a.startsWith("!=")) {
					let e = a.slice(2).split(",").map((e) => e.trim());
					r = i !== void 0 && !e.includes(String(i));
				} else {
					let e = a.split(",").map((e) => e.trim());
					r = i !== void 0 && e.includes(String(i));
				}
			} else {
				let i = n.prerequisite_state || "on";
				i = K(e, i), r = i.startsWith("!=") ? !i.slice(2).split(",").map((e) => e.trim()).includes(t.state) : i.split(",").map((e) => e.trim()).includes(t.state);
			}
			if (!r) return !0;
		}
	}
	let r = t.state;
	if (r === "unavailable" || r === "unknown") return !1;
	if (n.attribute?.trim()) {
		let r = t.attributes?.[n.attribute], i = K(e, n.attribute_value?.trim() ? n.attribute_value : n.state);
		return r !== void 0 && String(r) === String(i);
	}
	return r === K(e, n.state);
}
function Dt(e, t) {
	if (!t.entity) return !1;
	let n = e.states[t.entity];
	if (!n) return !0;
	let r = t.conditions.map((t) => Et(e, n, t));
	return t.conditions_mode === "all" ? !r.every(Boolean) : !r.some(Boolean);
}
//#endregion
//#region src/marquee-controller.ts
R();
var Ot = 20, kt = 4, At = 30, jt = 1, Mt = class {
	constructor(e, t) {
		this.overflowState = /* @__PURE__ */ new Map(), this.resizeObserver = null, this.intersectionObserver = null, this.rafId = null, this.isVisible = !0, this.host = e, this.targets = t, e.addController(this);
	}
	hostConnected() {
		typeof ResizeObserver < "u" && (this.resizeObserver = new ResizeObserver(() => this.scheduleCheck()), this.resizeObserver.observe(this.host)), typeof IntersectionObserver < "u" && (this.intersectionObserver = new IntersectionObserver((e) => {
			let t = e.some((e) => e.isIntersecting);
			t && !this.isVisible && this.scheduleCheck(), this.isVisible = t;
		}), this.intersectionObserver.observe(this.host));
		let e = document.fonts;
		e?.ready && e.ready.then(() => {
			this.host.isConnected && this.scheduleCheck();
		});
	}
	hostDisconnected() {
		this.resizeObserver?.disconnect(), this.resizeObserver = null, this.intersectionObserver?.disconnect(), this.intersectionObserver = null, this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.overflowState.clear();
	}
	hostUpdated() {
		this.scheduleCheck();
	}
	scheduleCheck() {
		this.rafId === null && (this.rafId = requestAnimationFrame(() => {
			this.rafId = null, this.check();
		}));
	}
	check() {
		let e = this.host.shadowRoot;
		if (e) for (let t of this.targets) {
			let n = e.querySelector(t.parent);
			if (!n) {
				this.publish(t, !1);
				continue;
			}
			let r = n.querySelector(".marquee-inner");
			if (!r) {
				this.publish(t, !1);
				continue;
			}
			let i = n.clientWidth;
			if (i <= 0) continue;
			let a = Nt(r), o = a > i + jt;
			if (o) {
				let e = Pt(a / Ot, kt, At);
				n.style.setProperty("--marquee-duration", `${e.toFixed(2)}s`);
			} else n.style.removeProperty("--marquee-duration");
			this.publish(t, o);
		}
	}
	publish(e, t) {
		this.overflowState.get(e.parent) !== t && (this.overflowState.set(e.parent, t), e.setOverflow(t));
	}
};
function Nt(e) {
	if (typeof document.createRange != "function") return e.getBoundingClientRect().width;
	let t = document.createRange();
	try {
		return t.selectNodeContents(e), t.getBoundingClientRect().width;
	} finally {
		t.detach?.();
	}
}
function Pt(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
function Ft(e, t) {
	return t ? k`
    <span class="marquee-track">
      <span class="marquee-inner">${e}</span>
      <span class="marquee-inner" aria-hidden="true">${e}</span>
    </span>
  ` : k`<span class="marquee-inner">${e}</span>`;
}
//#endregion
//#region src/preload-editor.ts
function It() {
	if (q) return;
	let e = window.requestIdleCallback, t = () => {
		Lt();
	};
	e ? e(t, { timeout: 2e3 }) : setTimeout(t, 500);
}
function Lt() {
	return q || (customElements.get("ha-form") && customElements.get("ha-entity-picker") ? (q = Promise.resolve(), q) : (q = (async () => {
		try {
			let e = window.loadCardHelpers;
			if (e) {
				let t = (await e())?.createCardElement?.({
					type: "entities",
					entities: []
				})?.constructor;
				if (t?.getConfigElement) {
					await t.getConfigElement();
					return;
				}
			}
			await customElements.whenDefined("hui-entities-card");
			let t = customElements.get("hui-entities-card");
			t?.getConfigElement && await t.getConfigElement();
		} catch (e) {
			console.warn("[checklist-card] failed to preload editor components", e);
		}
	})(), q));
}
var q, Rt = t((() => {
	q = null;
}));
//#endregion
//#region src/action-handler.ts
Rt();
var J = /* @__PURE__ */ new WeakMap(), zt = 500, Bt = 250;
function Vt(e, t) {
	for (let n of e.composedPath()) {
		if (n === t) return !1;
		if (n instanceof HTMLElement && n.matches("button, a, input, select, textarea, [data-no-row-action]")) return !0;
	}
	return !1;
}
function Ht(e, t) {
	if (J.has(e)) {
		J.set(e, t);
		return;
	}
	J.set(e, t);
	let n, r, i = !1, a = !1, o = () => J.get(e), s = () => {
		n &&= (clearTimeout(n), void 0);
	}, c = (t) => {
		e.dispatchEvent(new CustomEvent("action", {
			detail: { action: t },
			bubbles: !0,
			composed: !0
		}));
	}, l = () => {
		o()?.hasDoubleClick ? r ? (clearTimeout(r), r = void 0, c("double_tap")) : r = window.setTimeout(() => {
			r = void 0, c("tap");
		}, Bt) : c("tap");
	}, u = (t) => {
		t.button !== 0 || Vt(t, e) || (a = !0, i = !1, s(), o()?.hasHold && (n = window.setTimeout(() => {
			i = !0, c("hold");
		}, zt)));
	}, d = (t) => {
		a && (a = !1, s(), !(i || Vt(t, e)) && l());
	}, f = () => {
		a = !1, s();
	};
	e.addEventListener("pointerdown", u, { passive: !0 }), e.addEventListener("pointerup", d), e.addEventListener("pointercancel", f), e.addEventListener("pointerleave", f), e.addEventListener("contextmenu", (e) => {
		(i || n) && e.preventDefault();
	}), e.addEventListener("keydown", (t) => {
		t.key !== "Enter" && t.key !== " " || t.repeat || Vt(t, e) || (t.preventDefault(), c("tap"));
	});
}
var Ut = tt(class extends nt {
	constructor(e) {
		super(e);
	}
	render(e) {}
	update(e, [t]) {
		return Ht(e.element, t), this.render(t);
	}
});
//#endregion
//#region \0@oxc-project+runtime@0.138.0/helpers/esm/decorate.js
function Y(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
var Wt = t((() => {}));
R(), Wt();
var X = class extends L {
	constructor(...e) {
		super(...e), this.isProblem = !1, this.isFixing = !1, this.severity = "info", this.isSnoozed = !1, this.snoozeUntil = null, this.marqueeEnabled = !1, this._isTitleOverflowing = !1, this._isStateOverflowing = !1, this._marquee = new Mt(this, [{
			parent: ".entity-name",
			setOverflow: (e) => {
				this._isTitleOverflowing = e;
			}
		}, {
			parent: ".entity-state",
			setOverflow: (e) => {
				this._isStateOverflowing = e;
			}
		}]);
	}
	static {
		this.styles = l`
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
      box-shadow: 0 0 0 2px var(--primary-color);
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
      background-color: rgba(var(--rgb-success-color, 76, 175, 80), 0.2);
      color: var(--success-color, #4caf50);
    }
    .icon-wrapper.snoozed {
      background-color: rgba(var(--rgb-warning-color, 229, 155, 45), 0.18);
      color: var(--warning-color, #e59b2d);
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
      background-color: var(--warning-color, #e59b2d);
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

    .problem-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-inline-start: 12px;
      flex-shrink: 0;
      color: var(--error-color, #db4437);
      font-size: 13px;
      font-weight: 500;
      --mdc-icon-size: 18px;
    }

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
      color: var(--warning-color, #e59b2d);
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }
    .snooze-badge ha-icon {
      --mdc-icon-size: 14px;
      color: var(--warning-color, #e59b2d);
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
			Tt.lastIndex = 0;
			let e;
			for (; (e = Tt.exec(n)) !== null;) {
				let n = e[1];
				if (n && t.states?.[n] !== this.hass.states?.[n]) return !0;
			}
		}
		return t.language !== this.hass.language || t.user?.id !== this.hass.user?.id || (t.translationMetadata?.dir ?? (t.language === "he" ? "rtl" : "ltr")) !== (this.hass.translationMetadata?.dir ?? (this.hass.language === "he" ? "rtl" : "ltr"));
	}
	_handleAction(e) {
		let t = e.detail.action;
		if (t === "fix") return;
		if (t === "hold" && !this.rule.hold_action) {
			this.dispatchEvent(new CustomEvent("snooze-requested", {
				detail: { ruleId: this.rule.id },
				bubbles: !0,
				composed: !0
			}));
			return;
		}
		if (t === "double_tap" && this.isProblem && !this.isSnoozed && !this.rule.double_tap_action) {
			this.dispatchEvent(new CustomEvent("snooze-requested", {
				detail: { ruleId: this.rule.id },
				bubbles: !0,
				composed: !0
			}));
			return;
		}
		let n = {
			entity: this.rule.entity,
			tap_action: this.rule.tap_action || { action: "more-info" },
			hold_action: this.rule.hold_action || { action: "none" },
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
	_handleUnsnoozeClick(e) {
		e.stopPropagation(), this.dispatchEvent(new CustomEvent("unsnooze-requested", {
			detail: { ruleId: this.rule.id },
			bubbles: !0,
			composed: !0
		}));
	}
	_formatSnoozeTime() {
		if (!this.snoozeUntil) return "";
		let e = new Date(this.snoozeUntil), t = /* @__PURE__ */ new Date(), n = e.toDateString() === t.toDateString() ? {
			hour: "2-digit",
			minute: "2-digit"
		} : {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		};
		return e.toLocaleString(this.hass?.language ?? "en", n);
	}
	_handleFixClick(e) {
		if (e.stopPropagation(), this.isFixing) return;
		let t = this.rule.fix_action;
		if (t && t.action !== "fix") {
			let e = t.confirmation ?? this.rule.confirmation;
			this.dispatchEvent(new CustomEvent("hass-action", {
				detail: {
					config: {
						entity: this.rule.entity,
						tap_action: e ? {
							...t,
							confirmation: e
						} : t
					},
					action: "tap"
				},
				bubbles: !0,
				composed: !0
			}));
			return;
		}
		this.dispatchEvent(new CustomEvent("fix-requested", {
			detail: { ruleId: this.rule.id },
			bubbles: !0,
			composed: !0
		}));
	}
	_renderTitleSpan(e) {
		let t = this._isTitleOverflowing && this.marqueeEnabled, n = k`${e}${this.rule.show_last_changed && this.stateObj ? k`
      <span style="font-size: 0.8em; opacity: 0.7; margin-inline-start: 4px;">
        <ha-relative-time .hass=${this.hass} .datetime=${this.stateObj.last_changed}></ha-relative-time>
      </span>
    ` : ""}`, r = this.rule.color ? `color: ${this.rule.color}` : "";
		return k`
      <span class="entity-name ${t ? "overflowing" : ""}" style=${r}>
        ${Ft(n, t)}
      </span>
    `;
	}
	_renderStateSpan(e) {
		let t = this._isStateOverflowing && this.marqueeEnabled;
		return k`
      <span class="entity-state ${t ? "overflowing" : ""}">
        ${Ft(e, t)}
      </span>
    `;
	}
	_renderSingleConditionStatus(e, t) {
		let n = K(this.hass, e.state), r = !!e.attribute?.trim(), i = r ? K(this.hass, e.attribute_value || e.state) : null, a = k`${U(this.hass, "current_state")}: ${t} (${U(this.hass, "required")}: ${n})${r ? k` · ${U(this.hass, "attribute")} ${e.attribute}: ${this.stateObj?.attributes?.[e.attribute] ?? U(this.hass, "not_exists")} (${U(this.hass, "required")}: ${i})` : ""}`;
		return this._renderStateSpan(a);
	}
	_renderMultiConditionStatus(e) {
		if (this.rule.conditions_mode === "any") {
			let t = this.rule.conditions.map((e) => K(this.hass, e.state)).join(", "), n = this.rule.default_condition_index ?? 0, r = K(this.hass, this.rule.conditions[n]?.state ?? this.rule.conditions[0]?.state), i = k`${U(this.hass, "current_state")}: ${e} · ${U(this.hass, "accepted_one_of")}: ${t} · ${U(this.hass, "fix_target")}: ${r}`;
			return this._renderStateSpan(i);
		}
		let t = (this.stateObj ? this.rule.conditions.filter((e) => !Et(this.hass, this.stateObj, e)) : this.rule.conditions).map((e) => {
			let t = K(this.hass, e.state), n = e.attribute?.trim() ? ` | ${e.attribute}=${K(this.hass, e.attribute_value || e.state)}` : "";
			return `${U(this.hass, "status")}=${t}${n}`;
		}).join(" · "), n = k`${U(this.hass, "current_state")}: ${e} · ${U(this.hass, "required")}: ${t}`;
		return this._renderStateSpan(n);
	}
	updated(e) {
		super.updated(e);
		let t = this.hass?.translationMetadata?.dir ?? (this.hass?.language === "he" ? "rtl" : "ltr");
		this.setAttribute("dir", t), this.classList.toggle("marquee-enabled", this.marqueeEnabled);
	}
	render() {
		let e = this.stateObj?.state ?? U(this.hass, "unavailable"), t = this.rule.conditions.length > 1, n = gt(this.hass, this.rule), r = `${n}, ${U(this.hass, this.isProblem ? "status_problem" : "status_ok")}`, i = this.rule.icon;
		return k`
      <div
        class="check-item${this.isSnoozed ? " is-snoozed" : ""}"
        role=${"listitem"}
        aria-label=${r}
        @action=${this._handleAction}
        .actionHandler=${Ut({
			hasHold: !0,
			hasDoubleClick: !0
		})}
        tabindex="0"
      >
        <ha-ripple></ha-ripple>
        <div class="entity-info-container">
          <div class="icon-wrapper ${this.isSnoozed ? "snoozed" : this.isProblem ? "problem" : "ok"}">
            ${i ? k`<ha-icon .icon=${i}></ha-icon>` : k`<ha-state-icon class="entity-icon" .hass=${this.hass} .stateObj=${this.stateObj}></ha-state-icon>`}
          </div>
          <div class="check-text">
            ${this._renderTitleSpan(n)}
            ${this.isProblem || this.isSnoozed ? t ? this._renderMultiConditionStatus(e) : this._renderSingleConditionStatus(this.rule.conditions[0], e) : this._renderStateSpan(k`${U(this.hass, "status")}: ${e}`)}
          </div>
        </div>
        ${this.isSnoozed ? k`
          <div class="snooze-actions">
            <span class="snooze-badge">
              <ha-icon icon="mdi:alarm-snooze"></ha-icon>
              ${this.snoozeUntil ? U(this.hass, "snoozed_until", { time: this._formatSnoozeTime() }) : U(this.hass, "snooze")}
            </span>
            <button class="unsnooze-btn" @click=${this._handleUnsnoozeClick}>
              ${U(this.hass, "unsnooze")}
            </button>
          </div>
        ` : this.isProblem && !vt(this.rule) ? k`
          <span class="problem-badge">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${U(this.hass, "status_problem")}
          </span>
        ` : this.isProblem ? k`
          <button
            class="fix-btn"
            @click=${this._handleFixClick}
            ?disabled=${this.isFixing}
            aria-label=${U(this.hass, "fix")}
            aria-busy=${this.isFixing}
          >
            ${this.isFixing ? k`<div class="spinner"></div>` : k`${U(this.hass, "fix")}`}
          </button>
        ` : k`
          <div style="min-width: 60px; display: flex; justify-content: flex-end; align-items: center;">
            <span class="ok-badge">
              <ha-icon icon="mdi:check" style="--mdc-icon-size: 18px;"></ha-icon>
              ${U(this.hass, "ok")}
            </span>
          </div>
        `}
      </div>
    `;
	}
};
Y([z({ attribute: !1 })], X.prototype, "stateObj", void 0), Y([z({ attribute: !1 })], X.prototype, "rule", void 0), Y([z({ attribute: !1 })], X.prototype, "hass", void 0), Y([z({ type: Boolean })], X.prototype, "isProblem", void 0), Y([z({ type: Boolean })], X.prototype, "isFixing", void 0), Y([z({ type: String })], X.prototype, "severity", void 0), Y([z({ type: Boolean })], X.prototype, "isSnoozed", void 0), Y([z({ type: Number })], X.prototype, "snoozeUntil", void 0), Y([z({ type: Boolean })], X.prototype, "marqueeEnabled", void 0), Y([B()], X.prototype, "_isTitleOverflowing", void 0), Y([B()], X.prototype, "_isStateOverflowing", void 0), X = Y([Re("checklist-card-item")], X);
//#endregion
//#region node_modules/memoize-one/dist/memoize-one.esm.js
function Gt(e, t) {
	return !!(e === t || Jt(e) && Jt(t));
}
function Kt(e, t) {
	if (e.length !== t.length) return !1;
	for (var n = 0; n < e.length; n++) if (!Gt(e[n], t[n])) return !1;
	return !0;
}
function qt(e, t) {
	t === void 0 && (t = Kt);
	var n = null;
	function r() {
		var r = [...arguments];
		if (n && n.lastThis === this && t(r, n.lastArgs)) return n.lastResult;
		var i = e.apply(this, r);
		return n = {
			lastResult: i,
			lastArgs: r,
			lastThis: this
		}, i;
	}
	return r.clear = function() {
		n = null;
	}, r;
}
var Jt, Yt = t((() => {
	Jt = Number.isNaN || function(e) {
		return typeof e == "number" && e !== e;
	};
})), Xt, Zt, Qt, $t, en, tn, nn, rn, an, on, sn, cn, ln = t((() => {
	Xt = "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z", Zt = "M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z", Qt = "M19,3L13,9L15,11L22,4V3M12,12.5A0.5,0.5 0 0,1 11.5,12A0.5,0.5 0 0,1 12,11.5A0.5,0.5 0 0,1 12.5,12A0.5,0.5 0 0,1 12,12.5M6,20A2,2 0 0,1 4,18C4,16.89 4.9,16 6,16A2,2 0 0,1 8,18C8,19.11 7.1,20 6,20M6,8A2,2 0 0,1 4,6C4,4.89 4.9,4 6,4A2,2 0 0,1 8,6C8,7.11 7.1,8 6,8M9.64,7.64C9.87,7.14 10,6.59 10,6A4,4 0 0,0 6,2A4,4 0 0,0 2,6A4,4 0 0,0 6,10C6.59,10 7.14,9.87 7.64,9.64L10,12L7.64,14.36C7.14,14.13 6.59,14 6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22A4,4 0 0,0 10,18C10,17.41 9.87,16.86 9.64,16.36L12,14L19,21H22V20L9.64,7.64Z", $t = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z", en = "M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z", tn = "M10,9A1,1 0 0,1 11,8A1,1 0 0,1 12,9V13.47L13.21,13.6L18.15,15.79C18.68,16.03 19,16.56 19,17.14V21.5C18.97,22.32 18.32,22.97 17.5,23H11C10.62,23 10.26,22.85 10,22.57L5.1,18.37L5.84,17.6C6.03,17.39 6.3,17.28 6.58,17.28H6.8L10,19V9M11,5A4,4 0 0,1 15,9C15,10.5 14.2,11.77 13,12.46V11.24C13.61,10.69 14,9.89 14,9A3,3 0 0,0 11,6A3,3 0 0,0 8,9C8,9.89 8.39,10.69 9,11.24V12.46C7.8,11.77 7,10.5 7,9A4,4 0 0,1 11,5Z", nn = "M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z", rn = "M11 15H17V17H11V15M9 7H7V9H9V7M11 13H17V11H11V13M11 9H17V7H11V9M9 11H7V13H9V11M21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5M19 5H5V19H19V5M9 15H7V17H9V15Z", an = "M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z", on = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", sn = "M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z", cn = "M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z";
})), un, dn = t((() => {
	R(), un = l`
  :host {
    display: flex;
    flex-direction: column;
    gap: 24px;
    color: var(--primary-text-color);
  }

  ha-form {
    display: block;
  }

  .loading {
    padding: 32px;
    text-align: center;
    color: var(--secondary-text-color);
  }

  .section-title {
    margin: 0 0 -8px;
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px 16px;
    border: 1px dashed var(--divider-color);
    border-radius: var(--ha-border-radius-lg, 12px);
    color: var(--secondary-text-color);
    text-align: center;
  }
  .empty-state p {
    margin: 0;
  }

  /* Tabbed check editor — same structure and class names as HA's
     hui-stack-card-editor (.toolbar / #editor / #card-options). */
  .toolbar {
    display: flex;
    align-items: center;
  }
  .toolbar ha-tab-group {
    flex-grow: 1;
    min-width: 0;
    --ha-tab-track-color: var(--card-background-color);
  }
  .toolbar ha-tab-group-tab.invalid {
    color: var(--error-color);
  }

  #editor {
    border: 1px solid var(--divider-color);
    padding: 12px;
  }
  @media (max-width: 450px) {
    #editor {
      margin: 0 -12px;
    }
  }

  #card-options {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
  #card-options .gui-mode-button {
    margin-inline-end: auto;
  }

  .delete-btn {
    color: var(--error-color);
  }

  .check-editor-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-top: 8px;
  }

  .conditions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .condition-item {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-border-radius-lg, 12px);
  }

  .condition-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 40px;
  }

  .condition-title {
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
  }

  .yaml-editor {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 8px;
  }
  .yaml-editor ha-yaml-editor {
    display: block;
    width: 100%;
  }
  .yaml-editor textarea {
    box-sizing: border-box;
    width: 100%;
    min-height: 280px;
    padding: 12px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-border-radius-md, 8px);
    background: var(--code-editor-background-color, var(--card-background-color));
    color: var(--primary-text-color);
    font-family: var(--ha-font-family-code, monospace);
    font-size: 13px;
    line-height: 1.5;
    resize: vertical;
  }
  .yaml-editor textarea:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .hint {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .yaml-error {
    color: var(--error-color);
    font-size: 12px;
  }
`;
})), fn = /* @__PURE__ */ n({ ChecklistCardEditor: () => Q }), Z, pn, mn, hn, Q, gn = t((() => {
	R(), $e(), Yt(), ln(), dn(), ht(), Ct(), Wt(), pn = [
		"entity",
		"name",
		"severity",
		"icon",
		"color",
		"show_last_changed",
		"tap_action",
		"hold_action",
		"double_tap_action"
	], mn = [
		"attribute",
		"attribute_value",
		"fix_service",
		"prerequisite_entity",
		"prerequisite_attribute",
		"prerequisite_state",
		"prerequisite_attribute_value"
	], hn = (e) => e == null || e === "" || typeof e == "object" && !Array.isArray(e) && Object.keys(e).length === 0, Q = class extends L {
		static {
			Z = this;
		}
		constructor(...e) {
			super(...e), this._selectedCheck = 0, this._useHaYamlEditor = !1, this._pickersReady = !1, this._yamlMode = !1, this._hasClipboard = !1, this._yamlError = null, this._pickerLoadStarted = !1, this._yamlDebounceTimer = null, this._schemaCache = /* @__PURE__ */ new Map(), this._onStorageEvent = (e) => {
				e.key === Z.CLIPBOARD_KEY && (this._hasClipboard = !!this._readClipboard());
			}, this._handleSelectedCheck = (e) => {
				let t = e.detail?.name, n = typeof t == "string" ? parseInt(t, 10) : t;
				typeof n == "number" && Number.isFinite(n) && (this._selectedCheck = n, this._yamlError = null);
			}, this._handleAddCheck = () => {
				let e = this._readClipboard();
				if (e) {
					let t = {
						...JSON.parse(JSON.stringify(e)),
						id: G()
					}, n = [...this._config.checks || [], t];
					this._writeClipboard(null), this._selectedCheck = n.length - 1, this._updateConfig({ checks: n });
					return;
				}
				this._addCheck(), this._selectedCheck = (this._config.checks?.length || 1) - 1;
			}, this._handleDeleteSelectedCheck = () => {
				let e = this._config.checks?.length || 0;
				if (e === 0) return;
				let t = this._config.checks.filter((e, t) => t !== this._selectedCheck);
				this._selectedCheck = Math.max(0, Math.min(this._selectedCheck, e - 2)), this._updateConfig({ checks: t });
			}, this._handleCutCheck = () => {
				let e = this._config.checks?.[this._selectedCheck];
				e && (this._writeClipboard(e), this._handleDeleteSelectedCheck());
			}, this._handleMoveCheck = (e) => {
				let t = e.currentTarget.move;
				if (t !== -1 && t !== 1) return;
				let n = this._selectedCheck, r = n + t, i = [...this._config.checks || []];
				if (r < 0 || r >= i.length) return;
				let [a] = i.splice(n, 1);
				i.splice(r, 0, a), this._selectedCheck = r, this._updateConfig({ checks: i });
			}, this._handleDuplicateCheck = () => {
				let e = this._config.checks?.[this._selectedCheck];
				if (!e) return;
				let t = {
					...JSON.parse(JSON.stringify(e)),
					id: G()
				}, n = this._selectedCheck + 1, r = [...this._config.checks];
				r.splice(n, 0, t), this._selectedCheck = n, this._updateConfig({ checks: r });
			}, this._toggleYamlMode = () => {
				this._yamlMode = !this._yamlMode, this._yamlError = null;
			}, this._handleYamlInput = (e, t) => {
				let n = e.target.value;
				this._yamlDebounceTimer !== null && window.clearTimeout(this._yamlDebounceTimer), this._yamlDebounceTimer = window.setTimeout(() => {
					this._yamlDebounceTimer = null;
					try {
						this._yamlError = this._applyParsedCheck(JSON.parse(n), t);
					} catch (e) {
						this._yamlError = e.message;
					}
				}, 250);
			}, this._handleHaYamlChange = (e) => {
				e.stopPropagation();
				let t = e.detail;
				if (!t.isValid) {
					this._yamlError = "Invalid YAML";
					return;
				}
				this._yamlError = this._applyParsedCheck(t.value, this._selectedCheck);
			}, this._cardSchema = qt((e, t) => {
				let n = (e) => U(this.hass, e), r = [{
					name: "sort",
					required: !0,
					selector: { select: {
						mode: "dropdown",
						options: [
							{
								value: "manual",
								label: n("sort_manual")
							},
							{
								value: "status",
								label: n("sort_status")
							},
							{
								value: "alphabetical",
								label: n("sort_alphabetical")
							},
							{
								value: "domain",
								label: n("sort_domain")
							},
							{
								value: "severity",
								label: n("sort_severity")
							},
							{
								value: "last_changed",
								label: n("sort_last_changed")
							}
						]
					} }
				}];
				return e !== "manual" && r.push({
					name: "sort_direction",
					selector: { select: {
						mode: "list",
						options: [{
							value: "asc",
							label: n("sort_asc")
						}, {
							value: "desc",
							label: n("sort_desc")
						}]
					} }
				}), [
					{
						name: "title",
						selector: { text: {} }
					},
					{
						name: "appearance",
						type: "expandable",
						flatten: !0,
						title: n("appearance_section"),
						iconPath: an,
						schema: [{
							name: "",
							type: "grid",
							schema: [{
								name: "layout_mode",
								required: !0,
								selector: { select: {
									mode: "dropdown",
									options: [{
										value: "columns",
										label: n("layout_col")
									}, {
										value: "rows",
										label: n("layout_row")
									}]
								} }
							}, {
								name: "layout_count",
								required: !0,
								selector: { number: {
									min: 1,
									max: 12,
									step: 1,
									mode: "box"
								} }
							}]
						}, {
							name: "text_mode",
							selector: { select: {
								mode: "list",
								options: [{
									value: "clip",
									label: n("text_mode_clip")
								}, {
									value: "scroll",
									label: n("text_mode_scroll")
								}]
							} }
						}]
					},
					{
						name: "sorting",
						type: "expandable",
						flatten: !0,
						title: n("sorting_section"),
						iconPath: sn,
						schema: r
					},
					{
						name: "display",
						type: "expandable",
						flatten: !0,
						title: n("display_section"),
						iconPath: en,
						schema: [{
							name: "show_ok_section",
							selector: { select: {
								mode: "list",
								options: [
									{
										value: "inline",
										label: n("show_ok_inline")
									},
									{
										value: "collapsed",
										label: n("show_ok_collapsed")
									},
									{
										value: "hidden",
										label: n("show_ok_hidden")
									}
								]
							} }
						}]
					}
				];
			}), this._cardChanged = (e) => {
				e.stopPropagation();
				let t = e.detail.value || {}, n = this._cardData(), r = {};
				(t.title ?? "") !== n.title && (r.title = t.title || void 0);
				let i = t.layout_mode === "rows" ? "rows" : "columns", a = Math.max(1, Math.min(12, Math.round(Number(t.layout_count)) || 1));
				(i !== n.layout_mode || a !== n.layout_count) && (r.layout = {
					mode: i,
					count: a
				}), t.text_mode && t.text_mode !== n.text_mode && (r.text_mode = t.text_mode), t.sort && t.sort !== n.sort && (r.sort = t.sort), t.sort_direction && t.sort_direction !== n.sort_direction && (r.sort_direction = t.sort_direction), t.show_ok_section && t.show_ok_section !== n.show_ok_section && (r.show_ok_section = t.show_ok_section), Object.keys(r).length && this._updateConfig(r);
			}, this._checkSchema = qt((e, t, n, r) => {
				let i = (e) => U(this.hass, e), a = [{
					name: "entity",
					required: !0,
					selector: { entity: {} }
				}, {
					name: "name",
					selector: { text: {} }
				}];
				e > 1 && (a.push({
					name: "conditions_mode",
					selector: { select: {
						mode: "list",
						options: [{
							value: "any",
							label: i("cond_any")
						}, {
							value: "all",
							label: i("cond_all")
						}]
					} }
				}), t !== "all" && a.push({
					name: "default_condition_index",
					required: !0,
					selector: { select: {
						mode: "dropdown",
						options: Array.from({ length: e }, (e, t) => ({
							value: String(t),
							label: U(this.hass, "condition_n", { n: t + 1 })
						}))
					} }
				}));
				let o = [
					{
						name: "",
						type: "grid",
						schema: [{
							name: "severity",
							required: !0,
							selector: { select: {
								mode: "dropdown",
								options: [
									{
										value: "info",
										label: i("severity_info")
									},
									{
										value: "warning",
										label: i("severity_warning")
									},
									{
										value: "critical",
										label: i("severity_critical")
									}
								]
							} }
						}, {
							name: "icon",
							selector: { icon: {} },
							context: { icon_entity: "entity" }
						}]
					},
					{
						name: "color",
						selector: { text: {} }
					},
					{
						name: "show_last_changed",
						selector: { boolean: {} }
					}
				];
				return n || o.push({
					name: "confirmation",
					selector: { boolean: {} }
				}), a.push({
					name: "advanced",
					type: "expandable",
					flatten: !0,
					title: i("advanced_settings"),
					iconPath: cn,
					schema: o
				}, {
					name: "interactions",
					type: "expandable",
					flatten: !0,
					title: i("interactions_section"),
					iconPath: tn,
					schema: [
						{
							name: "tap_action",
							selector: { ui_action: { default_action: "more-info" } }
						},
						{
							name: "hold_action",
							selector: { ui_action: {} }
						},
						{
							name: "double_tap_action",
							selector: { ui_action: {} }
						}
					]
				}), a;
			}), this._computeLabel = (e) => {
				let t = {
					title: "editor_title",
					layout_mode: "layout_dir",
					layout_count: (this._config?.layout || {
						mode: "columns",
						count: 1
					}).mode === "rows" ? "max_items_row" : "max_items_col",
					text_mode: "text_mode_label",
					sort: "sort_mode",
					sort_direction: "sort_direction",
					show_ok_section: "show_ok_section",
					entity: "select_entity",
					name: "display_name",
					severity: "severity",
					icon: "icon_override",
					color: "color_override",
					show_last_changed: "show_last_changed",
					confirmation: "confirmation",
					conditions_mode: "check_condition",
					default_condition_index: "default_fix",
					tap_action: "tap_action",
					hold_action: "hold_action",
					double_tap_action: "double_tap_action",
					state: "ok_state",
					attribute: "attr_check",
					attribute_value: "attr_val",
					fix_service: "custom_fix",
					prerequisite_entity: "prereq_entity",
					prerequisite_attribute: "attr_check",
					prerequisite_state: "prereq_state",
					prerequisite_attribute_value: "attr_val"
				}[e.name];
				return t ? U(this.hass, t) : e.name;
			}, this._computeHelper = (e) => {
				let t = {
					layout_mode: "layout_dir_helper",
					layout_count: (this._config?.layout || {
						mode: "columns",
						count: 1
					}).mode === "rows" ? "count_helper_row" : "count_helper_col",
					text_mode: "text_mode_helper",
					show_ok_section: "show_ok_helper",
					name: "display_name_helper",
					severity: "severity_helper",
					color: "color_helper",
					default_condition_index: "default_fix_helper",
					hold_action: "hold_action_helper",
					double_tap_action: "double_tap_action_helper",
					state: "ok_state_helper",
					fix_service: "custom_fix_hint",
					prerequisite_state: "prereq_hint",
					prerequisite_attribute_value: "prereq_hint"
				}[e.name];
				return t ? U(this.hass, t) : void 0;
			};
		}
		static {
			this.CLIPBOARD_KEY = "checklistCardCheckClipboard";
		}
		static {
			this.styles = un;
		}
		firstUpdated() {
			this._useHaYamlEditor = !!customElements.get("ha-yaml-editor"), this._hasClipboard = !!this._readClipboard();
		}
		connectedCallback() {
			super.connectedCallback(), window.addEventListener("storage", this._onStorageEvent);
		}
		disconnectedCallback() {
			window.removeEventListener("storage", this._onStorageEvent), this._yamlDebounceTimer !== null && (window.clearTimeout(this._yamlDebounceTimer), this._yamlDebounceTimer = null), super.disconnectedCallback();
		}
		setConfig(e) {
			this._config = {
				...e,
				checks: Array.isArray(e.checks) ? e.checks.map((e, t) => _t(e, t)) : []
			};
			let t = this._config.checks.length;
			t === 0 ? this._selectedCheck = 0 : this._selectedCheck >= t && (this._selectedCheck = t - 1);
		}
		_readClipboard() {
			try {
				let e = sessionStorage.getItem(Z.CLIPBOARD_KEY);
				return e ? JSON.parse(e) : null;
			} catch {
				return null;
			}
		}
		_writeClipboard(e) {
			try {
				e === null ? sessionStorage.removeItem(Z.CLIPBOARD_KEY) : sessionStorage.setItem(Z.CLIPBOARD_KEY, JSON.stringify(e));
			} catch {}
			this._hasClipboard = !!e;
		}
		_updateConfig(e) {
			let t = {
				...this._config,
				...e
			};
			for (let [n, r] of Object.entries(e)) r === void 0 && delete t[n];
			this._config = t, this.dispatchEvent(new CustomEvent("config-changed", {
				detail: { config: this._config },
				bubbles: !0,
				composed: !0
			}));
		}
		_replaceCheck(e, t) {
			let n = this._config.checks.map((n, r) => r === e ? t : n);
			this._updateConfig({ checks: n });
		}
		_addCondition(e) {
			let t = this._config.checks[e];
			if (!t) return;
			let n = {
				...yt(),
				state: t.conditions[0]?.state || "off"
			};
			this._replaceCheck(e, {
				...t,
				conditions: [...t.conditions, n]
			});
		}
		_removeCondition(e, t) {
			let n = this._config.checks[e];
			if (!n) return;
			let r = n.conditions.filter((e, n) => n !== t), i = n.default_condition_index ?? 0;
			i === t ? i = 0 : i > t && --i, this._replaceCheck(e, {
				...n,
				conditions: r,
				default_condition_index: i
			});
		}
		_addCheck() {
			let e = [...this._config.checks || [], {
				id: G(),
				entity: "",
				conditions: [yt()],
				conditions_mode: "any",
				default_condition_index: 0
			}];
			this._updateConfig({ checks: e });
		}
		_applyParsedCheck(e, t) {
			if (!e || typeof e != "object" || Array.isArray(e)) return "Object expected";
			let n = this._config.checks[t];
			if (!n) return "Check no longer exists";
			let r = e;
			return !Array.isArray(r.conditions) || r.conditions.length === 0 ? "`conditions` must be a non-empty array" : (this._replaceCheck(t, _t({
				...r,
				id: r.id || n.id
			})), null);
		}
		_isCheckValid(e) {
			return !e || !e.entity || !e.entity.trim() ? !1 : Array.isArray(e.conditions) && e.conditions.length > 0;
		}
		_cardData() {
			let e = this._config.layout || {
				mode: "columns",
				count: 1
			};
			return {
				title: this._config.title ?? "",
				layout_mode: e.mode === "rows" ? "rows" : "columns",
				layout_count: e.count || 1,
				text_mode: this._config.text_mode || "clip",
				sort: this._config.sort || "manual",
				sort_direction: this._config.sort_direction || "asc",
				show_ok_section: this._config.show_ok_section || "inline"
			};
		}
		_checkData(e) {
			return {
				entity: e.entity || "",
				name: e.name || "",
				severity: e.severity || "info",
				icon: e.icon || "",
				color: e.color || "",
				show_last_changed: !!e.show_last_changed,
				confirmation: !!e.confirmation,
				conditions_mode: e.conditions_mode === "all" ? "all" : "any",
				default_condition_index: String(e.default_condition_index ?? 0),
				tap_action: e.tap_action,
				hold_action: e.hold_action,
				double_tap_action: e.double_tap_action
			};
		}
		_checkChanged(e, t) {
			e.stopPropagation();
			let n = this._config.checks[t];
			if (!n) return;
			let r = e.detail.value || {}, i = { ...n };
			for (let e of pn) e === "severity" && r.severity === "info" ? delete i.severity : e === "show_last_changed" && !r.show_last_changed ? delete i.show_last_changed : hn(r[e]) ? delete i[e] : i[e] = r[e];
			i.entity = r.entity || "", typeof n.confirmation != "object" && (r.confirmation ? i.confirmation = !0 : delete i.confirmation), (r.conditions_mode === "any" || r.conditions_mode === "all") && (i.conditions_mode = r.conditions_mode);
			let a = parseInt(r.default_condition_index, 10);
			if (Number.isFinite(a) && (i.default_condition_index = a), i.entity !== n.entity) {
				let e = this._possibleStates(i.entity)[0] || "";
				i.conditions = (n.conditions || []).map((t) => {
					let n = {
						...t,
						state: e
					};
					return delete n.attribute, delete n.attribute_value, n;
				});
			}
			this._replaceCheck(t, i);
		}
		_conditionSchema(e, t, n, r) {
			let i = this.hass?.language || "en", a = JSON.stringify([
				e,
				t,
				n,
				r,
				i
			]), o = this._schemaCache.get(a);
			if (o) return o;
			let s = e || void 0, c = n || void 0, l = [{
				name: "prerequisite_entity",
				selector: { entity: {} }
			}];
			n && (l.push({
				name: "prerequisite_attribute",
				selector: { attribute: { entity_id: c } }
			}), l.push(r ? {
				name: "prerequisite_attribute_value",
				selector: { state: {
					entity_id: c,
					attribute: r
				} }
			} : {
				name: "prerequisite_state",
				selector: { state: { entity_id: c } }
			}));
			let u = [
				{
					name: "attribute",
					selector: { attribute: { entity_id: s } }
				},
				t ? {
					name: "attribute_value",
					required: !0,
					selector: { state: {
						entity_id: s,
						attribute: t
					} }
				} : {
					name: "state",
					required: !0,
					selector: { state: { entity_id: s } }
				},
				{
					name: "fix_service",
					selector: { text: {} }
				},
				{
					name: "prerequisite",
					type: "expandable",
					flatten: !0,
					title: U(this.hass, "prereq_section"),
					iconPath: nn,
					expanded: !!n,
					schema: l
				}
			];
			return this._schemaCache.size > 200 && this._schemaCache.clear(), this._schemaCache.set(a, u), u;
		}
		_conditionData(e) {
			return {
				state: e.state ?? "",
				attribute: e.attribute || "",
				attribute_value: e.attribute_value || "",
				fix_service: e.fix_service || "",
				prerequisite_entity: e.prerequisite_entity || "",
				prerequisite_attribute: e.prerequisite_attribute || "",
				prerequisite_state: e.prerequisite_state || "",
				prerequisite_attribute_value: e.prerequisite_attribute_value || ""
			};
		}
		_conditionChanged(e, t, n) {
			e.stopPropagation();
			let r = this._config.checks[t], i = r?.conditions[n];
			if (!r || !i) return;
			let a = e.detail.value || {}, o = {
				...i,
				state: a.state ?? ""
			};
			for (let e of mn) hn(a[e]) ? delete o[e] : o[e] = String(a[e]);
			o.attribute || delete o.attribute_value, o.prerequisite_entity ? o.prerequisite_entity !== i.prerequisite_entity && (delete o.prerequisite_attribute, delete o.prerequisite_attribute_value) : (delete o.prerequisite_attribute, delete o.prerequisite_state, delete o.prerequisite_attribute_value), o.prerequisite_attribute || delete o.prerequisite_attribute_value;
			let s = r.conditions.map((e, t) => t === n ? o : e);
			this._replaceCheck(t, {
				...r,
				conditions: s
			});
		}
		_possibleStates(e) {
			let t = e ? this.hass?.states[e] : void 0;
			if (!t) return ["on", "off"];
			let n = t.attributes || {};
			for (let e of [
				"options",
				"hvac_modes",
				"operation_list"
			]) if (Array.isArray(n[e]) && n[e].length) return n[e].map(String);
			return [t.state];
		}
		render() {
			if (!this.hass || !this._config) return j;
			if (!this._pickersReady) if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) this._pickersReady = !0;
			else return this._pickerLoadStarted || (this._pickerLoadStarted = !0, Lt().finally(() => {
				this._pickersReady = !0;
			})), k`<div class="loading">${U(this.hass, "loading")}</div>`;
			let e = this.hass.language || "en", t = this._config.checks || [];
			return k`
      <ha-form
        .hass=${this.hass}
        .data=${this._cardData()}
        .schema=${this._cardSchema(this._config.sort || "manual", e)}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._cardChanged}
      ></ha-form>

      <h3 class="section-title">${U(this.hass, "entities_section")}</h3>
      ${this._renderChecksSection(t)}
    `;
		}
		_renderChecksSection(e) {
			if (e.length === 0) return k`
        <div class="empty-state">
          <p>${U(this.hass, "no_checks_yet")}</p>
          <ha-button appearance="filled" @click=${this._handleAddCheck}>
            <ha-svg-icon slot="start" .path=${on}></ha-svg-icon>
            ${U(this.hass, this._hasClipboard ? "paste_check" : "add_check")}
          </ha-button>
        </div>
      `;
			let t = Math.min(this._selectedCheck, e.length - 1), n = e[t];
			return k`
      <div class="card-config">
        <div class="toolbar">
          <ha-tab-group @wa-tab-show=${this._handleSelectedCheck}>
            ${e.map((e, n) => k`
              <ha-tab-group-tab
                slot="nav"
                .panel=${n}
                .active=${n === t}
                class=${this._isCheckValid(e) ? "" : "invalid"}
              >${n + 1}</ha-tab-group-tab>
            `)}
          </ha-tab-group>
          <ha-icon-button
            .label=${U(this.hass, this._hasClipboard ? "paste_check" : "add_check")}
            .path=${on}
            @click=${this._handleAddCheck}
          ></ha-icon-button>
        </div>

        <div id="editor">
          <div id="card-options">
            <ha-icon-button
              class="gui-mode-button"
              .label=${U(this.hass, this._yamlMode ? "show_visual_editor" : "show_code_editor")}
              .path=${this._yamlMode ? rn : Xt}
              @click=${this._toggleYamlMode}
            ></ha-icon-button>
            <ha-icon-button-arrow-prev
              .disabled=${t === 0}
              .label=${U(this.hass, "move_before")}
              .move=${-1}
              @click=${this._handleMoveCheck}
            ></ha-icon-button-arrow-prev>
            <ha-icon-button-arrow-next
              .disabled=${t === e.length - 1}
              .label=${U(this.hass, "move_after")}
              .move=${1}
              @click=${this._handleMoveCheck}
            ></ha-icon-button-arrow-next>
            <ha-icon-button
              .label=${U(this.hass, "duplicate")}
              .path=${Zt}
              @click=${this._handleDuplicateCheck}
            ></ha-icon-button>
            <ha-icon-button
              .label=${U(this.hass, "cut_check")}
              .path=${Qt}
              @click=${this._handleCutCheck}
            ></ha-icon-button>
            <ha-icon-button
              class="delete-btn"
              .label=${U(this.hass, "remove")}
              .path=${$t}
              @click=${this._handleDeleteSelectedCheck}
            ></ha-icon-button>
          </div>
          ${this._yamlMode ? this._renderYamlEditor(n, t) : this._renderCheckEditor(n, t)}
        </div>
      </div>
    `;
		}
		_renderYamlEditor(e, t) {
			return k`
      <div class="yaml-editor">
        ${this._useHaYamlEditor ? k`
              <ha-yaml-editor
                .hass=${this.hass}
                .defaultValue=${e}
                @value-changed=${this._handleHaYamlChange}
              ></ha-yaml-editor>
            ` : k`
              <textarea
                spellcheck="false"
                .value=${JSON.stringify(e, null, 2)}
                @input=${(e) => this._handleYamlInput(e, t)}
              ></textarea>
              <div class="hint">${U(this.hass, "yaml_hint_json")}</div>
            `}
        ${this._yamlError ? k`<div class="yaml-error">${this._yamlError}</div>` : j}
      </div>
    `;
		}
		_renderCheckEditor(e, t) {
			let n = e.conditions || [], r = n.length > 1, i = this.hass.language || "en";
			return k`
      <div class="check-editor-content">
        <ha-form
          .hass=${this.hass}
          .data=${this._checkData(e)}
          .schema=${this._checkSchema(n.length, e.conditions_mode === "all" ? "all" : "any", typeof e.confirmation == "object", i)}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${(e) => this._checkChanged(e, t)}
        ></ha-form>

        <div class="conditions">
          ${n.map((n, i) => k`
            <div class="condition-item">
              <div class="condition-header">
                <span class="condition-title">
                  ${r ? U(this.hass, "condition_n", { n: i + 1 }) : U(this.hass, "condition_single")}
                </span>
                ${r ? k`
                  <ha-icon-button
                    class="delete-btn"
                    .label=${U(this.hass, "remove_state")}
                    .path=${$t}
                    @click=${() => this._removeCondition(t, i)}
                  ></ha-icon-button>
                ` : j}
              </div>
              <ha-form
                .hass=${this.hass}
                .data=${this._conditionData(n)}
                .schema=${this._conditionSchema(e.entity, n.attribute || "", n.prerequisite_entity || "", n.prerequisite_attribute || "")}
                .computeLabel=${this._computeLabel}
                .computeHelper=${this._computeHelper}
                @value-changed=${(e) => this._conditionChanged(e, t, i)}
              ></ha-form>
            </div>
          `)}

          <ha-button appearance="plain" @click=${() => this._addCondition(t)}>
            <ha-svg-icon slot="start" .path=${on}></ha-svg-icon>
            ${U(this.hass, "add_state")}
          </ha-button>
        </div>
      </div>
    `;
		}
	}, Y([z({ attribute: !1 })], Q.prototype, "hass", void 0), Y([B()], Q.prototype, "_config", void 0), Y([B()], Q.prototype, "_selectedCheck", void 0), Y([B()], Q.prototype, "_useHaYamlEditor", void 0), Y([B()], Q.prototype, "_pickersReady", void 0), Y([B()], Q.prototype, "_yamlMode", void 0), Y([B()], Q.prototype, "_hasClipboard", void 0), Y([B()], Q.prototype, "_yamlError", void 0), Q = Z = Y([Re("checklist-card-editor")], Q);
}));
R(), $e(), ht(), Ct(), Rt(), Wt();
var $ = class extends L {
	constructor(...e) {
		super(...e), this.preview = !1, this._isFixingAll = !1, this._fixingItems = /* @__PURE__ */ new Set(), this._errorBanner = null, this._showOkExpanded = !1, this._showSnoozedExpanded = !1, this._snoozeData = {}, this._snoozeDialogRule = null, this._customSnoozeHours = "", this._confirmRules = null, this._isTitleOverflowing = !1, this._isSubtitleOverflowing = !1, this._problemIds = /* @__PURE__ */ new Set(), this._snoozedIds = /* @__PURE__ */ new Set(), this._checksToDisplay = [], this._listStyle = "display: flex; flex-direction: column; gap: 12px;", this._watchedEntityIds = [], this._snoozeTimer = null, this._snoozeDataLoaded = !1, this._isHidden = !1, this._marquee = new Mt(this, [{
			parent: ".title",
			setOverflow: (e) => {
				this._isTitleOverflowing = e;
			}
		}, {
			parent: ".subtitle",
			setOverflow: (e) => {
				this._isSubtitleOverflowing = e;
			}
		}]);
	}
	static {
		this.styles = ft;
	}
	static async getConfigElement() {
		return await Promise.all([Promise.resolve().then(() => (gn(), fn)), Lt()]), document.createElement("checklist-card-editor");
	}
	getCardSize() {
		let e = this._config?.checks?.length ?? 1, t = this._layoutCols(), n = Math.ceil(e / t);
		return Math.max(2, Math.ceil(n * 1.2) + 2);
	}
	getGridOptions() {
		return {
			columns: 12,
			rows: "auto",
			min_columns: this._config?.layout?.mode === "columns" && this._layoutCols() > 1 ? 12 : 6,
			min_rows: 2
		};
	}
	_layoutCols() {
		let e = this._config?.layout;
		return e?.mode === "columns" ? Math.max(1, e.count || 1) : 1;
	}
	static getStubConfig(e, t = [], n = []) {
		let r = [...t, ...n].find((e) => /^(light|switch|input_boolean|fan|lock)\./.test(e)) ?? "", i = r.startsWith("lock.") ? "locked" : "off";
		return {
			type: "custom:checklist-card",
			title: pt("title"),
			checks: [{
				id: G(),
				entity: r,
				conditions: [{ state: i }],
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
		if (!e || !Array.isArray(e.checks) || e.checks.some((e) => !e || typeof e != "object")) throw Error(U(this.hass, "config_error"));
		let t = bt(e);
		this._config = {
			...t,
			checks: t.checks.map((e, t) => _t(e, t))
		};
	}
	connectedCallback() {
		super.connectedCallback(), this._scheduleNextSnoozeExpiry(), It();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._clearSnoozeTimer();
	}
	_clearSnoozeTimer() {
		this._snoozeTimer !== null && (clearTimeout(this._snoozeTimer), this._snoozeTimer = null);
	}
	_scheduleNextSnoozeExpiry() {
		this._clearSnoozeTimer();
		let e = Date.now(), t = Infinity;
		for (let n of Object.values(this._snoozeData)) n > e && n < t && (t = n);
		if (!isFinite(t)) return;
		let n = Math.min(t - e + 50, 2147483e3);
		this._snoozeTimer = window.setTimeout(() => {
			this._snoozeTimer = null, this._snoozedIds = this._calculateSnoozedIds(), this._problemIds = this._calculateProblemIds(), this.requestUpdate(), this._scheduleNextSnoozeExpiry();
		}, Math.max(0, n));
	}
	updated(e) {
		super.updated(e), e.has("hass") && this.hass && !this._snoozeDataLoaded && (this._snoozeDataLoaded = !0, this._loadSnoozeData());
		let t = this.hass?.translationMetadata?.dir ?? (this.hass?.language === "he" ? "rtl" : "ltr");
		this.setAttribute("dir", t);
		let n = this._config?.text_mode === "scroll";
		this.classList.toggle("marquee-enabled", n);
		let r = !this.preview && this._shouldHideCard();
		r !== this._isHidden && (this._isHidden = r, this.hidden = r, this.dispatchEvent(new CustomEvent("card-visibility-changed", {
			detail: { value: !r },
			bubbles: !0,
			composed: !0
		})));
		let i = this._dialogEl;
		i && !i.open && i.showModal();
	}
	_shouldHideCard() {
		return !!this._config && this._config.show_ok_section === "hidden" && this._problemIds.size === 0 && this._snoozedIds.size === 0;
	}
	shouldUpdate(e) {
		if (e.size > 1 || !e.has("hass")) return !0;
		let t = e.get("hass");
		return !t || this._watchedEntityIds.length === 0 || t.language !== this.hass.language ? !0 : this._watchedEntityIds.some((e) => t.states?.[e] !== this.hass.states?.[e]);
	}
	willUpdate(e) {
		super.willUpdate(e), e.has("_config") && (this._watchedEntityIds = this._collectWatchedEntityIds(), this._listStyle = this._computeListStyle()), (e.has("_config") || e.has("hass") || e.has("_snoozeData")) && (this._snoozedIds = this._calculateSnoozedIds(), this._problemIds = this._calculateProblemIds(), this._checksToDisplay = this._computeChecksToDisplay()), e.has("_snoozeData") && this._scheduleNextSnoozeExpiry();
	}
	_collectWatchedEntityIds() {
		let e = /* @__PURE__ */ new Set(), t = (t) => {
			if (!t || !t.includes("states(")) return;
			let n;
			for (Tt.lastIndex = 0; (n = Tt.exec(t)) !== null;) n[1] && e.add(n[1]);
		};
		for (let n of this._config.checks) {
			n.entity && e.add(n.entity);
			for (let r of n.conditions ?? []) r.prerequisite_entity && e.add(r.prerequisite_entity), t(r.state), t(r.attribute_value), t(r.prerequisite_state), t(r.prerequisite_attribute_value);
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
				case "severity": {
					let i = {
						critical: 0,
						warning: 1,
						info: 2
					};
					n = i[e.severity || "info"], r = i[t.severity || "info"];
					break;
				}
				case "last_changed":
					n = new Date(this.hass?.states[e.entity]?.last_changed || 0).getTime(), r = new Date(this.hass?.states[t.entity]?.last_changed || 0).getTime();
					break;
			}
			return n < r ? this._config.sort_direction === "desc" ? 1 : -1 : n > r ? this._config.sort_direction === "desc" ? -1 : 1 : 0;
		}), e;
	}
	_calculateSnoozedIds() {
		if (!this._config?.checks) return /* @__PURE__ */ new Set();
		let e = Date.now();
		return new Set(this._config.checks.filter((t) => t.entity && this._snoozeData[t.id] && this._snoozeData[t.id] > e).map((e) => e.id));
	}
	_calculateProblemIds() {
		return !this.hass || !this._config?.checks ? /* @__PURE__ */ new Set() : new Set(this._config.checks.filter((e) => Dt(this.hass, e) && !this._snoozedIds.has(e.id)).map((e) => e.id));
	}
	async _loadSnoozeData() {
		if (this.hass?.callWS) try {
			let e = await this.hass.callWS({
				type: "frontend/get_user_data",
				key: "checklist_card_snooze_v1"
			});
			if (e?.value && typeof e.value == "object") {
				let t = Date.now(), n = {};
				for (let [r, i] of Object.entries(e.value)) i > t && (n[r] = i);
				this._snoozeData = n;
			}
		} catch (e) {
			console.warn("[checklist-card] Could not load snooze data:", e);
		}
	}
	async _saveSnoozeData() {
		if (this.hass?.callWS) try {
			await this.hass.callWS({
				type: "frontend/set_user_data",
				key: "checklist_card_snooze_v1",
				value: this._snoozeData
			});
		} catch (e) {
			console.warn("[checklist-card] Could not save snooze data:", e);
		}
	}
	async _snoozeItem(e, t) {
		let n = Date.now() + t * 36e5;
		this._snoozeData = {
			...this._snoozeData,
			[e.id]: n
		}, this._closeDialog(), await this._saveSnoozeData();
	}
	async _unsnoozeItem(e) {
		let t = { ...this._snoozeData };
		delete t[e], this._snoozeData = t, await this._saveSnoozeData();
	}
	_formatSnoozeExpiry(e) {
		let t = new Date(e), n = /* @__PURE__ */ new Date(), r = this.hass?.language ?? "en", i = t.toDateString() === n.toDateString() ? {
			hour: "2-digit",
			minute: "2-digit"
		} : {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		};
		return t.toLocaleString(r, i);
	}
	async _fixCondition(e, t) {
		let n = e.split(".")[0], r = { entity_id: e };
		if (t.fix_service?.trim()) {
			let e = t.fix_service.trim();
			try {
				if (e.startsWith("{")) {
					let t = JSON.parse(e), n = t.perform_action || t.action || t.service;
					if (typeof n != "string" || !n.includes(".")) throw Error("custom fix_service is missing a valid \"service\" / \"perform_action\" field");
					let [i, a] = n.split(".");
					if (!i || !a) throw Error(`invalid service identifier: ${n}`);
					let o = {
						...t.service_data || {},
						...t.data || {}
					}, s = t.target && Object.keys(t.target).length > 0 ? o : {
						...r,
						...o
					};
					await this.hass.callService(i, a, s, t.target);
				} else if (e.includes(".")) {
					let [t, n] = e.split(".");
					if (!t || !n) throw Error(`invalid service identifier: ${e}`);
					await this.hass.callService(t, n, r);
				} else throw Error(`fix_service must be "domain.service" or a JSON object, got: ${e}`);
			} catch (e) {
				console.error(U(this.hass, "fix_process_error") + " (Parse/Execute):", e), this._errorBanner = U(this.hass, "fix_process_error") + " - " + String(e);
			}
			return;
		}
		let i = xt(n, K(this.hass, t.state), t);
		try {
			await this.hass.callService(i.domain || n, i.service, {
				...r,
				...i.serviceData
			});
		} catch (e) {
			console.error("Service call failed", e), this._errorBanner = U(this.hass, "fix_process_error") + " - " + String(e);
		}
	}
	async _fixIssue(e) {
		this._fixingItems = /* @__PURE__ */ new Set([...this._fixingItems, e.id]), this._errorBanner = null;
		try {
			if (e.conditions_mode === "any") {
				let t = e.default_condition_index ?? 0, n = e.conditions[t] ?? e.conditions[0];
				n && await this._fixCondition(e.entity, n);
			} else for (let t = 0; t < e.conditions.length; t++) {
				let n = e.conditions[t], r = this.hass.states[e.entity];
				(!r || !Et(this.hass, r, n)) && (await this._fixCondition(e.entity, n), t < e.conditions.length - 1 && await new Promise((e) => setTimeout(e, 300)));
			}
		} catch (e) {
			console.error(U(this.hass, "fix_process_error"), e), this._errorBanner = U(this.hass, "fix_process_error");
		} finally {
			let t = new Set(this._fixingItems);
			t.delete(e.id), this._fixingItems = t;
		}
	}
	_needsConfirmation(e) {
		let t = e.confirmation;
		return !(!t || typeof t == "object" && t.exemptions?.some((e) => e.user === this.hass?.user?.id));
	}
	_problemRulesBySeverity() {
		let e = {
			critical: 0,
			warning: 1,
			info: 2
		};
		return this._config.checks.filter((e) => e.entity && this._problemIds.has(e.id) && vt(e)).sort((t, n) => e[t.severity || "info"] - e[n.severity || "info"]);
	}
	_handleFixAllClick() {
		let e = this._problemRulesBySeverity();
		if (e.length !== 0) {
			if (e.some((e) => this._needsConfirmation(e))) {
				this._confirmRules = e;
				return;
			}
			this._fixAll(e);
		}
	}
	async _fixAll(e) {
		this._isFixingAll = !0, this._errorBanner = null;
		try {
			for (let t of e) await this._fixIssue(t), await new Promise((e) => setTimeout(e, 300));
		} finally {
			this._isFixingAll = !1;
		}
	}
	_handleFixRequested(e) {
		let t = this._config.checks.find((t) => t.id === e.detail.ruleId);
		if (t) {
			if (this._needsConfirmation(t)) {
				this._confirmRules = [t];
				return;
			}
			this._fixIssue(t);
		}
	}
	_handleConfirm() {
		let e = this._confirmRules;
		this._closeDialog(), e && (e.length === 1 ? this._fixIssue(e[0]) : this._fixAll(e));
	}
	_closeDialog() {
		this._snoozeDialogRule = null, this._confirmRules = null, this._customSnoozeHours = "";
	}
	_handleDialogClick(e) {
		e.target === e.currentTarget && this._closeDialog();
	}
	_handleDialogCancel(e) {
		e.preventDefault(), this._closeDialog();
	}
	_handleSnoozeRequested(e) {
		let t = this._config.checks.find((t) => t.id === e.detail.ruleId);
		t && (this._snoozeDialogRule = t);
	}
	_handleUnsnoozeRequested(e) {
		this._unsnoozeItem(e.detail.ruleId);
	}
	_handleCustomSnooze() {
		let e = parseFloat(this._customSnoozeHours);
		this._snoozeDialogRule && e > 0 && e <= 8760 && this._snoozeItem(this._snoozeDialogRule, e);
	}
	render() {
		if (!this._config || !this.hass) return j;
		let e = this._problemIds.size, t = e > 0, n = this.hass.translationMetadata?.dir ?? (this.hass.language === "he" ? "rtl" : "ltr"), r = this._snoozedIds.size, i = this._checksToDisplay.filter((e) => this._problemIds.has(e.id)), a = this._checksToDisplay.filter((e) => !this._problemIds.has(e.id) && !this._snoozedIds.has(e.id)), o = this._config.checks.filter((e) => e.entity && this._snoozedIds.has(e.id)), s = this._config.show_ok_section || "inline", c = (this._config.sort || "manual") === "manual" && s === "inline", l = s === "inline" ? c ? this._checksToDisplay.filter((e) => !this._snoozedIds.has(e.id)) : [...i, ...a] : i;
		return !this.preview && this._shouldHideCard() ? j : k`
      <ha-card dir=${n} role="region" aria-label=${this._config.title || U(this.hass, "title")}>
        ${this._errorBanner ? k`
          <div class="error-banner" role="alert">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            <span class="error-text">${this._errorBanner}</span>
            <button class="icon-btn" aria-label=${U(this.hass, "dismiss")} @click=${() => {
			this._errorBanner = null;
		}}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
        ` : ""}

        <div class="header">
          <div class="header-content">
            <span class="status-icon ${t ? "error" : "success"}">
              <ha-icon icon="${t ? "mdi:alert" : "mdi:check-circle"}"></ha-icon>
            </span>
            <div class="header-text">
              ${this._renderHeaderTitle()}
              ${this._renderHeaderSubtitle(t, e, r)}
            </div>
          </div>

          <div class="header-actions">
            ${s === "collapsed" && a.length > 0 ? k`
              <button class="ok-toggle-btn" @click=${() => this._showOkExpanded = !this._showOkExpanded}>
                <ha-icon icon="mdi:check-circle"></ha-icon>
                ${this._showOkExpanded ? U(this.hass, "hide_ok_items_btn", { count: a.length }) : U(this.hass, "show_ok_items_btn", { count: a.length })}
              </button>
            ` : ""}

            ${o.length > 0 ? k`
              <button class="ok-toggle-btn" @click=${() => this._showSnoozedExpanded = !this._showSnoozedExpanded}>
                <ha-icon icon="mdi:alarm-snooze" style="color: var(--warning-color, #e59b2d);"></ha-icon>
                ${this._showSnoozedExpanded ? U(this.hass, "snoozed_section_hide", { count: o.length }) : U(this.hass, "snoozed_section_show", { count: o.length })}
              </button>
            ` : ""}

            ${i.some(vt) ? k`
              <button class="fix-all-btn" @click=${this._handleFixAllClick} ?disabled=${this._isFixingAll} aria-label=${U(this.hass, "fix_all")}>
                ${this._isFixingAll ? k`<div class="spinner"></div>` : U(this.hass, "fix_all")}
              </button>
            ` : ""}
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
          ${this._renderItems(l)}
          ${s === "collapsed" && this._showOkExpanded ? this._renderItems(a) : ""}
          ${this._showSnoozedExpanded ? this._renderSnoozedItems(o) : ""}
        </div>
      </ha-card>

      ${this._renderDialog()}
    `;
	}
	_renderDialog() {
		let e = this._snoozeDialogRule, t = this._confirmRules;
		if (!e && !t) return j;
		let n = e ? U(this.hass, "snooze_dialog_title") : U(this.hass, "confirm_title");
		return k`
      <dialog
        aria-labelledby="dialog-heading"
        @click=${this._handleDialogClick}
        @cancel=${this._handleDialogCancel}
      >
        <div class="dialog-surface">
          <h2 class="dialog-heading" id="dialog-heading">${n}</h2>
          ${e ? this._renderSnoozeBody(e) : this._renderConfirmBody(t)}
        </div>
      </dialog>
    `;
	}
	_renderSnoozeBody(e) {
		let t = parseFloat(this._customSnoozeHours), n = t > 0 && t <= 8760;
		return k`
      <div class="dialog-body">
        <div class="snooze-dialog-entity">${gt(this.hass, e)}</div>
        <p class="snooze-dialog-desc">${U(this.hass, "snooze_dialog_desc")}</p>
        <div class="snooze-presets">
          ${[
			1,
			2,
			4,
			8,
			24,
			72
		].map((t, n) => k`
            <button class="chip-btn" @click=${() => this._snoozeItem(e, t)}>
              ${U(this.hass, [
			"snooze_1h",
			"snooze_2h",
			"snooze_4h",
			"snooze_8h",
			"snooze_24h",
			"snooze_3d"
		][n])}
            </button>
          `)}
        </div>
        <label class="snooze-custom-label" for="snooze-hours">${U(this.hass, "snooze_custom_label")}</label>
        <input
          id="snooze-hours"
          type="number"
          inputmode="decimal"
          class="snooze-custom-input"
          min="0.5"
          max="8760"
          step="0.5"
          .value=${this._customSnoozeHours}
          @input=${(e) => {
			this._customSnoozeHours = e.target.value;
		}}
          @keydown=${(e) => {
			e.key === "Enter" && n && this._handleCustomSnooze();
		}}
          placeholder=${U(this.hass, "snooze_custom_placeholder")}
        />
      </div>
      <div class="dialog-footer">
        <button class="dialog-btn" @click=${this._closeDialog}>${U(this.hass, "cancel")}</button>
        <button class="dialog-btn primary" ?disabled=${!n} @click=${this._handleCustomSnooze}>
          ${U(this.hass, "snooze_confirm_btn")}
        </button>
      </div>
    `;
	}
	_renderConfirmBody(e) {
		let t;
		if (e.length === 1) {
			let n = e[0];
			t = (typeof n.confirmation == "object" ? n.confirmation.text : void 0) || U(this.hass, "confirm_fix", { name: gt(this.hass, n) });
		} else t = U(this.hass, "confirm_fix_all", { count: e.length });
		return k`
      <div class="dialog-body">
        <p class="confirm-text">${t}</p>
        ${e.length > 1 ? k`
          <ul class="confirm-list">
            ${e.map((e) => k`<li>${gt(this.hass, e)}</li>`)}
          </ul>
        ` : j}
      </div>
      <div class="dialog-footer">
        <button class="dialog-btn" @click=${this._closeDialog}>${U(this.hass, "cancel")}</button>
        <button class="dialog-btn primary" autofocus @click=${this._handleConfirm}>
          ${U(this.hass, e.length > 1 ? "fix_all" : "fix")}
        </button>
      </div>
    `;
	}
	_renderHeaderTitle() {
		let e = this._config?.text_mode === "scroll", t = this._isTitleOverflowing && e, n = this._config.title || U(this.hass, "title");
		return k`
      <div class="title ${t ? "overflowing" : ""}">
        ${Ft(n, t)}
      </div>
    `;
	}
	_renderHeaderSubtitle(e, t, n) {
		let r = this._config?.text_mode === "scroll", i = this._isSubtitleOverflowing && r, a = k`${e ? U(this.hass, "problems_found", { count: t }) : U(this.hass, "all_good")}${n > 0 ? k`
        <span class="snooze-count-badge">
          <ha-icon icon="mdi:alarm-snooze" style="--mdc-icon-size: 13px; vertical-align: middle;"></ha-icon>
          ${n}
        </span>
      ` : ""}`;
		return k`
      <div class="subtitle ${i ? "overflowing" : ""}" aria-live="polite">
        ${Ft(a, i)}
      </div>
    `;
	}
	_renderItems(e) {
		let t = this._config?.text_mode === "scroll";
		return dt(e, (e) => e.id, (e) => k`
        <checklist-card-item
          .rule=${e}
          .hass=${this.hass}
          .stateObj=${this.hass.states[e.entity]}
          .isProblem=${this._problemIds.has(e.id)}
          .isFixing=${this._fixingItems.has(e.id)}
          .severity=${e.severity || "info"}
          .marqueeEnabled=${t}
        ></checklist-card-item>
      `);
	}
	_renderSnoozedItems(e) {
		let t = this._config?.text_mode === "scroll";
		return dt(e, (e) => e.id, (e) => k`
        <checklist-card-item
          .rule=${e}
          .hass=${this.hass}
          .stateObj=${this.hass.states[e.entity]}
          .isProblem=${!1}
          .isFixing=${!1}
          .isSnoozed=${!0}
          .snoozeUntil=${this._snoozeData[e.id] ?? null}
          .severity=${e.severity || "info"}
          .marqueeEnabled=${t}
        ></checklist-card-item>
      `);
	}
};
Y([z({ attribute: !1 })], $.prototype, "hass", void 0), Y([z({ type: Boolean })], $.prototype, "preview", void 0), Y([B()], $.prototype, "_config", void 0), Y([B()], $.prototype, "_isFixingAll", void 0), Y([B()], $.prototype, "_fixingItems", void 0), Y([B()], $.prototype, "_errorBanner", void 0), Y([B()], $.prototype, "_showOkExpanded", void 0), Y([B()], $.prototype, "_showSnoozedExpanded", void 0), Y([B()], $.prototype, "_snoozeData", void 0), Y([B()], $.prototype, "_snoozeDialogRule", void 0), Y([B()], $.prototype, "_customSnoozeHours", void 0), Y([B()], $.prototype, "_confirmRules", void 0), Y([qe("dialog")], $.prototype, "_dialogEl", void 0), Y([B()], $.prototype, "_isTitleOverflowing", void 0), Y([B()], $.prototype, "_isSubtitleOverflowing", void 0), $ = Y([Re("checklist-card")], $), gn(), ht();
var _n = [
	"door",
	"garage",
	"gate",
	"window"
];
function vn(e, t) {
	let n = t.split(".")[0], r = e.states[t]?.attributes?.device_class, i;
	return n === "lock" ? i = "locked" : (n === "cover" && _n.includes(r ?? "") || n === "valve") && (i = "closed"), i ? { config: {
		type: "custom:checklist-card",
		checks: [{
			entity: t,
			conditions: [{ state: i }]
		}]
	} } : null;
}
window.customCards = window.customCards || [], window.customCards.push({
	type: "checklist-card",
	name: pt("card_name"),
	description: pt("card_description"),
	preview: !0,
	documentationURL: "https://github.com/yosef-chai/ha-checklist-card",
	getEntitySuggestion: vn
}), console.info("%c CHECKLIST-CARD %c v2.3.0 ", "color: #fff; background: #2980b9; font-weight: 700; border-radius: 3px 0 0 3px;", "color: #2980b9; background: #fff; font-weight: 700; border-radius: 0 3px 3px 0;");
//#endregion
