import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: 'home',
        meta: { index: 2, keepAlive: true },
        component: () => import('../views/home/index.vue')
      },
      // 通讯录
      {
        path: '/addressBook',
        meta: { index: 2, title: '通讯录' },
        component: () => import('../views/addressBook/index.vue')
      },
      // 个人信息页
      {
        path: '/userInfo',
        meta: { index: 5, keepAlive: true },
        component: () => import('../views/userInfo/index.vue')
      },
      // 好友信息页
      {
        path: '/friendInfo',
        meta: { index: 5, keepAlive: true },
        component: () => import('../views/userInfo/index.vue')
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
    meta: { index: 3, title: 'search', keepAlive: false },
    component: () => import('../views/search/index.vue')
  },
  // 个人详情页
  {
    path: '/details',
    meta: { index: 4, keepAlive: false },
    component: () => import('../views/Details/index.vue')
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
  },
  // 创建群聊
  {
    path: '/setGroup',
    meta: { index: 3 },
    component: () => import('../views/groupChat/index.vue')
  },
  // 群聊聊天页
  {
    path: '/groupChat',
    meta: { index: 5 },
    component: () => import('../views/chat/index.vue')
  },
  // 群详情页
  {
    path: '/groupDetails',
    meta: { index: 6 },
    component: () => import('../views/groupDetails/index.vue')
  },
  // 群列表页
  {
    path: '/groupList',
    meta: { index: 4 },
    component: () => import('../views/groupList/index.vue')
  }
]

const router = new VueRouter({
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default router
