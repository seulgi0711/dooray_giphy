import { isArray, isEmpty } from 'lodash';
import {
  assoc,
  complement,
  concat,
  converge,
  curry,
  dec,
  gt,
  inc,
  juxt,
  map,
  merge,
  objOf,
  of,
  pipe,
  reject,
  when,
  __
} from 'ramda';
import { ACTION_TYPE, BUTTON_TYPE } from '../constant';
import { wrapWithObject, logTap } from './fnUtil';
import { extractSearchKeyword, extractTenantId, extractUserId, getOriginalUrl } from './requestUtil';

// "createPrevAction :: Number -> Object",
export const createPrevAction = assoc('value', __, {
  name: BUTTON_TYPE.PREV,
  text: 'Prev',
  type: ACTION_TYPE.BUTTON
});

// "createNextAction :: Number -> Object",
export const createNextAction = assoc('value', __, {
  name: BUTTON_TYPE.NEXT,
  text: 'Next',
  type: ACTION_TYPE.BUTTON
});

//  "createNextActions :: Number -> Object",
export const createNextActions = pipe(
  juxt([
    when(
      gt(__, 0),
      pipe(
        dec,
        createPrevAction
      )
    ),
    pipe(
      inc,
      createNextAction
    )
  ]),
  reject(isEmpty),
  objOf('actions')
);

//  "createPrevActions :: Number -> Object",
export const createPrevActions = pipe(
  juxt([
    when(
      gt(__, 0),
      pipe(
        dec,
        createPrevAction
      )
    ),
    pipe(
      inc,
      createNextAction
    )
  ]),
  reject(isEmpty),
  wrapWithObject('actions')
);

// "createActions :: ReqBody -> Object",
// export const createActions = ifElse(
//   isNextButton,
//   createNextActions,
//   createPrevActions
// );

//  "createInChannelResponse :: Object -> InChannelResponse",
export const createInChannelResponse = merge(__, {
  responseType: 'inChannel'
});

//  "createReplaceResponse :: Object -> ReplaceResponse",
export const createReplaceResponse = merge(__, { deleteOriginal: true });

// "mergeActionAndImageAttachment :: Object -> Object -> Object",
export const mergeActionAndImageAttachment = curry((actionsAttachment, imageAttachment) => {
  return {
    attachments: [imageAttachment, actionsAttachment]
  };
});

// "createOriginImageAttachment :: Object -> Object",
export const createOriginImageAttachment = pipe(
  getOriginalUrl,
  objOf('imageUrl')
);

//  "createOriginImageAttachment :: Object -> Object",
export const createThumbImageAttachment = pipe(
  getOriginalUrl,
  objOf('thumbUrl')
);

//  "createKeywordText :: ReqBody -> Object",
export const createKeywordText = pipe(
  extractSearchKeyword,
  concat("Search results for '"),
  concat(__, "'"),
  objOf('text')
);

// "createSenderMention :: ReqBody -> String",
export const createSenderMention = converge((tenantId, userId) => `(dooray://${tenantId}/members/${userId} "member")`, [
  extractTenantId,
  extractUserId
]);

// "createSearchResultText :: ReqBody -> Object",
export const createSearchResultText = reqBody => {
  return pipe(
    createSenderMention,
    concat(__, ' sent an image.'),
    objOf('text')
  )(reqBody);
};

// "createNoResultKeywordText :: Object -> Object",
export const createNoResultKeywordText = pipe(
  extractSearchKeyword,
  concat('No results found for '),
  objOf('text')
);

// "createSendAction :: Number -> Object",
export const createSendAction = assoc('value', __, {
  name: BUTTON_TYPE.SEND,
  text: 'Send',
  type: ACTION_TYPE.BUTTON
});

// "createSearchModal :: String -> Object",
export const createSearchModal = memberId => {
  return {
    callbackId: memberId,
    title: 'Search Giphy',
    submitLabel: 'Search',
    elements: [
      {
        type: 'input',
        label: 'Keyword',
        name: 'keyword',
        value: '',
        placeholder: 'Please enter keyword.'
      },
      {
        type: 'select',
        label: 'Number of images to show',
        name: 'count',
        value: 1,
        options: [
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4' },
          { value: '5', label: '5' }
        ]
      }
    ]
  };
};

const convertArrayType = <T>(values: Array<T> | T): Array<T> => {
  return when(complement(isArray), of)(values);
};

export const createCarouselAction = (values: Array<string> | string) => {
  return pipe(
    convertArrayType,
    map(objOf('value')),
    objOf('options'),
    assoc('type', 'carousel')
  )(values);
};

export const createActions = (actions: Array<any> | any) => {
  return pipe(
    convertArrayType,
    objOf('actions')
  )(actions);
};

export const createImageAttachment = (imageUrl: string) => {
  return { imageUrl };
};

export const createAttachments = (attachments: Array<any> | any) => {
  return pipe(
    convertArrayType,
    objOf('attachments')
  )(attachments);
};

export const createCarouselActionAttachments = (values: Array<string> | string) => {
  return pipe(
    createCarouselAction,
    createActions,
    createAttachments,
    logTap('attachments')
  )(values);
};
