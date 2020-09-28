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
            @blur="unfold=true"
            @focus="unfold=false"
          />
        </div>
        <div class="iconfont icon-biaoqing-xue" @click.stop="show('icon')" />
        <div class="icon el-icon-circle-plus-outline" @click.stop="show('other')" />
      </div>
      <!-- 功能区 -->
      <div v-if="unfold" ref="height" class="features">
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
    </footer>
  </div>
</template>

<script>
// import { getInfo } from '@/api/user'
export default {
  props: {
    changeHeight: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      message: '',
      unfold: false
    }
  },
  watch: {
    message() {
      if (!this.unfold) {
        const a = this.$refs.event.offsetHeight
        this.$emit('IntoView', { a, b: 0 })
      }
    }
  },
  mounted() {
    this.initHeight()
  },
  methods: {
    show() {
      const b = this.$refs.height.offsetHeight
      const a = this.$refs.event.offsetHeight
      this.$emit('IntoView', { a, b })
    },
    initHeight() {
      this.$nextTick(() => {
        const a = this.$refs.event.offsetHeight
        this.$emit('height', a)
      })
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
    padding: 4px 16px;
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
}
</style>
