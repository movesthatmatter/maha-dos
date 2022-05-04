import React, { useEffect, useRef, useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import { MahaGame } from './Game';
import { MahaGameReconciliator } from '../../mahaDosGame/MahaGameReconciliator';
import { GameState } from 'src/gameMechanics/Game/types';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Game',
  component: MahaGame,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  }
} as ComponentMeta<typeof MahaGame>;

export const PlayWithReconciliator = () => {
  const reconciliator = useRef(new MahaGameReconciliator());

  const [reconciledGameState, setReconciledGameState] = useState<GameState>(
    reconciliator.current.state
  );

  useEffect(() => {
    console.log(
      'PlayWithReconciliator: Reconciliator Game State Updated',
      reconciledGameState
    );
  }, [reconciledGameState]);

  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <div>
        <MahaGame
          color="white"
          gameState={reconciledGameState}
          onSubmitMoves={(gameState) => {
            reconciliator.current
              .submitMoves({
                moves: gameState.white.moves,
                color: 'white'
              })
              .mapErr((e) => {
                console.log('PlayWithReconciliator.White OnSubmitMoves err', e);
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
          gameState={reconciledGameState}
          onSubmitMoves={(gameState) => {
            reconciliator.current
              .submitMoves({
                moves: gameState.black.moves,
                color: 'black'
              })
              .mapErr((e) => {
                console.log('PlayWithReconciliator.Black OnSubmitMoves err', e);
              })
              .map((nextState) => {
                setReconciledGameState(nextState);
              });
          }}
        />
      </div>
    </div>
  );
};
