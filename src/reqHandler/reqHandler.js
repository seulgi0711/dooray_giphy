import Future from "fluture";
import { parseInt } from "lodash";
import {
  always,
  cond,
  curry,
  converge,
  dissoc,
  evolve,
  head,
  identity,
  juxt,
  map,
  merge,
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
import {
  getActionValue,
  isSearchButton,
  isSearchModalButton,
  isSendButton
} from "../utils/actionUtil";
import { rename } from "../utils/fnUtil";
import {
  extractChannelId,
  extractCommandToken,
  extractOffset,
  extractTriggerId,
  extractUserId,
  extractSearchKeyword,
  isDialogSubmission
} from "../utils/requestUtil";
import {
  createInChannelResponse,
  createOriginImageAttachment,
  createReplaceResponse,
  createSearchModal,
  createSearchResultText
} from "../utils/responseUtil";

// "removeActions :: Object -> Object",
export const removeActions = dissoc("actions");

// "convertThumbToImageUrl :: Object -> Object",
export const convertThumbToImageUrl = rename({ thumbUrl: "imageUrl" });

// "pickAttachmentForSend :: Number -> [Object] -> [Object]",
export const pickAttachmentForSend = curry((targetImageIndex, attachments) => {
  return pipe(
    slice(targetImageIndex, targetImageIndex + 1),
    converge(update(0), [
      pipe(
        head,
        removeActions,
        convertThumbToImageUrl
      ),
      identity
    ])
  )(attachments);
});

// "createSendResult :: ReqBody -> Future Object Object",
export const createSendResult = reqBody => {
  return pipe(
    prop("originalMessage"),
    pick(["attachments"]),
    evolve({
      attachments: pickAttachmentForSend(parseInt(getActionValue(reqBody)))
    }),
    merge(createSearchResultText(reqBody)),
    createInChannelResponse,
    createReplaceResponse,
    Future.of
  )(reqBody);
};

// "callDialogOpenApi :: ReqBody -> Function",
const callDialogOpenApi = pipe(
  juxt([
    pipe(
      extractChannelId,
      objOf("channelId")
    ),
    pipe(
      extractCommandToken,
      objOf("token")
    ),
    pipe(
      extractTriggerId,
      objOf("triggerId")
    ),
    pipe(
      extractUserId,
      createSearchModal,
      objOf("dialog")
    )
  ]),
  mergeAll,
  requester.Dooray.openModal,
  Future.fork(console.error, always)
);

// "createSearchModalResult :: ReqBody -> Future Object Object",
export const createSearchModalResult = pipe(
  tap(callDialogOpenApi),
  path(["originalMessage", "text"]),
  objOf("text"),
  Future.of
);

// "search :: Object -> Future Object Object",
export const search = pipe(
  converge(requester.Giphy.searchWithOffset, [
    extractSearchKeyword,
    extractOffset
  ]),
  map(createOriginImageAttachment)
);

// "reqHandler :: Object -> Future Object Object",
const reqHandler = pipe(
  prop("body"),
  cond([
    [isSendButton, createSendResult],
    [isSearchButton, searchImage],
    [isSearchModalButton, createSearchModalResult],
    [isDialogSubmission, searchImageFromDialog],
    [T, Future.of({ text: "nono" })]
  ])
);

export default reqHandler;
