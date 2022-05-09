import { MahaGame } from '../../MahaGame';
import {
  GameConfigurator,
  GameStateInProgress,
  GameStateInMovePhase,
} from '../../../gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';
import { generate } from '../../../mahaDosGame/helpers';
import { Attack, GameHistory, Move, PartialGameTurn } from '../../../gameMechanics/commonTypes';

describe('eval moves for rooks', () => {
  test('eval move', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 'bQ', 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 'bR', 'bB', 0],
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
        to: { row: 1, col: 2 },
        piece: piece.state
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 3, col: 2 },
        piece: piece.state
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 4, col: 2 },
        piece: piece.state
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 2, col: 1 },
        piece: piece.state
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 2, col: 0 },
        piece: piece.state
      }
    ];

    expect(moves).toEqual(expectedMoves);
  });
});

describe('eval attacks for Rooks', () => {
  test('attack where piece moved before - it should only attack in x1 range', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 'bN', 0, 0],
        [0, 0, 0, 'bP', 0],
        ['wQ', 0, 'bR', 'wP', 0],
        [0, 0, 'wP', 0, 0],
        [0, 0, 0, 0, 'wQ']
      ]
    };

    // const piece = new Rook(
    //   'black',
    //   generatePieceLabel('black', 'bR', { row: 2, col: 2 })
    // );

    const game = new MahaGame(configuration);
    const state = game.state;

    const piece = game.board.getPieceByCoord({ row: 2, col: 2 });

    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const turn: PartialGameTurn = [
      {
        black: [
          {
            from: { row: 0, col: 2 },
            to: { row: 2, col: 2 },
            piece: piece.state
          }
        ],
        white: [
          {
            from: { row: 4, col: 2 },
            to: { row: 3, col: 2 },
            piece: generate.generateDefaultPawn('P-white', 'white')
          }
        ]
      },
      {
        white: [],
        black: []
      }
    ];
    const history: GameHistory = [[...turn]];

    game.load({
      ...state,
      history
    } as GameStateInProgress);

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      {
        from: { row: 2, col: 2 },
        to: { row: 2, col: 3 },
        type: 'range'
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 3, col: 2 },
        type: 'range'
      }
    ];
    expect(attacks).toEqual(expected);
  });

  test('attack where piece didnt move before - it should be able to attack in all directions', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 'bN', 0, 0],
        [0, 0, 0, 'bP', 0],
        ['wQ', 0, 'bR', 'wP', 'wN'],
        [0, 0, 0, 0, 0],
        [0, 0, 'wQ', 0, 'wQ']
      ]
    };

    const turn: PartialGameTurn = [
      {
        black: [
          {
            from: { row: 0, col: 0 },
            to: { row: 2, col: 0 },
            piece: generate.generateDefaultQueen('Q-white', 'white')
          }
        ],
        white: [
          {
            from: { row: 4, col: 2 },
            to: { row: 3, col: 2 },
            piece: generate.generateDefaultPawn('P-white', 'white')
          }
        ]
      },
      {
        white: [],
        black: []
      }
    ];
    const history: GameHistory = [[...turn]];

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

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      {
        from: { row: 2, col: 2 },
        to: { row: 2, col: 3 },
        type: 'range'
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 2, col: 4 },
        type: 'range',
        aoe: [{ row: 2, col: 3 }]
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 4, col: 2 },
        type: 'range'
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 2, col: 0 },
        type: 'range'
      }
    ];
    expect(attacks).toEqual(expected);
  });

  test('attack where theres more pieces in same line', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 'wN', 0, 0],
        ['bR', 0, 'wQ', 'wP', 0],
        ['wQ', 0, 'bP', 'wP', 'wN'],
        [0, 0, 0, 0, 0],
        ['wP', 0, 'wQ', 0, 'wQ']
      ]
    };

    const turn: PartialGameTurn = [
      {
        black: [
          {
            from: { row: 0, col: 0 },
            to: { row: 2, col: 0 },
            piece: generate.generateDefaultQueen('Q-white', 'white')
          }
        ],
        white: [
          {
            from: { row: 4, col: 2 },
            to: { row: 3, col: 2 },
            piece: generate.generateDefaultPawn('P-white', 'white')
          }
        ]
      },
      {
        white: [],
        black: []
      }
    ];
    const history: GameHistory = [[...turn]];

    const game = new MahaGame(configuration);
    const state = game.state;
    game.load({
      ...state,
      history
    } as GameStateInProgress);

    const piece = game.board.getPieceByCoord({ row: 1, col: 0 });

    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      {
        from: { row: 1, col: 0 },
        to: { row: 1, col: 2 },
        type: 'range',
        aoe: [
          {
            row: 0,
            col: 2
          },
          {
            row: 1,
            col: 3
          }
        ]
      },
      {
        from: { row: 1, col: 0 },
        to: { row: 1, col: 3 },
        type: 'range',
        aoe: [
          {
            row: 2,
            col: 3
          },
          {
            row: 1,
            col: 2
          }
        ]
      },
      {
        from: { row: 1, col: 0 },
        to: { row: 2, col: 0 },
        type: 'range'
      },
      {
        from: { row: 1, col: 0 },
        to: { row: 4, col: 0 },
        type: 'range'
      }
    ];
    expect(attacks).toEqual(expected);
  });

  test('test with multiple rooks and lots of AOE - fucking crazy shit', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6, height: 7 },
      pieceLayout: [
        ['wP', 'wN', 0, 0, 0, 0],
        [0, 0, 0, 'wR', 'wQ', 0],
        [0, 'wK', 'wP', 0, 0, 'bN'],
        [0, 0, 0, 0, 0, 0],
        [0, 'bR', 0, 'bR', 0, 'wP'],
        ['wP', 'wP', 'wQ', 0, 'bR', 0],
        [0, 0, 0, 'wQ', 0, 0]
      ]
    };

    const turn: PartialGameTurn = [
      {
        black: [] as Move[],
        white: [] as Move[]
      },
      {
        white: [],
        black: []
      }
    ];
    const history: GameHistory = [[...turn]];

    const game = new MahaGame(configuration);
    const state = game.state;
    game.load({
      ...state,
      history
    } as GameStateInProgress);

    const rook1 = game.board.getPieceByCoord({ row: 4, col: 1 });
    const rook2 = game.board.getPieceByCoord({ row: 4, col: 3 });
    const rook3 = game.board.getPieceByCoord({ row: 5, col: 4 });
    const rook4 = game.board.getPieceByCoord({ row: 1, col: 3 });

    expect(rook1).toBeDefined();
    expect(rook2).toBeDefined();
    expect(rook3).toBeDefined();
    expect(rook4).toBeDefined();

    if (!(rook1 && rook2 && rook3 && rook4)) {
      return;
    }

    const attacks1 = rook1.evalAttack(game);
    const attacks2 = rook2.evalAttack(game);
    const attacks3 = rook3.evalAttack(game);
    const attacks4 = rook4.evalAttack(game);

    const expected1: Attack[] = [
      {
        from: { row: 4, col: 1 },
        to: { row: 2, col: 1 },
        type: 'range',
        aoe: [{ row: 2, col: 2 }]
      },
      {
        from: { row: 4, col: 1 },
        to: { row: 0, col: 1 },
        type: 'range',
        aoe: [{ row: 0, col: 0 }]
      },
      {
        from: { row: 4, col: 1 },
        to: { row: 4, col: 5 },
        type: 'range'
      },
      {
        from: { row: 4, col: 1 },
        to: { row: 5, col: 1 },
        type: 'range'
      }
    ];
    const expected2: Attack[] = [
      {
        from: { row: 4, col: 3 },
        to: { row: 1, col: 3 },
        type: 'range',
        aoe: [{ row: 1, col: 4 }]
      },
      {
        from: { row: 4, col: 3 },
        to: { row: 4, col: 5 },
        type: 'range'
      },
      {
        from: { row: 4, col: 3 },
        to: { row: 6, col: 3 },
        type: 'range'
      }
    ];
    const expected3: Attack[] = [
      {
        from: { row: 5, col: 4 },
        to: { row: 1, col: 4 },
        type: 'range',
        aoe: [{ row: 1, col: 3 }]
      },
      {
        from: { row: 5, col: 4 },
        to: { row: 5, col: 2 },
        type: 'range',
        aoe: [{ row: 5, col: 1 }]
      },
      {
        from: { row: 5, col: 4 },
        to: { row: 5, col: 1 },
        type: 'range',
        aoe: [
          { row: 5, col: 2 },
          { row: 5, col: 0 }
        ]
      },
      {
        from: { row: 5, col: 4 },
        to: { row: 5, col: 0 },
        type: 'range',
        aoe: [{ row: 5, col: 1 }]
      }
    ];
    const expected4: Attack[] = [
      { from: { row: 1, col: 3 }, to: { row: 4, col: 3 }, type: 'range' }
    ];
    expect(attacks1).toEqual(expected1);
    expect(attacks2).toEqual(expected2);
    expect(attacks3).toEqual(expected3);
    expect(attacks4).toEqual(expected4);
  });

  test('test with max damage AOE on 5 pieces from 1 rook', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6 },
      pieceLayout: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 'wK', 'wN', 0, 0],
        ['bR', 'wQ', 'wP', 'wP', 'wN', 0],
        [0, 0, 0, 'wP', 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    };

    const turn: PartialGameTurn = [
      {
        black: [] as Move[],
        white: [] as Move[]
      },
      {
        white: [],
        black: []
      }
    ];
    const history: GameHistory = [[...turn]];

    const game = new MahaGame(configuration);
    const state = game.state;
    game.load({
      ...state,
      history
    } as GameStateInProgress);

    // const piece = new Rook(
    //   'black',
    //   generatePieceLabel('black', 'bR', { row: 2, col: 0 })
    // );

    const piece = game.board.getPieceByCoord({ row: 2, col: 0 });

    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      {
        from: { row: 2, col: 0 },
        to: { row: 2, col: 1 },
        type: 'range'
      },
      {
        from: { row: 2, col: 0 },
        to: { row: 2, col: 2 },
        type: 'range',
        aoe: [
          { row: 1, col: 2 },
          { row: 2, col: 3 },
          { row: 2, col: 1 }
        ]
      },
      {
        from: { row: 2, col: 0 },
        to: { row: 2, col: 3 },
        type: 'range',
        aoe: [
          { row: 1, col: 3 },
          { row: 2, col: 4 },
          { row: 3, col: 3 },
          { row: 2, col: 2 }
        ]
      },
      {
        from: { row: 2, col: 0 },
        to: { row: 2, col: 4 },
        type: 'range',
        aoe: [{ row: 2, col: 3 }]
      }
    ];

    expect(attacks).toEqual(expected);
  });

  test('test with movement prior to attack, should ignore AOE', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6 },
      pieceLayout: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 'wK', 'wN', 0, 0],
        ['bR', 'wQ', 'wP', 'wP', 'wN', 0],
        [0, 0, 0, 'wP', 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    };

    // const piece = new Rook(
    //   'black',
    //   generatePieceLabel('black', 'bR', { row: 2, col: 0 })
    // );

    const game = new MahaGame(configuration);

    const piece = game.board.getPieceByCoord({ row: 2, col: 0 });

    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

    const turn: PartialGameTurn = [
      {
        black: [
          {
            from: { row: 5, col: 0 },
            to: { row: 2, col: 0 },
            piece: piece.state
          }
        ],
        white: [
          {
            from: { row: 5, col: 1 },
            to: { row: 2, col: 1 },
            piece: generate.generateDefaultQueen('white-Q-2-1', 'white')
          }
        ]
      },
      {
        white: [],
        black: []
      }
    ];
    const history: GameHistory = [[...turn]];

    const state = game.state;
    game.load({
      ...state,
      history
    } as GameStateInProgress);

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      {
        from: { row: 2, col: 0 },
        to: { row: 2, col: 1 },
        type: 'range'
      }
    ];

    expect(attacks).toEqual(expected);
  });
});
