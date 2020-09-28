import router from './router'
import { getToken } from '@/until/auth'
import store from '@/store'

const whiteList = ['/login', '/registered'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
    } else {
      const name =
        store.getters.userInfo.name && store.getters.userInfo.name > 0
      if (name) {
        next()
      } else {
        store.dispatch('getInfo')
        next()
      }
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})
