import Body from "@@types/Body";
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { pick, pipe, prop } from "ramda";
import reqHandler from "./reqHandler/reqHandler";
import requester from "./requester/requester";
import { logTap, runFutureValue } from "./utils/fnUtil";

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

app.get("/", (_, res) => {
  res.type("text/plain");
  res.send("Test");
});

// const send = curry((res, data) => {
//   res.send(data);
// });

app.post("/giphy", (req: Request, _: Response) => {
  // commandHandler(req).fork(
  //   cond([
  //     [
  //       equals("no result"),
  //       () => createNoResultResponse(req.body).value(result => res.send(result))
  //     ],
  //     [T, console.error]
  //   ]),
  //   result => res.send(result)
  // );

  pipe<Request, Body, { text: string }, any, any>(
    prop("body"),
    pick(["text"]),
    ({ text }) => requester.Giphy.search(text),
    runFutureValue(logTap("result"))
    // send(res)
  )(req);
});

app.post("/req", (req, res) => {
  reqHandler(req).fork(console.error, result => res.send(result));
});

app.listen(app.get("port"), () => {
  console.log(`Server started on ${app.get("port")}`);
});
