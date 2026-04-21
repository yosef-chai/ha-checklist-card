/**
 * @file checklist-card-editor.styles.ts
 * @description Lit CSS styles for the ChecklistCardEditor component.
 *
 * Includes layout for the config form sections, individual check blocks,
 * and drag-and-drop visual feedback classes (`.dragging`, `.drop-target`).
 */

import { css } from 'lit';

export const editorStyles = css`
  .config-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: var(--primary-text-color);
  }

  .divider {
    height: 1px;
    background: var(--divider-color, rgba(0,0,0,0.12));
    margin: 8px 0;
  }

  .section-title {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .layout-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .check-item {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    background: var(--card-background-color);
  }

  .check-item.dragging {
    opacity: 0.5;
    border: 2px dashed var(--primary-color);
    background: var(--secondary-background-color);
  }

  .check-item.drop-target {
    border: 2px dashed var(--primary-color) !important;
    background: rgba(var(--rgb-primary-color, 0, 0, 255), 0.05) !important;
    position: relative;
  }

  .check-item.drop-target::before {
    content: attr(data-drop-text);
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary-color);
    color: var(--text-primary-color, white);
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 12px;
    white-space: nowrap;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .check-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .drag-handle {
    cursor: grab;
    font-size: 20px;
    color: var(--secondary-text-color);
    padding: 0 8px;
    display: flex;
    align-items: center;
  }

  .move-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--secondary-text-color);
    display: flex;
    align-items: center;
    padding: 4px;
  }
  .move-btn[disabled] {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .move-btn ha-icon {
    --mdc-icon-size: 20px;
  }

  .collapse-icon {
    cursor: pointer;
    margin-left: 12px;
    color: var(--secondary-text-color);
  }

  .check-header strong {
    font-size: 16px;
    font-weight: 500;
  }

  .remove-btn {
    background: transparent;
    color: var(--error-color, #f44336);
    border: 1px solid var(--error-color, #f44336);
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
  }
  .remove-btn:hover {
    background: rgba(var(--rgb-error-color, 244, 67, 54), 0.1);
  }

  .add-btn {
    background: transparent;
    color: var(--primary-color);
    border: 2px dashed var(--primary-color);
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    font-weight: 500;
    font-size: 15px;
    margin-top: 8px;
    transition: all 0.2s;
  }
  .add-btn:hover {
    background: rgba(var(--rgb-primary-color, 0, 0, 255), 0.05);
  }

  .json-hint {
    font-size: 12px;
    color: var(--secondary-text-color);
    font-family: monospace;
  }

  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .select-wrapper label {
    font-size: 13px;
    color: var(--secondary-text-color);
  }

  .select-wrapper select {
    width: 100%;
    padding: 10px 12px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    box-sizing: border-box;
    appearance: auto;
    transition: border-color 0.2s;
  }
  .select-wrapper select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }

  .conditions-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .condition-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--secondary-background-color, rgba(0,0,0,0.02));
  }

  .condition-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--divider-color);
    padding-bottom: 8px;
  }

  .condition-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .condition-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .remove-condition-btn {
    background: none;
    border: none;
    color: var(--error-color, #f44336);
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    padding: 4px;
  }
  .remove-condition-btn:hover { text-decoration: underline; }

  .default-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--secondary-text-color);
    cursor: pointer;
  }
  .default-label.is-default {
    color: var(--primary-color);
    font-weight: 500;
  }

  .add-condition-btn {
    background: none;
    border: 1px dashed var(--primary-color);
    color: var(--primary-color);
    border-radius: 8px;
    padding: 10px 12px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    transition: background-color 0.2s;
  }
  .add-condition-btn:hover {
    background: rgba(var(--rgb-primary-color, 0, 0, 255), 0.05);
  }

  .number-input {
    width: 100%;
    padding: 10px 12px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }
  .number-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }
`;
