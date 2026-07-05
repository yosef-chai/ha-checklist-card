import './checklist-card';
import './checklist-card-editor';
import { localizeStatic } from './localize';

declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description?: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'checklist-card',
  name: localizeStatic('card_name'),
  description: localizeStatic('card_description'),
  preview: true,
  documentationURL: 'https://github.com/yosef-chai/ha-checklist-card',
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
