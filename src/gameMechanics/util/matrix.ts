import { identity } from './misc';

export type Matrix<T> = T[][];

export const matrixMap = <T, R>(
  matrix: Matrix<T>,
  fn: (t: T, index: [row: number, col: number]) => R
) =>
  matrix.map((row, rowIndex) =>
    row.map((val, colIndex) => fn(val, [rowIndex, colIndex]))
  );

export const matrixForEach = <T>(
  matrix: Matrix<T>,
  fn: (t: T, index: [row: number, col: number]) => void
) => {
  matrixMap(matrix, fn);
};

// Flips the rows
export const flipMatrixHorizontally = <T>(matrix: Matrix<T>) =>
  matrix.reduce((accum, nextRow) => [nextRow, ...accum], [] as Matrix<T>);

export const flipMatrixVertically = <T>(matrix: Matrix<T>) =>
  matrix.map((row) =>
    row.reduce((accum, nextColVal) => [nextColVal, ...accum], [] as T[])
  );

export const getMatrixRowsLength = (matrix: Matrix<unknown>) => matrix.length;
export const getMatrixColsLength = (matrix: Matrix<unknown>) =>
  matrix[0]?.length || 0;

export const duplicateMatrix = <T>(matrix: Matrix<T>) =>
  matrixMap(matrix, identity);

// This creates a new matrix each time. Immutability!
export const matrixInsert = <T>(
  matrix: Matrix<T>,
  index: [number, number],
  nextVal: T
): Matrix<T> => matrixInsertMany(matrix, [{ index, nextVal }]);

export const matrixInsertMany = <T>(
  matrix: Matrix<T>,
  vals: {
    index: [number, number];
    nextVal: T;
  }[]
) => {
  const nextMatrixInPlace = duplicateMatrix(matrix);

  vals.forEach(({ index, nextVal }) => {
    const [i, j] = index;

    if (i < matrix.length && i > -1) {
      if (j < (matrix[0]?.length || 0) && j > -1) {
        nextMatrixInPlace[i][j] = nextVal;
      }
    }
  });

  return nextMatrixInPlace;
};
