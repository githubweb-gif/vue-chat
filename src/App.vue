<template>
  <div id="app">
    <transition v-if="$route.meta.keepAlive" :name="transitionName">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" class="box" />
      </keep-alive>
    </transition>
    <transition v-else :name="transitionName">
      <router-view class="box" />
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      transitionName: '',
      n: 0
    }
  },
  computed: {
    id() {
      return this.$store.getters.userInfo.id
    },
    GroupID() {
      return this.$store.state.user.GroupID
    }
  },
  watch: {
    // 使用watch 监听$router的变化
    $route(to, from) {
      console.log(this.$route.path)
      // 判断用户离开群聊房间
      if (from.path === '/groupChat') {
        this.socket.emit('leaveToRoom', this.GroupID)
      }
      // 页面刷新时，重新登录socket
      // n是用来判断页面更新
      if (this.id && this.id !== '' && this.n === 0) {
        this.join()
      }
      if (to.meta.index === from.meta.index) {
        this.transitionName = ''
        return
      }
      // 如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index) {
        // 设置动画名称
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
    },
    id(value) {
      if (value && value !== '') {
        this.join()
      }
    }
  },
  methods: {
    // socket登录
    join() {
      this.n++
      this.socket.emit('login', this.id)
      this.acceptMessage()
    },
    // socket如果多次执行，例如从home和其它页面多次切换，会导致多次监听
    // 所以acceptMessage写在app页
    acceptMessage() {
      this.socket.on('msg', (data) => {
        this.$store.commit('ONE_BY_ONE_MSG', data)
      })
      this.socket.on('groupMsg', (data) => {
        this.$store.commit('GROUP_MSG', data)
      })
      // 接受自己给自己发的消息
      this.socket.on('onselfMsg', (data) => {
        this.$store.commit('ONE_BY_ONE_MSG', data)
      })
      // 接受自己给自己发的群消息
      this.socket.on('groupOneSelfMsg', (data) => {
        this.$store.commit('GROUP_MSG', data)
      })
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
