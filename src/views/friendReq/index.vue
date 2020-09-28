<template>
  <div>
    <header>
      <div class="back">
        <router-link to="/">
          <span class="link el-icon-arrow-left" />
        </router-link>
      </div>
      <div class="right">好友请求</div>
      <span />
    </header>
    <main>
      <ul>
        <li v-for="item of reqList" :key="item._id">
          <div class="avatar header">
            <img :src="item.userID.avatar" alt>
          </div>
          <div class="main">
            <div class="operating">
              <div class="refuse" @click="refuse(item.userID._id)">拒绝</div>
              <div class="agree" @click="agree(item.userID._id)">同意</div>
            </div>
            <div class="info">
              <div>{{ item.userID.name }}</div>
              <div>{{ item.time | dateFormat }}</div>
            </div>
            <div class="leave">留言: {{ item.leaveMessage }}</div>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>
<script>
import { getRequest, refuseRequest, agreeRequest } from '@/api/user'
export default {
  data() {
    return {
      reqList: []
    }
  },
  computed: {
    id() {
      return this.$store.getters.userInfo.id
    }
  },
  created() {
    this.getRequest()
  },
  methods: {
    getRequest() {
      const obj = {
        friendID: this.id,
        state: 1
      }
      getRequest(obj).then((res) => {
        this.reqList = res.data
      })
    },
    refuse(id) {
      const obj = {
        friendID: id,
        userID: this.id
      }
      refuseRequest(obj).then((res) => {
        this.getRequest()
      })
    },
    agree(id) {
      const obj = {
        friendID: id,
        userID: this.id
      }
      agreeRequest(obj).then((res) => {
        this.getRequest()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/header.scss";
header {
  background-color: #ffffff;
  .right {
    font-size: 20px;
  }
}
.link {
  font-size: 24px;
  font-weight: 600;
}
main {
  padding: 100px 16px 0;
  li {
    position: relative;
    margin-bottom: 60px;
    .header {
      text-align: center;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    }
    .main {
      background-color: #ffffff;
      box-shadow: 0 0 10px #c8bec3;
      padding: 20px 15px 15px;
      border-radius: 15px;
      .operating {
        display: flex;
        justify-content: space-between;
        div {
          padding: 6px 20px;
          border-radius: 20px 20px 20px;
        }
        .refuse {
          background-color: rgba(255, 239, 239, 1);
          color: #f38385;
        }
        .agree {
          background-color: rgba(255, 224, 43, 1);
        }
      }
      .info {
        text-align: center;
        padding: 20px;
      }
      .leave {
        border-radius: 10px;
        background-color: #f0f2f4;
        padding: 12px 20px;
      }
    }
  }
}
</style>
