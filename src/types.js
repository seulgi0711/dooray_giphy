import {
    path
} from 'ramda';
import $ from 'sanctuary-def';
import $type from 'sanctuary-type-identifiers';
import HMD from 'hm-def';
import Future from 'fluture';
import {
    curry,
    compose,
    propEq,
    equals,
    anyPass
} from 'ramda';

const checkTypeId = curry((expectedType, obj) => {
    const eq = fn => compose(equals(expectedType), fn);
    return anyPass([
        eq(path(['constructor', 'prototype', '@@type'])),
        eq($type),
    ])(obj);
});

const $Future = $.BinaryType(
    $type.parse(Future['@@type']).name,
    'https://github.com/fluture-js/Fluture#readme',
    Future.isFuture,
    Future.extractLeft,
    Future.extractRight
);

const ActionType = $.EnumType(
    'dg',
    '',
    (['button'])
)

const Button = $.NullaryType('Button', '', propEq('type', 'button'));

export const def = HMD.create({
    checkTypes: true,
    env: $.env.concat([
        $Future($.Unknown, $.Unknown),
        Button
    ])
});
