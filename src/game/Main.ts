import { Board } from './Board/Board';
import { createTerrain } from './terrain';
import { BoardState, GameState, PiecesLayout } from './types';

export class Maha {
  private state: GameState;
  private boardState: BoardState;
  private board: Board;

  constructor() {
    this.state = this.newGameState();
    this.boardState = {
      terrain: createTerrain({ width: 100 }),
      pieceLayout: this.getDetaultPiecesLayout(),
      pieceCoordsById: {}
    };
    this.board = new Board(this.boardState);
  }

  private getDetaultPiecesLayout(): PiecesLayout {
    return [] as PiecesLayout;
  }

  private newGameState(): GameState {
    return {
      board: this.boardState,
      phase: 'move',
      nextMoves: []
    };
  }
}
