/**
 * @file types.ts
 * @description Shared TypeScript interfaces, types, and constants used across
 * the Checklist Card and its editor. Importing from this module is the single
 * source of truth for all data shapes exchanged with Home Assistant.
 */

import type { HassEntity } from 'home-assistant-js-websocket';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Minimum delay in milliseconds between consecutive service calls when fixing
 * multiple conditions in sequence (`conditions_mode: "all"`). Prevents race
 * conditions caused by firing several HA service calls simultaneously.
 */
export const DELAY_BETWEEN_SERVICES = 300;

// ---------------------------------------------------------------------------
// Home Assistant interfaces
// ---------------------------------------------------------------------------

/**
 * Minimal subset of the Home Assistant frontend object that the card requires.
 * The full `HomeAssistant` type from the HA frontend is not imported directly
 * to avoid a hard dependency on the HA source; only the properties the card
 * actually uses are declared here.
 */
export interface HomeAssistant {
  /** Live snapshot of every entity state, keyed by `entity_id`. */
  states: { [entityId: string]: HassEntity };

  /**
   * Calls a Home Assistant service.
   *
   * @param domain - The service domain (e.g. `"light"`, `"switch"`).
   * @param service - The service name (e.g. `"turn_on"`).
   * @param serviceData - Optional payload forwarded to the service.
   */
  callService(domain: string, service: string, serviceData?: Record<string, unknown>): Promise<void>;

  /** Active WebSocket connection to the HA backend. */
  connection: any;

  /** BCP 47 language tag currently selected in the HA UI (e.g. `"en"`, `"he"`). */
  language: string;

  /**
   * UI direction metadata. Present when the HA frontend has loaded translation
   * data; used to set the correct `dir` attribute for RTL language support.
   */
  translationMetadata?: {
    dir: 'rtl' | 'ltr';
  };
}

// ---------------------------------------------------------------------------
// Card configuration interfaces
// ---------------------------------------------------------------------------

/**
 * A single OK-state condition that must be satisfied for an entity to pass
 * its check. Multiple conditions can be combined within a {@link CheckRule}
 * using AND (`"all"`) or OR (`"any"`) logic.
 *
 * @example
 * ```yaml
 * # Basic state check
 * state: "on"
 *
 * # Attribute check
 * state: "on"
 * attribute: brightness
 * attribute_value: "255"
 *
 * # With a prerequisite (only evaluate when input_boolean.night_mode is "off")
 * state: "off"
 * prerequisite_entity: input_boolean.night_mode
 * prerequisite_state: "off"
 * ```
 */
export interface StateCondition {
  /**
   * The expected entity state string (e.g. `"on"`, `"off"`, `"locked"`).
   * Supports the dynamic `states('entity_id')` pattern to compare against
   * another entity's live state at evaluation time.
   */
  state: string;

  /**
   * Optional attribute name. When set, the condition evaluates
   * `entity.attributes[attribute]` instead of `entity.state`.
   */
  attribute?: string;

  /**
   * Expected value for {@link attribute}. Falls back to {@link state} when
   * omitted and an attribute name is provided.
   */
  attribute_value?: string;

  /**
   * Custom fix service override. Accepts two formats:
   * - `"domain.service"` — calls the service with `entity_id` as the only payload.
   * - `'{"service":"domain.service","data":{...}}'` — JSON string allowing
   *   arbitrary service data to be merged with `entity_id`.
   *
   * When omitted the card infers an appropriate service from the entity domain
   * via {@link getStandardServiceCall}.
   */
  fix_service?: string;

  /**
   * Optional entity whose state must match {@link prerequisite_state} (or
   * {@link prerequisite_attribute_value}) *before* this condition is evaluated.
   * When the prerequisite is **not** met, the condition is treated as already
   * satisfied (skipped), preventing spurious "fix" prompts.
   */
  prerequisite_entity?: string;

  /**
   * Required state of {@link prerequisite_entity}. Accepts a comma-separated
   * list for OR logic, and the `!=` prefix for negation (e.g. `"!=off"`).
   * Defaults to `"on"`.
   */
  prerequisite_state?: string;

  /**
   * Optional attribute of {@link prerequisite_entity} to evaluate instead of
   * its state.
   */
  prerequisite_attribute?: string;

  /**
   * Expected value of {@link prerequisite_attribute}. Accepts comma-separated
   * values and the `!=` negation prefix.
   */
  prerequisite_attribute_value?: string;
}

/**
 * A complete check rule that monitors a single HA entity against one or more
 * {@link StateCondition}s and provides a one-click fix action.
 *
 * @example
 * ```yaml
 * id: "my-check-1"
 * entity: switch.living_room
 * name: Living Room Switch
 * conditions_mode: any
 * default_condition_index: 0
 * conditions:
 *   - state: "off"
 * ```
 */
export interface CheckRule {
  /**
   * Stable unique identifier for this check. Generated automatically by
   * {@link ensureCheckId} if not provided in the raw YAML config; persisted
   * between renders to allow Lit's keyed `repeat` directive to diff correctly.
   */
  id: string;

  /** The `entity_id` of the HA entity to monitor. */
  entity: string;

  /**
   * Display name shown on the card row. Falls back to
   * `entity.attributes.friendly_name`, then `entity_id` when empty.
   */
  name: string;

  /**
   * One or more conditions that define what "OK" looks like for this entity.
   * At least one condition is required.
   */
  conditions: StateCondition[];

  /**
   * How multiple conditions are combined:
   * - `"any"` — at least one condition must pass (OR logic). A "Fix" button
   *   applies the condition at {@link default_condition_index}.
   * - `"all"` — every condition must pass (AND logic). Fix applies all failing
   *   conditions sequentially with a {@link DELAY_BETWEEN_SERVICES} gap.
   *
   * @defaultValue `"any"`
   */
  conditions_mode: 'any' | 'all';

  /**
   * Zero-based index into {@link conditions} that identifies which condition's
   * `state` / `fix_service` is used when the "Fix" button is pressed in
   * `"any"` mode. Ignored in `"all"` mode.
   *
   * @defaultValue `0`
   */
  default_condition_index: number;
}

/**
 * Layout configuration controlling how check-item rows are arranged inside
 * the card's scrollable list.
 */
export interface LayoutConfig {
  /**
   * Grid direction:
   * - `"columns"` — items flow top-to-bottom; `count` sets the number of
   *   equal-width columns (responsive grid).
   * - `"rows"` — items flow left-to-right; `count` sets the number of rows
   *   before wrapping to a new column (horizontal scrolling).
   */
  mode: 'columns' | 'rows';

  /**
   * Number of columns (when `mode` is `"columns"`) or rows (when `mode` is
   * `"rows"`). Valid range: 1–10.
   *
   * @defaultValue `1`
   */
  count: number;
}

/**
 * Top-level configuration object for the Checklist Card, matching the YAML
 * structure a user writes in their dashboard configuration.
 *
 * @example
 * ```yaml
 * type: custom:checklist-card
 * title: Evening Checklist
 * show_ok_items: false
 * layout:
 *   mode: columns
 *   count: 2
 * checks:
 *   - entity: switch.outdoor_lights
 *     conditions:
 *       - state: "off"
 * ```
 */
export interface CardConfig {
  /**
   * Must always be `"custom:checklist-card"`. Set automatically when using
   * the card picker or {@link ChecklistCard.getStubConfig}.
   */
  type: string;

  /**
   * Optional heading shown at the top of the card. Falls back to the
   * localized `"Checklist"` string when omitted.
   */
  title?: string;

  /**
   * The ordered list of entity checks displayed on the card.
   * At least one entry is required for a valid configuration.
   */
  checks: CheckRule[];

  /**
   * Optional layout configuration. Defaults to a single-column vertical list
   * when omitted.
   */
  layout?: LayoutConfig;

  /**
   * Controls visibility of entities that are currently in their OK state.
   * - `true` (default) — all entities are shown.
   * - `false` — only entities with problems are shown.
   *
   * @defaultValue `true`
   */
  show_ok_items?: boolean;
}
