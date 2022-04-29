import { MahaGame } from 'src/mahaDosGame/MahaGame';
import { Pawn } from './Pawn';
import { GameConfigurator, Move } from '../../../gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';
import { generatePieceLabel } from 'src/gameMechanics/Board/util';

test('eval move', () => {
  const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
    terrain: { width: 5 },
    pieceLayout: [
      [0, 0, 'Q', 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 'P', 0, 0],
      [0, 0, 0, 'B', 0],
      [0, 0, 0, 'P', 0]
    ]
  };
  const game = new MahaGame(configuration);

  const pieceBlack = new Pawn(
    generatePieceLabel('black', 'P', { row: 2, col: 2 }),
    'black'
  );

  const pieceWhite = new Pawn(
    generatePieceLabel('white', 'P', {row: 4, col: 3}), 
    'white'
  )

  const movesBlack = pieceBlack.evalMove(game);
  const movesWhite = pieceWhite.evalMove(game);

  const expectedMovesBlack: Move[] = [
    {
      from: { row: 2, col: 2 },
      to: { row: 1, col: 2},
      piece: pieceBlack.state
    },
  ];

  const expectedMovesWhite: Move[] = []

  expect(movesWhite).toEqual(expectedMovesWhite);
  expect(movesBlack).toEqual(expectedMovesBlack);
});
