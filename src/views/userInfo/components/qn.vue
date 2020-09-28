<template>
  <div class="box">
    <header>
      <span class="link el-icon-arrow-left" @click="closeBox" />
      <div class="ok" @click="ok">完成</div>
    </header>
    <el-form>
      <el-form-item>
        <el-input v-model="content" />
      </el-form-item>
    </el-form>
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
.box {
    padding: 0 16px;
    box-sizing: border-box;
}
header {
    position: relative !important;
     padding: 0;
    .link {
    font-size: 24px;
    font-weight: 600;
  }
  .ok {
    padding: 5px 12px;
    background-color: #24b410;
    border-radius: 4px;
    color: #ffff;
  }
}

</style>
