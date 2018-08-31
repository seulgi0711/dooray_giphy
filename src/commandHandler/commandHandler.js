import { pipe, prop } from "ramda";
import { createNoKeywordResponse, searchImage, validateKeywordFromReq } from '../giphySearcher';
import { def } from "../types/types";
import { mEither } from '../utils/fnUtil';

// prettier-ignore
const commandHandler = def(
    "commandHandler :: Object -> Future Object Object",
    pipe(
        prop("body"),
        validateKeywordFromReq,
        mEither(createNoKeywordResponse, searchImage)
    )
);

export default commandHandler;
