import { validUser } from '@/api/user'
// 用户名
export function validName(value) {
  return new Promise((resolve, reject) => {
    validUser({ data: value })
      .then((res) => {
        const { message } = res
        resolve(message)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 邮箱
export function validEmail(value) {
  return new Promise((resolve, reject) => {
    validUser({ data: value })
      .then((res) => {
        const { message } = res
        resolve(message)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 密码
// export function validPwd(value) {
//   const email = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
//   return email.test(value)
// }
