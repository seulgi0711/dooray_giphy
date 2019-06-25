import { addIndex, curry, keys, map, reduce } from "ramda";
import complement from "ramda/es/complement";
// import { complement } from "ramda";

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

export const mMaybe = curry((v, f, m) => {
  return isNothing(m) ? v : f(m.value);
});

export const mEither = curry((f, g, e) => {
  return e.isLeft ? f(e.value) : g(e.value);
});

export const isNothing = m => {
  return m.isNothing;
};

export const isJust = complement(isNothing);
