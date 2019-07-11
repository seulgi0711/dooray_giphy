import axios from "axios";
import Future from "fluture";
import { ifElse, pathSatisfies, equals, mergeDeepRight, curry } from "ramda";

const defaultParams = {
  api_key: "8JyP74RbDTroHrzNyXt8zaAWkBeIe81l",
  fmt: "json",
  lang: "ko"
};

const handleSearchResult = curry((reject, resolve, response) => {
  ifElse(
    pathSatisfies(equals(0), ["data", "pagination", "count"]),
    () => reject({ error: "No Result" }),
    resolve
  )(response);
});

const search = (q: string, limit: number, offset: number) => {
  const params = mergeDeepRight(defaultParams, { q, limit, offset });
  return Future((reject, resolve) => {
    axios
      .get("http://api.giphy.com/v1/gifs/search", { params })
      .then(handleSearchResult(reject, resolve))
      .catch(reject);
  });
};

const Giphy = {
  search: (q: string, limit?: number, offset?: number) => {
    if (!limit) limit = 1;
    if (!offset) offset = 0;
    return search(q, limit, offset);
  }
};

const Dooray = {
  openModal: ({ channelId, token = "", triggerId, dialog }) => {
    return Future((rej, res) => {
      axios
        .post(
          `https://nhnent.dooray.com/messenger/api//channels/${channelId}/dialogs`,
          { triggerId, dialog },
          { headers: { token } }
        )
        .then(res)
        .catch(rej);
    });
  },
  // "webHook :: String -> Object -> Future Object Object",
  webHook: (url, body) => {
    return Future((rej, res) => {
      axios
        .post(url, body)
        .then(res)
        .catch(rej);
    });
  }
};

export default {
  Giphy,
  Dooray
};
