import { Game } from 'src/gameMechanics/Game/Game';
import { Color } from 'src/gameMechanics/util/types';
import { Attack, Move } from 'src/gameMechanics/Game/types';
import { Piece } from 'src/gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from 'src/gameMechanics/Piece/types';
import { range, Coord } from 'src/gameMechanics/util';

const pieceLabel = 'King';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 3,
  moveRange: 1,
  attackRange: 1,
  attackDamage: 5,
  canAttack: true
};

export class King extends Piece {
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
        { row: -1, col: 0 },
        { row: -1, col: 1 },
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: -1 },
        { row: 0, col: -1 },
        { row: -1, col: -1 }
      ],
      maxHitPoints: 3,
      canDie: false
    });
  }

  // update(next: IdentifiablePieceState) {
  //   this.props = next;
  // }

  evalMove(game: Game): Move[] {
    // the rules for the king algortighm

    // returns all the possible moves;

    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    const moves: Move[] = [];

    this.state.movesDirections.map((dir) => {
      const deltaRow = dir.row;
      const deltaCol = dir.col;
      const potentialTargetSquare: Coord = {
        row: pieceCoord.row + deltaRow,
        col: pieceCoord.col + deltaCol
      };
      if (
        potentialTargetSquare.row >= game.board.pieceLayout.length ||
        potentialTargetSquare.col >= game.board.pieceLayout[0].length ||
        potentialTargetSquare.row < 0 ||
        potentialTargetSquare.col < 0
      ) {
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
      }
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
