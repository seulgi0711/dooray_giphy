import Future from "fluture";
import { parseInt } from "lodash";
import {
    always,
    cond,
    converge,
    dissoc,
    evolve,
    head,
    identity,
    juxt,
    map,
    mergeAll,
    objOf,
    path,
    pick,
    pipe,
    prop,
    slice,
    T,
    tap,
    update
} from "ramda";
import { searchImage, searchImageFromDialog } from "../giphySearcher";
import requester from "../requester/requester";
import { def } from "../types/types";
import { getActionValue, isSearchButton, isSearchModalButton, isSendButton } from "../utils/actionUtil";
import { rename } from "../utils/fnUtil";
import {
    extractChannelId, extractCommandToken,
    extractOffset,
    extractTriggerId,
    extractUserId,
    getSearchKeyword, isDialogSubmission
} from "../utils/requestUtil";
import {
    createInChannelResponse,
    createOriginImageAttachment,
    createReplaceResponse,
    createSearchModal
} from "../utils/responseUtil";

export const removeActions = def(
    "removeActions :: Object -> Object",
    dissoc("actions")
);

export const convertThumbToImageUrl = def(
    "convertThumbToImageUrl :: Object -> Object",
    rename({ thumbUrl: "imageUrl" })
);

// prettier-ignore
export const pickAttachmentForSend = def(
    'pickAttachmentForSend :: Number -> [Object] -> [Object]',
    (targetImageIndex, attachments) => {
        return pipe(
            slice(targetImageIndex, targetImageIndex + 1),
            converge(update(0), [pipe(head, removeActions, convertThumbToImageUrl), identity])
        )(attachments);
    }
);

// prettier-ignore
export const createSendResult = def(
    "createSendResult :: ReqBody -> Future Object Object",
    (reqBody) => {
        return pipe(
            prop("originalMessage"),
            pick(["text", "attachments"]),
            evolve({ attachments: pickAttachmentForSend(parseInt(getActionValue(reqBody))) }),
            createInChannelResponse,
            createReplaceResponse,
            Future.of
        )(reqBody);
    }
);

// prettier-ignore
const callDialogOpenApi = def(
    'callDialogOpenApi :: ReqBody -> Function',
    pipe(
        juxt([
            pipe(extractChannelId, objOf('channelId')),
            pipe(extractCommandToken, objOf('token')),
            pipe(extractTriggerId, objOf('triggerId')),
            pipe(extractUserId, createSearchModal, objOf('dialog'))
        ]),
        mergeAll,
        requester.Dooray.openModal,
        Future.fork(console.error, always)
    )
);

// prettier-ignore
export const createSearchModalResult = def(
    'createSearchModalResult :: ReqBody -> Future Object Object',
    pipe(tap(callDialogOpenApi), path(['originalMessage', 'text']), objOf('text'), Future.of));

// prettier-ignore
export const search = def(
    "search :: Object -> Future Object Object",
    pipe(
        converge(requester.Giphy.searchWithOffset, [getSearchKeyword, extractOffset]),
        map(createOriginImageAttachment)
    )
);

// prettier-ignore
const reqHandler = def(
    "reqHandler :: Object -> Future Object Object",
    pipe(
        prop("body"),
        cond([
            [isSendButton, createSendResult],
            [isSearchButton, searchImage],
            [isSearchModalButton, createSearchModalResult],
            [isDialogSubmission, searchImageFromDialog],
            [T, Future.of({ text: 'nono' })]
        ]),
    )
);

export default reqHandler;
