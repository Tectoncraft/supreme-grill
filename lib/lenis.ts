import type Lenis from 'lenis';

// Shared handle so other components (anchors, menu overlay) can drive the smooth scroller.
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;
