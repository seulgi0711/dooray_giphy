import Future from "fluture";
import { always, append, converge, equals, ifElse, juxt, length, map, merge, mergeAll, objOf, of, pipe } from 'ramda';
import { BUTTON_TYPE } from './constant';
import requester from './requester/requester';
import { def } from './types/types';
import { logTap, mapIndexed } from './utils/fnUtil';
import { extractMultiCount, extractOffset, getActionName, getSearchKeyword } from './utils/requestUtil';
import {
    createKeywordText,
    createNextActions,
    createOriginImageAttachment,
    createPrevActions,
    createSendAction, createThumbImageAttachment
} from './utils/responseUtil';

// prettier-ignore
const searchGiphyByReqBody = def(
    'searchGiphyByReqBody :: ReqBody -> Future Object Object',
    converge(requester.Giphy.search, [getSearchKeyword, extractMultiCount, extractOffset])
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

// prettier-ignore
export const createSearchAttachments = def(
    "createSearchAttachments :: ReqBody -> Future Object Object",
    (reqBody) => {
        return pipe(
            searchGiphyByReqBody,
            map(createAttachmentsBySearchResult(reqBody))
        )(reqBody)
    }
);

export const searchOneImage = def(
    "searchOneImage :: ReqBody -> Future Object Object",
    pipe(
        juxt([pipe(createKeywordText, Future.of), createSearchAttachments]),
        Future.parallel(Infinity),
        map(mergeAll)
    )
);

export const searchMultiImages = def(
    'searchMultiImages :: ReqBody -> Future Object Object',
    pipe(
        juxt([pipe(createKeywordText, Future.of), createSearchAttachments]),
        Future.parallel(Infinity),
        map(mergeAll)
    )
);
