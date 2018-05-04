import axios from 'axios';

export let getSeller=(url)=>{
    return axios.get(`${url}`);
}