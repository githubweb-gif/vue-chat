<template>
  <div id="app">
    <!-- <transition v-if="$route.meta.keepAlive" :name="transitionName">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" class="box" />
      </keep-alive>
    </transition> -->
    <transition :name="transitionName">
      <router-view class="box" />
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      transitionName: ''
    }
  },
  watch: {
    // 使用watch 监听$router的变化
    $route(to, from) {
      console.log(this.$route.meta.keepAlive)
      // 如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index) {
        // 设置动画名称
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  position: relative;
}
.box {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.5s;
  position: absolute;
  top: 0;
  left: 0;
}
.slide-right-enter {
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  transform: translate3d(-100%, 0, 0);
}
</style>
