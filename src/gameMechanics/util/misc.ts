import { Coord } from './types';

export const range = (length: number, startAt = 0) =>
  Array.from({ length }, (_, i) => i + startAt);

export const noop = () => {};

export const identity = <T>(n: T) => n;

export const coordsAreEqual = (a: Coord, b: Coord) =>
  a.col === b.col && a.row === b.row;

export const objectKeys = <O extends object>(o: O) =>
  Object.keys(o) as (keyof O)[];

// type KeysOfType<T, K> = { [P in keyof T]: T[P] extends K ? P : never }[keyof T];

// export const existsIn = <T, R extends KeysOfType<T, R>>(
//   toCheck: T,
//   againstList: KeysOfType<T, R>[]
// ): toCheck is R => true;
