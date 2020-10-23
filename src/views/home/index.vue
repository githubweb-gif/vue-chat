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
      <li v-for="item in friendList" :key="item.id" @click="toChat(item)">
        <div class="avatar">
          <img v-if="item.friendID.avatar" :src="item.friendID.avatar | avatar" alt="">
          <i v-if="item.tip > 0 ? true : false">{{ item.tip }}</i>
        </div>
        <div class="info">
          <div class="name">{{ item.friendID.name }}</div>
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
import { getFriends } from '@/api/user'
export default {
  data() {
    return {
      friendList: []
    }
  },
  computed: {
    id() {
      return this.$store.getters.userInfo.id
    },
    baseUrl() {
      return this.$store.getters.baseUrl
    }
  },
  watch: {
    $route(to, from) {
      console.log(to.path)
    }
  },
  created() {
    this.getFriendList()
    this.acceptMessage()
  },
  methods: {
    // 根据数据类型返回不同的数据
    types(data) {
      const list = data.map((x) => {
        if (x.types - 0 === 0) {
          return x
        } else if (x.types - 0 === 1) {
          if (x.message) {
            x.message = '[图片]'
            return x
          }
          x.newMessage = '[图片]'
          return x
        } else if (x.types - 0 === 3) {
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
    getFriendList() {
      const data = {
        id: this.id,
        state: 0
      }
      getFriends(data)
        .then((res) => {
          this.flashbackTime(res.data)
          console.log(res.data)
          this.friendList = this.types(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toChat(item) {
      this.$router.push({
        path: '/chat',
        query: {
          id: item.friendID._id
        }
      })
    },
    // 数据按时间倒序排序
    // 从大到小
    flashbackTime(data) {
      data.sort((a, b) => {
        return new Date(b.MsgTime) - new Date(a.MsgTime)
      })
    },
    acceptMessage() {
      this.socket.on('msg', (data) => {
        if (data.length && data.length === 1) {
          console.log(this.friendList)
          this.friendList.forEach((item, index) => {
            const res = this.types(data)
            if (item.friendID._id === res[0].userID._id) {
              const e = item
              e.MsgTime = res[0].time
              e.newMessage = res[0].message
              this.friendList.splice(index, 1)
              this.friendList.unshift(e)
            }
          })
        }
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
  padding: 9px 16px;
  .avatar {
    width: 48px;
    height: 48px;
    margin-right: 16px;
    position: relative;
    img {
      width: 48px;
      height: 100%;
      border-radius: 12px;
    }
    span {
      width: 48px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ffe431;
      font-size: 25px;
      border-radius: 12px;
    }
    i {
      display: inline-block;
      min-width: 12px;
      padding: 1px 4px;
      text-align: center;
      line-height: 18px;
      font-style: normal;
      position: absolute;
      top: -4px;
      right: -4px;
      background-color: #ed3e3c;
      border-radius: 50%;
      color: #fff;
    }
  }
  .info {
    flex: 1;
    align-self: flex-start;
    padding-top: 4px;
    overflow: hidden;
    .name {
      font-size: 18px;
    }
    .msg {
      font-size: 14px;
      color: #aeafb3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .date {
    font-size: 12px;
    align-self: flex-start;
    padding-top: 5px;
    color: rgba(39, 40, 50, 0.4);
    letter-spacing: -0.41px;
  }
}
</style>
