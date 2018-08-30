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
    allPass([has('channelId'), has('responseUrl'), has('command'), has('text')])
);

export const def = HMD.create({
    checkTypes: true,
    env: $.env.concat([
        $Future($.Unknown, $.Unknown),
        Button,
        ButtonType,
        InChannelResponse,
        ReplaceResponse,
        ReqBody
    ])
});
