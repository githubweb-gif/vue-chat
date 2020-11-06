import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
// import 'element-ui/lib/theme-chalk/index.css'
// import elementUi from 'element-ui'
import './until/date'
import './assets/font/iconfont.css'
import './vantComponents'
import '@/icons/index'
import '@/style/transition.scss'
// rem布局
import './until/remshipei'
// 截图
import VueCropper from 'vue-cropper'
import './permission'
// 地图
import VueAMap from 'vue-amap'
VueAMap.initAMapApiLoader({
  key: '3c1fd4dccbf2caca2d3a662af07b7cee',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.Geolocation'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})
Vue.use(VueAMap)

// socket.io
import io from 'weapp.socket.io'
if (process.env.NODE_ENV === 'production') {
  // 你上线的后端url
  Vue.prototype.socket = io('http://106.53.102.65:8082/')
} else {
  Vue.prototype.socket = io('http://localhost:8082/')
}

// 全局注册
Vue.use(VueCropper)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
