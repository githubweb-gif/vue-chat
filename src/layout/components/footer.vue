<template>
  <footer>
    <div :class="['item',route === '/home' ? 'bcColor':'']" @click="toLink('/')">
      <svg-icon icon-id="chat" />
      <span>chat</span>
    </div>
    <div :class="['item',route === '/addressBook' ? 'bcColor':'']" @click="toLink('/addressBook')">
      <svg-icon icon-id="tongxunlu" />
      <span>通讯录</span>
    </div>
    <div :class="['item',route === '/userInfo' ? 'bcColor':'']" @click="toLink('/userInfo')">
      <svg-icon icon-id="wo" />
      <span>我</span>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.userInfo
    },
    route() {
      return this.$route.path
    }
  },
  methods: {
    toLink(value, e) {
      if (value === '/userInfo') {
        this.$router.push({ path: value, query: { id: this.user.id }})
      } else {
        this.$router.push({ path: value })
      }
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
  .item {
    text-align: center;
    font-size: 0;
    color: #767373;
  }
  span {
    display: block;
    font-size: 0.4rem;
  }
  .svg-icon {
    width: 0.8rem;
    height: 0.8rem;
  }
  .bcColor{
    color: #1aad19;
  }
}
</style>
