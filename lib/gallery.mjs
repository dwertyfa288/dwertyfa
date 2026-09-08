/** @param {number} value @param {number} min @param {number} max */
const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
/** @param {number} value */
const clean = (value) => (Math.abs(value) < 0.000001 ? 0 : value);
/** @param {number} progress @param {number} count */
export function chapterAt(progress, count) {
  return Math.round(clamp(progress, 0, 1) * Math.max(0, count - 1));
}
/** @param {number} progress @param {number} index @param {number} count */
export function chapterFrame(progress, index, count) {
  const distance = clamp(
    index - clamp(progress, 0, 1) * Math.max(0, count - 1),
    -1.3,
    1.3,
  );
  const absolute = Math.abs(distance);
  const fade = clamp((absolute - 0.25) / 0.65, 0, 1);
  return {
    x: clean(distance * 95),
    y: clean(absolute * 6),
    rotate: clean(-distance * 14),
    scale: 1 - absolute * 0.15,
    opacity: 1 - fade * fade * (3 - 2 * fade),
    z: clean(-absolute * 400),
  };
}
/** @param {number} scroll @param {number} top @param {number} range */
export function progressFromScroll(scroll, top, range) {
  return range > 0 ? clamp((scroll - top) / range, 0, 1) : 0;
}
/** @param {number} index @param {number} count @param {number} top @param {number} range */
export function scrollForChapter(index, count, top, range) {
  return (
    top +
    (count > 1 ? clamp(index, 0, count - 1) / (count - 1) : 0) *
      Math.max(0, range)
  );
}
