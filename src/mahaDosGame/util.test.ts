import { tupleCoordToMahaChessSquare, mahaChessSquareToCoord } from './util';

test('coordToMahaChessSquare', () => {
  expect(tupleCoordToMahaChessSquare([0, 0])).toBe('a8');
  expect(tupleCoordToMahaChessSquare([7, 7])).toBe('h1');
  expect(tupleCoordToMahaChessSquare([7, 0])).toBe('a1');
  expect(tupleCoordToMahaChessSquare([0, 7])).toBe('h8');

  expect(tupleCoordToMahaChessSquare([3, 6])).toBe('g5');
  expect(tupleCoordToMahaChessSquare([5, 1])).toBe('b3');
  expect(tupleCoordToMahaChessSquare([2, 3])).toBe('d6');
  expect(tupleCoordToMahaChessSquare([1, 5])).toBe('f7');
});

test('mahaChessSquareToCoord', () => {
  expect(mahaChessSquareToCoord('a8')).toEqual({ row: 0, col: 0 });
  expect(mahaChessSquareToCoord('a1')).toEqual({ row: 7, col: 0 });
  expect(mahaChessSquareToCoord('h8')).toEqual({ row: 0, col: 7 });
  expect(mahaChessSquareToCoord('h1')).toEqual({ row: 7, col: 7 });

  expect(mahaChessSquareToCoord('g5')).toEqual({ row: 3, col: 6 });
  expect(mahaChessSquareToCoord('b3')).toEqual({ row: 5, col: 1 });
  expect(mahaChessSquareToCoord('d6')).toEqual({ row: 2, col: 3 });
  expect(mahaChessSquareToCoord('f7')).toEqual({ row: 1, col: 5 });
});
