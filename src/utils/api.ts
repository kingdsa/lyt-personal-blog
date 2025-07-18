import {qsPost, post, get} from './axios'
//这里封装你请求的方法
export const getApi = (p:any) => post('/api/getApi', p);

