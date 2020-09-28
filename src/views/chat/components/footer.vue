<template>
  <div class="box">
    <footer :style="{height: changeHeight}">
      <div ref="event" class="event">
        <div class="iconfont icon-yuyin" @click.stop="show('sound')" />
        <div class="msg">
          <el-input
            ref="text"
            v-model="message"
            :autosize="{ minRows: 1, maxRows: 5}"
            type="textarea"
            @input="inputMsg"
          />
        </div>
        <div class="iconfont icon-biaoqing-xue" @click.stop="show('emoji')" />
        <div v-if="message===''" class="icon el-icon-circle-plus-outline" @click.stop="show('other')" />
        <div v-if="message!==''?true:false" ref="send" class="send">
          <p>发送</p>
        </div>
      </div>
      <component :is="currentTabComponent" ref="height" class="features" @emojis="emoji" />
      <!-- 功能区 -->
    </footer>
  </div>
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
    changeHeight: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      message: '',
      currentTabComponent: ''
    }
  },
  computed: {},
  watch: {
    // message() {
    //   this.initHeight()
    // }
  },
  mounted() {
    this.initHeight()
  },
  methods: {
    show(value) {
      this.currentTabComponent = value
      this.$nextTick(() => {
        const b = this.$refs.height.$el.offsetHeight
        const a = this.$refs.event.offsetHeight
        this.$emit('IntoView', { a, b })
      })
    },
    initHeight() {
      this.$nextTick(() => {
        const a = this.$refs.event.offsetHeight
        this.$emit('height', a)
      })
    },
    inputMsg() {
    },
    emoji(value) {
      this.message += value
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  transition: height 0.3s;
  box-sizing: border-box;
  background-color: #f4f4f4;
  overflow: hidden;
  //  box-shadow: 0px -2px 1px -1px #d1d8d8;
  .event {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 16px;
    position: relative;
    overflow: hidden;
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
      font-size: 29px;
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
}
// .fade-enter-active,
// .fade-leave-active {
//   transition: all 0.2s;
// }
// .fade-enter {
//   opacity: 0;
// }
// .fade-leave-active {
//  opacity: 1;
// }
</style>
