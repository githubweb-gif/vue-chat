<template>
  <div id="groupPepole">
    <slot name="header" />
    <slot name="opsition" />
    <div class="main">
      <div class="title">用户</div>
      <!-- 好友 -->
      <div v-if="!show && data" class="data">
        <div v-for="(item,index) in data" :key="index" class="item">
          <div class="letter-name">{{ index.toUpperCase() }}</div>
          <template v-for="(i,n) in item">
            <div v-if="i" :key="n" class="dataList">
              <input :disabled="i.disabled===true ? true: false" :checked="i.disabled===true ? true: false" class="icon" type="checkbox" @change="checkUser(i,$event)">
              <div class="avatar"><img :src="i.userID.avatar | avatar" alt=""></div>
              <div class="xingming">{{ i.markName }}</div>
            </div>
          </template>
        </div>
      </div>
      <!-- 群友 -->
      <div v-if="show && data" class="data">
        <div v-for="(item,index) in data" :key="index" class="item">
          <div v-if="item[0]" class="letter-name">{{ index.toUpperCase() }}</div>
          <template v-for="(i,n) in item">
            <div v-if="i" :key="n" class="dataList">
              <input v-if="groupInfo.userID === userID && groupInfo.userID !== i.userID._id" class="icon" type="checkbox" @change="checkUser(i,$event)">
              <div class="avatar"><img :src="i.userID.avatar | avatar" alt=""></div>
              <div class="xingming">{{ groupInfo.userID === i.userID._id ? `${i.markName}(群主)` : i.markName }}</div>
              <div v-if="groupInfo.userID !== i.userID._id" class="right" @click="toLink(i.userID._id)">{{ userID === i.friendID ? '发消息' : '加好友' }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-if="!show || groupInfo.userID === userID" class="footer">
      <van-button :disabled="disabled || num===0?true:false" @click="setGroup">{{ title + (num) }}</van-button>
    </div>
  </div>
</template>

<script>
// 使用此组件优化下i.friendID.name，直接传过来需要的数据，不需要的筛选掉
export default {
  props: {
    data: {
      type: Object,
      default: null
    },
    // 群信息
    groupInfo: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      groupFriend: [],
      num: 0,
      disabled: false
    }
  },
  computed: {
    userID() {
      return this.$store.getters.userInfo.id
    }
  },
  methods: {
    checkUser(item, e) {
      if (!e.target.checked) {
        const index = this.groupFriend.indexOf(item)
        this.groupFriend.splice(index, 1)
        this.num -= 1
      } else {
        this.groupFriend.push(item)
        this.num += 1
      }
    },
    setGroup() {
      this.$emit('checkedPeople', this.groupFriend)
    },
    toLink(fid) {
      if (fid === this.userID) {
        this.$router.push({ path: '/chat', query: { id: fid }})
      } else {
        this.$router.push({ path: '/details', query: { id: fid }})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#groupPepole {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.main {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0.426667rem;
  overflow: hidden;
    background-color: #ffffff;
  .title {
    font-size: 0.586667rem;
    font-weight: 600;
    padding: 0.266667rem;
  }
  .data {
    flex: 1;
    overflow-x: hidden;
   overflow-y: scroll;
  }
  .letter-name {
    font-size: 0.5rem;
    padding: 0.106667rem 0;
    background-color: #f4f4f4;
  }
  .dataList {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.48rem;
    padding: 0.266667rem 0;
    .avatar {
      width: 1.066667rem;
      height: 1.066667rem;
      border-radius: 0.266667rem;
      margin-right: 0.426667rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 0.266667rem;
      }
    }
    .icon {
      width: 0.64rem;
      height: 0.64rem;
       margin-right: 0.426667rem;
    }
    .xingming {
      flex: 1;
    }
    .right {
      font-size: 0.373333rem;
      padding: 0.106667rem 0.186667rem;
      background-color: #19bf75;
      border-radius: 0.106667rem;
    }
  }
}
.footer {
  height: 1.066667rem;
  padding: 0 0.266667rem;
  margin-bottom: 0.266667rem;
  border-radius: 0.16rem;
  position: relative;
  background-color: #ffffff;
  z-index: 1;
  .van-button {
  border-radius: 0.16rem;
  box-shadow:  0 0 0.16rem #c0afaf;
  width: 100%;
  height: 100%;
  line-height: 1.066667rem;
  text-align: center;
  background-color: #FFE431;
  font-size: 0.48rem;
  }
}
</style>
