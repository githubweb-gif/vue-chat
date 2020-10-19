<template>
  <div class="other">
    <!-- 功能区 -->
    <div class="more">
      <van-uploader :after-read="afterRead">
        <div class="index">
          <div class="iconfont icon-image" />
          <div class="name">照片</div>
        </div>
      </van-uploader>
      <div class="index">
        <div class="iconfont icon-xiangji" />
        <div class="name">拍摄</div>
      </div>
      <div class="index" @click="getMap">
        <div class="iconfont icon-weizhi1" />
        <div class="name">位置</div>
      </div>
      <div class="index">
        <div class="iconfont icon-shipin" />
        <div class="name">视频</div>
      </div>
    </div>
    <div class="last">
      <div class="index">
        <div class="iconfont icon-ziyuan1" />
        <div class="name">文件</div>
      </div>
    </div>
    <div ref="sendButton" class="sendButton">
      <div class="send" @click="goMap">发送位置</div>
      <div @click="mapShow = false">取消</div>
    </div>
    <div v-show="mapShow" class="shadowBox" @click="mapShow = false" />
    <div v-if="componentShow" class="components">
      <vue-amap @showComponent="show" />
    </div>
  </div>
</template>

<script>
// import { getInfo } from '@/api/user'
import { Uploader } from 'vant'
import vueAmap from './map'
export default {
  components: {
    vanUploader: Uploader,
    vueAmap
  },
  data() {
    return {
      mapShow: false,
      componentShow: false
    }
  },
  watch: {
    mapShow(value) {
      if (!value) {
        this.$refs.sendButton.style.bottom = `-${this.$refs.sendButton.offsetHeight}px`
      }
    }
  },
  mounted() {
    this.$refs.sendButton.style.bottom = `-${this.$refs.sendButton.offsetHeight}px`
  },
  methods: {
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file)
      const data = {
        message: file.content,
        types: 1
      }
      // 用store不合理
      this.$store.commit('ACCEPT_DATA', data)
    },
    getMap() {
      this.$refs.sendButton.style.bottom = 0
      this.mapShow = true
    },
    goMap() {
      this.componentShow = true
      this.mapShow = false
    },
    show(value) {
      console.log(value)
      this.componentShow = value
    }
  }
}
</script>

<style lang="scss" scoped>
.other {
  border-top: 1px solid #d6d6d6;
  padding: 0 16px;
}
.more,
.last {
  display: flex;
  padding: 0 25px 0;
  justify-content: space-between;
  .index {
    position: relative;
    .iconfont {
      background-color: #ffffff;
      font-size: 35px;
      padding: 10px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }
    .name {
      text-align: center;
      font-size: 12px;
    }
  }
}
.more {
  padding-top: 15px;
  margin-bottom: 10px;
}
.last {
  padding-bottom: 10px;
}
.sendButton {
background-color: #ffffff;
position: fixed;
z-index: 2000;
width: 100%;
left: 0;
right: 0;
transition: all 0.3s;
div {
  width: 100%;
  text-align: center;
  padding: 15px 0;
}
.send {
  border-bottom: 1px solid #d6d6d6;
}
}
.shadowBox {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: #080808;
  opacity: 0.5;
}
</style>
