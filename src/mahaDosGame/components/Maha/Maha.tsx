import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import {
  GameState,
  GameStateInAttackPhaseWithPreparingSubmission,
  GameStateInMovePhaseWithPreparingSubmission,
  isGameInMovePhaseWithPreparingSubmission,
  Move
} from '../../../gameMechanics/Game/types';
import { Color, Coord, noop } from '../../../gameMechanics/util';
import { MahaGame } from '../../..//mahaDosGame/MahaGame';
import { MahaChessTerrain, MahaChessTerrainProps } from '../MahaTerrain';
import { Button } from '../Button';

export type MahaProps = {
  onSubmitMoves: (
    gameState: GameStateInMovePhaseWithPreparingSubmission
  ) => void;
  onSubmitAttacks: (
    gameState: GameStateInAttackPhaseWithPreparingSubmission
  ) => void;
  canInteract?: boolean;
  playingColor: Color;
  gameState?: GameState;
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

export const Maha: React.FC<MahaProps> = ({
  gameState,
  playingColor,
  onSubmitMoves,
  onSubmitAttacks,
  canInteract = false,
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
    <>
      <MahaChessTerrain
        sizePx={500}
        gameState={state}
        styledCoords={destinationSquares?.map((dest) => ({
          ...dest,
          style: destinationSquareStyle
        }))}
        // onPieceTouched={onPieceTouched}

        onPieceTouched={(pieceState, coord) => {
          if (!canInteract) {
            return;
          }

          if (playingColor !== pieceState.color) {
            return;
          }

          const piece = gameRef.current.board.getPieceById(pieceState.id);

          const dests = piece?.evalMove(gameRef.current);

          if (dests) {
            setDestinationSquares(dests.map((d) => d.to));
          }

          // console.log('dests', piece, dests);

          onPieceTouched(pieceState, coord);
        }}
        onPieceDestinationSet={(move) => {
          if (!canInteract) {
            return;
          }

          if (playingColor !== move.piece.color) {
            return;
          }

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
      {isGameInMovePhaseWithPreparingSubmission(state) && (
        <>
          <br />
          <Button
            primary
            label={`Submit`}
            onClick={() => {
              onSubmitMoves(state);
            }}
          />
        </>
      )}
    </>
  );
};
