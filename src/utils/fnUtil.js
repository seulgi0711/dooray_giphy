import { addIndex, reduce, keys, curry, map } from "ramda";

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

export const mapIndexed = addIndex(map);

export const rename = curry((keysMap, obj) => {
    return reduce(
        (acc, key) => {
            acc[keysMap[key] || key] = obj[key];
            return acc;
        },
        {},
        keys(obj)
    );
});

export const mEither = curry((f, g, e) => {
    return e.isLeft ? f(e.value) : g(e.value);
});