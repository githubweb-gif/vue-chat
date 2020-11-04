<template>
  <footer>
    <div class="input">
      <div class="iconfont icon-yuyin" />
      <div class="msg">
        <el-input
          ref="text"
          v-model="message"
          :autosize="{ minRows: 1, maxRows: 5 }"
          type="textarea"
          @input="scroll"
          @focus="scroll"
        />
      </div>
      <div class="iconfont icon-biaoqing-xue" @click.stop="show('emoji')" />
      <div
        v-if="message === ''"
        class="icon el-icon-circle-plus-outline"
        @click.stop="show('other')"
      />
      <div v-if="message !== '' ? true : false" class="send" @click="sendMsg">
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
import { sendMessage, sendGroupMsg } from '@/api/user'
import other from './other.vue'
import emoji from './emoji.vue'
export default {
  components: {
    other,
    emoji
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
      currentTabComponent: ''
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
      console.log(this.$route.path)
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
        this.sendOneMsg()
      } else if (this.route === '/groupChat') {
        this.sendGroupMsg()
      }
    },
    // 发送一对一消息
    sendOneMsg() {
      const data = { types: 0, message: this.message, userID: this
        .oneSelf.id, friendID: this.id }
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
        console.log(res)
        this.$emit('addMsg', res.data)
        this.socket.emit('groupMsg', { GroupID: this.id, msg: res.data })
      }).catch(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  border-top: 0.03rem solid #d6d6d6;
  .input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.08rem 0.43rem;
    .msg {
      flex: 1;
      padding: 0 0.27rem;
      display: flex;
      align-items: center;
    }
    .iconfont,
    .icon {
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
