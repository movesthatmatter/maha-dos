import { Err, Ok, Result } from 'ts-results';
import { Coord } from '../util/types';
import {
  GameConfigurator,
  GameState,
  GameStateCompleted,
  GameStateInAttackPhase,
  GameStateInAttackPhaseWithPreparingSubmission,
  GameStateInMovePhase,
  GameStateInMovePhaseWithPreparingSubmission,
  GameStateInProgress,
  GameStatePending,
  GameWinner,
  InProgressGameStatePhaseSlice
} from './types';
import {
  getMoveNotPossibleError,
  getAttackNotPossibleError
} from './errors/helpers';
import { Board } from '../Board/Board';
import { coordsAreEqual, matrixForEach } from '../util';
import { AttackNotPossibleError, MoveNotPossibleError } from './errors';
import {
  isGameInAttackPhase,
  isGameInAttackPhaseWithPreparingSubmission,
  isGameInMovePhase,
  isGameInMovePhaseWithPreparingSubmission
} from './helpers';
import { IGame } from './IGame';
import { Attack, Color, GameHistory, Move, ShortMove } from '../commonTypes';
import { PieceRegistry } from '../Piece/types';

type GameProps = {
  history: GameHistory;
  winner?: GameWinner;
};

export type PartialGameStatePending = Omit<GameStatePending, 'boardState'>;
export type PartialGameStateInProgress = Omit<
  GameStateInProgress,
  'boardState'
> &
  InProgressGameStatePhaseSlice;
export type PartialGameStateCompleted = Omit<GameStateCompleted, 'boardState'>;

export type PartialState =
  | PartialGameStatePending
  | PartialGameStateInProgress
  | PartialGameStateCompleted;

export class Game<PR extends PieceRegistry = PieceRegistry> implements IGame {
  // private partialState: Pick<GameState, 'history' | 'state' | 'winner'>;

  // history: GameState['history'];

  // stateStatus: GameState['state'];

  // winner: GameState['winner'];

  // This is the state the Game class works with.
  //  The first level of the State, not the nested ones like board, etc..
  // As the nested ones get merged back in the state getter method
  protected partialState: PartialState;

  board: Board<PR>;

  constructor(
    protected pieceRegistry: PR,
    protected configurator: Pick<
      GameConfigurator<PR>,
      'pieceLayout' | 'terrain' | 'pieceAssets'
    >,
    protected gameProps?: GameProps
  ) {
    this.board = new Board(pieceRegistry, configurator);
    this.partialState = this.calcPartialState(gameProps);
  }

  private calcPartialState = (gameProps?: GameProps): PartialState => {
    if (!gameProps || gameProps.history.length === 0) {
      return {
        state: 'pending',
        winner: undefined,
        history: []
        // boardState: this.board.state
      };
    }

    if (gameProps.history.length > 0 && gameProps.winner) {
      return {
        state: 'completed',
        winner: gameProps.winner,
        history: gameProps.history
        // boardState: this.board.state
      };
    }

    //const [movePhase, attackPhase] = gameProps.history.slice(-1)[0];

    return {
      state: 'inProgress',
      winner: undefined,
      history: gameProps.history,
      // boardState: this.board.state,

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

  start(): void {
    if (this.state.state !== 'pending') {
      return;
    }

    const inProgressState: PartialGameStateInProgress = {
      ...this.partialState,
      state: 'inProgress',
      history: [],
      phase: 'move',
      submissionStatus: 'none',
      white: {
        canDraw: true,
        moves: undefined
      },
      black: {
        canDraw: true,
        moves: undefined
      },
      winner: undefined
    };

    this.partialState = inProgressState;
  }

  // Loads a new GameState and does all the needed calculations
  // TODO: Rename to setState
  load({ boardState, ...partialState }: GameState): void {
    this.board.setState(boardState);

    this.partialState = partialState;

    // TODO: Ensure the board state updates all of its derivates when set
    // this.board.setState(boardState);
  }

  // When a Move is Succesfully Drawn it gets appended to the nextMoves List of the "move" phase
  // TODO: TEST!
  drawMove(move: ShortMove): Result<
    {
      move: Move;
      gameState: GameState;
    },
    MoveNotPossibleError
  > {
    // Can't make a move when game is completed
    if (this.partialState.state === 'completed') {
      return new Err(getMoveNotPossibleError('GameIsCompleted'));
    }

    if (!(isGameInMovePhase(this.state) || this.state.state === 'pending')) {
      return new Err(getMoveNotPossibleError('GameNotInMovePhase'));
    }

    const piece = this.board.getPieceByCoord(move.from);

    if (!piece) {
      return new Err(getMoveNotPossibleError('PieceNotExistent'));
    }

    const dests = piece.evalMove(this);
    const moveIsPartOfDests = dests.find((d) => coordsAreEqual(d.to, move.to));

    // Move is Valid
    if (!moveIsPartOfDests) {
      return new Err(getMoveNotPossibleError('DestinationNotValid'));
    }

    const indexOfAPreviousMoveByPiece = (
      (this.state as GameStateInMovePhase)[piece.state.color].moves || []
    ).findIndex((m) => coordsAreEqual(m.from, move.from));

    if (indexOfAPreviousMoveByPiece !== -1) {
      this.partialState = {
        ...this.state,
        [piece.state.color]: {
          ...(this.state as GameStateInMovePhase)[piece.state.color],
          moves: (
            (this.state as GameStateInMovePhase)[piece.state.color].moves || []
          ).slice(0, indexOfAPreviousMoveByPiece)
        }
      };
    }

    // TODO: Add usecase for when a piece has already moved, but add it as TDD later
    //  PieceAlreadyMoved Error

    // if (isGameStateInMovePhaseWithPreparingSubmission)

    // console.log('no mas', !!moveIsPartOfDests);

    // const prevPiece = move.piece.
    // const nextPieceLayoutState = matrixInsertMany(
    //   prev.boardState.pieceLayoutState,
    //   [
    //     // {
    //     //   index: [move.from.row, move.from.col],
    //     //   nextVal: 0
    //     // },
    //     // {
    //     //   index: [move.to.row, move.to.col],
    //     //   nextVal: move.piece
    //     // }
    //   ]
    // );

    const preparingState: GameStateInMovePhaseWithPreparingSubmission = {
      ...this.state,
      state: 'inProgress',
      winner: undefined,
      submissionStatus: 'preparing',
      phase: 'move',

      ...(isGameInMovePhaseWithPreparingSubmission(this.state)
        ? {
            white: this.state.white,
            black: this.state.black
          }
        : {
            white: {
              canDraw: true,
              moves: []
            },
            black: {
              canDraw: true,
              moves: []
            }
          })
    };

    const nextMove: Move = {
      ...move,
      piece: piece.state
      // TODO: Add promotion
    };
    // TODO: Update the board and all the other state derivates
    this.partialState = {
      ...preparingState,
      ...(isGameInMovePhaseWithPreparingSubmission(preparingState) && {
        white: {
          ...preparingState.white,
          ...(nextMove.piece.color === 'white' && {
            moves: [...preparingState.white.moves, nextMove]
          })
        },
        black: {
          ...preparingState.black,
          ...(nextMove.piece.color === 'black' && {
            moves: [...preparingState.black.moves, nextMove]
          })
        }
      })
    };
    return new Ok({
      move: nextMove,
      gameState: this.state
    });
  }

  // // When an Attack is Succesfully Drawn it gets appended to the nextAttacks List of the "attack" phase
  // TODO: Test
  drawAttack(
    from: Coord,
    to: Coord
  ): Result<
    {
      attack: Attack;
      gameState: GameState;
    },
    AttackNotPossibleError
  > {
    // Can't make a move when game is completed
    if (this.partialState.state === 'completed') {
      return new Err(getAttackNotPossibleError('GameIsCompleted'));
    }

    if (!isGameInAttackPhase(this.state)) {
      return new Err(getAttackNotPossibleError('GameNotInMovePhase'));
    }

    const piece = this.board.getPieceByCoord(from);

    if (!piece) {
      return new Err(getAttackNotPossibleError('AttackerPieceNotExistent'));
    }

    const dests = piece.evalAttack(this);
    const attackIsPartOfDests = dests.find((d) => coordsAreEqual(d.to, to));

    // Attack is Valid
    if (!attackIsPartOfDests) {
      return new Err(getAttackNotPossibleError('DestinationNotValid'));
    }

    const indexOfAPreviousAttackByPiece = (
      (this.state as GameStateInAttackPhase)[piece.state.color].attacks || []
    ).findIndex((a) => coordsAreEqual(a.from, from));

    if (indexOfAPreviousAttackByPiece !== -1) {
      this.partialState = {
        ...this.state,
        [piece.state.color]: {
          ...(this.state as GameStateInAttackPhase)[piece.state.color],
          attacks: (
            (this.state as GameStateInAttackPhase)[piece.state.color].attacks ||
            []
          ).slice(0, indexOfAPreviousAttackByPiece)
        }
      };
    }

    const preparingState: GameStateInAttackPhaseWithPreparingSubmission = {
      ...this.state,
      history: [...this.state.history],
      state: 'inProgress',
      winner: undefined,
      submissionStatus: 'preparing',
      phase: 'attack',

      ...(isGameInAttackPhaseWithPreparingSubmission(this.state)
        ? {
            white: this.state.white,
            black: this.state.black
          }
        : {
            white: {
              canDraw: true,
              attacks: []
            },
            black: {
              canDraw: true,
              attacks: []
            }
          })
    };

    const attack: Attack = {
      from,
      to,
      type: 'melee' // TODO: make it dynamic
    };

    // TODO: Update the board and all the other state derivates
    this.partialState = {
      ...preparingState,
      ...(isGameInAttackPhaseWithPreparingSubmission(preparingState) && {
        white: {
          ...preparingState.white,
          ...(piece.state.color === 'white' && {
            attacks: [...preparingState.white.attacks, attack]
          })
        },
        black: {
          ...preparingState.black,
          ...(piece.state.color === 'black' && {
            attacks: [...preparingState.black.attacks, attack]
          })
        }
      })
    };

    return new Ok({
      attack,
      gameState: this.state
    });
  }

  evalIfPossibleAttacks(color: Color): boolean {
    return this.state.boardState.pieceLayoutState.some((row, rowIndex) =>
      row.some((col, colIndex) => {
        const piece = this.board.getPieceByCoord({
          row: rowIndex,
          col: colIndex
        });
        if (!piece || piece.state.color !== color) {
          return false;
        }

        return piece.evalAttack(this).length > 0;
      })
    );
  }

  get state(): GameState {
    return {
      ...this.partialState,
      boardState: this.board.state
    };
  }
}
