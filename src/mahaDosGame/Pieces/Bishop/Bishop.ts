import { Game } from '../../../gameMechanics/Game/Game';
import { Color } from 'src/gameMechanics/util/types';
import { Attack, Move } from '../../../gameMechanics/Game/types';
import { Piece } from '../../../gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from '../../../gameMechanics/Piece/types';
import { range, Coord } from '../../../gameMechanics/util';

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
        { row: -1, col: -1 },
      ],
      maxHitPoints: 10,
      canDie: true
    });
  }

  // update(next: IdentifiablePieceState) {
  //   this.props = next;
  // }

  evalMove(game: Game): Move[] {
    // the rules for the knight algortighm

    // returns all the possible moves;

    // be able to grab the coords form the gameState

    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    const moves: Move[] = [];

    this.state.movesDirections.map((dir) => {
      let hitObstacle = false;
      range(this.state.moveRange, 1).map((range) => {
        if (hitObstacle) {
          return
        }
        const deltaRow = dir.row * range;
        const deltaCol = dir.col * range;
        const potentialTargetSquare: Coord = {
          row: pieceCoord.row + deltaRow,
          col: pieceCoord.col + deltaCol
        };
        if (
          (potentialTargetSquare.row >= game.board.pieceLayout.length) || 
          (potentialTargetSquare.col >= game.board.pieceLayout[0].length) || 
          ((potentialTargetSquare.row < 0) || (potentialTargetSquare.col < 0))) {
          return;
        } 
        if (
          game.board.pieceLayout[potentialTargetSquare.row][
            potentialTargetSquare.col
          ] === 0
        ) {
          const move: Move = {
            from: pieceCoord,
            to: potentialTargetSquare,
            piece: this.state
          };
          moves.push(move);
        } else {
          hitObstacle = true
          return;
        }
      });
    });

    // TODO: Add the coords
    return moves
  }

  evalAttack(game: Game): Attack[] {
    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    return [];
  }

  // evalAttack(gameState: GameState) {
  //   //returns new pieces data
  // }
}
