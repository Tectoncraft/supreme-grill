// All hero scroll-story timings, as fractions (0–1) of the scroll progress.
// Clip is 5.04 s: orbit 0–0.3, knife enters ~0.33, slicing from ~0.6 to the end.
// Overlay A is gone before the knife appears; overlay B arrives during the slice.
export const scrollStory = {
  heightVh: 400,
  // The video never jumps to the scroll position and never freezes abruptly:
  // when it is behind the scroll it plays forward at a rate proportional to the
  // gap (so it glides to a stop), between `minRate` and `maxVideoSpeed`
  // (video-seconds per real second). Scrolling backwards seeks with the same easing.
  follow: 0.3,
  maxVideoSpeed: 1.6,
  minRate: 0.12,
  // wheel-down is held back while the scroll is more than this fraction of the
  // story ahead of the video, so fast scrollers can't outrun the animation
  maxLead: 0.07,
  fps: 24,
  // clicks on in-page links scroll at this speed instead of jumping
  anchorScroll: { maxPxPerSec: 1300, minSec: 0.6, maxSec: 3.2 },
  overlayA: { visibleUntil: 0.15, fadeEnd: 0.3, moveUpPx: 40 },
  overlayB: { fadeInStart: 0.78, fadeInEnd: 0.95 },
  scrim: { start: 0.72, end: 0.9 },
  scrollHint: { fadeEnd: 0.05 },
  // fades the last frame into --slate so the unpinned video leaves no edge
  endFade: { start: 0.9, end: 1 },
  mobileMaxWidth: 768,
  // TEMP: true so the stock clip can be tested scrubbing on phones.
  // Set to false for the final spec (mobile = autoplaying loop).
  scrubOnMobile: true,
  sources: {
    desktop: { src: '/assets/hero-story.mp4', poster: '/assets/hero-poster.webp' },
    mobile: { src: '/assets/hero-story-mobile.mp4', poster: '/assets/hero-poster-mobile.webp' },
  },
} as const;
