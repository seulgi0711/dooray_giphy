import { isEmpty, parseInt } from "lodash";
import { __, assoc, concat, dec, flip, gt, ifElse, inc, juxt, merge, objOf, pipe, reject, when } from "ramda";
import { ACTION_TYPE, BUTTON_TYPE } from "../constant";
import { def } from "../types/types";
import { isNextButton } from "./actionUtil";
import { logTap, wrapWithObject } from "./fnUtil";
import { getOriginalUrl, getSearchKeyword, isDialogSubmission } from "./requestUtil";

export const createPrevAction = def(
    "createPrevAction :: Number -> Object",
    assoc("value", __, {
        name: BUTTON_TYPE.PREV,
        text: "이전 이미지",
        type: ACTION_TYPE.BUTTON
    })
);

export const createNextAction = def(
    "createNextAction :: Number -> Object",
    assoc("value", __, {
        name: BUTTON_TYPE.NEXT,
        text: "다음 이미지",
        type: ACTION_TYPE.BUTTON
    })
);

// prettier-ignore
export const createNextActions = def(
    "createNextActions :: Number -> Object",
    pipe(
        logTap('offset'),
        juxt([when(gt(__, 0), pipe(dec, createPrevAction)), pipe(inc, createNextAction)]),
        reject(isEmpty),
        objOf("actions")
    )
);

// prettier-ignore
export const createPrevActions = def(
    "createPrevActions :: Number -> Object",
    pipe(
        juxt([when(gt(__, 0), pipe(dec, createPrevAction)), pipe(inc, createNextAction)]),
        reject(isEmpty),
        wrapWithObject("actions")
    )
);

export const createActions = def(
    "createActions :: ReqBody -> Object",
    ifElse(isNextButton, createNextActions, createPrevActions)
);

export const createInChannelResponse = def(
    "createInChannelResponse :: Object -> InChannelResponse",
    merge(__, { responseType: "inChannel" })
);

export const createReplaceResponse = def(
    "createReplaceResponse :: Object -> ReplaceResponse",
    merge(__, { deleteOriginal: true })
);

export const mergeActionAndImageAttachment = def(
    "mergeActionAndImageAttachment :: Object -> Object -> Object",
    (actionsAttachment, imageAttachment) => {
        return {
            attachments: [imageAttachment, actionsAttachment]
        };
    }
);

// prettier-ignore
export const createOriginImageAttachment = def(
    "createOriginImageAttachment :: Object -> Object",
    pipe(getOriginalUrl, objOf("imageUrl"))
);

// prettier-ignore
export const createThumbImageAttachment = def(
    "createOriginImageAttachment :: Object -> Object",
    pipe(getOriginalUrl, objOf("thumbUrl"))
);

export const createKeywordText = def(
    "createKeywordText :: ReqBody -> Object",
    pipe(
        getSearchKeyword,
        concat("'"),
        flip(concat)("'에 대한 검색 결과"),
        objOf("text")
    )
);

export const createNoResultKeywordText = def(
    'createNoResultKeywordText :: Object -> Object',
    pipe(
        getSearchKeyword,
        concat("'"),
        flip(concat)("'에 대한 검색 결과가 없습니다."),
        objOf("text")
    )
)

export const createSendAction = def(
    'createSendAction :: Number -> Object',
    assoc("value", __, {
        name: BUTTON_TYPE.SEND,
        text: "대화방으로 보내기",
        type: ACTION_TYPE.BUTTON
    })
);

export const createSearchModal = def(
    'createSearchModal :: String -> Object',
    (memberId) => {
      return {
          callbackId: memberId,
          title: 'Giphy 검색하기',
          submitLabel: '검색',
          elements: [
              {
                  type: 'input',
                  label: '키워드',
                  name: 'keyword',
                  value: '',
                  placeholder: '검색어를 입력해 주세요.'
              },
              {
                  type: 'select',
                  label: '한 번에 보여줄 이미지 수',
                  name: 'count',
                  value: 1,
                  options: [
                      {value: '1', label: '1'},
                      {value: '2', label: '2'},
                      {value: '3', label: '3'},
                      {value: '4', label: '4'},
                      {value: '5', label: '5'},
                  ]
              }
          ]
      };
    }
)