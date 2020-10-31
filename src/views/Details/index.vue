<template>
  <div id="Details" :class="{deta: toUp}">
    <!-- 导航 -->
    <header-bar ref="header" class="header">
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
      <div ref="avatar" class="avatar" :class="{bor: toUp}">
        <img v-if="userInfo.avatar" :src="userInfo.avatar | avatar" alt>
        <div :class="['sex', 'iconfont', sex.icon]" />
      </div>
      <div v-if="!toUp" class="info">
        <h3>{{ userInfo.name }}</h3>
        <span v-if="validFriend.state">昵称: 123</span>
        <p>受asdadadad打发士大夫敢,死队规划的手法首发射手座地方法规发撒沙发沙发的苦减肥过度开发本身就大发噶顺丰吧案说法伽是发吧发吧是东方八所</p>
      </div>
    </div>
    <!-- 底部 -->
    <div v-if="id === uid ? false : true" class="footer">
      <span v-if="validFriend.state" @click="toChat">发送消息</span>
      <span v-if="!validFriend.state && id" @click="toUp=!toUp">加为好友</span>
    </div>
    <!-- 添加好友弹窗 -->
    <transition name="toUp">
      <div v-if="toUp" class="addFriend" :style="{height: toHeight+'px'}">
        <van-cell-group>
          <van-field
            v-model="message"
            rows="4"
            autosize
            type="textarea"
            maxlength="50"
            show-word-limit
            placeholder="没有内容~"
          />
        </van-cell-group>
        <div class="whether">
          <div class="cancel" @click="toUp = false">取消</div>
          <div class="send" @click="friendRequest">发送</div>
        </div>
      </div>
    </transition>
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
      userInfo: {},
      // 是否是好友/昵称
      validFriend: {
        state: false,
        markName: ''
      },
      message: '',
      toUp: false,
      toHeight: ''
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
    }
  },
  created() {
    this.message = `你好我是${this.name}~`
    this.getUserInfo()
  },
  mounted() {
    this.$nextTick(() => {
      const header = this.$refs.header.$el
      const avatar = this.$refs.avatar
      const body = document.body
      this.toHeight = body.offsetHeight - header.offsetHeight - (avatar.offsetHeight / 2)
    })
  },
  methods: {
    getUserInfo() {
      if (this.id === this.uid) {
        this.userInfo = this.$store.getters.userInfo
      } else {
        getInfo(this.id)
          .then(async(res) => {
            this.userInfo = res.data
            console.log(res.data)
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
      this.toUp = false
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
      })
    },
    toChat() {
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
 #Details {
   font-size: 0.373333rem;
   background-color: #8f8f9b;
   justify-content: space-between;
 }
 .deta {
   background-color: #ebda6e !important;
   .header {
     background-color: #ebda6e !important;
   }
 }
 .header {
   margin-bottom: 0.8rem;
   background-color: #8f8f9b;
 }
 .main, #Details, .addFriend {
  display: flex;
  flex-direction: column;
 }
.main {
  align-items: center;
  flex: 1;
  position: relative;
  .avatar {
    transition: all 0.5s;
    width: 5.333333rem;
    height: 5.333333rem;
    padding: 0.1rem;
    border-radius: 0.4rem;
    background-color: #ffffff;
    position: relative;
    z-index: 10;
    margin-bottom: 0.266667rem;
    box-shadow: 0 0 5px #676c69;
    img {
      width: 100%;
      height: 100%;
      border-radius: 0.4rem;
      vertical-align: middle;
    }
    .sex {
      position:absolute;
      bottom: 0.533333rem;
      right: 0.533333rem;
      padding: 0.15rem;
      background-color: #ff2d2b;
      border-radius: 50%;
      color: #ffffff;
    }
  }
  .bor {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 10%;
    img {
      border-radius: 50%;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    h3 {
      font-size: 0.693333rem;
      color: #272832;
      margin-bottom: 0.12rem;
    }
    span {
      font-weight: 600;
      font-size: 0.373333rem;
      color: #272832;
      margin-bottom: 0.3rem;
    }
    p {
      text-indent: 0.4rem;
      width: 100%;
      padding: 0 1.333333rem;
      font-size: 0.373333rem;
      color: #272832;
      letter-spacing:0.02rem;
      line-height: 0.64rem;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
      text-align: center;
    }
  }
}
.footer {
  padding: 0 0.426667rem;
  margin-bottom: 0.533333rem;
  span {
    display: block;
    padding: 0.266667rem 0;
    background-color: #ffe431;
    text-align: center;
    font-size: 0.426667rem;
    border-radius: 0.15rem;
  }
}
.addFriend {
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 2;
  background-color: #ffffff;
  border-top-right-radius: 0.533333rem;
  border-top-left-radius: 0.533333rem;
  align-items: center;
  justify-content: space-between;
  padding-top: 2.1rem;
  .van-cell-group {
    width:100%;
    padding: 0 0.533333rem;
    .van-cell {
    border-radius: 5%;
    font-size: 0.373333rem !important;
    background-color: #f3f4f6;
    }
  }
  .whether {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 0.426667rem;
    margin-bottom: 0.533333rem;
    div {
      display: block;
      padding: 0.25rem 0;
      text-align: center;
      border-radius: 0.16rem;
    }
    .cancel {
      background-color: #e9e9ea;
      margin-right: 0.533333rem;
      flex: 1;
    }
    .send {
      flex: 3;
      background-color: #ffe431;
    }
  }
}
.toUp-enter-active,
.toUp-leave-active{
  transition:all 0.5s;
}
.toUp-enter {
  transform: translateY(100%);
}
.toUp-leave-active {
  transform: translateY(100%);
}
</style>
