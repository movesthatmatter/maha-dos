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
