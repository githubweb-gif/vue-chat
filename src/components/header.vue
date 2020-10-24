<template>
  <div class="top">
    <div v-if="$route.path === '/home' || $route.path === '/addressBook'" class="home header">
      <div v-if="$route.path === '/home'" class="avatar">
        <img v-if="user.avatar" :src="user.avatar | avatar" alt="" @click="infoPage">
      </div>
      <div v-else class="title">{{ $route.meta.title }}</div>
      <div class="right">
        <router-link to="/search"><span class="search el-icon-search" /></router-link>
        <span class="add el-icon-circle-plus-outline" @touchstart.stop.prevent="isMenu = !isMenu" />
      </div>
      <div v-if="isMenu" class="options">
        <div><span class="el-icon-chat-round" /><i>发起群聊</i></div>
        <div @touchstart.stop.prevent="$router.push('/addFriend')">
          <span class="el-icon-user" />添加朋友<i />
        </div>
        <div><span class="el-icon-full-screen" /><i>扫一扫</i></div>
        <div><span class="el-icon-message" /><i>帮助与反馈</i></div>
      </div>
    </div>
    <div v-else class="other header">
      <div class="back">
        <span class="link el-icon-arrow-left" @click="$router.go(-1)" />
      </div>
      <div v-if="$route.path === '/userInfo'" class="right">个人信息</div>
      <div v-if="$route.path === '/friendReq'" class="right">好友请求</div>
      <slot name="details" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: null
    },
    menu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isMenu: this.menu
    }
  },
  watch: {
    menu(value) {
      this.isMenu = false
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
.top .home {
    width: 100%;
    position: relative;
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
      .title {
        font-weight: 600;
    }
}

.other {
    font-size: 18px;
      .name {
    flex: 1;
    padding-left: 10px;
  }
    .right {
        flex: 1;
        padding-left: 10px;
    }
}
</style>
