import { Game } from 'src/gameMechanics/Game/Game';
import { Color } from 'src/gameMechanics/util/types';
import { Attack, Move } from 'src/gameMechanics/Game/types';
import { Piece } from 'src/gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from 'src/gameMechanics/Piece/types';
import { range, Coord } from 'src/gameMechanics/util';
import {
  evalEachDirectionForMove,
  getAllAdjecentPiecesToPosition,
  getPieceMoveThisTurn
} from '../utils';
import { PieceLayoutState } from 'src/gameMechanics/Board/types';
import { AttackTargetPieceUndefined } from 'src/gameMechanics/engine';
import { Err, Ok, Result } from 'ts-results';
import { Queen } from '../Queen';

const pieceLabel = 'Knight';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 12,
  moveRange: 1,
  attackRange: 1,
  attackDamage: 2,
  canAttack: true,
  pieceHasMoved: false
};

export class Knight extends Piece {
  constructor(
    color: Color,
    id: IdentifiablePieceState<typeof pieceLabel>['id'],
    dynamicProps?: Partial<PieceDynamicProps>
  ) {
    super(id, {
      ...DEFAULT_DYNAMIC_PROPS,
      ...dynamicProps,
      color,
      label: pieceLabel,
      movesDirections: [
        { row: -2, col: 1 },
        { row: -1, col: 2 },
        { row: 1, col: 2 },
        { row: 2, col: 1 },
        { row: 2, col: -1 },
        { row: 1, col: -2 },
        { row: -1, col: -2 },
        { row: -2, col: -1 }
      ],
      maxHitPoints: 12,
      canDie: true
    });
  }

  // update(next: IdentifiablePieceState) {
  //   this.props = next;
  // }

  evalMove(game: Game): Move[] {
    // the rules for the knight algortighm

    // returns all the possible moves;

    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    return evalEachDirectionForMove(pieceCoord, this, game);
  }

  evalAttack(game: Game): Attack[] {
    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];
    const attacks: Attack[] = [];
    const moved = getPieceMoveThisTurn(this, game);
    const attackBonus =
      getAllAdjecentPiecesToPosition(pieceCoord, game.board.pieceLayout).filter(
        (p) => p instanceof Queen && p.state.color === this.state.color
      ).length > 0;
    this.state.movesDirections.map((dir) => {
      const target: Coord = {
        row: pieceCoord.row + dir.row,
        col: pieceCoord.col + dir.col
      };
      if (target.row === moved?.from.row && target.col === moved.from.col) {
        return;
      }
      if (
        target.row >= game.board.pieceLayout.length ||
        target.col >= game.board.pieceLayout[0].length ||
        target.row < 0 ||
        target.col < 0
      ) {
        return;
      }
      const targetPiece = game.board.pieceLayout[target.row][target.col];
      if (targetPiece !== 0 && targetPiece.state.color !== this.state.color) {
        attacks.push({
          from: pieceCoord,
          to: target,
          type: 'melee',
          ...(moved && { movementAttackBonus: true }),
          ...(attackBonus && { attackBonus: true })
        });
      }
    });

    return attacks;
  }

  executeAttack(
    game: Game,
    attack: Attack
  ): Result<PieceLayoutState, AttackTargetPieceUndefined> {
    const targetPiece = game.board.pieceLayout[attack.to.row][attack.to.col];
    //TODO: Better typecheck. Deal with error handling
    if (targetPiece === 0) {
      return new Err({
        type: 'TargetPieceIsUndefined',
        content: undefined
      });
    }
    return Ok({} as PieceLayoutState);
  }
}
