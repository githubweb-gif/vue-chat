import Vue from 'vue'
// 日期
Vue.filter('dateFormat', function(time) {
  const nowDate = new Date(time)
  const newDate = new Date()

  const oldy = nowDate.getFullYear()
  let oldm = nowDate.getMonth()
  const oldd = nowDate.getDate()
  let oldh = nowDate.getHours()
  let oldmi = nowDate.getMinutes()

  const y = newDate.getFullYear()
  const m = newDate.getMonth()
  const d = newDate.getDate()

  if (oldy === y && oldm === m && oldd === d) {
    // 当天
    if (oldh < 10) {
      oldh = '0' + oldh
    }
    if (oldmi < 10) {
      oldmi = '0' + oldmi
    }
    return `${oldh}:${oldmi}`
  } else if (oldy === y && oldm === m && oldd - d === 1) {
    // 前天
    if (oldh < 10) {
      oldh = '0' + oldh
    }
    if (oldmi < 10) {
      oldmi = '0' + oldmi
    }
    return `前天 ${oldh}:${oldmi}`
  } else {
    // 历史信息
    oldm = oldm + 1
    return `${oldy}/${oldm}/${oldd}`
  }
})

// 头像
Vue.filter('avatar', function(value) {
  if (value && value.indexOf('http') !== -1) {
    return value
  }
  if (process.env.NODE_ENV === 'production') {
    // 你上线的后端url
    return `https://chat.putao.work/${value}`
  }
  return `http://localhost:3000/${value}`
})

// 聊天日期
Vue.filter('chatDate', function(now) {
  if (now === '') {
    return ''
  }
  const nowDate = new Date(now)
  const newDate = new Date()

  const oldy = nowDate.getFullYear()
  let oldm = nowDate.getMonth()
  const oldd = nowDate.getDate()
  let oldh = nowDate.getHours()
  let oldmi = nowDate.getMinutes()

  const y = newDate.getFullYear()
  const m = newDate.getMonth()
  const d = newDate.getDate()

  if (oldy === y && oldm === m && oldd === d) {
    // 当天
    if (oldh < 10) {
      oldh = '0' + oldh
    }
    if (oldmi < 10) {
      oldmi = '0' + oldmi
    }
    return `${oldh}:${oldmi}`
  } else if (oldy === y && oldm === m && d - oldd === 1) {
    // 昨天
    if (oldh < 10) {
      oldh = '0' + oldh
    }
    if (oldmi < 10) {
      oldmi = '0' + oldmi
    }
    return `昨天 ${oldh}:${oldmi}`
  } else if (oldy === y && oldm === m && d - oldd > 1) {
    // 本年内消息
    oldm = oldm + 1
    if (oldh < 10) {
      oldh = '0' + oldh
    }
    if (oldmi < 10) {
      oldmi = '0' + oldmi
    }
    return `${oldm}月${oldd}日 ${oldh}:${oldmi}`
  } else {
    // 历史信息
    oldm = oldm + 1
    return `${oldy}年${oldm}月${oldd}日 ${oldh}:${oldmi}`
  }
})
