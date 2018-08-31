import { either, prop, propEq } from "ramda";
import { BUTTON_TYPE } from "../constant";
import { def } from "../types/types";

export const isSendButton = def(
    "isSendButton :: Object -> Boolean",
    propEq("actionName", BUTTON_TYPE.SEND)
);

export const isNextButton = def(
    "isNextButton :: Object -> Boolean",
    propEq("actionName", BUTTON_TYPE.NEXT)
);

export const isPrevButton = def(
    "isSearchButton :: Object -> Boolean",
    propEq("actionName", BUTTON_TYPE.PREV)
);

export const isSearchButton = def(
    'isSearchButton :: Object -> Boolean',
    either(isNextButton, isPrevButton)
);

export const getActionValue = def(
    'getActionValue :: ReqBody -> String',
    prop('actionValue')
);
