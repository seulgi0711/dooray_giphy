import Future from "fluture";
import HMD from "hm-def";
import { allPass, anyPass, compose, curry, equals, has, path, propEq, values } from "ramda";
import $ from "sanctuary-def";
import $type from "sanctuary-type-identifiers";
import { BUTTON_TYPE, RESPONSE_TYPE } from "../constant";

const checkTypeId = curry((expectedType, obj) => {
    const eq = fn =>
        compose(
            equals(expectedType),
            fn
        );
    return anyPass([eq(path(["constructor", "prototype", "@@type"])), eq($type)])(
        obj
    );
});

const $Future = $.BinaryType(
    $type.parse(Future["@@type"]).name,
    "https://github.com/fluture-js/Fluture#readme",
    Future.isFuture,
    Future.extractLeft,
    Future.extractRight
);

const ActionType = $.EnumType("DoorayGiphy", "", ["button"]);

const ButtonType = $.EnumType(
    "DoorayGiphy/ButtonType",
    "",
    values(BUTTON_TYPE)
);

const Button = $.NullaryType("Button", "", propEq("type", "button"));

const InChannelResponse = $.NullaryType(
    "DoorayGiphy/InChannelResponse",
    "",
    propEq("responseType", RESPONSE_TYPE.IN_CHANNEL)
);

const ReplaceResponse = $.NullaryType(
    "DoorayGiphy/ReplaceResponse",
    "",
    propEq("deleteOriginal", true)
);

const ReqBody = $.NullaryType(
    "DoorayGiphy/ReqBody",
    "",
    allPass([has('responseUrl'), has('command'), has('text')])
);

const maybeTypeId = 'ramda-fantasy/Maybe';
const eitherTypeId = 'ramda-fantasy/Either';

const $Either = $.BinaryType(
    eitherTypeId,
    'https://github.com/ramda/ramda-fantasy/blob/master/docs/Either.md',
    checkTypeId(eitherTypeId),
    either => (either.isLeft ? [either.value] : []),
    either => (either.isRight ? [either.value] : [])
);

const $Maybe = $.UnaryType(
    maybeTypeId,
    'https://github.com/ramda/ramda-fantasy/blob/master/docs/Maybe.md',
    checkTypeId(maybeTypeId),
    maybe => (maybe.isJust ? [maybe.value] : [])
);

export const def = HMD.create({
    checkTypes: true,
    env: $.env.concat([
        $Either($.Unknown, $.Unknown),
        $Future($.Unknown, $.Unknown),
        $Maybe($.Unknown),
        Button,
        ButtonType,
        InChannelResponse,
        ReplaceResponse,
        ReqBody
    ])
});
