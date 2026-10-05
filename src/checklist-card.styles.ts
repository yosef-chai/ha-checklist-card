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
  :host([hidden]) {
    display: none;
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
    gap: 12px;
    /* No flex-wrap here: we want children to *shrink* (with ellipsis on the
       title) before the actions get bumped to a new line. The container query
       at the bottom of this file stacks them vertically only when there
       genuinely isn't enough width. */
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1 1 auto;
    /* Allow flex children to shrink below their intrinsic width so the title
       ellipsizes instead of pushing the actions to a new row. */
    min-width: 0;
  }

  /* Title + subtitle stack — also needs min-width: 0 so the nowrap text
     inside actually clamps to its container instead of growing it. */
  .header-text {
    min-width: 0;
    flex: 1 1 auto;
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
    /* Stay perfectly round — never let flex squish it. */
    flex-shrink: 0;
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

  /* Marquee: a track holds two identical inner spans side-by-side and slides
     by exactly half its own width, so the second copy seamlessly takes the
     place of the first. The trailing gap on each inner creates breathing
     room between cycles. */
  .marquee-track {
    display: inline-flex;
    flex-wrap: nowrap;
    will-change: transform;
  }
  .title.overflowing,
  .subtitle.overflowing {
    /* Hide the ellipsis once the text is scrolling — it would clip mid-glyph. */
    text-overflow: clip;
  }
  .title.overflowing .marquee-inner,
  .subtitle.overflowing .marquee-inner {
    flex-shrink: 0;
    padding-inline-end: 2em;
  }

  :host(.marquee-enabled) .title.overflowing .marquee-track,
  :host(.marquee-enabled) .subtitle.overflowing .marquee-track {
    animation: marquee-scroll var(--marquee-duration, 12s) linear infinite;
  }

  :host(.marquee-enabled[dir="rtl"]) .title.overflowing .marquee-track,
  :host(.marquee-enabled[dir="rtl"]) .subtitle.overflowing .marquee-track {
    animation-name: marquee-scroll-rtl;
  }

  /* Pause when the user hovers/focuses, so the text can be read in full. */
  .title.overflowing:hover .marquee-track,
  .subtitle.overflowing:hover .marquee-track,
  .title.overflowing:focus-within .marquee-track,
  .subtitle.overflowing:focus-within .marquee-track {
    animation-play-state: paused;
  }

  @keyframes marquee-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes marquee-scroll-rtl {
    from { transform: translateX(0); }
    to   { transform: translateX(50%); }
  }

  @media (prefers-reduced-motion: reduce) {
    .title.overflowing .marquee-track,
    .subtitle.overflowing .marquee-track {
      animation: none !important;
      transform: none !important;
    }
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
    /* Actions keep their natural width and never shrink — the title (with
       ellipsis) absorbs any width pressure first. */
    flex-shrink: 0;
    flex-wrap: wrap;
    justify-content: flex-end;
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

  /* Narrow card: stack the header so title and actions each get a full row.
     Below this width even an ellipsized title leaves no useful room next to
     the action buttons. */
  @container (max-width: 380px) {
    .header {
      flex-direction: column;
      align-items: stretch;
      margin-bottom: 16px;
    }
    .header-content { width: 100%; }
    .header-actions {
      width: 100%;
      margin-inline-start: 0;
      justify-content: flex-start;
    }
    .fix-all-btn,
    .ok-toggle-btn {
      flex: 1 1 auto;
    }
  }

  /* Tighter padding and smaller status circle on very narrow cards. */
  @container (max-width: 280px) {
    ha-card { padding: 12px; }
    .header { margin-bottom: 12px; }
    .status-icon { width: 32px; height: 32px; }
    .status-icon ha-icon { --mdc-icon-size: 18px; }
    .title { font-size: 16px; }
    .subtitle { font-size: 12px; }
    .fix-all-btn,
    .ok-toggle-btn {
      padding: 6px 12px;
      font-size: 13px;
    }
  }

  /* Snooze count badge in subtitle */
  .snooze-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    margin-inline-start: 6px;
    color: var(--warning-color, #e59b2d);
    font-size: 13px;
  }

  /* Inline error banner (replaces ha-alert, which cards cannot rely on). */
  .error-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-block: 8px;
    padding-inline: 12px 8px;
    border-radius: var(--ha-border-radius-md, 8px);
    background-color: rgba(var(--rgb-error-color, 219, 68, 55), 0.12);
    color: var(--primary-text-color);
    font-size: 14px;
  }
  .error-banner > ha-icon {
    color: var(--error-color, #db4437);
    flex-shrink: 0;
  }
  .error-text {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--secondary-text-color);
    cursor: pointer;
    flex-shrink: 0;
    --mdc-icon-size: 18px;
  }
  .icon-btn:hover {
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
  }

  /* Native modal <dialog>: renders in the top layer (escapes ha-card clipping)
     and is styled with HA's dialog tokens so it matches built-in dialogs. */
  dialog {
    box-sizing: border-box;
    width: min(400px, calc(100vw - 32px));
    max-height: calc(100vh - 32px);
    padding: 0;
    border: none;
    border-radius: var(--ha-dialog-border-radius, var(--ha-border-radius-3xl, 24px));
    background: var(--ha-dialog-surface-background, var(--card-background-color, var(--primary-background-color, #fff)));
    color: var(--primary-text-color);
    box-shadow: var(--dialog-box-shadow, var(--ha-box-shadow-l, 0 8px 32px rgba(0, 0, 0, 0.3)));
    font-family: var(--ha-font-family-body, var(--primary-font-family, inherit));
  }
  dialog::backdrop {
    background: var(--mdc-dialog-scrim-color, rgba(0, 0, 0, 0.32));
  }
  .dialog-surface {
    display: flex;
    flex-direction: column;
  }
  .dialog-heading {
    margin: 0;
    padding: 24px 24px 0;
    font-size: var(--ha-font-size-2xl, 24px);
    font-weight: var(--ha-font-weight-normal, 400);
    line-height: 1.3;
  }
  .dialog-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 24px;
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 8px 24px 24px;
  }
  .dialog-btn {
    min-height: 40px;
    padding: 0 16px;
    border: none;
    border-radius: var(--ha-border-radius-pill, 9999px);
    background: transparent;
    color: var(--primary-color);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .dialog-btn:hover:not([disabled]) {
    background-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
  }
  .dialog-btn.primary {
    background-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .dialog-btn.primary:hover:not([disabled]) {
    background-color: var(--primary-color);
    opacity: 0.9;
  }
  .dialog-btn[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .dialog-btn:focus-visible,
  .chip-btn:focus-visible,
  .icon-btn:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .confirm-text {
    margin: 0;
    font-size: 14px;
    color: var(--primary-text-color);
  }
  .confirm-list {
    margin: 0;
    padding-inline-start: 20px;
    font-size: 14px;
    color: var(--secondary-text-color);
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

  .chip-btn {
    min-height: 32px;
    padding: 0 14px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: var(--ha-border-radius-md, 8px);
    background-color: transparent;
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
    transition: background-color 0.15s;
  }
  .chip-btn:hover {
    background-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    border-color: var(--primary-color);
  }

  .snooze-custom-label {
    margin-top: 4px;
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  .snooze-custom-input {
    box-sizing: border-box;
    width: 100%;
    min-height: 40px;
    padding: 0 12px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
    border-radius: var(--ha-border-radius-md, 8px);
    background: var(--ha-color-form-background, var(--card-background-color));
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
  }
  .snooze-custom-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }
`;
