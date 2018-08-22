import Future from 'fluture';
import {
    concat,
    flip,
    append,
    head,
    map,
    merge,
    path,
    pipe,
    prop,
    tap
} from 'ramda';
import requester from '../requester';
import {
    wrapWithArray,
    wrapWithObject
} from '../utils/fnUtil';
import {def} from '../types';

export const searchGiphy = def(
    'searchGiphy :: String -> Future Object Object',
    (keyword) => {
        return Future((rej, res) => {
            requester.Giphy.search(keyword).then(pipe(prop('data'), res)).catch(rej);
        });
    }
)

// export const searchGiphy = (keyword) => {
//     return Future((rej, res) => {
//         requester.Giphy.search(keyword).then(pipe(prop('data'), res)).catch(rej);
//     });
// }

const appendAddButton = append({
    "actions": [{
        "name": "send",
        "text": "보내기(미구현)",
        "type": "button",
        "value": "send"
    }]
})

export const getOriginalUrl = (a) => {
    return pipe(
        prop('data'),
        head,
        path(['images', 'original', 'url'])
    )(a);
}

const makeResponseMessageForDooray = pipe(
    getOriginalUrl,
    wrapWithObject('imageUrl'),
    wrapWithArray,
    appendAddButton,
    wrapWithObject('attachments')
)

const makeKeywordText = pipe(
    prop('text'),
    concat('\''),
    flip(concat)('\'에 대한 검색 결과'),
    wrapWithObject('text')
)

// search :: Obj -> Future [Obj]
const search = pipe(
    prop('text'),
    searchGiphy
);

const dooray = (body) => {
    return pipe(
        search,
        map(makeResponseMessageForDooray),
        map(merge(makeKeywordText(body)))
    )(body);
}

export default {
    dooray
};