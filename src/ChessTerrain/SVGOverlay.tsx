import React, { CSSProperties } from 'react';
import { LineVector } from '../gameMechanics/util';

const DEFAULT_ARROW_STROKE_COLOR = 'purple';

export type Arrow = LineVector & {
  strokeColor?: string;
  width: number;
};

type Props = {
  width: number;
  height: number;
  fill?: string;
  // className
  style?: CSSProperties;

  arrows?: Arrow[];
};

const toArrowId = (arrow: Arrow) =>
  `${arrow.from.x},${arrow.from.y}-${arrow.to.x},${arrow.to.y}`;

export const SVGOverlay: React.FC<Props> = ({
  width,
  height,
  fill,
  arrows,
  // className,
  style
}) => {
  return (
    <div
      style={{
        width,
        height,
        zIndex: 99999
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={style}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {arrows?.map((arrow) => (
          <>
            <defs>
              <marker
                id={`arrowhead-${toArrowId(arrow)}`}
                markerWidth={4}
                markerHeight={4}
                refX={0}
                refY={2}
                orient="auto"
              >
                <polygon
                  points="0 4, 3 2, 0 0"
                  fill={arrow.strokeColor || DEFAULT_ARROW_STROKE_COLOR}
                />
              </marker>
            </defs>
            <line
              strokeWidth={arrow.width}
              x1={arrow.from.x}
              y1={arrow.from.y}
              x2={arrow.to.x}
              y2={arrow.to.y}
              stroke={arrow.strokeColor || DEFAULT_ARROW_STROKE_COLOR}
              markerEnd={`url(#arrowhead-${toArrowId(arrow)})`}
            />
          </>
        ))}
      </svg>
    </div>
  );
};
