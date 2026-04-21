/**
 * @file utils.ts
 * @description Pure utility functions shared between the Checklist Card
 * component and its visual editor. All functions in this module are
 * side-effect-free and do not depend on Lit or the DOM.
 */

import type { CheckRule, StateCondition } from './types';

// ---------------------------------------------------------------------------
// Config helpers
// ---------------------------------------------------------------------------

/**
 * Normalises a raw (potentially partial) check rule object read from YAML
 * configuration into a fully populated {@link CheckRule}.
 */
export function ensureCheckId(check: Partial<CheckRule>): CheckRule {
  return {
    ...check,
    id: check.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    entity: check.entity || '',
    name: check.name || '',
    conditions_mode: check.conditions_mode || 'any',
    default_condition_index: check.default_condition_index ?? 0,
    conditions: check.conditions || [],
  };
}

/**
 * Creates a blank {@link StateCondition} with all optional fields set to
 * empty strings. Used as the initial condition when the user adds a new
 * check or an extra condition through the visual editor.
 *
 * @returns A new, empty `StateCondition` with `state` defaulting to `"off"`.
 */
export function makeEmptyCondition(): StateCondition {
  return { state: 'off', attribute: '', attribute_value: '', fix_service: '' };
}

// ---------------------------------------------------------------------------
// Service-call helpers
// ---------------------------------------------------------------------------

/**
 * Maps an entity domain and its expected target state to the correct
 * Home Assistant service name and any required service data payload.
 *
 * This is the card's "auto-fix" logic — when no custom `fix_service` is
 * configured, the card calls this function to determine which service to
 * invoke. Domain-specific mappings are listed below; all other domains fall
 * back to `turn_on` / `turn_off`.
 *
 * | Domain | Service(s) |
 * |---|---|
 * | `light`, `switch`, `input_boolean`, `fan` | `turn_on` / `turn_off` |
 * | `lock` | `lock` / `unlock` |
 * | `cover` | `open_cover` / `close_cover` |
 * | `climate` | `set_hvac_mode` (data: `hvac_mode`) |
 * | `select`, `input_select` | `select_option` (data: `option`) |
 * | `number`, `input_number` | `set_value` (data: `value`) |
 * | `vacuum` | `return_to_base` / `start` |
 *
 * @param domain - The entity domain extracted from `entity_id`
 *   (e.g. `"light"`, `"lock"`).
 * @param expected - The target state string the entity should be set to
 *   (e.g. `"on"`, `"locked"`, `"heat"`).
 * @returns An object containing:
 *   - `service` — the HA service name to call (without domain prefix).
 *   - `serviceData` — additional key/value pairs to include in the service
 *     call payload alongside `entity_id`.
 */
export function getStandardServiceCall(
  domain: string,
  expected: string
): { service: string; serviceData: Record<string, unknown> } {
  let service = '';
  let serviceData: Record<string, unknown> = {};

  switch (domain) {
    case 'switch':
    case 'light':
    case 'input_boolean':
    case 'fan':
      service = expected === 'off' ? 'turn_off' : 'turn_on';
      break;
    case 'lock':
      service = expected === 'unlocked' ? 'unlock' : 'lock';
      break;
    case 'cover':
      service = expected === 'open' ? 'open_cover' : 'close_cover';
      break;
    case 'climate':
      service = 'set_hvac_mode';
      serviceData.hvac_mode = expected;
      break;
    case 'select':
    case 'input_select':
      service = 'select_option';
      serviceData.option = expected;
      break;
    case 'number':
    case 'input_number':
      service = 'set_value';
      serviceData.value = parseFloat(expected);
      break;
    case 'vacuum':
      service = ['docked', 'returning'].includes(expected) ? 'return_to_base' : 'start';
      break;
    default:
      service = expected === 'off' ? 'turn_off' : 'turn_on';
  }

  return { service, serviceData };
}
