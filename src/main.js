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

// 全局注册
Vue.use(VueCropper)
Vue.use(elementUi)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
