import { Game } from '../gameMechanics/Game/Game';
import { mahaPieceRegistry } from './Pieces/registry';
import {DEFAULT_MAHA_CONFIGURATOR} from './config';

export class MahaGame extends Game {
  constructor(configurator = DEFAULT_MAHA_CONFIGURATOR) {
    super(mahaPieceRegistry, configurator);
  }
}
