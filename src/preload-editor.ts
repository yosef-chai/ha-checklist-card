/**
 * Force Home Assistant to lazy-load editor-only components (ha-form,
 * ha-entity-picker, ha-icon-picker, ha-selector, ...) by asking a built-in
 * card for its config element. HA registers these elements on demand the
 * first time any built-in editor is opened — by triggering this ourselves
 * in the background while the dashboard is idle, the editor opens fast
 * (everything is already registered when getConfigElement() runs).
 *
 * Pattern adapted from thomasloven/lovelace-layout-card and similar custom
 * cards. Idempotent — safe to call multiple times.
 */
let preloadPromise: Promise<void> | null = null;

type IdleScheduler = (cb: () => void, opts?: { timeout?: number }) => void;

/**
 * Kick off the preload during browser idle time so it doesn't compete with
 * dashboard rendering. Falls back to a short setTimeout in browsers (Safari)
 * that don't expose requestIdleCallback.
 */
export function schedulePreloadEditorComponents(): void {
  if (preloadPromise) return;
  const ric: IdleScheduler | undefined = (window as any).requestIdleCallback;
  const start = () => { preloadEditorComponents(); };
  if (ric) {
    ric(start, { timeout: 2000 });
  } else {
    setTimeout(start, 500);
  }
}

export function preloadEditorComponents(): Promise<void> {
  if (preloadPromise) return preloadPromise;

  // Already loaded by some other editor — nothing to do.
  if (customElements.get('ha-form') && customElements.get('ha-entity-picker')) {
    preloadPromise = Promise.resolve();
    return preloadPromise;
  }

  preloadPromise = (async () => {
    try {
      const loadHelpers = (window as any).loadCardHelpers as
        | (() => Promise<{ createCardElement: (cfg: unknown) => any }>)
        | undefined;

      if (loadHelpers) {
        const helpers = await loadHelpers();
        const card = helpers?.createCardElement?.({ type: 'entities', entities: [] });
        const ctor = card?.constructor as { getConfigElement?: () => Promise<HTMLElement> } | undefined;
        if (ctor?.getConfigElement) {
          await ctor.getConfigElement();
          return;
        }
      }

      // Fallback if loadCardHelpers isn't exposed (older HA / unusual setups):
      // wait for the entities card to register and ask it directly.
      await customElements.whenDefined('hui-entities-card');
      const builtin = customElements.get('hui-entities-card') as
        | { getConfigElement?: () => Promise<HTMLElement> }
        | undefined;
      if (builtin?.getConfigElement) {
        await builtin.getConfigElement();
      }
    } catch (e) {
      // Non-fatal: the editor's own render() has a defensive fallback.
      console.warn('[checklist-card] failed to preload editor components', e);
    }
  })();

  return preloadPromise;
}
