<template>
  <div class="emoji">
    <header>
      <div class="iconfont icon-biaoqing-xue" />
    </header>
    <div class="data">
      <div class="title">所有表情</div>
      <div class="list">
        <span
          v-for="(item, index) in email"
          :key="index"
          class="icon"
          @click.stop="copy"
        >{{ item }}</span>
      </div>
      <div class="el-icon-close close" @click="pop" />
    </div>
  </div>
</template>

<script>
// import { getInfo } from '@/api/user'
export default {
  data() {
    return {}
  },
  computed: {
    email() {
      return [
        '😀',
        '😃',
        '😄',
        '😁',
        '😆',
        '😅',
        '🤣',
        '😂',
        '🙂',
        '🙃',
        '😉',
        '😊',
        '😇',
        '🥰',
        '😍',
        '🤩',
        '😘',
        '😗',
        '😚',
        '😙',
        '😋',
        '😛',
        '😜',
        '🤪',
        '😝',
        '🤑',
        '🤗',
        '🤭',
        '🤫',
        '🤔',
        '🤐',
        '🤨',
        '😐',
        '😑',
        '😶',
        '😏',
        '😒',
        '🙄',
        '😬',
        '🤥',
        '😌',
        '😔',
        '😪',
        '🤤',
        '😴',
        '😷',
        '🤒',
        '🤕',
        '🤢',
        '🤮',
        '🤧',
        '🥵',
        '🥶',
        '🥴',
        '😵',
        '🤯',
        '❤️',
        '🧡',
        '💔',
        '🤍',
        '💯',
        '💢',
        '💥',
        '💫',
        '💦',
        '💨',
        '🕳️',
        '💣',
        '💬',
        '👁️‍🗨️',
        '🗨️',
        '🗯️',
        '💭',
        '💤'
      ]
    }
  },
  watch: {},
  mounted() {},
  methods: {
    copy(e) {
      this.$emit('emojis', e.target.innerHTML)
    },
    pop() {
      this.$emit('emojis', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.emoji {
  header {
    padding: 0 16px;
    .iconfont {
      font-size: 29px;
    }
    border-bottom: 1px solid #c3c3c3;
  }
  .data {
    padding: 0 16px;
    position: relative;
    .title {
      font-size: 16px;
      padding: 10px 0;
    }
    .close {
      position: absolute;
      bottom: 0px;
      right: 16px;
      font-size: 25px;
      width: 80px;
      height: 30px;
      line-height: 30px;
      background-color: #7d837d;
    }
    .list {
      height: 120px;
      font-size: 22px;
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding-bottom: 15px;
      span {
        display: flex;
        align-items: center;
        padding: 0 6px;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
