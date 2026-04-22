import type { CardConfig, CheckRule, StateCondition } from './types';

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

export function makeEmptyCondition(): StateCondition {
  return { state: 'off', attribute: '', attribute_value: '', fix_service: '' };
}

export function ensureDefaults(config: Partial<CardConfig>): CardConfig {
  const newConfig = { ...config } as CardConfig;

  if (!newConfig.show_ok_section) {
    newConfig.show_ok_section = 'inline';
  }

  if (!newConfig.sort) newConfig.sort = 'manual';
  if (!newConfig.sort_direction) newConfig.sort_direction = 'asc';

  return newConfig;
}

export interface ServiceCallResult {
  service: string;
  serviceData: Record<string, unknown>;
  domain?: string;
}

export function getStandardServiceCall(
  domain: string,
  expected: string,
  condition?: StateCondition
): ServiceCallResult {
  let service = '';
  let serviceData: Record<string, unknown> = {};

  if (condition?.attribute?.trim()) {
    const attrVal = expected;
    const numVal = parseFloat(attrVal);

    if (domain === 'light') {
      service = 'turn_on';
      if (condition.attribute === 'brightness' || condition.attribute === 'brightness_pct') {
        if (!isNaN(numVal)) serviceData[condition.attribute] = numVal;
      } else if (['color_temp', 'color_temp_kelvin', 'effect'].includes(condition.attribute)) {
        serviceData[condition.attribute] = condition.attribute === 'effect' ? attrVal : numVal;
      }
      return { service, serviceData };
    }

    if (domain === 'climate') {
      if (condition.attribute === 'temperature' && !isNaN(numVal)) {
        return { service: 'set_temperature', serviceData: { temperature: numVal } };
      }
      if (condition.attribute === 'fan_mode') return { service: 'set_fan_mode', serviceData: { fan_mode: attrVal } };
      if (condition.attribute === 'preset_mode') return { service: 'set_preset_mode', serviceData: { preset_mode: attrVal } };
      if (condition.attribute === 'swing_mode') return { service: 'set_swing_mode', serviceData: { swing_mode: attrVal } };
    }

    if (domain === 'water_heater' && condition.attribute === 'temperature' && !isNaN(numVal)) {
      return { service: 'set_temperature', serviceData: { temperature: numVal } };
    }

    if (domain === 'humidifier') {
      if (condition.attribute === 'humidity' && !isNaN(numVal)) {
        return { service: 'set_humidity', serviceData: { humidity: numVal } };
      }
      if (condition.attribute === 'mode') {
        return { service: 'set_mode', serviceData: { mode: attrVal } };
      }
    }

    if (domain === 'media_player') {
      if (condition.attribute === 'volume_level' && !isNaN(numVal)) {
        return { service: 'volume_set', serviceData: { volume_level: numVal } };
      }
      if (condition.attribute === 'source') {
        return { service: 'select_source', serviceData: { source: attrVal } };
      }
    }
  }

  switch (domain) {
    case 'switch':
    case 'light':
    case 'input_boolean':
    case 'fan':
    case 'siren':
    case 'remote':
    case 'automation':
    case 'script':
    case 'camera':
    case 'group':
      service = expected === 'off' ? 'turn_off' : 'turn_on';
      break;

    case 'lock':
      if (expected === 'unlocked') service = 'unlock';
      else if (expected === 'open') service = 'open';
      else service = 'lock';
      break;

    case 'cover':
      if (expected === 'open') service = 'open_cover';
      else if (expected === 'closed') service = 'close_cover';
      else if (expected === 'stopped') service = 'stop_cover';
      else if (!isNaN(parseFloat(expected))) {
        service = 'set_cover_position';
        serviceData.position = parseFloat(expected);
      } else {
        service = expected === 'off' ? 'close_cover' : 'open_cover';
      }
      break;

    case 'valve':
      if (expected === 'open') service = 'open_valve';
      else if (expected === 'closed') service = 'close_valve';
      else if (!isNaN(parseFloat(expected))) {
        service = 'set_valve_position';
        serviceData.position = parseFloat(expected);
      } else {
        service = expected === 'off' ? 'close_valve' : 'open_valve';
      }
      break;

    case 'climate':
      service = 'set_hvac_mode';
      serviceData.hvac_mode = expected;
      break;

    case 'water_heater':
      service = 'set_operation_mode';
      serviceData.operation_mode = expected;
      break;

    case 'humidifier':
      service = expected === 'off' ? 'turn_off' : 'turn_on';
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

    case 'text':
    case 'input_text':
      service = 'set_value';
      serviceData.value = expected;
      break;

    case 'datetime':
    case 'input_datetime':
    case 'date':
    case 'time':
      service = 'set_datetime';
      serviceData.datetime = expected;
      break;

    case 'counter':
      if (expected === 'increment' || expected === 'decrement') {
        service = expected;
      } else {
        service = 'set_value';
        serviceData.value = parseInt(expected, 10);
      }
      break;

    case 'timer':
      if (expected === 'active') service = 'start';
      else if (expected === 'paused') service = 'pause';
      else service = 'cancel';
      break;

    case 'button':
    case 'input_button':
      service = 'press';
      break;

    case 'scene':
      service = 'turn_on';
      break;

    case 'vacuum':
      if (['docked', 'returning'].includes(expected)) service = 'return_to_base';
      else if (['cleaning', 'running'].includes(expected)) service = 'start';
      else if (expected === 'paused') service = 'pause';
      else service = 'stop';
      break;

    case 'alarm_control_panel':
      if (expected === 'armed_home') service = 'alarm_arm_home';
      else if (expected === 'armed_away') service = 'alarm_arm_away';
      else if (expected === 'armed_night') service = 'alarm_arm_night';
      else if (expected === 'armed_vacation') service = 'alarm_arm_vacation';
      else if (expected === 'armed_custom_bypass') service = 'alarm_arm_custom_bypass';
      else service = 'alarm_disarm';
      break;

    case 'media_player':
      if (expected === 'playing') service = 'media_play';
      else if (expected === 'paused') service = 'media_pause';
      else if (expected === 'idle') service = 'media_stop';
      else service = expected === 'off' ? 'turn_off' : 'turn_on';
      break;

    case 'notify':
      service = 'send_message';
      serviceData.message = expected;
      break;

    case 'lawn_mower':
      if (expected === 'mowing') service = 'start_mowing';
      else if (expected === 'docked') service = 'dock';
      else if (expected === 'paused') service = 'pause';
      else service = 'start_mowing';
      break;

    default:
      service = expected === 'off' ? 'turn_off' : 'turn_on';
  }

  return { service, serviceData };
}
