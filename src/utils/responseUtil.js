import { def } from "../types";

export const createAttachments = def(
    'createAttachments :: Object -> Object',
    () => {

    }
)

export const createButton = def(
    'createButton :: Object -> Button',
    merge({type: 'button'})
);
