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
            <p class="msg">张三</p>
          </div>
          <div class="date">
            上午7:45
          </div>
        </li></router-link>
      <li v-for="item in friendList" :key="item.id" @click="toChat(item)">
        <div class="avatar">
          <img v-if="item.friendID.avatar" :src="baseUrl+item.friendID.avatar" alt="">
          <i v-if="item.tip > 0 ? true : false">{{ item.tip }}</i>
        </div>
        <div class="info">
          <div class="name">{{ item.markName }}</div>
          <p class="msg">{{ item.news }}</p>
        </div>
        <div class="date">
          {{ item.time | dateFormat }}
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
  },
  methods: {
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
    toChat(item) {
      this.$router.push({
        path: '/chat',
        query: {
          id: item.friendID._id
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
