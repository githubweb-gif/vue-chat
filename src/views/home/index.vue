<template>
  <div class="main">
    <ul>
      <router-link class="link" to="/friendReq">
        <li>
          <div class="avatar">
            <span class="el-icon-s-custom" />
          </div>
          <div class="info">
            <div class="name">好友请求</div>
          </div>
          <!-- <div class="date">
            上午7:45
          </div> -->
        </li>
      </router-link>
      <li v-for="(item,index) in AllData" :key="index" @click="toChat(item)">
        <div class="avatar">
          <img v-if="item.friendID" :src="item.friendID.avatar | avatar" alt="">
          <img v-else :src="item.avatar | avatar" alt="">
          <i v-if="item.tip > 0 ? true : false">{{ item.tip }}</i>
        </div>
        <div class="info">
          <div v-if="item.friendID" class="name">{{ item.friendID.name }}</div>
          <div v-else class="name">{{ item.name }}</div>
          <p class="msg">{{ item.newMessage }}</p>
        </div>
        <div class="date">
          {{ item.MsgTime | dateFormat }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getFriends, getHomeGroups } from '@/api/user'
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
    baseUrl() {
      return this.$store.getters.baseUrl
    },
    AllData() {
      const all = this.friendList.concat(this.groupList)
      all.sort((a, b) => {
        return new Date(b.MsgTime) - new Date(a.MsgTime)
      })
      return all
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
      this.acceptMessage()
    },
    getFriendList() {
      const data = {
        id: this.id,
        state: 0
      }
      getFriends(data)
        .then((res) => {
          const list = this.flashbackTime(res.data)
          this.friendList = this.types(list)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toChat(item, name) {
      if (item.friendID && item.friendID._id) {
        this.$router.push({
          path: '/chat',
          query: {
            id: item.friendID._id
          }
        })
        return
      }
      console.log(item)
      this.$router.push({
        path: '/groupChat',
        query: {
          id: item._id
        }
      })
    },
    // 数据按时间倒序排序
    // 从大到小
    flashbackTime(data) {
      return data.sort((a, b) => {
        return new Date(b.MsgTime) - new Date(a.MsgTime)
      })
    },
    acceptMessage() {
      this.socket.on('msg', (data) => {
        if (data.length && data.length === 1) {
          this.friendList.forEach((item, index) => {
            const res = this.types(data)
            if (item.friendID._id === res[0].userID._id) {
              const e = item
              e.tip += 1
              e.MsgTime = res[0].time
              e.newMessage = res[0].message
              this.friendList.splice(index, 1)
              this.friendList.unshift(e)
            }
          })
        }
      })
      this.socket.on('groupMsg', (data) => {
        const arr = []
        arr.push(data.GroupID)
        this.groupList.forEach((item, index) => {
          const res = this.types(arr)
          console.log(res)
          if (item._id === res[0]._id) {
            const e = item
            e.tip = data.tip
            e.MsgTime = res[0].MsgTime
            e.newMessage = res[0].newMessage
            this.groupList.splice(index, 1)
            this.groupList.unshift(e)
          }
        })
      })
    },
    // 获取群列表
    getHomeGroups() {
      getHomeGroups({ userID: this.id }).then((res) => {
        const arr = []
        res.data.forEach((x, index) => {
          arr.push(x['GroupID'])
          arr[index].tip = x.tip
        })
        const list = this.flashbackTime(arr)
        this.groupList = this.types(list)
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
}
li:hover {
  background-color: #f3f4f6;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.24rem 0.427rem;
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
    span {
      width: 1.28rem;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ffe431;
      font-size: 0.66rem;
      border-radius: 0.32rem;
    }
    i {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.0267rem 0.106rem;
      position: absolute;
      top: -0.1067rem;
      right: -0.1067rem;
      background-color: #ed3e3c;
      border-radius: 50%;
      color: #fff;
      font-size: 0.32rem;
    }
  }
  .info {
    flex: 1;
    align-self: flex-start;
    padding-top:0.1067rem;
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
