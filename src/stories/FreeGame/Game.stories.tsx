import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { MahaGame } from './Game';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Game',
  component: MahaGame,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  }
} as ComponentMeta<typeof MahaGame>;

// export const FreeGame = () => <MahaGame />;

export const PlayWithReconciliator = () => {
  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <div>
        <MahaGame
          color="white"
          onSubmitMoves={(gameState) => {
            console.log('on submit moves white', gameState.white.moves);
          }}
        />
      </div>
      <div>
        <MahaGame
          color="black"
          onSubmitMoves={(gameState) => {
            console.log('on submit moves black', gameState.black.moves);
          }}
        />
      </div>
    </div>
  );
};
