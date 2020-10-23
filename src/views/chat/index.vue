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
            <div v-if="item.types - 0 === 0" class="content text">{{ item.message }}</div>
            <div
              v-else-if="item.types - 0 === 1"
              class="image content"
              @click="show(item.message)"
            >
              <img :src="item.message" alt>
            </div>
            <div
              v-else-if="item.types - 0 === 3"
              class="map"
              @click="mapApp(item.message)"
            >
              <div class="place">
                <div class="title"> {{ item.message.split('&')[1] }} </div>
                <p>{{ item.message.split('&')[2] }}</p>
              </div>
              <img src="https://tse4-mm.cn.bing.net/th/id/OIP.MENcIlW1vtk-uNV5bxjZxgAAAA?w=206&h=193&c=7&o=5&dpr=1.25&pid=1.7" alt>
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
import { getInfo, oppositeMessage } from '@/api/user'
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
    otherMsg() {
      return this.$store.state.user.otherTypes
    }
  },
  watch: {
    componetHight(value) {
      this.$refs.last.style.height = value
      console.log(this.$refs.last.style.height)
    },
    otherMsg() {
      this.addMsg(this.otherMsg)
    }
  },
  created() {
    this.getUserInfo()
    this.init()
    this.acceptMessage()
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
      this.msgList.map((x) => {
        if (x.types - 0 === 1) {
          this.images.push(x.message)
        }
        return x
      })
      this.pages = res.pages
    },
    show(images) {
      console.log(images)
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
        this.$nextTick(() => {
          const scroll = this.$refs.main
          scroll.scrollTop = scroll.scrollHeight
          resolve()
        })
      })
    },
    // 滚动加载
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
    },
    addMsg(data) {
      if (data) {
        this.msgList.push(data)
        if (data.types - 0 === 1) {
          this.images.push(data.message)
        }
        setTimeout(() => {
          this.scroll().then(() => {
            this.initHeight = !this.initHeight
          })
        }, 200)
      }
    },
    // 接收友发来的信息
    acceptMessage() {
      this.socket.on('msg', (data) => {
        if (data.length && data.length === 1) {
          this.addMsg(data[0])
        }
      })
    },
    // 判断设备
    equipment() {
      // 移动端
      const Agents = ['Android', 'iPhone',
        'SymbianOS', 'Windows Phone',
        'iPad', 'iPod']
      const userAgentInfo = navigator.userAgent
      console.log(userAgentInfo)
      let flag = false
      for (let i = 0; i < Agents.length; i++) {
        if (userAgentInfo.indexOf(Agents[i]) !== -1) {
          flag = true
          return flag
        }
      }
    },
    // 调用地图组件
    mapApp(data) {
      const arr = data.split('&')
      if (this.equipment()) {
        window.location.href = `androidamap://navi?sourceApplication=appname&amp;poiname=fangheng&amp;lat=${arr[0].split(',')[0]}&amp;lon=${arr[0].split(',')[1]}&amp;dev=1&amp;style=2`
      } else {
        window.location.href = `https://uri.amap.com/marker?position=${arr[0].split(',')[0]},${arr[0].split(',')[1]}&name=${arr[1]}`
      }
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
      align-items: center;
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
      .map {
         width: 70%;
         margin: 0 8px;
         position: relative;
         background-color: #ffffff;
         .place {
          padding: 8px 5px 5px;
         }
         .title {
           width: 100%;
           overflow: hidden;
           white-space: nowrap;
           text-overflow: ellipsis;
           margin-bottom: 5px;
         }
         p {
           font-size: 12px;
           color: #a5a59d;
         }
         img {
           width: 100%;
         }
      }
    }
  }
  .oneself {
    flex-direction: row-reverse;
    .text {
      text-align: right;
      background-color: #0bbe06 !important;
    }
    .map::after, .content::after {
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
    .text{
       text-align: left;
    }
    .map::after,.content::after {
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
