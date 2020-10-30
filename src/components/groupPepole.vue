<template>
  <div id="groupPepole">
    <slot name="header" />
    <slot name="opsition" />
    <div class="main">
      <div class="title">用户</div>
      <div class="data">
        <div v-for="(item,index) in data" :key="index" class="item">
          <div class="letter-name">{{ index.toUpperCase() }}</div>
          <div v-for="(i,n) in item" :key="n" class="dataList">
            <input v-if="show && groupInfo.userID !== i.friendID._id" :disabled="i.disabled===true ? true: false" :checked="i.disabled===true ? true: false" class="icon" type="checkbox" @change="checkUser(i,$event)">
            <div class="avatar"><img :src="i.friendID.avatar | avatar" alt=""></div>
            <div class="xingming">{{ groupInfo.userID === i.friendID._id ? `${i.friendID.name}(群主)` : i.friendID.name }}</div>
            <div v-if="groupInfo.userID !== i.friendID._id && addFriend" class="right">{{ userID === i.userID ? '发消息' : '加好友' }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="show" class="footer">
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
    disabled: {
      type: Boolean,
      default: false
    },
    // 非群主隐藏选择框
    show: {
      type: Boolean,
      default: false
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
    // 添加好友为群友
    addFriend: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      groupFriend: [],
      num: 0
    }
  },
  computed: {
    userID() {
      return this.$store.getters.userInfo.id
    }
  },
  methods: {
    checkUser(item, e) {
      console.log(e.target.checked)
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
    margin-bottom: 0.266667rem;
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
    margin-bottom: 0.533333rem;
    font-size: 0.48rem;
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
  }
}
</style>
