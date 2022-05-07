import { MahaGame } from '../../MahaGame';
import { Pawn } from './Pawn';
import {
  Attack,
  GameConfigurator,
  GameHistory,
  GameStateInProgress,
  GameStateInMovePhase,
  Move
} from '../../../gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';
import { generatePieceLabel } from '../../../gameMechanics/Board/util';

describe('eval pawn moves', () => {
  test('eval move after first moved', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 'bP', 'bB', 0],
        [0, 0, 0, 'wP', 0],
        [0, 0, 'wQ', 0, 0]
      ]
    };
    const game = new MahaGame(configuration);

    const pieceBlack = game.board.getPieceByCoord({ row: 2, col: 2 });
    const pieceWhite = game.board.getPieceByCoord({ row: 3, col: 3 });

    expect(pieceBlack).toBeDefined();
    expect(pieceWhite).toBeDefined();

    if (!(pieceWhite && pieceBlack)) {
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

    const movesBlack = pieceBlack.evalMove(game);
    const movesWhite = pieceWhite.evalMove(game);

    const expectedMovesBlack: Move[] = [
      {
        from: { row: 2, col: 2 },
        to: { row: 3, col: 2 },
        piece: pieceBlack.state
      }
    ];

    const expectedMovesWhite: Move[] = [];

    expect(movesWhite).toEqual(expectedMovesWhite);
    expect(movesBlack).toEqual(expectedMovesBlack);
  });

  test('eval move with no prev move', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 'bP', 0, 0],
        [0, 0, 0, 'wP', 0],
        [0, 0, 0, 0, 0]
      ]
    };
    const game = new MahaGame(configuration);

    const pieceBlack = game.board.getPieceByCoord({ row: 2, col: 2 });
    const pieceWhite = game.board.getPieceByCoord({ row: 3, col: 3 });

    expect(pieceBlack).toBeDefined();
    expect(pieceWhite).toBeDefined();

    if (!(pieceWhite && pieceBlack)) {
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

    //TODO - find better way to test this - this gets implemented into Pawn at constructor and
    // piecehasMoved will be changed by the engine when it applies the move.
    pieceWhite.state.pieceHasMoved = true;
    pieceWhite.state.moveRange = 1;

    const movesBlack = pieceBlack.evalMove(game);
    const movesWhite = pieceWhite.evalMove(game);

    const expectedMovesBlack: Move[] = [
      {
        from: { row: 2, col: 2 },
        to: { row: 3, col: 2 },
        piece: pieceBlack.state
      },
      {
        from: { row: 2, col: 2 },
        to: { row: 4, col: 2 },
        piece: pieceBlack.state
      }
    ];

    const expectedMovesWhite: Move[] = [
      {
        from: { row: 3, col: 3 },
        to: { row: 2, col: 3 },
        piece: pieceWhite.state
      }
    ];

    expect(movesWhite).toEqual(expectedMovesWhite);
    expect(movesBlack).toEqual(expectedMovesBlack);
  });
});

describe('eval attacks', () => {
  test('Pawn attacks with both white and black with no movement before', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5, height: 8 },
      pieceLayout: [
        [0, 0, 0, 0, 0],
        [0, 'wQ', 'wQ', 'wQ', 0],
        ['wP', 'bP', 'wP', 0, 0],
        ['wN', 'wN', 'wP', 0, 0],
        [0, 0, 0, 0, 0],
        [0, 'bN', 'bP', 'bN', 0],
        [0, 'bP', 'wP', 'bN', 0],
        [0, 0, 0, 'bP', 'bP']
      ]
    };
    const game = new MahaGame(configuration);
    const pieceWhite = game.board.getPieceByCoord({ row: 6, col: 2 });
    const pieceBlack = game.board.getPieceByCoord({ row: 2, col: 1 });

    expect(pieceWhite).toBeDefined();
    expect(pieceBlack).toBeDefined();

    if (!pieceWhite || !pieceBlack) {
      return;
    }

    const attacksWhite = pieceWhite.evalAttack(game);
    const attacksBlack = pieceBlack.evalAttack(game);

    const expectedWhite: Attack[] = [
      { from: { row: 6, col: 2 }, to: { row: 5, col: 3 }, type: 'melee' },
      { from: { row: 6, col: 2 }, to: { row: 5, col: 1 }, type: 'melee' }
    ];

    const expectedBlack: Attack[] = [
      { from: { row: 2, col: 1 }, to: { row: 3, col: 0 }, type: 'melee' },
      { from: { row: 2, col: 1 }, to: { row: 3, col: 2 }, type: 'melee' }
    ];

    expect(attacksWhite).toEqual(expectedWhite);
    expect(attacksBlack).toEqual(expectedBlack);
  });

  test('Pawn attacks with prior movement', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5, height: 8 },
      pieceLayout: [
        [0, 0, 0, 0, 0],
        [0, 0, 'wQ', 'wQ', 0],
        ['wP', 'bP', 'wP', 0, 0],
        ['wN', 'wN', 'wP', 0, 0],
        [0, 0, 0, 0, 0],
        [0, 'bN', 'bP', 'bN', 0],
        [0, 'bP', 'wP', 'bN', 0],
        [0, 0, 0, 0, 'bP']
      ]
    };
    const game = new MahaGame(configuration);
    const pieceWhite = game.board.getPieceByCoord({ row: 6, col: 2 });
    const pieceBlack = game.board.getPieceByCoord({ row: 2, col: 1 });

    expect(pieceWhite).toBeDefined();
    expect(pieceBlack).toBeDefined();

    if (!pieceWhite || !pieceBlack) {
      return;
    }

    const history: GameHistory = [
      [
        {
          white: [
            {
              from: { row: 7, col: 2 },
              to: { row: 6, col: 2 },
              piece: pieceWhite.state
            }
          ],
          black: [
            {
              from: { row: 1, col: 1 },
              to: { row: 2, col: 1 },
              piece: pieceBlack.state
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

    const attacksWhite = pieceWhite.evalAttack(game);
    const attacksBlack = pieceBlack.evalAttack(game);

    const expectedWhite: Attack[] = [
      {
        from: { row: 6, col: 2 },
        to: { row: 5, col: 3 },
        type: 'melee'
      },
      {
        from: { row: 6, col: 2 },
        to: { row: 5, col: 1 },
        type: 'melee'
      }
    ];

    const expectedBlack: Attack[] = [
      {
        from: { row: 2, col: 1 },
        to: { row: 3, col: 0 },
        type: 'melee'
      },
      {
        from: { row: 2, col: 1 },
        to: { row: 3, col: 2 },
        type: 'melee'
      }
    ];

    expect(attacksWhite).toEqual(expectedWhite);
    expect(attacksBlack).toEqual(expectedBlack);
  });
});
