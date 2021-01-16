export const KEYS = {
  LEFT: 75,
  RIGHT: 77,
  UP: 72,
  DOWN: 80,
};

export function hasModifiers(ev) {
  return Boolean(ev.shiftKey || ev.altKey || ev.ctrlKey || ev.metaKey);
}
