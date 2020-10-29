<template>
  <div id="groupDetails">
    <div class="header top">
      <div class="back">
        <span class="link el-icon-arrow-left" @click="$router.go(-1)" />
      </div>
    </div>
    <div v-if="groupInfo" class="cover">
      <img :src="groupInfo.avatar | avatar" alt="">
    </div>
    <div v-if="groupInfo" class="groupInfo">
      <div class="header">
        <div class="name">{{ groupInfo.name }}</div>
        <div class="time">{{ groupInfo.time | dateFormat }}</div>
      </div>
      <div class="Introduction">
        {{ groupInfo.notice }}
      </div>
      <div v-if="groupPepole" class="groupPepole">
        <div class="header">
          <div class="title">群成员</div>
          <div>
            <span>成员管理</span>
            <span class="el-icon-arrow-right" />
          </div>
        </div>
        <div class="list">
          <div v-for="(item,index) in groupPepole" :key="index" :class="['item', index === 4? 'last-item' : '']" @click="$router.push({path: '/details', query: {id: item.userID._id}})">
            <div class="avatar">
              <img :src="item.userID.avatar | avatar" alt="">
            </div>
            <div class="name">{{ item.userID.name }}</div>
          </div>
          <div class="addPeople item last-item">
            <div class="icon el-icon-plus avatar" />
            <div class="name">邀请</div>
          </div>
        </div>
      </div>
      <div class="group-name info">
        <div>群名称</div>
        <div class="content">{{ groupInfo.name }}</div>
        <div class="el-icon-arrow-right" @click="putInfo(groupInfo.name, 'name')" />
      </div>
      <div class="group-bulletin info">
        <div>群说明</div>
        <div class="content">{{ groupInfo.notice }}</div>
        <div class="el-icon-arrow-right" @click="putInfo(groupInfo.notice, 'notice')" />
      </div>
      <div class="group-markName info">
        <div>群内昵称</div>
        <div class="content">{{ userinfo.markName }}</div>
        <div class="el-icon-arrow-right" @click="putInfo(userinfo.markName, 'markName')" />
      </div>
      <div class="message-setting info">
        <div>消息免打扰</div>
        <van-switch v-model="checked" active-color="#ffe431" size="24px" />
      </div>
    </div>
    <div class="logout-group">退出群聊</div>
    <dialog-card :value="data" :qn-content="bol" @accomplish="accomplish">
      <template>
        <van-cell-group>
          <van-field
            v-model="value"
            rows="4"
            autosize
            type="textarea"
            maxlength="50"
            :placeholder="value"
            show-word-limit
          />
        </van-cell-group>
      </template>
    </dialog-card>
  </div>
</template>

<script>
import { getGroup, getGroupPepole, putGroup, getGroupPepoleInfo, putGroupPepoleInfo } from '@/api/user'
import dialogCard from './components/dialog.vue'
export default {
  components: {
    dialogCard
  },
  data() {
    return {
      checked: false,
      groupInfo: null,
      groupPepole: null,
      bol: false,
      value: '',
      data: null,
      userinfo: {}
    }
  },
  computed: {
    GroupID() {
      return this.$route.query.id
    },
    userID() {
      return this.$store.getters.userInfo.id
    }
  },
  created() {
    this.getGroupInfo()
    this.getGroupPepole()
    this.getUserInfo()
  },
  methods: {
    getGroupInfo() {
      getGroup({ GroupID: this.GroupID }).then((res) => {
        console.log(res)
        this.groupInfo = res.data
      })
    },
    // 获取群成员
    getGroupPepole() {
      getGroupPepole({ GroupID: this.GroupID }).then((res) => {
        console.log(res)
        this.groupPepole = res.data
      })
    },
    // 获取用户信息
    getUserInfo() {
      getGroupPepoleInfo({ userID: this.userID, GroupID: this.GroupID })
        .then((res) => {
          this.userinfo = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    putInfo(value, index) {
      this.data = {
        value,
        name: index
      }
      this.value = value
      this.bol = !this.bol
    },
    accomplish(data) {
      const obj = {}
      obj[data.name] = this.value
      if (data.name === 'markName') {
        putGroupPepoleInfo({ GroupID: this.GroupID, userID: this.userID, markName: this.value }).then(() => {
          this.getUserInfo()
        })
        return
      }
      putGroup({ GroupID: this.GroupID, info: obj }).then(() => {
        this.getGroupInfo()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/header.scss';
#groupDetails {
  position: relative;
  display: flex;
  flex-direction: column;
  .header {
    background-color: #ffffff;
    border: 0;
  }
  .top {
    background-color: rgba(255, 255, 255, 0);
    font-size: 26px;
    color: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .cover {
    height: 192px;
    width: 100%;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .groupInfo {
    flex: 1;
    transform: translateY(-20px);
    background-color: #ffffff;
    border-radius: 20px;
    padding: 20px 16px 0;
    .header {
      margin-bottom: 10px;
      height: auto;
      padding: 0;
      .name {
        font-size: 24px;
        font-weight: 600;
      }
      .time {
        color: rgba(39,40,50,0.50);
      }
    }
    .Introduction {
      color: #272832;
      margin-bottom: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 14px;
      color: #272832;
      letter-spacing: -0.48px;
      line-height: 24px;
    }
    .groupPepole {
      margin-bottom: 25px;
      .header {
        font-size: 18px;
        .title {
          font-weight: 600;
        }
        span {
          font-size: 14px;
          color: rgba(39,40,50,0.50);
        }
      }
      .list {
        display: flex;
        flex-wrap: wrap;
        .item {
          margin-right: 20px;
          margin-bottom: 16px;
          width: 52px;
          .avatar {
            border-radius: 10px;
            height: 52px;
            margin-bottom: 4px;
            img {
              display: block;
              width: 100%;
              height: 52px;
              border-radius: 10px;
            }
          }
          .name {
            width: 100%;
            text-align: center;
            font-size: 16px;
            line-height: 16px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .last-item {
          margin: 0;
        }
        .addPeople {
          .icon {
            background-color: #ffe431;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 32px;
          }
        }
      }
    }
    .info {
      display: flex;
      justify-content: space-between;
      padding: 17px 0;
      .content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 10px;
        flex: 1;
        color: rgba(39,40,50,0.60);
      }
    }
  }
  .logout-group {
    transform: translateY(-20px);
    text-align: center;
    color: red;
    padding: 10px 0;
  }
}
</style>
