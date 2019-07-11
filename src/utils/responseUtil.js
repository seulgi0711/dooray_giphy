import { isEmpty, parseInt } from "lodash";
import { __, assoc, concat, converge, dec, flip, gt, ifElse, inc, juxt, merge, objOf, pipe, reject, when } from "ramda";
import { ACTION_TYPE, BUTTON_TYPE } from "../constant";
import { def } from "../types/types";
import { isNextButton } from "./actionUtil";
import { logTap, wrapWithObject } from "./fnUtil";
import { extractSearchKeyword, extractTenantId, extractUserId, getOriginalUrl } from "./requestUtil";

export const createPrevAction = def(
    "createPrevAction :: Number -> Object",
    assoc("value", __, {
        name: BUTTON_TYPE.PREV,
        text: "Prev",
        type: ACTION_TYPE.BUTTON
    })
);

export const createNextAction = def(
    "createNextAction :: Number -> Object",
    assoc("value", __, {
        name: BUTTON_TYPE.NEXT,
        text: "Next",
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
    "createKeywordText :: ReqBody -> Object",
    pipe(
        extractSearchKeyword,
        concat('Search results for \''),
        concat(__, '\''),
        objOf("text")
    )
);

// prettier-ignore
export const createSenderMention = def(
    'createSenderMention :: ReqBody -> String',
    converge((tenantId, userId) => `(dooray://${tenantId}/members/${userId} "member")`, [extractTenantId, extractUserId])
)

export const createSearchResultText = def(
    "createSearchResultText :: ReqBody -> Object",
    reqBody => {
        return pipe(
            createSenderMention,
            concat(__, ' sent an image.'),
            objOf('text')
        )(reqBody);
    }
);

export const createNoResultKeywordText = def(
    "createNoResultKeywordText :: Object -> Object",
    pipe(
        extractSearchKeyword,
        concat('No results found for '),
        objOf("text")
    )
);

export const createSendAction = def(
    "createSendAction :: Number -> Object",
    assoc("value", __, {
        name: BUTTON_TYPE.SEND,
        text: "Send",
        type: ACTION_TYPE.BUTTON
    })
);

export const createSearchModal = def(
    "createSearchModal :: String -> Object",
    memberId => {
        return {
            callbackId: memberId,
            title: "Search Giphy",
            submitLabel: "Search",
            elements: [
                {
                    type: "input",
                    label: "Keyword",
                    name: "keyword",
                    value: "",
                    placeholder: "Please enter keyword."
                },
                {
                    type: "select",
                    label: "Number of images to show",
                    name: "count",
                    value: 1,
                    options: [
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" },
                        { value: "5", label: "5" }
                    ]
                }
            ]
        };
    }
);
