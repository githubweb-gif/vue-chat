<template>
  <div class="layout" @click="menu = !menu">
    <header-bar :menu="menu" :user="user" />
    <main @mousewheel="menu === false">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" class="main" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" class="main" />
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
  background-color: rgba(244, 244, 244, 0.8);
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
</style>
