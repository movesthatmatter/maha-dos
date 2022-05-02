import { MahaGame } from 'src/mahaDosGame/MahaGame';
import { Rook } from './Rook';
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
import { Pawn } from '../Pawn';

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

    const piece = new Rook(
      'black',
      generatePieceLabel('black', 'bR', { row: 2, col: 2 })
    );

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

    const piece = new Rook(
      'black',
      generatePieceLabel('black', 'bR', { row: 2, col: 2 })
    );

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
    const state = game.state;

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

    const piece = new Rook(
      'black',
      generatePieceLabel('black', 'bR', { row: 2, col: 2 })
    );
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
    const state = game.state;
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
        to: { row: 2, col: 4 },
        type: 'range'
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
});
