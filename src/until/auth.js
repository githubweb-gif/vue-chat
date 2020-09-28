const key = 'chat'

export function setToken(token) {
  window.sessionStorage.setItem(key, token)
}

export function getToken(token) {
  return window.sessionStorage.getItem(key)
}

export function removeToken(token) {
  window.sessionStorage.removeItem(key)
}

export function setID(id) {
  window.sessionStorage.setItem('uid', id)
}

export function getID(token) {
  return window.sessionStorage.getItem('uid')
}

export function reomveID(token) {
  return window.sessionStorage.removeItem('uid')
}
