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
        <li @click="qnMethod({title: 'intr', value:userFrom.intr})">
          <span>签名</span>
          <span class="mid">{{ userFrom.intr }}</span>
          <van-icon class="link" name="arrow" />
        </li>
        <li class="registered">
          <span>注册</span>
          <span class="mid">{{ userFrom.date | dateFormat }}</span>
          <van-icon class="link" name="arrow" />
        </li>
        <li @click="qnMethod({title: 'name',value:userFrom.name})">
          <span>昵称</span>
          <span class="mid">{{ userFrom.name }}</span>
          <van-icon class="link" name="arrow" />
        </li>
        <li>
          <span>性别</span>
          <span v-if="userFrom.sex === 'asexual'" class="mid">中性</span>
          <span v-if="userFrom.sex === 'man'" class="mid">男</span>
          <span v-if="userFrom.sex === 'girl'" class="mid">女</span>
          <van-icon class="link" name="arrow" />
          <el-select class="select" placeholder="请选择" value @change="changeSex">
            <el-option
              v-for="item in genderList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </li>
        <li>
          <span>生日</span>
          <span class="mid">{{ userFrom.birth | dateFormat }}</span>
          <van-icon class="link" name="arrow" />
          <div class="select">
            <el-date-picker
              v-model="birthday"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              @change="changeBirth"
            />
          </div>
        </li>
        <li @click="changeTitle({name: '手机',title: 'phone',value: userFrom.phone})">
          <span>电话</span>
          <span class="mid">{{ userFrom.phone }}</span>
          <van-icon class="link" name="arrow" />
        </li>
        <li @click="changeTitle({name: '邮箱',title: 'email',value: userFrom.email})">
          <span>邮箱</span>
          <span class="mid">{{ userFrom.email }}</span>
          <van-icon class="link" name="arrow" />
        </li>
        <li class="pwd" @click="changeTitle({name: '密码',title: 'password',value: '123455'})">
          <span>密码</span>
          <van-icon class="link" name="arrow" />
        </li>
      </ul>
      <div class="logout">
        <span @click="logout">退出应用</span>
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
import { getInfo, modifyUserInfo } from '@/api/user'
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
      genderList: [
        {
          value: 'man',
          label: '男'
        },
        {
          value: 'girl',
          label: '女'
        },
        {
          value: 'asexual',
          label: '中性'
        }
      ],
      userFrom: {},
      content: {}, // 签名/昵称绑定的内容
      birthday: '',
      cropimg: '', // 截图url
      isCrop: false,
      infoCard: false,
      qn: false,
      changeInfo: {} // 向infocard组件传递数据
    }
  },
  computed: {
    id() {
      return this.$route.query.id
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
        location.reload()
      })
    },
    // 获取用户信息
    getUserInfo() {
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
      if (value && value.length > 0) {
        const obj = {
          title: 'sex',
          content: value
        }
        this.modifyInfo(obj)
      }
    },
    // 改变生日
    changeBirth(value) {
      if (value && value.length > 0) {
        const obj = {
          title: 'birth',
          content: value
        }
        this.modifyInfo(obj)
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
  .select {
    position: absolute;
    opacity: 0;
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
  }
  ul li:hover {
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
}
.logout:hover {
  color: rgb(8, 68, 107);
}
</style>
