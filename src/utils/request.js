import axios from 'axios'

// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: 'https://play-api.cryptoships.club/api',
    // 超时
    timeout: 30000
})
// request拦截器

service.interceptors.request.use(config => {
    // 是否需要设置 token
    const isToken = config.headers.isToken || false
    let token = localStorage.getItem('token')||false
    if (isToken) {
        config.headers['authorization'] = 'Bearer ' + token 
    }else{
        config.headers['authorization'] = 'Bearer s3LUcFFRug5nDTByfK2V6He1cOtGr0AN'
    }
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

export default service
