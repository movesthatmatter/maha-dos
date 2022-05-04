import { mahaPieceRegistry } from './Pieces/registry';
import { DEFAULT_MAHA_CONFIGURATOR } from './config';
import { GameReconciliator } from '../gameMechanics/Game/GameReconciliator';

export class MahaGameReconciliator extends GameReconciliator {
  constructor(configurator = DEFAULT_MAHA_CONFIGURATOR) {
    super(mahaPieceRegistry, configurator);
  }
}
