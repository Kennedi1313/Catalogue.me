import axios from 'axios';

const api = axios.create({
    baseURL: 'https://catalogueme-backend.herokuapp.com/',
});

export default api;

