import { Result } from 'ts-results';
import { Coord } from '../util/types';
import {
  Attack,
  GameConfigurator,
  GameHistory,
  GameState,
  GameWinner,
  Move
} from './types';
import { AttackNotPossibleError, MoveNotPossibleError } from './errorTypes';
import { Board } from '../Board/Board';
import { PieceRegistry } from '../Piece/types';

export interface IGame<PR extends PieceRegistry = PieceRegistry> {
  state: GameState;

  board: Board<PR>;

  // Loads a new GameState and does all the needed calculations
  load(state: GameState): void;

  // When a Move is Succesfully Drawn it gets appended to the nextMoves List of the "move" phase
  drawMove(from: Coord, to: Coord): Result<Move, MoveNotPossibleError>;

  // When an Attack is Succesfully Drawn it gets appended to the nextAttacks List of the "attack" phase
  drawAttack(from: Coord, to: Coord): Result<Attack, AttackNotPossibleError>;
}

type GameProps = {
  history: GameHistory;
  winner?: GameWinner;
};

export class Game<PR extends PieceRegistry = PieceRegistry> implements IGame {
  state: GameState;

  board: Board<PR>;

  constructor(
    pieceRegistry: PR,
    configurator: Pick<GameConfigurator<PR>, 'pieceLayout' | 'terrain'>,
    gameProps?: GameProps
  ) {
    this.board = new Board(pieceRegistry, configurator);
    this.state = this.getState(gameProps);
  }

  private getState = (gameProps?: GameProps): GameState => {
    if (!gameProps || gameProps.history.length === 0) {
      return {
        state: 'pending',
        winner: undefined,
        history: [],
        boardState: this.board.state
      };
    }

    if (gameProps.history.length > 0 && gameProps.winner) {
      return {
        state: 'completed',
        winner: gameProps.winner,
        history: gameProps.history,
        boardState: this.board.state
      };
    }

    // const [movePhase, attackPhase] = gameProps.history.slice(-1)[0];

    return {
      state: 'inProgress',
      winner: undefined,
      history: gameProps.history,
      boardState: this.board.state,

      phase: 'move',
      submissionStatus: 'none',
      white: {
        canDraw: true,
        moves: undefined
      },
      black: {
        canDraw: true,
        moves: undefined
      }

      // TODO: This needs to be actually calculated correctly
      // Demo for now
      // ...(attackPhase
      //   ?
      //       phase: 'attack',
      //       ...(attackPhase.white || attackPhase.black
      //         ? {
      //             ...(attackPhase.white && {
      //               white: {
      //                 canDraw: true,
      //                 attacks: attackPhase.white
      //               }
      //             }),
      //             ...(attackPhase.black && {
      //               black: {
      //                 canDraw: true,
      //                 attacks: attackPhase.black
      //               }
      //             })
      //           }
      //         : {
      //             submissionStatus: 'none',
      //             white: {
      //               canDraw: true,
      //               attacks: undefined
      //             },
      //             black: {
      //               canDraw: true,
      //               attacks: undefined
      //             }
      //           })
      //     }
      //   : {
      //       phase: 'move',
      //       ...(movePhase.white || movePhase.black
      //         ? {
      //             submissionStatus: 'partial',
      //             ...(movePhase.white && {
      //               white: {
      //                 canDraw: true,
      //                 moves: movePhase.white
      //               }
      //             }),
      //             ...(movePhase.black && {
      //               black: {
      //                 canDraw: true,
      //                 moves: movePhase.black
      //               }
      //             })
      //           }
      //         : {
      //             submissionStatus: 'none',
      //             white: {
      //               canDraw: true,
      //               moves: undefined
      //             },
      //             black: {
      //               canDraw: true,
      //               moves: undefined
      //             }
      //           })

      //       // submissionStatus: (movePhase.white || movePhase.black) ? 'partial' : 'none',
      //     })

      // phase: attackPhase ? 'attack' : 'move',
      // submissionStatus: 'none',
      // white: {
      //   canDraw: true,
      //   moves: []
      // },
      // black: {
      //   canDraw: true,
      //   moves: []
      // }
    };
  };

  // Loads a new GameState and does all the needed calculations
  load(state: GameState): void {}

  // // When a Move is Succesfully Drawn it gets appended to the nextMoves List of the "move" phase
  drawMove(from: Coord, to: Coord): Result<Move, MoveNotPossibleError> {
    return {} as Result<Move, MoveNotPossibleError>;
  }

  // // When an Attack is Succesfully Drawn it gets appended to the nextAttacks List of the "attack" phase
  drawAttack(from: Coord, to: Coord): Result<Attack, AttackNotPossibleError> {
    return {} as Result<Attack, AttackNotPossibleError>;
  }

  // get state(): GameState {
  //   return {
  //     ...this._state,
  //     boardState: this.board.state
  //   };
  // }
}
