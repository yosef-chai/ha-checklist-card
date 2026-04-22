/**
 * @file checklist-card.styles.ts
 * @description Lit CSS styles for the ChecklistCard component.
 *
 * Styles intentionally avoid overriding `ha-card` background, border, or
 * box-shadow so the card inherits the active HA theme in both the dashboard
 * view and the editor preview panel.
 */

import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
    /* Enable container queries so layout adapts to the card's own width,
       not the viewport — critical for Lovelace grid where cards can be
       narrow or wide regardless of screen size. */
    container-type: inline-size;
    font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
    /* Fill the full height of the grid cell in the sections view. */
    height: 100%;
  }

  ha-card {
    padding: 16px;
    box-sizing: border-box;
    /* Flex column so the check-list stretches to fill remaining card height
       in the sections (grid) view while still growing naturally in masonry. */
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--secondary-background-color);
    transition: background-color 0.3s ease;
  }
  .status-icon ha-icon { --mdc-icon-size: 24px; }

  .status-icon.success {
    background-color: rgba(var(--rgb-success-color, 76, 175, 80), 0.15);
    color: var(--success-color, #4caf50);
  }
  .status-icon.error {
    background-color: rgba(var(--rgb-error-color, 244, 67, 54), 0.15);
    color: var(--error-color, #f44336);
  }

  .title {
    color: var(--ha-card-header-color, var(--primary-text-color));
    font-family: var(--ha-card-header-font-family, inherit);
    font-size: var(--ha-card-header-font-size, 20px);
    font-weight: 500;
    letter-spacing: -0.012em;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 14px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  .fix-all-btn {
    background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    transition: opacity 0.2s;
  }
  .fix-all-btn:hover:not([disabled]) {
    opacity: 0.8;
  }

  .check-list {
    padding: 4px;
    /* Grow to fill whatever height ha-card has (sections grid), and scroll
       when content overflows. min-height: 0 lets a flex child shrink below
       its intrinsic size so the parent's height constraint is respected. */
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .check-list::-webkit-scrollbar { width: 6px; }
  .check-list::-webkit-scrollbar-track { background: transparent; }
  .check-list::-webkit-scrollbar-thumb { background-color: var(--divider-color); border-radius: 3px; }

  .check-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-radius: var(--ha-card-border-radius, 12px);
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    gap: 12px;
    transition: all 0.2s;
  }

  .entity-info-container {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .icon-wrapper.problem {
    background-color: rgba(var(--rgb-disabled-color, 97, 97, 97), 0.35);
  }
  .icon-wrapper.ok {
    background-color: rgba(var(--rgb-success-color, 46, 125, 50), 0.5);
  }

  .entity-icon {
    color: var(--state-icon-color, var(--primary-text-color));
    --mdc-icon-size: 24px;
  }
  .icon-wrapper.problem .entity-icon {
    color: var(--disabled-text-color, #a9a7a7ff);
  }
  .icon-wrapper.ok .entity-icon {
    color: var(--success-color, #2e7d32);
  }

  .check-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
  }

  .entity-name {
    font-size: 15px;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  .entity-state {
    font-size: 13px;
    color: var(--secondary-text-color);
    line-height: 1.2;
  }

  .ok-badge {
    font-size: 14px;
    color: var(--success-color, #2e7d32);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  button.fix-btn {
    background-color: #feb847ff;
    color: #fff;
    border: none;
    padding: 6px 16px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    transition: opacity 0.2s;
    min-width: 60px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }

  button.fix-btn:hover:not([disabled]) {
    opacity: 0.8;
  }

  button.fix-btn[disabled], .fix-all-btn[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .spinner {
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    border: 2px solid currentColor;
    border-radius: 50%;
    border-left-color: transparent;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Container query: responds to the card's own width, not the viewport.
     This fires correctly whether the card is narrow because of screen size
     OR because it sits in a small grid column. */
  @container (max-width: 450px) {
    .header { flex-direction: column; align-items: flex-start; }
    .fix-all-btn { width: 100%; margin-top: 8px; }
    .check-item { flex-direction: column; align-items: flex-start; gap: 16px; }
    .fix-btn { width: 100%; }
  }
`;
