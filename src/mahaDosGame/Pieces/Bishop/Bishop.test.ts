import { MahaGame } from '../../MahaGame';
import { Bishop } from './Bishop';
import {
  GameConfigurator,
  GameStateInProgress,
  GameStateInMovePhase
} from '../../../gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';
import { generatePieceLabel } from '../../../gameMechanics/Board/util';
import { generate } from '../../..//mahaDosGame/helpers';
import {
  Attack,
  AttackOutcome,
  FullGameTurn,
  GameHistory,
  Move,
  PartialGameTurn
} from '../../../gameMechanics/commonTypes';

describe('eval moves for Bishop', () => {
  test('eval moves with freedom around', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 0, 0, 'bR'],
        [0, 'bR', 0, 0, 0],
        [0, 0, 'bB', 0, 0],
        [0, 0, 0, 0, 0],
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
        to: { row: 4, col: 4 },
        piece: piece.state
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 3, col: 1 },
        piece: piece.state
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 4, col: 0 },
        piece: piece.state
      }
    ];

    expect(moves).toEqual(expectedMoves);
  });
  test('eval moves with bishop blocked but prev moves clearing space', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        ['wP', 'wP', 'wP', 'wP', 'wP'],
        [0, 0, 'wB', 0, 0]
      ]
    };
    const game = new MahaGame(configuration);

    const piece = game.board.getPieceByCoord({ row: 4, col: 2 });

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
        moves: [
          {
            from: { row: 3, col: 1 },
            to: { row: 2, col: 1 }
          },
          {
            from: { row: 3, col: 3 },
            to: { row: 2, col: 3 }
          }
        ]
      },
      black: {
        canDraw: true,
        moves: []
      }
    } as GameStateInMovePhase);

    const moves = piece.evalMove(game);

    const expectedMoves: Move[] = [
      {
        from: { row: 4, col: 2 },
        to: { row: 3, col: 3 },
        piece: piece.state
      },
      {
        from: { row: 4, col: 2 },
        to: { row: 2, col: 4 },
        piece: piece.state
      },
      {
        from: { row: 4, col: 2 },
        to: { row: 3, col: 1 },
        piece: piece.state
      },
      {
        from: { row: 4, col: 2 },
        to: { row: 2, col: 0 },
        piece: piece.state
      }
    ];

    expect(moves).toEqual(expectedMoves);
  });
});

describe('Eval attacks for Bishop', () => {
  test('Attacks with no previous history. 1 melee (Piece is a Rook) and 1 range and 1 heal (black N)', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 0, 0, 'bN'],
        [0, 0, 0, 0, 0],
        [0, 0, 'bB', 0, 0],
        [0, 'wR', 0, 0, 0],
        [0, 0, 0, 0, 'wQ']
      ]
    };
    const game = new MahaGame(configuration);

    const piece = game.board.getPieceByCoord({ row: 2, col: 2 });
    const knight = game.board.getPieceByCoord({ row: 0, col: 4 });

    expect(knight).toBeDefined();
    if (!knight) {
      return;
    }
    knight.state.hitPoints = 3;

    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const attacks = piece.evalAttack(game);
    const expected: Attack[] = [
      {
        from: { row: 2, col: 2 },
        to: { row: 0, col: 4 },
        type: 'range'
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 4, col: 4 },
        type: 'range'
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 3, col: 1 },
        type: 'range'
      }
    ];

    expect(attacks).toEqual(expected);
  });

  test('Attacks with previous move - cannot attack', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 0, 0, 'bR'],
        [0, 'bR', 0, 0, 0],
        [0, 0, 'bB', 0, 0],
        ['wP', 0, 0, 0, 0],
        [0, 0, 0, 0, 'wQ']
      ]
    };
    const piece = new Bishop(
      'black',
      generatePieceLabel('black', 'bB', { row: 2, col: 2 })
    );

    const turn: PartialGameTurn = [
      {
        black: [
          {
            from: { row: 1, col: 1 },
            to: { row: 2, col: 2 },
            piece: piece.state
          }
        ],
        white: [
          {
            from: { row: 4, col: 0 },
            to: { row: 3, col: 0 },
            piece: generate.generateDefaultPawn('P-white', 'white')
          }
        ]
      }
    ];
    const history: GameHistory = [[...turn]];
    const game = new MahaGame(configuration);
    const state = game.state;
    game.load({
      ...state,
      state: 'inProgress',
      history
    } as GameStateInProgress);

    const attacks = piece.evalAttack(game);

    expect(attacks).toEqual([]);
  });

  test('Attacks - 2 friendly heals (R and B) and 1 attack (white Queen)', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        ['bN', 0, 'bK', 0, 0],
        [0, 'bR', 0, 0, 0],
        [0, 0, 'bB', 0, 0],
        ['wP', 0, 0, 0, 0],
        [0, 0, 'wN', 0, 'wQ']
      ]
    };

    const turn: PartialGameTurn = [
      {
        black: [
          {
            from: { row: 2, col: 4 },
            to: { row: 4, col: 4 },
            piece: generate.generateDefaultQueen('Q-white', 'white')
          }
        ],
        white: [
          {
            from: { row: 4, col: 0 },
            to: { row: 3, col: 0 },
            piece: generate.generateDefaultPawn('P-white', 'white')
          }
        ]
      }
    ];
    const history: GameHistory = [{ ...turn }];
    const game = new MahaGame(configuration);
    const state = game.state;

    game.load({
      ...state,
      history
    } as GameStateInProgress);

    const piece = game.board.getPieceByCoord({ row: 2, col: 2 });

    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const rook = game.board.getPieceByCoord({ row: 1, col: 1 });

    expect(rook).toBeDefined();
    if (!rook) {
      return;
    }

    rook.state.hitPoints = 3;

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      {
        from: { row: 2, col: 2 },
        to: { row: 4, col: 4 },
        type: 'range'
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 1, col: 1 },
        type: 'range'
      }
    ];

    expect(attacks).toEqual(expected);
  });

  test('pieces more than 3 squares away and less than 3 sqaures away - healing test', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 8 },
      pieceLayout: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 'wQ', 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 'wR', 0, 0, 0, 0, 0, 0],
        [0, 0, 'wB', 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        ['bQ', 0, 0, 0, 'wQ', 0, 0, 0]
      ]
    };

    const game = new MahaGame(configuration);
    const state = game.state;

    const piece = game.board.getPieceByCoord({ row: 5, col: 2 });

    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const rook = game.board.getPieceByCoord({ row: 4, col: 1 });
    const queen = game.board.getPieceByCoord({ row: 7, col: 4 });
    const queen2 = game.board.getPieceByCoord({ row: 7, col: 0 });

    expect(rook).toBeDefined();
    expect(queen).toBeDefined();
    expect(queen2).toBeDefined();

    if (!rook || !queen || !queen2) {
      return;
    }

    rook.state.hitPoints = 2;
    queen.state.hitPoints = 2;
    queen2.state.hitPoints = 2;

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      {
        from: { row: 5, col: 2 },
        to: { row: 7, col: 4 },
        type: 'range'
      },
      {
        from: { row: 5, col: 2 },
        to: { row: 7, col: 0 },
        type: 'range'
      },
      {
        from: { row: 5, col: 2 },
        to: { row: 4, col: 1 },
        type: 'range'
      }
    ];

    expect(attacks).toEqual(expected);
  });

  test('test real life scenario from storybook board - should heal the rook', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 8 },
      pieceLayout: [
        [0, 0, 0, 0, 0, 0, 'bN', 'bR'],
        [0, 0, 0, 0, 0, 0, 'bP', 'wR'],
        [0, 0, 0, 0, 'bP', 0, 0, 0],
        [0, 0, 0, 0, 0, 'wB', 0, 0],
        [0, 0, 0, 0, 0, 0, 'wP', 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    };

    const game = new MahaGame(configuration);
    const state = game.state;

    const piece = game.board.getPieceByCoord({ row: 3, col: 5 });

    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const rook = game.board.getPieceByCoord({ row: 1, col: 7 });

    expect(rook).toBeDefined();

    if (!rook) {
      return;
    }

    rook.state.hitPoints = 11;

    const turn: PartialGameTurn = [
      {
        white: [
          {
            from: { row: 4, col: 1 },
            to: { row: 3, col: 1 },
            piece: generate.generateDefaultPawn('P-white', 'white')
          }
        ],
        black: [
          {
            from: { row: 4, col: 0 },
            to: { row: 3, col: 0 },
            piece: generate.generateDefaultPawn('P-white', 'white')
          }
        ]
      }
    ];
    const prevTurn: FullGameTurn = [
      {
        white: [
          {
            from: { row: 5, col: 2 },
            to: { row: 3, col: 5 },
            piece: piece.state
          }
        ],
        black: [
          {
            from: { row: 4, col: 0 },
            to: { row: 3, col: 0 },
            piece: generate.generateDefaultPawn('P-white', 'white')
          }
        ]
      },
      {
        white: [] as AttackOutcome[],
        black: [] as AttackOutcome[]
      }
    ];
    const history: GameHistory = [{ ...prevTurn }, { ...turn }];

    game.load({
      ...state,
      history
    } as GameStateInProgress);

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      {
        from: { row: 3, col: 5 },
        to: { row: 1, col: 7 },
        type: 'range'
      }
    ];

    expect(attacks).toEqual(expected);
  });
});
