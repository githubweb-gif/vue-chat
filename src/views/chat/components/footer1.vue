<template>
  <footer ref="footer">
    <div ref="event" class="event">
      <div class="iconfont icon-yuyin" />
      <div class="msg">
        <el-input
          ref="text"
          v-model="message"
          :autosize="{ minRows: 1, maxRows: 5 }"
          type="textarea"
          @input="inputMsg"
          @focus="initHeight"
        />
      </div>
      <div class="iconfont icon-biaoqing-xue" @click.stop="show('emoji')" />
      <div
        v-if="message === ''"
        class="icon el-icon-circle-plus-outline"
        @click.stop="show('other')"
      />
      <div v-if="message !== '' ? true : false" ref="send" class="send">
        <p>发送</p>
      </div>
    </div>
    <div ref="component" class="components">
      <component :is="currentTabComponent" class="features" @emojis="emoji" />
    </div>
    <!-- 功能区 -->
  </footer>
</template>

<script>
// import { getInfo } from '@/api/user'
import other from './other.vue'
import emoji from './emoji.vue'
export default {
  components: {
    other,
    emoji
  },
  props: {
    init: {
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
  watch: {
    init(value) {
      this.initHeight()
    },
    message(value) {
      if (value.trim() === '') {
        this.currentTabComponent = ''
        return
      }
      // if (this.currentTabComponent) {
      //   this.$nextTick(() => {
      //     const b = this.$refs.component.offsetHeight
      //     const a = this.$refs.event.offsetHeight
      //     this.$refs.footer.style.height = a + b + 'px'
      //   })
      // }
    }
  },
  mounted() {
    this.initHeight()
  },
  methods: {
    show(value) {
      this.$nextTick(() => {
        const b = this.$refs.component.offsetHeight
        const a = this.$refs.event.offsetHeight
        if (this.currentTabComponent === value) {
          this.currentTabComponent = ''
        } else {
          this.currentTabComponent = value
        }
        if (this.currentTabComponent) {
          this.$refs.footer.style.height = a + b + 'px'
        } else {
          this.$refs.footer.style.height = a + 'px'
        }
        this.$emit('IntoView', { a, b })
      })
    },
    inputMsg(value) {
      this.$nextTick(() => {
        const a = this.$refs.event.offsetHeight
        this.$refs.footer.style.height = a + 'px'
      })
    },
    emoji(value) {
      this.message += value
    },
    // footer没有底部组件高度
    initHeight() {
      this.$nextTick(() => {
        this.currentTabComponent = ''
        const a = this.$refs.event.offsetHeight
        this.$refs.footer.style.height = a + 'px'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  transition: all 0.3s;
  width: 100%;
  background-color: #f4f4f4;
  overflow: hidden;
  position: relative;
  //  box-shadow: 0px -2px 1px -1px #d1d8d8;
  .event {
    background-color: #f4f4f4;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 4px 16px;
    position: relative;
    .msg {
      flex: 1;
      padding-right: 10px;
      .el-input {
        caret-color: #08af0b;
      }
    }
    .iconfont {
      padding-right: 10px;
    }
    .iconfont,
    .icon {
      height: 100%;
      font-size: 29px;
      line-height: 100%;
    }
    .send {
      background-color: #24c222;
      border-radius: 6px;
      transition: width 0.3s;
      box-sizing: border-box;
      overflow: hidden;
      p {
        padding: 3px 10px;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  .components {
    height: 200px;
    .features {
      height: 200px;
      overflow: hidden;
    }
  }
}
</style>
