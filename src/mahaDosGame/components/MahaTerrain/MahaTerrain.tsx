import { useMemo } from 'react';
import { Arrow } from 'src/ChessTerrain/SVGOverlay';
import {
  isGameInAttackPhaseWithPreparingSubmission,
  isGameInMovePhaseWithPreparingSubmission
} from 'src/gameMechanics/Game/helpers';
import { GameState } from 'src/gameMechanics/Game/types';
import { ChessTerrain, ChessTerrainProps } from '../../../ChessTerrain';

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
  const arrows: Arrow[] = useMemo(() => {
    if (isGameInMovePhaseWithPreparingSubmission(gameState)) {
      return [...gameState.white.moves, ...gameState.black.moves].map((a) => ({
        from: {
          x: a.from.row,
          y: a.from.col
        },
        to: {
          x: a.to.row,
          y: a.to.col
        },
        strokeColor: 'purple'
      }));
    }

    if (isGameInAttackPhaseWithPreparingSubmission(gameState)) {
      return [...gameState.white.attacks, ...gameState.black.attacks].map(
        (a) => ({
          from: {
            x: a.from.row,
            y: a.from.col
          },
          to: {
            x: a.to.row,
            y: a.to.col
          },
          strokeColor: 'red'
        })
      );
    } else {
      console.log(
        'game not in attack phase with preparing submission',
        gameState
      );
    }

    return [];
  }, [gameState]);

  console.log('arrows', arrows);

  return (
    <ChessTerrain
      board={gameState.boardState}
      arrows={arrows}
      {...chessTerrainProps}
    />
  );
};
