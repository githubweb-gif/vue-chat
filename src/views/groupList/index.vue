<template>
  <div class="groups">
    <div class="header">
      <van-icon name="arrow-left" @click="$router.go(-1)" />
      <div class="title">群聊</div>
    </div>
    <div class="groupList">
      <div v-for="(item,index) in dataList" :key="index" class="box">
        <div class="letter">{{ index }}</div>
        <div v-for="(i,n) in item" :key="n" class="item" @click="$router.push({path: '/groupChat',query: {id:i.GroupID._id}})">
          <div class="avatar">
            <img :src="i.GroupID.avatar | avatar" alt="">
          </div>
          <div class="name">
            {{ i.GroupID.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllGroup } from '@/api/user'
export default {
  data() {
    return {
      dataList: []
    }
  },
  computed: {
    oneSelf() {
      return this.$store.getters.userInfo
    }
  },
  created() {
    this.getGroup()
  },
  methods: {
    getGroup() {
      getAllGroup({ userID: this.oneSelf.id }).then((res) => {
        this.dataList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/header.scss';
.header {
  font-size: 0.533333rem;
  padding: 0 0.3rem;
  .van-icon {
    font-size: 0.666667rem;
  }
}
.groups {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.title {
  flex: 1;
  margin-left: 0.267rem;
}
.right {
  font-size: 0.53rem;
}
.groupList {
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
  .box {
    background-color: #ffffff;
    padding-left: 0.426667rem;
    .letter {
      padding-top: 0.133333rem;
      padding-bottom: 0.133333rem;
      background-color: rgb(244, 244, 244);
      margin-left: -0.426667rem;
      padding-left: 0.426667rem;
      font-size: 0.5rem;
    }
    .item {
      display: flex;
      align-items: center;
      border-bottom: 0.026667rem solid #dadddb;
      padding: 0.133333rem 0;
      font-size: 0.5rem;
      .name {
        margin-left: 0.266667rem;
      }
      img {
        width: 1.386667rem;
        height: 1.386667rem;
      }
    }
    .item:last-child {
      border-bottom: none;
    }
  }
}
</style>
