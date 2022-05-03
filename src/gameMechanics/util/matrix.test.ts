import { range } from './misc';
import {
  flipMatrixHorizontally,
  flipMatrixVertically,
  matrixCreate,
  matrixMap,
  matrixReduce
} from './matrix';

describe('matrix map', () => {
  test('with identity as handler', () => {
    const twoBytwo = [
      [1, 2],
      [3, 4]
    ];

    const expected = twoBytwo;
    const actual = matrixMap(twoBytwo, (p) => p);

    expect(actual).toEqual(expected);
  });

  test('with multipler as handler', () => {
    const twoBytwo = [
      [1, 2],
      [3, 4]
    ];

    const expected = [
      [2, 4],
      [6, 8]
    ];
    const actual = matrixMap(twoBytwo, (p) => p * 2);

    expect(actual).toEqual(expected);
  });

  test('with huge matrixes', () => {
    const thousandByThousand = range(100).map(() => range(100));

    const expected = thousandByThousand;
    const actual = matrixMap(thousandByThousand, (p) => p);

    expect(actual).toEqual(expected);
  });

  test('with correct indexes', () => {
    const twoBytwo = [
      [1, 2],
      [3, 4]
    ];

    const expected = [
      [
        [0, 0],
        [0, 1]
      ],
      [
        [1, 0],
        [1, 1]
      ]
    ];
    const actual = matrixMap(twoBytwo, (_, i) => i);

    expect(actual).toEqual(expected);
  });
});

describe('flip matrix horizontaly', () => {
  test('with identity as handler', () => {
    const twoBytwo = [
      [1, 2],
      [3, 4]
    ];

    const expected = [
      [3, 4],
      [1, 2]
    ];
    const actual = flipMatrixHorizontally(matrixMap(twoBytwo, (p) => p));

    expect(actual).toEqual(expected);
  });
});

describe('flip matrix vertically', () => {
  test('with identity as handler', () => {
    const twoBytwo = [
      [1, 2],
      [3, 4]
    ];

    const expected = [
      [2, 1],
      [4, 3]
    ];
    const actual = flipMatrixVertically(matrixMap(twoBytwo, (p) => p));

    expect(actual).toEqual(expected);
  });
});

describe('matrix reduce', () => {
  test('walks thorugh each item resulting in a sum', () => {
    const twoBytwo = [
      [1, 2],
      [3, 4]
    ];

    const actual = matrixReduce(twoBytwo, (prev, next) => prev + next, 0);
    const expected = 10;

    expect(actual).toBe(expected);
  });

  test('walks thorugh each item in the row then col order, resulting in a sorted array', () => {
    const twoBytwo = [
      [1, 2],
      [3, 4]
    ];

    const actual = matrixReduce(
      twoBytwo,
      (prev, next) => [...prev, next],
      [] as number[]
    );
    const expected = [1, 2, 3, 4];

    expect(actual).toEqual(expected);
  });
});

describe('matrix create', () => {
  test('creates a new square matrix of undefined values', () => {
    const actual = matrixCreate(2);

    const expected = [
      [undefined, undefined],
      [undefined, undefined]
    ];

    expect(actual).toEqual(expected);
  });

  test('creates a new matrix 3 rows by 2 cols of undefined values', () => {
    const actual = matrixCreate(3, 2);

    const expected = [
      [undefined, undefined],
      [undefined, undefined],
      [undefined, undefined]
    ];

    expect(actual).toEqual(expected);
  });

  test('creates a new matrix 3 rows by 1 cols of undefined values', () => {
    const actual = matrixCreate(3, 1);
    const expected = [[undefined], [undefined], [undefined]];

    expect(actual).toEqual(expected);
  });

  test('creates a new matrix 1 rows by 3 cols of undefined values', () => {
    const actual = matrixCreate(1, 3);
    const expected = [[undefined, undefined, undefined]];

    expect(actual).toEqual(expected);
  });
});
