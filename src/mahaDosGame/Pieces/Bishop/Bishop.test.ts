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
  GameHistory,
  Move,
  PartialGameTurn
} from '../../../gameMechanics/commonTypes';

test('eval moves', () => {
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
        ['bN', 0, 'bK', 0, 'bB'],
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
      },
      {
        white: [],
        black: []
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
});
