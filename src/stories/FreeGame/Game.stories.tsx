import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import { MahaGame } from './Game';
import { MahaGameReconciliator } from '../../mahaDosGame/MahaGameReconciliator';
import { GameState } from '../../gameMechanics/Game/types';
import { Button } from '../../mahaDosGame/components/Button';
import { GameReconciliator } from 'src/gameMechanics/Game/GameReconciliator';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Game',
  component: MahaGame,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  }
} as ComponentMeta<typeof MahaGame>;

const startNewGame = (gameState?: GameState) => {
  const game = new MahaGameReconciliator();
  game.start();

  return game;
};

export const PlayWithReconciliator = () => {
  const reconciliator = useRef(startNewGame());

  const [reconciledGameState, setReconciledGameState] = useState<GameState>(
    reconciliator.current.state
  );

  const [gameSnapshots, setGameSnapshots] = useState<GameState[]>([]);
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState(-1);

  useEffect(() => {
    setGameSnapshots((prev) => {
      const next = [...prev, reconciledGameState];

      setCurrentSnapshotIndex(next.length - 1);

      return next;
    });
  }, [
    // reconciledGameState.state,
    reconciledGameState.history.length,
    reconciledGameState.state === 'inProgress' && reconciledGameState.phase
  ]);

  useEffect(() => {
    console.log(
      'PlayWithReconciliator: Reconciliator Game State Updated',
      reconciledGameState
    );
  }, [reconciledGameState]);

  const workingGameState = useMemo(
    () => {
      // if last return the reconciled game
      if (currentSnapshotIndex === gameSnapshots.length - 1) {
        return reconciledGameState;
      }

      const prev = gameSnapshots[currentSnapshotIndex];

      // if not existent return the reconciled game
      if (!prev) {
        return reconciledGameState;
      }

      return prev;
    },
    [gameSnapshots, currentSnapshotIndex, reconciledGameState]
  );

  return (
    <div>
      <div
        style={{
          display: 'flex'
        }}
      >
        <div>
          <MahaGame
            color="white"
            gameState={workingGameState}
            onSubmitAttacks={(gameState) => {
              reconciliator.current
                .submitAttacks({
                  attacks: gameState.white.attacks,
                  color: 'white'
                })
                .mapErr((e) => {
                  console.log(
                    'PlayWithReconciliator.White onSubmitAttack err',
                    e
                  );
                })
                .map((nextState) => {
                  console.log(
                    'PlayWithReconciliator.White onSubmitAttack ok',
                    nextState
                  );
                  setReconciledGameState(nextState);
                });
            }}
            onSubmitMoves={(gameState) => {
              reconciliator.current
                .submitMoves({
                  moves: gameState.white.moves,
                  color: 'white'
                })
                .mapErr((e) => {
                  console.log(
                    'PlayWithReconciliator.White OnSubmitMoves err',
                    e
                  );
                })
                .map((nextState) => {
                  // console.log('PlayWithReconciliator.White OnSubmitMoves Next Reconciled Game State', nextState);

                  setReconciledGameState(nextState);
                });
            }}
          />
        </div>
        <div>
          <MahaGame
            color="black"
            gameState={workingGameState}
            onSubmitAttacks={(gameState) => {
              reconciliator.current
                .submitAttacks({
                  attacks: gameState.black.attacks,
                  color: 'black'
                })
                .mapErr((e) => {
                  console.log(
                    'PlayWithReconciliator.Black onSubmitAttack err',
                    e
                  );
                })
                .map((nextState) => {
                  console.log(
                    'PlayWithReconciliator.Black onSubmitAttack ok',
                    nextState
                  );
                  setReconciledGameState(nextState);
                });
            }}
            onSubmitMoves={(gameState) => {
              reconciliator.current
                .submitMoves({
                  moves: gameState.black.moves,
                  color: 'black'
                })
                .mapErr((e) => {
                  console.log(
                    'PlayWithReconciliator.Black OnSubmitMoves err',
                    e
                  );
                })
                .map((nextState) => {
                  setReconciledGameState(nextState);
                });
            }}
          />
        </div>
      </div>
      <br />
      <Button
        label="Prev"
        disabled={!(currentSnapshotIndex > 0)}
        onClick={() => {
          console.log('prev');

          if (currentSnapshotIndex > 0) {
            setCurrentSnapshotIndex((prev) => prev - 1);
          }
        }}
      />
      <Button
        label="Next"
        disabled={!(gameSnapshots.length > currentSnapshotIndex + 1)}
        onClick={() => {
          console.log('next');
          if (gameSnapshots.length > currentSnapshotIndex + 1) {
            setCurrentSnapshotIndex((prev) => prev + 1);
          }
        }}
      />
      <br />
      {currentSnapshotIndex} of {gameSnapshots.length}
    </div>
  );
};
