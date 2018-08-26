import Future from "fluture";
import { parseInt } from "lodash";
import { cond, converge, evolve, juxt, map, mergeAll, pick, pipe, prop, propOr, T, take } from "ramda";
import requester from "../requester/requester";
import { def } from "../types/types";
import { isSearchButton, isSendButton } from "../utils/actionUtil";
import {
    convertSearchIntoAttachments,
    createActions,
    createImageAttachment,
    createInChannelResponse,
    createKeywordText,
    createReplaceResponse
} from "../utils/responseUtil";

export const createSendResult = def(
    "createSendResult :: Object -> Future Object Object",
    pipe(
        prop("originalMessage"),
        pick(["text", "attachments"]),
        evolve({ attachments: take(1) }),
        createInChannelResponse,
        createReplaceResponse,
        Future.of
    )
);

export const extractKeyword = def(
    "extractKeyword :: Object -> String",
    propOr("", "text")
);

export const extractOffset = def(
    "extractOffset :: Object -> Number",
    pipe(
        propOr("0", "actionValue"),
        parseInt
    )
);

export const search = def(
    "search :: Object -> Future Object Object",
    pipe(
        converge(requester.Giphy.searchWithOffset, [extractKeyword, extractOffset]),
        map(createImageAttachment)
    )
);

export const mergeSearchAttachments = def(
    "mergeSearchAttachments :: Future Object Object -> Object -> Future Object Object",
    (searchResult, actionsAttachments) => {
        return searchResult.map(convertSearchIntoAttachments(actionsAttachments));
    }
);

export const createSearchAttachments = def(
    "createSearchAttachments :: Object -> Future Object Object",
    converge(mergeSearchAttachments, [search, createActions])
);

export const createSearchResult = def(
    "createSearchResult :: Object -> Future Object Object",
    pipe(
        juxt([createKeywordText, createSearchAttachments]),
        Future.parallel(Infinity),
        map(mergeAll)
    )
);

// prettier-ignore
const reqHandler = def(
    "reqHandler :: Object -> Future Object Object",
    pipe(
        prop("body"),
        cond([
            [isSendButton, createSendResult],
            [isSearchButton, createSearchResult],
            [T, Future.of({ text: 'nono' })]
        ]),
    )
);

export default reqHandler;
