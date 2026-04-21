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

  /* Basic grid for sections with multiple controls */
  .layout-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
    align-items: center;
  }

  .check-item {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--card-background-color);
    transition: box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
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
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary-color);
    color: var(--text-primary-color, white);
    font-size: 12px;
    font-weight: 500;
    padding: 6px 16px;
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

  .check-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .drag-handle {
    cursor: grab;
    color: var(--secondary-text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .drag-handle ha-icon {
    --mdc-icon-size: 24px;
  }

  .check-header strong {
    font-size: 16px;
    font-weight: 500;
    margin-left: 8px;
  }

  .add-btn {
    margin-top: 16px;
  }

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
