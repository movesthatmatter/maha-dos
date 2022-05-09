import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import {
  GameState,
  GameStateInAttackPhaseWithPreparingSubmission,
  GameStateInMovePhaseWithPreparingSubmission
} from '../../../gameMechanics/Game/types';
import { Coord, noop } from '../../../gameMechanics/util';
import { MahaGame } from '../../..//mahaDosGame/MahaGame';
import { MahaChessTerrain, MahaChessTerrainProps } from '../MahaTerrain';
import { Button } from '../Button';
import { Color } from '../../../gameMechanics/commonTypes';
import {
  isGameInAttackPhaseWithPreparingSubmission,
  isGameInMovePhaseWithPreparingSubmission
} from '../../../gameMechanics/Game/helpers';
import { mahaAssetPieceRegistry } from '../../../mahaDosGame/Pieces/registry';

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
  onSquareTouched?: MahaChessTerrainProps['onSquareTouched'];
  // onMoveDrawn?: (p: { move: Move; gameState: GameState }) => void;
  // onAttackDrawn?: (p: { attack: Attack, gameState: GameState})
};

const getGameFromState = (gameState?: GameState) => {
  const game = new MahaGame();

  if (gameState) {
    game.load(gameState);
  } else {
    game.start();
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
  onSquareTouched = noop
  // onMoveDrawn = noop
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

  const workingGameState = preparingGameState || gameState;

  useEffect(() => {
    console.log('workingGameState', workingGameState);
  }, [workingGameState]);

  return (
    <>
      <MahaChessTerrain
        sizePx={500}
        gameState={workingGameState}
        styledCoords={destinationSquares?.map((dest) => ({
          ...dest,
          style: destinationSquareStyle
        }))}
        pieceAssets={mahaAssetPieceRegistry}
        // pieceAssetsByPieceId={localGameRef.current.board.}
        playingColor={playingColor}
        onPieceTouched={(pieceState, coord) => {
          // console.log('on piece touched', pieceState, coord, workingGameState);
          console.log('on piece touched', pieceState, coord);

          if (!canInteract) {
            return;
          }

          if (playingColor !== pieceState.color) {
            return;
          }

          if (workingGameState.state !== 'inProgress') {
            return;
          }

          const piece = localGameRef.current.board.getPieceById(pieceState.id);
          // const pieceCoord = localGameRef.current.board.getPieceCoordById(
          //   pieceState.id
          // );
          // console.log('on touched piece coord', pieceCoord);
          // console.dir(toPrintableBoard(localGameRef.current.board.state));

          if (workingGameState.phase === 'move') {
            const dests = piece?.evalMove(localGameRef.current);

            if (dests) {
              setDestinationSquares(dests.map((d) => d.to));
            }
          } else {
            const dests = piece?.evalAttack(localGameRef.current);

            console.log('atack dests', dests);

            if (dests) {
              setDestinationSquares(dests.map((d) => d.to));
            }
          }

          onPieceTouched(pieceState, coord);
        }}
        onSquareTouched={onSquareTouched}
        onPieceDestinationSet={(move) => {
          if (!canInteract) {
            return;
          }

          if (playingColor !== move.piece.color) {
            return;
          }

          if (workingGameState.state !== 'inProgress') {
            return;
          }

          if (workingGameState.phase === 'move') {
            localGameRef.current
              .drawMove(move.from, move.to)
              .mapErr((e) => {
                // console.log('error move', e);
              })
              .map((next) => {
                // onMoveDrawn(next);
                setPreparingGameState(next.gameState);
              });
          } else {
            localGameRef.current
              .drawAttack(move.from, move.to)
              .mapErr((e) => {
                console.log('error attack', e);
              })
              .map((next) => {
                console.log('successattack', next);
                // onAttackDrawn(next);
                setPreparingGameState(next.gameState);
              });
          }
        }}
      />
      {preparingGameState && (
        <>
          <br />
          {isGameInMovePhaseWithPreparingSubmission(preparingGameState) && (
            <Button
              primary
              label={`Submit Moves`}
              onClick={() => {
                onSubmitMoves(preparingGameState);
              }}
            />
          )}
          {isGameInAttackPhaseWithPreparingSubmission(preparingGameState) && (
            <Button
              primary
              label={`Submit Attacks`}
              onClick={() => {
                onSubmitAttacks(preparingGameState);
              }}
            />
          )}
        </>
      )}
    </>
  );
};
