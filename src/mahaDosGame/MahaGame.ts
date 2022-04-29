import { Game } from 'src/gameMechanics/Game/Game';
import { GameConfigurator } from 'src/gameMechanics/types';
import { mahaPieceRegistry } from './Pieces/registry';

const DEFAULT_MAHA_CONFIGURATOR: GameConfigurator<typeof mahaPieceRegistry> = {
  terrain: { width: 8 },
  pieceLayout: [
    ['R', 'N', 'B', 'K', 'Q', 'B', 'K', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'K', 'Q', 'B', 'K', 'R']
  ]
  // TODO: add this dynamic props going to be needed
  // pieceDynamicProps: []
};

export class MahaGame extends Game {
  constructor(configurator = DEFAULT_MAHA_CONFIGURATOR) {
    super(mahaPieceRegistry, configurator);
  }
}
