<template>
  <div class="main">
    <router-link class="link" to="/friendReq">
      <div class="req">
        <div class="icon">
          <van-icon name="friends" />
        </div>
        <div class="info">
          <div class="name">好友请求</div>
        </div>
        <!-- <div class="date">
            上午7:45
          </div> -->
      </div>
    </router-link>
    <ul>
      <li v-for="(item,index) in AllData" :key="index" @click="toChat(item)">
        <van-swipe-cell>
          <div class="content req">
            <div class="avatar">
              <img v-if="item.attributes==='group'" :src="item.avatar | avatar" alt="">
              <img v-else :src="item.userID.avatar | avatar" alt="">
              <i v-if="item.tip - 0 > 0 ? true : false">{{ item.tip }}</i>
            </div>
            <div class="info">
              <div v-if="item.attributes==='group'" class="name">{{ item.name }}</div>
              <div v-else class="name">{{ item.markName }}</div>
              <p class="msg">{{ item.newMessage }}</p>
            </div>
            <div class="date">
              {{ item.MsgTime | dateFormat }}
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
import { getFriends, getHomeGroups, deleteMsg, deleteHomeGroup } from '@/api/user'
export default {
  data() {
    return {
      friendList: [],
      groupList: []
    }
  },
  computed: {
    id() {
      return this.$store.getters.userInfo.id
    },
    AllData: {
      get: function() {
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
    }
  },
  watch: {
    oneMsg(data) {
      if (data.length && data.length === 1) {
        if (this.friendList.length === 0) {
          const res = this.types(data)
          let e = null
          e = res[0]
          e.tip = 1
          e.MsgTime = res[0].time
          e.newMessage = res[0].message
          this.friendList.unshift(e)
          return
        }
        this.friendList.forEach((item, index) => {
          const res = this.types(data)
          if (item.userID._id === res[0].userID._id) {
            const e = item
            e.tip += 1
            e.MsgTime = res[0].time
            e.newMessage = res[0].message
            this.friendList.splice(index, 1)
            this.friendList.unshift(e)
          }
        })
      }
    },
    GroupMsg(data) {
      const arr = []
      let n = 0
      arr.push(data.GroupID)
      if (this.groupList.length === 0) {
        this.setMsg(arr, data.tip)
        return
      }
      this.groupList.forEach((item, index) => {
        const res = this.types(arr)
        if (item._id === res[0]._id) {
          n += 1
          const e = item
          e.tip = data.tip
          e.MsgTime = res[0].MsgTime
          e.newMessage = res[0].newMessage
          this.groupList.splice(index, 1)
          this.groupList.unshift(e)
        } else if (index === this.groupList.length - 1 && n === 0) {
          this.setMsg(arr, data.tip)
        }
      })
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 根据数据类型返回不同的数据
    types(data) {
      const list = data.map((x) => {
        if (x.types === 0) {
          return x
        } else if (x.types === 1) {
          if (x.message) {
            x.message = '[图片]'
            return x
          }
          x.newMessage = '[图片]'
          return x
        } else if (x.types === 3) {
          if (x.message) {
            x.message = '[地图]'
            return x
          }
          x.newMessage = '[地图]'
          return x
        }
        return x
      })
      return list
    },
    initData() {
      this.getFriendList()
      this.getHomeGroups()
    },
    getFriendList() {
      const data = {
        id: this.id,
        state: 0
      }
      getFriends(data)
        .then((res) => {
          this.friendList = this.types(res.data)
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
        this.groupList = this.types(arr)
      })
    },
    // 处理群及时消息
    setMsg(arr, tip) {
      const res = this.types(arr)
      const e = res[0]
      e.tip = tip
      e.MsgTime = res[0].MsgTime
      e.attributes = 'group'
      e.newMessage = res[0].newMessage
      this.groupList.unshift(e)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  box-sizing: border-box;
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
    i {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.0267rem 0.106rem;
      position: absolute;
      top: -0.16rem;
      right: -0.08rem;
      background-color: #ed3e3c;
      border-radius: 50%;
      color: #fff;
      font-size: 0.32rem;
    }
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
