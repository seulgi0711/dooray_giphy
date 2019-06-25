import { pipe, prop } from "ramda";
import {
  createNoKeywordResponse,
  searchImage,
  validateKeywordFromReq
} from "../giphySearcher";
import { mEither } from "../utils/fnUtil";

// "commandHandler :: Object -> Future Object Object",
const commandHandler = pipe(
  prop("body"),
  validateKeywordFromReq,
  mEither(createNoKeywordResponse, searchImage)
);

export default commandHandler;
