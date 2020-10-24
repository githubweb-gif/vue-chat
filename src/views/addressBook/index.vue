<template>
  <div id="addressBook">
    <div class="box">
      <div class="group item">
        <div class="icon">
          <img src="../../assets/img/OIP.jpg" alt="">
        </div>
        <div class="name">群聊</div>
      </div>
    </div>
    <div class="friendList">
      <div v-for="(item,index) in dataList" :key="index" class="box">
        <div class="letter">{{ index }}</div>
        <div v-for="(i,n) in item" :key="n" class="item" @click="$router.push({path: '/chat',query: {id:i.friendID._id}})">
          <div class="avatar">
            <img :src="i.friendID.avatar | avatar" alt="">
          </div>
          <div class="name">
            {{ i.friendID.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllFriend } from '@/api/user'
export default {
  components: {
  },
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
.box {
background-color: #ffffff;
    padding-left: 16px;
}
.item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #16be74;
    padding: 5px 0;
    .name {
        margin-left: 10px;
    }
}
.item:last-child {
   border-bottom: none;
}
.friendList {
    flex: 1;
    .letter {
        padding-top: 5px;
        padding-bottom: 5px;
        background-color: rgb(244, 244, 244);
        margin-left: -16px;
        padding-left: 16px;
    }
}
img {
    width: 52px;
    height: 52px;
}
</style>
