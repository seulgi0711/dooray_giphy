import {Future} from './core';
import {noop, showf} from './internal/fn';
import {isFunction} from './internal/is';
import {throwInvalidArgument} from './internal/throw';

export function Attempt(fn){
  this._fn = fn;
}

Attempt.prototype = Object.create(Future.prototype);

Attempt.prototype._interpret = function Attempt$interpret(rec, rej, res){
  var r;
  try{ r = this._fn() }catch(e){ rej(e); return noop }
  res(r);
  return noop;
};

Attempt.prototype.toString = function Attempt$toString(){
  return 'Future.try(' + showf(this._fn) + ')';
};

export function attempt(f){
  if(!isFunction(f)) throwInvalidArgument('Future.try', 0, 'be a function', f);
  return new Attempt(f);
}
