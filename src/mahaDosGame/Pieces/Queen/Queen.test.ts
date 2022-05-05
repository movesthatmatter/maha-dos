import { MahaGame } from 'src/mahaDosGame/MahaGame';
import { Queen } from './Queen';
import {
  Attack,
  GameConfigurator,
  GameHistory,
  GameStateInProgress,
  GameStateInMovePhase,
  Move,
  PartialGameTurn
} from '../../../gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';
import { generatePieceLabel } from 'src/gameMechanics/Board/util';
import { Pawn } from '../Pawn';

describe('eval moves for Queen', () => {
  test('eval move', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        ['bR', 0, 'bR', 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 'bQ', 'bB', 0],
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
        to: { row: 0, col: 4 },
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
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 1, col: 1 },
        piece: piece.state
      }
    ];

    expect(moves).toEqual(expectedMoves);
  });
});

describe('eval attacks for Queen', () => {
  test('testing range attacks for queen with no prior movement', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 0, 0, 'bR'],
        [0, 0, 0, 0, 0],
        [0, 0, 'bN', 0, 0],
        [0, 0, 0, 0, 0],
        ['bP', 'bP', 0, 0, 'wQ']
      ]
    };

    const game = new MahaGame(configuration);
    const piece = game.board.getPieceByCoord({ row: 4, col: 4 });

    expect(piece).toBeDefined();
    if (!piece) {
      return;
    }

    const attacks = piece.evalAttack(game);
    const expected: Attack[] = [
      { from: { row: 4, col: 4 }, to: { row: 0, col: 4 }, type: 'range' },
      { from: { row: 4, col: 4 }, to: { row: 4, col: 1 }, type: 'range' },
      { from: { row: 4, col: 4 }, to: { row: 2, col: 2 }, type: 'range' }
    ];

    expect(attacks).toEqual(expected);
  });

  test('testing range and melee attacks for queen with no prior movement', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6 },
      pieceLayout: [
        [0, 0, 'bP', 0, 0, 0],
        ['bP', 0, 'wK', 0, 'bP', 0],
        [0, 0, 0, 'bP', 0, 0],
        ['bP', 0, 'wQ', 0, 0, 'bN'],
        [0, 0, 0, 'wP', 0, 0],
        [0, 0, 'bQ', 0, 0, 0]
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
      { from: { row: 3, col: 2 }, to: { row: 2, col: 3 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 3, col: 5 }, type: 'range' },
      { from: { row: 3, col: 2 }, to: { row: 5, col: 2 }, type: 'range' },
      { from: { row: 3, col: 2 }, to: { row: 3, col: 0 }, type: 'range' },
      { from: { row: 3, col: 2 }, to: { row: 1, col: 0 }, type: 'range' }
    ];
    expect(attacks).toEqual(expected);
  });

  test('testing range and melee attacks for queen with prior movement', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6 },
      pieceLayout: [
        [0, 0, 'bP', 0, 0, 0],
        ['bP', 0, 'wK', 0, 'bP', 0],
        [0, 0, 0, 'bP', 0, 0],
        [0, 'bP', 'wQ', 0, 0, 'bN'],
        [0, 0, 0, 'wP', 0, 0],
        [0, 0, 'bQ', 0, 0, 0]
      ]
    };
    const game = new MahaGame(configuration);

    const piece = game.board.getPieceByCoord({ row: 3, col: 2 });

    expect(piece).toBeDefined();
    if (!piece) {
      return;
    }

    const turn: PartialGameTurn = [
      {
        black: [
          {
            from: { row: 0, col: 0 },
            to: { row: 1, col: 0 },
            piece: new Pawn('black', 'bP').state
          }
        ],
        white: [
          {
            from: { row: 5, col: 0 },
            to: { row: 3, col: 2 },
            piece: piece.state
          }
        ]
      },
      {
        white: [],
        black: []
      }
    ];
    const history: GameHistory = [
      [
        {
          white: [] as Move[],
          black: [] as Move[]
        },
        {
          white: [] as Attack[],
          black: [] as Attack[]
        }
      ],
      [...turn]
    ];

    const state = game.state;
    game.load({
      ...state,
      history
    } as GameStateInProgress);

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      { from: { row: 3, col: 2 }, to: { row: 2, col: 3 }, type: 'melee' }
    ];
    expect(attacks).toEqual(expected);
  });

  test('testing range and melee attacks for queen with king next to it', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6 },
      pieceLayout: [
        [0, 0, 'bP', 0, 0, 0],
        ['bP', 0, 0, 0, 'bP', 0],
        [0, 0, 'wK', 'bP', 0, 0],
        ['bP', 0, 'wQ', 0, 'bP', 'bN'],
        [0, 0, 0, 'wP', 0, 0],
        ['bK', 0, 'bQ', 0, 0, 0]
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
      {
        from: { row: 3, col: 2 },
        to: { row: 2, col: 3 },
        type: 'melee',
        crit: true
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 3, col: 4 },
        type: 'range',
        crit: true
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 5, col: 2 },
        type: 'range',
        crit: true
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 5, col: 0 },
        type: 'range',
        crit: true
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 3, col: 0 },
        type: 'range',
        crit: true
      },
      {
        from: { row: 3, col: 2 },
        to: { row: 1, col: 0 },
        type: 'range',
        crit: true
      }
    ];
    expect(attacks).toEqual(expected);
  });

  test('testing attacks with movement from diagonal and crit damage', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6 },
      pieceLayout: [
        [0, 0, 'bP', 0, 0, 0],
        ['bP', 0, 0, 0, 'bP', 0],
        [0, 'bP', 'wK', 'bP', 0, 0],
        [0, 'bP', 'wQ', 0, 0, 'bN'],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 'bQ', 0, 0, 0]
      ]
    };
    const game = new MahaGame(configuration);

    const piece = game.board.getPieceByCoord({ row: 3, col: 2 });

    expect(piece).toBeDefined();
    if (!piece) {
      return;
    }

    const turn: PartialGameTurn = [
      {
        black: [
          {
            from: { row: 0, col: 0 },
            to: { row: 1, col: 0 },
            piece: new Pawn('black', 'bP').state
          }
        ],
        white: [
          {
            from: { row: 5, col: 4 },
            to: { row: 3, col: 2 },
            piece: piece.state
          }
        ]
      },
      {
        white: [],
        black: []
      }
    ];
    const history: GameHistory = [
      [
        {
          white: [] as Move[],
          black: [] as Move[]
        },
        {
          white: [] as Attack[],
          black: [] as Attack[]
        }
      ],
      [...turn]
    ];

    const state = game.state;
    game.load({
      ...state,
      history
    } as GameStateInProgress);

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      {
        from: { row: 3, col: 2 },
        to: { row: 2, col: 1 },
        type: 'melee',
        crit: true
      }
    ];
    expect(attacks).toEqual(expected);
  });

  test('testing with different color king, no crit', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6 },
      pieceLayout: [
        [0, 0, 'bP', 0, 0, 0],
        ['bP', 0, 0, 0, 'bP', 0],
        [0, 'bP', 'bK', 'bP', 0, 0],
        [0, 'bP', 'wQ', 0, 0, 'bN'],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 'bQ', 0, 0, 0]
      ]
    };
    const game = new MahaGame(configuration);
    const piece = game.board.getPieceByCoord({ row: 3, col: 2 });

    expect(piece).toBeDefined();
    if (!piece) {
      return;
    }

    const turn: PartialGameTurn = [
      {
        black: [
          {
            from: { row: 0, col: 0 },
            to: { row: 1, col: 0 },
            piece: new Pawn('black', 'bP').state
          }
        ],
        white: [
          {
            from: { row: 5, col: 4 },
            to: { row: 3, col: 2 },
            piece: piece.state
          }
        ]
      },
      {
        white: [],
        black: []
      }
    ];
    const history: GameHistory = [
      [
        {
          white: [] as Move[],
          black: [] as Move[]
        },
        {
          white: [] as Attack[],
          black: [] as Attack[]
        }
      ],
      [...turn]
    ];

    const state = game.state;
    game.load({
      ...state,
      history
    } as GameStateInProgress);

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      {
        from: { row: 3, col: 2 },
        to: { row: 2, col: 1 },
        type: 'melee'
      }
    ];
    expect(attacks).toEqual(expected);
  });

  test('testing with history but no queen move', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 6 },
      pieceLayout: [
        [0, 0, 'bP', 0, 0, 0],
        ['bP', 0, 'wK', 0, 'bP', 0],
        [0, 0, 0, 'bP', 0, 0],
        ['bP', 0, 'wQ', 0, 0, 'bN'],
        [0, 0, 0, 'wP', 0, 0],
        [0, 0, 'bQ', 0, 0, 0]
      ]
    };

    const turn: PartialGameTurn = [
      {
        black: [
          {
            from: { row: 5, col: 0 },
            to: { row: 5, col: 2 },
            piece: new Queen('black', 'bQ').state
          }
        ],
        white: [
          {
            from: { row: 5, col: 0 },
            to: { row: 5, col: 2 },
            piece: new Pawn('white', 'wP').state
          }
        ]
      },
      {
        white: [],
        black: []
      }
    ];
    const history: GameHistory = [
      [
        {
          white: [] as Move[],
          black: [] as Move[]
        },
        {
          white: [] as Attack[],
          black: [] as Attack[]
        }
      ],
      [...turn]
    ];

    const game = new MahaGame(configuration);

    const piece = game.board.getPieceByCoord({ row: 3, col: 2 });

    expect(piece).toBeDefined();
    if (!piece) {
      return;
    }

    const state = game.state;
    game.load({
      ...state,
      history
    } as GameStateInProgress);
    const attacks = piece.evalAttack(game);
    const expected: Attack[] = [
      { from: { row: 3, col: 2 }, to: { row: 2, col: 3 }, type: 'melee' },
      { from: { row: 3, col: 2 }, to: { row: 3, col: 5 }, type: 'range' },
      { from: { row: 3, col: 2 }, to: { row: 5, col: 2 }, type: 'range' },
      { from: { row: 3, col: 2 }, to: { row: 3, col: 0 }, type: 'range' },
      { from: { row: 3, col: 2 }, to: { row: 1, col: 0 }, type: 'range' }
    ];

    expect(attacks).toEqual(expected);
  });
});
