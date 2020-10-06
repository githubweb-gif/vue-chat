<template>
  <div class="box">
    <header @click="initHeight = !initHeight">
      <div class="link el-icon-arrow-left" @click="$router.go(-1)" />
      <div class="name">马里奥</div>
      <router-link :to="`/details?id=${id}`">
        <span class="el-icon-more" />
      </router-link>
    </header>
    <main ref="main" @click="initHeight = !initHeight">
      <div v-for="item in msgList" :key="item.id" class="user">
        <div class="time">{{ item.time | chatDate }}</div>
        <div class="info" :class="item.uid === 'user' ? 'friend' : 'oneself'">
          <div class="avatar">
            <img v-if="userInfo.avatar" :src="item.avatar" alt>
          </div>
          <div v-if="item.types === 0" class="content">{{ item.message }}</div>
          <div
            v-if="item.types === 1"
            class="content"
            @click="show(item.message)"
          >
            <img :src="item.message" alt>
          </div>
        </div>
      </div>
      <div ref="last" class="last" />
    </main>
    <footer-vue
      class="footer"
      :is-componet="initHeight"
      @IntoView="scrollFooter"
      @addMsg="addMsg"
    />
  </div>
</template>

<script>
import { getInfo } from '@/api/user'
import datas from '@/data/chat'
import { ImagePreview } from 'vant'
import FooterVue from './components/footer.vue'
export default {
  components: {
    FooterVue
  },
  data() {
    return {
      userInfo: {},
      options: {
        movable: false
      },
      msgList: [],
      images: [],
      initHeight: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    oneSelf() {
      return this.$store.getters.userInfo
    }
  },
  created() {
    this.getUserInfo()
    this.init()
  },
  mounted() {
    setTimeout(() => {
      const scroll = this.$refs.main
      if (scroll.scrollHeight > scroll.clientHeight) {
        scroll.scrollTop = scroll.scrollHeight
        this.$refs.last.style.height = 0
      }
    }, 100)
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      getInfo(this.id)
        .then((res) => {
          this.userInfo = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 初始化
    init() {
      const list = datas.message()
      list.forEach((item, index) => {
        if (item.types === 1) {
          this.images.push(item.message)
        }
        const next = index + 1
        if (next > list.length - 1) {
          item.time = ''
          return
        }
        if (list[next].time - item.time <= 1000 * 60 * 5) {
          item.time = ''
        }
      })
      this.msgList = list
    },
    show(images) {
      const index = this.images.indexOf(images)
      ImagePreview({
        images: this.images,
        showIndex: true,
        loop: false, // 是否循环播放
        startPosition: index
      })
    },
    scrollFooter(b) {
      this.$refs.last.style.height = b + 'px'
      this.scroll().then(() => {
        this.$refs.last.style.height = 0
      })
    },
    scroll(value) {
      return new Promise((resolve, reject) => {
        const scroll = this.$refs.main
        scroll.scrollTop = scroll.scrollHeight
        resolve()
      })
    },
    addMsg(value) {
      this.msgList.push({ types: 0, message: value })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/header.scss";
.box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
header {
  background-color: #f4f4f4;
  position: relative;
  .link {
    font-size: 24px;
  }
  .name {
    flex: 1;
    padding-left: 10px;
  }
  .info {
    font-size: 20px;
  }
}
main {
  flex: 1;
  padding: 0 16px;
  overflow-x: hidden;
  overflow-y: scroll;
  .user {
    .time {
      text-align: center;
      margin: 15px 0 20px;
      font-size: 14px;
      color: rgba(39, 40, 50, 0.3);
    }
    .info {
      display: flex;
      .avatar {
        img {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
      }
      .content {
        flex: 1;
        max-width: 217px;
        margin: 0 8px;
        padding: 8px 11px;
        font-size: 16px;
        background-color: #ffffff;
        border-radius: 0 10px 10px 10px;
        letter-spacing: 1px;
        max-width: 70%;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
    }
  }
  .oneself {
    flex-direction: row-reverse;
  }
}
.fade-leave-active,
.fade-enter-active {
  transition: all 0.3s;
}
</style>
