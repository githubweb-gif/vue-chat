import Vue from 'vue'
import svgIcon from '@/components/svg-icon/index.vue'

Vue.component('svg-icon', svgIcon)

const req = require.context('./svg', false, /\.svg$/)

function requireAll(req) {
  return req.keys().map(req)
}

requireAll(req)
