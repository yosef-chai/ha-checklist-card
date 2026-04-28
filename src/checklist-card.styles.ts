/**
 * @file checklist-card.styles.ts
 * @description Lit CSS styles for the ChecklistCard component.
 */

import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
    container-type: inline-size;
    font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
    height: 100%;
  }

  ha-card {
    padding: 16px;
    box-sizing: border-box;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
  }

  .subtitle {
    font-size: 14px;
    color: var(--secondary-text-color);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
  }

  .title.overflowing .marquee-inner,
  .subtitle.overflowing .marquee-inner {
    display: inline-block;
    padding-inline-end: 2em;
  }

  :host(.marquee-enabled) .title.overflowing .marquee-inner,
  :host(.marquee-enabled) .subtitle.overflowing .marquee-inner {
    animation: marquee-scroll 8s linear infinite;
  }

  :host(.marquee-enabled[dir="rtl"]) .title.overflowing .marquee-inner,
  :host(.marquee-enabled[dir="rtl"]) .subtitle.overflowing .marquee-inner {
    animation: marquee-scroll-rtl 8s linear infinite;
  }

  @keyframes marquee-scroll {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }

  @keyframes marquee-scroll-rtl {
    0% { transform: translateX(0%); }
    100% { transform: translateX(50%); }
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
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .check-list::-webkit-scrollbar { width: 6px; }
  .check-list::-webkit-scrollbar-track { background: transparent; }
  .check-list::-webkit-scrollbar-thumb { background-color: var(--divider-color); border-radius: 3px; }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-inline-start: auto;
  }

  .ok-toggle-btn {
    background-color: transparent;
    color: var(--secondary-text-color);
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: background-color 0.2s;
    white-space: nowrap;
  }
  .ok-toggle-btn:hover {
    background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
  }
  .ok-toggle-btn ha-icon {
    --mdc-icon-size: 18px;
    color: var(--success-color, #4caf50);
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

  @container (max-width: 450px) {
    .header { flex-direction: column; align-items: flex-start; }
    .fix-all-btn { width: 100%; margin-top: 8px; }
  }

  /* Snooze count badge in subtitle */
  .snooze-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    margin-inline-start: 6px;
    color: #e59b2dff;
    font-size: 13px;
  }

  .snooze-dialog-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 4px;
    min-width: 260px;
  }

  .snooze-dialog-entity {
    font-weight: 600;
    font-size: 15px;
    color: var(--primary-text-color);
  }

  .snooze-dialog-desc {
    margin: 0;
    font-size: 13px;
    color: var(--secondary-text-color);
  }

  .snooze-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .snooze-preset-btn {
    background-color: var(--secondary-background-color, rgba(0,0,0,0.06));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
    border-radius: 16px;
    padding: 6px 14px;
    font-size: 13px;
    cursor: pointer;
    transition: background-color 0.15s;
  }
  .snooze-preset-btn:hover:not([disabled]) {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
  .snooze-preset-btn[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .snooze-custom-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .snooze-custom-input {
    flex: 1;
    border: 1px solid var(--divider-color, rgba(0,0,0,0.2));
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 13px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    min-width: 0;
  }
  .snooze-custom-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;
