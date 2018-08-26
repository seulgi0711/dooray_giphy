import { path } from "ramda";
import { def } from "../types/types";

export const getOriginalUrl = def(
    "getOriginalUrl :: Object -> String",
    path(["images", "original", "url"])
);
