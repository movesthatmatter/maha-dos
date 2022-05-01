import { Game } from '../../../gameMechanics/Game/Game';
import { Color } from 'src/gameMechanics/util/types';
import { Attack, Move } from '../../../gameMechanics/Game/types';
import { Piece } from '../../../gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from '../../../gameMechanics/Piece/types';
import { range, Coord } from '../../../gameMechanics/util';
import { toDictIndexedBy } from 'src/gameMechanics/utils';
import { Rook } from '../Rook';
import { evalEachDirectionForMove } from '../utils';

const pieceLabel = 'Bishop';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 10,
  moveRange: 5,
  attackRange: 6,
  attackDamage: 3,
  canAttack: true
};

export class Bishop extends Piece {
  constructor(
    id: IdentifiablePieceState<typeof pieceLabel>['id'],
    color: Color,
    dynamicProps?: Partial<PieceDynamicProps>
  ) {
    super(id, {
      ...DEFAULT_DYNAMIC_PROPS,
      ...dynamicProps,
      color,
      label: pieceLabel,
      //Set them clockwise from top - right
      movesDirections: [
        { row: -1, col: 1 },
        { row: 1, col: 1 },
        { row: 1, col: -1 },
        { row: -1, col: -1 }
      ],
      maxHitPoints: 10,
      canDie: true
    });
  }

  evalMove(game: Game): Move[] {
    // the rules for the bishop algortighm

    // returns all the possible moves;

    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    return evalEachDirectionForMove(pieceCoord, this, game);
  }

  evalAttack(game: Game): Attack[] {
    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];
    const attacks: Attack[] = [];
    const length = game.state.history.length;

    if (
      length > 0 &&
      typeof game.state.history[length - 1][0][this.state.color] !== 'undefined'
    ) {
      const movesByPieceId = toDictIndexedBy(
        game.state.history[length - 1][0][this.state.color] as Move[],
        (move) => move.piece.id
      );

      if (this.state.id in movesByPieceId) {
        return attacks;
      }
    }
    this.state.movesDirections.map((dir) => {
      let hitObstacle = false;
      range(this.state.attackRange, 1).map((r) => {
        if (hitObstacle) {
          return;
        }
        const target: Coord = {
          row: pieceCoord.row + dir.row * r,
          col: pieceCoord.col + dir.col * r
        };
        if (
          target.row >= game.board.pieceLayout.length ||
          target.col >= game.board.pieceLayout[0].length ||
          target.row < 0 ||
          target.col < 0
        ) {
          return;
        }
        const targetPiece = game.board.pieceLayout[target.row][target.col];
        if (r === 1) {
          if (targetPiece instanceof Rook) {
            attacks.push({
              from: pieceCoord,
              to: target,
              type: 'range',
              ...(targetPiece.state.color === this.state.color && {
                special: 'heal'
              })
            });
            hitObstacle = true;
            return;
          }
        } else {
          if (targetPiece !== 0) {
            attacks.push({
              from: pieceCoord,
              to: target,
              type: 'range',
              ...(r < 4 &&
                targetPiece.state.color === this.state.color && {
                  special: 'heal'
                })
            });
            hitObstacle = true;
            return;
          }
        }
      });
    });

    return attacks;
  }

  // evalAttack(gameState: GameState) {
  //   //returns new pieces data
  // }
}
