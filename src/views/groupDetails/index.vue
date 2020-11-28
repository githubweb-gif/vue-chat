<template>
  <div id="groupDetails">
    <div class="header top">
      <van-icon name="arrow-left" @click="$router.go(-1)" />
      <div class="title">群聊设置</div>
    </div>
    <div v-if="groupInfo" class="bi">
      <van-uploader v-if="groupInfo.userID === userID" :after-read="afterRead">
        <div class="cover" @click="isCrop=!isCrop">
          <img :src="groupInfo.avatar | avatar" alt="">
        </div>
      </van-uploader>
      <div class="right">
        <div class="group-name">
          {{ groupInfo.name }}
        </div>
        <div class="group-notice">
          {{ groupInfo.notice }}
        </div>
      </div>
    </div>
    <div v-if="groupInfo" class="groupInfo">
      <div v-if="groupPepole" class="groupPepole">
        <div class="header">
          <div class="title">群成员</div>
          <div class="arrow" @click="toLeft=true">
            <span>成员管理</span>
            <van-icon name="arrow" />
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
            <van-icon class="icon" name="plus" />
            <div class="name">邀请</div>
          </div>
        </div>
      </div>
      <div class="group-date info">
        <div>创建时间</div>
        <div class="content">{{ groupInfo.time | dateFormat }}</div>
      </div>
      <div class="group-name info">
        <div>群名称</div>
        <div class="content">{{ groupInfo.name }}</div>
        <van-icon v-if="groupInfo.userID === userID" name="arrow" @click="putInfo(groupInfo.name, 'name')" />
      </div>
      <div class="group-bulletin info">
        <div>群说明</div>
        <div class="content">{{ groupInfo.notice }}</div>
        <van-icon v-if="groupInfo.userID === userID" name="arrow" @click="putInfo(groupInfo.notice, 'notice')" />
      </div>
      <div class="group-markName info">
        <div>群内昵称</div>
        <div class="content">{{ userinfo.markName }}</div>
        <van-icon name="arrow" @click="putInfo(userinfo.markName, 'markName')" />
      </div>
      <div class="message-setting info">
        <div>消息免打扰</div>
        <van-switch v-model="checked" active-color="#ffe431" size="24px" @change="change" />
      </div>
    </div>
    <div class="logout-group" @click="deleteGroupUser">
      <p>{{ groupInfo.userID === userID? '解散群聊': '退出群聊' }}</p>
    </div>
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
      <group-pepole v-if="toUp" title="添加" :show="false" :group-info="groupInfo" class="listPepole" :data="dataList" @checkedPeople="checkedPeople">
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
      <group-pepole v-if="toLeft" title="刪除" :show="true" :group-info="groupInfo" class="listPepole" :data="allGroupFriend" @checkedPeople="deleteGroupFriends">
        <template v-slot:header>
          <div class="header">
            <van-icon class="back" name="arrow-left" @click="toLeft=false" />
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
    <cropper-Vue :is-fixed="true" :is-crop="isCrop" :imgurl="imgurl" class="cropper" @upload="upload" />
    <van-loading v-if="load" class="loading" type="spinner" />
  </div>
</template>

<script>
import { getGroup, getGroupPepole, putGroup, getGroupPepoleInfo, putGroupPepoleInfo, searchGroupUser, deleteGroupUser, addGroupUser, searchFriends, deleteGroupPeople } from '@/api/user'
import dialogCard from './components/dialog.vue'
import cropperVue from '@/components/cropper.vue'
import groupPepole from '@/components/groupPepole.vue'
import { debounce } from '@/until/debounce'
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
      allGroupFriend: null,
      load: true
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
  watch: {
    value(value) {
      this.data.value = value
    },
    keyWords(value) {
      if (value.trim() === '' && this.toUp) {
        this.getAllFriend()
      } else if (value.trim() === '' && this.toLeft) {
        this.managementUser()
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
        this.load = false
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
    processFriend(obj) {
      for (const i in obj) {
        obj[i].map((x) => {
          this.groupPepole.map((y) => {
            if (y.userID._id === x.userID._id) {
              // 已经加入过此群
              x.disabled = true
            }
          })
          return x
        })
      }
      this.dataList = obj
    },
    // 获取排序好的好友
    getAllFriend() {
      searchFriends({ uid: this.userID, key: this.keyWords, pinyin: true }).then((res) => {
        const obj = res.data
        this.processFriend(obj)
      })
    },
    // 添加群友
    checkedPeople(data) {
      addGroupUser({ groupFriend: data, GroupID: this.GroupID }).then(() => {
        this.getGroupPepole()
        // 清空重新获取
        this.dataList = null
        this.allGroupFriend = null
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
        this.processFriend(obj)
      })
    }, 500),
    // 群成员处理
    processGroupPeople(obj) {
      for (const i in obj) {
        obj[i].forEach((x, index) => {
          if (x.userID._id === this.groupInfo.userID) {
            const ll = obj[i].splice(index, 1, undefined)
            obj['群主'] = ll
          }
        })
      }
      const arr = Object.keys(obj)
      const ii = arr.length - 1
      const push = arr.splice(ii, 1)
      arr.unshift(push[0])
      const newObj = {}
      arr.map((x) => {
        newObj[x] = obj[x]
      })
      return newObj
    },
    // 成员管理
    managementUser() {
      getGroupPepole({ GroupID: this.GroupID, pinyin: true, userID: this.userID }).then((res) => {
        const obj = res.data
        this.allGroupFriend = this.processGroupPeople(obj)
      })
    },
    // 搜索群友
    searchGroupFriends: debounce(function() {
      if (this.keyWords.trim() === '') {
        return
      }
      searchGroupUser({ GroupID: this.GroupID, keyWords: this.keyWords }).then((res) => {
        if (res.data.length === 0) {
          this.allGroupFriend = null
          return
        }
        this.allGroupFriend = this.processGroupPeople(res.data)
      })
    }, 500),
    // 刪除群员
    deleteGroupFriends(value) {
      deleteGroupPeople({ GroupID: this.GroupID, data: value }).then(() => {
        this.getGroupPepole()
        this.dataList = null
        this.allGroupFriend = null
        this.toLeft = false
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
  background-color: #f4f4f4;
  .header {
    border: 0;
    padding: 0 0.426667rem;
    .close {
      font-size: 0.5rem;
    }
    .back {
      color: #000000;
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
    .title {
      position: absolute;
      font-size: 0.48rem;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
  .bi {
    width: 100%;
    padding:0.133rem 0.427rem;
    margin-bottom: 0.3rem;
    display: flex;
    justify-content: flex-start;
    background-color: #ffffff;
    .cover {
      border-radius: 0.16rem;
      margin-right: 0.267rem;
      img {
      border-radius: 0.16rem;
      width: 1.387rem;
      height: 1.387rem;
      display: block;
    }
  }
  .right {
    width: 60%;
    .group-name {
    font-size: 0.427rem;
    margin-bottom: 0.133rem;
  }
  .group-notice {
    font-size: 0.373rem;
    color: #c4bcbc;
  }
  .group-name,.group-notice {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  }
}
  .groupInfo {
    overflow-x: hidden;
    overflow-y: auto;
    .groupPepole {
      background-color: #ffffff;
      padding: 0 0.427rem;
      margin-bottom: 0.3rem;
      .header {
        font-size: 0.48rem;
        padding: 0;
        .title {
          font-weight: 600;
        }
        .arrow {
          display: flex;
          align-items: center;
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
            height: 1.386rem;
            border-radius: 0.267rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.853rem;
            margin-bottom: 0.11rem;
          }
        }
      }
    }
    .info {
      background-color: #ffffff;
      padding: 0.4rem 0.427rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.5rem;
      border-bottom: 1px solid #e6e3e3;
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
    background-color: #ffffff;
    overflow: hidden;
    margin-top: 0.4rem;
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
</style>
