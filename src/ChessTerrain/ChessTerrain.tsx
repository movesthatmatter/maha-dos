import React, {
  MouseEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { BoardState } from 'src/gameMechanics/Board/types';
import { boardMap } from 'src/gameMechanics/Board/util';
import { Move } from 'src/gameMechanics/Game/types';
import {
  IdentifiablePieceState,
  PieceState
} from 'src/gameMechanics/Piece/types';
import { Coord, noop } from 'src/gameMechanics/util';

type Props = {
  sizePx: number;
  board: BoardState;

  onTouch?: (coord: Coord, piece?: IdentifiablePieceState<string>) => void;
  onMove?: (move: Move) => void;
};

export const ChessTerrain: React.FC<Props> = ({
  onTouch = noop,
  onMove = noop,
  board,
  sizePx
}) => {
  const squareSize = useMemo(
    () => sizePx / board.terrainState.length,
    [sizePx, board.terrainState.length]
  );

  const [touchedPiece, setTouchedPiece] = useState<{
    coord: Coord;
    piece: IdentifiablePieceState<string>;
  }>();

  useEffect(() => {
    if (touchedPiece) {
      onTouch(touchedPiece.coord, touchedPiece.piece);
    }
  }, [touchedPiece]);

  const onSquareClick = useCallback(
    (e: MouseEvent) => {
      const rect = (e.target as any).getBoundingClientRect();
      const x = e.clientX - rect.left; //x position within the element.
      const y = e.clientY - rect.top; //y position within the element.

      const coord = {
        row: Math.floor(y / squareSize),
        col: Math.floor(x / squareSize)
      };

      // console.log('actual', { x, y }, 'coord', coord);

      if (touchedPiece) {
        onMove({
          from: touchedPiece.coord,
          to: coord,
          piece: touchedPiece.piece
        });
        setTouchedPiece(undefined);
      }
    },
    [squareSize, touchedPiece]
  );

  // const onPieceClick = useCallback((e: MouseEvent) => {

  // }, [squareSize])

  return (
    <div
      style={{
        width: sizePx,
        height: sizePx,
        background: 'green',
        backgroundImage: 'url("tiles_dark.png")',
        backgroundSize: (sizePx * 2) / board.terrainState.length,
        backgroundRepeat: 'repeat',

        position: 'relative',
        zIndex: 99,
        cursor: 'pointer'
        // Adjust the position if needed to match the bottomLeft corner
        // backgroundPosition: `0 ${props.sizePx * 2}`,
      }}
      onClick={onSquareClick}
    >
      {boardMap(board, (coord, piece) => {
        // TODO: Optimize by only iterating over the pieces!
        if (!piece) {
          return null;
        }

        return (
          <div
            style={{
              position: 'absolute',
              background: 'rgba(255, 0, 0, .2)',
              color: piece.color,
              width: squareSize,
              height: squareSize,
              left: coord.col * squareSize,
              top: coord.row * squareSize,
              zIndex: 9,

              display: 'flex',
              // flex: 1,
              alignContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer'
              // alignSelf: 'center',
            }}
            onClick={(e) => {
              setTouchedPiece({
                coord,
                piece
              });

              e.stopPropagation();
            }}
            // onClick={() => {
            //   // setTouchedPiece()
            //   onTouch(coord, piece);
            // }}
            // onMouseDown={(e) => {
            //   e.preventDefault();

            //   console.log('works', e);
            // }}
          >
            {piece.label}
            <br />
            {(piece.hitPoints / piece.maxHitPoints) * 100} HP
          </div>
        );
      })}
    </div>
  );
};
