import { getCookie} from './auth'
// @ts-ignore
import axios from "axios";
// @ts-ignore
import qs from "qs";

//post请求头
//  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

//允许跨域携带cookie信息
axios.defaults.withCredentials = true;
//设置超时
axios.defaults.timeout = 15000;

axios.interceptors.request.use(
    (config:any) => {
        //这里看设置请求头参数，一般是个token  getCookie('token')
    config.headers.Authorization = "xxxxxx";
        return config;
    },
    (error:any)  => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response:any)  => {
        if (response.status == 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    (error:any)  => {
    }
);

    /**
     * @param {String} url
     * @param {Object} data
     * @returns Promise
     */
    const  qsPost=(url:string, data:any)=> {
        return new Promise((resolve, reject) => {
              axios({
                  method: 'post',
                  url,
                  data: qs.stringify(data),
              })
                  .then((res:any)  => {

                      resolve(res.data)
                  })
                  .catch((err:any)  => {

                      reject(err)
                  });

        })
    };
const  post=(url:string, data:any)=> {
      return new Promise((resolve, reject) => {
          axios({
                  method: 'post',
                  url,
                  data: data,
              })
              .then((res:any)  => {
                  resolve(res.data)
              })
              .catch((err:any)  => {

                  reject(err)
              });

      })
  };
const get=(url:string, data:any) =>{
        return new Promise((resolve, reject) => {
            axios({
                    method: 'get',
                    url,
                    params: data,
                })
                .then((res:any)  => {
                    resolve(res.data)
                })
                .catch((err:any)  => {

                    reject(err)
                })

        })
    };
export  {qsPost,
    post,
    get};






