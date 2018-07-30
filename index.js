import express from 'express';
import bodyParser from 'body-parser';
import {
    identity,
    map,
    tap,
    prop,
    pipe
} from 'ramda';
import commandHandler from './commandhandler';


const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.type('text/plain');
    res.send('Test');
});

app.post('/giphy/slack', (req, res) => {
    pipe(
        prop('body'),
        commandHandler.slack,
    )(req).value((result) => res.send(result));
});

app.post('/giphy/dooray', (req, res) => {
    pipe(
        prop('body'),
        commandHandler.dooray,
    )(req).value((result) => res.send(result));
});

app.listen(app.get('port'), () => {
    console.log(`Server started on ${app.get('port')}`);
});