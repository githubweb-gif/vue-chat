<template>
  <div class="search">
    <header>
      <form>
        <div class="ss">
          <input v-if="title === 'search'" v-model="keyWords" type="text" @input="search">
          <input v-else v-model="keyWords" type="text" @input="addFriend">
          <button><span class="el-icon-search" /></button>
        </div>
      </form>
      <div class="cancel"><router-link to="/">取消</router-link></div>
    </header>
    <div class="main">
      <div class="user">
        <div v-if="friendList.length > 0 ? true : false" class="title">
          用户
        </div>
        <div class="list">
          <ul v-if="title === 'search'">
            <li v-for="item of friendList" :key="item._id">
              <div class="avatar">
                <router-link
                  class="link"
                  :to="`/details?id=${item.friendID._id}`"
                ><img
                  :src="item.friendID.avatar | avatar"
                  alt=""
                ></router-link>
              </div>
              <div class="name" v-html="item.markName" />
              <div class="info">发消息</div>
            </li>
          </ul>
          <router-link v-if="stranger !== null" class="link" :to="`/details?id=${stranger._id}`">
            <div class="stranger">
              <div class="avatar">
                <img :src="stranger.avatar | avatar" alt="">
              </div>
              <div class="name" v-html="stranger.name" />
            </div>
          </router-link>
        </div>
      </div>
      <div class="group">
        <div class="title">群组</div>
        <div class="list">
          <ul>
            <li>
              <div class="avatar">
                <img
                  src="https://i1.hdslb.com/bfs/face/92b2703498674eaada44b4d05e1b2420197f117d.jpg@87w_88h_1c_100q.webp"
                  alt=""
                >
              </div>
              <div class="name">开发的实力</div>
              <div class="info">发消息</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 添加朋友可以搜索陌生人或者好友
import { debounce } from '@/until/methods'
import { searchFriends, searchStranger } from '@/api/user'
export default {
  data() {
    return {
      keyWords: '',
      // 判断是否是好友
      people: true,
      friendList: [],
      stranger: null
    }
  },
  computed: {
    id() {
      return this.$store.getters.userInfo.id
    },
    title() {
      return this.$route.meta.title
    },
    baseUrl() {
      return this.$store.getters.baseUrl
    },
    name() {
      return this.$store.getters.userInfo.name
    }
  },
  created() {
    // init
    this.keyWords = ''
  },
  methods: {
    // 搜索好友
    search: debounce(function() {
      if (this.keyWords.trim() === '') {
        return
      }
      searchFriends({ uid: this.id, key: this.keyWords }).then((res) => {
        const { data } = res
        this.friendList = data
      })
    }, 500),
    // 搜索陌生人
    addFriend: debounce(function() {
      console.log('000000000')
      if (this.keyWords.trim() === '') {
        return
      }
      console.log(this.keyWords)
      searchStranger({ key: this.keyWords, uname: this.name }).then((res) => {
        const { data } = res
        console.log(data)
        this.stranger = data
      })
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/header.scss';
header {
  padding: 7px 16px;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ede8e8;
  form {
    flex: 2;
    height: 100%;
    .ss {
      display: flex;
      height: 100%;
      border-radius: 5px;
      input {
        border: 0;
        flex: 1;
        height: 100%;
        border-radius: 5px;
        outline: none;
        padding: 0 4px;
        background-color: #f3f4f6;
      }
    }
    button {
      height: 100%;
      border: 0;
      border-radius: 5px;
      background-color: #f3f4f6;
      font-size: 18px;
      padding-right: 5px;
      outline: none;
    }
  }
  .cancel {
    margin-left: 15px;
    font-size: 14px;
  }
}
.link {
  width: 100%;
  height: 100%;
}
.title {
  padding: 0 16px 10px;
  font-size: 22px;
  font-weight: 600;
}
.list {
  li,
  .stranger {
    display: flex;
    padding: 9px 16px;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    .avatar {
      width: 40px;
      height: 40px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    }
    .name {
      flex: 1;
      padding-left: 16px;
      font-size: 18px;
    }
    .info {
      font-size: 12px;
      padding: 4px 13px;
      border-radius: 12px;
      background-color: #ffe431;
    }
    .bc {
      background-color: #edf6ff;
      color: #4aaaff;
    }
  }
}
li:hover {
  background-color: #f3f4f6;
}
.user {
  margin-bottom: 21px;
}
</style>
