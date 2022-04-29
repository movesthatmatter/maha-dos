import { Color } from 'src/gameMechanics/util/types';
import { Game } from 'src/gameMechanics/Game/Game';
import { Attack, Move } from 'src/gameMechanics/Game/types';
import { Piece } from 'src/gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from 'src/gameMechanics/Piece/types';
import {range, Coord} from 'src/gameMechanics/util';

type PieceLabel = 'Rook';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 15,
  moveRange: 4,
  attackRange: 6,
  attackDamage: 3,
  canAttack: true,
};

export class Rook extends Piece<PieceLabel> {
  constructor(
    id: IdentifiablePieceState<PieceLabel>['id'],
    color: Color,
    dynamicProps?: Partial<PieceDynamicProps>
  ) {
    super(id, {
      ...DEFAULT_DYNAMIC_PROPS,
      ...dynamicProps,
      color,
      label: 'Rook',
      movesDirections: [
        {row: -1, col: 0},
        {row: 0, col: 1},
        {row: 1, col: 0},
        {row: 0, col: -1}
      ],
      maxHitPoints: 15,
      canDie: true,
    });
  }

  // update(next: IdentifiablePieceState) {
  //   this.props = next;
  // }

  evalMove(game: Game): Move[] {
    // the rules for the Rook algortighm

    // returns all the possible moves;

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
        const potentialTargetSquare: Coord= {
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

    return moves;
  }

  evalAttack(game: Game): Attack[] {
    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    return [];
  }

  // evalAttack(gameState: GameState) {
  //   //returns new pieces data
  // }
}
