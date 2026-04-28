import type { HassEntity } from 'home-assistant-js-websocket';

// Minimum ms gap between consecutive service calls to avoid HA race conditions.
export const DELAY_BETWEEN_SERVICES = 300;

export type Severity = 'info' | 'warning' | 'critical';

export type SortMode =
  | 'manual'
  | 'status'
  | 'alphabetical'
  | 'domain'
  | 'severity'
  | 'last_changed';

export type ShowOkSection = 'inline' | 'collapsed' | 'hidden';

export interface AreaRegistryEntry {
  area_id: string;
  name: string;
  icon?: string;
  picture?: string;
  floor_id?: string;
}

export interface EntityRegistryEntry {
  entity_id: string;
  area_id?: string;
  device_id?: string;
  labels?: string[];
  hidden_by?: string | null;
  disabled_by?: string | null;
}

export interface DeviceRegistryEntry {
  id: string;
  name?: string | null;
  name_by_user?: string | null;
  area_id?: string | null;
  manufacturer?: string | null;
  model?: string | null;
}

export interface HomeAssistant {
  states: { [entityId: string]: HassEntity };
  entities?: { [entityId: string]: EntityRegistryEntry };
  areas?: { [areaId: string]: AreaRegistryEntry };
  devices?: { [deviceId: string]: DeviceRegistryEntry };
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: { entity_id?: string | string[]; device_id?: string | string[]; area_id?: string | string[] }
  ): Promise<void>;
  callWS<T = unknown>(msg: Record<string, unknown>): Promise<T>;
  connection: any;
  language: string;
  translationMetadata?: {
    dir: 'rtl' | 'ltr';
  };
  user?: {
    id: string;
    name: string;
    is_admin?: boolean;
    is_owner?: boolean;
  };
}

export interface SnoozeData {
  [ruleId: string]: number; // expiry timestamp in ms
}

export interface ConfirmationConfig {
  text?: string;
  exemptions?: { user: string }[];
}

export interface ActionConfig {
  action:
  | 'more-info'
  | 'navigate'
  | 'url'
  | 'toggle'
  | 'call-service'
  | 'perform-action'
  | 'assist'
  | 'none'
  | 'fix';
  navigation_path?: string;
  url_path?: string;
  service?: string;
  perform_action?: string;
  data?: Record<string, unknown>;
  service_data?: Record<string, unknown>;
  target?: {
    entity_id?: string | string[];
    device_id?: string | string[];
    area_id?: string | string[];
  };
  confirmation?: boolean | ConfirmationConfig;
  pipeline_id?: string;
  start_listening?: boolean;
}

export interface StateCondition {
  state: string;
  attribute?: string;
  attribute_value?: string;
  fix_service?: string;
  prerequisite_entity?: string;
  prerequisite_state?: string;
  prerequisite_attribute?: string;
  prerequisite_attribute_value?: string;
}

export interface CheckRule {
  id: string;
  entity: string;
  name: string;
  conditions: StateCondition[];
  conditions_mode: 'any' | 'all';
  default_condition_index: number;
  severity?: Severity;
  icon?: string;
  color?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  fix_action?: ActionConfig;
  confirmation?: boolean | ConfirmationConfig;
  show_last_changed?: boolean;
}

export interface LayoutConfig {
  mode: 'columns' | 'rows';
  count: number;
}

export interface CardConfig {
  type: string;
  title?: string;
  checks: CheckRule[];
  layout?: LayoutConfig;
  sort?: SortMode;
  sort_direction?: 'asc' | 'desc';
  show_ok_section?: ShowOkSection;
  tap_action?: ActionConfig;
  text_mode?: 'clip' | 'scroll';
}
