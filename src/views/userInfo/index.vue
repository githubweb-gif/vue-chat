<template>
  <div id="userInfo">
    <div class="main">
      <div class="avatar">
        <van-uploader :max-size="1000 * 1024" :after-read="afterRead" @oversize="onOversize">
          <div class="upload">
            <div class="cover">
              <img v-if="userFrom.avatar" :src="userFrom.avatar | avatar">
            </div>
          </div>
        </van-uploader>
        <div class="info">
          <div class="name">{{ userFrom.name }}</div>
          <div class="qianming">{{ userFrom.intr }}</div>
          <div class="time">{{ userFrom.birth | dateFormat }}</div>
        </div>
      </div>
      <ul>
        <li>
          <span>签名</span>
          <span class="mid">{{ userFrom.intr }}</span>
          <van-icon v-if="ifFriend" class="link" name="arrow" @click="qnMethod({title: 'intr', value:userFrom.intr})" />
        </li>
        <li class="registered">
          <span>注册</span>
          <span class="mid">{{ userFrom.date | dateFormat }}</span>
          <van-icon v-if="ifFriend" class="link" name="arrow" />
        </li>
        <li>
          <span>昵称</span>
          <span class="mid">{{ userFrom.name }}</span>
          <van-icon v-if="!ifFriend" class="link" name="arrow" @click="qnMethod({title: 'name',value:userFrom.name})" />
        </li>
        <li>
          <span>性别</span>
          <van-field
            readonly
            clickable
            :value="value=userFrom.sex"
            @click="showPicker = true"
          />
          <van-popup v-model="showPicker" round position="bottom">
            <van-picker
              show-toolbar
              :columns="columns"
              @cancel="showPicker = false"
              @confirm="changeSex"
            />
          </van-popup>
          <van-icon v-if="ifFriend" class="link" name="arrow" />
        </li>
        <li>
          <span>生日</span>
          <span class="mid">{{ userFrom.birth | dateFormat }}</span>
          <van-popup v-model="showDate" round position="bottom">
            <van-datetime-picker
              v-model="currentDate"
              type="date"
              title="选择生日"
              :min-date="minDate"
              :max-date="maxDate"
              @confirm="changeBirth"
              @cancel="showDate = false"
            />
          </van-popup>
          <van-icon v-if="ifFriend" class="link" name="arrow" @click="showDate=true" />
        </li>
        <li>
          <span>电话</span>
          <span class="mid">{{ userFrom.phone }}</span>
          <van-icon v-if="ifFriend" class="link" name="arrow" @click="changeTitle({name: '手机',title: 'phone',value: userFrom.phone})" />
        </li>
        <li>
          <span>邮箱</span>
          <span class="mid">{{ userFrom.email }}</span>
          <van-icon v-if="ifFriend" class="link" name="arrow" @click="changeTitle({name: '邮箱',title: 'email',value: userFrom.email})" />
        </li>
        <li v-if="ifFriend" class="pwd">
          <span>密码</span>
          <van-icon class="link" name="arrow" @click="changeTitle({name: '密码',title: 'password',value: '123455'})" />
        </li>
      </ul>
      <div class="logout">
        <span v-if="ifFriend" @click="logout">退出应用</span>
        <span v-else class="del" @click="deleteFriend">刪除好友</span>
      </div>
    </div>
    <!-- 裁剪图片 -->
    <vue-cropper :is-crop="isCrop" :imgurl="cropimg" @upload="uploadImg" />
    <!-- 信息修改框 电话，邮箱，密码 -->
    <transition name="fade">
      <info-card
        v-if="infoCard"
        :change-info="changeInfo"
        :name="userFrom.name || ''"
        @modify="modifyInfo"
        @close="closeBox"
      />
    </transition>
    <!-- 签名， 昵称 -->
    <transition name="fade">
      <qn-card v-if="qn" :qn-content="content" @modify="modifyInfo" @close="closeBox" />
    </transition>
  </div>
</template>

<script>
import { getInfo, getFriendInfo, modifyUserInfo, deleteFriend } from '@/api/user'
import VueCropper from '@/components/cropper.vue'
import InfoCard from './components/infoCard.vue'
import QnCard from './components/qn.vue'
export default {
  naem: 'userInfo',
  components: {
    VueCropper,
    InfoCard,
    QnCard
  },
  data() {
    return {
      columns: ['男', '女'],
      userFrom: {},
      content: {}, // 签名/昵称绑定的内容
      cropimg: '', // 截图url
      isCrop: false,
      infoCard: false,
      qn: false,
      changeInfo: {}, // 向infocard组件传递数据
      value: '',
      showPicker: false,
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(2030, 10, 1),
      currentDate: new Date(),
      showDate: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    uid() {
      return this.$store.getters.userInfo.id
    },
    // 判断是自己还是好友
    ifFriend() {
      return this.id === this.uid
    }
  },
  watch: {
    $route(to, from) {
      console.log(to.path)
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    // 选择文件
    afterRead(file) {
      const regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/
      if (regex.test(file.file.type.toLowerCase())) {
        this.cropimg = file.content
        this.isCrop = !this.isCrop
      } else {
        this.$toast.fail({
          message: '请选择图片文件',
          position: 'top'
        })
      }
    },
    onOversize() {
      this.$toast({
        message: '文件大小不能超过 1Mb',
        position: 'top'
      })
    },
    closeBox(value) {
      this.infoCard = false
      this.qn = false
    },
    changeTitle(value) {
      this.changeInfo = !value ? '' : value
      this.infoCard = true
    },
    qnMethod(value) {
      this.qn = true
      this.content = !value ? {} : value
    },
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.socket.emit('logOut', this.uid)
        location.reload()
      })
    },
    // 获取用户信息
    getUserInfo() {
      // 是好友
      if (!this.ifFriend) {
        getFriendInfo({ id: this.id, uid: this.uid }).then((res) => {
          console.log(res)
          this.userFrom = res.data.userID
          this.userFrom.markName = res.data.markName
        })
        return
      }
      // 是自己
      getInfo(this.id)
        .then((res) => {
          this.userFrom = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 上传图片成功，获取图片地址,更新userinfo,重新获取userinfo
    uploadImg(value) {
      if (value && value.length > 0) {
        modifyUserInfo({ info: { avatar: value }, id: this.id }).then(() => {
          this.getUserInfo()
        })
      }
    },
    // 修改用户信息
    modifyInfo(value) {
      const obj = {}
      obj[value.title] = value.content
      modifyUserInfo({
        id: this.id,
        info: obj,
        password: value.password,
        verify: value.verify
      }).then((res) => {
        this.getUserInfo()
        this.closeBox()
      })
    },
    // 改变性别
    changeSex(value) {
      if (value.length > 0) {
        const obj = {
          title: 'sex',
          content: value
        }
        this.modifyInfo(obj)
        this.value = value
        this.showPicker = false
      }
    },
    // 改变生日
    changeBirth(value) {
      console.log(value)
      const obj = {
        title: 'birth',
        content: value
      }
      this.modifyInfo(obj)
      this.showDate = false
    },
    // 刪除好友
    deleteFriend() {
      if (!this.ifFriend) {
        deleteFriend({ userID: this.uid, friendID: this.id }).then(() => {
          this.$toast.success('刪除成功')
          this.$router.push('/')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#userInfo {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f4f4f4;
  font-size: 0.426667rem;
  .qn {
    background-color: #ffff;
    transition: all 0.3s;
  }
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  }
  .avatar-uploader {
    width: 100%;
  }
.avatar {
  padding: 0 0.426667rem;
  margin-bottom: 0.266667rem;
  display: flex;
  .upload {
    .cover {
      margin-right: 0.266667rem;
      img {
        height: 2.666667rem;
        width: 2.666667rem;
        border-radius: 0.266667rem;
      }
    }
  }
.info {
  text-align: left;
  .name {
    font-size: 0.5rem;
    margin-bottom:  0.2rem;
  }
  .time {
    font-size: 0.373333rem;
    color: rgba(39, 40, 50, 0.6);
  }
  .qianming {
    font-size: 0.373333rem;
    margin-bottom: 0.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 60%;
  }
}
  .mid {
      text-align: left;
    }
  }
  .mid {
    flex: 1;
    margin-left: 0.426667rem;
    display: flex;
  }
  ul {
    margin: 0 0.213333rem 0.213333rem;
    border-radius: 0.266667rem;
    background-color: #ffff;
  }
  ul li {
    display: flex;
    border-bottom: 0.026667rem solid #f4f4f4;
    height: 1.386667rem;
    padding: 0 0.426667rem 0;
    justify-content: space-between;
    align-items: center;
    position: relative;
    color: rgba(39, 40, 50, 0.6);
    font-size: 0.426667rem;
    .van-field {
      flex: 1;
    }
  }
  ul li:hover, ul li .van-field:hover, .van-cell:hover {
    background-color: #f3f4f6;
  }
  ul li span:first-child {
    font-weight: 600;
    color: #222222;
  }
.logout {
  margin: 0 0.213333rem;
  background-color: #ffff;
  padding: 0.266667rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 0.533333rem;
  .del {
    color: red;
  }
}
.logout:hover {
  color: rgb(8, 68, 107);
}
</style>
