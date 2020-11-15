import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-barron-react.firebaseio.com/'
});

export default instance;