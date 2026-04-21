import './checklist-card';
import './checklist-card-editor';
import { localizeStatic } from './localize';

declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
      preview: boolean;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'checklist-card',
  name: localizeStatic('card_name'),
  description: localizeStatic('card_description'),
  preview: true,
});
