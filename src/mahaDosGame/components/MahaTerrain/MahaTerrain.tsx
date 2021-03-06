import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { Arrow } from '../../../ChessTerrain/SVGOverlay';
import {
  isGameInAttackPhase,
  isGameInAttackPhaseWithPreparingSubmission,
  isGameInMovePhase,
  isGameInMovePhaseWithPreparingSubmission
} from '../../../gameMechanics/Game/helpers';
import { GameState } from '../../../gameMechanics/Game/types';
import { ChessTerrain, ChessTerrainProps } from '../../../ChessTerrain';
import { Coord, coordsAreEqual, noop } from '../../..//gameMechanics/util';
import { mahaAssetPieceRegistry } from '../../../mahaDosGame/Pieces/registry';
import { Button } from '../Button';
import {
  Attack,
  Color,
  Move,
  ShortAttack,
  ShortMove
} from '../../../gameMechanics/commonTypes';
import { IdentifiablePieceState } from '../../../gameMechanics/Piece/types';
import { Result } from 'ts-results';

export type MahaChessTerrainProps = Omit<
  ChessTerrainProps,
  | 'board'
  | 'arrows'
  | 'pieceAssets'
  | 'overlays'
  | 'onPieceDestinationSet'
  | 'onPieceTouched'
> & {
  gameState: GameState;
  playingColor: Color;
  canInteract?: boolean;
  destinationSquares?: Coord[];

  possibleMoveSquares: ShortMove[];
  onMove: (m: ShortMove) => Result<Move, unknown>;

  possibleAttackSquares: Coord[];
  onAttack: (a: ShortAttack) => Result<Attack, unknown>;

  onPieceTouched?: (
    p: { coord: Coord; piece: IdentifiablePieceState } | undefined
  ) => void;
};

const possibleMoveSquareStyle: CSSProperties = {
  background: 'rgba(0, 0, 150, .5)',
  borderRadius: '8px'
};

const possibleAttackSquareStyle: CSSProperties = {
  background: 'rgba(150, 0, 0, .5)',
  borderRadius: '8px'
};

const touchedPieceSquareStyle: CSSProperties = {
  background: 'rgba(0, 150, 150, .5)',
  borderRadius: '8px'
};

export const MahaChessTerrain: React.FC<MahaChessTerrainProps> = ({
  gameState,
  canInteract = false,
  onPieceTouched = noop,
  onEmptySquareTouched = noop,

  possibleMoveSquares,
  possibleAttackSquares,

  onMove,
  onAttack,
  ...chessTerrainProps
}) => {
  const arrows: Arrow[] = useMemo(() => {
    if (isGameInMovePhaseWithPreparingSubmission(gameState)) {
      return [...gameState.white.moves, ...gameState.black.moves].map((a) => ({
        width: 1,
        from: {
          x: a.from.col,
          y: a.from.row
        },
        to: {
          x: a.to.col,
          y: a.to.row
        },
        strokeColor: 'rgba(114, 9, 183, .7)'
      }));
    }

    if (isGameInAttackPhaseWithPreparingSubmission(gameState)) {
      return [...gameState.white.attacks, ...gameState.black.attacks].map(
        (a) => ({
          width: 1,
          from: {
            x: a.from.col,
            y: a.from.row
          },
          to: {
            x: a.to.col,
            y: a.to.row
          },
          strokeColor: 'rgba(255, 0, 110, .7)'
        })
      );
    } else {
      console.log(
        'game not in attack phase with preparing submission',
        gameState
      );
    }

    return [];
  }, [gameState]);

  const [attackOverlays, setAttackOverlays] = useState<Coord[]>();

  const [touchedPiece, setTouchedPiece] = useState<{
    coord: Coord;
    piece: IdentifiablePieceState;
  }>();

  useEffect(() => {
    onPieceTouched(touchedPiece);
  }, [touchedPiece]);

  return (
    <ChessTerrain
      board={gameState.boardState}
      arrows={arrows}
      pieceAssets={mahaAssetPieceRegistry}
      styledCoords={[
        ...possibleAttackSquares.map((dest) => ({
          ...dest,
          style: possibleAttackSquareStyle
        })),
        ...possibleMoveSquares.map((dest) => ({
          ...{ row: dest.to.row, col: dest.to.col },
          style: possibleMoveSquareStyle
        })),
        ...(touchedPiece
          ? [{ ...touchedPiece.coord, style: touchedPieceSquareStyle }]
          : [])
      ]}
      overlays={attackOverlays?.map((coord) => {
        return {
          coord,
          component: (
            <div
              style={{
                background: 'rgba(0, 0, 0, .5)',
                width: '100%',
                height: '100%'
              }}
            >
              <Button
                label="Mellee"
                onClick={() => {
                  console.log('Mellee Attack', coord);
                }}
              />
              <Button
                label="Range"
                onClick={() => {
                  console.log('Range Attack', coord);
                }}
              />
            </div>
          )
        };
      })}
      onPieceTouched={(pieceState, coord) => {
        if (!canInteract) {
          return;
        }

        // If same coords, means untouch
        if (touchedPiece && coordsAreEqual(touchedPiece?.coord, coord)) {
          setTouchedPiece(undefined);

          return;
        }

        // If the next touched piece is also mine maybe this piece wants to move there
        if (
          isGameInMovePhase(gameState) &&
          touchedPiece &&
          touchedPiece.piece.color === pieceState.color
        ) {
          const res = onMove({
            from: touchedPiece.coord,
            to: coord
          });

          // If the move was valid, stop here
          // otherwise go on with the logic
          if (res.ok) {
            setTouchedPiece(undefined);
            return;
          }
        }

        if (isGameInAttackPhase(gameState) && touchedPiece) {
          const res = onAttack({
            from: touchedPiece.coord,
            to: coord
          });

          // If the attack was valid, stop here!
          // otherwise go further with the logic
          // This check ensures that touching another own piece
          //  the touched piece just changes to that
          // In case of the bishop, pressing own piece can result in a healing (if valid)
          //  but this solves for that as well b/c it only applies it if possible
          //  otherwise it switches to the other own piece!
          if (res.ok) {
            setTouchedPiece(undefined);
            return;
          }
        }

        if (chessTerrainProps.playingColor === pieceState.color) {
          setTouchedPiece({ piece: pieceState, coord });
        }
      }}
      onEmptySquareTouched={(coord) => {
        if (isGameInMovePhase(gameState) && touchedPiece) {
          const move = possibleMoveSquares.find(
            (m) =>
              coordsAreEqual(m.from, touchedPiece.coord) &&
              coordsAreEqual(m.to, coord)
          );
          if (move) {
            onMove(move);
          }
        }

        setTouchedPiece(undefined);
      }}
      {...chessTerrainProps}
    />
  );
};
