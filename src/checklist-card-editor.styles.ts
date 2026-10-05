/**
 * @file checklist-card-editor.styles.ts
 * @description Lit CSS styles for the ChecklistCardEditor component.
 */
import { css } from 'lit';

export const editorStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 24px;
    color: var(--primary-text-color);
  }

  ha-form {
    display: block;
  }

  .loading {
    padding: 32px;
    text-align: center;
    color: var(--secondary-text-color);
  }

  .section-title {
    margin: 0 0 -8px;
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px 16px;
    border: 1px dashed var(--divider-color);
    border-radius: var(--ha-border-radius-lg, 12px);
    color: var(--secondary-text-color);
    text-align: center;
  }
  .empty-state p {
    margin: 0;
  }

  /* Tabbed check editor — same structure and class names as HA's
     hui-stack-card-editor (.toolbar / #editor / #card-options). */
  .toolbar {
    display: flex;
    align-items: center;
  }
  .toolbar ha-tab-group {
    flex-grow: 1;
    min-width: 0;
    --ha-tab-track-color: var(--card-background-color);
  }
  .toolbar ha-tab-group-tab.invalid {
    color: var(--error-color);
  }

  #editor {
    border: 1px solid var(--divider-color);
    padding: 12px;
  }
  @media (max-width: 450px) {
    #editor {
      margin: 0 -12px;
    }
  }

  #card-options {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
  #card-options .gui-mode-button {
    margin-inline-end: auto;
  }

  .delete-btn {
    color: var(--error-color);
  }

  .check-editor-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-top: 8px;
  }

  .conditions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .condition-item {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-border-radius-lg, 12px);
  }

  .condition-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 40px;
  }

  .condition-title {
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
  }

  .yaml-editor {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 8px;
  }
  .yaml-editor ha-yaml-editor {
    display: block;
    width: 100%;
  }
  .yaml-editor textarea {
    box-sizing: border-box;
    width: 100%;
    min-height: 280px;
    padding: 12px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-border-radius-md, 8px);
    background: var(--code-editor-background-color, var(--card-background-color));
    color: var(--primary-text-color);
    font-family: var(--ha-font-family-code, monospace);
    font-size: 13px;
    line-height: 1.5;
    resize: vertical;
  }
  .yaml-editor textarea:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .hint {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .yaml-error {
    color: var(--error-color);
    font-size: 12px;
  }
`;
