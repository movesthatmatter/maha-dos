import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { GameState, Move } from '../../../gameMechanics/Game/types';
import { Coord, noop } from '../../../gameMechanics/util';
import { MahaGame } from '../../..//mahaDosGame/MahaGame';
import { MahaChessTerrain, MahaChessTerrainProps } from '../MahaTerrain';

type Props = {
  gameState?: GameState;
  onSubmit: () => void;
  onPieceTouched?: MahaChessTerrainProps['onPieceTouched'];
  onMoveDrawn?: (p: { move: Move; gameState: GameState }) => void;
};

const getGameFromState = (gameState?: GameState) => {
  const game = new MahaGame();

  if (gameState) {
    game.load(gameState);
  }

  return game;
};

const destinationSquareStyle: CSSProperties = {
  background: 'rgba(0, 0, 150, .5)',
  borderRadius: '8px'
};

export const Maha: React.FC<Props> = ({
  gameState,
  onSubmit,
  onPieceTouched = noop,
  onMoveDrawn = noop
}) => {
  const gameRef = useRef(getGameFromState(gameState));
  const [state, setState] = useState(gameRef.current.state);
  const [destinationSquares, setDestinationSquares] = useState<Coord[]>();

  useEffect(() => {
    if (gameState) {
      gameRef.current.load(gameState);
    }
  }, [gameState]);

  return (
    <MahaChessTerrain
      sizePx={500}
      gameState={state}
      styledCoords={destinationSquares?.map((dest) => ({
        ...dest,
        style: destinationSquareStyle
      }))}
      // onPieceTouched={onPieceTouched}
      onPieceTouched={(pieceState, coord) => {
        const piece = gameRef.current.board.getPieceById(pieceState.id);

        const dests = piece?.evalMove(gameRef.current);

        if (dests) {
          setDestinationSquares(dests.map((d) => d.to));
        }

        console.log('dests', piece, dests);

        onPieceTouched(pieceState, coord);
      }}
      onPieceDestinationSet={(move) => {
        gameRef.current
          .drawMove(move.from, move.to)
          .mapErr((e) => {
            console.log('error move', e);
          })
          .map((next) => {
            onMoveDrawn(next);
            setState(next.gameState);

            console.log('moved successfully', next);
          });
      }}
      // onUpdated={(next: GameState) => {
      //   if (isGameStateInMovePhaseWithPartialOrPreparingSubmission(next)) {
      //     setMovesbyColor(() => ({
      //       white: next.white.moves,
      //       black: next.black.moves
      //     }));
      //     DEFA;
      //   }
      // }}
    />
  );
};
