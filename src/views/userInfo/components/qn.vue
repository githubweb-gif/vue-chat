<template>
  <div class="qn">
    <div class="header">
      <van-icon class="link" name="arrow-left" @click="closeBox" />
      <div class="ok" @click="ok">完成</div>
    </div>
    <div class="content">
      <van-field v-model="content" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    qnContent: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      content: '',
      title: ''
    }
  },
  watch: {
    qnContent: {
      immediate: true, // 很重要！！！
      handler(val) {
        this.content = !val ? '' : val.value
        this.title = !val ? '' : val.title
      }
    }
  },
  methods: {
    closeBox() {
      this.$emit('close', true)
    },
    ok() {
      this.$emit('modify', { title: this.title, content: this.content })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/header.scss';
.qn {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
}
.header {
    position: relative !important;
    .link {
    font-size: 0.64rem;
    font-weight: 600;
  }
  .ok {
    padding: 0.133333rem 0.32rem;
    background-color: #24b410;
    border-radius: 0.106667rem;
    color: #ffff;
  }
}
.van-field {
  border-bottom: 0.026667rem solid #b7b7b7;
}
.content {
  padding: 0 16px;
}

</style>
