import { Game } from 'src/gameMechanics/Game/Game';
import { Color } from 'src/gameMechanics/util/types';
import { Attack, Move } from 'src/gameMechanics/Game/types';
import { Piece } from 'src/gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from 'src/gameMechanics/Piece/types';
import {range, Coord} from 'src/gameMechanics/util';


const pieceLabel = 'Pawn';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 6,
  moveRange: 1, // can be 2 for en-pasant!
  attackRange: 1, // can be 2 for range
  attackDamage: 1,
  canAttack: true
};

export class Pawn extends Piece {
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
      movesDirections: [
        {row: -1, col: 0}
      ],
      attackDirection: [
        {row: -1, col: 1}
      ],
      maxHitPoints: 6,
      canDie: true
    });
  }

  // update(next: IdentifiablePieceState) {
  //   this.props = next;
  // }

  evalMove(game: Game): Move[] {
    // the rules for the pawn algortighm

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
    //take into account the attack direction!!
    return [];
  }

  // evalAttack(gameState: GameState) {
  //   //returns new pieces data
  // }
}