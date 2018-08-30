import axios from "axios";
import Future from 'fluture';
import { curry, head, path, pipe } from 'ramda';
import { logTap } from '../utils/fnUtil';

const search = (q, limit = 1, offset = 0) => {
    console.log('q', q);
    console.log('limit', limit);
    console.log('offset', offset);
    return Future((rej, res) => {
        axios.get("http://api.giphy.com/v1/gifs/search", {
            params: {
                api_key: "8JyP74RbDTroHrzNyXt8zaAWkBeIe81l",
                fmt: "json",
                lang: "ko",
                q,
                limit,
                offset
            }
        }).then(pipe(path(['data', 'data']), res)).catch(rej);
    });
};

const Giphy = {
    search: (q, limit, offset) => {
        return search(q, limit, offset);
    }
};

export default {
    Giphy
};
