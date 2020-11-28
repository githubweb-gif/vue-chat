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
      <div class="close">
        <svg-icon icon-id="backspace" @click="pop" />
      </div>
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
  background-color: #f4f4f4;
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
    .close{
      position: absolute;
      bottom: 20px;
      right: 0.6rem;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ffffff;
      border-radius: 0.133rem;
      .svg-icon {
        height: 0.7rem;
      }
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
