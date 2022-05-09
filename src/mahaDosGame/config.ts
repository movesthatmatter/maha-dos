import { GameConfigurator } from '../gameMechanics/Game/types';
import { mahaAssetPieceRegistry, mahaPieceRegistry } from './Pieces/registry';

export { mahaPieceRegistry };

export const DEFAULT_MAHA_CONFIGURATOR: GameConfigurator<
  typeof mahaPieceRegistry
> = {
  terrain: { width: 8 },
  pieceLayout: [
    ['bR', 'bN', 'bB', 'bK', 'bQ', 'bB', 'bN', 'bR'],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['wR', 'wN', 'wB', 'wK', 'wQ', 'wB', 'wN', 'wR']
  ],
  // pieceAssets: mahaAssetPieceRegistry
  // TODO: add this dynamic props going to be needed
  // pieceDynamicProps: []
};
