import { range } from './misc';
import { flipMatrixHorizontally, flipMatrixVertically, matrixMap } from './matrix';

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
      [4, 3],
    ];
    const actual = flipMatrixVertically(matrixMap(twoBytwo, (p) => p));

    expect(actual).toEqual(expected);
  });
});
