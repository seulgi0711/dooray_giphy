import { isEmpty, parseInt } from "lodash";
import { __, assoc, concat, dec, flip, gt, ifElse, inc, juxt, merge, objOf, pipe, reject, when } from "ramda";
import { ACTION_TYPE, BUTTON_TYPE } from "../constant";
import { def } from "../types/types";
import { isNextButton } from "./actionUtil";
import { logTap, wrapWithObject } from "./fnUtil";
import { getFixedSmallUrl, getOriginalUrl, getSearchKeyword } from "./requestUtil";

export const createPrevAction = def(
    "createPrevAction :: Number -> Object",
    assoc("value", __, {
        name: BUTTON_TYPE.PREV,
        text: "이전 이미지",
        type: ACTION_TYPE.BUTTON
    })
);

export const createNextAction = def(
    "createNextAction :: Number -> Object",
    assoc("value", __, {
        name: BUTTON_TYPE.NEXT,
        text: "다음 이미지",
        type: ACTION_TYPE.BUTTON
    })
);

// prettier-ignore
export const createNextActions = def(
    "createNextActions :: Number -> Object",
    pipe(
        logTap('offset'),
        juxt([when(gt(__, 0), pipe(dec, createPrevAction)), pipe(inc, createNextAction)]),
        reject(isEmpty),
        objOf("actions")
    )
);

// prettier-ignore
export const createPrevActions = def(
    "createPrevActions :: Number -> Object",
    pipe(
        juxt([when(gt(__, 0), pipe(dec, createPrevAction)), pipe(inc, createNextAction)]),
        reject(isEmpty),
        wrapWithObject("actions")
    )
);

export const createActions = def(
    "createActions :: ReqBody -> Object",
    ifElse(isNextButton, createNextActions, createPrevActions)
);

export const createInChannelResponse = def(
    "createInChannelResponse :: Object -> InChannelResponse",
    merge(__, { responseType: "inChannel" })
);

export const createReplaceResponse = def(
    "createReplaceResponse :: Object -> ReplaceResponse",
    merge(__, { deleteOriginal: true })
);

export const mergeActionAndImageAttachment = def(
    "mergeActionAndImageAttachment :: Object -> Object -> Object",
    (actionsAttachment, imageAttachment) => {
        return {
            attachments: [imageAttachment, actionsAttachment]
        };
    }
);

// prettier-ignore
export const createOriginImageAttachment = def(
    "createOriginImageAttachment :: Object -> Object",
    pipe(getOriginalUrl, objOf("imageUrl"))
);

// prettier-ignore
export const createThumbImageAttachment = def(
    "createOriginImageAttachment :: Object -> Object",
    pipe(getOriginalUrl, objOf("thumbUrl"))
);

export const createKeywordText = def(
    "createKeywordText :: Object -> Object",
    pipe(
        getSearchKeyword,
        concat("'"),
        flip(concat)("'에 대한 검색 결과"),
        objOf("text")
    )
);

export const createNoResultKeywordText = def(
    'createNoResultKeywordText :: Object -> Object',
    pipe(
        getSearchKeyword,
        concat("'"),
        flip(concat)("'에 대한 검색 결과가 없습니다."),
        objOf("text")
    )
)

export const createSendAction = def(
    'createSendAction :: Number -> Object',
    assoc("value", __, {
        name: BUTTON_TYPE.SEND,
        text: "대화방으로 보내기",
        type: ACTION_TYPE.BUTTON
    })
);
