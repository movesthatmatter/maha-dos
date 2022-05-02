import { ChessTerrain, ChessTerrainProps } from '../../../ChessTerrain';
import {
  GameState,
  isGameStateInMovePhaseWithPreparingSubmission
} from '../../../gameMechanics/Game/types';

export type MahaChessTerrainProps = Omit<
  ChessTerrainProps,
  'board' | 'arrows'
> & {
  gameState: GameState;
};

// This is an abstractuin that takes care of styling and other adaptions to Maha from Chess Terrain
// Might not actually be needed by the end as everything can happen outside as well!
// so as not to load an extra component + calculations here
export const MahaChessTerrain: React.FC<MahaChessTerrainProps> = ({
  gameState,
  ...chessTerrainProps
}) => {
  return (
    <ChessTerrain
      board={gameState.boardState}
      arrows={
        isGameStateInMovePhaseWithPreparingSubmission(gameState)
          ? [...gameState.white.moves, ...gameState.black.moves]
          : undefined
      }
      {...chessTerrainProps}
    />
  );
};
