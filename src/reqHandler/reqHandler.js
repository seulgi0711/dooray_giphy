import Future from "fluture";
import { parseInt } from "lodash";
import { cond, converge, evolve, juxt, map, mergeAll, pick, pipe, prop, propOr, T, take } from "ramda";
import requester from "../requester/requester";
import { def } from "../types/types";
import { isSearchButton, isSendButton } from "../utils/actionUtil";
import { extractOffset, getSearchKeyword } from "../utils/requestUtil";
import {
    createActions,
    createOriginImageAttachment,
    createInChannelResponse,
    createKeywordText,
    createReplaceResponse,
    mergeActionAndImageAttachment
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

export const search = def(
    "search :: Object -> Future Object Object",
    pipe(
        converge(requester.Giphy.searchWithOffset, [getSearchKeyword, extractOffset]),
        map(createOriginImageAttachment)
    )
);

export const mergeSearchAttachments = def(
    "mergeSearchAttachments :: Future Object Object -> Object -> Future Object Object",
    (searchResult, actionsAttachments) => {
        return searchResult.map(mergeActionAndImageAttachment(actionsAttachments));
    }
);

export const createSearchAttachments = def(
    "createSearchAttachments :: Object -> Future Object Object",
    converge(mergeSearchAttachments, [search, createActions])
);

// prettier-ignore
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
