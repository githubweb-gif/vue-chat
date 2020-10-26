<template>
  <div v-if="isGroup" class="groups">
    <div class="header">
      <div class="back">
        <span class="link el-icon-arrow-left" @click="isGroup = false" />
      </div>
      <div class="title">群聊</div>
      <div class="right el-icon-search" />
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
  props: {
    showGroup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isGroup: this.showGroup,
      dataList: []
    }
  },
  computed: {
    oneSelf() {
      return this.$store.getters.userInfo
    }
  },
  watch: {
    showGroup() {
      this.isGroup = true
    },
    isGroup() {
      if (this.isGroup) {
        this.getGroup()
      }
    }
  },
  methods: {
    getGroup() {
      getAllGroup({ userID: this.oneSelf.id }).then((res) => {
        this.dataList = res.data
        console.log(res.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/header.scss';
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
  margin-left: 10px;
}
.right {
  font-size: 20px;
}

.groupList {
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
  .box {
    background-color: #ffffff;
    padding-left: 16px;
    .letter {
      padding-top: 5px;
      padding-bottom: 5px;
      background-color: rgb(244, 244, 244);
      margin-left: -16px;
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
      img {
        width: 52px;
        height: 52px;
      }
    }
    .item:last-child {
      border-bottom: none;
    }
  }
}
</style>
