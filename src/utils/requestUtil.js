import { isEmpty, parseInt } from "lodash";
import {
  always,
  curry,
  dec,
  either,
  head,
  ifElse,
  length,
  match,
  max,
  min,
  nth,
  path,
  pathOr,
  pipe,
  prop,
  propEq,
  propOr,
  split,
  trim
} from "ramda";
import Maybe from "sanctuary-maybe";
import { BUTTON_TYPE } from "../constant";

// "getImageUrl :: String -> Object -> String",
export const getImageUrl = curry((imageType, giphy) => {
  return giphy.images[imageType].url;
});

// "getOriginalUrl :: Object -> String",
export const getOriginalUrl = getImageUrl("original");

// "getOriginalUrl :: Object -> String",
export const getFixedSmallUrl = getImageUrl("fixed_height_small");

// "isDialogSubmission :: ReqBody -> Boolean",
export const isDialogSubmission = propEq("type", "dialog_submission");

// "extractFromOriginalText :: ReqBody -> String",
const extractFromOriginalText = pipe(
  pathOr("", ["originalMessage", "text"]),
  match(/'(.*)'/),
  ifElse(isEmpty, always(""), nth(1))
);

// "extractSearchKeyword :: ReqBody -> String",
export const extractSearchKeyword = pipe(
  ifElse(
    isDialogSubmission,
    path(["submission", "keyword"]),
    ifElse(
      pipe(
        prop("text"),
        isEmpty
      ),
      extractFromOriginalText,
      prop("text")
    )
  ),
  trim,
  split("--"),
  head,
  split(" "),
  head
);

// "getOriginalAttachmentsCount :: ReqBody -> Number",
export const getOriginalAttachmentsCount = pipe(
  pathOr([{}], ["originalMessage", "attachments"]),
  length
);

// "getMultiCountFromOriginalAttachments :: ReqBody -> Number",
export const getMultiCountFromOriginalAttachments = pipe(
  getOriginalAttachmentsCount,
  dec
);

// "extractMultiCount :: ReqBody -> Number",
export const extractMultiCount = reqBody => {
  return pipe(
    ifElse(
      isDialogSubmission,
      path(["submission", "count"]),
      pipe(
        propOr("", "text"),
        match(/--multi=(\d*)/),
        nth(1)
      )
    ),
    ifElse(
      isEmpty,
      () => getMultiCountFromOriginalAttachments(reqBody),
      number => parseInt(number)
    ),
    min(5),
    max(1)
  )(reqBody);
};

// "extractOffset :: ReqBody -> Number",
export const extractOffset = pipe(
  propOr("0", "actionValue"),
  parseInt
);

//  "getActionName :: ReqBody -> String",
export const getActionName = propOr(BUTTON_TYPE.NEXT, "actionName");

// "validateKeyword :: String -> Maybe String",
export const validateKeyword = keyword => {
  return isEmpty(keyword) ? Maybe.Nothing() : Maybe.Just(keyword);
};

// "extractChannelId :: ReqBody -> String",
export const extractChannelId = either(
  prop("channelId"),
  path(["channel", "id"])
);

// "extractUserId :: ReqBody -> String",
export const extractUserId = either(prop("userId"), path(["user", "id"]));

//  "extractTenantId :: ReqBody -> String",
export const extractTenantId = either(prop("tenantId"), path(["tenant", "id"]));

//  "extractKeyword :: ReqBody -> String",
export const extractKeyword = prop("text");

// "extractTriggerId :: ReqBody -> String",
export const extractTriggerId = prop("triggerId");

// "extractCommandToken :: ReqBody -> String",
export const extractCommandToken = prop("cmdToken");
