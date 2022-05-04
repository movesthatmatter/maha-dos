import { Board } from 'src/gameMechanics/Board/Board';
import { coordToMatrixIndex, matrixInsertMany } from 'src/gameMechanics/util';
import { DEFAULT_MAHA_CONFIGURATOR, mahaPieceRegistry } from './config';
import { MahaGameReconciliator } from './MahaGameReconciliator';
import { mahaChessSquareToCoord } from './util';

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
