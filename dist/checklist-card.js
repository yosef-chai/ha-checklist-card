//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, ee = h.trustedTypes, te = ee ? ee.emptyScript : "", ne = h.reactiveElementPolyfillSupport, g = (e, t) => e, _ = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? te : null;
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
}, v = (e, t) => !l(e, t), re = {
	attribute: !0,
	type: String,
	converter: _,
	reflect: !1,
	useDefault: !1,
	hasChanged: v
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = re) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? re;
	}
	static _$Ei() {
		if (this.hasOwnProperty(g("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(g("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(g("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
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
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
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
		return s(e, this.constructor.elementStyles), e;
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
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[g("elementProperties")] = /* @__PURE__ */ new Map(), y[g("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: y }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var b = globalThis, ie = (e) => e, x = b.trustedTypes, ae = x ? x.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, S = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, w = "?" + C, oe = `<${w}>`, T = document, E = () => T.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", O = Array.isArray, se = (e) => O(e) || typeof e?.[Symbol.iterator] == "function", k = "[ 	\n\f\r]", A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ce = /-->/g, le = />/g, j = RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ue = /'/g, de = /"/g, fe = /^(?:script|style|textarea|title)$/i, M = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), N = Symbol.for("lit-noChange"), P = Symbol.for("lit-nothing"), pe = /* @__PURE__ */ new WeakMap(), F = T.createTreeWalker(T, 129);
function me(e, t) {
	if (!O(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ae === void 0 ? t : ae.createHTML(t);
}
var he = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = A;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === A ? c[1] === "!--" ? o = ce : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = j) : (fe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = j) : o = le : o === j ? c[0] === ">" ? (o = i ?? A, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? j : c[3] === "\"" ? de : ue) : o === de || o === ue ? o = j : o === ce || o === le ? o = A : (o = j, i = void 0);
		let d = o === j && e[t + 1].startsWith("/>") ? " " : "";
		a += o === A ? n + oe : l >= 0 ? (r.push(s), n.slice(0, l) + S + n.slice(l) + C + d) : n + C + (l === -2 ? t : d);
	}
	return [me(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, I = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = he(t, n);
		if (this.el = e.createElement(l, r), F.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = F.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(S)) {
					let t = u[o++], n = i.getAttribute(e).split(C), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? _e : r[1] === "?" ? ve : r[1] === "@" ? ye : z
					}), i.removeAttribute(e);
				} else e.startsWith(C) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (fe.test(i.tagName)) {
					let e = i.textContent.split(C), t = e.length - 1;
					if (t > 0) {
						i.textContent = x ? x.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], E()), F.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], E());
					}
				}
			} else if (i.nodeType === 8) if (i.data === w) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(C, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += C.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = T.createElement("template");
		return n.innerHTML = e, n;
	}
};
function L(e, t, n = e, r) {
	if (t === N) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = D(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = L(e, i._$AS(e, t.values), i, r)), t;
}
var ge = class {
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
				s.type === 2 ? t = new R(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new be(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = F.nextNode(), a++);
		}
		return F.currentNode = T, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, R = class e {
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
		e = L(this, e, t), D(e) ? e === P || e == null || e === "" ? (this._$AH !== P && this._$AR(), this._$AH = P) : e !== this._$AH && e !== N && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? se(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
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
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = I.createElement(me(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ge(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = pe.get(e.strings);
		return t === void 0 && pe.set(e.strings, t = new I(e)), t;
	}
	k(t) {
		O(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(E()), this.O(E()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ie(e).nextSibling;
			ie(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, z = class {
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
		if (i === void 0) e = L(this, e, t, 0), a = !D(e) || e !== this._$AH && e !== N, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = L(this, r[n + o], t, o), s === N && (s = this._$AH[o]), a ||= !D(s) || s !== this._$AH[o], s === P ? e = P : e !== P && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === P ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, _e = class extends z {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === P ? void 0 : e;
	}
}, ve = class extends z {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== P);
	}
}, ye = class extends z {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = L(this, e, t, 0) ?? P) === N) return;
		let n = this._$AH, r = e === P && n !== P || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== P && (n === P || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, be = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		L(this, e);
	}
}, xe = {
	M: S,
	P: C,
	A: w,
	C: 1,
	L: he,
	R: ge,
	D: se,
	V: L,
	I: R,
	H: z,
	N: ve,
	U: ye,
	B: _e,
	F: be
}, Se = b.litHtmlPolyfillSupport;
Se?.(I, R), (b.litHtmlVersions ??= []).push("3.3.2");
var Ce = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new R(t.insertBefore(E(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, B = globalThis, V = class extends y {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ce(t, this.renderRoot, this.renderOptions);
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
};
V._$litElement$ = !0, V.finalized = !0, B.litElementHydrateSupport?.({ LitElement: V });
var we = B.litElementPolyfillSupport;
we?.({ LitElement: V }), (B.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var Te = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Ee = {
	attribute: !0,
	type: String,
	converter: _,
	reflect: !1,
	hasChanged: v
}, De = (e = Ee, t, n) => {
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
function H(e) {
	return (t, n) => typeof n == "object" ? De(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function U(e) {
	return H({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/lit-html/directive.js
var Oe = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, ke = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Ae = class {
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
}, { I: je } = xe, Me = (e) => e, Ne = () => document.createComment(""), W = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new je(r.insertBefore(Ne(), i), r.insertBefore(Ne(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = Me(e).nextSibling;
				Me(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, G = (e, t, n = e) => (e._$AI(t, n), e), Pe = {}, Fe = (e, t = Pe) => e._$AH = t, Ie = (e) => e._$AH, K = (e) => {
	e._$AR(), e._$AA.remove();
}, Le = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, Re = ke(class extends Ae {
	constructor(e) {
		if (super(e), e.type !== Oe.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = Ie(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = G(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = G(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = G(i[d], a[m]), W(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = G(i[f], a[p]), W(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = Le(o, p, m), u = Le(s, d, f)), l.has(s[d])) if (l.has(s[f])) {
			let t = u.get(o[p]), n = t === void 0 ? null : i[t];
			if (n === null) {
				let t = W(e, i[d]);
				G(t, a[p]), c[p] = t;
			} else c[p] = G(n, a[p]), W(e, i[d], n), i[t] = null;
			p++;
		} else K(i[f]), f--;
		else K(i[d]), d++;
		for (; p <= m;) {
			let t = W(e, c[m + 1]);
			G(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && K(e);
		}
		return this.ut = o, Fe(e, c), N;
	}
}), ze = o`
  :host {
    display: block;
    /* Enable container queries so layout adapts to the card's own width,
       not the viewport — critical for Lovelace grid where cards can be
       narrow or wide regardless of screen size. */
    container-type: inline-size;
    font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
    /* Fill the full height of the grid cell in the sections view. */
    height: 100%;
  }

  ha-card {
    padding: 16px;
    box-sizing: border-box;
    /* Flex column so the check-list stretches to fill remaining card height
       in the sections (grid) view while still growing naturally in masonry. */
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
    /* Grow to fill whatever height ha-card has (sections grid), and scroll
       when content overflows. min-height: 0 lets a flex child shrink below
       its intrinsic size so the parent's height constraint is respected. */
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .check-list::-webkit-scrollbar { width: 6px; }
  .check-list::-webkit-scrollbar-track { background: transparent; }
  .check-list::-webkit-scrollbar-thumb { background-color: var(--divider-color); border-radius: 3px; }

  .check-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-radius: var(--ha-card-border-radius, 12px);
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    gap: 12px;
    transition: all 0.2s;
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
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .icon-wrapper.problem {
    background-color: rgba(var(--rgb-disabled-color, 97, 97, 97), 0.35);
  }
  .icon-wrapper.ok {
    background-color: rgba(var(--rgb-success-color, 46, 125, 50), 0.5);
  }

  .entity-icon {
    color: var(--state-icon-color, var(--primary-text-color));
    --mdc-icon-size: 24px;
  }
  .icon-wrapper.problem .entity-icon {
    color: var(--disabled-text-color, #a9a7a7ff);
  }
  .icon-wrapper.ok .entity-icon {
    color: var(--success-color, #2e7d32);
  }

  .check-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
  }

  .entity-name {
    font-size: 15px;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  .entity-state {
    font-size: 13px;
    color: var(--secondary-text-color);
    line-height: 1.2;
  }

  .ok-badge {
    font-size: 14px;
    color: var(--success-color, #2e7d32);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  button.fix-btn {
    background-color: #feb847ff;
    color: #fff;
    border: none;
    padding: 6px 16px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    transition: opacity 0.2s;
    min-width: 60px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }

  button.fix-btn:hover:not([disabled]) {
    opacity: 0.8;
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

  /* Container query: responds to the card's own width, not the viewport.
     This fires correctly whether the card is narrow because of screen size
     OR because it sits in a small grid column. */
  @container (max-width: 450px) {
    .header { flex-direction: column; align-items: flex-start; }
    .fix-all-btn { width: 100%; margin-top: 8px; }
    .check-item { flex-direction: column; align-items: flex-start; gap: 16px; }
    .fix-btn { width: 100%; }
  }
`, q = {
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
		show_ok: "Show OK entities?",
		show_ok_yes: "Yes (Show all)",
		show_ok_no: "No (Hide OK)",
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
		drag_here: "Drop here"
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
		show_ok: "להציג ישויות במצב תקין?",
		show_ok_yes: "כן (הצג הכל)",
		show_ok_no: "לא (הסתר תקינים)",
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
		drag_here: "העבר לכאן"
	}
};
function J(e, t, n) {
	return Be(e?.language ?? "en", t, n);
}
function Y(e) {
	return Be((typeof navigator < "u" ? navigator.language : "en").split("-")[0].toLowerCase(), e);
}
function Be(e, t, n) {
	let r = q[e in q ? e : "en"][t] ?? q.en[t] ?? t;
	if (n) for (let [e, t] of Object.entries(n)) r = r.replace(`{${e}}`, String(t));
	return r;
}
//#endregion
//#region src/utils.ts
function X(e) {
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
function Ve() {
	return {
		state: "off",
		attribute: "",
		attribute_value: "",
		fix_service: ""
	};
}
function He(e, t) {
	let n = "", r = {};
	switch (e) {
		case "switch":
		case "light":
		case "input_boolean":
		case "fan":
			n = t === "off" ? "turn_off" : "turn_on";
			break;
		case "lock":
			n = t === "unlocked" ? "unlock" : "lock";
			break;
		case "cover":
			n = t === "open" ? "open_cover" : "close_cover";
			break;
		case "climate":
			n = "set_hvac_mode", r.hvac_mode = t;
			break;
		case "select":
		case "input_select":
			n = "select_option", r.option = t;
			break;
		case "number":
		case "input_number":
			n = "set_value", r.value = parseFloat(t);
			break;
		case "vacuum":
			n = ["docked", "returning"].includes(t) ? "return_to_base" : "start";
			break;
		default: n = t === "off" ? "turn_off" : "turn_on";
	}
	return {
		service: n,
		serviceData: r
	};
}
//#endregion
//#region \0@oxc-project+runtime@0.126.0/helpers/decorate.js
function Z(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/checklist-card.ts
var Q = class extends V {
	constructor(...e) {
		super(...e), this._isFixingAll = !1, this._fixingItems = /* @__PURE__ */ new Set(), this._problemIds = /* @__PURE__ */ new Set(), this._checksToDisplay = [], this._listStyle = "display: flex; flex-direction: column; gap: 12px;", this._watchedEntityIds = [];
	}
	static {
		this.styles = ze;
	}
	static getConfigElement() {
		return document.createElement("checklist-card-editor");
	}
	getCardSize() {
		let e = this._config?.checks?.length ?? 1, t = this._layoutCols(), n = Math.ceil(e / t);
		return Math.max(2, Math.ceil(n * 1.2) + 2);
	}
	getGridOptions() {
		let e = this._config?.checks?.length ?? 1, t = this._config?.layout ?? {
			mode: "columns",
			count: 1
		};
		if (t.mode === "rows") {
			let n = Math.max(1, t.count || 1);
			return {
				columns: Math.min(12, Math.max(6, Math.ceil(e / n) * 2)),
				rows: Math.max(3, Math.ceil(n * 1.3) + 2),
				min_columns: 4,
				max_columns: 12,
				min_rows: 2
			};
		}
		let n = this._layoutCols(), r = Math.ceil(e / n);
		return {
			columns: Math.min(12, n * 3),
			rows: Math.max(3, Math.ceil(r * 1.3) + 2),
			min_columns: Math.min(12, Math.max(2, n * 2)),
			max_columns: 12,
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
			title: Y("title"),
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
			}
		};
	}
	setConfig(e) {
		if (!e || !e.checks) throw Error(J(this.hass, "config_error"));
		this._config = {
			...e,
			checks: e.checks.map(X)
		};
	}
	willUpdate(e) {
		if (super.willUpdate(e), e.has("_config")) {
			this._watchedEntityIds = this._collectWatchedEntityIds(), this._listStyle = this._computeListStyle(), this._problemIds = this._calculateProblemIds(), this._checksToDisplay = this._computeChecksToDisplay();
			return;
		}
		if (e.has("hass")) {
			let t = e.get("hass");
			if (t && this._watchedEntityIds.length > 0 && !this._watchedEntityIds.some((e) => t.states?.[e] !== this.hass.states?.[e])) return;
			this._problemIds = this._calculateProblemIds(), this._checksToDisplay = this._computeChecksToDisplay();
		}
	}
	_collectWatchedEntityIds() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this._config.checks) {
			t.entity && e.add(t.entity);
			for (let n of t.conditions ?? []) n.prerequisite_entity && e.add(n.prerequisite_entity);
		}
		return Array.from(e);
	}
	_computeListStyle() {
		let e = this._config?.layout ?? {
			mode: "columns",
			count: 1
		};
		return e.mode === "columns" ? e.count <= 1 ? "display: flex; flex-direction: column; gap: 12px;" : `display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, max(250px, calc(100% / ${e.count} - 12px))), 1fr)); gap: 12px; align-items: start;` : e.mode === "rows" ? `display: grid; grid-template-rows: repeat(${e.count}, auto); grid-auto-flow: column; gap: 12px; align-items: start; overflow-x: auto; padding-bottom: 8px;` : "display: flex; flex-direction: column; gap: 12px;";
	}
	_computeChecksToDisplay() {
		return this._config.checks.filter((e) => !(!e.entity || this._config.show_ok_items === !1 && !this._problemIds.has(e.id)));
	}
	_evaluateExpectedState(e) {
		if (!e || !e.includes("states(")) return e;
		try {
			let t = e.match(/states\(['"]([^'"]+)['"]\)/);
			if (t?.[1] && this.hass.states[t[1]]) return this.hass.states[t[1]].state;
		} catch (e) {
			console.warn(J(this.hass, "expected_pattern_error"), e);
		}
		return e;
	}
	_checkCondition(e, t) {
		if (t.prerequisite_entity?.trim()) {
			let e = this.hass.states[t.prerequisite_entity];
			if (e) {
				let n;
				if (t.prerequisite_attribute?.trim()) {
					let r = e.attributes?.[t.prerequisite_attribute], i = t.prerequisite_attribute_value?.trim() ? t.prerequisite_attribute_value : t.prerequisite_state || "on";
					if (i = this._evaluateExpectedState(i), i.startsWith("!=")) {
						let e = i.slice(2).split(",").map((e) => e.trim());
						n = r !== void 0 && !e.includes(String(r));
					} else {
						let e = i.split(",").map((e) => e.trim());
						n = r !== void 0 && e.includes(String(r));
					}
				} else {
					let r = t.prerequisite_state || "on";
					r = this._evaluateExpectedState(r), n = r.startsWith("!=") ? !r.slice(2).split(",").map((e) => e.trim()).includes(e.state) : r.split(",").map((e) => e.trim()).includes(e.state);
				}
				if (!n) return !0;
			}
		}
		let n = e.state;
		if (n === "unavailable" || n === "unknown") return !1;
		if (t.attribute?.trim()) {
			let n = e.attributes?.[t.attribute], r = this._evaluateExpectedState(t.attribute_value?.trim() ? t.attribute_value : t.state);
			return n !== void 0 && String(n) === String(r);
		}
		return n === this._evaluateExpectedState(t.state);
	}
	_isRuleProblem(e) {
		if (!e.entity) return !1;
		let t = this.hass.states[e.entity];
		if (!t) return !0;
		let n = e.conditions.map((e) => this._checkCondition(t, e));
		return e.conditions_mode === "all" ? !n.every(Boolean) : !n.some(Boolean);
	}
	_calculateProblemIds() {
		return !this.hass || !this._config?.checks ? /* @__PURE__ */ new Set() : new Set(this._config.checks.filter((e) => this._isRuleProblem(e)).map((e) => e.id));
	}
	async _fixCondition(e, t) {
		let n = e.split(".")[0], r = { entity_id: e };
		if (t.fix_service?.trim()) {
			let e = t.fix_service.trim();
			try {
				if (e.startsWith("{")) {
					let t = JSON.parse(e), [n, i] = t.service.split(".");
					await this.hass.callService(n, i, {
						...r,
						...t.data
					});
				} else if (e.includes(".")) {
					let [t, n] = e.split(".");
					await this.hass.callService(t, n, r);
				}
			} catch (e) {
				console.error(J(this.hass, "fix_process_error") + " (Parse/Execute):", e);
			}
			return;
		}
		let i = He(n, this._evaluateExpectedState(t.state));
		if (t.attribute?.trim() && t.attribute_value?.trim()) {
			let e = this._evaluateExpectedState(t.attribute_value);
			if (n === "light" && t.attribute === "brightness" && i.service === "turn_on") {
				let t = parseInt(e, 10);
				isNaN(t) || (i.serviceData.brightness = t);
			}
		}
		await this.hass.callService(n, i.service, {
			...r,
			...i.serviceData
		});
	}
	async _fixIssue(e) {
		this._fixingItems = new Set([...this._fixingItems, e.id]);
		try {
			let t = this.hass.states[e.entity];
			if (e.conditions_mode === "any") {
				let t = e.default_condition_index ?? 0;
				await this._fixCondition(e.entity, e.conditions[t] ?? e.conditions[0]);
			} else for (let n of e.conditions) (!t || !this._checkCondition(t, n)) && (await this._fixCondition(e.entity, n), e.conditions.length > 1 && await new Promise((e) => setTimeout(e, 300)));
		} catch (e) {
			console.error(J(this.hass, "fix_process_error"), e);
		} finally {
			let t = new Set(this._fixingItems);
			t.delete(e.id), this._fixingItems = t;
		}
	}
	async _fixAll() {
		this._isFixingAll = !0;
		for (let e of this._config.checks) !e.entity || !this._problemIds.has(e.id) || (await this._fixIssue(e), await new Promise((e) => setTimeout(e, 300)));
		this._isFixingAll = !1;
	}
	_renderSingleConditionStatus(e, t, n) {
		let r = this._evaluateExpectedState(e.state), i = !!e.attribute?.trim(), a = i ? this._evaluateExpectedState(e.attribute_value || e.state) : null;
		return M`
      <span class="entity-state">
        ${J(this.hass, "current_state")}: ${n}
        (${J(this.hass, "required")}: ${r})
      </span>
      ${i ? M`
        <span class="entity-state">
          ${J(this.hass, "attribute")} <strong>${e.attribute}</strong>:
          <strong>${t?.attributes?.[e.attribute] ?? J(this.hass, "not_exists")}</strong>
          (${J(this.hass, "required")}: ${a})
        </span>
      ` : ""}
    `;
	}
	_renderMultiConditionStatus(e, t, n) {
		if (e.conditions_mode === "any") {
			let t = e.conditions.map((e) => this._evaluateExpectedState(e.state)).join(", "), r = e.default_condition_index ?? 0, i = this._evaluateExpectedState(e.conditions[r]?.state ?? e.conditions[0]?.state);
			return M`
        <span class="entity-state">${J(this.hass, "current_state")}: <strong>${n}</strong></span>
        <span class="entity-state">${J(this.hass, "accepted_one_of")}: ${t}</span>
        <span class="entity-state">${J(this.hass, "fix_target")}: <strong>${i}</strong></span>
      `;
		}
		let r = t ? e.conditions.filter((e) => !this._checkCondition(t, e)) : e.conditions;
		return M`
      <span class="entity-state">${J(this.hass, "current_state")}: ${n}</span>
      ${r.map((e) => M`
        <span class="entity-state">
          ${J(this.hass, "required")}: ${J(this.hass, "status")}=${this._evaluateExpectedState(e.state)}${e.attribute?.trim() ? M` | ${e.attribute}=${this._evaluateExpectedState(e.attribute_value || e.state)}` : ""}
        </span>
      `)}
    `;
	}
	render() {
		if (!this._config) return M``;
		let e = this._problemIds.size, t = e > 0, n = this._checksToDisplay.length > 0;
		return M`
      <ha-card dir=${this.hass?.translationMetadata?.dir ?? (this.hass?.language === "he" ? "rtl" : "ltr")}>
        <div class="header">
          <div class="header-content">
            <span class="status-icon ${t ? "error" : "success"}">
              <ha-icon icon="${t ? "mdi:alert" : "mdi:check-circle"}"></ha-icon>
            </span>
            <div>
              <div class="title">${this._config.title || J(this.hass, "title")}</div>
              <div class="subtitle">
                ${t ? J(this.hass, "problems_found", { count: e }) : J(this.hass, "all_good")}
              </div>
            </div>
          </div>

          ${n && t ? M`
            <button class="fix-all-btn" @click=${this._fixAll} ?disabled=${this._isFixingAll}>
              ${this._isFixingAll ? M`<div class="spinner"></div>` : J(this.hass, "fix_all")}
            </button>
          ` : ""}
        </div>

        ${n ? M`
          <div class="check-list" style="${this._listStyle}">
            ${Re(this._checksToDisplay, (e) => e.id, (e) => {
			let t = this._problemIds.has(e.id), n = this.hass.states[e.entity], r = n?.state ?? J(this.hass, "unavailable"), i = e.conditions.length > 1, a = e.name || n?.attributes?.friendly_name || e.entity;
			return M`
                <div class="check-item">
                  <div class="entity-info-container">
                    <div class="icon-wrapper ${t ? "problem" : "ok"}">
                      <ha-state-icon
                        class="entity-icon"
                        .hass=${this.hass}
                        .stateObj=${n}
                      ></ha-state-icon>
                    </div>
                    <div class="check-text">
                      <span class="entity-name">${a}</span>
                      ${t ? i ? this._renderMultiConditionStatus(e, n, r) : this._renderSingleConditionStatus(e.conditions[0], n, r) : M`<span class="entity-state">${J(this.hass, "status")}: ${r}</span>`}
                    </div>
                  </div>
                  ${t ? M`
                    <button class="fix-btn" @click=${() => this._fixIssue(e)} ?disabled=${this._fixingItems.has(e.id)}>
                      ${this._fixingItems.has(e.id) ? M`<div class="spinner"></div>` : J(this.hass, "fix")}
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
		})}
          </div>
        ` : ""}
      </ha-card>
    `;
	}
};
Z([H({ attribute: !1 })], Q.prototype, "hass", void 0), Z([U()], Q.prototype, "_config", void 0), Z([U()], Q.prototype, "_isFixingAll", void 0), Z([U()], Q.prototype, "_fixingItems", void 0), Q = Z([Te("checklist-card")], Q);
//#endregion
//#region src/checklist-card-editor.styles.ts
var Ue = o`
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
`, $ = class extends V {
	constructor(...e) {
		super(...e), this._draggedIndex = null, this._dropTargetIndex = null, this._collapsed = {}, this._glanceCard = null;
	}
	static {
		this.styles = Ue;
	}
	setConfig(e) {
		this._config = {
			...e,
			checks: e.checks.map(X)
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
				...Ve(),
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
			conditions: [Ve()],
			conditions_mode: "any",
			default_condition_index: 0
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
					"armed_vacation",
					"armed_custom_bypass",
					"pending",
					"arming",
					"disarming",
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
			case "update":
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
					"error",
					"returning",
					"edging"
				];
				break;
			case "lock":
				i = [
					"locked",
					"unlocked",
					"locking",
					"unlocking",
					"jammed"
				];
				break;
			case "media_player":
				i = [
					"playing",
					"paused",
					"idle",
					"standby",
					"buffering",
					"on",
					"off"
				];
				break;
			case "number":
			case "input_number":
				i = [r.min === void 0 ? "0" : String(r.min), r.max === void 0 ? "100" : String(r.max)];
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
					"heat_pump",
					"high_demand",
					"performance"
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
		if (!this._glanceCard) return this._glanceCard = customElements.get("hui-glance-card"), this._glanceCard && this._glanceCard.getConfigElement().then(() => this.requestUpdate()), M`
        <div style="padding: 32px; text-align: center; color: var(--secondary-text-color);">
          <ha-circular-progress indeterminate></ha-circular-progress>
          <div style="margin-top: 16px;">${J(this.hass, "loading")}</div>
        </div>
      `;
		let e = this._config.checks || [], t = this._config.layout || {
			mode: "columns",
			count: 1
		};
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
          <ha-formfield label=${J(this.hass, "show_ok")}>
            <ha-switch
              .checked=${this._config.show_ok_items !== !1}
              @change=${(e) => this._updateConfig({ show_ok_items: e.target.checked })}
            ></ha-switch>
          </ha-formfield>

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

          ${t.mode === "rows" ? M`
            <ha-textfield
              label=${J(this.hass, "max_items_row")}
              type="number"
              min="1"
              max="10"
              .value=${String(t.count || 1)}
              @input=${(e) => {
			let t = parseInt(e.target.value, 10);
			!isNaN(t) && t >= 1 && this._updateLayout({ count: t });
		}}
            ></ha-textfield>
            <div class="json-hint">${J(this.hass, "layout_rows_hint")}</div>
          ` : M`
            <div class="select-wrapper">
              <label>${J(this.hass, "max_items_col")}</label>
              <select
                .value=${String(t.count || 1)}
                @change=${(e) => {
			let t = parseInt(e.target.value, 10);
			isNaN(t) || this._updateLayout({ count: t });
		}}
              >
                ${[
			1,
			2,
			3,
			4
		].map((e) => M`
                  <option value=${e} ?selected=${(t.count || 1) === e}>${e}</option>
                `)}
              </select>
            </div>
            <div class="json-hint">${J(this.hass, "layout_cols_hint")}</div>
          `}
        </div>

        <div class="divider"></div>
        <h3 class="section-title">${J(this.hass, "entities_section")}</h3>

        ${Re(e, (e) => e.id, (t, n) => {
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
};
Z([H({ attribute: !1 })], $.prototype, "hass", void 0), Z([U()], $.prototype, "_config", void 0), Z([U()], $.prototype, "_draggedIndex", void 0), Z([U()], $.prototype, "_dropTargetIndex", void 0), Z([U()], $.prototype, "_collapsed", void 0), $ = Z([Te("checklist-card-editor")], $), window.customCards = window.customCards || [], window.customCards.push({
	type: "checklist-card",
	name: Y("card_name"),
	description: Y("card_description"),
	preview: !0
});
//#endregion
