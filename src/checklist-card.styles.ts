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
    color: #e59b2dff;
    font-size: 13px;
  }

  .snooze-dialog-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 4px;
    min-width: min(260px, 100%);
    max-width: 100%;
    box-sizing: border-box;
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
