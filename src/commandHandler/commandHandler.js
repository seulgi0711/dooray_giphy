import { cond, pipe, prop, T } from "ramda";
import { searchMultiImages, searchOneImage } from '../giphySearcher';
import { def } from "../types/types";
import { isMultiImage } from '../utils/requestUtil';

// prettier-ignore
const commandHandler = def(
    "commandHandler :: Object -> Future Object Object",
    pipe(
        prop("body"),
        cond([
            [isMultiImage, searchMultiImages],
            [T, searchOneImage]
        ])
    )
);

export default commandHandler;
