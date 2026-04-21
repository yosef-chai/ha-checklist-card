/**
 * @file localize.ts
 * @description Internationalization (i18n) module for the Checklist Card.
 *
 * All user-visible strings are defined here in the `TRANSLATIONS` map, keyed
 * first by BCP 47 language tag and then by a camelCase string key. Adding a
 * new language requires only a new top-level entry in `TRANSLATIONS` — no
 * changes to component code are needed.
 *
 * Two public helpers are exported:
 * - {@link localize} — for use inside Lit components where `hass` is available.
 * - {@link localizeStatic} — for static contexts (card registration, stub
 *   config) that run before `hass` is injected.
 *
 * @supported-languages en (English), he (Hebrew / עברית)
 */

import type { HomeAssistant } from './types';

// ---------------------------------------------------------------------------
// Translation table
// ---------------------------------------------------------------------------

/**
 * Master translation map. Each top-level key is a BCP 47 primary language
 * subtag; each nested object maps string keys to their translated values.
 * Placeholders in values use the `{key}` syntax and are replaced at runtime
 * by {@link _translate}.
 *
 * @internal
 */
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Card picker registration
    card_name: 'Checklist Card',
    card_description: 'Check entity states and quickly fix any issues.',

    // Shared
    title: 'Checklist',
    status: 'Status',
    entity: 'Entity',

    // Checklist Card
    all_good: 'All good!',
    problems_found: 'Found {count} problems',
    fix_all: 'Fix All',
    fix: 'Fix',
    ok: 'OK',
    unavailable: 'Unavailable',
    required: 'Required',
    attribute: 'Attribute',
    not_exists: 'Not exists',
    current_state: 'Current state',
    accepted_one_of: 'Accepted one of',
    fix_target: 'Fix target',
    config_error: 'Invalid configuration',
    expected_pattern_error: 'Error parsing expected pattern',
    fix_process_error: 'Error in entity fix process',

    // Editor UI
    editor_title: 'Title',
    layout_section: 'Card Layout',
    show_ok: 'Show OK entities?',
    show_ok_yes: 'Yes (Show all)',
    show_ok_no: 'No (Hide OK)',
    layout_dir: 'Layout direction',
    layout_col: 'Columns (Vertical scroll)',
    layout_row: 'Rows (Horizontal scroll)',
    max_items_col: 'Max items per row',
    max_items_row: 'Max items per column',
    entities_section: 'Entities to check',
    check_num: 'Check ',
    remove: 'Remove',
    select_entity: 'Select Entity',
    display_name: 'Display Name (Optional)',
    check_condition: 'Check condition',
    cond_any: 'At least one condition is OK (OR)',
    cond_all: 'All conditions must be OK (AND)',
    ok_state: 'OK State',
    default_fix: 'Default to fix',
    default_fix_star: 'Default to fix',
    remove_state: 'Remove State',
    attr_check: 'Attribute to check (Optional)',
    no_attr: '-- No attribute --',
    attr_val: 'OK value for attribute',
    custom_fix: 'Custom fix service (Optional)',
    custom_fix_hint: 'Example: {"service": "light.turn_on"}',
    prereq_entity: 'Prerequisite entity (Optional)',
    prereq_state: 'Prerequisite state',
    prereq_hint: 'Comma-separated OR, uses != for negation (e.g. !=off)',
    add_state: '+ Add another OK state',
    not_selected: 'Not selected',
    every: 'All',
    one_of: 'One of',
    add_check: '+ Add new check',
    loading: 'Loading Home Assistant editor components...',
    drag_here: 'Drop here',
  },

  he: {
    // Card picker registration
    card_name: 'כרטיס בדיקות',
    card_description: 'בדיקת מצב ישויות ותיקון מהיר של תקלות.',

    // Shared
    title: 'בדיקות',
    status: 'מצב',
    entity: 'ישות',

    // Checklist Card
    all_good: 'הכל תקין!',
    problems_found: 'נמצאו {count} תקלות',
    fix_all: 'תיקון הכל',
    fix: 'תיקון',
    ok: 'תקין',
    unavailable: 'לא זמין',
    required: 'נדרש',
    attribute: 'תכונה',
    not_exists: 'לא קיים',
    current_state: 'כרגע',
    accepted_one_of: 'מקובל אחד מ',
    fix_target: 'תיקון ל',
    config_error: 'תצורה לא תקינה',
    expected_pattern_error: 'שגיאה בפענוח תבנית ציפייה',
    fix_process_error: 'שגיאה בתהליך תיקון הישות',

    // Editor UI
    editor_title: 'כותרת',
    layout_section: 'פריסת הכרטיסים',
    show_ok: 'להציג ישויות במצב תקין?',
    show_ok_yes: 'כן (הצג הכל)',
    show_ok_no: 'לא (הסתר תקינים)',
    layout_dir: 'כיוון פריסה',
    layout_col: 'עמודות (גלילה אנכית)',
    layout_row: 'שורות (גלילה אופקית)',
    max_items_col: 'מספר מקסימלי של כרטיסים בשורה',
    max_items_row: 'מספר מקסימלי של כרטיסים בעמודה',
    entities_section: 'רשימת הישויות לבדיקה',
    check_num: 'בדיקה ',
    remove: 'הסר',
    select_entity: 'בחר ישות',
    display_name: 'שם תצוגה (אופציונלי)',
    check_condition: 'תנאי הבדיקה',
    cond_any: 'מספיק שאחד מהמצבים תקין (OR)',
    cond_all: 'כל המצבים חייבים להיות תקינים (AND)',
    ok_state: 'מצב תקין',
    default_fix: 'ברירת מחדל לתיקון',
    default_fix_star: 'ברירת מחדל לתיקון',
    remove_state: 'הסר מצב',
    attr_check: 'תכונה לבדיקה (אופציונלי)',
    no_attr: '-- ללא תכונה --',
    attr_val: 'ערך תקין לתכונה',
    custom_fix: 'שירות תיקון ייעודי (אופציונלי)',
    custom_fix_hint: 'דוגמה: {"service": "light.turn_on"}',
    prereq_entity: 'ישות תנאי מוקדם (אופציונלי)',
    prereq_state: 'מצב נדרש',
    prereq_hint: 'הפרדה בפסיקים או != לשלילה (למשל: !=off)',
    add_state: '+ הוסף מצב תקין נוסף',
    not_selected: 'לא נבחרה',
    every: 'כל',
    one_of: 'אחד מ',
    add_check: '+ הוספת בדיקה חדשה',
    loading: 'טעינת רכיבי עריכה של Home Assistant...',
    drag_here: 'העבר לכאן',
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Resolves a translation key using the language reported by the active Home
 * Assistant instance. Falls back to English when the user's language has no
 * entry in {@link TRANSLATIONS}.
 *
 * Use this function inside Lit components where `hass` is available as a
 * reactive property.
 *
 * @param hass - The active Home Assistant instance (may be `undefined` during
 *   the first render before HA injects the property).
 * @param key - A key that exists in the {@link TRANSLATIONS} map.
 * @param params - Optional named placeholders to interpolate into the string.
 *   Each `{key}` occurrence in the translated string is replaced by the
 *   corresponding value.
 * @returns The translated string, falling back to `key` if no translation
 *   exists in either the selected or the English locale.
 *
 * @example
 * ```ts
 * localize(this.hass, 'fix_all')
 * // → "Fix All" (en) | "תיקון הכל" (he)
 *
 * localize(this.hass, 'problems_found', { count: 3 })
 * // → "Found 3 problems" (en)
 * ```
 */
export function localize(
  hass: HomeAssistant | undefined,
  key: string,
  params?: Record<string, string | number>
): string {
  return _translate(hass?.language ?? 'en', key, params);
}

/**
 * Resolves a translation key **without** a `hass` instance. Uses
 * `navigator.language` (the browser locale) as the language source, making
 * it suitable for static contexts such as `window.customCards` registration
 * and {@link ChecklistCard.getStubConfig}, which run before Home Assistant
 * injects the `hass` property.
 *
 * Falls back to English when `navigator` is unavailable (e.g. SSR/tests) or
 * when the detected language has no entry in {@link TRANSLATIONS}.
 *
 * @param key - A key that exists in the {@link TRANSLATIONS} map.
 * @returns The translated string for the browser locale.
 *
 * @example
 * ```ts
 * localizeStatic('card_name')
 * // → "Checklist Card" (browser set to English)
 * // → "כרטיס בדיקות"  (browser set to Hebrew)
 * ```
 */
export function localizeStatic(key: string): string {
  const lang = (typeof navigator !== 'undefined' ? navigator.language : 'en')
    .split('-')[0]
    .toLowerCase();
  return _translate(lang, key);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Core translation resolver shared by {@link localize} and
 * {@link localizeStatic}.
 *
 * @param lang - BCP 47 primary language subtag (e.g. `"en"`, `"he"`).
 * @param key - Translation key.
 * @param params - Optional interpolation map.
 * @returns Translated and interpolated string.
 *
 * @internal
 */
function _translate(
  lang: string,
  key: string,
  params?: Record<string, string | number>
): string {
  const selectedLang = lang in TRANSLATIONS ? lang : 'en';
  let str = TRANSLATIONS[selectedLang][key] ?? TRANSLATIONS['en'][key] ?? key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
