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
import requester from './requester';
import {
    wrapWithArray,
    wrapWithObject
} from './fnUtil';

const searchGiphy = (keyword) => {
    return Future((rej, res) => {
        requester.Giphy.search(keyword).then(pipe(prop('data'), res)).catch(rej);
    })
}

const appendAddButton = append({
    "actions": [{
        "name": "send",
        "text": "보내기(미구현)",
        "type": "button",
        "value": "send"
    }]
})

const getOriginalUrl = pipe(
    prop('data'),
    head,
    path(['images', 'original', 'url'])
)

const makeResponseMessageForSlack = pipe(
    getOriginalUrl,
    wrapWithObject('image_url'),
    wrapWithArray,
    appendAddButton,
    wrapWithObject('attachments')
);

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

const slack = (body) => {
    return pipe(
        search,
        map(makeResponseMessageForSlack),
        map(merge(makeKeywordText(body)))
    )(body);
}

const dooray = (body) => {
    return pipe(
        search,
        map(makeResponseMessageForDooray),
        map(merge(makeKeywordText(body)))
    )(body);
}

export default {
    slack,
    dooray
};