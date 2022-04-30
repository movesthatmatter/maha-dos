import { MahaGame } from 'src/mahaDosGame/MahaGame';
import { Bishop } from './Bishop';
import {
  Attack,
  GameConfigurator,
  GameHistory,
  GameStateInProgress,
  Move,
  PartialGameTurn
} from '../../../gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';
import { generatePieceLabel } from 'src/gameMechanics/Board/util';
import { generate } from 'src/mahaDosGame/helpers';
import { Board } from 'src/gameMechanics/Board/Board';

test('eval moves', () => {
  const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
    terrain: { width: 5 },
    pieceLayout: [
      [0, 0, 0, 0, 'R'],
      [0, 'R', 0, 0, 0],
      [0, 0, 'B', 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  };
  const game = new MahaGame(configuration);

  const piece = new Bishop(
    generatePieceLabel('black', 'B', { row: 2, col: 2 }),
    'black'
  );

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
        [0, 0, 0, 0, 'N'],
        [0, 0, 0, 0, 0],
        [0, 0, 'B', 0, 0],
        [0, 'R', 0, 0, 0],
        [0, 0, 0, 0, 'Q']
      ]
    };
    const game = new MahaGame(configuration);

    const piece = new Bishop(
      generatePieceLabel('black', 'B', { row: 2, col: 2 }),
      'black'
    );

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      {
        from: { row: 2, col: 2 },
        to: { row: 4, col: 1 },
        type: 'melee'
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 0, col: 4 },
        type: 'range',
        special: 'heal'
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 4, col: 4 },
        type: 'range'
      }
    ];
  });

  test('Attacks with previous move - cannot attack', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 0, 0, 'R'],
        [0, 'R', 0, 0, 0],
        [0, 0, 'B', 0, 0],
        ['P', 0, 0, 0, 0],
        [0, 0, 0, 0, 'Q']
      ]
    };
    const piece = new Bishop(
      generatePieceLabel('black', 'B', { row: 2, col: 2 }),
      'black'
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
    const history: GameHistory = [{ ...turn }];
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
        ['N', 0, 'K', 0, 'B'],
        [0, 'R', 0, 0, 0],
        [0, 0, 'B', 0, 0],
        ['P', 0, 0, 0, 0],
        [0, 0, 'N', 0, 'Q']
      ]
    };
    const piece = new Bishop(
      generatePieceLabel('black', 'B', { row: 2, col: 2 }),
      'black'
    );

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
      state: 'inProgress',
      history
    } as GameStateInProgress);

    const attacks = piece.evalAttack(game);

    const expected: Attack[] = [
      {
        from: { row: 2, col: 2 },
        to: { row: 0, col: 4 },
        type: 'range',
        special: 'heal'
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 4, col: 4 },
        type: 'range'
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 1, col: 1 },
        type: 'range',
        special: 'heal'
      }
    ];

    expect(attacks).toEqual(expected);
  });
});
