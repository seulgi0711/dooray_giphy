import {isFuture} from '../core';
import {partial1} from '../internal/fn';
import {throwInvalidFuture} from '../internal/throw';

function and$left(left, right){
  if(!isFuture(right)) throwInvalidFuture('Future.and', 1, right);
  return left.and(right);
}

export function and(left, right){
  if(!isFuture(left)) throwInvalidFuture('Future.and', 0, left);
  if(arguments.length === 1) return partial1(and$left, left);
  return and$left(left, right);
}
