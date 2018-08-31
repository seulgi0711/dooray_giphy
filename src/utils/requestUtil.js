import { isEmpty, parseInt } from "lodash";
import { curry, head, ifElse, map, match, max, min, nth, pipe, prop, propOr, split, test, trim } from "ramda";
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
export const isMultiImage = def(
    'isMultiImage :: ReqBody -> Boolean',
    pipe(prop('text'), test(/--multi=/))
);

// prettier-ignore
export const getSearchKeyword = def(
    'getSearchKeyword :: ReqBody -> String',
    pipe(prop("text"), trim, split('--'), head, split(' '), head)
);

// prettier-ignore
export const extractMultiCount = def(
    'extractMultiCount :: ReqBody -> Number',
    pipe(
        prop('text'),
        match(/--multi=(\d*)/),
        ifElse(isEmpty, Maybe.Nothing, Maybe.Just),
        map(nth(1)),
        map(min(5)),
        map(max(1)),
        maybe(1, parseInt)
    )
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
)