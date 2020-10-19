<template>
  <div class="box">
    <header @click="initHeight = !initHeight">
      <div class="link el-icon-arrow-left" @click="$router.push('/')" />
      <div class="name">马里奥</div>
      <router-link :to="`/details?id=${id}`">
        <span class="el-icon-more" />
      </router-link>
    </header>
    <main ref="main" @click="initHeight = !initHeight">
      <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
        <div v-for="(item,index) in msgList" :id="index===0?'lastItem': ''" :key="item._id" class="user">
          <div class="time">{{ item.time | chatDate }}</div>
          <div class="info" :class="item.userID._id === oneSelf.id ? 'oneself' : 'friend'">
            <div class="avatar">
              <img :src="(item.userID._id === oneSelf.id ? oneSelf.avatar : item.userID.avatar) | avatar" alt>
            </div>
            <div v-if="item.types === '0'" class="content">{{ item.message }}</div>
            <div
              v-if="item.types === '1'"
              class="content"
              @click="show(item.message)"
            >
              <img :src="item.message" alt>
            </div>
          </div>
        </div>
      </van-pull-refresh>
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
import { getInfo, oppositeMessage, getNewMsg } from '@/api/user'
import { ImagePreview, PullRefresh } from 'vant'
import FooterVue from './components/footer.vue'
export default {
  components: {
    FooterVue,
    vanPullRefresh: PullRefresh
  },
  data() {
    return {
      friendInfo: {},
      options: {
        movable: false
      },
      msgList: [],
      images: [],
      initHeight: false,
      componetHight: '',
      // 当前页
      page: 1,
      // 总页数
      pages: '',
      isLoading: false,
      scrollHeight: '',
      // 判断dom更新
      n: false,
      disabled: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    oneSelf() {
      return this.$store.getters.userInfo
    },
    othersMsg() {
      return this.$store.state.user.otherTypes
    }
  },
  watch: {
    othersMsg(value) {
      if (value) {
        this.addMsg(value)
      }
    },
    componetHight(value) {
      this.$refs.last.style.height = value
      console.log(this.$refs.last.style.height)
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
        this.scrollHeight = scroll.scrollHeight
        this.$refs.last.style.height = 0
      }
    }, 100)
  },
  updated() {
    this.n = false
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      getInfo(this.id)
        .then((res) => {
          this.friendInfo = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 初始化
    init() {
      this.getMessage()
      const list = this.msgList
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
    // 获取消息
    async getMessage() {
      const data = {
        userID: this.oneSelf.id,
        friendID: this.id,
        page: this.page
      }
      const { data: res } = await oppositeMessage(data)
      this.msgList = this.msgList.reverse()
      this.msgList = this.msgList.concat(res.records).reverse()
      this.pages = res.pages
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
      this.componetHight = b + 'px'
      this.scroll().then(() => {
        this.$refs.last.style.height = 0
      })
    },
    scroll() {
      return new Promise((resolve, reject) => {
        const scroll = this.$refs.main
        scroll.scrollTop = scroll.scrollHeight
        resolve()
      })
    },
    addMsg(value) {
      if (value) {
        getNewMsg({ userID: this.oneSelf.id, friendID: this.id }).then((res) => {
          console.log(res)
          this.msgList.push(res.data[0])
          setTimeout(() => {
            this.scroll().then(() => {
              this.initHeight = !this.initHeight
            })
          }, 200)
        })
      }
    },
    onRefresh() {
      this.n = true
      this.page++
      if (this.page >= this.pages) {
        this.disabled = true
      }
      setTimeout(() => {
        this.$refs.main.scrollTop = 10
        this.init()
        this.isLoading = false
        this.$nextTick(() => {
          if (!this.n) {
            setTimeout(() => {
              this.$refs.main.scrollTo(0, this.scrollHeight - 30)// -30是为了露出最新加载的一行数据
            }, 30)
          }
        })
      }, 500)
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
  background-color: #f4f4f4;
  position: relative;
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
        margin: 0 8px;
        padding: 8px 11px;
        font-size: 16px;
        background-color: #ffffff;
        border-radius: 5px;
        letter-spacing: 1px;
        max-width: 70%;
        display: flex;
        align-items: center;
        position: relative;
        img {
          width: 100%;
        }
      }
    }
  }
  .oneself {
    flex-direction: row-reverse;
    .content {
      text-align: right;
      background-color: #0bbe06 !important;
    }
    .content::after {
        content: '';
        display: inline-block;
        border: 6px solid;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(100%,-50%);
        border-color: transparent transparent transparent #0bbe06;
      }
  }
  .friend {
    .content{
       text-align: left;
    }
        .content::after {
        content: '';
        display: inline-block;
        border: 6px solid;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(-100%,-50%);
        border-color: transparent #ffffff transparent transparent ;
      }
  }
}
.fade-leave-active,
.fade-enter-active {
  transition: all 0.3s;
}
</style>
