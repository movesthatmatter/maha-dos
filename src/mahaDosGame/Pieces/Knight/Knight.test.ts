import { MahaGame } from '../../../mahaDosGame/MahaGame';
import {
  Attack,
  GameConfigurator,
  GameHistory,
  GameStateInProgress,
  Move
} from '../../../gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';
import { Pawn } from '../Pawn';

describe('eval moves for Knight', () => {
  test('test move', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        ['bR', 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 'bP', 0, 0, 0],
        [0, 0, 0, 'bP', 0],
        [0, 'wB', 'wN', 0, 0]
      ]
    };
    const game = new MahaGame(configuration);

    const piece = game.board.getPieceByCoord({ row: 4, col: 2 });
    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const moves = piece.evalMove(game);

    const expectedMoves: Move[] = [
      {
        from: { row: 4, col: 2 },
        to: { row: 2, col: 3 },
        piece: piece.state
      },
      {
        from: { row: 4, col: 2 },
        to: { row: 3, col: 4 },
        piece: piece.state
      },
      {
        from: { row: 4, col: 2 },
        to: { row: 3, col: 0 },
        piece: piece.state
      }
    ];

    expect(moves).toEqual(expectedMoves);
  });
});

describe('eval attacks for knight', () => {
  test('test attacks for knight that hasnt moved before', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 7, height: 6 },
      pieceLayout: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 'bN', 0, 0, 0],
        ['bQ', 0, 'bP', 0, 'bP', 'bP', 0],
        [0, 0, 'wN', 0, 0, 0, 0],
        [0, 0, 0, 0, 'bP', 0, 0],
        [0, 'bP', 'wP', 0, 0, 0, 0]
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
      { from: { row: 3, col: 2 }, to: { row: 1, col: 3 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 2, col: 4 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 4, col: 4 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 5, col: 1 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 2, col: 0 }, type: 'melee' }
    ];

    expect(attacks).toEqual(expected);
  });

  test('test attacks for knight with a move before', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 7, height: 6 },
      pieceLayout: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 'bN', 0, 0, 0],
        ['bQ', 0, 'bP', 0, 'bP', 'bP', 0],
        [0, 0, 'wN', 0, 0, 0, 0],
        [0, 0, 0, 0, 'bP', 0, 0],
        [0, 'bP', 'wP', 0, 0, 0, 0]
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
              from: { row: 5, col: 1 },
              to: { row: 3, col: 2 },
              piece: piece.state
            }
          ],
          black: [
            {
              from: { row: 4, col: 2 },
              to: { row: 5, col: 2 },
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
    const { state } = game;
    game.load({
      ...state,
      history
    } as GameStateInProgress);

    const attacks = piece.evalAttack(game);
    const expected: Attack[] = [
      {
        from: { row: 3, col: 2 },
        to: { row: 1, col: 3 },
        type: 'melee',
        movementAttackBonus: true
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 2, col: 4 },
        type: 'melee',
        movementAttackBonus: true
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 4, col: 4 },
        type: 'melee',
        movementAttackBonus: true
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 2, col: 0 },
        type: 'melee',
        movementAttackBonus: true
      }
    ];
    expect(attacks).toEqual(expected);
  });

  test('test attacks for knight with a Queen adjacent', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 7, height: 6 },
      pieceLayout: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 'bN', 0, 0, 0],
        ['bQ', 0, 'bP', 0, 'bP', 'bP', 0],
        [0, 0, 'wN', 'wQ', 0, 0, 0],
        [0, 0, 0, 0, 'bP', 0, 0],
        [0, 'bP', 'wP', 0, 0, 0, 0]
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
              from: { row: 5, col: 1 },
              to: { row: 3, col: 2 },
              piece: piece.state
            }
          ],
          black: [
            {
              from: { row: 4, col: 2 },
              to: { row: 5, col: 2 },
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
    const { state } = game;
    game.load({
      ...state,
      history
    } as GameStateInProgress);

    const attacks = piece.evalAttack(game);
    const expected: Attack[] = [
      {
        from: { row: 3, col: 2 },
        to: { row: 1, col: 3 },
        type: 'melee',
        movementAttackBonus: true,
        attackBonus: true
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 2, col: 4 },
        type: 'melee',
        movementAttackBonus: true,
        attackBonus: true
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 4, col: 4 },
        type: 'melee',
        movementAttackBonus: true,
        attackBonus: true
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 2, col: 0 },
        type: 'melee',
        movementAttackBonus: true,
        attackBonus: true
      }
    ];
    expect(attacks).toEqual(expected);
  });

  test('test attacks for knight with opposing queen next to it', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { height: 7, width: 6 },
      pieceLayout: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 'wQ', 'bN', 0, 0, 0],
        ['bQ', 0, 'bP', 0, 'bP', 'bP', 0],
        [0, 0, 'wN', 'bQ', 0, 0, 0],
        [0, 0, 0, 0, 'bP', 0, 0],
        [0, 'bP', 'wP', 0, 0, 0, 0]
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
      { from: { row: 3, col: 2 }, to: { row: 1, col: 3 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 2, col: 4 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 4, col: 4 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 5, col: 1 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 2, col: 0 }, type: 'melee' }
    ];

    expect(attacks).toEqual(expected);
  });
});
