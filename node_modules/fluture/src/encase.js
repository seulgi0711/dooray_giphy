import {Future} from './core';
import {noop, show, showf, partial1} from './internal/fn';
import {isFunction} from './internal/is';
import {throwInvalidArgument} from './internal/throw';

export function Encase(fn, a){
  this._fn = fn;
  this._a = a;
}

Encase.prototype = Object.create(Future.prototype);

Encase.prototype._interpret = function Encase$interpret(rec, rej, res){
  var r;
  try{ r = this._fn(this._a) }catch(e){ rej(e); return noop }
  res(r);
  return noop;
};

Encase.prototype.toString = function Encase$toString(){
  return 'Future.encase(' + showf(this._fn) + ', ' + show(this._a) + ')';
};

export function encase(f, x){
  if(!isFunction(f)) throwInvalidArgument('Future.encase', 0, 'be a function', f);
  if(arguments.length === 1) return partial1(encase, f);
  return new Encase(f, x);
}
