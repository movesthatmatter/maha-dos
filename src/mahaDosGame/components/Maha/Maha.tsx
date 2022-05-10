import React, { useEffect, useRef, useState } from 'react';
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
  isGameInAttackPhase,
  isGameInAttackPhaseWithPartialOrPreparingSubmission,
  isGameInAttackPhaseWithPreparingSubmission,
  isGameInMovePhase,
  isGameInMovePhaseWithPartialOrPreparingSubmission,
  isGameInMovePhaseWithPartialSubmission,
  isGameInMovePhaseWithPreparingSubmission
} from '../../../gameMechanics/Game/helpers';

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
  onEmptySquareTouched?: MahaChessTerrainProps['onEmptySquareTouched'];
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

export const Maha: React.FC<MahaProps> = ({
  gameState,
  playingColor,
  onSubmitMoves,
  onSubmitAttacks,
  canInteract = false,
  onPieceTouched = noop,
  onEmptySquareTouched = noop
}) => {
  const localGameRef = useRef(getGameFromState(gameState));
  const [possibleMoveSquares, setPossibleMoveSquares] = useState<Coord[]>([]);
  const [possibleAttackSquares, setPossibleAttackSquares] = useState<Coord[]>(
    []
  );

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
      // (localGameRef.current.state.state === 'inProgress' &&
      //   gameState.state === 'inProgress' &&
      //   localGameRef.current.state.submissionStatus !==
      //     gameState.submissionStatus)
    ) {
      localGameRef.current.load(gameState);

      setPreparingGameState(undefined);
    }
  }, [gameState]);

  const workingGameState = preparingGameState || gameState;

  // useEffect(() => {
  //   console.log('change in either game state!!!')
  // }, [gameState, preparingGameState])

  // useEffect(() => {
  //   console.log('workingGameState updated', workingGameState);
  // }, [workingGameState]);

  return (
    <>
      <MahaChessTerrain
        sizePx={500}
        gameState={workingGameState}
        possibleAttackSquares={possibleAttackSquares}
        possibleMoveSquares={possibleMoveSquares}
        playingColor={playingColor}
        canInteract={canInteract}
        onPieceTouched={(p) => {
          if (!p) {
            setPossibleMoveSquares([]);
            setPossibleAttackSquares([]);

            return;
          }

          if (!canInteract) {
            return;
          }

          if (playingColor !== p.piece.color) {
            return;
          }

          if (workingGameState.state !== 'inProgress') {
            return;
          }

          const piece = localGameRef.current.board.getPieceById(p.piece.id);

          if (workingGameState.phase === 'move') {
            const dests = piece?.evalMove(getGameFromState(workingGameState));

            if (dests) {
              setPossibleMoveSquares(dests.map((d) => d.to));
            }
          } else {
            const dests = piece?.evalAttack(localGameRef.current);

            if (dests) {
              setPossibleAttackSquares(dests.map((d) => d.to));
            }
          }

          onPieceTouched(p);
        }}
        onEmptySquareTouched={(coord) => {
          onEmptySquareTouched(coord);

          setPossibleMoveSquares([]);
          setPossibleAttackSquares([]);
        }}
        onMove={(move) => {
          localGameRef.current.drawMove(move.from, move.to).map((next) => {
            setPreparingGameState(next.gameState);
          });

          setPossibleMoveSquares([]);
        }}
        onAttack={(attack) => {
          localGameRef.current
            .drawAttack(attack.from, attack.to)
            .map((next) => {
              setPreparingGameState(next.gameState);
            });

          setPossibleAttackSquares([]);
        }}
      />
      <>
        <br />
        {isGameInMovePhase(gameState) && (
          <Button
            primary={gameState[playingColor].canDraw}
            disabled={!gameState[playingColor].canDraw}
            label={`Submit Moves`}
            onClick={() => {
              if (
                preparingGameState &&
                isGameInMovePhaseWithPreparingSubmission(preparingGameState) &&
                preparingGameState[playingColor].canDraw
              ) {
                onSubmitMoves(preparingGameState);
              }
            }}
          />
        )}
        {isGameInAttackPhase(gameState) && (
          <Button
            primary={gameState[playingColor].canDraw}
            disabled={!gameState[playingColor].canDraw}
            label={`Submit Attacks`}
            onClick={() => {
              console.log('press attack');
              if (
                preparingGameState &&
                isGameInAttackPhaseWithPreparingSubmission(
                  preparingGameState
                ) &&
                preparingGameState[playingColor].canDraw
              ) {
                onSubmitAttacks(preparingGameState);
              }
            }}
          />
        )}
      </>
      {/* <div
        style={{
          width: '500px'
        }}
      >
        <pre>{JSON.stringify(workingGameState, null, 2)}</pre>
      </div> */}
    </>
  );
};
