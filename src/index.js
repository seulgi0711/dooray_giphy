import bodyParser from "body-parser";
import express from "express";
import { cond, equals, T } from 'ramda';
import commandHandler from "./commandHandler/commandHandler";
import { createNoResultResponse } from "./giphySearcher";
import reqHandler from "./reqHandler/reqHandler";

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

app.set("port", process.env.PORT || 3000);

app.use((req, res, next) => {
    res.locals.showTests =
        app.get("env") !== "production" && req.query.test === "1";
    next();
});

app.get("/", (req, res) => {
    res.type("text/plain");
    res.send("Test");
});

// prettier-ignore
app.post("/giphy", (req, res) => {
    commandHandler(req).fork(cond([
            [equals('no result'), () => createNoResultResponse(req.body).value(result => res.send(result))],
            [T, console.error]
        ]),
        result => res.send(result)
    );
});

app.post("/req", (req, res) => {
    reqHandler(req).fork(console.error, result => res.send(result));
});

app.listen(app.get("port"), () => {
    console.log(`Server started on ${app.get("port")}`);
});
