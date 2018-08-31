import axios from "axios";
import Future from 'fluture';
import { path, pipe } from 'ramda';

const search = (q, limit = 1, offset = 0) => {
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
        }).then((result) => {
            if (result.data.pagination.count === 0) {
                return rej('no result');
            }
            res(result);
        }).catch(rej);
    });
};

const Giphy = {
    search: (q, limit, offset) => {
        console.log('q', q, 'limit', limit, 'offset', offset);
        return search(q, limit, offset);
    }
};

export default {
    Giphy
};
