import Future from 'fluture';
import {
    append,
    head,
    map,
    merge,
    tap,
    path,
    pipe,
    prop
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

const appendAddButton = (attachments) => {
    return append({
            "actions": [{
                "name": "send",
                "text": "보내기(미구현)",
                "type": "button",
                "value": "send"
            }]
        },
        attachments
    )
}

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
    wrapWithObject('attachments'),
    merge({
        text: 'Text'
    })
);

const makeResponseMessageForDooray = pipe(
    getOriginalUrl,
    wrapWithObject('imageUrl'),
    wrapWithArray,
    appendAddButton,
    wrapWithObject('attachments'),
    merge({
        text: 'Text'
    })
)

// search :: Obj -> Future [Obj]
const search = pipe(
    prop('text'),
    searchGiphy
);

const slack = (body) => {
    return pipe(
        search,
        map(makeResponseMessageForSlack)
    )(body);
}

const dooray = (body) => {
    return pipe(
        search,
        map(makeResponseMessageForDooray)
    )(body);
}

export default {
    slack,
    dooray
};