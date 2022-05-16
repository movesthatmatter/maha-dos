import { MahaGame } from '../../MahaGame';
import {
  GameConfigurator,
  GameStateInMovePhase
} from '../../../gameMechanics/Game/types';
import { Attack, GameHistory, Move } from '../../../gameMechanics/commonTypes';
import { mahaPieceRegistry } from '../registry';
import { Pawn } from '../Pawn';

describe('eval moves', () => {
  test('test moves for King', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        ['bR', 0, 'bR', 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 'bK', 'bB', 0],
        [0, 'wR', 0, 0, 0],
        [0, 0, 0, 0, 0]
      ]
    };
    const game = new MahaGame(configuration);

    const piece = game.board.getPieceByCoord({ row: 2, col: 2 });

    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const { state } = game;
    game.load({
      ...state,
      state: 'inProgress',
      history: [],
      phase: 'move',
      white: {
        canDraw: true,
        moves: []
      },
      black: {
        canDraw: true,
        moves: []
      }
    } as GameStateInMovePhase);

    const moves = piece.evalMove(game);

    const expectedMoves: Move[] = [
      {
        from: { row: 2, col: 2 },
        to: { row: 1, col: 2 },
        piece: piece.state
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 1, col: 3 },
        piece: piece.state
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 3, col: 3 },
        piece: piece.state
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 3, col: 2 },
        piece: piece.state
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 2, col: 1 },
        piece: piece.state
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 1, col: 1 },
        piece: piece.state
      }
    ];

    expect(moves).toEqual(expectedMoves);
  });

  test('test moves for King with castling options', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 8 },
      pieceLayout: [
        ['wR', 'wN', 0, 'wK', 0, 0, 'wR', 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        ['bR', 0, 0, 'bK', 0, 0, 0, 'bR']
      ]
    };
    const game = new MahaGame(configuration);

    const whitePiece = game.board.getPieceByCoord({ row: 0, col: 3 });
    const blackPiece = game.board.getPieceByCoord({ row: 7, col: 3 });

    expect(whitePiece).toBeDefined();
    expect(blackPiece).toBeDefined();

    if (!whitePiece || !blackPiece) {
      return;
    }

    const { state } = game;
    game.load({
      ...state,
      state: 'inProgress',
      history: [],
      phase: 'move',
      white: {
        canDraw: true,
        moves: []
      },
      black: {
        canDraw: true,
        moves: []
      }
    } as GameStateInMovePhase);

    const whiteMoves = whitePiece.evalMove(game);
    const blackMoves = blackPiece.evalMove(game);

    const expectedBlackMoves: Move[] = [
      {
        from: { row: 7, col: 3 },
        to: { row: 6, col: 3 },
        piece: blackPiece.state
      },
      {
        from: { row: 7, col: 3 },
        to: { row: 6, col: 4 },
        piece: blackPiece.state
      },
      {
        from: { row: 7, col: 3 },
        to: { row: 7, col: 4 },
        piece: blackPiece.state
      },
      {
        from: { row: 7, col: 3 },
        to: { row: 7, col: 2 },
        piece: blackPiece.state
      },
      {
        from: { row: 7, col: 3 },
        to: { row: 6, col: 2 },
        piece: blackPiece.state
      },
      {
        from: { row: 7, col: 3 },
        to: { row: 7, col: 5 },
        piece: blackPiece.state,
        castle: {
          from: { row: 7, col: 7 },
          to: { row: 7, col: 4 }
        }
      },
      {
        from: { row: 7, col: 3 },
        to: { row: 7, col: 1 },
        piece: blackPiece.state,
        castle: {
          from: { row: 7, col: 0 },
          to: { row: 7, col: 2 }
        }
      }
    ];

    const expectedWhiteMoves: Move[] = [
      {
        from: { row: 0, col: 3 },
        to: { row: 0, col: 4 },
        piece: whitePiece.state
      },
      {
        from: { row: 0, col: 3 },
        to: { row: 1, col: 4 },
        piece: whitePiece.state
      },
      {
        from: { row: 0, col: 3 },
        to: { row: 1, col: 3 },
        piece: whitePiece.state
      },
      {
        from: { row: 0, col: 3 },
        to: { row: 1, col: 2 },
        piece: whitePiece.state
      },
      {
        from: { row: 0, col: 3 },
        to: { row: 0, col: 2 },
        piece: whitePiece.state
      },
      {
        from: { row: 0, col: 3 },
        to: { row: 0, col: 5 },
        piece: whitePiece.state,
        castle: {
          from: { row: 0, col: 6 },
          to: { row: 0, col: 4 }
        }
      }
    ];

    expect(whiteMoves).toEqual(expectedWhiteMoves);
  });
});

describe('eval attacks', () => {
  test('King random attacks with no movement before', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6 },
      pieceLayout: [
        [0, 0, 0, 0, 0, 0],
        [0, 'bP', 'bB', 0, 0, 0],
        [0, 0, 'bQ', 0, 'bK', 0],
        [0, 'wQ', 'wK', 0, 'bP', 0],
        [0, 'bP', 0, 'bP', 'bN', 0],
        [0, 'bP', 0, 0, 0, 0]
      ]
    };
    const game = new MahaGame(configuration);
    const piece = game.board.getPieceByCoord({ row: 3, col: 2 });
    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const attacks = piece.evalAttack(game);
    const expected: Attack[] = [
      { from: { row: 3, col: 2 }, to: { row: 2, col: 2 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 4, col: 3 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 4, col: 1 }, type: 'melee' }
    ];

    expect(attacks).toEqual(expected);
  });

  test('King random attacks with prior movement', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6 },
      pieceLayout: [
        [0, 0, 0, 0, 0, 0],
        [0, 'bP', 'bB', 'bP', 0, 0],
        [0, 'bN', 'bQ', 'bN', 'bK', 0],
        [0, 'bQ', 'wK', 'bP', 'bP', 0],
        [0, 'bP', 0, 'bP', 'bN', 0],
        [0, 'bP', 0, 0, 0, 0]
      ]
    };
    const game = new MahaGame(configuration);
    const piece = game.board.getPieceByCoord({ row: 3, col: 2 });
    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const history: GameHistory = [
      [
        {
          white: [
            {
              from: { row: 4, col: 4 },
              to: { row: 3, col: 2 },
              piece: piece.state
            }
          ],
          black: [
            {
              from: { row: 0, col: 1 },
              to: { row: 1, col: 1 },
              piece: new Pawn('black', 'bP').state
            }
          ]
        },
        {
          white: [],
          black: []
        }
      ]
    ];

    const attacks = piece.evalAttack(game);
    const expected: Attack[] = [
      { from: { row: 3, col: 2 }, to: { row: 2, col: 2 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 2, col: 3 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 3, col: 3 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 4, col: 3 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 4, col: 1 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 3, col: 1 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 2, col: 1 }, type: 'melee' }
    ];

    expect(attacks).toEqual(expected);
  });

  test('King attacks with defense bonus', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6 },
      pieceLayout: [
        [0, 0, 0, 0, 0, 0],
        [0, 'bP', 'bB', 'bP', 0, 0],
        [0, 0, 'bQ', 'wR', 'bK', 0],
        [0, 0, 'wK', 'bP', 'bP', 0],
        [0, 'bP', 0, 'bP', 'bN', 0],
        [0, 'bP', 0, 0, 0, 0]
      ]
    };
    const game = new MahaGame(configuration);
    const piece = game.board.getPieceByCoord({ row: 3, col: 2 });
    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const history: GameHistory = [
      [
        {
          white: [
            {
              from: { row: 4, col: 4 },
              to: { row: 3, col: 2 },
              piece: piece.state
            }
          ],
          black: [
            {
              from: { row: 0, col: 1 },
              to: { row: 1, col: 1 },
              piece: new Pawn('black', 'bP').state
            }
          ]
        },
        {
          white: [],
          black: []
        }
      ]
    ];

    const attacks = piece.evalAttack(game);
    const expected: Attack[] = [
      {
        from: { row: 3, col: 2 },
        to: { row: 2, col: 2 },
        type: 'melee'
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 3, col: 3 },
        type: 'melee'
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 4, col: 3 },
        type: 'melee'
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 4, col: 1 },
        type: 'melee'
      }
    ];

    expect(attacks).toEqual(expected);
  });

  test('King attacks next to opposite rook, no defense bonus', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6 },
      pieceLayout: [
        [0, 0, 0, 0, 0, 0],
        [0, 'bP', 'bB', 'bP', 0, 0],
        [0, 0, 'bQ', 'bR', 'bK', 0],
        [0, 0, 'wK', 'bP', 'bP', 0],
        [0, 'bP', 0, 'bP', 'bN', 0],
        [0, 'bP', 0, 0, 0, 0]
      ]
    };
    const game = new MahaGame(configuration);
    const piece = game.board.getPieceByCoord({ row: 3, col: 2 });
    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const history: GameHistory = [
      [
        {
          white: [
            {
              from: { row: 4, col: 4 },
              to: { row: 3, col: 2 },
              piece: piece.state
            }
          ],
          black: [
            {
              from: { row: 0, col: 1 },
              to: { row: 1, col: 1 },
              piece: new Pawn('black', 'bP').state
            }
          ]
        },
        {
          white: [],
          black: []
        }
      ]
    ];

    const attacks = piece.evalAttack(game);
    const expected: Attack[] = [
      {
        from: { row: 3, col: 2 },
        to: { row: 2, col: 2 },
        type: 'melee'
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 2, col: 3 },
        type: 'melee'
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 3, col: 3 },
        type: 'melee'
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 4, col: 3 },
        type: 'melee'
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 4, col: 1 },
        type: 'melee'
      }
    ];

    expect(attacks).toEqual(expected);
  });
});
