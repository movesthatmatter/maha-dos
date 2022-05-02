import { MahaGame } from '../../MahaGame';
import { Pawn } from './Pawn';
import { GameConfigurator, Move } from '../../../gameMechanics/Game/types';
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

    const pieceBlack = new Pawn(
      'black',
      generatePieceLabel('black', 'bP', { row: 2, col: 2 }),
      { pieceHasMoved: true }
    );

    const pieceWhite = new Pawn(
      'white',
      generatePieceLabel('white', 'wP', { row: 3, col: 3 }),
      { pieceHasMoved: true }
    );

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
        [0, 0, 0, 'bQ', 0],
        [0, 0, 'bP', 0, 0],
        [0, 0, 0, 'wP', 0],
        [0, 0, 0, 0, 0]
      ]
    };
    const game = new MahaGame(configuration);

    const pieceBlack = new Pawn(
      'black',
      generatePieceLabel('black', 'bP', { row: 2, col: 2 }),
      {
        pieceHasMoved: false
      }
    );

    const pieceWhite = new Pawn(
      'white',
      generatePieceLabel('white', 'wP', { row: 3, col: 3 }),
      {
        pieceHasMoved: false
      }
    );

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
