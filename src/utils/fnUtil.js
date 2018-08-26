import { curry } from "ramda";

export const wrapWithObject = curry((key, value) => {
    return {
        [key]: value
    };
});

export const wrapWithArray = value => {
    return [value];
};

export const logTap = curry((label, data) => {
    console.log(label, data);
    return data;
});

export const liftA2 = curry((g, f1, f2) => {
    return f1.map(g).ap(f2);
});

export const liftA3 = curry((g, f1, f2, f3) => {
    return f1
        .map(g)
        .ap(f2)
        .ap(f3);
});

export const wrapValuesWithArray = (...values) => {
    return [...values];
};
