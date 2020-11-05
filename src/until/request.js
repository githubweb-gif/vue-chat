import axios from 'axios'
import { getToken } from './auth'
import store from '@/store'
import { Notify, Dialog } from 'vant'

let baseURL = ''
if (process.env.NODE_ENV === 'production') {
  // 你上线的后端url
  baseURL = 'http://106.53.102.65:3200'
} else {
  baseURL = 'http://localhost:3000'
}

const service = axios.create({
  baseURL,
  timeout: '5000'
})

// 请求拦截
service.interceptors.request.use(
  (config) => {
    if (store.getters.userInfo.token) {
      config.headers['Chat-Token'] = getToken()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.status !== 200) {
      Notify({ type: 'danger', message: res.message || 'Error', duration: 1000 })
      // token503
      if (res.status === 503) {
        Dialog.alert({ message: '您已注销，您可以取消以留在此页面，或再次登录', showCancelButton: true }).then(() => {
          store.dispatch('resetToken').then(() => {
            location.reload()
          })
        })
      }
      // status 500
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    Notify({ type: 'danger', message: error.message, duration: 1000 })
    return Promise.reject(error)
  }
)

export default service
