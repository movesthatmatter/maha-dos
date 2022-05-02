import { CSSProperties, useEffect, useRef, useState } from 'react';
import { ChessTerrain, ChessTerrainProps } from '../../ChessTerrain';
import {
  GameState,
  GameStateInMovePhaseWithPreparingSubmission,
  isGameStateInMovePhaseWithPreparingSubmission,
  Move
} from '../../gameMechanics/Game/types';
import {
  Coord,
  coordsAreEqual,
  matrixInsertMany,
  noop
} from '../../gameMechanics/util';
import { DEFAULT_MAHA_CONFIGURATOR } from '../config';
import { MahaGame } from '../MahaGame';

const destinationSquareStyle: CSSProperties = {
  background: 'rgba(0, 0, 150, .5)',
  borderRadius: '8px'
};

export type MahaChessTerrainProps = {
  onPieceTouched?: ChessTerrainProps['onTouchedPiece'];
  onMoveDrawn?: (move: Move) => void;
  onUpdated?: (game: GameState) => void;
};

export const MahaChessTerrain: React.FC<MahaChessTerrainProps> = ({
  onPieceTouched = noop,
  onMoveDrawn = noop,
  onUpdated = noop
}) => {
  const gameRef = useRef(
    new MahaGame({
      ...DEFAULT_MAHA_CONFIGURATOR,
      pieceLayout: [
        ['R', 'N', 'B', 'K', 'Q', 'B', 'N', 'R'],
        ['P', 'P', 'P', 0, 0, 'P', 'P', 'P'],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 'P', 'P', 0, 0, 0],
        [0, 0, 0, 'P', 'P', 0, 0, 0],
        [0, 'P', 'N', 0, 0, 0, 'P', 0],
        ['P', 'B', 'P', 0, 'Q', 'P', 0, 'P'],
        ['R', 0, 0, 'K', 0, 'B', 'N', 'R']
      ]
    })
  );

  const [gameState, setGameState] = useState(gameRef.current.state);
  const [destinationSquares, setDestinationSquares] = useState<Coord[]>();

  useEffect(() => {
    onUpdated(gameState);
  }, [gameState]);

  return (
    <ChessTerrain
      sizePx={500}
      board={gameState.boardState}
      styledCoords={destinationSquares?.map((dest) => ({
        ...dest,
        style: destinationSquareStyle
      }))}
      arrows={
        isGameStateInMovePhaseWithPreparingSubmission(gameState)
          ? [...gameState.white.moves, ...gameState.black.moves]
          : undefined
      }
      onTouchedPiece={(pieceState, coord) => {
        const piece = gameRef.current.board.getPieceById(pieceState.id);

        const dests = piece?.evalMove(gameRef.current);
        if (dests) {
          setDestinationSquares(dests.map((d) => d.to));
        }

        console.log('dests', piece, dests);

        onPieceTouched(pieceState, coord);
      }}
      onMove={(move) => {
        // TODO: This is definitely not the end ode -neeeds to be refactored and tested!!
        // TODO: this is actually part of the logic that needs to go in the engine draw move
        setGameState((prev) => {
          if (prev.state === 'completed') {
            return prev;
          }

          const piece = gameRef.current.board.getPieceById(move.piece.id);

          if (!piece) {
            return prev;
          }

          const dests = piece.evalMove(gameRef.current);

          // Move is Valid
          const moveIsPartOfDests = dests.find((d) =>
            coordsAreEqual(d.to, move.to)
          );

          console.log('moveIsPartOfDests', moveIsPartOfDests);

          if (!moveIsPartOfDests) {
            return prev;
          }

          // console.log('no mas', !!moveIsPartOfDests);

          // const prevPiece = move.piece.
          const nextPieceLayoutState = matrixInsertMany(
            prev.boardState.pieceLayoutState,
            [
              // {
              //   index: [move.from.row, move.from.col],
              //   nextVal: 0
              // },
              // {
              //   index: [move.to.row, move.to.col],
              //   nextVal: move.piece
              // }
            ]
          );

          const preparing: GameStateInMovePhaseWithPreparingSubmission = {
            ...prev,
            state: 'inProgress',
            boardState: prev.boardState,
            history: prev.history,
            winner: undefined,
            // boardState: {
            //   ...prev.boardState,
            //   pieceLayoutState: nextPieceLayoutState
            // },

            phase: 'move',
            submissionStatus: 'preparing',

            // ...
            ...(isGameStateInMovePhaseWithPreparingSubmission(prev)
              ? {
                  white: prev.white,
                  black: prev.black
                }
              : {
                  white: {
                    canDraw: true,
                    moves: []
                  },
                  black: {
                    canDraw: true,
                    moves: []
                  }
                })

            // [move.piece.color]: {

            // },
          };

          // const merged = {
          //   ...defaultPreparing,
          //   ...prev
          // };

          // TODO: This has nothing to do here!
          onMoveDrawn(move);

          return {
            ...preparing,
            ...(isGameStateInMovePhaseWithPreparingSubmission(preparing) && {
              white: {
                ...preparing.white,
                ...(move.piece.color === 'white' && {
                  moves: [...preparing.white.moves, move]
                })
              },
              black: {
                ...preparing.black,
                ...(move.piece.color === 'black' && {
                  moves: [...preparing.black.moves, move]
                })
              }
            })
          };
        });

        console.log('move', move);
      }}
    />
  );
};
