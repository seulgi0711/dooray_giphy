import { isEmpty, parseInt } from "lodash";
import {
    __,
    always,
    assoc,
    concat,
    converge,
    dec,
    equals,
    flip,
    gt,
    head,
    ifElse,
    inc,
    juxt,
    length,
    map,
    merge,
    objOf,
    of,
    pipe,
    prop,
    reject,
    when
} from "ramda";
import { ACTION_TYPE, BUTTON_TYPE } from "../constant";
import { def } from "../types/types";
import { isNextButton } from "./actionUtil";
import { logTap, wrapWithObject } from "./fnUtil";
import { getFixedHeightSmallUrl, getOriginalUrl, getSearchKeyword } from "./requestUtil";

export const createPrevAction = def(
    "createPrevAction :: Number -> Object",
    assoc("value", __, {
        name: BUTTON_TYPE.PREV,
        text: "이전 이미지",
        type: ACTION_TYPE.BUTTON
    })
);

export const createSendAction = def(
    "createSendAction :: Undefined -> Object",
    always({
        name: BUTTON_TYPE.SEND,
        text: "대화방으로 보내기",
        type: ACTION_TYPE.BUTTON,
        value: BUTTON_TYPE.SEND
    })
);

export const createSendActionWithValue = def(
    "createSendActionWithValue :: String -> Object",
    assoc("value", __, {
        name: BUTTON_TYPE.SEND,
        text: "대화방으로 보내기",
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

export const createNextActions = def(
    "createNextActions :: Object -> Object",
    pipe(
        prop("actionValue"),
        parseInt,
        juxt([
            pipe(
                dec,
                createPrevAction
            ),
            pipe(
                always(undefined),
                createSendAction
            ),
            pipe(
                inc,
                createNextAction
            )
        ]),
        objOf("actions")
    )
);

export const createPrevActions = def(
    "createPrevActions :: Object -> Object",
    pipe(
        prop("actionValue"),
        parseInt,
        juxt([
            when(
                gt(__, 0),
                pipe(
                    dec,
                    createPrevAction
                )
            ),
            pipe(
                always(undefined),
                createSendAction
            ),
            pipe(
                inc,
                createNextAction
            )
        ]),
        reject(isEmpty),
        wrapWithObject("actions")
    )
);

export const createActions = def(
    "createActions :: Object -> Object",
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

export const mergeActionAndImagesAttachments = def(
    "mergeActionAndImagesAttachments :: Object -> [Object] -> Object",
    (actionsAttachment, imagesAttachments) => {
        return {
            attachments: [...imagesAttachments, actionsAttachment]
        };
    }
);

// prettier-ignore
export const createOriginImageAttachment = def(
    "createOriginImageAttachment :: Object -> Object",
    pipe(logTap('start'), getOriginalUrl, logTap('getOriginUrl'), objOf("imageUrl"), logTap('test'))
);

// prettier-ignore
export const createMultiImageAttachments = def(
    "createMultiImageAttachments :: [Object] -> [Object]",
    map(pipe(
        getFixedHeightSmallUrl,
        converge(merge, [objOf("thumbUrl"), pipe(createSendActionWithValue, of, objOf("actions"))])
        )
    )
);

// prettier-ignore
export const createOriginImagesAttachment = def(
    'createOriginImagesAttachment :: [Object] -> Object',
    ifElse(
        pipe(length, equals(1)),
        pipe(head, createOriginImageAttachment),
        createMultiImageAttachments
    )
);

export const createKeywordText = def(
    "createKeywordText :: Object -> Object",
    pipe(
        getSearchKeyword,
        logTap("text"),
        concat("'"),
        flip(concat)("'에 대한 검색 결과"),
        objOf("text")
    )
);
