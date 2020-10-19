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
import { sendMessage } from '@/api/user'
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
  mounted() {},
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
      this.$nextTick(() => {
        this.$emit('IntoView', this.componentHeight)
      })
    },
    sendMsg() {
      // this.$emit('addMsg', { types: 0, message: this.message })
      sendMessage({ types: 0, message: this.message, uid: this.oneSelf.id, friendID: this.id }).then(() => {
        this.$emit('addMsg', true)
      })
      this.$nextTick(() => {
        this.$emit('IntoView', this.componentHeight)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  border-top: 1px solid #d6d6d6;
  .input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 16px;
    .msg {
      flex: 1;
      padding: 0 10px;
    }
    .iconfont,
    .icon {
      font-size: 1.8rem;
    }
    .icon {
      padding-left: 10px;
    }
    .send {
      background-color: #37d237;
      border-radius: 5px;
      padding: 3px 10px;
    }
  }
}
</style>
