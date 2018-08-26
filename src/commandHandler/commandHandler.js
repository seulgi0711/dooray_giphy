import { always, converge, map, merge, pipe, prop } from "ramda";
import requester from "../requester/requester";
import { def } from "../types/types";
import { liftA2 } from "../utils/fnUtil";
import {
    convertSearchIntoAttachments,
    createImageAttachment,
    createKeywordText,
    createNextAction,
    createSendAction
} from "../utils/responseUtil";

const actionsAttachment = {
    actions: [createSendAction(undefined), createNextAction(1)]
};

// prettier-ignore
const search = def(
    'search :: Object -> Future Object Object',
    pipe(
        prop("text"),
        requester.Giphy.search,
        map(converge(convertSearchIntoAttachments, [always(actionsAttachment), createImageAttachment]))
    )
);

const commandHandler = def(
    "commandHandler :: Object -> Future Object Object",
    pipe(
        prop("body"),
        converge(liftA2(merge), [createKeywordText, search])
    )
);

export default commandHandler;
