<template>
  <div :class="['box', { background: height }]">
    <!-- 导航 -->
    <header-bar>
      <template v-slot:details>
        <div v-if="validFriend.state || id === uid">
          <router-link v-if="uid === id" :to="`/userInfo?id=${uid}`">
            <span class="el-icon-more" />
          </router-link>
        </div>
      </template>
    </header-bar>
    <!-- 主体 -->
    <div class="main">
      <div class="avatar">
        <div :style="animation" class="border">
          <img v-if="userInfo.avatar" :class="{ size: height }" :src="userInfo.avatar | avatar" alt>
          <!-- icon-xingbie icon-xingbienan icon-xingbie-nv -->
          <span :style="{ backgroundColor: sex.bc }" :class="['sex', 'iconfont', sex.icon]" />
        </div>
        <h3 v-if="!validFriend.state">{{ userInfo.name }}</h3>
        <!-- 添加好友弹窗 -->
        <div
          v-if="!validFriend.state"
          :style="height === true ? changeHeight : ''"
          class="addFriend"
        >
          <div class="text">
            <textarea id="area" v-model="message" name cols="30" rows="10" placeholder="没有内容~" />
          </div>
          <div class="whether">
            <span class="cancel" @click="ani">取消</span>
            <span class="send" @click="friendRequest">发送</span>
          </div>
        </div>
      </div>
      <div class="info">
        <span v-if="validFriend.state">昵称: {{ validFriend.markName }}</span>
        <p class="motto">{{ userInfo.intr }}</p>
      </div>
    </div>
    <!-- 底部 -->
    <div v-if="id === uid ? false : true" class="footer">
      <span v-if="validFriend.state" @click="toChat">发送消息</span>
      <span v-if="!validFriend.state && id" @click="ani">加为好友</span>
    </div>
    <!-- 背景 -->
    <!-- <div
      v-if="userInfo.avatar"
      class="filter"
      :style="[{backgroundImage: `url(${baseUrl+backgroundImg})`}]"
    >
      <div class="white" /> -->
  <!-- </div> -->
  </div>
</template>

<script>
import { getInfo, isFriend, friendRequest } from '@/api/user'
import headerBar from '@/components/header'
export default {
  components: {
    headerBar
  },
  data() {
    return {
      height: false,
      changeHeight: {
        height: 0
      },
      animation: {
        width: '200px'
      },
      userInfo: {},
      // 是否是好友/昵称
      validFriend: {
        state: false,
        markName: ''
      },
      message: ''
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    name() {
      return this.$store.getters.userInfo.name
    },
    uid() {
      return this.$store.getters.userInfo.id
    },
    sex() {
      if (this.userInfo.sex === 'girl') {
        return {
          icon: 'icon-xingbie-nv',
          bc: '#FF5D5B'
        }
      } else if (this.userInfo.sex === 'man') {
        return {
          icon: 'icon-xingbienan',
          bc: '#248ba7'
        }
      } else {
        return {
          icon: 'icon-xingbie',
          bc: '#000000'
        }
      }
    },
    baseUrl() {
      return this.$store.getters.baseUrl
    },
    backgroundImg() {
      if (this.userInfo.avatar) {
        const url = this.userInfo.avatar.split('\\')
        const imgurl = url[1] + '/' + url[2]
        return imgurl
      }
      return ''
    }
  },
  watch: {
    $route(to, from) {
      console.log(to.path)
    }
  },
  created() {
    this.message = `你好我是${this.name}~`
    this.getUserInfo()
  },
  mounted() {
    this.changeHeights()
  },
  methods: {
    // 动画
    ani() {
      this.height = !this.height
      if (this.height === true) {
        this.animation.width = '120px'
        this.changeHeights()
      } else {
        this.animation.width = '200px'
        this.changeHeights()
      }
    },
    changeHeights() {
      const body = document.querySelector('body')
      const top =
        body.offsetHeight - (74 + this.animation.width.split('p')[0] / 2)
      this.changeHeight.height = top + 'px'
    },
    getUserInfo() {
      if (this.id === this.uid) {
        this.userInfo = this.$store.getters.userInfo
      } else {
        getInfo(this.id)
          .then(async(res) => {
            this.userInfo = res.data
            // 判断是否是好友
            const { data } = await this.isFriend()
            this.validFriend = data
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    // 判断是否是好友
    async isFriend() {
      return await isFriend({ userID: this.uid, friendID: this.id })
    },
    // 好友请求
    friendRequest() {
      const data = {
        userID: this.uid,
        friendID: this.id,
        leaveMessage: this.message
      }
      friendRequest(data).then((res) => {
        const { message } = res
        this.$message({
          message: message,
          type: 'success'
        })
        this.ani()
        this.getUserInfo()
      })
    },
    toChat() {
      console.log(this.userInfo)
      const item = this.userInfo
      this.$router.push({
        path: '/chat',
        query: {
          id: item._id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  background-color: rgba(255, 255, 255, 1);
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.background {
  background-color: rgba(245, 228, 120, 1);
}
.filter {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  filter: blur(6px);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  .white {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
  }
}
header {
  border: 0;
  background: 0;
  .back {
    .link {
      display: block;
      font-size: 24px;
      font-weight: 600;
    }
  }
  .right {
    span {
      font-size: 26px;
    }
  }
}
.main {
  text-align: center;
  padding-top: 74px;
  flex: 1;
  .avatar {
    position: relative;
    padding: 0 28px;
    margin-bottom: 10px;
    .border {
      display: inline-block;
      transition: all 0.3s;
      position: relative;
      z-index: 2;
      .sex {
        position: absolute;
        bottom: 8%;
        right: 8%;
        border-radius: 50%;
        font-size: 18px;
        padding: 5px;
        color: #ffffff;
      }
    }
    img {
      width: 200px;
      height: 200px;
      padding: 2px;
      background-color: #ffffff;
      border-radius: 24px;
      transition: all 0.3s;
    }
    .size {
      width: 120px;
      height: 120px;
    }
  }
  .info {
    font-size: 14px;
    position: relative;
    z-index: 100;
    span {
      margin-bottom: 10px;
      display: inline-block;
      font-size: 16px;
    }
    .motto {
      color: #272832;
      letter-spacing: -0.48px;
      line-height: 24px;
      padding: 0 50px;
    }
  }
}
.footer {
  padding: 0 16px;
  bottom: 4px;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  span {
    padding-top: 9px;
    padding-bottom: 9px;
    display: inline-block;
    width: 100%;
    text-align: center;
    background-color: #ffe431;
    border-radius: 5px;
  }
}
.addFriend {
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: #ffffff;
  border-radius: 20px 20px 0 0;
  transition: all 0.3s;
  overflow: hidden;
  .text {
    position: absolute;
    top: 120px;
    left: 0px;
    width: 100%;
    height: 50%;
    padding: 0 28px;
    box-sizing: border-box;
    #area {
      background-color: #f3f4f6;
      width: 100%;
      border-radius: 10px;
      border: 0;
      outline: none;
      padding: 10px;
      box-sizing: border-box;
      resize: none;
    }
  }
  .whether {
    position: absolute;
    bottom: 4px;
    left: 28px;
    right: 28px;
    display: flex;
    height: 40px;
    line-height: 40px;
    justify-content: space-between;
    .send,
    .cancel {
      text-align: center;
      height: 100%;
      border-radius: 5px;
    }
    .send {
      flex: 1;
      background-color: #ffe431;
      margin-left: 16px;
    }
    .cancel {
      background-color: rgba(39, 40, 50, 0.1);
      padding: 0 21px;
    }
  }
}
</style>
