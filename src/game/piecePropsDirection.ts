// movements = [
//   0 0 0 0 0
//   0 0 0 0 0
//   0 0 D 0 0
//   0 0 0 0 0
// ]
// square = {
//   x: 0,
//   y: 0
// }

// knightMoveDeltaFromSquare = [{
//   x: x + 2
//   y: y + 1
// }, {
//   x: x + 1,
//   y: y + 2,
// }, {
//   x : x - 1,
//   y : y - 2
// }, {
//   x : x - 2,
//   y : y - 1
// }]

// bishopMoveDeltaFromSquare = [{
//   x: x++,
//   y: y++
// }, {
//   x: x--,
//   y: y--
// }]

// rookMoveDeltaFromSquare = [{
//   x: x++ ,
//   y: y + 0
// }, {
//   x: x--,
//   y: y + 0
// }, {
//   x: x+ 0,
//   y: y ++,
// }, {
//   x: x+ 0,
//   y--
// }]

// movePattern:
//   [1, 1, 0] // pawn
//   [2, 1, 0] // knight
//   [n, n, x] // queen
//   [1, 1, 0] // king
//   [2, 2, 0] // berserk king
//   [0, 0, n] // bishop
