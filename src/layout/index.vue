<template>
  <div class="layout" @click="menu = !menu">
    <header-bar :menu="menu" :user="user" />
    <main @mousewheel="menu === false">
      <router-view class="main" />
    </main>
    <footer-bar />
  </div>
</template>

<script>
import footerBar from './components/footer.vue'
import headerBar from '@/components/header.vue'
export default {
  components: { footerBar, headerBar },
  data() {
    return {
      menu: false
    }
  },
  computed: {
    user() {
      return this.$store.getters.userInfo
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
main {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  .main {
    width: 100%;
    height: 100%;
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
