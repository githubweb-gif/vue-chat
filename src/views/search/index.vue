<template>
  <div class="search">
    <div class="header">
      <div class="form">
        <div class="ss">
          <input v-if="title === 'search'" v-model="keyWords" type="text" @input="search">
          <input v-else v-model="keyWords" type="text" @input="addFriend">
          <button><van-icon name="search" /></button>
        </div>
      </div>
      <div class="cancel"><router-link to="/">取消</router-link></div>
    </div>
    <div class="main">
      <div class="user">
        <div v-if="friendList.length > 0 || stranger !== null" class="title">
          用户
        </div>
        <div class="list">
          <ul v-if="title === 'search'">
            <li v-for="item of friendList" :key="item._id">
              <div class="avatar">
                <router-link
                  class="link"
                  :to="`/details?id=${item.userID._id}`"
                ><img
                  :src="item.userID.avatar | avatar"
                  alt=""
                ></router-link>
              </div>
              <div class="name" v-html="item.markName" />
              <div class="info" @click="$router.push({path:'/chat',query: {id: item.userID._id}})">发消息</div>
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
      <div v-if="$route.path==='/search' && groupList.length > 0" class="group">
        <div class="title">群组</div>
        <div class="list">
          <ul>
            <li v-for="(item,index) in groupList" :key="index">
              <div class="avatar">
                <img
                  :src="item.GroupID.avatar | avatar"
                  alt=""
                >
              </div>
              <div class="name">{{ item.GroupID.name }}</div>
              <div class="info" @click="$router.push({path:'/groupChat',query: {id: item.GroupID._id}})">发消息</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 添加朋友可以搜索陌生人或者好友
import { debounce } from '@/until/debounce'
import { searchFriends, searchStranger } from '@/api/user'
export default {
  data() {
    return {
      keyWords: '',
      // 判断是否是好友
      people: true,
      friendList: [],
      stranger: null,
      // 群列表
      groupList: []
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
    // 搜索好友// 搜索已加入群
    search: debounce(function() {
      if (this.keyWords.trim() === '') {
        return
      }
      searchFriends({ uid: this.id, key: this.keyWords }).then((res) => {
        const { data, groupList } = res
        this.groupList = groupList
        this.friendList = data
      })
    }, 500),
    // 搜索陌生人
    addFriend: debounce(function() {
      if (this.keyWords.trim() === '') {
        return
      }
      searchStranger({ key: this.keyWords, uname: this.name }).then((res) => {
        console.log(res)
        const { data } = res
        this.stranger = data
      })
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/header.scss';
.header {
  padding: 0.186667rem 0.426667rem;
  height: 1.173333rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.026667rem solid #ede8e8;
  background-color: #ffffff;
  .form {
    flex: 2;
    height: 100%;
    .ss {
      display: flex;
      height: 100%;
      border-radius: 0.133333rem;
      input {
        border: 0;
        flex: 1;
        height: 100%;
        border-radius: 0.133333rem;
        outline: none;
        padding: 0 0.106667rem;
        background-color: #f3f4f6;
      }
    }
    button {
      height: 100%;
      border: 0;
      border-radius: 0.133333rem;
      background-color: #f3f4f6;
      font-size: 0.48rem;
      padding-right: 0.133333rem;
      outline: none;
    }
  }
  .cancel {
    margin-left: 0.4rem;
    font-size: 0.373333rem;
  }
}
.link {
  width: 100%;
  height: 100%;
}
.title {
  padding: 0 0.426667rem 0.266667rem;
  font-size: 0.586667rem;
  font-weight: 600;
}
.list {
  li,
  .stranger {
    display: flex;
    padding: 0.24rem 0.426667rem;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    .avatar {
      width: 1.066667rem;
      height: 1.066667rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 0.266667rem;
      }
    }
    .name {
      flex: 1;
      padding-left: 0.426667rem;
      font-size: 0.48rem;
    }
    .info {
      font-size: 0.32rem;
      padding: 0.106667rem 0.346667rem;
      border-radius: 0.32rem;
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
  margin-bottom: 0.56rem;
}
</style>
