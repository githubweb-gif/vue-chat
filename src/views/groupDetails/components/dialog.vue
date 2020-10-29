<template>
  <div v-if="bol" class="dialog">
    <div class="header">
      <span class="link el-icon-arrow-left" @click="closeBox" />
      <div class="ok" @click="ok">完成</div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    qnContent: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      bol: this.qnContent
    }
  },
  computed: {
    GroupID() {
      return this.$route.query.id
    }
  },
  watch: {
    qnContent() {
      this.bol = true
    }
  },
  created() {
  },
  methods: {
    closeBox() {
      this.bol = false
    },
    ok() {
      this.bol = false
      this.$emit('accomplish', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/header.scss';
.dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background-color: #ffff;
}
.header {
    position: relative !important;
    padding: 0 16px;
    background-color: #ffff;
    margin-bottom: 20px;
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
.van-cell-group {
    padding: 0 16px;
    .van-cell {
        border-radius: 5%;
    background-color: #f3f4f6;
    }
}

</style>
