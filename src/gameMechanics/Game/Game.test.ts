import { GameStateCompleted, GameStatePending } from './types';
import { Game } from './Game';
import { generate } from '../../mahaDosGame/helpers';
import { mahaPieceRegistry } from '../../mahaDosGame/Pieces/registry';
import { generatePieceLabel } from '../Board/util';
import { Move, Attack } from './types';

describe('Pending Games', () => {
  test('create a Game and evaluate it to pending status', () => {
    const currentGameState: GameStatePending = {
      boardState: {
        terrainState: [
          ['w', 'b', 'w', 'b'],
          ['b', 'w', 'b', 'w'],
          ['w', 'b', 'w', 'b'],
          ['b', 'w', 'b', 'w']
        ],
        pieceLayoutState: [
          [
            generate.generateDefaultRook(
              generatePieceLabel('black', 'bR', { row: 0, col: 0 }),
              'black'
            ),
            0,
            generate.generateDefaultKing(
              generatePieceLabel('black', 'bK', { row: 2, col: 0 }),
              'black'
            ),
            generate.generateDefaultRook(
              generatePieceLabel('black', 'bR', { row: 3, col: 0 }),
              'black'
            )
          ],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [
            generate.generateDefaultRook(
              generatePieceLabel('white', 'wR', { row: 0, col: 3 }),
              'white'
            ),
            0,
            generate.generateDefaultKing(
              generatePieceLabel('white', 'wK', { row: 2, col: 3 }),
              'white'
            ),
            generate.generateDefaultRook(
              generatePieceLabel('white', 'wR', { row: 3, col: 3 }),
              'white'
            )
          ]
        ]
      },
      winner: undefined,
      history: [],
      state: 'pending'
    };

    const mahaGame: Game = new Game(
      mahaPieceRegistry,
      {
        pieceLayout: [
          ['bR', 0, 'bK', 'bR'],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          ['wR', 0, 'wK', 'wR']
        ],
        terrain: { width: 4 }
      },
      {
        history: currentGameState.history,
        winner: undefined
      }
    );

    expect(mahaGame.state).toEqual(currentGameState);
  });
});

describe('Complete Game', () => {
  test('Creates a Game and evaulate it to complete status', () => {
    const actual = {};
    const expected: GameStateCompleted = {
      boardState: {
        terrainState: [
          ['w', 'b', 'w'],
          ['b', 'w', 'b'],
          ['w', 'b', 'w']
        ],
        pieceLayoutState: [
          [
            generate.generateDefaultKing(
              generatePieceLabel('black', 'bK', { row: 0, col: 0 }),
              'black'
            ),
            0,
            0
          ],
          [0, 0, 0],
          [
            0,
            0,
            generate.generateDefaultKnight(
              generatePieceLabel('white', 'wN', { row: 2, col: 2 }),
              'white'
            )
          ]
        ]
      },
      state: 'completed',
      history: [
        [
          { white: [] as Move[], black: [] as Move[] },
          { white: [] as Attack[], black: [] as Attack[] }
        ]
      ],
      winner: 'white'
    };

    expect(actual).toEqual(expected);
  });
});

describe('InProgress Games', () => {
  describe('draw move', () => {
    // test move to correct destination
    // test move to incorrect destination
    // piece already moved
    // game state not in movable phase
  });
});
