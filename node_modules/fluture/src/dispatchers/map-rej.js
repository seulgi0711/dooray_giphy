import {isFuture} from '../core';
import {partial1} from '../internal/fn';
import {isFunction} from '../internal/is';
import {throwInvalidArgument, throwInvalidFuture} from '../internal/throw';

function mapRej$mapper(mapper, m){
  if(!isFuture(m)) throwInvalidFuture('Future.mapRej', 1, m);
  return m.mapRej(mapper);
}

export function mapRej(mapper, m){
  if(!isFunction(mapper)) throwInvalidArgument('Future.mapRej', 0, 'be a Function', mapper);
  if(arguments.length === 1) return partial1(mapRej$mapper, mapper);
  return mapRej$mapper(mapper, m);
}
