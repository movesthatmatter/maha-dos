import { MahaGame } from '../../MahaGame';
import { GameConfigurator, Move } from '../../../gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';

test('eval move', () => {
  const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
    terrain: { width: 5 },
    pieceLayout: [
      ['bR', 0, 'bR', 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 'bK', 'bB', 0],
      [0, 'wR', 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  };
  const game = new MahaGame(configuration);

  const piece = game.board.getPieceByCoord({ row: 2, col: 2 });

  expect(piece).toBeDefined();

  if (!piece) {
    return;
  }

  const moves = piece.evalMove(game);

  const expectedMoves: Move[] = [
    {
      from: { row: 2, col: 2 },
      to: { row: 1, col: 2 },
      piece: piece.state
    },
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
      to: { row: 3, col: 2 },
      piece: piece.state
    },
    {
      from: { row: 2, col: 2 },
      to: { row: 2, col: 1 },
      piece: piece.state
    },
    {
      from: { row: 2, col: 2 },
      to: { row: 1, col: 1 },
      piece: piece.state
    }
  ];

  expect(moves).toEqual(expectedMoves);
});
