<template>
  <div class="other">
    <!-- 功能区 -->
    <div class="more">
      <div class="index">
        <div class="iconfont icon-image" />
        <div class="name">照片</div>
      </div>
      <div class="index">
        <div class="iconfont icon-xiangji" />
        <div class="name">拍摄</div>
      </div>
      <div class="index">
        <div class="iconfont icon-weizhi1" />
        <div class="name">位置</div>
      </div>
      <div class="index">
        <div class="iconfont icon-shipin" />
        <div class="name">视频</div>
      </div>
    </div>
    <div class="last">
      <div class="index">
        <div class="iconfont icon-ziyuan1" />
        <div class="name">文件</div>
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
  watch: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.other {
  border-top: 1px solid #d6d6d6;
  padding: 0 16px;
}
.more,
.last {
  display: flex;
  padding: 0 25px 0;
  justify-content: space-between;
  .index {
    position: relative;
    .iconfont {
      background-color: #ffffff;
      font-size: 35px;
      padding: 10px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }
    .name {
      text-align: center;
      font-size: 12px;
    }
  }
}
.more {
  padding-top: 15px;
  margin-bottom: 10px;
}
.last {
  padding-bottom: 10px;
}
</style>
