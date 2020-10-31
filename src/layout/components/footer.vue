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
  padding: 0.135rem 0.64rem;
  background-color: rgba(240, 240, 240, 1);
  span {
    display: block;
    text-align: center;
    font-size: 0.4rem;
  }
  .icon {
    font-size: 0.64rem;
  }
}
</style>
