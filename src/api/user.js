import request from '@/until/request'

// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    params: data
  })
}

// 获取用户信息
export function getInfo(id) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { id }
  })
}

// 登出
export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}

// 注册
export function registered(data) {
  return request({
    url: '/user/registered',
    method: 'post',
    data
  })
}

// 注册名称/邮箱验证是否已被占用
export function validUser(data) {
  return request({
    url: '/user/valid',
    method: 'get',
    params: data
  })
}

// 获取验证码
export function getCode(data) {
  return request({
    url: '/user/email',
    method: 'post',
    data
  })
}

// 获取好友列表
export function getFriends(data) {
  return request({
    url: '/user/getFriends',
    method: 'get',
    params: data
  })
}

// 判断是否是好友
export function isFriend(data) {
  return request({
    url: '/user/isFriend',
    method: 'get',
    params: data
  })
}

// 搜索好友
export function searchFriends(data) {
  return request({
    url: '/user/searchFriends',
    method: 'get',
    params: data
  })
}

// 搜索陌生人
export function searchStranger(data) {
  return request({
    url: '/user/searchStranger',
    method: 'get',
    params: data
  })
}

// 发送好友请求
export function friendRequest(data) {
  return request({
    url: '/user/friendRequest',
    method: 'post',
    data
  })
}

// 获取好友请求
export function getRequest(data) {
  return request({
    url: '/user/getRequest',
    method: 'get',
    params: data
  })
}

// 拒绝好友请求
export function refuseRequest(data) {
  return request({
    url: '/user/refuseRequest',
    method: 'post',
    data
  })
}

// 同意好友请求
export function agreeRequest(data) {
  return request({
    url: '/user/agreeRequest',
    method: 'post',
    data
  })
}

// 修改用户信息
export function modifyUserInfo(data) {
  return request({
    url: '/user/modifyUserInfo',
    method: 'post',
    data
  })
}

// 上传头像
export function uploadImg(data) {
  return request({
    url: '/user/uploadImg',
    method: 'post',
    data
  })
}

// 获取一对一消息
export function oppositeMessage(data) {
  return request({
    url: '/user/getMessage',
    method: 'get',
    params: data
  })
}

// 发送消息
export function sendMessage(data) {
  return request({
    url: '/user/sendMsg',
    method: 'post',
    data
  })
}

// 获取最新消息一条
export function getNewMsg(data) {
  return request({
    url: '/user/getNewMsg',
    method: 'get',
    params: data
  })
}

// if (value.types === 0) {
//   this.msgList.push(value)
//   return
// }
// if (value.types === 1) {
//   this.images.push(value.message)
// }
// this.msgList.push(value)
// setTimeout(() => {
//   this.$nextTick(() => {
//     this.scroll().then(() => {
//       this.initHeight = !this.initHeight
//     })
//   })
// }, 200)
