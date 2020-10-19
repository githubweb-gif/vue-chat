import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('../layout/index.vue'),
    meta: { keepAlive: true },
    children: [
      {
        path: 'home',
        meta: { index: 2, keepAlive: true },
        component: () => import('../views/home/index.vue')
      }
    ]
  },
  {
    path: '/login',
    meta: { index: 0 },
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/registered',
    meta: { index: 1 },
    component: () => import('../views/registered/index.vue')
  },
  // 搜索页
  {
    path: '/search',
    meta: { index: 3, title: 'search', keepAlive: true },
    component: () => import('../views/search/index.vue')
  },
  // 个人详情页
  {
    path: '/details',
    meta: { index: 4, keepAlive: true },
    component: () => import('../views/Details/index.vue')
  },
  // 个人信息页
  {
    path: '/userInfo',
    meta: { index: 5, keepAlive: true },
    component: () => import('../views/userInfo/index.vue')
  },
  // 添加好友页
  {
    path: '/addFriend',
    meta: { index: 3, title: 'addFriend' },
    component: () => import('../views/search/index.vue')
  },
  // 拒绝，同意好友请求页
  {
    path: '/friendReq',
    meta: { index: 3 },
    component: () => import('../views/friendReq/index.vue')
  },
  // 聊天页
  {
    path: '/chat',
    meta: { index: 3 },
    component: () => import('../views/chat/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
