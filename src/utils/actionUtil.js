import { either, prop, propEq } from "ramda";
import { BUTTON_TYPE } from "../constant";

// "isSendButton :: Object -> Boolean",
export const isSendButton = propEq("actionName", BUTTON_TYPE.SEND);

// "isNextButton :: Object -> Boolean",
export const isNextButton = propEq("actionName", BUTTON_TYPE.NEXT);

// "isSearchButton :: Object -> Boolean",
export const isPrevButton = propEq("actionName", BUTTON_TYPE.PREV);

// "isSearchButton :: Object -> Boolean",
export const isSearchButton = either(isNextButton, isPrevButton);

// "isSearchButton :: Object -> Boolean",
export const isSearchModalButton = propEq(
  "actionName",
  BUTTON_TYPE.SEARCH_MODAL
);

// "getActionValue :: ReqBody -> String",
export const getActionValue = prop("actionValue");
