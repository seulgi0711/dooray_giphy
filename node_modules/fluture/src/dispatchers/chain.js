import Z from 'sanctuary-type-classes';
import {partial1} from '../internal/fn';
import {isFunction} from '../internal/is';
import {throwInvalidArgument} from '../internal/throw';

function chain$chainer(chainer, m){
  if(!Z.Chain.test(m)) throwInvalidArgument('Future.chain', 1, 'be a Chain', m);
  return Z.chain(chainer, m);
}

export function chain(chainer, m){
  if(!isFunction(chainer)) throwInvalidArgument('Future.chain', 0, 'be a Function', chainer);
  if(arguments.length === 1) return partial1(chain$chainer, chainer);
  return chain$chainer(chainer, m);
}
