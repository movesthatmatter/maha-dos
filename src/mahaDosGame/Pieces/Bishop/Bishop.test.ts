import { MahaGame } from 'src/mahaDosGame/MahaGame';
import { Bishop } from './Bishop';
import { GameConfigurator, Move } from '../../../gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';
import { generatePieceLabel } from 'src/gameMechanics/Board/util';

test('eval move', () => {
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
    generatePieceLabel('white', 'B', { row: 2, col: 2 }),
    'white'
  );

  const moves = piece.evalMove(game);

  console.log('moves received', moves);
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
