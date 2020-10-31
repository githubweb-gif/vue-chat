<template>
  <div id="addressBook">
    <div class="box">
      <div class="group item">
        <div class="icon">
          <img src="../../assets/img/OIP.jpg" alt="">
        </div>
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
  </div>
</template>

<script>
import { getAllFriend } from '@/api/user'
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
    this.initData()
  },
  methods: {
    initData() {
      getAllFriend({ userID: this.oneSelf.id }).then((res) => {
        console.log(res)
        this.dataList = res.data
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
  border-bottom: 0.026667rem solid #16be74;
  padding: 0.133333rem 0;
  .name {
    margin-left: 0.266667rem;
    font-size: 0.533333rem;
  }
  img {
    width: 1.386667rem;
    height: 1.386667rem;
  }
}
.item:last-child {
  border-bottom: none;
}
</style>
