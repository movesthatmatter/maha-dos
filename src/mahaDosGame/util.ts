import { GameState, GameStateInProgress } from 'src/gameMechanics/Game/types';
import { Move, ShortMove } from '../gameMechanics/commonTypes';
import { Coord } from '../gameMechanics/util';
import { detailedDiff } from 'deep-object-diff';

const mahaChessSquares = {
  a1: null,
  a2: null,
  a3: null,
  a4: null,
  a5: null,
  a6: null,
  a7: null,
  a8: null,

  b1: null,
  b2: null,
  b3: null,
  b4: null,
  b5: null,
  b6: null,
  b7: null,
  b8: null,

  c1: null,
  c2: null,
  c3: null,
  c4: null,
  c5: null,
  c6: null,
  c7: null,
  c8: null,

  d1: null,
  d2: null,
  d3: null,
  d4: null,
  d5: null,
  d6: null,
  d7: null,
  d8: null,

  e1: null,
  e2: null,
  e3: null,
  e4: null,
  e5: null,
  e6: null,
  e7: null,
  e8: null,

  f1: null,
  f2: null,
  f3: null,
  f4: null,
  f5: null,
  f6: null,
  f7: null,
  f8: null,

  g1: null,
  g2: null,
  g3: null,
  g4: null,
  g5: null,
  g6: null,
  g7: null,
  g8: null,

  h1: null,
  h2: null,
  h3: null,
  h4: null,
  h5: null,
  h6: null,
  h7: null,
  h8: null
};

type MahaChessSquare = keyof typeof mahaChessSquares;

const indexedFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const indexedRanks = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

type AcceptableTupleCoordForMahaChessSquare = [
  row: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
  col: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
];

export const tupleCoordToMahaChessSquare = ([
  row,
  col
]: AcceptableTupleCoordForMahaChessSquare): MahaChessSquare => {
  const rank = indexedRanks[row];
  const file = indexedFiles[col];

  return `${file}${rank}`;
};

const indexedCols = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7
};

export const mahaChessSquareToCoord = (sq: MahaChessSquare): Coord => {
  const row = indexedRanks.length - Number(sq[1]);
  const col = indexedCols[sq[0] as keyof typeof indexedCols];

  return { row, col };
};

export type MahaChessMove = Pick<Move, 'piece' | 'promotion'> & {
  from: MahaChessSquare;
  to: MahaChessSquare;
};

export type MahaChessShortMove = Pick<ShortMove, 'promotion'> & {
  from: MahaChessSquare;
  to: MahaChessSquare;
};

const isInMahaChessCoordBoundary = (c: Coord) =>
  !!indexedRanks[c.row] && !!indexedFiles[c.col];

export function moveToMahaChessMove<
  M extends ShortMove | Move,
  R = M extends ShortMove ? MahaChessShortMove : MahaChessMove
>(m: M): R | undefined {
  const { from, to, ...rest } = m;

  if (!(isInMahaChessCoordBoundary(from) && isInMahaChessCoordBoundary(to))) {
    return undefined;
  }

  return {
    ...rest,
    from: tupleCoordToMahaChessSquare([
      from.row,
      from.col
    ] as AcceptableTupleCoordForMahaChessSquare),
    to: tupleCoordToMahaChessSquare([
      to.row,
      to.col
    ] as AcceptableTupleCoordForMahaChessSquare)
  } as unknown as R;
}

export const printPieceLayoutStateDiff = (
  prev: GameStateInProgress,
  next: GameStateInProgress
) => {
  console.log(
    'Board State diff : ',
    detailedDiff(
      prev.boardState.pieceLayoutState,
      next.boardState.pieceLayoutState
    )
  );
};
