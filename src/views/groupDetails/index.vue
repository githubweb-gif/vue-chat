<template>
  <div id="groupDetails">
    <div class="header top">
      <div class="back">
        <span class="link el-icon-arrow-left" @click="$router.go(-1)" />
      </div>
      <van-uploader v-if="groupInfo.userID === userID" :after-read="afterRead">
        <span :style="{color:'#1a73e8'}" class="el-icon-edit" @click="isCrop=!isCrop" />
      </van-uploader>
    </div>
    <div v-if="groupInfo.avatar" class="cover">
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
          <div @click="toLeft=true">
            <span>成员管理</span>
            <span class="el-icon-arrow-right" />
          </div>
        </div>
        <div class="list">
          <div v-for="(item,index) in groupPepole" :key="index" :class="['item', index === 4? 'last-item' : '']" @click="$router.push({path: '/details', query: {id: item.userID._id}})">
            <div class="avatar">
              <img :src="item.userID.avatar | avatar" alt="">
            </div>
            <div class="name">{{ item.markName }}</div>
          </div>
          <div class="addPeople item last-item" @click="toUp=true">
            <div class="icon el-icon-plus avatar" />
            <div class="name">邀请</div>
          </div>
        </div>
      </div>
      <div class="group-name info">
        <div>群名称</div>
        <div class="content">{{ groupInfo.name }}</div>
        <div v-if="groupInfo.userID === userID" class="el-icon-arrow-right" @click="putInfo(groupInfo.name, 'name')" />
      </div>
      <div class="group-bulletin info">
        <div>群说明</div>
        <div class="content">{{ groupInfo.notice }}</div>
        <div v-if="groupInfo.userID === userID" class="el-icon-arrow-right" @click="putInfo(groupInfo.notice, 'notice')" />
      </div>
      <div class="group-markName info">
        <div>群内昵称</div>
        <div class="content">{{ userinfo.markName }}</div>
        <div class="el-icon-arrow-right" @click="putInfo(userinfo.markName, 'markName')" />
      </div>
      <div class="message-setting info">
        <div>消息免打扰</div>
        <van-switch v-model="checked" active-color="#ffe431" size="24px" @change="change" />
      </div>
    </div>
    <div class="logout-group" @click="deleteGroupUser">{{ groupInfo.userID === userID? '解散群聊': '退出群聊' }}</div>
    <transition name="fade">
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
    </transition>
    <transition name="toUp">
      <group-pepole v-if="toUp" title="添加" :add-friend="false" :group-info="groupInfo" :show="show" class="listPepole" :data="dataList" @checkedPeople="checkedPeople">
        <template v-slot:header>
          <div class="header">
            <div class="close" @click="toUp=false">取消</div>
          </div>
        </template>
        <template v-slot:opsition>
          <van-cell-group>
            <van-field v-model="keyWords" placeholder="请输入用户名" @input="searchFriends">
              <template v-slot:left-icon>
                <van-icon name="search" size="24" />
              </template>
            </van-field>
          </van-cell-group>
        </template>
      </group-pepole>
    </transition>
    <transition name="fade">
      <group-pepole v-if="toLeft" title="刪除" :group-info="groupInfo" :show="show" class="listPepole" :data="allGroupFriend" @checkedPeople="checkedPeople">
        <template v-slot:header>
          <div class="header">
            <div class="back el-icon-arrow-left" @click="toLeft=false" />
          </div>
        </template>
        <template v-slot:opsition>
          <van-cell-group>
            <van-field v-model="keyWords" placeholder="请输入用户名" @input="searchGroupFriends">
              <template v-slot:left-icon>
                <van-icon name="search" size="24" />
              </template>
            </van-field>
          </van-cell-group>
        </template>
      </group-pepole>
    </transition>
    <cropper-Vue :is-fixed="false" :is-crop="isCrop" :imgurl="imgurl" class="cropper" @upload="upload" />
  </div>
</template>

<script>
import { getGroup, getGroupPepole, putGroup, getGroupPepoleInfo, putGroupPepoleInfo, deleteGroupUser, getAllFriend, addGroupUser, searchFriends } from '@/api/user'
import dialogCard from './components/dialog.vue'
import cropperVue from '@/components/cropper.vue'
import groupPepole from '@/components/groupPepole.vue'
import { debounce } from '@/until/methods'
export default {
  components: {
    dialogCard,
    cropperVue,
    groupPepole
  },
  data() {
    return {
      // 群信息
      groupInfo: {},
      // 群好友最多9个
      groupPepole: null,
      bol: false,
      // 绑定修改群信息
      value: '',
      // 向组件传入需要修改的数据
      data: null,
      // 用户信息，判断是否消息免提醒
      userinfo: {},
      // 截图组件是否显示
      isCrop: false,
      // 截图img
      imgurl: '',
      checked: false,
      // 好友
      dataList: null,
      toUp: false,
      // 关键字
      keyWords: '',
      toLeft: false,
      // 全部群成员
      allGroupFriend: null
    }
  },
  computed: {
    GroupID() {
      return this.$route.query.id
    },
    userID() {
      return this.$store.getters.userInfo.id
    },
    // 判断是不是群主
    show() {
      return this.userinfo.userID === this.groupInfo.userID
    }
  },
  watch: {
    value(value) {
      this.data.value = value
    },
    keyWords(value) {
      if (value.trim() === '') {
        this.getAllFriend()
      }
    },
    toLeft(value) {
      if (value && !this.allGroupFriend) {
        this.managementUser()
      }
    },
    toUp(value) {
      if (value && !this.dataList) {
        this.getAllFriend()
      }
    }
  },
  created() {
    this.getGroupInfo()
    this.getUserInfo()
  },
  methods: {
    getGroupInfo() {
      getGroup({ GroupID: this.GroupID }).then((res) => {
        this.groupInfo = res.data
        // 获取群成员
        this.getGroupPepole()
      })
    },
    // 获取群成员
    getGroupPepole() {
      getGroupPepole({ GroupID: this.GroupID }).then((res) => {
        const lord = res.data
        lord.map((x, index) => {
          if (x.userID._id === this.groupInfo.userID) {
            const i = lord.splice(index, 1)
            i[0].markName = `(群主)${i[0].markName}`
            lord.unshift(i[0])
          }
          return x
        })
        this.groupPepole = lord
      })
    },
    // 获取用户信息
    getUserInfo() {
      getGroupPepoleInfo({ userID: this.userID, GroupID: this.GroupID })
        .then((res) => {
          this.userinfo = res.data
          this.checked = this.userinfo.shield !== 0
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
      obj[data.name] = data.value
      if (data.name === 'markName' || data.name === 'shield') {
        putGroupPepoleInfo({ GroupID: this.GroupID, userID: this.userID, info: obj }).then(() => {
          this.getUserInfo()
        })
        return
      }
      putGroup({ GroupID: this.GroupID, userID: this.userID, info: obj }).then(() => {
        this.getGroupInfo()
      })
    },
    upload(value) {
      const data = {
        value,
        name: 'avatar'
      }
      this.accomplish(data)
    },
    afterRead(file) {
      this.isCrop = !this.isCrop
      this.imgurl = file.content
    },
    // 退出群聊
    deleteGroupUser() {
      deleteGroupUser({ GroupID: this.GroupID, userID: this.userID }).then(() => {
        this.$router.push('/')
      })
    },
    // 群消息设置
    change(value) {
      value = value ? 1 : 0
      this.accomplish({ name: 'shield', value })
    },
    // 处理好友是否已经加入过群
    processFriend(obj, bol) {
      for (const i in obj) {
        obj[i].map((x) => {
          if (bol) {
            const ff = JSON.stringify(x.userID)
            x.userID = x.friendID
            x.friendID = JSON.parse(ff)
          }
          this.groupPepole.map((y) => {
            if (y.userID._id === x.friendID._id) {
              // 已经加入过此群
              x.disabled = true
            }
          })
          return x
        })
      }
      this.dataList = obj
    },
    // 获取排序好的群友
    getAllFriend() {
      getAllFriend({ userID: this.userID }).then((res) => {
        this.processFriend(res.data)
      })
    },
    // 添加群友
    checkedPeople(data) {
      addGroupUser({ groupFriend: data, GroupID: this.GroupID }).then(() => {
        this.getGroupPepole()
        this.toUp = false
      })
    },
    // 搜索好友
    searchFriends: debounce(function() {
      if (this.keyWords.trim() === '') {
        return
      }
      searchFriends({ uid: this.userID, key: this.keyWords, pinyin: true }).then((res) => {
        const obj = res.data
        this.processFriend(obj, true)
      })
    }, 500),
    // 成员管理
    managementUser() {
      getGroupPepole({ GroupID: this.GroupID, pinyin: true }).then((res) => {
        console.log(res.data)
        const obj = res.data
        for (const i in obj) {
          obj[i].map((x) => {
            const ff = JSON.stringify(x.userID)
            const uu = JSON.stringify(x.friendID)
            x.friendID = JSON.parse(ff)
            x.userID = JSON.parse(uu)
          })
        }
        this.allGroupFriend = obj
      })
    },
    // 搜索群友
    searchGroupFriends() {}
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
    .close {
      font-size: 0.5rem;
    }
  }
  .van-cell-group {
    border-radius: 0.266667rem;
    margin: 0.267rem;
    .van-field {
    font-size: 0.426rem;
    border-radius: 0.266667rem;
    }
  }
  .top {
    background-color: rgba(255, 255, 255, 0);
    font-size: 0.693rem;
    color: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .cover {
    height: 5.12rem;
    width: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 5.12rem;
      display: block;
    }
  }
  .groupInfo {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #ffffff;
    border-radius: 0.53rem;
    padding: 0 0.427rem;
    .header {
      margin-top:0.267rem;
      margin-bottom: 0.267rem;
      height: auto;
      padding: 0;
      font-size: 0.5rem;
      .name {
        font-weight: 600;
        font-size: 0.7rem;
      }
      .time {
        color: rgba(39,40,50,0.50);
      }
    }
    .Introduction {
      color: #272832;
      margin-bottom: 0.64rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 0.373rem;
      color: #272832;
      letter-spacing: -0.0128rem;
      line-height: 0.64rem;
    }
    .groupPepole {
      margin-bottom: 0.667rem;
      .header {
        font-size: 0.48rem;
        .title {
          font-weight: 600;
        }
        span {
          font-size: 0.373rem;
          color: rgba(39,40,50,0.50);
        }
      }
      .list {
        display: flex;
        flex-wrap: wrap;
        .item {
          margin-right: 0.53rem;
          margin-bottom: 0.427rem;
          width: 1.386rem;
          .avatar {
            border-radius: 0.267rem;
            height: 1.386rem;
            margin-bottom: 0.11rem;
            img {
              display: block;
              width: 100%;
              height: 1.386rem;
              border-radius: 0.267rem;
            }
          }
          .name {
            width: 100%;
            text-align: center;
            font-size: 0.427rem;
            line-height: 0.427rem;
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
            font-size: 0.853rem;
          }
        }
      }
    }
    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.453rem 0;
      font-size: 0.5rem;
      .content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 0.267rem;
        flex: 1;
        color: rgba(39,40,50,0.60);
        font-size: 0.4rem;
      }
    }
  }
  .logout-group {
    text-align: center;
    color: red;
    padding: 0.267rem 0;
    font-size: 0.5rem;
  }
  .listPepole {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f4f4f4;
    z-index: 3;
  }
}
.fade-enter-active,
.fade-leave-active {
   transition: all 0.5s;
}
.fade-enter {
  transform: translateX(100%);
}
.fade-leave-active {
  transform: translateX(100%);
}

.toUp-enter-active,
.toUp-leave-active {
   transition: all 0.5s;
}
.toUp-enter {
  transform: translateY(100%);
}
.toUp-leave-active {
  transform: translateY(100%);
}
</style>
