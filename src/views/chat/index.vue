<template>
  <div class="chat">
    <header-bar @click="initHeight = !initHeight">
      <template v-slot:details>
        <div class="name">{{ chatInfo.name }}</div>
        <router-link v-if="$route.path === '/chat'" :to="`/details?id=${id}`">
          <span class="el-icon-more" />
        </router-link>
        <router-link v-else :to="`/groupDetails?id=${id}`">
          <span class="el-icon-more" />
        </router-link>
      </template>
    </header-bar>
    <header />
    <main ref="main" @click="initHeight = !initHeight">
      <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
        <div v-for="(item,index) in msgList" :id="index===0?'lastItem': ''" :key="item._id" :class="['user', item.scroll]">
          <div class="time">{{ item.time | chatDate }}</div>
          <div class="info" :class="[item.userID._id === oneSelf.id ? 'oneself' : 'friend', item.GroupID ? 'group': '']">
            <div class="avatar">
              <img v-if="$route.path === '/chat'" :src="(item.userID._id === oneSelf.id ? oneSelf.avatar : item.userID.avatar) | avatar" alt>
              <img v-else :src="item.userID.avatar | avatar" alt>
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
import { getInfo, oppositeMessage, clearTip, getGroup, getGroupMsg } from '@/api/user'
import { ImagePreview } from 'vant'
import FooterVue from './components/footer.vue'
import headerBar from '@/components/header'
export default {
  components: {
    FooterVue,
    headerBar
  },
  data() {
    return {
      // 好友聊天时是好友信息， 群聊时是群信息
      chatInfo: {},
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
      // 群数据
      GroupData: {}
    }
  },
  computed: {
    // 好友ID或者群ID
    id() {
      return this.$route.query.id
    },
    // 登录用户ID
    oneSelf() {
      return this.$store.getters.userInfo
    },
    otherMsg() {
      return this.$store.state.user.otherTypes
    },
    route() {
      if (this.$route.path === '/chat') {
        return true
      } else if (this.$route.path === '/groupChat') {
        return false
      }
      return true
    },
    disabled() {
      if (this.page >= this.pages) {
        return true
      }
      return false
    }
  },
  watch: {
    componetHight(value) {
      this.$refs.last.style.height = value
    },
    otherMsg() {
      this.addMsg(this.otherMsg)
    }
  },
  created() {
    if (this.route) {
      this.getUserInfo()
      this.getOneMsg()
      this.acceptMessage()
    } else {
      this.getGroup()
      this.getGroupMsg()
      this.joinGroup()
    }
  },
  mounted() {
    setTimeout(() => {
      const scroll = this.$refs.main
      if (scroll.scrollHeight > scroll.clientHeight) {
        scroll.scrollTop = scroll.scrollHeight
        this.$refs.last.style.height = 0
      }
    }, 50)
  },
  updated() {
    this.n = false
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      getInfo(this.id)
        .then((res) => {
          this.chatInfo = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 初始化获取一对一消息
    async getOneMsg() {
      const data = {
        userID: this.oneSelf.id,
        friendID: this.id,
        page: this.page
      }
      const msg = await this.getMessage(data)
      clearTip({ userID: this.oneSelf.id, friendID: this.id })
      if (this.page === 1) {
        this.msgList = msg
        return
      }
      return msg
      // const list = this.msgList
      // list.forEach((item, index) => {
      //   const next = index + 1
      //   if (next > list.length - 1) {
      //     item.time = ''
      //     return
      //   }
      //   if (list[next].time - item.time <= 1000 * 60 * 5) {
      //     item.time = ''
      //   }
      // })
      // this.msgList = list
    },
    // 分页消息处理
    Pagination(data) {
      let msg = this.msgList.slice()
      msg = msg.reverse()
      msg = msg.concat(data.records).reverse()
      msg.map((x, index) => {
        if (x.types - 0 === 1) {
          this.images.push(x.message)
        }
        if (index === 0) {
          x.scroll = 's' + data.page
        }
        return x
      })
      this.pages = data.pages
      return msg
    },
    // 获取消息
    getMessage(data) {
      // const that = this
      if (this.route) {
        return new Promise((resolve, reject) => {
          oppositeMessage(data).then((res) => {
            const msg = this.Pagination(res.data)
            resolve(msg)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          getGroupMsg(data).then((res) => {
            console.log(this.msgList)
            const msg = this.Pagination(res.data)
            resolve(msg)
          })
        })
      }
    },
    // 接收好友发来的信息
    acceptMessage() {
      this.socket.on('msg', (data) => {
        if (data.length && data.length === 1) {
          this.addMsg(data[0])
        }
      })
    },
    // 添加消息
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
    // 获取群信息
    getGroup() {
      getGroup({ GroupID: this.id }).then((res) => {
        this.chatInfo = res.data
      })
    },
    // 获取群聊消息
    async getGroupMsg() {
      const data = {
        GroupID: this.id,
        page: this.page
      }
      const msg = await this.getMessage(data)
      if (this.page === 1) {
        this.msgList = msg
        return
      }
      return msg
    },
    // socket接收群消息
    acceptGroupMessage() {
      this.socket.on('joinToRoom', (data) => {
        console.log(data)
      })
      this.socket.on('sendGroupMsg', (data) => {
        console.log('---------')
        console.log(data)
        this.addMsg(data.msg)
      })
    },
    // 加入群聊房间
    joinGroup() {
      this.socket.emit('joinToRoom', this.id)
      this.acceptGroupMessage()
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
      new Promise((resolve) => {
        if (this.route) {
          const data = this.getOneMsg()
          resolve(data)
        } else {
          const data = this.getGroupMsg()
          resolve(data)
        }
      }).then((data) => {
        setTimeout(() => {
          this.msgList = data
          this.isLoading = false
          this.$nextTick(() => {
            if (!this.n) {
              const name = 's' + (this.page - 1)
              console.log(name)
              const ss = document.querySelector(`.${name}`)
              console.log(ss.offsetTop)
              setTimeout(() => {
                this.$refs.main.scrollTo(0, ss.offsetTop - 30)// -30是为了露出最新加载的一行数据
              }, 30)
            }
          })
        }, 500)
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
.chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
main {
  flex: 1;
  padding: 0 0.43rem;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #f4f4f4;
  position: relative;
  .user {
    .time {
      text-align: center;
      margin: 0.4rem 0 0.53rem;
      font-size: 0.37rem;
      color: rgba(39, 40, 50, 0.3);
    }
    .info {
      display: flex;
      align-items: center;
      .avatar {
        img {
          width: 1.1rem;
          height: 1.1rem;
          border-radius: 0.27rem;
        }
      }
      .content {
        margin: 0 0.22rem;
        padding: 0.22rem 0.29rem;
        font-size: 0.43rem;
        border-radius: 0.14rem;
        letter-spacing: 0.027rem;
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
         margin: 0 0.22rem;
         position: relative;
         background-color: #ffffff;
         .place {
          padding: 0.22rem 0.14rem 0.14rem;
         }
         .title {
           width: 100%;
           overflow: hidden;
           white-space: nowrap;
           text-overflow: ellipsis;
           margin-bottom: 0.14rem;
           font-size: 0.5rem;
         }
         p {
           font-size: 0.32rem;
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
      background-color: #0bbe06;
    }
    .map::after, .content::after {
        content: '';
        display: inline-block;
        border: 0.16rem solid;
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
      background-color: #ffffff;
    }
    .map::after,.content::after {
        content: '';
        display: inline-block;
        border: 0.16rem solid;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(-100%,-50%);
        border-color: transparent #ffffff transparent transparent ;
      }
  }
  .group {
    flex-direction: row !important;
    .text {
       text-align: left;
       background-color: #ffffff;
    }
    .map::after,.content::after {
        content: '';
        display: inline-block;
        border: 0.16rem solid;
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
