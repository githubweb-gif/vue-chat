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

// 阅读消息，清空tip
export function clearTip(data) {
  return request({
    url: '/user/clearTip',
    method: 'put',
    data
  })
}

// 获取全部好友
export function getAllFriend(data) {
  return request({
    url: '/user/getAllFriend',
    method: 'get',
    params: data
  })
}

// 创建群
export function setGroup(data) {
  return request({
    url: '/user/Group',
    method: 'post',
    data
  })
}

// 获取群
export function getGroup(data) {
  return request({
    url: '/user/Group',
    method: 'get',
    params: data
  })
}

// 修改群信息
export function putGroup(data) {
  return request({
    url: '/user/Group',
    method: 'put',
    data
  })
}

// 获取全部群
export function getAllGroup(data) {
  return request({
    url: '/user/getAllGroup',
    method: 'get',
    params: data
  })
}

// 获取群消息
export function getGroupMsg(data) {
  return request({
    url: '/user/GroupMessage',
    method: 'get',
    params: data
  })
}

// 发送群消息
export function sendGroupMsg(data) {
  return request({
    url: '/user/GroupMessage',
    method: 'post',
    data
  })
}

// 获取群成员
export function getGroupPepole(data) {
  return request({
    url: '/user/GroupPepole',
    method: 'get',
    params: data
  })
}

// 获取群内个人信息
export function getGroupPepoleInfo(data) {
  return request({
    url: '/user/getGroupPepoleInfo',
    method: 'get',
    params: data
  })
}

// 修改群内个人信息
export function putGroupPepoleInfo(data) {
  return request({
    url: '/user/getGroupPepoleInfo',
    method: 'put',
    data
  })
}
