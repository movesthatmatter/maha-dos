import { BlackColor, WhiteColor } from '.';
import { Color } from './types';

// I don't know why this needs to be typed like this
//  with a function declaration but if it's declared
//  as an anonymous function it throws a tsc error
export function toOppositeColor<C extends Color>(
  c: C
): C extends WhiteColor ? BlackColor : WhiteColor;
export function toOppositeColor<C extends Color>(c: C) {
  return c === 'white' ? 'black' : 'white';
}
