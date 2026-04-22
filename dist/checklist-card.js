//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (e, t) => () => (e && (t = e(e = 0)), t), n = (t, n) => {
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
	}, c = (e) => new s(typeof e == "string" ? e : e + "", void 0, a), l = (e, ...t) => new s(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
		if (!0 === e._$cssResult$) return e.cssText;
		if (typeof e == "number") return e;
		throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
	})(n) + e[r + 1], e[0]), e, a), u = (e, t) => {
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
})), p, m, ee, te, ne, re, h, ie, ae, oe, g, _, v, se, y, ce = t((() => {
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
	}, v = (e, t) => !p(e, t), se = {
		attribute: !0,
		type: String,
		converter: _,
		reflect: !1,
		useDefault: !1,
		hasChanged: v
	}, Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap(), y = class extends HTMLElement {
		static addInitializer(e) {
			this._$Ei(), (this.l ??= []).push(e);
		}
		static get observedAttributes() {
			return this.finalize(), this._$Eh && [...this._$Eh.keys()];
		}
		static createProperty(e, t = se) {
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
			return this.elementProperties.get(e) ?? se;
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
				if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? v)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
	}, y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[g("elementProperties")] = /* @__PURE__ */ new Map(), y[g("finalized")] = /* @__PURE__ */ new Map(), oe?.({ ReactiveElement: y }), (h.reactiveElementVersions ??= []).push("2.1.2");
}));
//#endregion
//#region node_modules/lit-html/lit-html.js
function le(e, t) {
	if (!me(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return de === void 0 ? t : de.createHTML(t);
}
function b(e, t, n = e, r) {
	if (t === N) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = D(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = b(e, i._$AS(e, t.values), i, r)), t;
}
var x, ue, S, de, C, w, fe, pe, T, E, D, me, he, O, k, ge, _e, A, ve, ye, be, j, M, N, P, xe, F, Se, I, Ce, L, R, we, Te, Ee, De, Oe, ke, Ae, z = t((() => {
	x = globalThis, ue = (e) => e, S = x.trustedTypes, de = S ? S.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, C = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, fe = "?" + w, pe = `<${fe}>`, T = document, E = () => T.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", me = Array.isArray, he = (e) => me(e) || typeof e?.[Symbol.iterator] == "function", O = "[ 	\n\f\r]", k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ge = /-->/g, _e = />/g, A = RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ve = /'/g, ye = /"/g, be = /^(?:script|style|textarea|title)$/i, j = (e) => (t, ...n) => ({
		_$litType$: e,
		strings: t,
		values: n
	}), M = j(1), j(2), j(3), N = Symbol.for("lit-noChange"), P = Symbol.for("lit-nothing"), xe = /* @__PURE__ */ new WeakMap(), F = T.createTreeWalker(T, 129), Se = (e, t) => {
		let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = k;
		for (let t = 0; t < n; t++) {
			let n = e[t], s, c, l = -1, u = 0;
			for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === k ? c[1] === "!--" ? o = ge : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = A) : (be.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = A) : o = _e : o === A ? c[0] === ">" ? (o = i ?? k, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? A : c[3] === "\"" ? ye : ve) : o === ye || o === ve ? o = A : o === ge || o === _e ? o = k : (o = A, i = void 0);
			let d = o === A && e[t + 1].startsWith("/>") ? " " : "";
			a += o === k ? n + pe : l >= 0 ? (r.push(s), n.slice(0, l) + C + n.slice(l) + w + d) : n + w + (l === -2 ? t : d);
		}
		return [le(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
	}, I = class e {
		constructor({ strings: t, _$litType$: n }, r) {
			let i;
			this.parts = [];
			let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Se(t, n);
			if (this.el = e.createElement(l, r), F.currentNode = this.el.content, n === 2 || n === 3) {
				let e = this.el.content.firstChild;
				e.replaceWith(...e.childNodes);
			}
			for (; (i = F.nextNode()) !== null && c.length < s;) {
				if (i.nodeType === 1) {
					if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(C)) {
						let t = u[o++], n = i.getAttribute(e).split(w), r = /([.?@])?(.*)/.exec(t);
						c.push({
							type: 1,
							index: a,
							name: r[2],
							strings: n,
							ctor: r[1] === "." ? we : r[1] === "?" ? Te : r[1] === "@" ? Ee : R
						}), i.removeAttribute(e);
					} else e.startsWith(w) && (c.push({
						type: 6,
						index: a
					}), i.removeAttribute(e));
					if (be.test(i.tagName)) {
						let e = i.textContent.split(w), t = e.length - 1;
						if (t > 0) {
							i.textContent = S ? S.emptyScript : "";
							for (let n = 0; n < t; n++) i.append(e[n], E()), F.nextNode(), c.push({
								type: 2,
								index: ++a
							});
							i.append(e[t], E());
						}
					}
				} else if (i.nodeType === 8) if (i.data === fe) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(w, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += w.length - 1;
				}
				a++;
			}
		}
		static createElement(e, t) {
			let n = T.createElement("template");
			return n.innerHTML = e, n;
		}
	}, Ce = class {
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
			let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? T).importNode(t, !0);
			F.currentNode = r;
			let i = F.nextNode(), a = 0, o = 0, s = n[0];
			for (; s !== void 0;) {
				if (a === s.index) {
					let t;
					s.type === 2 ? t = new L(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new De(i, this, e)), this._$AV.push(t), s = n[++o];
				}
				a !== s?.index && (i = F.nextNode(), a++);
			}
			return F.currentNode = T, r;
		}
		p(e) {
			let t = 0;
			for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
		}
	}, L = class e {
		get _$AU() {
			return this._$AM?._$AU ?? this._$Cv;
		}
		constructor(e, t, n, r) {
			this.type = 2, this._$AH = P, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
			e = b(this, e, t), D(e) ? e === P || e == null || e === "" ? (this._$AH !== P && this._$AR(), this._$AH = P) : e !== this._$AH && e !== N && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? he(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
		}
		O(e) {
			return this._$AA.parentNode.insertBefore(e, this._$AB);
		}
		T(e) {
			this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
		}
		_(e) {
			this._$AH !== P && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
		}
		$(e) {
			let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = I.createElement(le(n.h, n.h[0]), this.options)), n);
			if (this._$AH?._$AD === r) this._$AH.p(t);
			else {
				let e = new Ce(r, this), n = e.u(this.options);
				e.p(t), this.T(n), this._$AH = e;
			}
		}
		_$AC(e) {
			let t = xe.get(e.strings);
			return t === void 0 && xe.set(e.strings, t = new I(e)), t;
		}
		k(t) {
			me(this._$AH) || (this._$AH = [], this._$AR());
			let n = this._$AH, r, i = 0;
			for (let a of t) i === n.length ? n.push(r = new e(this.O(E()), this.O(E()), this, this.options)) : r = n[i], r._$AI(a), i++;
			i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
		}
		_$AR(e = this._$AA.nextSibling, t) {
			for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
				let t = ue(e).nextSibling;
				ue(e).remove(), e = t;
			}
		}
		setConnected(e) {
			this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
		}
	}, R = class {
		get tagName() {
			return this.element.tagName;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		constructor(e, t, n, r, i) {
			this.type = 1, this._$AH = P, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = P;
		}
		_$AI(e, t = this, n, r) {
			let i = this.strings, a = !1;
			if (i === void 0) e = b(this, e, t, 0), a = !D(e) || e !== this._$AH && e !== N, a && (this._$AH = e);
			else {
				let r = e, o, s;
				for (e = i[0], o = 0; o < i.length - 1; o++) s = b(this, r[n + o], t, o), s === N && (s = this._$AH[o]), a ||= !D(s) || s !== this._$AH[o], s === P ? e = P : e !== P && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
			}
			a && !r && this.j(e);
		}
		j(e) {
			e === P ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
		}
	}, we = class extends R {
		constructor() {
			super(...arguments), this.type = 3;
		}
		j(e) {
			this.element[this.name] = e === P ? void 0 : e;
		}
	}, Te = class extends R {
		constructor() {
			super(...arguments), this.type = 4;
		}
		j(e) {
			this.element.toggleAttribute(this.name, !!e && e !== P);
		}
	}, Ee = class extends R {
		constructor(e, t, n, r, i) {
			super(e, t, n, r, i), this.type = 5;
		}
		_$AI(e, t = this) {
			if ((e = b(this, e, t, 0) ?? P) === N) return;
			let n = this._$AH, r = e === P && n !== P || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== P && (n === P || r);
			r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
		}
		handleEvent(e) {
			typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
		}
	}, De = class {
		constructor(e, t, n) {
			this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		_$AI(e) {
			b(this, e);
		}
	}, Oe = {
		M: C,
		P: w,
		A: fe,
		C: 1,
		L: Se,
		R: Ce,
		D: he,
		V: b,
		I: L,
		H: R,
		N: Te,
		U: Ee,
		B: we,
		F: De
	}, ke = x.litHtmlPolyfillSupport, ke?.(I, L), (x.litHtmlVersions ??= []).push("3.3.2"), Ae = (e, t, n) => {
		let r = n?.renderBefore ?? t, i = r._$litPart$;
		if (i === void 0) {
			let e = n?.renderBefore ?? null;
			r._$litPart$ = i = new L(t.insertBefore(E(), e), e, void 0, n ?? {});
		}
		return i._$AI(e), i;
	};
})), B, V, je, Me = t((() => {
	ce(), ce(), z(), z(), B = globalThis, V = class extends y {
		constructor() {
			super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
		}
		createRenderRoot() {
			let e = super.createRenderRoot();
			return this.renderOptions.renderBefore ??= e.firstChild, e;
		}
		update(e) {
			let t = this.render();
			this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ae(t, this.renderRoot, this.renderOptions);
		}
		connectedCallback() {
			super.connectedCallback(), this._$Do?.setConnected(!0);
		}
		disconnectedCallback() {
			super.disconnectedCallback(), this._$Do?.setConnected(!1);
		}
		render() {
			return N;
		}
	}, V._$litElement$ = !0, V.finalized = !0, B.litElementHydrateSupport?.({ LitElement: V }), je = B.litElementPolyfillSupport, je?.({ LitElement: V }), (B.litElementVersions ??= []).push("4.2.2");
})), Ne = t((() => {})), H = t((() => {
	ce(), z(), Me(), Ne();
})), U, Pe = t((() => {
	U = (e) => (t, n) => {
		n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
			customElements.define(e, t);
		});
	};
}));
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
function W(e) {
	return (t, n) => typeof n == "object" ? Ie(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
var Fe, Ie, Le = t((() => {
	ce(), Fe = {
		attribute: !0,
		type: String,
		converter: _,
		reflect: !1,
		hasChanged: v
	}, Ie = (e = Fe, t, n) => {
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
function G(e) {
	return W({
		...e,
		state: !0,
		attribute: !1
	});
}
var Re = t((() => {
	Le();
})), ze = t((() => {})), Be = t((() => {})), Ve = t((() => {})), He = t((() => {})), Ue = t((() => {})), We = t((() => {})), Ge = t((() => {
	Pe(), Le(), Re(), ze(), Be(), Ve(), He(), Ue(), We();
})), Ke, qe, Je, Ye = t((() => {
	Ke = {
		ATTRIBUTE: 1,
		CHILD: 2,
		PROPERTY: 3,
		BOOLEAN_ATTRIBUTE: 4,
		EVENT: 5,
		ELEMENT: 6
	}, qe = (e) => (...t) => ({
		_$litDirective$: e,
		values: t
	}), Je = class {
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
})), Xe, Ze, Qe, K, q, $e, et, tt, nt, rt = t((() => {
	z(), {I: Xe} = Oe, Ze = (e) => e, Qe = () => document.createComment(""), K = (e, t, n) => {
		let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
		if (n === void 0) n = new Xe(r.insertBefore(Qe(), i), r.insertBefore(Qe(), i), e, e.options);
		else {
			let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
			if (o) {
				let t;
				n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
			}
			if (t !== i || o) {
				let e = n._$AA;
				for (; e !== t;) {
					let t = Ze(e).nextSibling;
					Ze(r).insertBefore(e, i), e = t;
				}
			}
		}
		return n;
	}, q = (e, t, n = e) => (e._$AI(t, n), e), $e = {}, et = (e, t = $e) => e._$AH = t, tt = (e) => e._$AH, nt = (e) => {
		e._$AR(), e._$AA.remove();
	};
})), it, at, ot = t((() => {
	z(), Ye(), rt(), it = (e, t, n) => {
		let r = /* @__PURE__ */ new Map();
		for (let i = t; i <= n; i++) r.set(e[i], i);
		return r;
	}, at = qe(class extends Je {
		constructor(e) {
			if (super(e), e.type !== Ke.CHILD) throw Error("repeat() can only be used in text expressions");
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
			let i = tt(e), { values: a, keys: o } = this.dt(t, n, r);
			if (!Array.isArray(i)) return this.ut = o, a;
			let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
			for (; d <= f && p <= m;) if (i[d] === null) d++;
			else if (i[f] === null) f--;
			else if (s[d] === o[p]) c[p] = q(i[d], a[p]), d++, p++;
			else if (s[f] === o[m]) c[m] = q(i[f], a[m]), f--, m--;
			else if (s[d] === o[m]) c[m] = q(i[d], a[m]), K(e, c[m + 1], i[d]), d++, m--;
			else if (s[f] === o[p]) c[p] = q(i[f], a[p]), K(e, i[d], i[f]), f--, p++;
			else if (l === void 0 && (l = it(o, p, m), u = it(s, d, f)), l.has(s[d])) if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = K(e, i[d]);
					q(t, a[p]), c[p] = t;
				} else c[p] = q(n, a[p]), K(e, i[d], n), i[t] = null;
				p++;
			} else nt(i[f]), f--;
			else nt(i[d]), d++;
			for (; p <= m;) {
				let t = K(e, c[m + 1]);
				q(t, a[p]), c[p++] = t;
			}
			for (; d <= f;) {
				let e = i[d++];
				e !== null && nt(e);
			}
			return this.ut = o, et(e, c), N;
		}
	});
})), st = t((() => {
	ot();
}));
Ge(), st(), H();
var ct = l`
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
//#region src/localize.ts
function J(e, t, n) {
	return ut(e?.language ?? "en", t, n);
}
function lt(e) {
	return ut((typeof navigator < "u" ? navigator.language : "en").split("-")[0].toLowerCase(), e);
}
function ut(e, t, n) {
	let r = dt[e in dt ? e : "en"][t] ?? dt.en[t] ?? t;
	if (n) for (let [e, t] of Object.entries(n)) r = r.replace(`{${e}}`, String(t));
	return r;
}
var dt, ft = t((() => {
	dt = {
		en: {
			card_name: "Checklist Card",
			card_description: "Check entity states and quickly fix any issues.",
			title: "Checklist",
			status: "Status",
			entity: "Entity",
			all_good: "All good!",
			problems_found: "Found {count} problems",
			fix_all: "Fix All",
			fix: "Fix",
			ok: "OK",
			show: "Show",
			hide: "Hide",
			show_ok_items_btn: "Show {count} OK items",
			hide_ok_items_btn: "Hide {count} OK items",
			unavailable: "Unavailable",
			required: "Required",
			attribute: "Attribute",
			not_exists: "Not exists",
			current_state: "Current state",
			accepted_one_of: "Accepted one of",
			fix_target: "Fix target",
			config_error: "Invalid configuration",
			expected_pattern_error: "Error parsing expected pattern",
			fix_process_error: "Error in entity fix process",
			editor_title: "Title",
			layout_section: "Card Layout",
			layout_dir: "Item arrangement",
			layout_col: "Columns (vertical list)",
			layout_row: "Rows (horizontal scroll)",
			max_items_col: "Number of columns",
			max_items_row: "Items per column",
			layout_cols_hint: "The card will be displayed in a larger width automatically.",
			layout_rows_hint: "Items scroll horizontally across the card",
			entities_section: "Entities to check",
			check_num: "Check ",
			remove: "Remove",
			select_entity: "Select Entity",
			display_name: "Display Name (Optional)",
			check_condition: "Check condition",
			cond_any: "At least one condition is OK (OR)",
			cond_all: "All conditions must be OK (AND)",
			ok_state: "OK State",
			default_fix: "Default to fix",
			default_fix_star: "Default to fix",
			remove_state: "Remove State",
			attr_check: "Attribute to check (Optional)",
			no_attr: "-- No attribute --",
			attr_val: "OK value for attribute",
			custom_fix: "Custom fix service (Optional)",
			custom_fix_hint: "Example: {\"service\": \"light.turn_on\"}",
			prereq_entity: "Prerequisite entity (Optional)",
			prereq_state: "Prerequisite state",
			prereq_hint: "Comma-separated OR, uses != for negation (e.g. !=off)",
			add_state: "+ Add another OK state",
			not_selected: "Not selected",
			every: "All",
			one_of: "One of",
			add_check: "+ Add new check",
			loading: "Loading Home Assistant editor components...",
			drag_here: "Drop here",
			sort_mode: "Sort by",
			sort_manual: "Manual (drag & drop)",
			sort_status: "Problem status (Problems first)",
			sort_alphabetical: "Alphabetical",
			sort_domain: "Domain",
			sort_severity: "Severity",
			sort_last_changed: "Last changed",
			group_by: "Group by",
			group_none: "None",
			group_severity: "Severity",
			group_domain: "Domain",
			group_area: "Area",
			show_ok_section: "Show OK entities",
			show_ok_inline: "Inline (Mixed with problems)",
			show_ok_collapsed: "Collapsed Section",
			show_ok_hidden: "Hidden completely",
			severity: "Severity",
			severity_info: "Info",
			severity_warning: "Warning",
			severity_critical: "Critical",
			icon_override: "Custom Icon (e.g., mdi:alert)",
			color_override: "Custom Color",
			confirm_fix: "Are you sure you want to fix {name}?",
			advanced_settings: "Advanced Settings",
			status_problem: "Problem",
			status_ok: "OK"
		},
		he: {
			card_name: "כרטיס בדיקות",
			card_description: "בדיקת מצב ישויות ותיקון מהיר של תקלות.",
			title: "בדיקות",
			status: "מצב",
			entity: "ישות",
			all_good: "הכל תקין!",
			problems_found: "נמצאו {count} תקלות",
			fix_all: "תיקון הכל",
			fix: "תיקון",
			ok: "תקין",
			show: "הצג",
			hide: "הסתר",
			show_ok_items_btn: "הצג {count} פריטים תקינים",
			hide_ok_items_btn: "הסתר {count} פריטים תקינים",
			unavailable: "לא זמין",
			required: "נדרש",
			attribute: "תכונה",
			not_exists: "לא קיים",
			current_state: "כרגע",
			accepted_one_of: "מקובל אחד מ",
			fix_target: "תיקון ל",
			config_error: "תצורה לא תקינה",
			expected_pattern_error: "שגיאה בפענוח תבנית ציפייה",
			fix_process_error: "שגיאה בתהליך תיקון הישות",
			editor_title: "כותרת",
			layout_section: "פריסת הכרטיסים",
			layout_dir: "סידור פריטים",
			layout_col: "עמודות (רשימה אנכית)",
			layout_row: "שורות (גלילה אופקית)",
			max_items_col: "מספר עמודות",
			max_items_row: "פריטים בעמודה",
			layout_cols_hint: "הכרטיס יוצג ברוחב גדול יותר אוטומטית",
			layout_rows_hint: "הפריטים נגללים אופקית לאורך הכרטיס",
			entities_section: "רשימת הישויות לבדיקה",
			check_num: "בדיקה ",
			remove: "הסר",
			select_entity: "בחר ישות",
			display_name: "שם תצוגה (אופציונלי)",
			check_condition: "תנאי הבדיקה",
			cond_any: "מספיק שאחד מהמצבים תקין (OR)",
			cond_all: "כל המצבים חייבים להיות תקינים (AND)",
			ok_state: "מצב תקין",
			default_fix: "ברירת מחדל לתיקון",
			default_fix_star: "ברירת מחדל לתיקון",
			remove_state: "הסר מצב",
			attr_check: "תכונה לבדיקה (אופציונלי)",
			no_attr: "-- ללא תכונה --",
			attr_val: "ערך תקין לתכונה",
			custom_fix: "שירות תיקון ייעודי (אופציונלי)",
			custom_fix_hint: "דוגמה: {\"service\": \"light.turn_on\"}",
			prereq_entity: "ישות תנאי מוקדם (אופציונלי)",
			prereq_state: "מצב נדרש",
			prereq_hint: "הפרדה בפסיקים או != לשלילה (למשל: !=off)",
			add_state: "+ הוסף מצב תקין נוסף",
			not_selected: "לא נבחרה",
			every: "כל",
			one_of: "אחד מ",
			add_check: "+ הוספת בדיקה חדשה",
			loading: "טעינת רכיבי עריכה של Home Assistant...",
			drag_here: "העבר לכאן",
			sort_mode: "מיון לפי",
			sort_manual: "ידני (גרירה)",
			sort_status: "מצב (תקלות למעלה)",
			sort_alphabetical: "אלפביתי",
			sort_domain: "סוג ישות",
			sort_severity: "חומרה",
			sort_last_changed: "שינוי אחרון",
			group_by: "קיבוץ לפי",
			group_none: "ללא קיבוץ",
			group_severity: "חומרה",
			group_domain: "סוג ישות",
			group_area: "אזור",
			show_ok_section: "הצגת ישויות תקינות",
			show_ok_inline: "ברשימה (מעורבב עם תקלות)",
			show_ok_collapsed: "באזור מוסתר (נפתח בלחיצה)",
			show_ok_hidden: "הסתר לחלוטין",
			severity: "חומרה",
			severity_info: "מידע",
			severity_warning: "אזהרה",
			severity_critical: "קריטי",
			icon_override: "אייקון מותאם (למשל mdi:alert)",
			color_override: "צבע מותאם",
			confirm_fix: "האם לתקן את {name}?",
			advanced_settings: "הגדרות מתקדמות",
			status_problem: "תקלה",
			status_ok: "תקין"
		}
	};
}));
//#endregion
//#region src/utils.ts
function pt(e) {
	return {
		...e,
		id: e.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
		entity: e.entity || "",
		name: e.name || "",
		conditions_mode: e.conditions_mode || "any",
		default_condition_index: e.default_condition_index ?? 0,
		conditions: e.conditions || []
	};
}
function mt() {
	return {
		state: "off",
		attribute: "",
		attribute_value: "",
		fix_service: ""
	};
}
function ht(e) {
	let t = { ...e };
	return t.show_ok_section ||= "inline", t.sort ||= "manual", t.sort_direction ||= "asc", t;
}
function gt(e, t, n) {
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
var _t = t((() => {}));
ft(), _t();
function Y(e, t) {
	if (!t || !t.includes("states(")) return t;
	try {
		let n = t.match(/states\(['"]([^'"]+)['"]\)/);
		if (n?.[1] && e.states[n[1]]) return e.states[n[1]].state;
	} catch (e) {
		console.warn("Error parsing expected pattern", e);
	}
	return t;
}
function vt(e, t, n) {
	if (n.prerequisite_entity?.trim()) {
		let t = e.states[n.prerequisite_entity];
		if (t) {
			let r;
			if (n.prerequisite_attribute?.trim()) {
				let i = t.attributes?.[n.prerequisite_attribute], a = n.prerequisite_attribute_value?.trim() ? n.prerequisite_attribute_value : n.prerequisite_state || "on";
				if (a = Y(e, a), a.startsWith("!=")) {
					let e = a.slice(2).split(",").map((e) => e.trim());
					r = i !== void 0 && !e.includes(String(i));
				} else {
					let e = a.split(",").map((e) => e.trim());
					r = i !== void 0 && e.includes(String(i));
				}
			} else {
				let i = n.prerequisite_state || "on";
				i = Y(e, i), r = i.startsWith("!=") ? !i.slice(2).split(",").map((e) => e.trim()).includes(t.state) : i.split(",").map((e) => e.trim()).includes(t.state);
			}
			if (!r) return !0;
		}
	}
	let r = t.state;
	if (r === "unavailable" || r === "unknown") return !1;
	if (n.attribute?.trim()) {
		let r = t.attributes?.[n.attribute], i = Y(e, n.attribute_value?.trim() ? n.attribute_value : n.state);
		return r !== void 0 && String(r) === String(i);
	}
	return r === Y(e, n.state);
}
function yt(e, t) {
	if (!t.entity) return !1;
	let n = e.states[t.entity];
	if (!n) return !0;
	let r = t.conditions.map((t) => vt(e, n, t));
	return t.conditions_mode === "all" ? !r.every(Boolean) : !r.some(Boolean);
}
//#endregion
//#region node_modules/lit/directive.js
Ye();
//#endregion
//#region src/action-handler.ts
var bt = class extends HTMLElement {
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
customElements.define("checklist-action-handler", bt);
var xt = document.createElement("checklist-action-handler"), St = qe(class extends Je {
	constructor(e) {
		super(e);
	}
	render(e) {}
	update(e, [t]) {
		return xt.bind(e.element, t), this.render(t);
	}
});
//#endregion
//#region \0@oxc-project+runtime@0.126.0/helpers/decorate.js
function X(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
var Ct = t((() => {}));
H(), Ct();
var Z = class extends V {
	constructor(...e) {
		super(...e), this.isProblem = !1, this.isFixing = !1, this.severity = "info";
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
			let e = J(this.hass, "confirm_fix", { name: this.rule.name || this.rule.entity });
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
		let n = Y(this.hass, e.state), r = !!e.attribute?.trim(), i = r ? Y(this.hass, e.attribute_value || e.state) : null;
		return M`
      <span class="entity-state">
        ${J(this.hass, "current_state")}: ${t}
        (${J(this.hass, "required")}: ${n})
      </span>
      ${r ? M`
        <span class="entity-state">
          ${J(this.hass, "attribute")} <strong>${e.attribute}</strong>:
          <strong>${this.stateObj?.attributes?.[e.attribute] ?? J(this.hass, "not_exists")}</strong>
          (${J(this.hass, "required")}: ${i})
        </span>
      ` : ""}
    `;
	}
	_renderMultiConditionStatus(e) {
		if (this.rule.conditions_mode === "any") {
			let t = this.rule.conditions.map((e) => Y(this.hass, e.state)).join(", "), n = this.rule.default_condition_index ?? 0, r = Y(this.hass, this.rule.conditions[n]?.state ?? this.rule.conditions[0]?.state);
			return M`
        <span class="entity-state">${J(this.hass, "current_state")}: <strong>${e}</strong></span>
        <span class="entity-state">${J(this.hass, "accepted_one_of")}: ${t}</span>
        <span class="entity-state">${J(this.hass, "fix_target")}: <strong>${r}</strong></span>
      `;
		}
		let t = this.stateObj ? this.rule.conditions.filter((e) => !vt(this.hass, this.stateObj, e)) : this.rule.conditions;
		return M`
      <span class="entity-state">${J(this.hass, "current_state")}: ${e}</span>
      ${t.map((e) => M`
        <span class="entity-state">
          ${J(this.hass, "required")}: ${J(this.hass, "status")}=${Y(this.hass, e.state)}${e.attribute?.trim() ? M` | ${e.attribute}=${Y(this.hass, e.attribute_value || e.state)}` : ""}
        </span>
      `)}
    `;
	}
	render() {
		let e = this.stateObj?.state ?? J(this.hass, "unavailable"), t = this.rule.conditions.length > 1, n = this.rule.name || this.stateObj?.attributes?.friendly_name || this.rule.entity, r = `${n}, ${J(this.hass, this.isProblem ? "status_problem" : "status_ok")}`, i = this.rule.icon;
		return M`
      <div
        class="check-item"
        role=${"listitem"}
        aria-label=${r}
        @action=${this._handleAction}
        .actionHandler=${St({
			hasHold: !0,
			hasDoubleClick: !0
		})}
        tabindex="0"
      >
        <ha-ripple></ha-ripple>
        <div class="entity-info-container">
          <div class="icon-wrapper ${this.isProblem ? "problem" : "ok"}">
            ${i ? M`<ha-icon .icon=${i}></ha-icon>` : M`<ha-state-icon class="entity-icon" .hass=${this.hass} .stateObj=${this.stateObj}></ha-state-icon>`}
          </div>
          <div class="check-text">
            <span class="entity-name" style=${this.rule.color ? `color: ${this.rule.color}` : ""}>
              ${n}
              ${this.rule.show_last_changed && this.stateObj ? M`
                <span style="font-size: 0.8em; opacity: 0.7; margin-inline-start: 4px;">
                  <ha-relative-time .hass=${this.hass} .datetime=${this.stateObj.last_changed}></ha-relative-time>
                </span>
              ` : ""}
            </span>
            ${this.isProblem ? t ? this._renderMultiConditionStatus(e) : this._renderSingleConditionStatus(this.rule.conditions[0], e) : M`<span class="entity-state">
                  ${J(this.hass, "status")}: ${e}
                </span>`}
          </div>
        </div>
        ${this.isProblem ? M`
          <button 
            class="fix-btn" 
            @click=${this._handleFixClick} 
            ?disabled=${this.isFixing}
            aria-label=${J(this.hass, "fix")}
            aria-busy=${this.isFixing}
          >
            ${this.isFixing ? M`<div class="spinner"></div>` : M`
                  ${J(this.hass, "fix")}
                `}
          </button>
        ` : M`
          <div style="min-width: 60px; display: flex; justify-content: flex-end; align-items: center;">
            <span class="ok-badge">
              <ha-icon icon="mdi:check" style="--mdc-icon-size: 18px;"></ha-icon>
              ${J(this.hass, "ok")}
            </span>
          </div>
        `}
      </div>
    `;
	}
};
X([W({ attribute: !1 })], Z.prototype, "stateObj", void 0), X([W({ attribute: !1 })], Z.prototype, "rule", void 0), X([W({ attribute: !1 })], Z.prototype, "hass", void 0), X([W({ type: Boolean })], Z.prototype, "isProblem", void 0), X([W({ type: Boolean })], Z.prototype, "isFixing", void 0), X([W({ type: String })], Z.prototype, "severity", void 0), Z = X([U("checklist-card-item")], Z);
//#endregion
//#region src/checklist-card-editor.styles.ts
var wt, Tt = t((() => {
	H(), wt = l`
  .config-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 16px;
    color: var(--primary-text-color);
  }

  .divider {
    height: 1px;
    background: var(--divider-color, rgba(0, 0, 0, 0.12));
    margin: 8px 0;
  }

  .section-title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  /* Basic grid for sections with multiple controls */
  .layout-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
    align-items: center;
  }

  .check-item {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--card-background-color);
    transition: box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
  }

  .check-item.dragging {
    opacity: 0.5;
    border: 2px dashed var(--primary-color);
    background: var(--secondary-background-color);
  }

  .check-item.drop-target {
    border: 2px dashed var(--primary-color) !important;
    background: rgba(var(--rgb-primary-color, 0, 0, 255), 0.05) !important;
    position: relative;
  }

  .check-item.drop-target::before {
    content: attr(data-drop-text);
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary-color);
    color: var(--text-primary-color, white);
    font-size: 12px;
    font-weight: 500;
    padding: 6px 16px;
    border-radius: 12px;
    white-space: nowrap;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .check-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .check-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .drag-handle {
    cursor: grab;
    color: var(--secondary-text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .drag-handle ha-icon {
    --mdc-icon-size: 24px;
  }

  .check-header strong {
    font-size: 16px;
    font-weight: 500;
    margin-left: 8px;
  }

  .add-btn {
    margin-top: 16px;
  }

  .conditions-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-top: 8px;
  }

  .condition-item {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.02));
  }

  .condition-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--divider-color);
    padding-bottom: 12px;
  }

  .condition-title {
    font-size: 14px;
    font-weight: 500;
  }

  .condition-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .default-label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .prereq-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-color);
    margin-bottom: 8px;
  }

  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .select-wrapper label {
    font-size: 13px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }

  .select-wrapper select {
    width: 100%;
    padding: 12px 16px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 6px);
    font-size: 14px;
    cursor: pointer;
    box-sizing: border-box;
    appearance: auto;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .select-wrapper select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }

  .json-hint {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 4px;
  }
`;
})), Et = /* @__PURE__ */ n({ ChecklistCardEditor: () => Q }), Q, Dt = t((() => {
	H(), Ge(), Tt(), ft(), Ct(), Q = class extends V {
		constructor(...e) {
			super(...e), this._draggedIndex = null, this._dropTargetIndex = null, this._collapsed = {}, this._pickersReady = !1, this._pickerLoadStarted = !1;
		}
		static {
			this.styles = wt;
		}
		setConfig(e) {
			this._config = {
				...e,
				checks: e.checks ? e.checks.map(pt) : []
			};
		}
		_updateConfig(e) {
			this._config = {
				...this._config,
				...e
			}, this.dispatchEvent(new CustomEvent("config-changed", {
				detail: { config: this._config },
				bubbles: !0,
				composed: !0
			}));
		}
		_updateCheck(e, t, n) {
			let r = this._config.checks.map((r, i) => i === e ? {
				...r,
				[t]: n
			} : r);
			this._updateConfig({ checks: r });
		}
		async _updateCondition(e, t, n, r, i) {
			let a = this._config.checks.map((i, a) => {
				if (a !== e) return i;
				let o = i.conditions.map((e, i) => i === t ? {
					...e,
					[n]: r
				} : e);
				return {
					...i,
					conditions: o
				};
			});
			this._updateConfig({ checks: a }), i && (await this.updateComplete, i.value = r);
		}
		_addCondition(e) {
			let t = this._config.checks.map((t, n) => {
				if (n !== e) return t;
				let r = t.conditions[0]?.state || "off", i = {
					...mt(),
					state: r
				};
				return {
					...t,
					conditions: [...t.conditions, i]
				};
			});
			this._updateConfig({ checks: t });
		}
		_removeCondition(e, t) {
			let n = this._config.checks.map((n, r) => {
				if (r !== e) return n;
				let i = n.conditions.filter((e, n) => n !== t), a = n.default_condition_index;
				return a >= i.length && (a = 0), {
					...n,
					conditions: i,
					default_condition_index: a
				};
			});
			this._updateConfig({ checks: n });
		}
		_setDefaultCondition(e, t) {
			let n = this._config.checks.map((n, r) => r === e ? {
				...n,
				default_condition_index: t
			} : n);
			this._updateConfig({ checks: n });
		}
		_setConditionsMode(e, t) {
			let n = this._config.checks.map((n, r) => r === e ? {
				...n,
				conditions_mode: t
			} : n);
			this._updateConfig({ checks: n });
		}
		_entityChanged(e, t) {
			let n = this._config.checks.map((n, r) => {
				if (r !== e) return n;
				let i = {
					...n,
					entity: t || ""
				};
				t && this.hass.states[t] && !i.name && (i.name = this.hass.states[t].attributes.friendly_name || t);
				let a = this._getPossibleStates(t)[0] || "";
				return i.conditions = (n.conditions || []).map((e) => ({
					...e,
					state: a,
					attribute: "",
					attribute_value: ""
				})), i;
			});
			this._updateConfig({ checks: n });
		}
		_addCheck() {
			let e = [...this._config.checks || [], {
				id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
				entity: "",
				name: "",
				conditions: [mt()],
				conditions_mode: "any",
				default_condition_index: 0,
				severity: "info"
			}];
			this._updateConfig({ checks: e });
		}
		_removeCheck(e) {
			let t = this._config.checks.filter((t, n) => n !== e);
			this._updateConfig({ checks: t });
		}
		_toggleCollapse(e) {
			this._collapsed = {
				...this._collapsed,
				[e]: !(this._collapsed[e] ?? !1)
			};
		}
		_moveCheck(e, t) {
			if (t === "up" && e === 0 || t === "down" && e === (this._config.checks?.length || 0) - 1) return;
			let n = [...this._config.checks || []], r = t === "up" ? e - 1 : e + 1, i = n[e];
			n[e] = n[r], n[r] = i, this._updateConfig({ checks: n });
		}
		_dragStart(e, t) {
			this._draggedIndex = t, this._dropTargetIndex = null, e.dataTransfer && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", t.toString()));
		}
		_handleDragOver(e, t) {
			e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "move"), this._dropTargetIndex = t;
		}
		_drop(e, t) {
			if (e.preventDefault(), this._draggedIndex === null || this._draggedIndex === t) {
				this._draggedIndex = null, this._dropTargetIndex = null;
				return;
			}
			let n = [...this._config.checks || []], r = n.splice(this._draggedIndex, 1)[0];
			n.splice(t, 0, r), this._draggedIndex = null, this._dropTargetIndex = null, this._updateConfig({ checks: n });
		}
		_dragEnd() {
			this._draggedIndex = null, this._dropTargetIndex = null;
		}
		_updateLayout(e) {
			let t = this._config.layout || {
				mode: "columns",
				count: 1
			};
			this._updateConfig({ layout: {
				...t,
				...e
			} });
		}
		_getPossibleStates(e) {
			if (!e || !this.hass?.states[e]) return [
				"on",
				"off",
				"unavailable",
				"unknown"
			];
			let t = this.hass.states[e], n = e.split(".")[0], r = t.attributes || {}, i = [];
			if (Array.isArray(r.options)) i = [...r.options];
			else if (Array.isArray(r.hvac_modes)) i = [...r.hvac_modes];
			else if (Array.isArray(r.operation_list)) i = [...r.operation_list];
			else if (Array.isArray(r.state_list)) i = [...r.state_list];
			else switch (n) {
				case "alarm_control_panel":
					i = [
						"disarmed",
						"armed_home",
						"armed_away",
						"armed_night",
						"pending",
						"triggered"
					];
					break;
				case "binary_sensor":
				case "input_boolean":
				case "switch":
				case "light":
				case "fan":
				case "remote":
				case "siren":
				case "humidifier":
				case "calendar":
					i = ["on", "off"];
					break;
				case "button":
				case "scene":
					i = ["unknown"];
					break;
				case "camera":
					i = [
						"idle",
						"recording",
						"streaming"
					];
					break;
				case "climate":
					i = [
						"off",
						"heat",
						"cool",
						"auto",
						"dry",
						"fan_only",
						"heat_cool"
					];
					break;
				case "cover":
				case "valve":
					i = [
						"open",
						"closed",
						"opening",
						"closing"
					];
					break;
				case "device_tracker":
				case "person":
					i = ["home", "not_home"];
					break;
				case "lawn_mower":
					i = [
						"mowing",
						"docked",
						"paused",
						"error"
					];
					break;
				case "lock":
					i = [
						"locked",
						"unlocked",
						"jammed"
					];
					break;
				case "media_player":
					i = [
						"playing",
						"paused",
						"idle",
						"standby",
						"on",
						"off"
					];
					break;
				case "number":
				case "input_number":
					i = [String(r.min || "0"), String(r.max || "100")];
					break;
				case "vacuum":
					i = [
						"cleaning",
						"docked",
						"idle",
						"returning",
						"paused",
						"error"
					];
					break;
				case "water_heater":
					i = [
						"off",
						"eco",
						"electric",
						"gas",
						"heat_pump"
					];
					break;
				case "input_text":
				case "text":
					i = [];
					break;
				default:
					for (let e of Object.keys(r)) if (Array.isArray(r[e]) && (e.endsWith("_modes") || e.endsWith("_list") || e.endsWith("_options") || e === "options")) {
						i = r[e].map(String);
						break;
					}
					i.length === 0 && (i = ["on", "off"]);
			}
			let a = t.state;
			return a && !i.includes(a) && i.unshift(a), i.includes("unavailable") || i.push("unavailable"), i.includes("unknown") || i.push("unknown"), [...new Set(i)];
		}
		_getPossibleAttributeValues(e, t) {
			if (!e || !t || !this.hass?.states[e]) return [
				"true",
				"false",
				"on",
				"off"
			];
			let n = this.hass.states[e].attributes || {}, r = [
				t.endsWith("s") ? t : `${t}s`,
				`${t}_list`,
				`${t}_options`
			];
			for (let e of r) if (Array.isArray(n[e])) return [...new Set(n[e].map(String))];
			if (Array.isArray(n[t])) return [...new Set(n[t].map(String))];
			let i = t.toLowerCase();
			if (i === "brightness" || i === "brightness_pct") return Array.from({ length: 11 }, (e, t) => String(t * 10));
			if (i === "color_temp" || i === "color_temp_kelvin") return Array.from({ length: 35 }, (e, t) => String(153 + t * 10));
			if (typeof n[t] == "boolean") return ["true", "false"];
			if (typeof n[t] == "number") {
				let e = n[t], r = typeof n.min == "number" ? n.min : 0, i = ((typeof n.max == "number" ? n.max : 100) - r) / 10, a = Array.from({ length: 11 }, (e, t) => String(Math.round(r + t * i)));
				return a.includes(String(e)) || a.unshift(String(e)), [...new Set(a)];
			}
			let a = n[t];
			return a == null ? [] : [String(a)];
		}
		_getPossibleAttributes(e) {
			return !e || !this.hass?.states[e]?.attributes ? [] : Object.keys(this.hass.states[e].attributes).sort();
		}
		render() {
			if (!this.hass || !this._config) return M``;
			if (!this._pickersReady) return this._pickerLoadStarted || (this._pickerLoadStarted = !0, (async () => {
				try {
					await customElements.whenDefined("hui-entities-card");
					let e = customElements.get("hui-entities-card");
					e?.getConfigElement && await e.getConfigElement();
				} catch (e) {
					console.warn("checklist-card: failed to preload editor pickers", e);
				} finally {
					this._pickersReady = !0;
				}
			})()), M`
        <div style="padding: 32px; text-align: center; color: var(--secondary-text-color);">
          <ha-circular-progress indeterminate></ha-circular-progress>
          <div style="margin-top: 16px;">${J(this.hass, "loading")}</div>
        </div>
      `;
			let e = this._config.checks || [], t = this._config.layout || {
				mode: "columns",
				count: 1
			}, n = this._config.show_ok_section || "inline";
			return M`
      <div class="config-container" dir=${this.hass?.translationMetadata?.dir || (this.hass?.language === "he" ? "rtl" : "ltr")}>
        <ha-textfield
          label=${J(this.hass, "editor_title")}
          .value=${this._config.title || ""}
          @input=${(e) => this._updateConfig({ title: e.target.value })}
        ></ha-textfield>

        <div class="divider"></div>
        <h3 class="section-title">${J(this.hass, "layout_section")}</h3>

        <div class="layout-grid">
          <div class="select-wrapper">
            <label>${J(this.hass, "show_ok_section")}</label>
            <select
              .value=${n}
              @change=${(e) => this._updateConfig({ show_ok_section: e.target.value })}
            >
              <option value="inline" ?selected=${n === "inline"}>${J(this.hass, "show_ok_inline")}</option>
              <option value="collapsed" ?selected=${n === "collapsed"}>${J(this.hass, "show_ok_collapsed")}</option>
              <option value="hidden" ?selected=${n === "hidden"}>${J(this.hass, "show_ok_hidden")}</option>
            </select>
          </div>

          <div class="select-wrapper">
            <label>${J(this.hass, "sort_mode")}</label>
            <select
              .value=${this._config.sort || "manual"}
              @change=${(e) => this._updateConfig({ sort: e.target.value })}
            >
              <option value="manual" ?selected=${this._config.sort === "manual"}>${J(this.hass, "sort_manual")}</option>
              <option value="status" ?selected=${this._config.sort === "status"}>${J(this.hass, "sort_status")}</option>
              <option value="alphabetical" ?selected=${this._config.sort === "alphabetical"}>${J(this.hass, "sort_alphabetical")}</option>
              <option value="domain" ?selected=${this._config.sort === "domain"}>${J(this.hass, "sort_domain")}</option>
              <option value="severity" ?selected=${this._config.sort === "severity"}>${J(this.hass, "sort_severity")}</option>
              <option value="last_changed" ?selected=${this._config.sort === "last_changed"}>${J(this.hass, "sort_last_changed")}</option>
            </select>
          </div>



          <div class="select-wrapper">
            <label>${J(this.hass, "layout_dir")}</label>
            <select
              .value=${t.mode === "rows" ? "rows" : "columns"}
              @change=${(e) => this._updateLayout({ mode: e.target.value })}
            >
              <option value="columns" ?selected=${t.mode === "columns"}>${J(this.hass, "layout_col")}</option>
              <option value="rows" ?selected=${t.mode === "rows"}>${J(this.hass, "layout_row")}</option>
            </select>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05); padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1);">
            <label style="font-weight: 500; font-size: 14px; color: var(--primary-text-color);">
              ${J(this.hass, t.mode === "columns" ? "max_items_col" : "max_items_row")}
            </label>
            <div style="display: flex; align-items: center; gap: 8px;">
              <ha-icon-button
                .path=${"M19,13H5V11H19V13Z"}
                @click=${() => this._updateLayout({ count: Math.max(1, (t.count || 1) - 1) })}
              ></ha-icon-button>
              <span style="font-size: 16px; font-weight: bold; width: 24px; text-align: center; color: var(--primary-text-color);">${t.count || 1}</span>
              <ha-icon-button
                .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}
                @click=${() => this._updateLayout({ count: (t.count || 1) + 1 })}
              ></ha-icon-button>
            </div>
          </div>
        </div>

        <div class="divider"></div>
        <h3 class="section-title">${J(this.hass, "entities_section")}</h3>

        ${at(e, (e) => e.id, (t, n) => {
				let r = this._collapsed[t.id] ?? !1, i = t.conditions || [], a = i.length > 1;
				return M`
            <div class="check-item ${this._draggedIndex === n ? "dragging" : ""} ${this._dropTargetIndex === n ? "drop-target" : ""}"
                 data-drop-text=${J(this.hass, "drag_here")}
                 @dragover=${(e) => this._handleDragOver(e, n)}
                 @drop=${(e) => this._drop(e, n)}
                 @dragend=${this._dragEnd}>

              <div class="check-header">
                <div class="check-header-left">
                  <span class="drag-handle" draggable="true"
                        @dragstart=${(e) => this._dragStart(e, n)}>
                    <ha-icon icon="mdi:drag"></ha-icon>
                  </span>
                  <ha-icon-button .disabled=${n === 0} @click=${() => this._moveCheck(n, "up")}>
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button .disabled=${n === e.length - 1} @click=${() => this._moveCheck(n, "down")}>
                    <ha-icon icon="mdi:arrow-down"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button @click=${() => this._toggleCollapse(t.id)}>
                    <ha-icon icon="${r ? "mdi:chevron-down" : "mdi:chevron-up"}"></ha-icon>
                  </ha-icon-button>
                  <strong>${J(this.hass, "check_num")}${n + 1}</strong>
                </div>
                <ha-button class="remove-btn" @click=${() => this._removeCheck(n)} style="--mdc-theme-primary: var(--error-color);">
                  ${J(this.hass, "remove")}
                </ha-button>
              </div>

              ${r ? M`
                <div style="font-size:13px; color:var(--secondary-text-color); margin-top: 8px;">
                  ${J(this.hass, "entity")}: ${t.entity || J(this.hass, "not_selected")} |
                  ${a ? M`${t.conditions_mode === "all" ? J(this.hass, "every") : J(this.hass, "one_of")}: ${i.map((e) => e.state).join(", ")}` : M`${J(this.hass, "status")}: ${i[0]?.state || "—"}${i[0]?.attribute ? M` | ${i[0].attribute}=${i[0].attribute_value || "—"}` : ""}`}
                </div>
              ` : M`
                <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 8px;">
                  <ha-entity-picker
                    label=${J(this.hass, "select_entity")}
                    .hass=${this.hass}
                    .value=${t.entity}
                    allow-custom-entity
                    @value-changed=${(e) => this._entityChanged(n, e.detail.value)}
                  ></ha-entity-picker>

                  <ha-textfield
                    label=${J(this.hass, "display_name")}
                    .value=${t.name || ""}
                    @input=${(e) => this._updateCheck(n, "name", e.target.value)}
                  ></ha-textfield>
                  

                  <details style="padding: 12px; background: rgba(0,0,0,0.02); border-radius: 8px; border: 1px solid var(--divider-color);">
                    <summary style="cursor: pointer; font-weight: 500;">${J(this.hass, "advanced_settings")}</summary>
                    <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
                      <div class="select-wrapper">
                        <label>${J(this.hass, "severity")}</label>
                        <select
                          .value=${t.severity || "info"}
                          @change=${(e) => this._updateCheck(n, "severity", e.target.value)}
                        >
                          <option value="info" ?selected=${t.severity === "info" || !t.severity}>${J(this.hass, "severity_info")}</option>
                          <option value="warning" ?selected=${t.severity === "warning"}>${J(this.hass, "severity_warning")}</option>
                          <option value="critical" ?selected=${t.severity === "critical"}>${J(this.hass, "severity_critical")}</option>
                        </select>
                      </div>
                      <ha-icon-picker
                        .hass=${this.hass}
                        .label=${J(this.hass, "icon_override")}
                        .value=${t.icon || ""}
                        @value-changed=${(e) => this._updateCheck(n, "icon", e.detail.value)}
                      ></ha-icon-picker>
                      <ha-textfield
                        label=${J(this.hass, "color_override")}
                        .value=${t.color || ""}
                        @input=${(e) => this._updateCheck(n, "color", e.target.value)}
                      ></ha-textfield>
                    </div>
                  </details>

                  ${a ? M`
                    <div class="select-wrapper">
                      <label>${J(this.hass, "check_condition")}</label>
                      <select
                        .value=${t.conditions_mode === "all" ? "all" : "any"}
                        @change=${(e) => this._setConditionsMode(n, e.target.value)}
                      >
                        <option value="any" ?selected=${t.conditions_mode !== "all"}>${J(this.hass, "cond_any")}</option>
                        <option value="all" ?selected=${t.conditions_mode === "all"}>${J(this.hass, "cond_all")}</option>
                      </select>
                    </div>
                  ` : ""}

                  <div class="conditions-section">
                    ${i.map((e, r) => M`
                      <div class="condition-item">
                        <div class="condition-header">
                          <span class="condition-title">
                            ${a ? `${J(this.hass, "ok_state")} ${r + 1}` : J(this.hass, "ok_state")}
                          </span>
                          <div class="condition-actions">
                            ${a && t.conditions_mode !== "all" ? M`
                              <ha-formfield label=${t.default_condition_index === r ? J(this.hass, "default_fix_star") : J(this.hass, "default_fix")}>
                                <ha-radio
                                  name="default_${t.id}"
                                  .checked=${t.default_condition_index === r}
                                  @change=${() => this._setDefaultCondition(n, r)}
                                ></ha-radio>
                              </ha-formfield>
                            ` : ""}
                            ${a ? M`
                              <ha-button @click=${() => this._removeCondition(n, r)} style="--mdc-theme-primary: var(--error-color);">
                                ${J(this.hass, "remove_state")}
                              </ha-button>
                            ` : ""}
                          </div>
                        </div>

                        <div class="select-wrapper">
                          <label>${J(this.hass, "attr_check")}</label>
                          <select
                            .value=${e.attribute || ""}
                            @change=${(e) => this._updateCondition(n, r, "attribute", e.target.value, e.target)}
                          >
                            <option value="" ?selected=${!e.attribute}>${J(this.hass, "no_attr")}</option>
                            ${this._getPossibleAttributes(t.entity).map((t) => M`
                              <option value=${t} ?selected=${e.attribute === t}>${t}</option>
                            `)}
                          </select>
                        </div>

                        ${e.attribute && e.attribute.trim() !== "" ? M`
                          <div class="select-wrapper">
                            <label>${J(this.hass, "attr_val")}</label>
                            <select
                              .value=${e.attribute_value || ""}
                              @change=${(e) => this._updateCondition(n, r, "attribute_value", e.target.value, e.target)}
                            >
                              ${[...new Set([...e.attribute_value ? [e.attribute_value] : [], ...this._getPossibleAttributeValues(t.entity, e.attribute)])].map((t) => M`
                                <option value=${t} ?selected=${e.attribute_value === t}>${t}</option>
                              `)}
                            </select>
                          </div>
                        ` : M`
                          <div class="select-wrapper">
                            <label>${J(this.hass, "ok_state")}</label>
                            <select
                              .value=${e.state || "on"}
                              @change=${(e) => this._updateCondition(n, r, "state", e.target.value, e.target)}
                            >
                              ${[...new Set([...e.state ? [e.state] : [], ...this._getPossibleStates(t.entity)])].map((t) => M`
                                <option value=${t} ?selected=${e.state === t}>${t}</option>
                              `)}
                            </select>
                          </div>
                        `}

                        <ha-textfield
                          label=${J(this.hass, "custom_fix")}
                          .value=${e.fix_service || ""}
                          @input=${(e) => this._updateCondition(n, r, "fix_service", e.target.value)}
                        ></ha-textfield>
                        <div class="json-hint">${J(this.hass, "custom_fix_hint")}</div>

                        <div class="divider"></div>
                        <div class="prereq-title">${J(this.hass, "prereq_entity")}</div>

                        <ha-entity-picker
                          .hass=${this.hass}
                          .value=${e.prerequisite_entity || ""}
                          allow-custom-entity
                          @value-changed=${(e) => this._updateCondition(n, r, "prerequisite_entity", e.detail.value)}
                        ></ha-entity-picker>

                        ${e.prerequisite_entity && e.prerequisite_entity.trim() !== "" ? M`
                          <div class="select-wrapper">
                            <label>${J(this.hass, "attr_check")}</label>
                            <select
                              .value=${e.prerequisite_attribute || ""}
                              @change=${(e) => this._updateCondition(n, r, "prerequisite_attribute", e.target.value, e.target)}
                            >
                              <option value="" ?selected=${!e.prerequisite_attribute}>${J(this.hass, "no_attr")}</option>
                              ${this._getPossibleAttributes(e.prerequisite_entity).map((t) => M`
                                <option value=${t} ?selected=${e.prerequisite_attribute === t}>${t}</option>
                              `)}
                            </select>
                          </div>

                          ${e.prerequisite_attribute && e.prerequisite_attribute.trim() !== "" ? M`
                            <div class="select-wrapper">
                              <label>${J(this.hass, "attr_val")}</label>
                              <select
                                .value=${e.prerequisite_attribute_value || ""}
                                @change=${(e) => this._updateCondition(n, r, "prerequisite_attribute_value", e.target.value, e.target)}
                              >
                                ${[...new Set([...e.prerequisite_attribute_value ? [e.prerequisite_attribute_value] : [], ...this._getPossibleAttributeValues(e.prerequisite_entity, e.prerequisite_attribute)])].map((t) => M`
                                  <option value=${t} ?selected=${e.prerequisite_attribute_value === t}>${t}</option>
                                `)}
                              </select>
                            </div>
                            <div class="json-hint">${J(this.hass, "prereq_hint")}</div>
                          ` : M`
                            <div class="select-wrapper">
                              <label>${J(this.hass, "prereq_state")}</label>
                              <select
                                .value=${e.prerequisite_state || "on"}
                                @change=${(e) => this._updateCondition(n, r, "prerequisite_state", e.target.value, e.target)}
                              >
                                ${[...new Set([...e.prerequisite_state ? [e.prerequisite_state] : [], ...this._getPossibleStates(e.prerequisite_entity)])].map((t) => M`
                                  <option value=${t} ?selected=${(e.prerequisite_state || "on") === t}>${t}</option>
                                `)}
                              </select>
                            </div>
                            <div class="json-hint">${J(this.hass, "prereq_hint")}</div>
                          `}
                        ` : ""}
                      </div>
                    `)}

                    <ha-button outlined @click=${() => this._addCondition(n)}>
                      <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
                      ${J(this.hass, "add_state")}
                    </ha-button>
                  </div>
                </div>
              `}
            </div>
          `;
			})}

        <ha-button class="add-btn" outlined @click=${this._addCheck}>
          <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
          ${J(this.hass, "add_check")}
        </ha-button>
      </div>
    `;
		}
	}, X([W({ attribute: !1 })], Q.prototype, "hass", void 0), X([G()], Q.prototype, "_config", void 0), X([G()], Q.prototype, "_draggedIndex", void 0), X([G()], Q.prototype, "_dropTargetIndex", void 0), X([G()], Q.prototype, "_collapsed", void 0), X([G()], Q.prototype, "_pickersReady", void 0), Q = X([U("checklist-card-editor")], Q);
}));
H(), Ge(), st(), ft(), _t(), Ct();
var $ = class extends V {
	constructor(...e) {
		super(...e), this._isFixingAll = !1, this._fixingItems = /* @__PURE__ */ new Set(), this._errorBanner = null, this._showOkExpanded = !1, this._problemIds = /* @__PURE__ */ new Set(), this._checksToDisplay = [], this._listStyle = "display: flex; flex-direction: column; gap: 12px;", this._watchedEntityIds = [];
	}
	static {
		this.styles = ct;
	}
	static getConfigElement() {
		return Promise.resolve().then(() => (Dt(), Et)).then(() => document.createElement("checklist-card-editor"));
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
			title: lt("title"),
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
		if (!e || !e.checks) throw Error(J(this.hass, "config_error"));
		let t = ht(e);
		this._config = {
			...t,
			checks: t.checks.map(pt)
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
		return !this.hass || !this._config?.checks ? /* @__PURE__ */ new Set() : new Set(this._config.checks.filter((e) => yt(this.hass, e)).map((e) => e.id));
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
				console.error(J(this.hass, "fix_process_error") + " (Parse/Execute):", e), this._errorBanner = J(this.hass, "fix_process_error") + " - " + String(e);
			}
			return;
		}
		let i = gt(n, Y(this.hass, t.state), t);
		try {
			await this.hass.callService(i.domain || n, i.service, {
				...r,
				...i.serviceData
			});
		} catch (e) {
			console.error("Service call failed", e), this._errorBanner = J(this.hass, "fix_process_error") + " - " + String(e);
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
				(!r || !vt(this.hass, r, n)) && (await this._fixCondition(e.entity, n), t < e.conditions.length - 1 && await new Promise((e) => setTimeout(e, 300)));
			}
		} catch (e) {
			console.error(J(this.hass, "fix_process_error"), e), this._errorBanner = J(this.hass, "fix_process_error");
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
		if (!this._config) return M``;
		let e = this._problemIds.size, t = e > 0, n = this.hass?.translationMetadata?.dir ?? (this.hass?.language === "he" ? "rtl" : "ltr"), r = this._checksToDisplay.filter((e) => this._problemIds.has(e.id)), i = this._checksToDisplay.filter((e) => !this._problemIds.has(e.id)), a = this._config.show_ok_section || "inline";
		return e === 0 && a === "hidden" ? (this.style.display = "none", M``) : (this.style.display = "", M`
      <ha-card dir=${n} role="region" aria-label=${this._config.title || J(this.hass, "title")}>
        ${this._errorBanner ? M`
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
              <div class="title">${this._config.title || J(this.hass, "title")}</div>
              <div class="subtitle" aria-live="polite">
                ${t ? J(this.hass, "problems_found", { count: e }) : J(this.hass, "all_good")}
              </div>
            </div>
          </div>

          <div class="header-actions">
            ${a === "collapsed" && i.length > 0 ? M`
              <button class="ok-toggle-btn" @click=${() => this._showOkExpanded = !this._showOkExpanded}>
                <ha-icon icon="mdi:check-circle"></ha-icon>
                ${this._showOkExpanded ? J(this.hass, "hide_ok_items_btn", { count: i.length }) : J(this.hass, "show_ok_items_btn", { count: i.length })}
              </button>
            ` : ""}

            ${r.length > 0 ? M`
              <button class="fix-all-btn" @click=${this._fixAll} ?disabled=${this._isFixingAll} aria-label=${J(this.hass, "fix_all")}>
                ${this._isFixingAll ? M`<div class="spinner"></div>` : J(this.hass, "fix_all")}
              </button>
            ` : ""}
          </div>
        </div>

        <div class="check-list" style="${this._listStyle}" role="list" @fix-requested=${this._handleFixRequested}>
          ${this._renderItems(a === "inline" ? this._checksToDisplay : r)}
          ${a === "collapsed" && this._showOkExpanded ? this._renderItems(i) : ""}
        </div>
      </ha-card>
    `);
	}
	_renderItems(e) {
		return at(e, (e) => e.id, (e) => M`
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
X([W({ attribute: !1 })], $.prototype, "hass", void 0), X([G()], $.prototype, "_config", void 0), X([G()], $.prototype, "_isFixingAll", void 0), X([G()], $.prototype, "_fixingItems", void 0), X([G()], $.prototype, "_errorBanner", void 0), X([G()], $.prototype, "_showOkExpanded", void 0), $ = X([U("checklist-card")], $), Dt(), ft(), window.customCards = window.customCards || [], window.customCards.push({
	type: "checklist-card",
	name: lt("card_name"),
	description: lt("card_description"),
	preview: !0,
	documentationURL: "https://github.com/yosef-chai/ha-checklist-card"
});
//#endregion
