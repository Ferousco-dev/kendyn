export const scrollState = {
  progress: 0,
};

export const pointerState = {
  x: 0,
  y: 0,
};

export function phase(p: number, start: number, end: number): number {
  const t = (p - start) / (end - start);
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

export function easeInOut(t: number): number {
  return t * t * (3 - 2 * t);
}
