import { GameConfigurator } from 'src/gameMechanics/Game/types';
import { mahaPieceRegistry } from './Pieces/registry';

export { mahaPieceRegistry };

export const DEFAULT_MAHA_CONFIGURATOR: GameConfigurator<
  typeof mahaPieceRegistry
> = {
  terrain: { width: 8 },
  pieceLayout: [
    ['R', 'N', 'B', 'K', 'Q', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'K', 'Q', 'B', 'N', 'R']
  ]
  // TODO: add this dynamic props going to be needed
  // pieceDynamicProps: []
};
