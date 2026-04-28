/**
 * @file marquee-controller.ts
 * @description Lit ReactiveController that drives auto-scrolling text marquee
 *              behavior across the checklist card and its rows.
 *
 * Responsibilities:
 *  - Decide which text fields actually overflow their visible width and
 *    therefore require horizontal scrolling.
 *  - Trigger re-measurement when the host resizes (ResizeObserver),
 *    once web fonts finish loading, and once the host becomes visible
 *    (IntersectionObserver — handles cards that mount inside collapsed
 *    sections or off-screen tabs).
 *  - Compute a duration that keeps the visual scroll speed constant
 *    regardless of text length, exposed as the CSS custom property
 *    `--marquee-duration` on each overflowing parent.
 *
 * The controller deliberately measures pure text width via a Range so
 * the result is unaffected by trailing padding used to create the gap
 * between the original text and its duplicate while scrolling.
 */
import { html, type TemplateResult } from 'lit';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { LitElement } from 'lit';

/** Visual scroll speed in CSS pixels per second. Tuned for relaxed reading. */
const SCROLL_SPEED_PX_PER_SEC = 20;
/** Don't scroll faster than this (very short overflows). */
const MIN_DURATION_S = 4;
/** Don't scroll slower than this (extremely long text). */
const MAX_DURATION_S = 30;
/** Width tolerance to avoid sub-pixel jitter at the overflow boundary. */
const OVERFLOW_TOLERANCE_PX = 1;

export interface MarqueeTarget {
  /** CSS selector (within the host's shadowRoot) for the clipping parent. */
  parent: string;
  /** Called when the overflow state for this target changes. */
  setOverflow: (overflowing: boolean) => void;
}

/**
 * Bind a host LitElement to one or more text fields that may need to
 * marquee-scroll when truncated. Add an instance in the constructor of
 * the host; the controller registers itself with the host's lifecycle.
 */
export class MarqueeController implements ReactiveController {
  private readonly host: ReactiveControllerHost & LitElement;
  private readonly targets: MarqueeTarget[];
  private readonly overflowState = new Map<string, boolean>();
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private rafId: number | null = null;
  private isVisible = true;

  constructor(host: ReactiveControllerHost & LitElement, targets: MarqueeTarget[]) {
    this.host = host;
    this.targets = targets;
    host.addController(this);
  }

  hostConnected(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.scheduleCheck());
      this.resizeObserver.observe(this.host);
    }

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && !this.isVisible) {
          // Becoming visible can change clientWidth from 0 → real width;
          // re-measure so newly-visible cards animate immediately.
          this.scheduleCheck();
        }
        this.isVisible = visible;
      });
      this.intersectionObserver.observe(this.host);
    }

    // Custom fonts can change measured text width once loaded; re-check.
    const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(() => {
        if (this.host.isConnected) this.scheduleCheck();
      });
    }
  }

  hostDisconnected(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = null;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.overflowState.clear();
  }

  hostUpdated(): void {
    this.scheduleCheck();
  }

  /** Coalesce multiple measurement requests into a single rAF tick. */
  scheduleCheck(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.check();
    });
  }

  private check(): void {
    const root = this.host.shadowRoot;
    if (!root) return;

    for (const target of this.targets) {
      const parent = root.querySelector(target.parent) as HTMLElement | null;
      if (!parent) {
        this.publish(target, false);
        continue;
      }
      const inner = parent.querySelector('.marquee-inner') as HTMLElement | null;
      if (!inner) {
        this.publish(target, false);
        continue;
      }

      const parentWidth = parent.clientWidth;
      // Parent isn't laid out yet (hidden tab, display:none, off-screen): keep
      // current state and wait for ResizeObserver / IntersectionObserver to fire.
      if (parentWidth <= 0) continue;

      const textWidth = measureContentWidth(inner);
      const overflowing = textWidth > parentWidth + OVERFLOW_TOLERANCE_PX;

      if (overflowing) {
        // Content moves by the gap-inclusive width of one copy on every cycle.
        // Setting duration ∝ width keeps perceived speed constant across rows.
        const duration = clamp(
          textWidth / SCROLL_SPEED_PX_PER_SEC,
          MIN_DURATION_S,
          MAX_DURATION_S,
        );
        parent.style.setProperty('--marquee-duration', `${duration.toFixed(2)}s`);
      } else {
        parent.style.removeProperty('--marquee-duration');
      }

      this.publish(target, overflowing);
    }
  }

  private publish(target: MarqueeTarget, overflowing: boolean): void {
    if (this.overflowState.get(target.parent) === overflowing) return;
    this.overflowState.set(target.parent, overflowing);
    target.setOverflow(overflowing);
  }
}

/**
 * Measure the rendered width of an element's text content using a Range,
 * so trailing padding (used as the marquee gap) doesn't bias the result.
 * Range measurement reflects only the box(es) of the contained children.
 */
function measureContentWidth(el: HTMLElement): number {
  if (typeof document.createRange !== 'function') {
    return el.getBoundingClientRect().width;
  }
  const range = document.createRange();
  try {
    range.selectNodeContents(el);
    return range.getBoundingClientRect().width;
  } finally {
    range.detach?.();
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * Render the inner content of a marquee-capable container.
 *
 * When `scrolling` is true, content is wrapped in a `.marquee-track` with
 * a duplicate `.marquee-inner` so the looped translation is seamless.
 * When false, a single `.marquee-inner` is rendered — the same DOM hook
 * is used so the controller can measure either state without special-casing.
 */
export function renderMarqueeBody(content: unknown, scrolling: boolean): TemplateResult {
  if (!scrolling) {
    return html`<span class="marquee-inner">${content}</span>`;
  }
  return html`
    <span class="marquee-track">
      <span class="marquee-inner">${content}</span>
      <span class="marquee-inner" aria-hidden="true">${content}</span>
    </span>
  ` as TemplateResult;
}
