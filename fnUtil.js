import {curry} from 'ramda';

export const wrapWithObject = curry((key, value) => {
    return {
        [key]: value
    };
})

export const wrapWithArray = (value) => {
    return [value];
}