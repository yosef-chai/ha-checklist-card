import type { HassEntity } from 'home-assistant-js-websocket';
import type { CheckRule, HomeAssistant, StateCondition } from './types';

export function evaluateExpectedState(hass: HomeAssistant, expected: string): string {
  if (!expected || !expected.includes('states(')) return expected;
  try {
    const match = expected.match(/states\(['"]([^'"]+)['"]\)/);
    if (match?.[1] && hass.states[match[1]]) {
      return hass.states[match[1]].state;
    }
  } catch (e) {
    console.warn('Error parsing expected pattern', e);
  }
  return expected;
}

export function checkCondition(hass: HomeAssistant, stateObj: HassEntity, condition: StateCondition): boolean {
  if (condition.prerequisite_entity?.trim()) {
    const prereqObj = hass.states[condition.prerequisite_entity];
    if (prereqObj) {
      let prereqMet: boolean;

      if (condition.prerequisite_attribute?.trim()) {
        const attrValue = prereqObj.attributes?.[condition.prerequisite_attribute];
        let expected = condition.prerequisite_attribute_value?.trim()
          ? condition.prerequisite_attribute_value
          : condition.prerequisite_state || 'on';
        expected = evaluateExpectedState(hass, expected);

        if (expected.startsWith('!=')) {
          const denied = expected.slice(2).split(',').map(s => s.trim());
          prereqMet = attrValue !== undefined && !denied.includes(String(attrValue));
        } else {
          const allowed = expected.split(',').map(s => s.trim());
          prereqMet = attrValue !== undefined && allowed.includes(String(attrValue));
        }
      } else {
        let expected = condition.prerequisite_state || 'on';
        expected = evaluateExpectedState(hass, expected);

        if (expected.startsWith('!=')) {
          const denied = expected.slice(2).split(',').map(s => s.trim());
          prereqMet = !denied.includes(prereqObj.state);
        } else {
          const allowed = expected.split(',').map(s => s.trim());
          prereqMet = allowed.includes(prereqObj.state);
        }
      }

      // Prerequisite not met → condition is satisfied (don't prompt fix for skipped checks).
      if (!prereqMet) return true;
    }
  }

  const currentState = stateObj.state;
  if (currentState === 'unavailable' || currentState === 'unknown') return false;

  if (condition.attribute?.trim()) {
    const attrValue = stateObj.attributes?.[condition.attribute];
    const expectedAttrValue = evaluateExpectedState(
      hass,
      condition.attribute_value?.trim() ? condition.attribute_value : condition.state
    );
    return attrValue !== undefined && String(attrValue) === String(expectedAttrValue);
  }

  return currentState === evaluateExpectedState(hass, condition.state);
}

export function isRuleProblem(hass: HomeAssistant, rule: CheckRule): boolean {
  if (!rule.entity) return false;
  const stateObj = hass.states[rule.entity];
  if (!stateObj) return true;

  const results = rule.conditions.map(c => checkCondition(hass, stateObj, c));
  return rule.conditions_mode === 'all' ? !results.every(Boolean) : !results.some(Boolean);
}
