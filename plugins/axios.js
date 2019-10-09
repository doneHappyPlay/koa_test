import Vue from 'vue'
import axios from 'axios'
import { MessageBox } from 'element-ui';

let options = {
  timeout: 5000,
  baseURL:'/api/'
}
const TOKEN_KEY = 'Kkb-Token'
// options.baseURL = apiConfig.baseUrl;

let service = axios.create(options);

export default ({ store, redirect }) => {
  service.interceptors.request.use(
    config => {
      config.headers.common["Kaikeba"] = "dasheng";
  
      const token = window.localStorage.getItem(TOKEN_KEY);
      if (token) {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        // Bearer 是JWT的认证头部信息
        config.headers.common["Authorization"] = "Bearer " + token;
      }
      return config;
    },
    err => {
      return Promise.reject(err);
    }
  );
  
  service.interceptors.response.use(
    async response => {
      console.log('res',response)
      const {data,config} = response
      if(data.code===0){
        // 正确
        if(config.url==="/api/user/login"){
          // 设置token
          const token = data.data.token
          localStorage.setItem(TOKEN_KEY, token)
        }
      }else if(data.code===-666){
        // token过期
        MessageBox.confirm('登录已过期', '过期', {
          confirmButtonText: '去登录',
          showCancelButton:false,
          type: 'warning',
        }).then(() => {
          localStorage.removeItem(TOKEN_KEY)
          redirect({path:'/login'})
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
      }
      return data;
    },
    err => {
      return Promise.reject(err);
    }
  );
  
}



// //请求
// function send (option, isServer) {
//     if (!option || !option.method || !option.url) {
//         return
//     }
//     let url = option.url;
//     let headers;
//     if(isServer){
//         url = pathReplace(url, 'server')
//     }else{
//         headers = headersSet(url);
//         url = pathReplace(url)
//     }


//     return service({
//         url,
//         method: option.method,
//         headers: Object.assign({}, headers, option.headers || {}),
//         params: option.params || {},
//         data: option.data || {},
//         timeout: option.timeout || 50000
//     })
// }

Vue.prototype.$http = service

export const http = service
