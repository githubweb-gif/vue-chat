<template>
  <div class="chat">
    <header-bar @click="initHeight = !initHeight">
      <template v-slot:details>
        <div v-if="$route.path!=='/groupChat'" class="name">{{ chatInfo.markName }}</div>
        <div v-else class="name">{{ chatInfo.name }}</div>
        <router-link v-if="$route.path === '/chat'" :to="`/details?id=${id}`">
          <van-icon name="ellipsis" />
        </router-link>
        <router-link v-else :to="`/groupDetails?id=${id}`">
          <van-icon name="ellipsis" />
        </router-link>
      </template>
    </header-bar>
    <main ref="main" @click="initHeight = !initHeight">
      <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
        <div v-for="(item,index) in msgList" :id="index===0?'lastItem': ''" :key="index" :class="['user', item.scroll ,index===0?'top':'']">
          <div v-if="isShowTime(index,msgList)" class="time">{{ item.time | getTimeStringAutoShort2 }}</div>
          <div class="info" :class="[item.userID._id === oneSelf.id ? 'oneself' : 'friend', item.GroupID ? 'group': '']">
            <div class="avatar">
              <img v-if="$route.path === '/chat'" :src="(item.userID._id === oneSelf.id ? oneSelf.avatar : item.userID.avatar) | avatar" alt>
              <img v-else :src="item.userID.avatar | avatar" alt>
            </div>
            <!-- 文字 -->
            <div v-if="item.types - 0 === 0" class="content text">{{ item.message }}</div>
            <!-- 图片 -->
            <div
              v-else-if="item.types - 0 === 1"
              class="image content"
              @click="show(item.message)"
            >
              <img :src="item.message" alt>
            </div>
            <!-- 地图 -->
            <div
              v-else-if="item.types - 0 === 3"
              class="map"
              @click="mapApp(item.message)"
            >
              <div class="place">
                <div class="title"> {{ item.message.split('&')[1] }} </div>
                <p>{{ item.message.split('&')[2] }}</p>
              </div>
              <img :src="item.map | avatar" alt>
            </div>
            <!-- 语音 -->
            <div
              v-else-if="item.types - 0 === 2"
              class="audio content text"
            >
              <div v-if="item.duration">{{ item.duration + 's' }}</div>
              <van-icon name="music-o" @click="playAuto(item.message)" />
              <audio :ref="item.message" :src="item.message | avatar" />
            </div>
          </div>
        </div>
      </van-pull-refresh>
      <div ref="last" class="last" />
    </main>
    <footer-vue
      ref="footer"
      class="footer"
      :is-componet="initHeight"
      @IntoView="scrollFooter"
      @addMsg="addMsg"
    />
  </div>
</template>

<script>
import { getFriendInfo, oppositeMessage, clearTip, getGroup, getGroupMsg } from '@/api/user'
import { getPermission } from '@/until/audio'
import { ImagePreview } from 'vant'
import FooterVue from './components/footer.vue'
import headerBar from '@/components/header'
import TimeUtils from '@/until/timeUtils'
export default {
  filters: {
    getTimeStringAutoShort2(timestamp) {
      const date = new Date(timestamp)
      return TimeUtils.getTimeStringAutoShort2(date.getTime(), true)
    }
  },
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
      // 群数据
      GroupData: {},
      n: 0
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
    },
    changeRoute() {
      return this.$route
    }
  },
  watch: {
    componetHight(value) {
      this.$refs.last.style.height = value
    },
    otherMsg() {
      this.addMsg(this.otherMsg)
    },
    // 路有变化重新滚动到底部和加入群房间
    changeRoute(route) {
      if (route.path === '/groupChat') {
        this.initScroll()
        this.joinGroup()
      }
      if (route.path === '/chat') {
        this.initScroll()
      }
    },
    // 页面被缓存，生命周期不会被重新执行，所以需要判断id变化
    id(value) {
      if (this.changeRoute.path === '/chat' || this.changeRoute.path === '/groupChat') {
        if (!value || value === '') {
          return
        }
        const chatId = window.sessionStorage.getItem('chatId')
        if (chatId === value) {
          return
        }
        window.sessionStorage.setItem('chatId', value)
        this.msgList = []
        if (this.route) {
          this.getUserInfo()
          this.getOneMsg()
          this.acceptMessage()
        } else {
          this.getGroup()
          this.getGroupMsg()
          this.joinGroup()
        }
      }
    }
  },
  created() {
    getPermission()
    window.sessionStorage.setItem('chatId', this.id)
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
  methods: {
    // 获取用户信息
    getUserInfo() {
      if (this.id !== this.oneSelf.id) {
        getFriendInfo({ id: this.id, uid: this.oneSelf.id }).then((res) => {
          this.chatInfo = res.data.userID
          this.chatInfo.markName = res.data.markName
        }).catch(() => {
          this.$router.push('/')
        })
      } else {
        this.$router.push('/')
      }
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
        this.initScroll()
        return
      }
      return msg
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
        if (index === msg.length - 1) {
          x.scroll = 'bottom' + data.page
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
            const msg = this.Pagination(res.data)
            console.log(msg)
            resolve(msg)
          })
        })
      }
    },
    // 接收好友发来的信息
    acceptMessage() {
      this.socket.on('msg', (data) => {
        console.log(data)
        if (data.length && data.length === 1) {
          console.log(data[0])
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
        this.$nextTick(() => {
          this.scroll().then(() => {
            this.initHeight = !this.initHeight
          })
        })
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
        this.initScroll()
        return
      }
      return msg
    },
    // socket接收群消息
    acceptGroupMessage() {
      this.socket.on('sendGroupMsg', (data) => {
        this.addMsg(data.msg)
      })
    },
    // 加入群聊房间
    joinGroup() {
      this.socket.emit('joinToRoom', { GroupID: this.id, id: this.oneSelf.id })
      this.$store.commit('GROUP_ID', this.id)
      this.n += 1
      if (this.n === 1) {
        this.acceptGroupMessage()
      }
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
    // 进入页面时聊天滚动到底部
    initScroll() {
      this.$nextTick(() => {
        const scroll = this.$refs.main
        if (scroll.scrollHeight > scroll.clientHeight) {
          scroll.scrollTop = scroll.scrollHeight
        }
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
          // console.log(scroll)
          if (!scroll) {
            return
          }
          scroll.scrollTop = scroll.scrollHeight
          resolve()
        })
      })
    },
    // 滚动加载
    onRefresh() {
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
            const name = 's' + (this.page - 1)
            const ss = document.querySelector(`.${name}`)
            this.$refs.main.scrollTo(0, ss.offsetTop - 30)// -30是为了露出最新加载的一行数据
          })
        }, 500)
      })
    },
    // 判断设备//暂时没用
    equipment() {
      // 移动端
      const Agents = ['Android', 'iPhone',
        'SymbianOS', 'Windows Phone',
        'iPad', 'iPod']
      const userAgentInfo = navigator.userAgent
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
      window.location.href = `https://uri.amap.com/marker?position=${arr[0].split(',')[0]},${arr[0].split(',')[1]}&name=${arr[1]}`
    },
    // 播放音频
    playAuto(audio) {
      const play = this.$refs[audio][0]
      console.log(this.$refs[audio])
      play.play()
    },
    isShowTime(index, msgList) {
      const msgTime = msgList[index].time
      const tim1 = new Date(msgTime)
      if (index > 0) {
        const preProtoMessage = msgList[index - 1]
        const preMsgTime = preProtoMessage.time
        const tim2 = new Date(preMsgTime)
        if (tim1 - tim2 > (5 * 60 * 1000)) {
          return true
        }
      }
      return false
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
.header-bar {
  .name {
    flex: 1;
  }
}
.van-icon {
  font-size: 0.8rem;
}
main {
  flex: 1;
  padding: 0 0.43rem;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #f4f4f4;
  position: relative;
  .top {
    margin-top: 0.533333rem;
    overflow: hidden;
  }
  .user {
    margin-bottom: 0.533333rem;
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
        word-break:break-all;
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
           height: 2.666667rem;
           object-fit: cover;
         }
      }
      .audio {
        font-size: 0.3rem;
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
</style>
