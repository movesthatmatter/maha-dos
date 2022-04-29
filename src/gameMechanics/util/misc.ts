export const range = (length: number, startAt = 0) =>
  Array.from({ length }, (_, i) => i + startAt);

export const noop = () => {};

export const identity = <T>(n: T) => n;
