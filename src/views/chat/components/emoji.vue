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
    padding: 0 0.43rem;
    .iconfont {
      font-size: 0.8rem;
    }
    border-bottom: 0.03rem solid #c3c3c3;
  }
  .data {
    padding: 0 0.43rem;
    position: relative;
    .title {
      font-size: 0.43rem;
      padding: 0.27rem 0;
    }
    .close {
      position: absolute;
      bottom: 0px;
      right: 0.43rem;
      font-size: 0.67rem;
      width: 2.1rem;
      height: 0.8rem;
      line-height: 0.8rem;
      background-color: #7d837d;
    }
    .list {
      height: 3.2rem;
      font-size: 0.59rem;
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding-bottom: 0.4rem;
      span {
        display: flex;
        align-items: center;
        padding: 0 0.16rem;
        margin-bottom: 0.4rem;
      }
    }
  }
}
</style>
