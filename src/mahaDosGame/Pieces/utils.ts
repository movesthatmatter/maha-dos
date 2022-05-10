import { Game } from '../../gameMechanics/Game/Game';
import { GameStateInMovePhase } from '../../gameMechanics/Game/types';
import { Piece } from '../../gameMechanics/Piece/Piece';
import { IdentifiablePieceState } from '../../gameMechanics/Piece/types';
import {
  Coord,
  range,
  matrixInsertMany,
  MatrixIndex,
  matrixGet
} from '../../gameMechanics/util';
import { toDictIndexedBy } from '../../gameMechanics/utils';
import { PieceLayoutState } from '../../gameMechanics/Board/types';
import { Move } from '../../gameMechanics/commonTypes';
import { isGameInMovePhase } from '../../gameMechanics/Game/helpers';

const determineRange = (moves: Coord[], moveRange: number) => {
  return moves.reduce((totalRange, dir) => {
    return [
      ...totalRange,
      ...range(moveRange, 1).map((r) => ({
        row: dir.row * r,
        col: dir.col * r
      }))
    ];
  }, [] as Coord[]);
};

function isDefined<T>(m: T | undefined): m is T {
  return m !== undefined;
}

export function stringifyCoord(c: Coord): string {
  return `row:${c.row}-col:${c.col}`;
}

export function calculateDistanceBetween2Coords(
  dest: Coord,
  target: Coord
): number {
  return Math.max(
    Math.abs(dest.row - target.row),
    Math.abs(dest.col - target.col)
  );
}

export function evalEachDirectionForMove(
  from: Coord,
  piece: Piece,
  game: Game
): Move[] {
  const drawnMoves = isGameInMovePhase(game.state)
    ? game.state[piece.state.color].moves || []
    : [];

  const tempBoard = matrixInsertMany(
    game.state.boardState.pieceLayoutState,
    drawnMoves.reduce(
      (total, move) => {
        const pieceFromMatrix = matrixGet(
          game.state.boardState.pieceLayoutState,
          [move.from.row, move.from.col]
        );
        if (!pieceFromMatrix) {
          return total;
        }
        return [
          ...total,
          {
            index: [move.to.row, move.to.col],
            nextVal: pieceFromMatrix
          },
          {
            index: [move.from.row, move.from.col],
            nextVal: 0 as const
          }
        ];
      },
      [] as {
        index: MatrixIndex;
        nextVal: 0 | IdentifiablePieceState<string>;
      }[]
    )
  );

  const totalMoves = piece.state.movesDirections.reduce((moves, dir) => {
    let hitObstacle = false;
    const mm = range(piece.state.moveRange, 1)
      .map((r) => {
        if (hitObstacle) {
          return undefined;
        }
        const targetSq: Coord = {
          row: from.row + dir.row * r,
          col: from.col + dir.col * r
        };
        if (
          targetSq.row >= tempBoard.length ||
          targetSq.col >= tempBoard[0].length ||
          targetSq.row < 0 ||
          targetSq.col < 0
        ) {
          return undefined;
        }
        if (tempBoard[targetSq.row][targetSq.col] === 0) {
          const move: Move = {
            from,
            to: targetSq,
            piece: piece.state
          };
          return move;
        } else {
          hitObstacle = true;
          return undefined;
        }
      })
      .filter((p) => isDefined(p)) as Move[];

    return [...moves, ...mm];
  }, [] as Move[]);

  const otherMovesByDestination = toDictIndexedBy(drawnMoves, (move) =>
    stringifyCoord(move.to)
  );

  return totalMoves.filter((move) => {
    if (stringifyCoord(move.to) in otherMovesByDestination) {
      return false;
    }
    return true;
  });
}

export function getAllAdjecentPiecesToPosition(
  pos: Coord,
  pieceLayout: PieceLayoutState
): IdentifiablePieceState[] {
  return [
    { row: -1, col: 0 },
    { row: -1, col: 1 },
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: -1 },
    { row: 0, col: -1 },
    { row: -1, col: -1 }
  ].reduce((accum, dir) => {
    const target: Coord = { row: pos.row + dir.row, col: pos.col + dir.col };

    if (
      target.row >= pieceLayout.length ||
      target.col >= pieceLayout[0].length ||
      target.row < 0 ||
      target.col < 0
    ) {
      return accum;
    }

    const targetPiece = pieceLayout[target.row][target.col];

    if (targetPiece === 0) {
      return accum;
    }

    return [...accum, targetPiece];
  }, [] as IdentifiablePieceState[]);
}

export function getPieceMoveThisTurn(
  piece: Piece,
  game: Game
): Move | undefined {
  const { history } = game.state;

  if (
    history &&
    history.length > 0 &&
    typeof history[history.length - 1][0][piece.state.color] !== 'undefined'
  ) {
    const movesByPieceId = toDictIndexedBy(
      history[history.length - 1][0][piece.state.color] as Move[],
      (move) => move.piece.id
    );

    if (piece.state.id in movesByPieceId) {
      return movesByPieceId[piece.state.id];
    }
  }

  return undefined;
}
