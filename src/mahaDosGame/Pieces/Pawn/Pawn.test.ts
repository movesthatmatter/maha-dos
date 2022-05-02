import { MahaGame } from 'src/mahaDosGame/MahaGame';
import { Pawn } from './Pawn';
import { GameConfigurator, Move } from '../../../gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';
import { generatePieceLabel } from 'src/gameMechanics/Board/util';

describe('eval pawn moves', () => {
  test('eval move after first moved', () => {
    const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
      terrain: { width: 5 },
      pieceLayout: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 'P', 'B', 0],
        [0, 0, 0, 'P', 0],
        [0, 0, 'Q', 0, 0]
      ]
    };
    const game = new MahaGame(configuration);

    const pieceBlack = new Pawn(
      generatePieceLabel('black', 'P', { row: 2, col: 2 }),
      'black',
      { pieceHasMoved: true }
    );

    const pieceWhite = new Pawn(
      generatePieceLabel('white', 'P', { row: 3, col: 3 }),
      'white',
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
        [0, 0, 0, 'Q', 0],
        [0, 0, 'P', 0, 0],
        [0, 0, 0, 'P', 0],
        [0, 0, 0, 0, 0]
      ]
    };
    const game = new MahaGame(configuration);

    const pieceBlack = new Pawn(
      generatePieceLabel('black', 'P', { row: 2, col: 2 }),
      'black',
      {
        pieceHasMoved: false
      }
    );

    const pieceWhite = new Pawn(
      generatePieceLabel('white', 'P', { row: 3, col: 3 }),
      'white',
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
