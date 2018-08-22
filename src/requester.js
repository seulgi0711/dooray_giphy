import axios from 'axios';
import queryString from 'query-string';

const Giphy = {
    search: (q) => {
        return axios.get('http://api.giphy.com/v1/gifs/search', {
            params: {
                api_key: '8JyP74RbDTroHrzNyXt8zaAWkBeIe81l',
                q,
                limit: 1,
                offset: 0,
                fmt: 'json'
            }
        });
    }
};

export default {
    Giphy
}