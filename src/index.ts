import './checklist-card';
import './checklist-card-editor';
import { localizeStatic } from './localize';
import type { HomeAssistant } from './types';

interface CardSuggestion {
  config: Record<string, unknown>;
  label?: string;
}

declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description?: string;
      preview?: boolean;
      documentationURL?: string;
      getEntitySuggestion?: (hass: HomeAssistant, entityId: string) => CardSuggestion | CardSuggestion[] | null;
    }>;
  }
}

const CLOSED_COVER_CLASSES = ['door', 'garage', 'gate', 'window'];

// Card picker "Community" suggestions (HA 2026.6+; ignored by older versions).
// Only offered where "OK" has an obvious meaning and Fix can restore it.
function getEntitySuggestion(hass: HomeAssistant, entityId: string): CardSuggestion | null {
  const domain = entityId.split('.')[0];
  const deviceClass = hass.states[entityId]?.attributes?.device_class as string | undefined;
  let okState: string | undefined;
  if (domain === 'lock') okState = 'locked';
  else if ((domain === 'cover' && CLOSED_COVER_CLASSES.includes(deviceClass ?? '')) || domain === 'valve') okState = 'closed';
  if (!okState) return null;
  return {
    config: {
      type: 'custom:checklist-card',
      checks: [{ entity: entityId, conditions: [{ state: okState }] }],
    },
  };
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'checklist-card',
  name: localizeStatic('card_name'),
  description: localizeStatic('card_description'),
  preview: true,
  documentationURL: 'https://github.com/yosef-chai/ha-checklist-card',
  getEntitySuggestion,
});

// Version banner in the browser console — the convention across HACS cards,
// which makes it trivial to confirm which build is loaded when triaging issues.
// __CARD_VERSION__ is replaced at build time from package.json (see vite.config.ts).
declare const __CARD_VERSION__: string;
console.info(
  `%c CHECKLIST-CARD %c v${__CARD_VERSION__} `,
  'color: #fff; background: #2980b9; font-weight: 700; border-radius: 3px 0 0 3px;',
  'color: #2980b9; background: #fff; font-weight: 700; border-radius: 0 3px 3px 0;',
);
