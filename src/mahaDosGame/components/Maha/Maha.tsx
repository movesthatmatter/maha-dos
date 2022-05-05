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
  gameState: GameState; // always receives a game state even if default/pending
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
  const localGameRef = useRef(getGameFromState(gameState));
  const [destinationSquares, setDestinationSquares] = useState<Coord[]>();

  const [preparingGameState, setPreparingGameState] = useState<GameState>();

  // Keep the current game in sync
  useEffect(() => {
    // Only in these situations the given state changes the local one
    // TODO: Test this
    if (
      gameState.state !== localGameRef.current.state.state ||
      (localGameRef.current.state.state === 'inProgress' &&
        gameState.state === 'inProgress' &&
        localGameRef.current.state.phase !== gameState.phase)
    ) {
      localGameRef.current.load(gameState);

      setPreparingGameState(undefined);
    }
  }, [gameState]);

  return (
    <>
      <MahaChessTerrain
        sizePx={500}
        gameState={preparingGameState || gameState}
        styledCoords={destinationSquares?.map((dest) => ({
          ...dest,
          style: destinationSquareStyle
        }))}
        onPieceTouched={(pieceState, coord) => {
          if (!canInteract) {
            return;
          }

          if (playingColor !== pieceState.color) {
            return;
          }

          const piece = localGameRef.current.board.getPieceById(pieceState.id);

          const dests = piece?.evalMove(localGameRef.current);

          if (dests) {
            setDestinationSquares(dests.map((d) => d.to));
          }

          onPieceTouched(pieceState, coord);
        }}
        onPieceDestinationSet={(move) => {
          if (!canInteract) {
            return;
          }

          if (playingColor !== move.piece.color) {
            return;
          }

          localGameRef.current
            .drawMove(move.from, move.to)
            .mapErr((e) => {
              // console.log('error move', e);
            })
            .map((next) => {
              onMoveDrawn(next);
              setPreparingGameState(next.gameState);
            });
        }}
      />
      {preparingGameState && isGameInMovePhaseWithPreparingSubmission(preparingGameState) && (
        <>
          <br />
          <Button
            primary
            label={`Submit`}
            onClick={() => {
              onSubmitMoves(preparingGameState);
            }}
          />
        </>
      )}
    </>
  );
};
