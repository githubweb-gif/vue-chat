<template>
  <div>
    <header-bar />
    <main>
      <ul>
        <li v-for="item of reqList" :key="item._id">
          <div class="avatar">
            <img :src="item.userID.avatar | avatar" alt>
          </div>
          <div class="main">
            <div class="operating">
              <div class="refuse" @click="refuse(item.userID._id )">拒绝</div>
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
    <van-loading v-if="load" class="loading" type="spinner" />
  </div>
</template>
<script>
import { getRequest, refuseRequest, agreeRequest } from '@/api/user'
import headerBar from '@/components/header.vue'
export default {
  components: { headerBar },
  data() {
    return {
      reqList: [],
      load: true
    }
  },
  computed: {
    id() {
      return this.$store.getters.userInfo.id
    },
    name() {
      return this.$store.getters.userInfo.name
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
        this.load = false
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
        userID: this.id,
        markName: this.name
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
main {
  padding: 2.67rem 0.426rem 0;
  li {
    position: relative;
    margin-bottom: 1.6rem;
    font-size: 0.426667rem;
    .avatar {
      text-align: center;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 2.13rem;
        height: 2.13rem;
        border-radius: 50%;
      }
    }
    .main {
      background-color: #ffffff;
      box-shadow: 0 0 0.27rem #c8bec3;
      padding: 0.5rem 0.4rem 0.4rem;
      border-radius: 0.4rem;
      .operating {
        display: flex;
        justify-content: space-between;
        div {
          padding: 0.16rem 0.53rem;
          border-radius: 0.53rem;
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
        padding: 0.53rem;
      }
      .leave {
        border-radius: 0.0267rem;
        background-color: #f0f2f4;
        padding:0.32rem;
      }
    }
  }
}
</style>
