<template>
  <footer>
    <div class="input">
      <svg-icon :icon-id="icon" @click="changeAutio" />
      <div class="msg">
        <div v-if="icon==='yuyin'" class="sound" @touchend="cancelSound" @touchstart="sound">长按说话</div>
        <audio-vue v-show="isAudio" :is-audio="isAudio" @recorder="getRecorder" />
        <text-input
          ref="input"
          v-model="message"
          :autosize="{ minRows: 1, maxRows: 5 }"
          @input="scroll"
          @focus="scroll"
        />
      </div>
      <van-icon name="smile-o" @click.stop="show('emoji')" />
      <van-icon v-if="message.trim() === ''" class="icon" name="add-o" @click.stop="show('other')" />
      <div v-if="message.trim() !== '' ? true : false" class="send" @click="sendMsg">
        <p>发送</p>
      </div>
    </div>
    <!-- 功能区 -->
    <div class="components">
      <component
        :is="currentTabComponent"
        ref="components"
        class="features"
        @emojis="emoji"
      />
    </div>
  </footer>
</template>

<script>
import { sendMessage, sendGroupMsg, uploadAudio } from '@/api/user'
import audioVue from './audio'
import textInput from '@/components/input/input.vue'
import other from './other.vue'
import emoji from './emoji.vue'
export default {
  components: {
    other,
    emoji,
    textInput,
    audioVue
  },
  props: {
    isComponet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      message: '',
      currentTabComponent: '',
      icon: 'jianpan',
      isAudio: false,
      WAVBlob: '',
      isSend: false
    }
  },
  computed: {
    componentHeight() {
      if (this.currentTabComponent === '') {
        return 0
      }
      const b = this.$refs.components.$el.offsetHeight
      return b
    },
    id() {
      return this.$route.query.id
    },
    oneSelf() {
      return this.$store.getters.userInfo
    },
    route() {
      return this.$route.path
    }
  },
  watch: {
    currentTabComponent(value) {
      if (value === '' && value) {
        this.$emit('IntoView', this.componentHeight)
      }
    },
    isComponet() {
      this.currentTabComponent = ''
    },
    route() {
      this.message = ''
    }
  },
  methods: {
    show(value) {
      if (
        this.currentTabComponent !== '' &&
        this.currentTabComponent === value
      ) {
        this.currentTabComponent = ''
        return
      }
      this.currentTabComponent = value
      this.$nextTick(() => {
        this.$emit('IntoView', this.componentHeight)
      })
    },
    emoji(value) {
      if (value) {
        this.message += value
        console.log(this.message)
      } else {
        const index = this.message.length
        const num = this.message.substring(index - 2, index).search(/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/i) === -1 ? 1 : 2
        this.message = this.message.substring(0, index - num)
      }
    },
    scroll() {
      this.currentTabComponent = ''
      this.$emit('IntoView', this.componentHeight)
    },
    // 发送一对一消息或群消息
    sendMsg() {
      if (this.route === '/chat') {
        const data = { types: 0, message: this.message, userID: this
          .oneSelf.id, friendID: this.id }
        this.sendOneMsg(data)
      } else if (this.route === '/groupChat') {
        this.sendGroupMsg()
      }
    },
    // 发送一对一消息
    sendOneMsg(data) {
      sendMessage(data).then((res) => {
        const a = res.data.data
        a.userID = res.data.user
        this.$emit('addMsg', a)
        this.socket.emit('msg', { fromID: this.oneSelf.id, toID: this.id, msg: this.message })
      })
    },
    // 发送群消息
    sendGroupMsg() {
      // GroupID, userID, message, types
      const data = { types: 0, message: this.message, GroupID: this.id, userID: this.oneSelf.id }
      sendGroupMsg(data).then((res) => {
        this.$emit('addMsg', res.data)
        this.socket.emit('groupMsg', { GroupID: this.id, msg: res.data })
      }).catch(() => {
        this.$router.push('/')
      })
    },
    changeHeight() {
      const hh = this.$refs.textarea
      hh.style.posHeight = hh.scrollHeight + 'px'
    },
    // 切换语音
    changeAutio() {
      if (this.icon === 'yuyin') {
        this.icon = 'jianpan'
        this.$refs.input.$el.querySelector('textarea').focus()
      } else if (this.icon === 'jianpan') {
        this.icon = 'yuyin'
      }
    },
    // 长按录音
    sound() {
      this.isAudio = true
    },
    // 结束录音
    cancelSound() {
      this.isAudio = false
    },
    // 获取录音文件
    getRecorder(value) {
      if (value.audio) {
        this.WAVBlob = value.audio
        const time = value.time
        const formData = new FormData()
        formData.append('user', this.WAVBlob)
        // 上传文件
        uploadAudio(formData).then((res) => {
          const data = { types: 2, message: res.audio, userID: this
            .oneSelf.id, duration: time }
          if (this.$route.path === '/chat') {
            data.friendID = this.id
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
            data.GroupID = this.id
            sendGroupMsg(data).then((res) => {
              this.$store.commit('ACCEPT_DATA', res.data)
              this.socket.emit('groupMsg', { GroupID: this.id, msg: res.data })
            }).catch(() => {
              this.$router.push('/')
            })
          }
        })
      } else {
        this.$notify({
          type: 'primary',
          message: '时间太短'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  border-top: 0.03rem solid #d6d6d6;
  .svg-icon {
    width: 0.8rem;
    height: 0.8rem;
  }
  .input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.08rem 0.43rem;
    .textarea {
      flex: 1;
      font-size: 0.373333rem;
    }
    .msg {
      flex: 1;
      padding: 0 0.27rem;
      display: flex;
      align-items: center;
      position: relative;
      .sound {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        font-size: 0.48rem;
        background-color: #ffffff;
        border: 1px solid #d4d3d3;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .iconfont,
    .icon,
    .van-icon {
      font-size: 0.8rem;
    }
    .icon {
      padding-left: 10px;
    }
    .send {
      background-color: #37d237;
      border-radius: 0.14rem;
      padding: 0.08rem 0.27rem;
      font-size: 0.426667rem;
    }
  }
}
</style>
