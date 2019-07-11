import Future from "fluture";
import {
    __,
    always,
    append,
    chain,
    converge,
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
    prop
} from "ramda";
import { Either, Maybe } from "ramda-fantasy";
import { ACTION_TYPE, BUTTON_TYPE } from "./constant";
import requester from "./requester/requester";
import { def } from "./types/types";
import { logTap, mapIndexed } from "./utils/fnUtil";
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

// prettier-ignore
const searchGiphyByReqBody = def(
    'searchGiphyByReqBody :: ReqBody -> Future Object Object',
    pipe(
        converge(requester.Giphy.search, [extractSearchKeyword, pipe(extractMultiCount), extractOffset]),
        map(prop('data'))
    )
);

// prettier-ignore
const createImagesAttachments = def(
    'createImagesAttachments :: Number -> [Object] -> [Object]',
    (length, giphies) => {
        return mapIndexed((giphies, index) => {
            return pipe(
                converge(merge, [
                    ifElse(() => length > 1, createThumbImageAttachment, createOriginImageAttachment),
                    pipe(always(createSendAction(index)), of, objOf('actions'))
                ])
            )(giphies);
        })(giphies);
    }
);

const createControlActions = def(
    "createControlActions :: String -> Number -> Object",
    (direction, offset) => {
        return direction === BUTTON_TYPE.NEXT
            ? createNextActions(offset)
            : createPrevActions(offset);
    }
);

// prettier-ignore
const createNextControlActions = def(
    'createNextControlActions :: ReqBody -> Object',
    pipe(extractOffset, createControlActions(BUTTON_TYPE.NEXT))
);

// prettier-ignore
const createPrevControlActions = def(
    'createNextControlActions :: ReqBody -> Object',
    pipe(extractOffset, createControlActions(BUTTON_TYPE.PREV))
);

// prettier-ignore
const createControlActionsByDirection = def(
    'createControlActionsByDirection :: ReqBody -> Object',
    ifElse(
        pipe(getActionName, equals(BUTTON_TYPE.NEXT)),
        createNextControlActions,
        createPrevControlActions
    )
);

// prettier-ignore
const createAttachmentsBySearchResult = def(
    "createAttachmentsBySearchResult :: ReqBody -> [Object] -> Object",
    (reqBody, giphies) => {
        return pipe(
            createImagesAttachments(extractMultiCount(reqBody)),
            append(createControlActionsByDirection(reqBody)),
            objOf("attachments")
        )(giphies);
    }
);

export const createNoResultAttachment = def(
    "createNoResultAttachment :: Object -> Future Object Object",
    () => {
        return pipe(
            searchGiphyByReqBody,
            map(prop("data")),
            map(head),
            map(createOriginImageAttachment),
            // map(merge(__, { title: '검색 결과가 없습니다.' })),
            map(of),
            map(objOf("attachments"))
        )({ text: "what", command: "", responseUrl: "" });
    }
);

// prettier-ignore
export const createSearchAttachments = def(
    "createSearchAttachments :: ReqBody -> Future Object Object",
    (reqBody) => {
        return pipe(
            searchGiphyByReqBody,
            map(prop('data')),
            map(createAttachmentsBySearchResult(reqBody))
        )(reqBody)
    }
);

export const validateKeywordFromReq = def(
    "validateKeywordFromReq :: ReqBody -> Either ReqBody ReqBody",
    reqBody => {
        return pipe(
            extractSearchKeyword,
            validateKeyword,
            ifElse(
                Maybe.isNothing,
                () => Either.Left(reqBody),
                () => Either.Right(reqBody)
            )
        )(reqBody);
    }
);

export const createNoKeywordSearchAttachments = def(
    "createNoKeywordSearchAttachments :: ReqBody -> Future Object Object",
    reqBody => {
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
                            value:
                                "Click below button to open dialog."
                        }
                    ],
                    actions: [searchWithModalButton]
                })
            ),
            map(of),
            map(objOf("attachments"))
        )(reqBody);
    }
);

export const createNoKeywordResponse = def(
    "createNoKeywordResponse :: Object -> Future Object Object",
    reqBody => {
        return pipe(
            juxt([
                always(Future.of({ text: "Please enter keyword." })),
                createNoKeywordSearchAttachments
            ]),
            Future.parallel(Infinity),
            map(mergeAll)
        )({ text: "typing", command: "", responseUrl: "" });
    }
);

// prettier-ignore
export const searchImage = def(
    "searchImage :: ReqBody -> Future Object Object",
    pipe(
        juxt([pipe(createKeywordText, Future.of), createSearchAttachments]),
        Future.parallel(Infinity),
        map(mergeAll)
    )
);

// prettier-ignore
export const searchImageFromDialog = def(
    "searchImageFromDialog :: ReqBody -> Future Null Object",
    reqBody => {
        pipe(
            juxt([
                pipe(createKeywordText, Future.of, logTap('keyword')),
                pipe(extractChannelId, objOf("channelId"), Future.of, logTap('channelId')),
                pipe(createSearchAttachments, logTap('createSearchAttachments'))
            ]),
            Future.parallel(Infinity),
            map(mergeAll),
            chain(requester.Dooray.webHook(reqBody.responseUrl)),
            Future.value(always)
        )(reqBody);
        return Future.of({});
    }
);

export const createNoResultResponse = def(
    "createNoResultResponse :: Object -> Future Object Object",
    pipe(
        juxt([
            pipe(
                createNoResultKeywordText,
                Future.of
            ),
            createNoResultAttachment
        ]),
        Future.parallel(Infinity),
        map(mergeAll)
    )
);
