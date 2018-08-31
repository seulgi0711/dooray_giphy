import Future from "fluture";
import { parseInt } from "lodash";
import { cond, converge, dissoc, evolve, head, identity, map, pick, pipe, prop, slice, T, update } from "ramda";
import { searchOneImage } from "../giphySearcher";
import requester from "../requester/requester";
import { def } from "../types/types";
import { getActionValue, isSearchButton, isSendButton } from "../utils/actionUtil";
import { logTap, rename } from "../utils/fnUtil";
import { extractOffset, getSearchKeyword } from "../utils/requestUtil";
import { createInChannelResponse, createOriginImageAttachment, createReplaceResponse } from "../utils/responseUtil";

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
            logTap('attachments'),
            createInChannelResponse,
            createReplaceResponse,
            Future.of
        )(reqBody);
    }
);

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
            [isSearchButton, searchOneImage],
            [T, Future.of({ text: 'nono' })]
        ]),
    )
);

export default reqHandler;
