import Z from 'sanctuary-type-classes';
import {partial1} from '../internal/fn';
import {throwInvalidArgument} from '../internal/throw';

function alt$left(left, right){
  if(!Z.Alt.test(right)) throwInvalidArgument('alt', 1, 'be an Alt', right);
  return Z.alt(left, right);
}

export function alt(left, right){
  if(!Z.Alt.test(left)) throwInvalidArgument('alt', 0, 'be an Alt', left);
  if(arguments.length === 1) return partial1(alt$left, left);
  return alt$left(left, right);
}
