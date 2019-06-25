import Future from "fluture";
import {
  always,
  append,
  chain,
  converge,
  curry,
  equals,
  head,
  ifElse,
  juxt,
  map,
  merge,
  mergeAll,
  objOf,
  of,
  pipe,
  prop,
  __
} from "ramda";
import Either from "sanctuary-either";
import Maybe from "sanctuary-maybe";
import { ACTION_TYPE, BUTTON_TYPE } from "./constant";
import requester from "./requester/requester";
import { mapIndexed, isNothing, logTap } from "./utils/fnUtil";
import {
  extractChannelId,
  extractMultiCount,
  extractOffset,
  extractSearchKeyword,
  getActionName,
  validateKeyword
} from "./utils/requestUtil";
import {
  createKeywordText,
  createNextActions,
  createNoResultKeywordText,
  createOriginImageAttachment,
  createPrevActions,
  createSendAction,
  createThumbImageAttachment
} from "./utils/responseUtil";

const searchWithModalButton = {
  name: BUTTON_TYPE.SEARCH_MODAL,
  text: "Open search dialog.",
  type: ACTION_TYPE.BUTTON,
  value: "search_modal"
};

// "searchGiphyByReqBody :: ReqBody -> Future Object Object",
const searchGiphyByReqBody = pipe(
  converge(requester.Giphy.search, [
    extractSearchKeyword,
    pipe(extractMultiCount),
    extractOffset
  ]),
  map(prop("data"))
);

// "createImagesAttachments :: Number -> [Object] -> [Object]",
const createImagesAttachments = curry((length, giphies) => {
  return mapIndexed((giphies, index) => {
    return pipe(
      converge(merge, [
        ifElse(
          () => length > 1,
          createThumbImageAttachment,
          createOriginImageAttachment
        ),
        pipe(
          always(createSendAction(index)),
          of,
          objOf("actions")
        )
      ])
    )(giphies);
  })(giphies);
});

// "createControlActions :: String -> Number -> Object",
const createControlActions = curry((direction, offset) => {
  return direction === BUTTON_TYPE.NEXT
    ? createNextActions(offset)
    : createPrevActions(offset);
});

// "createNextControlActions :: ReqBody -> Object",
const createNextControlActions = pipe(
  extractOffset,
  createControlActions(BUTTON_TYPE.NEXT)
);

// "createNextControlActions :: ReqBody -> Object",
const createPrevControlActions = pipe(
  extractOffset,
  createControlActions(BUTTON_TYPE.PREV)
);

// "createControlActionsByDirection :: ReqBody -> Object",
const createControlActionsByDirection = ifElse(
  pipe(
    getActionName,
    equals(BUTTON_TYPE.NEXT)
  ),
  createNextControlActions,
  createPrevControlActions
);

// "createAttachmentsBySearchResult :: ReqBody -> [Object] -> Object",
const createAttachmentsBySearchResult = curry((reqBody, giphies) => {
  return pipe(
    createImagesAttachments(extractMultiCount(reqBody)),
    append(createControlActionsByDirection(reqBody)),
    objOf("attachments")
  )(giphies);
});

// "createNoResultAttachment :: Object -> Future Object Object",
export const createNoResultAttachment = () => {
  return pipe(
    searchGiphyByReqBody,
    map(prop("data")),
    map(head),
    map(createOriginImageAttachment),
    // map(merge(__, { title: '검색 결과가 없습니다.' })),
    map(of),
    map(objOf("attachments"))
  )({ text: "what", command: "", responseUrl: "" });
};

// "createSearchAttachments :: ReqBody -> Future Object Object",
export const createSearchAttachments = reqBody => {
  return pipe(
    searchGiphyByReqBody,
    map(prop("data")),
    map(createAttachmentsBySearchResult(reqBody))
  )(reqBody);
};

// "validateKeywordFromReq :: ReqBody -> Either ReqBody ReqBody",
export const validateKeywordFromReq = reqBody => {
  return pipe(
    extractSearchKeyword,
    validateKeyword,
    ifElse(isNothing, () => Either.Left(reqBody), () => Either.Right(reqBody))
  )(reqBody);
};

//  "createNoKeywordSearchAttachments :: ReqBody -> Future Object Object",
export const createNoKeywordSearchAttachments = reqBody => {
  return pipe(
    searchGiphyByReqBody,
    map(prop("data")),
    map(head),
    map(createOriginImageAttachment),
    map(
      merge(__, {
        title: "The image below is the result of typing '/giphy typing'.",
        fields: [
          {
            title: "/giphy keyword",
            value: "Search for images that match your keywords."
          },
          {
            title: "/giphy keyword --multi=n",
            value:
              "Search for images that match your keywords and show n images. (1 <= n <=5 )."
          },
          {
            title: "Search images with dialog",
            value: "Click below button to open dialog."
          }
        ],
        actions: [searchWithModalButton]
      })
    ),
    map(of),
    map(objOf("attachments"))
  )(reqBody);
};

// "createNoKeywordResponse :: Object -> Future Object Object",
export const createNoKeywordResponse = reqBody => {
  return pipe(
    juxt([
      always(Future.of({ text: "Please enter keyword." })),
      createNoKeywordSearchAttachments
    ]),
    Future.parallel(Infinity),
    map(mergeAll)
  )({ text: "typing", command: "", responseUrl: "" });
};

//  "searchImage :: ReqBody -> Future Object Object",
export const searchImage = pipe(
  juxt([
    pipe(
      createKeywordText,
      Future.of
    ),
    createSearchAttachments
  ]),
  Future.parallel(Infinity),
  map(mergeAll)
);

// "searchImageFromDialog :: ReqBody -> Future Null Object",
export const searchImageFromDialog = reqBody => {
  pipe(
    juxt([
      pipe(
        createKeywordText,
        Future.of
      ),
      pipe(
        extractChannelId,
        objOf("channelId"),
        Future.of
      ),
      createSearchAttachments
    ]),
    Future.parallel(Infinity),
    map(mergeAll),
    chain(requester.Dooray.webHook(reqBody.responseUrl)),
    Future.value(always)
  )(reqBody);
  return Future.of({});
};

// "createNoResultResponse :: Object -> Future Object Object",
export const createNoResultResponse = pipe(
  juxt([
    pipe(
      createNoResultKeywordText,
      Future.of
    ),
    createNoResultAttachment
  ]),
  Future.parallel(Infinity),
  map(mergeAll)
);
