/* eslint no-param-reassign:0 */

export var nil = {head: null};
nil.tail = nil;

export function cons(head, tail){
  return {head: head, tail: tail};
}
