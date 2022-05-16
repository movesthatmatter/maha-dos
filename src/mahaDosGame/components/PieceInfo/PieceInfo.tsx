import React from 'react';
import { PieceState } from '../../../gameMechanics/Piece/types';
import { objectKeys } from '../../../gameMechanics/util';

type Props = {
  piece: PieceState;
};

export const PieceInfo: React.FC<Props> = ({ piece }) => {
  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, .1)',
        padding: '1em',
        borderRadius: '16px'
      }}
    >
      <h4>{piece.label}</h4>
      {objectKeys(piece)
        .filter(
          (k) =>
            k !== 'movesDirections' &&
            k !== 'label' &&
            k !== 'attackRange' &&
            k !== 'moveRange' && 
            k !== 'attackDirection'
        )
        .map((prop) => (
          <p>
            {prop}{' '}
            <strong>
              {typeof piece[prop] === 'string'
                ? piece[prop]
                : JSON.stringify(piece[prop])}
            </strong>
          </p>
        ))}
    </div>
  );
};
