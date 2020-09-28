<template>
  <div class="emoji">
    <header>
      <div class="iconfont icon-biaoqing-xue" />
    </header>
    <div class="data">
      <div class="title">所有表情</div>
      <div class="list">
        <span v-for=" (item,index) in email" :key="index" class="icon" @click.stop="copy">{{ item }}</span>
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
  watch: {},
  mounted() {},
  methods: {
    copy(e) {
      this.$emit('emojis', e.target.innerHTML)
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
    .title {
      font-size: 16px;
      padding: 10px 0;
    }
    .list {
      height: 120px;
      font-size: 22px;
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
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
