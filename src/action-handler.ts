import { directive, Directive, PartInfo, EventPart, PartType } from 'lit/directive.js';
import type { ActionConfig, HomeAssistant } from './types';

export interface ActionHandlerOptions {
  hasHold?: boolean;
  hasDoubleClick?: boolean;
}

class ActionHandler extends HTMLElement {
  public holdTime = 500;
  public bind(element: HTMLElement, options?: ActionHandlerOptions) {
    if ((element as any).__actionHandlerBound) {
      (element as any).__actionHandlerOptions = options;
      return;
    }
    (element as any).__actionHandlerBound = true;
    (element as any).__actionHandlerOptions = options;

    let timer: number | undefined;
    let held = false;
    let dblClickTimeout: number | undefined;

    const getOptions = () => (element as any).__actionHandlerOptions as ActionHandlerOptions | undefined;

    const clear = () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    };

    const fireAction = (action: string) => {
      const event = new CustomEvent('action', {
        detail: { action },
        bubbles: true,
        composed: true,
      });
      element.dispatchEvent(event);
    };

    const start = (ev: Event) => {
      held = false;
      clear();
      if (getOptions()?.hasHold) {
        timer = window.setTimeout(() => {
          held = true;
          fireAction('hold');
        }, this.holdTime);
      }
    };

    const end = (ev: Event) => {
      clear();
      if (held) return;
      if (getOptions()?.hasDoubleClick) {
        if (dblClickTimeout) {
          clearTimeout(dblClickTimeout);
          dblClickTimeout = undefined;
          fireAction('double_tap');
        } else {
          dblClickTimeout = window.setTimeout(() => {
            dblClickTimeout = undefined;
            fireAction('tap');
          }, 250);
        }
      } else {
        fireAction('tap');
      }
    };

    element.addEventListener('pointerdown', start, { passive: true });
    element.addEventListener('pointerup', end);
    element.addEventListener('pointercancel', clear);
    element.addEventListener('pointerleave', clear);
  }
}

customElements.define('checklist-action-handler', ActionHandler);

const actionHandlerElement = document.createElement('checklist-action-handler') as ActionHandler;

class ActionHandlerDirective extends Directive {
  constructor(partInfo: PartInfo) {
    super(partInfo);
  }

  render(options?: ActionHandlerOptions) {}

  update(part: any, [options]: [ActionHandlerOptions?]) {
    actionHandlerElement.bind(part.element as HTMLElement, options);
    return this.render(options);
  }
}

export const actionHandler = directive(ActionHandlerDirective);

export function handleAction(
  element: HTMLElement,
  hass: HomeAssistant,
  config: { entity?: string; camera_image?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
  action: string
) {
  const actionConfig = config[`${action}_action` as keyof typeof config] as ActionConfig | undefined;
  
  if (!actionConfig) {
    if (action === 'tap') {
      const event = new CustomEvent('hass-more-info', {
        detail: { entityId: config.entity },
        bubbles: true,
        composed: true,
      });
      element.dispatchEvent(event);
    }
    return;
  }

  let actionType = actionConfig.action;
  if (actionType === 'none') return;
  if (actionType === 'fix') return; // Handled specially by the card

  const event = new CustomEvent('hass-action', {
    detail: { config, action },
    bubbles: true,
    composed: true,
  });
  element.dispatchEvent(event);
}
