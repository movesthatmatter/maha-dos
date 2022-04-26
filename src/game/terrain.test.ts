import { createTerrain } from './terrain';

test('renders matrix of 2', () => {
  const actual = createTerrain({ width: 2 });
  const expected = [
    ['w', 'b'],
    ['b', 'w']
  ];

  expect(actual).toEqual(expected);
});

test('renders matrix of 8', () => {
  const actual = createTerrain({ width: 8 });
  const expected = [
    ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
    ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
    ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
    ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
    ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
    ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
    ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
    ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w']
  ];

  expect(actual).toEqual(expected);
});
