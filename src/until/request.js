import axios from 'axios'
import { getToken } from './auth'
import store from '@/store'
import { MessageBox, Message } from 'element-ui'

const service = axios.create({
  baseURL: 'http://localhost:3000',
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
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // token503
      if (res.status === 503) {
        MessageBox.confirm('您已注销，您可以取消以留在此页面，或再次登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
