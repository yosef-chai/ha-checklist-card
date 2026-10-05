import { directive, Directive, PartInfo } from 'lit/directive.js';

export interface ActionHandlerOptions {
  hasHold?: boolean;
  hasDoubleClick?: boolean;
}

// Per-element state kept off the DOM: WeakMap entries are GC'd automatically
// when the host element is removed, so we don't pollute elements with `__action*` fields.
const elementOptions = new WeakMap<HTMLElement, ActionHandlerOptions | undefined>();

const HOLD_TIME = 500;
const DOUBLE_TAP_WINDOW = 250;

// Pointer/keyboard events that start on a nested control (Fix / Unsnooze
// buttons) belong to that control, not to the row.
function fromNestedControl(ev: Event, element: HTMLElement): boolean {
  for (const node of ev.composedPath()) {
    if (node === element) return false;
    if (node instanceof HTMLElement && node.matches('button, a, input, select, textarea, [data-no-row-action]')) {
      return true;
    }
  }
  return false;
}

function bind(element: HTMLElement, options?: ActionHandlerOptions) {
  if (elementOptions.has(element)) {
    elementOptions.set(element, options);
    return;
  }
  elementOptions.set(element, options);

  let holdTimer: number | undefined;
  let dblClickTimer: number | undefined;
  let held = false;
  let active = false;

  const getOptions = () => elementOptions.get(element);

  const clearHold = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = undefined;
    }
  };

  const fireAction = (action: string) => {
    element.dispatchEvent(new CustomEvent('action', {
      detail: { action },
      bubbles: true,
      composed: true,
    }));
  };

  const tap = () => {
    if (getOptions()?.hasDoubleClick) {
      if (dblClickTimer) {
        clearTimeout(dblClickTimer);
        dblClickTimer = undefined;
        fireAction('double_tap');
      } else {
        dblClickTimer = window.setTimeout(() => {
          dblClickTimer = undefined;
          fireAction('tap');
        }, DOUBLE_TAP_WINDOW);
      }
    } else {
      fireAction('tap');
    }
  };

  const start = (ev: PointerEvent) => {
    // Only the primary button (left click / touch / pen contact).
    if (ev.button !== 0 || fromNestedControl(ev, element)) return;
    active = true;
    held = false;
    clearHold();
    if (getOptions()?.hasHold) {
      holdTimer = window.setTimeout(() => {
        held = true;
        fireAction('hold');
      }, HOLD_TIME);
    }
  };

  const end = (ev: PointerEvent) => {
    if (!active) return;
    active = false;
    clearHold();
    if (held || fromNestedControl(ev, element)) return;
    tap();
  };

  const cancel = () => {
    active = false;
    clearHold();
  };

  element.addEventListener('pointerdown', start, { passive: true });
  element.addEventListener('pointerup', end);
  element.addEventListener('pointercancel', cancel);
  element.addEventListener('pointerleave', cancel);
  // Long-press on touch opens the browser context menu; suppress it once a hold fired.
  element.addEventListener('contextmenu', (ev) => {
    if (held || holdTimer) ev.preventDefault();
  });
  // Keyboard: Enter / Space activate the row like a tap (HA action-handler behaviour).
  element.addEventListener('keydown', (ev: KeyboardEvent) => {
    if ((ev.key !== 'Enter' && ev.key !== ' ') || ev.repeat || fromNestedControl(ev, element)) return;
    ev.preventDefault();
    fireAction('tap');
  });
}

class ActionHandlerDirective extends Directive {
  constructor(partInfo: PartInfo) {
    super(partInfo);
  }

  render(_options?: ActionHandlerOptions) {}

  update(part: any, [options]: [ActionHandlerOptions?]) {
    bind(part.element as HTMLElement, options);
    return this.render(options);
  }
}

export const actionHandler = directive(ActionHandlerDirective);
