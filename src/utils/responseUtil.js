import Future from "fluture";
import { isEmpty, parseInt } from "lodash";
import { __, always, assoc, concat, dec, flip, gt, ifElse, inc, juxt, merge, pipe, prop, reject, when } from "ramda";
import { ACTION_TYPE, BUTTON_TYPE } from "../constant";
import { def } from "../types/types";
import { isNextButton } from './actionUtil';
import { wrapWithObject } from "./fnUtil";
import { getOriginalUrl } from "./requestUtil";

export const createInChannelResponse = def(
    "createInChannelResponse :: Object -> InChannelResponse",
    merge(__, { responseType: "inChannel" })
);

export const createReplaceResponse = def(
    "createReplaceResponse :: Object -> ReplaceResponse",
    merge(__, { deleteOriginal: true })
);

export const convertSearchIntoAttachments = def(
    "convertSearchIntoAttachments :: Object -> Object -> Object",
    (actionsAttachment, imageAttachment) => {
        return {
            attachments: [imageAttachment, actionsAttachment]
        };
    }
);

export const createImageAttachment = def(
    "createImageAttachment :: Object -> Object",
    pipe(
        getOriginalUrl,
        wrapWithObject("imageUrl")
    )
);

export const createKeywordText = def(
    "createKeywordText :: Object -> Future Object Object",
    pipe(
        prop("text"),
        concat("'"),
        flip(concat)("'에 대한 검색 결과"),
        wrapWithObject("text"),
        Future.of
    )
);

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
            pipe(dec, createPrevAction),
            pipe(always(undefined), createSendAction),
            pipe(inc, createNextAction)
        ]),
        wrapWithObject('actions')
    )
);

export const createPrevActions = def(
    "createPrevActions :: Object -> Object",
    pipe(
        prop("actionValue"),
        parseInt,
        juxt([
            when(gt(__, 0), pipe(dec, createPrevAction)),
            pipe(always(undefined), createSendAction),
            pipe(inc, createNextAction)
        ]),
        reject(isEmpty),
        wrapWithObject('actions')
    )
);

export const createActions = def(
    'createActions :: Object -> Object',
    ifElse(
        isNextButton,
        createNextActions,
        createPrevActions
    )
);
