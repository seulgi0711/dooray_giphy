import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import Future, { FutureInstance, parallel } from 'fluture';
import {
  always,
  assoc,
  cond,
  curry,
  equals,
  head,
  juxt,
  map,
  merge,
  mergeAll,
  objOf,
  pathOr,
  pipe,
  propEq,
  T
} from 'ramda';
import { ACTION_TYPE, BUTTON_TYPE } from './constant';
import requester from './requester/requester';
import { mEither, runFutureFork, runFutureValue } from './utils/fnUtil';
import { validateKeyword } from './utils/requestUtil';
import { createAttachments, createCarouselActionAttachments, createImageAttachment } from './utils/responseUtil';

const defaultEmptyKeywordAttachment = {
  title: "The image below is the result of typing '/giphy typing'.",
  fields: [
    {
      title: '/giphy keyword',
      value: 'Search for images that match your keywords.'
    },
    {
      title: '/giphy keyword --multi=n',
      value: 'Search for images that match your keywords and show n images. (1 <= n <=5 ).'
    },
    {
      title: 'Search images with dialog',
      value: 'Click below button to open dialog.'
    }
  ],
  actions: [
    {
      name: BUTTON_TYPE.SEARCH_MODAL,
      text: 'Open search dialog.',
      type: ACTION_TYPE.BUTTON,
      value: 'search_modal'
    },
    {
      name: BUTTON_TYPE.CLOSE,
      text: 'Close.',
      type: ACTION_TYPE.BUTTON,
      value: 'close'
    }
  ]
};

const app = express();

const getErrorMessageText = curry(
  (req, error): FutureInstance<never, any> => {
    const { text: keyword } = req.body;
    return pipe<object, string, object, FutureInstance<never, object>>(
      cond([
        [propEq('type', 'Empty Keyword'), always('Please enter keyword.')],
        [propEq('type', 'No Result'), always(`No results found for ${keyword}.`)],
        [T, always(`알수없는 에러: ${error.type}`)]
      ]),
      objOf('text'),
      Future.of
    )(error);
  }
);

const getEmptyKeywordAttachments = (): FutureInstance<never, any> => {
  return pipe<any, any, any, any, any, any>(
    requester.Giphy.search,
    map(head),
    map(createImageAttachment),
    map(merge(defaultEmptyKeywordAttachment)),
    map(createAttachments)
  )('typing');
};

const getErrorAttahcments = error => {
  return cond([[propEq('type', 'Empty Keyword'), getEmptyKeywordAttachments], [T, always(Future.of({}))]])(error);
};

const handleError = curry((req, res, error) => {
  pipe<any, any, any, any, any>(
    juxt([getErrorMessageText(req), getErrorAttahcments]),
    futures => parallel(2, futures),
    map(mergeAll),
    runFutureValue(res.send.bind(res))
  )(error);
});

const handleCloseReq = () => {
  return {
    deleteOriginal: true,
    text: 'Giphy closed.'
  };
};

const handleSelectImageReq = curry(
  (req, _): any => {
    const index = req.body.actionValue;
    return pipe(
      pathOr('', ['body', 'originalMessage', 'attachments', 0, 'actions', 0, 'options', index, 'value']),
      objOf('imageUrl'),
      createAttachments,
      assoc('text', 'text')
    )(req);
  }
);

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.use((req, res, next) => {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

app.get('/', (_, res) => {
  res.type('text/plain');
  res.send('Test');
});

app.get('/monitor/l7check', (_, res) => {
  return res.status(200).send('OK');
});

// const send = curry((res, data) => {
//   res.send(data);
// });

app.post('/giphy', (req: Request, res: Response) => {
  pipe(
    pathOr('', ['body', 'text']),
    validateKeyword,
    mEither(Future.reject, requester.Giphy.search),
    map(createCarouselActionAttachments),
    map(assoc('text', 'text')),
    runFutureFork(handleError(req, res), res.send.bind(res))
  )(req);
});

app.post('/req', (req, res) => {
  console.log('req.body', req.body);
  pipe<any, string, object, any>(
    pathOr('', ['body', 'actionName']),
    cond([
      [equals('close'), handleCloseReq],
      [equals('selectImage'), handleSelectImageReq(req)],
      [T, always({ text: `알 수 없는 req: ${req.body.actionValue}` })]
    ]),
    res.send.bind(res)
  )(req);
});

app.listen(app.get('port'), () => {
  console.log(`Server started on ${app.get('port')}`);
});
