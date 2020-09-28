// import proxy from 'http-proxy-middleware'
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  // devServer: {
  //   proxy: {
  //     '/login': {
  //       target: 'http://localhost:3000',
  //       secure: false,
  //       changeOrigin: true
  //     }
  //   }
  // },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
