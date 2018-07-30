import {isFuture} from '../core';
import {partial1} from '../internal/fn';
import {throwInvalidFuture} from '../internal/throw';

function race$right(right, left){
  if(!isFuture(left)) throwInvalidFuture('Future.race', 1, left);
  return left.race(right);
}

export function race(right, left){
  if(!isFuture(right)) throwInvalidFuture('Future.race', 0, right);
  if(arguments.length === 1) return partial1(race$right, right);
  return race$right(right, left);
}
