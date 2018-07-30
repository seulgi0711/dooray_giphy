import {isFuture} from '../core';
import {throwInvalidFuture} from '../internal/throw';

export function promise(m){
  if(!isFuture(m)) throwInvalidFuture('Future.promise', 0, m);
  return m.promise();
}
