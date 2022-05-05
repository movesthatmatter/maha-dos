import { GameStateCompleted, GameStatePending } from './types';
import { Game } from './Game';
import { generate } from '../../mahaDosGame/helpers';
import { mahaPieceRegistry } from '../../mahaDosGame/Pieces/registry';
import { generatePieceLabel } from '../Board/util';
import { Move, Attack } from './types';
import { Rook } from 'src/mahaDosGame/Pieces/Rook';
import { King } from 'src/mahaDosGame/Pieces/King';
import { Knight } from 'src/mahaDosGame/Pieces/Knight';

describe('Pending Games', () => {
  test('create a Game and evaluate it to pending status', () => {
    // const currentGameState: GameStatePending = {
    //   boardState: {
    //     terrainState: [
    //       ['w', 'b', 'w', 'b'],
    //       ['b', 'w', 'b', 'w'],
    //       ['w', 'b', 'w', 'b'],
    //       ['b', 'w', 'b', 'w']
    //     ],
    //     pieceLayoutState: [
    //       [
    //         new Rook('black', 'bR').state,
    //         0,
    //         new King('black', 'bK').state,
    //         new Rook('black', 'bR').state
    //       ],
    //       [0, 0, 0, 0],
    //       [0, 0, 0, 0],
    //       [
    //         new Rook('white', 'wR').state,
    //         0,
    //         new King('white', 'wK').state,
    //         new Rook('white', 'wR').state
    //       ]
    //     ]
    //   },
    //   winner: undefined,
    //   history: [],
    //   state: 'pending'
    // };
    // const actual = new Game(
    //   mahaPieceRegistry,
    //   {
    //     pieceLayout: [
    //       ['bR', 0, 'bK', 'bR'],
    //       [0, 0, 0, 0],
    //       [0, 0, 0, 0],
    //       ['wR', 0, 'wK', 'wR']
    //     ],
    //     terrain: { width: 4 }
    //   },
    //   {
    //     history: currentGameState.history,
    //     winner: undefined
    //   }
    // ).state;
    // const expected = currentGameState;
    // expect(actual).toEqual(expected);
  });
});

describe('Complete Game', () => {
  // test('Creates a Game and evaulate it to complete status', () => {
  //   const actual = {};
  //   const expected: GameStateCompleted = {
  //     boardState: {
  //       terrainState: [
  //         ['w', 'b', 'w'],
  //         ['b', 'w', 'b'],
  //         ['w', 'b', 'w']
  //       ],
  //       pieceLayoutState: [
  //         [new King('white', 'wK').state, 0, 0],
  //         [0, 0, 0],
  //         [0, 0, new Knight('white', 'wN').state]
  //       ]
  //     },
  //     state: 'completed',
  //     history: [
  //       [
  //         { white: [] as Move[], black: [] as Move[] },
  //         { white: [] as Attack[], black: [] as Attack[] }
  //       ]
  //     ],
  //     winner: 'white'
  //   };
  //   expect(actual).toEqual(expected);
  // });
});

describe('InProgress Games', () => {
  describe('draw move', () => {
    // test move to correct destination
    // test move to incorrect destination
    // piece already moved
    // game state not in movable phase
  });
});
