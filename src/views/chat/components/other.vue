<template>
  <div class="other">
    <!-- 功能区 -->
    <div class="more">
      <van-uploader :after-read="afterRead">
        <div class="index">
          <div class="iconfont icon-image" />
          <div class="name">相册</div>
        </div>
      </van-uploader>
      <!-- <div class="index">
        <div class="iconfont icon-ziyuan1" />
        <div class="name">文件</div>
      </div> -->
      <div class="index" @click="getMap">
        <div class="iconfont icon-weizhi1" />
        <div class="name">位置</div>
      </div>
    </div>
    <div class="last">
      <div class="index">
        <!-- <div class="iconfont icon-xiangji" />
        <div class="name">拍摄</div> -->
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
import { sendMessage, sendGroupMsg } from '@/api/user'
import vueAmap from './map'
export default {
  components: {
    vueAmap
  },
  data() {
    return {
      mapShow: false,
      componentShow: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    oneSelf() {
      return this.$store.getters.userInfo
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
      const imgUrl = file.content
      if (this.$route.path === '/chat') {
        const data = { types: 1, message: imgUrl, userID: this
          .oneSelf.id, friendID: this.id }
        sendMessage(data).then((res) => {
          const { data: { data, user }} = res
          data.userID = user
          this.$store.commit('ACCEPT_DATA', data)
          this.socket.emit('msg', { fromID: this
            .oneSelf.id, toID: this.id, msg: data })
        }).catch(() => {
          this.$router.push('/')
        })
      } else if (this.$route.path === '/groupChat') {
        const data = { types: 1, message: imgUrl, userID: this
          .oneSelf.id, GroupID: this.id }
        sendGroupMsg(data).then((res) => {
          this.$store.commit('ACCEPT_DATA', res.data)
          this.socket.emit('groupMsg', { GroupID: this.id, msg: res.data })
        }).catch(() => {
          this.$router.push('/')
        })
      }
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
      this.componentShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.other {
  border-top: 0.023rem solid #d6d6d6;
  padding: 0 0.43rem;
}
.more,
.last {
  display: flex;
  padding: 0 0.67rem 0;
  .index {
    position: relative;
    margin-right: 0.533333rem;
    .iconfont {
      background-color: #ffffff;
      font-size: 0.9rem;
      padding: 0.266667rem;
      border-radius: 0.266667rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.11rem;
    }
    .name {
      text-align: center;
      font-size: 0.32rem;
    }
  }
}
.more {
  padding-top: 0.4rem;
  margin-bottom: 0.27rem;
}
.last {
  padding-bottom: 0.27rem;
}
.sendButton {
background-color: #ffffff;
position: fixed;
z-index: 2000;
width: 100%;
left: 0;
right: 0;
transition: all 0.3s;
font-size: 0.5rem;
div {
  width: 100%;
  text-align: center;
  padding: 0.4rem 0;
}
.send {
  border-bottom: 0.027rem solid #d6d6d6;
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
