import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css'
import elementUi from 'element-ui'
import './until/date'
import './assets/font/iconfont.css'
// 截图
import VueCropper from 'vue-cropper'
import './permission'
// 地图
import VueAMap from 'vue-amap'
VueAMap.initAMapApiLoader({
  key: 'aee7cc085fc25b723455a438f4f54d94',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.Geolocation'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})
Vue.use(VueAMap)

// 全局注册
Vue.use(VueCropper)
Vue.use(elementUi)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
