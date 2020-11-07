<template>
  <div id="addressBook">
    <div class="box">
      <div class="group item">
        <svg-icon icon-id="qunliao" />
        <div class="name" @click="$router.push('/groupList')">群聊</div>
      </div>
    </div>
    <div class="friendList">
      <div v-for="(item,index) in dataList" :key="index" class="box">
        <div class="letter">{{ index }}</div>
        <div v-for="(i,n) in item" :key="n" class="item" @click="$router.push({path: '/chat',query: {id:i.userID._id}})">
          <div class="avatar">
            <img :src="i.userID.avatar | avatar" alt="">
          </div>
          <div class="name">
            {{ i.markName }}
          </div>
        </div>
      </div>
    </div>
    <van-loading v-if="load" class="layloading" type="spinner" />
  </div>
</template>

<script>
import { getAllFriend } from '@/api/user'
export default {
  data() {
    return {
      dataList: [],
      load: true
    }
  },
  computed: {
    oneSelf() {
      return this.$store.getters.userInfo
    }
  },
  created() {
    console.log('pppppppppppppppppppppppp')
    this.initData()
  },
  methods: {
    initData() {
      getAllFriend({ userID: this.oneSelf.id }).then((res) => {
        this.dataList = res.data
        this.load = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#addressBook {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgb(244, 244, 244);
  position: relative;
}
.friendList,
.groupList {
  flex: 1;
  .box {
    .letter {
      padding-top: 0.133333rem;
      padding-bottom: 0.133333rem;
      background-color: rgb(244, 244, 244);
      margin-left: -0.426667rem;
      padding-left: 0.426667rem;
      font-size: 0.533333rem;
    }
  }
}
.box {
   background-color: #ffffff;
    padding-left: 0.426667rem;
}
.item {
  display: flex;
  align-items: center;
  border-bottom: 0.026667rem solid #dadddb;
  padding: 0.16rem 0;
  .svg-icon {
    width: 1.2rem;
    height: 1.2rem;
    color: #1aad19;
    border-radius: 0.16rem;
  }
  .name {
    margin-left: 0.266667rem;
    font-size: 0.533333rem;
  }
  img {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 0.16rem;
  }
}
.item:last-child {
  border-bottom: none;
}
</style>
