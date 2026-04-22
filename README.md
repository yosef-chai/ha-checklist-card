# Checklist Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)
[![GitHub Release](https://img.shields.io/github/release/yosef-chai/ha-checklist-card.svg?style=for-the-badge)](https://github.com/yosef-chai/ha-checklist-card/releases)
[![GitHub Downloads](https://img.shields.io/github/downloads/yosef-chai/ha-checklist-card/total?style=for-the-badge)](https://github.com/yosef-chai/ha-checklist-card/releases)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[![Open your Home Assistant instance and add a custom repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=yosef-chai&repository=ha-checklist-card&category=lovelace)

A Lovelace custom card that monitors a list of entity states against expected values and surfaces any problems - with a single **Fix** or **Fix All** button to call the correct Home Assistant service automatically.

![Checklist Card preview](demo.png)

---

## Features

- **Convenient display** - a neat and clear list of each entity and its status
- **One-click fix** - fix a single item or click **Fix All** to remediate every problem at once, with a loading spinner while the service call is in progress
- **Smart auto-fix** - the card infers the correct HA service for lights, switches, locks, covers, climate, selects, numbers, vacuums, and more
- **Custom fix services** - override auto-fix with any service call and arbitrary service data
- **Multi-condition checks** - combine conditions with AND / OR logic per entity
- **Prerequisite guards** - skip a check automatically when a prerequisite entity is not in the expected state
- **Flexible layout** - vertical columns or horizontal rows, configurable count; supports the Lovelace Sections (grid) view
- **Hide OK items** - keep the card compact by showing only entities with problems
- **Visual UI editor** - configure everything from the dashboard without writing YAML

---

## Installation

### HACS (recommended)

1. Open HACS in your Home Assistant instance.
2. Go to **Frontend** → click the menu (⋯) → **Custom repositories**.
3. Add `https://github.com/yosef-chai/ha-checklist-card` with category **Lovelace**.
4. Search for **Checklist Card** and click **Download**.
5. Reload your browser.

Or click the button above to open the repository directly in HACS.

> **HACS 2026 storage mode:** if your dashboards run in storage mode (the default), HACS registers the resource automatically — no manual step needed. For YAML-only dashboards see the manual instructions below.

### Manual

1. Download `checklist-card.js` from the [latest release](https://github.com/yosef-chai/ha-checklist-card/releases/latest).
2. Copy it to `config/www/checklist-card.js`.
3. Add the resource to your dashboard:

   **Via UI:** Settings → Dashboards → ⋯ → Resources → Add resource
   ```
   URL:  /local/checklist-card.js
   Type: JavaScript module
   ```

   **Via YAML:**
   ```yaml
   lovelace:
     resources:
       - url: /local/checklist-card.js?v=2.0.0
         type: module
   ```

---

## Configuration

### Minimal example

```yaml
type: custom:checklist-card
title: Checklist
checks:
  - entity: climate.home
    name: Air conditioner
    conditions:
      - state: cool
```

### Full example

```yaml
type: custom:checklist-card                         # [Required] Card type
title: Checklist                                    # Card title
show_ok_section: inline                             # 'inline' | 'collapsed' | 'hidden'
sort: status                                        # See "Card options" below
sort_direction: asc                                 # 'asc' | 'desc'
layout:                                             # Card layout configuration
  mode: columns                                     # Display layout: 'columns' or 'rows'
  count: 1                                          # Number of columns/rows (Range: 1-10)
checks:                                             # [Required] Array of entities and checks
  - entity: climate.home                            # [Required] Entity identifier (entity_id)
    name: Air conditioner                           # Alternative display name for the card
    severity: warning                               # 'info' | 'warning' | 'critical' (affects Fix All order)
    icon: mdi:air-conditioner                       # Optional mdi icon override
    color: '#1976d2'                              # Optional name color
    show_last_changed: true                         # Show relative last-changed time next to name
    conditions_mode: any                            # Condition evaluation logic: 'any' (OR) or 'all' (AND)
    default_condition_index: 0                      # In 'any' mode: which condition supplies the fix
    confirmation: true                              # Confirm before fixing (boolean or { text, exemptions: [{ user }] })
    fix_action: { action: fix }                     # Default 'fix' runs the auto/custom fix; swap for navigate/url/toggle/...
    conditions:                                     # [Required] Array of validation conditions
      - state: cool                                 # [Required] Expected valid state of the entity
      - state: heat                                 # Additional expected valid state of the entity
        attribute: fan_mode                         # Expected valid attribute of the entity
        attribute_value: medium                     # Expected valid value of the attribute
        prerequisite_entity: climate.home           # Prerequisite entity to execute the check
        prerequisite_state: cool                    # Required state for the prerequisite entity
        fix_service: '{"perform_action":"climate.set_temperature","data":{"temperature":22}}'
```

---

### Card options

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | string | **required** | `custom:checklist-card` |
| `title` | string | `"Checklist"` | Heading shown at the top of the card |
| `checks` | list | **required** | Ordered list of [check rules](#check-rule-options) |
| `show_ok_section` | `inline` \| `collapsed` \| `hidden` | `inline` | How to show OK entities: mixed with problems, behind a toggle, or hide them entirely |
| `sort` | `manual` \| `status` \| `alphabetical` \| `domain` \| `severity` \| `last_changed` | `manual` | Order of the items inside the card |
| `sort_direction` | `asc` \| `desc` | `asc` | Sort direction for every mode (including `manual`, which just reverses the list) |
| `layout` | object | - | [Layout configuration](#layout-options) |

### Check rule options

| Option | Type | Default | Description |
|---|---|---|---|
| `entity` | string | **required** | `entity_id` of the entity to monitor |
| `name` | string | friendly name | Display name shown on the card row |
| `conditions` | list | **required** | One or more [state conditions](#condition-options) that define "OK" |
| `conditions_mode` | `any` \| `all` | `any` | `any` - at least one condition passes (OR); `all` - every condition must pass (AND) |
| `default_condition_index` | number | `0` | In `any` mode: index of the condition whose fix action is used when **Fix** is pressed |
| `severity` | `info` \| `warning` \| `critical` | `info` | Used by **Fix All** ordering and the `severity` sort mode |
| `icon` | string | - | Override the entity icon (e.g. `mdi:alert`) |
| `color` | string | - | CSS color for the entity name |
| `show_last_changed` | boolean | `false` | Show an `ha-relative-time` next to the entity name |
| `tap_action` | [action][ha-action] | `more-info` | Action on tap (on the row body, not the Fix button) |
| `hold_action` | [action][ha-action] | `more-info` | Action on long-press |
| `double_tap_action` | [action][ha-action] | `none` | Action on double-tap |
| `fix_action` | [action][ha-action] | `{ action: fix }` | What the **Fix** button does. Default `fix` runs the auto-fix pipeline; any other action type replaces it |
| `confirmation` | boolean \| `{ text?, exemptions?: [{ user }] }` | `false` | Ask before firing **Fix**; users in `exemptions` skip the prompt |

[ha-action]: https://www.home-assistant.io/dashboards/actions/

### Condition options

| Option | Type | Default | Description |
|---|---|---|---|
| `state` | string | **required** | Expected entity state (e.g. `"off"`, `"locked"`, `"heat"`). Supports `states('entity_id')` to compare against another entity's live state |
| `attribute` | string | - | Attribute name to check instead of the entity state |
| `attribute_value` | string | same as `state` | Expected attribute value (when `attribute` is set). Also supports `states('entity_id')` |
| `fix_service` | string | auto | Custom fix service. Simple form: `"domain.service"`. Extended form accepts JSON with `perform_action` (preferred) or legacy `service`, plus `data`, `service_data`, `target`, e.g. `'{"perform_action":"light.turn_on","data":{"brightness":255}}'` |
| `prerequisite_entity` | string | - | Skip this condition unless the prerequisite entity meets its required state |
| `prerequisite_state` | string | `"on"` | Required state of `prerequisite_entity`. Comma-separated for OR; prefix `!=` for negation (e.g. `"!=off"`) |
| `prerequisite_attribute` | string | - | Attribute of `prerequisite_entity` to evaluate instead of its state |
| `prerequisite_attribute_value` | string | - | Required value for `prerequisite_attribute`. Supports comma-separated OR and `!=` negation |

### Layout options

| Option | Type | Default | Description |
|---|---|---|---|
| `mode` | `columns` \| `rows` | `columns` | `columns` - vertical scrolling grid; `rows` - horizontal scrolling grid |
| `count` | number | `1` | Number of columns (in `columns` mode) or rows (in `rows` mode). Range: 1–10 |

---

## Supported domains (auto-fix)

When no `fix_service` is specified the card picks the correct service automatically:

| Domain | Fix service |
|---|---|
| `light`, `switch`, `input_boolean`, `fan` | `turn_on` / `turn_off` |
| `lock` | `lock` / `unlock` |
| `cover` | `open_cover` / `close_cover` |
| `climate` | `set_hvac_mode` (with `hvac_mode` in service data) |
| `select`, `input_select` | `select_option` (with `option` in service data) |
| `number`, `input_number` | `set_value` (with `value` in service data) |
| `vacuum` | `start` / `return_to_base` |
| everything else | `turn_on` / `turn_off` |

> **Note:** For `light` entities with a `brightness` attribute condition the card automatically passes `brightness` in the service data when calling `light.turn_on`.

---

## Translations

The active language is detected automatically from the Home Assistant UI language setting.

### Currently supported languages

| Code | Language |
|---|---|
| `en` | English |
| `he` | Hebrew (עברית) - RTL |

### Adding a new language

1. Open [`src/localize.ts`](src/localize.ts).
2. Copy the `en` block and add a new top-level key using the [BCP 47 primary language subtag](https://www.iana.org/assignments/language-subtag-registry) (e.g. `"de"` for German).
3. Translate every string value.
4. Run `npm run build` and submit a pull request.

```ts
const TRANSLATIONS = {
  en: { /* ... */ },
  he: { /* ... */ },
  de: {
    card_name: 'Checklisten-Karte',
    all_good: 'Alles in Ordnung!',
    // ... all other keys
  },
};
```

---

## Development

```bash
# Install dependencies
npm install

# Build (type-check + bundle)
npm run build

# Output: dist/checklist-card.js
```

The project uses **Lit 3** web components and **Vite** in library mode. TypeScript strict mode is enabled.

### Project structure

```
src/
  index.ts                        Entry point + window.customCards registration
  types.ts                        TypeScript interfaces and constants
  localize.ts                     i18n module
  utils.ts                        Pure utility functions
  checklist-card.ts               Main card component
  checklist-card.styles.ts        Card CSS
  checklist-card-editor.ts        Visual editor component
  checklist-card-editor.styles.ts Visual editor CSS
```

---

## License

MIT - see [LICENSE](LICENSE).
