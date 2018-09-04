import { isEmpty, isString, parseInt } from "lodash";
import {
    always,
    curry,
    dec,
    either,
    head,
    ifElse,
    length,
    match,
    max,
    min,
    nth,
    path,
    pathOr,
    pipe,
    prop,
    propEq,
    propOr,
    split,
    trim
} from "ramda";
import { Maybe } from 'ramda-fantasy';
import { BUTTON_TYPE } from '../constant';
import { def } from "../types/types";
import { logTap } from './fnUtil';

export const maybe = curry((v, f, m) => {
    if (m.isNothing) {
        return v;
    }

    return f(m.value);
})

// prettier-ignore
export const getImageUrl = def(
    'getImageUrl :: String -> Object -> String',
    (imageType, giphy) => giphy.images[imageType].url
);

// prettier-ignore
export const getOriginalUrl = def(
    "getOriginalUrl :: Object -> String",
    getImageUrl('original')
);

// prettier-ignore
export const getFixedSmallUrl = def(
    "getOriginalUrl :: Object -> String",
    getImageUrl('fixed_height_small')
);

// prettier-ignore
export const isDialogSubmission = def(
    'isDialogSubmission :: ReqBody -> Boolean',
    propEq('type', 'dialog_submission')
);

const extractFromOriginalText = def(
    'extractFromOriginalText :: ReqBody -> String',
    pipe(
        pathOr('', ['originalMessage', 'text']),
        match(/'(.*)'/),
        ifElse(isEmpty, always(''), nth(1)),
        logTap('match')
        // logTap('match'),
        // nth(1)
    )
)

// prettier-ignore
export const extractSearchKeyword = def(
    'extractSearchKeyword :: ReqBody -> String',
    pipe(
        ifElse(isDialogSubmission,
            path(['submission', 'Keyword']),
            either(prop("text"), extractFromOriginalText)
        ),
        trim,
        split('--'),
        head,
        split(' '),
        head
    )
);

// prettier-ignore
export const getOriginalAttachmentsCount = def(
    'getOriginalAttachmentsCount :: ReqBody -> Number',
    pipe(pathOr([{}], ['originalMessage', 'attachments']), length)
);

export const getMultiCountFromOriginalAttachments = def(
    'getMultiCountFromOriginalAttachments :: ReqBody -> Number',
    pipe(getOriginalAttachmentsCount, dec)
);

// prettier-ignore
export const extractMultiCount = def(
    'extractMultiCount :: ReqBody -> Number',
    (reqBody) => {
        return pipe(
            ifElse(isDialogSubmission,
                path(['submission', 'count']),
                pipe(propOr('', 'text'), match(/--multi=(\d*)/), nth(1))
            ),
            ifElse(isEmpty,
                () => getMultiCountFromOriginalAttachments(reqBody),
                (number) => parseInt(number)
            ),
            min(5),
            max(1)
        )(reqBody);
    }
);

// prettier-ignore
export const extractOffset = def(
    "extractOffset :: ReqBody -> Number",
    pipe(propOr("0", "actionValue"), parseInt)
);

export const getActionName = def(
    'getActionName :: ReqBody -> String',
    propOr(BUTTON_TYPE.NEXT, 'actionName')
);

export const validateKeyword = def(
    'validateKeyword :: String -> Maybe String',
    (keyword) => {
        return isEmpty(keyword) ? Maybe.Nothing() : Maybe.Just(keyword);
    }
);

// prettier-ignore
export const extractChannelId = def(
    'extractChannelId :: ReqBody -> String',
    either(prop('channelId'), path(['channel', 'id']))
);

// prettier-ignore
export const extractUserId = def(
    'extractUserId :: ReqBody -> String',
    either(prop('userId'), path(['user', 'id']))
);

// prettier-ignore
export const extractTenantId = def(
    'extractTenantId :: ReqBody -> String',
    either(prop('tenantId'), path(['tenant', 'id']))
);

// prettier-ignore
export const extractKeyword = def(
    'extractKeyword :: ReqBody -> String',
    prop('text')
)

// prettier-ignore
export const extractTriggerId = def(
    'extractTriggerId :: ReqBody -> String',
    prop('triggerId')
);

// prettier-ignore
export const extractCommandToken = def(
    'extractCommandToken :: ReqBody -> String',
    prop('cmdToken')
);
