import axios from "axios";
import Future from 'fluture';
import { head, path, pipe } from 'ramda';

const search = (q, offset) => {
    console.log('q', q);
    console.log('offset', offset);
    return Future((rej, res) => {
        axios.get("http://api.giphy.com/v1/gifs/search", {
            params: {
                api_key: "8JyP74RbDTroHrzNyXt8zaAWkBeIe81l",
                q,
                limit: 1,
                offset,
                fmt: "json",
                lang: "ko"
            }
        }).then(pipe(path(['data', 'data']), head, res)).catch(rej);
    });
};

const Giphy = {
    search: q => {
        return search(q, 0);
    },
    searchWithOffset: (q, offset) => {
        return search(q, offset);
    }
};

export default {
    Giphy
};
