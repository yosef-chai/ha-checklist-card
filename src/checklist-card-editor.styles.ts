/**
 * @file checklist-card-editor.styles.ts
 * @description Lit CSS styles for the ChecklistCardEditor component.
 */
import { css } from 'lit';

export const editorStyles = css`
  .config-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 16px;
    color: var(--primary-text-color);
  }

  .divider {
    height: 1px;
    background: var(--divider-color, rgba(0, 0, 0, 0.12));
    margin: 8px 0;
  }

  .section-title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  ha-form {
    display: block;
  }

  ha-expansion-panel {
    display: block;
    border-radius: var(--ha-card-border-radius, 12px);
    --expansion-panel-content-padding: 0;
    --expansion-panel-summary-padding: 0 16px;
    margin-bottom: 8px;
  }

  ha-expansion-panel[outlined] {
    border: 1px solid var(--divider-color);
  }

  ha-expansion-panel .panel-content {
    padding: 12px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  ha-expansion-panel h3 {
    margin: 0;
    font-weight: 500;
    font-size: 14px;
    color: var(--primary-text-color);
  }

  ha-expansion-panel ha-svg-icon[slot="leading-icon"] {
    color: var(--secondary-text-color);
    margin-inline-end: 8px;
  }

  .panels {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* --- Tabbed check editor (HA hui-stack-card-editor pattern) ---
     Layout mirrors the official editor:
       <div class="check-toolbar">     <- maps to .toolbar
         <ha-tab-group/>               <- flex-grow tabs
         <ha-icon-button [+]/>         <- add button
       </div>
       <div class="check-editor">      <- maps to #editor (bordered)
         <div class="check-options">   <- maps to #card-options
           <prev/> <next/> <copy/> <delete/>
         </div>
         <check fields/>
       </div>
  */

  .check-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .check-toolbar ha-tab-group,
  .check-toolbar mwc-tab-bar {
    flex-grow: 1;
    min-width: 0;
    --ha-tab-track-color: var(--card-background-color);
  }

  .check-toolbar ha-tab-group-tab.invalid,
  .check-toolbar mwc-tab.invalid {
    color: var(--error-color);
    --mdc-tab-text-label-color-default: var(--error-color);
    --mdc-theme-primary: var(--error-color);
  }

  .check-editor {
    border: 1px solid var(--divider-color);
    padding: 12px;
  }

  @media (max-width: 450px) {
    .check-editor {
      margin: 0 -12px;
    }
  }

  .check-options {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
  }

  .check-options .gui-mode-button {
    margin-right: auto;
    margin-inline-end: auto;
    margin-inline-start: initial;
  }

  .check-options .delete-btn {
    color: var(--error-color);
  }

  .yaml-editor {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 8px;
  }

  .yaml-editor textarea {
    width: 100%;
    min-height: 280px;
    box-sizing: border-box;
    padding: 12px;
    background: var(--code-editor-background-color, var(--card-background-color));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 6px);
    font-family: var(--ha-font-family-code, monospace);
    font-size: 13px;
    line-height: 1.5;
    resize: vertical;
  }

  .yaml-editor textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }

  .yaml-editor ha-yaml-editor {
    display: block;
    width: 100%;
  }

  .yaml-hint {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .yaml-error {
    color: var(--error-color);
    font-size: 12px;
  }

  .check-editor-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 8px;
  }

  .empty-state {
    text-align: center;
    padding: 32px 16px;
    color: var(--secondary-text-color);
  }

  .advanced-block {
    padding: 12px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
    border: 1px solid var(--divider-color);
  }

  .advanced-summary {
    cursor: pointer;
    font-weight: 500;
  }

  .advanced-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;
  }

  .add-btn {
    margin-top: 16px;
  }

  /* --- Conditions section (per check) --- */

  .conditions-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-top: 8px;
  }

  .condition-item {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.02));
  }

  .condition-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--divider-color);
    padding-bottom: 12px;
  }

  .condition-title {
    font-size: 14px;
    font-weight: 500;
  }

  .condition-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .default-label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .prereq-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-color);
    margin-bottom: 8px;
  }

  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .select-wrapper label {
    font-size: 13px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }

  .select-wrapper select {
    width: 100%;
    padding: 12px 16px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 6px);
    font-size: 14px;
    cursor: pointer;
    box-sizing: border-box;
    appearance: auto;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .select-wrapper select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }

  .json-hint {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 4px;
  }
`;
