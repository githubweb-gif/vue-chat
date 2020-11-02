import { getToken, setToken, getID, setID, removeToken, reomveID } from '@/until/auth'
import { login, getInfo, logout, registered } from '@/api/user'
const state = {
  name: 'chat',
  id: getID(),
  avatar: '',
  intr: '',
  sex: '',
  date: '',
  email: '',
  phone: '',
  token: getToken(),
  birth: '',
  otherTypes: null,
  GroupID: ''
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_ID(state, id) {
    state.id = id
  },
  // 介绍
  SET_INTRODUCTION: (state, introduction) => {
    state.intr = introduction
  },
  // 姓名
  SET_NAME: (state, name) => {
    state.name = name
  },
  // 性别
  SET_SEX: (state, sex) => {
    state.sex = sex
  },
  // 头像
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 注册时间
  SET_DATE: (state, date) => {
    state.date = date
  },
  // 邮箱
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  // 电话
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  // 生日
  SET_BIRTH: (state, birth) => {
    state.birth = birth
  },
  // 接受其他类型聊天数据
  ACCEPT_DATA: (state, data) => {
    state.otherTypes = data
  },
  // 接受用户登录到那个群
  GROUP_ID: (state, data) => {
    state.GroupID = data
  }
}

const actions = {
  // 登录
  login({ commit }, data) {
    const { name, password } = data
    return new Promise((resolve, reject) => {
      login({ name: name.trim(), password: password })
        .then((res) => {
          commit('SET_TOKEN', res.token)
          commit('SET_ID', res.data._id)
          setToken(res.token)
          setID(res.data._id)
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // get user info
  // 不要传入id，直接传入token，这样比较安全
  // 记得修改
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.id)
        .then((res) => {
          const { data } = res
          if (!data) {
            reject(new Error('验证失败，请重新登录。'))
          }
          const { name, avatar, intr, sex, date, email, phone, birth } = data
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', intr)
          commit('SET_SEX', sex)
          commit('SET_DATE', date)
          commit('SET_EMAIL', email)
          commit('SET_PHONE', phone)
          commit('SET_BIRTH', birth)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.id)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ID', '')
          removeToken()
          reomveID()
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ID', '')
      removeToken()
      reomveID()
      resolve()
    })
  },
  // 注册
  registered({ commit }, data) {
    return new Promise((resolve, reject) => {
      registered(data)
        .then((res) => {
          const { message } = res
          resolve(message)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
