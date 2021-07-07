import axios from 'axios';

export const api = axios.create();

export const apiImgbb = axios.create({
  baseURL: `https://api.imgbb.com/1`,
});
