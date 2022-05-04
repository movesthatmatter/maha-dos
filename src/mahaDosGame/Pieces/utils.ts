import { Game } from 'src/gameMechanics/Game/Game';
import { Move } from 'src/gameMechanics/Game/types';
import { Piece } from 'src/gameMechanics/Piece/Piece';
import { IdentifiablePieceState } from 'src/gameMechanics/Piece/types';
import { Coord, range } from 'src/gameMechanics/util';
import { toDictIndexedBy } from 'src/gameMechanics/utils';

export function evalEachDirectionForMove(
  from: Coord,
  piece: Piece,
  game: Game
): Move[] {
  const moves: Move[] = [];
  piece.state.movesDirections.map((dir) => {
    let hitObstacle = false;
    range(piece.state.moveRange, 1).map((r) => {
      if (hitObstacle) {
        return;
      }
      const targetSq: Coord = {
        row: from.row + dir.row * r,
        col: from.col + dir.col * r
      };
      if (
        targetSq.row >= game.board.state.pieceLayoutState.length ||
        targetSq.col >= game.board.state.pieceLayoutState[0].length ||
        targetSq.row < 0 ||
        targetSq.col < 0
      ) {
        return;
      }
      if (game.board.state.pieceLayoutState[targetSq.row][targetSq.col] === 0) {
        const move: Move = {
          from,
          to: targetSq,
          piece: piece.state
        };
        moves.push(move);
      } else {
        hitObstacle = true;
        return;
      }
    });
  });
  return moves;
}

// TODO: Ensure this is good!
export function getAllAdjecentPiecesToPosition(
  pos: Coord,
  pieceLayoutState: Game['board']['state']['pieceLayoutState']
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
      target.row >= pieceLayoutState.length ||
      target.col >= pieceLayoutState[0].length ||
      target.row < 0 ||
      target.col < 0
    ) {
      return accum;
    }

    const targetPiece = pieceLayoutState[target.row][target.col];

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
