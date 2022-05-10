import { Board } from '../gameMechanics/Board/Board';
import { ShortAttack } from '../gameMechanics/commonTypes';
import {
  coordToMatrixIndex,
  matrixGet,
  matrixInsertMany,
  printMatrix
} from '../gameMechanics/util';
import { Result } from 'ts-results';
import { DEFAULT_MAHA_CONFIGURATOR, mahaPieceRegistry } from './config';
import { MahaGameReconciliator } from './MahaGameReconciliator';
import { mahaChessSquareToCoord } from './util';
import {
  toPrintableBoard,
  toPrintableBoardWithState
} from 'src/gameMechanics/Board/util';
import { Queen } from './Pieces/Queen';

describe('submitMoves', () => {
  test('first player submitting from initial position - ok', () => {
    const reconciliator = new MahaGameReconciliator();

    const whiteMoves = [
      {
        from: mahaChessSquareToCoord('e2'),
        to: mahaChessSquareToCoord('e4')
      }
    ];

    const res = reconciliator.submitMoves({
      color: 'white',
      moves: whiteMoves
    });

    expect(res.ok).toBe(true);
    if (!res.ok) {
      return;
    }

    const actual = res.val;

    const defaultMahaBoard = new Board(
      mahaPieceRegistry,
      DEFAULT_MAHA_CONFIGURATOR
    );

    expect(actual.state).toEqual('inProgress');
    expect(actual.phase).toEqual('move');
    expect(actual.submissionStatus).toEqual('partial');
    expect(actual.boardState).toEqual(defaultMahaBoard.state);
    expect(actual.history).toEqual([]); // Nothing in the history yet
    expect(actual.white).toEqual({
      canDraw: false,
      moves: whiteMoves
    });
    expect(actual.black).toEqual({
      canDraw: true,
      moves: undefined
    });
  });

  test('both players submitting from initial position - ok', () => {
    const reconciliator = new MahaGameReconciliator();

    const whiteMoves = [
      {
        from: mahaChessSquareToCoord('e2'),
        to: mahaChessSquareToCoord('e4')
      }
    ];

    const whiteMovedPieces = whiteMoves.map((m) =>
      reconciliator.board.getPieceByCoord(m.from)
    );

    const resWhiteSubmission = reconciliator.submitMoves({
      color: 'white',
      moves: whiteMoves
    });

    expect(resWhiteSubmission.ok).toBe(true);
    if (!resWhiteSubmission.ok) {
      return;
    }

    const blackMoves = [
      {
        from: mahaChessSquareToCoord('e7'),
        to: mahaChessSquareToCoord('e6')
      }
    ];

    const blackMovedPieces = blackMoves.map((m) =>
      reconciliator.board.getPieceByCoord(m.from)
    );

    const resBlackSubmission = reconciliator.submitMoves({
      color: 'black',
      moves: blackMoves
    });

    expect(resBlackSubmission.ok).toBe(true);
    if (!resBlackSubmission.ok) {
      return;
    }

    const actual = resBlackSubmission.val;

    const defaultMahaBoard = new Board(
      mahaPieceRegistry,
      DEFAULT_MAHA_CONFIGURATOR
    );

    expect(actual.state).toEqual('inProgress');
    expect(actual.phase).toEqual('attack');
    expect(actual.submissionStatus).toEqual('none');
    expect(actual.white).toEqual({
      canDraw: true,
      attacks: undefined
    });
    expect(actual.black).toEqual({
      canDraw: true,
      attacks: undefined
    });

    const expectedGameTurn = [
      {
        white: whiteMoves.map((m, i) => ({
          ...m,
          piece: whiteMovedPieces[i]?.state
        })),
        black: blackMoves.map((m, i) => ({
          ...m,
          piece: blackMovedPieces[i]?.state
        }))
      }
    ];

    expect(actual.history).toHaveLength(1);
    expect(actual.history).toEqual([expectedGameTurn]);
    expect(actual.boardState.pieceLayoutState).toEqual(
      matrixInsertMany(defaultMahaBoard.state.pieceLayoutState, [
        {
          index: coordToMatrixIndex(mahaChessSquareToCoord('e7')),
          nextVal: 0
        },
        {
          index: coordToMatrixIndex(mahaChessSquareToCoord('e6')),
          nextVal: blackMovedPieces[0]?.state
        },
        {
          index: coordToMatrixIndex(mahaChessSquareToCoord('e2')),
          nextVal: 0
        },
        {
          index: coordToMatrixIndex(mahaChessSquareToCoord('e4')),
          nextVal: whiteMovedPieces[0]?.state
        }
      ])
    );
  });
});

describe('submitAttacks', () => {
  test('one player submits attacks after first move phase - ok', () => {
    const reconciliator = new MahaGameReconciliator();

    const whiteMoves = [
      {
        from: mahaChessSquareToCoord('e2'),
        to: mahaChessSquareToCoord('e4')
      },
      {
        from: mahaChessSquareToCoord('d2'),
        to: mahaChessSquareToCoord('d4')
      }
    ];

    const blackMoves = [
      {
        from: mahaChessSquareToCoord('e7'),
        to: mahaChessSquareToCoord('e5')
      },
      {
        from: mahaChessSquareToCoord('d7'),
        to: mahaChessSquareToCoord('d5')
      }
    ];

    const resMoveSubmission = Result.all(
      reconciliator.submitMoves({
        color: 'white',
        moves: whiteMoves
      }),
      reconciliator.submitMoves({
        color: 'black',
        moves: blackMoves
      })
    );

    const boardStateBeforeAttack = reconciliator.board.state;

    expect(resMoveSubmission.ok).toBe(true);
    if (!resMoveSubmission.ok) {
      return;
    }

    const whiteAttacks: ShortAttack[] = [
      {
        from: mahaChessSquareToCoord('e4'),
        to: mahaChessSquareToCoord('d5'),
        type: 'melee'
      }
    ];

    const whiteAttackRes = reconciliator.submitAttacks({
      color: 'white',
      attacks: whiteAttacks
    });

    expect(whiteAttackRes.ok).toBe(true);
    if (!whiteAttackRes.ok) {
      return;
    }

    const actual = whiteAttackRes.val;

    expect(actual.state).toBe('inProgress');
    expect(actual.phase).toBe('attack');
    expect(actual.submissionStatus).toBe('partial');
    expect(actual.boardState).toEqual(boardStateBeforeAttack);
    expect(actual.white).toEqual({
      canDraw: false,
      attacks: whiteAttacks
    });
    expect(actual.black).toEqual({
      canDraw: true,
      attacks: undefined
    });
  });

  test('both players submit attacks after first move phase - ok', () => {
    const reconciliator = new MahaGameReconciliator();

    // printMatrix(toPrintableBoard(reconciliator.board.state))

    const whiteMoves = [
      {
        from: mahaChessSquareToCoord('e2'),
        to: mahaChessSquareToCoord('e4')
      },
      {
        from: mahaChessSquareToCoord('d2'),
        to: mahaChessSquareToCoord('d4')
      },
      {
        from: mahaChessSquareToCoord('b1'),
        to: mahaChessSquareToCoord('c3')
      },
      {
        from: mahaChessSquareToCoord('g1'),
        to: mahaChessSquareToCoord('f3')
      }
    ];

    const blackMoves = [
      {
        from: mahaChessSquareToCoord('e7'),
        to: mahaChessSquareToCoord('e5')
      },
      {
        from: mahaChessSquareToCoord('d7'),
        to: mahaChessSquareToCoord('d5')
      },
      {
        from: mahaChessSquareToCoord('b8'),
        to: mahaChessSquareToCoord('c6')
      },
      {
        from: mahaChessSquareToCoord('g8'),
        to: mahaChessSquareToCoord('f6')
      }
    ];

    const whiteMovedPieces = whiteMoves.map((m) =>
      reconciliator.board.getPieceByCoord(m.from)
    );

    const blackMovedPieces = blackMoves.map((m) =>
      reconciliator.board.getPieceByCoord(m.from)
    );

    const resMoveSubmission = Result.all(
      reconciliator.submitMoves({
        color: 'white',
        moves: whiteMoves
      }),
      reconciliator.submitMoves({
        color: 'black',
        moves: blackMoves
      })
    );

    const boardStateBeforeAttack = reconciliator.board.state;

    printMatrix(toPrintableBoard(boardStateBeforeAttack));

    expect(resMoveSubmission.ok).toBe(true);
    if (!resMoveSubmission.ok) {
      return;
    }

    const whiteAttacks: ShortAttack[] = [
      {
        from: mahaChessSquareToCoord('e4'),
        to: mahaChessSquareToCoord('d5'),
        type: 'melee'
      }
    ];

    const whiteAttackRes = reconciliator.submitAttacks({
      color: 'white',
      attacks: whiteAttacks
    });

    expect(whiteAttackRes.ok).toBe(true);
    if (!whiteAttackRes.ok) {
      return;
    }

    const blackAttacks: ShortAttack[] = [
      {
        from: mahaChessSquareToCoord('e5'),
        to: mahaChessSquareToCoord('d4'),
        type: 'melee'
      }
    ];

    const blackAttackRes = reconciliator.submitAttacks({
      color: 'black',
      attacks: blackAttacks
    });

    expect(blackAttackRes.ok).toBe(true);
    if (!blackAttackRes.ok) {
      return;
    }

    const actual = blackAttackRes.val;

    const expectedGameTurn = [
      {
        white: whiteMoves.map((shortAttack, i) => ({
          ...shortAttack,
          piece: whiteMovedPieces[i]?.state
        })),
        black: blackMoves.map((shortAttack, i) => ({
          ...shortAttack,
          piece: blackMovedPieces[i]?.state
        }))
      },
      {
        white: whiteAttacks.map((shortAttack, i) => ({
          attack: shortAttack,
          damage: 2,
          willTake: true
        })),
        black: blackAttacks.map((shortAttack, i) => ({
          attack: shortAttack,
          damage: 2,
          willTake: true
        }))
      }
    ];

    expect(actual.state).toBe('inProgress');
    expect(actual.phase).toBe('move');
    expect(actual.submissionStatus).toBe('none');

    expect(actual.history).toHaveLength(1);
    expect(actual.history).toEqual([expectedGameTurn]);

    const actualD5 = matrixGet(
      actual.boardState.pieceLayoutState,
      coordToMatrixIndex(mahaChessSquareToCoord('d5'))
    );
    const expectedD5 = matrixGet(
      boardStateBeforeAttack.pieceLayoutState,
      coordToMatrixIndex(mahaChessSquareToCoord('e4'))
    );
    expect(actualD5).toEqual(expectedD5);

    const actualD4 = matrixGet(
      actual.boardState.pieceLayoutState,
      coordToMatrixIndex(mahaChessSquareToCoord('d4'))
    );
    const expectedD4 = matrixGet(
      boardStateBeforeAttack.pieceLayoutState,
      coordToMatrixIndex(mahaChessSquareToCoord('e5'))
    );
    expect(actualD4).toEqual(expectedD4);
  });

  test.only('submit attack from advanced position - ok', () => {
    const reconciliator = new MahaGameReconciliator();

    const initialBoardState = reconciliator.board.state;

    const resSubmission = Result.all(
      reconciliator.submitMoves({
        color: 'white',
        moves: [
          {
            from: mahaChessSquareToCoord('e2'),
            to: mahaChessSquareToCoord('e4')
          },
          {
            from: mahaChessSquareToCoord('d2'),
            to: mahaChessSquareToCoord('d4')
          },
          {
            from: mahaChessSquareToCoord('b1'),
            to: mahaChessSquareToCoord('c3')
          },
          {
            from: mahaChessSquareToCoord('g1'),
            to: mahaChessSquareToCoord('f3')
          },
          {
            from: mahaChessSquareToCoord('c1'),
            to: mahaChessSquareToCoord('g5')
          },
          {
            from: mahaChessSquareToCoord('f1'),
            to: mahaChessSquareToCoord('b5')
          }
        ]
      }),
      reconciliator.submitMoves({
        color: 'black',
        moves: [
          {
            from: mahaChessSquareToCoord('e7'),
            to: mahaChessSquareToCoord('e5')
          },
          {
            from: mahaChessSquareToCoord('d7'),
            to: mahaChessSquareToCoord('d5')
          },
          {
            from: mahaChessSquareToCoord('b8'),
            to: mahaChessSquareToCoord('c6')
          },
          {
            from: mahaChessSquareToCoord('g8'),
            to: mahaChessSquareToCoord('f6')
          },
          {
            from: mahaChessSquareToCoord('c8'),
            to: mahaChessSquareToCoord('g4')
          },
          {
            from: mahaChessSquareToCoord('f8'),
            to: mahaChessSquareToCoord('b4')
          }
        ]
      })
    )
      .andThen(() =>
        Result.all(
          reconciliator.submitAttacks({
            color: 'white',
            attacks: [
              {
                from: mahaChessSquareToCoord('e4'),
                to: mahaChessSquareToCoord('d5'),
                type: 'melee'
              }
            ]
          }),
          reconciliator.submitAttacks({
            color: 'black',
            attacks: [
              {
                from: mahaChessSquareToCoord('e5'),
                to: mahaChessSquareToCoord('d4'),
                type: 'melee'
              }
            ]
          })
        )
      )
      .andThen(() =>
        Result.all(
          reconciliator.submitMoves({
            color: 'white',
            moves: [
              {
                from: mahaChessSquareToCoord('f3'),
                to: mahaChessSquareToCoord('h4')
              }
            ]
          }),
          reconciliator.submitMoves({
            color: 'black',
            moves: [
              {
                from: mahaChessSquareToCoord('f6'),
                to: mahaChessSquareToCoord('h5')
              }
            ]
          })
        )
      );

    expect(resSubmission.ok).toBe(true);
    if (!resSubmission.ok) {
      return;
    }

    const actualAttackRes = Result.all(
      reconciliator.submitAttacks({
        color: 'white',
        attacks: [
          {
            from: mahaChessSquareToCoord('g5'), // white bishop
            to: mahaChessSquareToCoord('d8'), // black queen
            type: 'melee'
          }
        ]
      }),
      reconciliator.submitAttacks({
        color: 'black',
        attacks: [
          {
            from: mahaChessSquareToCoord('g4'), // black bishop
            to: mahaChessSquareToCoord('d1'), // white queen
            type: 'melee'
          }
        ]
      })
    );

    expect(actualAttackRes.ok).toBe(true);
    if (!actualAttackRes.ok) {
      return;
    }

    const actual = actualAttackRes.val[1];

    // console.log('actual', actual);

    printMatrix(toPrintableBoardWithState(reconciliator.board.state));

    expect(actual.state).toBe('inProgress');
    expect(actual.phase).toBe('move');
    expect(actual.submissionStatus).toBe('none');

    const actualWhiteQueenD1 = matrixGet(
      actual.boardState.pieceLayoutState,
      coordToMatrixIndex(mahaChessSquareToCoord('d1'))
    );
    const expectedWhiteQueenD1 = {
      ...matrixGet(
        initialBoardState.pieceLayoutState,
        coordToMatrixIndex(mahaChessSquareToCoord('d1'))
      ),
      hitPoints: 17
    };
    expect(actualWhiteQueenD1).toEqual(expectedWhiteQueenD1);
  });
});
