import Future from 'fluture';
import {
    always,
    append,
    cond,
    converge,
    equals,
    ifElse,
    juxt,
    map,
    merge,
    mergeAll,
    objOf,
    of,
    pipe,
    prop,
    T
} from "ramda";
import requester from "../requester/requester";
import { def } from "../types/types";
import { liftA2, logTap } from "../utils/fnUtil";
import { extractMultiCount, extractOffset, getOriginalUrl, getSearchKeyword, isMultiImage } from "../utils/requestUtil";
import {
    createKeywordText,
    createMultiImageAttachments,
    createNextAction,
    createOriginImageAttachment,
    createOriginImagesAttachment,
    createSendActionWithValue,
    mergeActionAndImageAttachment,
    mergeActionAndImagesAttachments
} from "../utils/responseUtil";

const actionsAttachmentForOne = def(
    'actionsAttachmentForOne :: Object -> Object',
    pipe(
        getOriginalUrl,
        createSendActionWithValue,
        of,
        append(createNextAction(1)),
        objOf('actions')
    )
);

const actionsAttachmentForMulti = {
    actions: [createNextAction(1)]
};

// prettier-ignore
const search = def(
    'search :: Object -> Future Object Object',
    pipe(
        getSearchKeyword,
        requester.Giphy.search,
        map(converge(mergeActionAndImageAttachment, [actionsAttachmentForOne, createOriginImageAttachment]))
    )
);

// prettier-ignore
const searchMulti = def(
    "searchMulti :: Object -> Future Object Object",
    pipe(
        converge(requester.Giphy.searchMulti, [getSearchKeyword, extractMultiCount]),
        map(converge(mergeActionAndImagesAttachments, [always(actionsAttachmentForMulti), createMultiImageAttachments])),
        map(logTap('searchMulti output'))
    )
);

const createActionsAttachment = def(
    'createActionsAttachment :: ReqBody -> '
)

const createSearchAttachments = def(
    'createSearchAttachments :: ReqBody -> Future Object Object',
    pipe(
        converge(requester.Giphy.search, [getSearchKeyword, extractMultiCount, extractOffset]),
        map(converge(merge, [createOriginImagesAttachment, createActionsAttachment])),
        map(of),
        map(objOf('attachments')),
        map(logTap('createOriginImagesAttachment'))
    ));

const searchOneImage = def(
    "searchOneImage :: Object -> Future Object Object",
    pipe(
        juxt([pipe(createKeywordText, Future.of), createSearchAttachments]),
        Future.parallel(Infinity),
        map(mergeAll)
    )
);

const searchMultiImages = def(
    "searchMultiImages :: Object -> Future Object Object",
    ifElse(
        pipe(extractMultiCount, equals(1)),
        searchOneImage,
        converge(liftA2(merge), [pipe(createKeywordText, Future.of), searchMulti])
    )
);

// prettier-ignore
const commandHandler = def(
    "commandHandler :: Object -> Future Object Object",
    pipe(
        prop("body"),
        cond([
            [isMultiImage, searchMultiImages],
            [T, searchOneImage]
        ])
    )
);

export default commandHandler;
