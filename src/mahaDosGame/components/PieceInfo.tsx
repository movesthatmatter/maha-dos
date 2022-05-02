import React from 'react';
import { PieceState } from '../../gameMechanics/Piece/types';
import { objectKeys } from '../../gameMechanics/util';

type Props = {
  piece: PieceState;
};

export const PieceInfo: React.FC<Props> = ({ piece }) => {
  return (
    <div>
      <h4>{piece.label}</h4>
      {objectKeys(piece).map((prop) => (
        <p>
          {prop} <strong>{typeof piece[prop] === 'string' ? piece[prop] : JSON.stringify(piece[prop])}</strong>
        </p>
      ))}
    </div>
  );
};
