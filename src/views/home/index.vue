<template>
  <div class="main">
    <router-link class="link" to="/friendReq">
      <div class="req">
        <div class="icon">
          <van-icon name="friends" />
          <i v-if="num > 0" class="num">{{ num }}</i>
        </div>
        <div class="info">
          <div class="name">好友请求</div>
        </div>
      </div>
    </router-link>
    <ul>
      <li v-for="(item,index) in AllData" :key="index" @click="toChat(item)">
        <van-swipe-cell>
          <div class="content req">
            <div class="avatar">
              <img v-if="item.attributes==='group'" :src="item.avatar | avatar" alt="">
              <img v-else :src="item.userID.avatar | avatar" alt="">
              <i v-if="item.tip - 0 > 0 ? true : false" class="num">{{ item.tip }}</i>
            </div>
            <div class="info">
              <div v-if="item.attributes==='group'" class="name">{{ item.name }}</div>
              <div v-else class="name">{{ item.markName }}</div>
              <p v-if="item.types - 0 !== 0" class="type msg">{{ item.types | messageType }}</p>
              <p v-else class="msg">{{ item.newMessage }}</p>
            </div>
            <div class="date">
              {{ item.MsgTime | getTimeStringAutoShort2 }}
            </div>
          </div>
          <template #right>
            <van-button square type="danger" text="删除" @click="deleteMsg(item,index)" />
          </template>
        </van-swipe-cell>
      </li>
    </ul>
  </div>
</template>

<script>
import { getFriends, getHomeGroups, clearTip, deleteMsg, deleteHomeGroup, getRequest } from '@/api/user'
import TimeUtils from '@/until/timeUtils'
export default {
  filters: {
    getTimeStringAutoShort2(timestamp) {
      const date = new Date(timestamp)
      return TimeUtils.getTimeStringAutoShort2(date.getTime(), true)
    },
    messageType(type) {
      type = Number(type)
      if (type === 1) {
        return '[图片]'
      } else if (type === 3) {
        return '[地图]'
      } else if (type === 2) {
        return '[语音]'
      } else if (type === 0) {
        return
      }
    }
  },
  data() {
    return {
      friendList: [],
      groupList: [],
      num: 0
    }
  },
  computed: {
    id() {
      return this.$store.getters.userInfo.id
    },
    AllData: {
      get: function() {
        console.log()
        const all = this.friendList.concat(this.groupList)
        all.sort((a, b) => {
          return new Date(b.MsgTime) - new Date(a.MsgTime)
        })
        return all
      },
      // setter
      set: function(data) {
        if (data.attributes && data.attributes === 'group') {
          this.groupList.forEach((x, index) => {
            if (x._id === data.id) {
              this.groupList.splice(index, 1)
            }
          })
          return
        }
        this.friendList.forEach((x, index) => {
          if (x.userID._id === data.id) {
            this.friendList.splice(index, 1)
          }
        })
      }
    },
    oneMsg() {
      return this.$store.state.user.oneMsg
    },
    GroupMsg() {
      return this.$store.state.user.GroupMsg
    },
    route() {
      return this.$route
    }
  },
  watch: {
    oneMsg(data) {
      if (data instanceof Array && data.length === 1) {
        if (data[0] instanceof Object && data[0]) {
          const copy = data[0]
          /**
         * 1 首页没有相关信息
         * 2 首页有相关信息
        */
          const info = {
            userID: '',
            friendID: '',
            markName: '',
            types: '',
            time: '',
            message: '',
            tip: 0
          }
          for (const x in info) {
            if (x === 'tip') {
              info[x] = 0
            } else if (copy[x]) {
              info[x] = copy[x]
            }
          }
          info.newMessage = info.message
          info.MsgTime = info.time
          // 判断是否是自己发个自己的
          if (info.userID && this.id === info.userID._id) {
            info.userID = copy.friendID
            info.friendID = copy.userID
          }
          let i = NaN
          this.friendList.filter((item, index) => {
            if (item.userID._id === info.userID._id) {
              i = index
              return true
            }
          })
          // 判断是否在房间里
          if (this.$route.query.id === info.userID._id && this.$route.path === '/chat') {
            info.tip = 0
            clearTip({ userID: this.id, friendID: info.userID._id })
          } else {
            info.tip += 1
          }
          if (i >= 0) {
            if (info.tip === 1) {
              info.tip = this.friendList[i].tip + 1
            }
            console.log(info)
            this.friendList.splice(i, 1)
            this.friendList.unshift(info)
          } else {
            this.friendList.unshift(info)
          }
        }
      }
    },
    GroupMsg(data) {
      if (data && data.GroupID instanceof Object) {
        /**
         * 1 首页没有相关信息
         * 2 首页有相关信息
        */
        const tip = data.tip || 0
        const info = {
          MsgTime: '',
          attributes: 'group',
          newMessage: '',
          tip: tip,
          avatar: '',
          name: '',
          types: 0,
          _id: ''
        }
        for (const i in info) {
          if (data.GroupID[i]) {
            info[i] = data.GroupID[i]
          }
        }
        let n = NaN
        this.groupList.filter((x, i) => {
          if (x._id === info._id) {
            n = i
            return true
          }
        })
        if (n >= 0) {
          this.groupList.splice(n, 1)
          this.groupList.unshift(info)
        } else {
          this.groupList.unshift(info)
        }
      }
    },
    route(value) {
      const route = value
      const id = route.query.id
      if (route.path === '/chat') {
        this.friendList.forEach((x, index) => {
          if (x.userID._id === id) {
            this.friendList[index].tip = 0
          }
        })
      } else if (route.path === '/groupChat') {
        this.groupList.forEach((x, index) => {
          if (x._id === id) {
            this.groupList[index].tip = 0
          }
        })
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.getFriendList()
      this.getHomeGroups()
      this.getRequest()
    },
    getFriendList() {
      const data = {
        id: this.id,
        state: 0
      }
      getFriends(data)
        .then((res) => {
          this.friendList = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toChat(item, name) {
      if (item.userID && item.userID._id) {
        this.$router.push({
          path: '/chat',
          query: {
            id: item.userID._id
          }
        })
        return
      }
      this.$router.push({
        path: '/groupChat',
        query: {
          id: item._id
        }
      })
    },
    // 获取群列表
    getHomeGroups() {
      getHomeGroups({ userID: this.id }).then((res) => {
        const arr = []
        res.data.forEach((x, index) => {
          arr.push(x['GroupID'])
          arr[index].tip = x.tip
          arr[index].attributes = 'group'
        })
        this.groupList = arr
      })
    },
    // 刪除消息
    deleteMsg(data, index) {
      if (data.attributes === 'group') {
        // 刪除群消息
        deleteHomeGroup({ userID: this.id, GroupID: data._id }).then(() => {
          this.AllData = { id: data._id, attributes: data.attributes }
        })
        return
      }
      // 删除好友消息
      deleteMsg({ userID: this.id, friendID: data.userID._id }).then(() => {
        this.AllData = { id: data.userID._id }
      })
    },
    // 获取好友请求数
    getRequest() {
      const obj = {
        friendID: this.id,
        state: 1
      }
      getRequest(obj).then((res) => {
        this.num = res.data.length
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  box-sizing: border-box;
}
.num {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  top: -0.16rem;
  right: -0.08rem;
  background-color: #ed3e3c;
  border-radius: 50%;
  color: #fff;
  font-size: 0.32rem;
}
.link {
  width: 100%;
  display: block;
  .req {
    padding: 0.24rem 0;
    font-size: 0.426667rem;
    .info {
      flex: 1;
    }
    .icon {
      margin-right: 0.427rem;
      position: relative;
    }
    .van-icon {
      width: 1.28rem;
      height: 1.28rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ffe431;
      font-size: 0.66rem;
      border-radius: 0.32rem;
      font-size: 0.8rem;
    }
  }
}
li:hover {
  background-color: #f3f4f6;
}
.req,
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0.427rem;
}
li {
  .van-swipe-cell {
    padding: 0.24rem 0;
  }
  .avatar {
    width: 1.28rem;
    height: 1.28rem;
    margin-right: 0.427rem;
    position: relative;
    img {
      width: 1.28rem;
      height: 100%;
      border-radius: 12px;
    }
  }

  .info {
    flex: 1;
    align-self: flex-start;
    padding-top: 0.1067rem;
    overflow: hidden;
    .name {
      font-size: 0.48rem;
    }
    .msg {
      font-size: 0.373rem;
      color: #aeafb3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .date {
    font-size: 0.32rem;
    align-self: flex-start;
    padding-top: 0.133rem;
    color: rgba(39, 40, 50, 0.4);
    letter-spacing: -0.01093rem;
  }
}
</style>
