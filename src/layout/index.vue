<template>
  <div class="layout" @touchstart="menu = false">
    <header>
      <div class="avatar">
        <img v-if="user.avatar" :src="user.avatar | avatar" alt="" @click="infoPage">
      </div>
      <div class="right">
        <router-link to="/search"><span class="search el-icon-search" /></router-link>
        <span class="add el-icon-circle-plus-outline" @touchstart.stop.prevent="menu = !menu" />
      </div>
      <div v-if="menu" class="options">
        <div><span class="el-icon-chat-round" /><i>发起群聊</i></div>
        <div @touchstart.stop.prevent="$router.push('/addFriend')">
          <span class="el-icon-user" />添加朋友<i />
        </div>
        <div><span class="el-icon-full-screen" /><i>扫一扫</i></div>
        <div><span class="el-icon-message" /><i>帮助与反馈</i></div>
      </div>
    </header>
    <main @mousewheel="menu = false">
      <router-view />
    </main>
    <footer-bar />
  </div>
</template>

<script>
import footerBar from '@/components/footer.vue'
export default {
  components: { footerBar },
  data() {
    return {
      menu: false
    }
  },
  computed: {
    user() {
      return this.$store.getters.userInfo
    },
    baseUrl() {
      return this.$store.getters.baseUrl
    }
  },
  methods: {
    infoPage() {
      this.$router.push({
        path: '/details',
        query: {
          id: this.user.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/header.scss';
.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
main {
  padding-top: 53px;
  padding-bottom: 20px;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
header {
  img {
    vertical-align: middle;
  }
  .avatar {
    .link {
      display: block;
    }
    img {
      height: 34px;
      width: 34px;
      border-radius: 8px;
    }
  }
  .right {
    height: 100%;
    .search,
    .add {
      font-size: 26px;
      padding: 10px;
    }
  }
  .options {
    width: 150px;
    box-sizing: border-box;
    font-size: 16px;
    position: absolute;
    top: 100%;
    right: 3%;
    z-index: 999;
    background-color: rgba(62, 62, 64, 1);
    border-radius: 6px;
    margin-top: 10px;
    span {
      font-size: 24px;
      padding: 0 10px;
    }
    div {
      display: flex;
      align-items: center;
      color: #ffffff;
      padding: 10px 0;
    }
  }
  .options::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: -10px;
    right: 10px;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 20px solid rgba(62, 62, 64, 1);
  }
}
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 24px;
  background-color: #fcfcfc;
  box-shadow:  0px -1px 0px #e7e2e2;
  span {
    display: block;
    text-align: center;
  }
  .icon {
    font-size: 24px;
  }
}
</style>
