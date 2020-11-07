<template>
  <div class="top">
    <div v-if="$route.path === '/home' || $route.path === '/addressBook'" class="home header">
      <div v-if="$route.path === '/home'" class="avatar">
        <img v-if="user && user.avatar" :src="user.avatar | avatar" alt="" @click="infoPage">
      </div>
      <div v-else class="title">{{ $route.meta.title }}</div>
      <div class="right">
        <van-icon class="search" name="search" @click="$router.push('/search')" />
        <van-icon class="add" name="add-o" @touchstart.stop.prevent="isMenu = !isMenu" />
      </div>
      <div v-if="isMenu" class="options">
        <div @touchstart.stop.prevent="$router.push('/setGroup')"><van-icon name="chat-o" /><i>发起群聊</i></div>
        <div @touchstart.stop.prevent="$router.push('/addFriend')">
          <van-icon name="friends" />添加朋友<i />
        </div>
        <div><van-icon name="add-o" /><i>添加群</i></div>
        <div><van-icon name="envelop-o" /><i>帮助与反馈</i></div>
      </div>
    </div>
    <div v-else class="other header">
      <div class="back">
        <svg-icon v-if="$route.path==='/chat' || $route.path==='/groupChat'" class="link" icon-id="fanhui2" @click="$router.push('/')" />
        <svg-icon v-else class="link" icon-id="fanhui2" @click="$router.go(-1)" />
      </div>
      <div v-if="$route.meta.title" class="right">{{ $route.meta.title }}</div>
      <slot name="details" />
    </div>
    <div v-show="isMenu" class="shadow" />
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
        path: '/userInfo',
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
.top {
  position: relative;
  .avatar {
    img {
      height: 0.906667rem;
      width: 0.906667rem;
      border-radius: 0.213333rem;
    }
  }
  .right {
    height: 100%;
    display: flex;
    align-items: center;
    .search {
      margin-right: 0.5rem;
    }
    .search,
    .add {
      font-size: 0.693333rem;
    }
  }
  .options {
    width: 4rem;
    box-sizing: border-box;
    font-size: 0.426667rem;
    position: absolute;
    top: 100%;
    right: 1%;
    z-index: 999;
    background-color: rgba(62, 62, 64, 1);
    border-radius: 0.16rem;
    margin-top: 0.266667rem;
    .van-icon {
      font-size: 0.64rem;
      padding: 0 0.2rem;
    }
    div {
      display: flex;
      align-items: center;
      color: #ffffff;
      padding: 0.27rem 0;
    }
  }
  .options::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: -0.27rem;
    right: 0.27rem;
    border-left: 0.4rem solid transparent;
    border-right: 0.4rem solid transparent;
    border-bottom: 0.4rem solid rgba(62, 62, 64, 1);
  }
  .title {
    font-weight: 600;
  }
}

.other {
  background-color: rgba(255,255,255,0);
  .back {
    display: flex;
  }
  .svg-icon {
    width: 0.6rem;
     height: 1.173333rem;
  }
  .name {
    flex: 1;
    padding-left: 0.266667rem;
  }
  .right {
    flex: 1;
    padding-left: 0.266667rem;
  }
}

.shadow {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>
