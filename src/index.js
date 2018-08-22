import express from 'express';
import bodyParser from 'body-parser';
import {
    take,
    head,
    prop,
    pipe
} from 'ramda';
import commandHandler from './commandHandler/commandHandler';
import { def } from './types';

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.use((req, res, next) => {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/', (req, res) => {
    res.type('text/plain');
    res.send('Test');
});

app.post('/giphy', (req, res) => {
    pipe(
        prop('body'),
        commandHandler.dooray,
    )(req).value((result) => res.send(result));
});

const getImgaeUrlFromAttachments = def(
    'getImgaeUrlFromAttachments :: Array -> String',
    pipe(head, prop('imageUrl'))
)

app.post('/req', (req, res) => {
    const {originalMessage} = req.body;
    res.send({
        "responseType": "inChannel",
        "deleteOriginal": true,
        text: originalMessage.text,
        attachments: take(1, req.body.originalMessage.attachments)
    })
});

app.listen(app.get('port'), () => {
    console.log(`Server started on ${app.get('port')}`);
});
