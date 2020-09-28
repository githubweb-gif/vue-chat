export function debounce(fn, delay) {
  const time = delay || 500
  let timer = null
  return function() {
    const th = this // 获取vue组件this
    var args = arguments // 传入参数时需要用到arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function() {
      timer = null
      fn.apply(th, args) // 改变fn中的this为vue组件中的this
    }, time)
  }
}
