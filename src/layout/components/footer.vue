<template>
  <footer>
    <div class="home" @click="$router.push('/')">
      <span class="icon el-icon-chat-round" />
      <span>chat</span>
    </div>
    <div class="address" @click="$router.push('/addressBook')">
      <span class="icon el-icon-user" />
      <span>通讯录</span>
    </div>
    <div class="user" @click="$router.push({path: '/userInfo', query: {id:user.id}})">
      <span class="icon el-icon-user-solid" />
      <span>我</span>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.userInfo
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 24px;
 background-color: rgba(244, 244, 244, 1);
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
