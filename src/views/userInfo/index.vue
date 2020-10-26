<template>
  <div id="userInfo">
    <div class="main">
      <ul>
        <li class="avatar">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="changeAvatar"
          >
            <div class="upload">
              <span>头像</span>
              <div class="mid">
                <img v-if="userFrom.avatar" :src="baseUrl+userFrom.avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
              <span class="link el-icon-arrow-right" />
            </div>
          </el-upload>
        </li>
        <li @click="qnMethod({title: 'intr', value:userFrom.intr})">
          <span>签名</span>
          <span class="mid">{{ userFrom.intr }}</span>
          <span class="link el-icon-arrow-right" />
        </li>
        <li class="registered">
          <span>注册</span>
          <span class="mid">{{ userFrom.date | dateFormat }}</span>
          <span class="link el-icon-arrow-right" />
        </li>
        <li @click="qnMethod({title: 'name',value:userFrom.name})">
          <span>昵称</span>
          <span class="mid">{{ userFrom.name }}</span>
          <span class="link el-icon-arrow-right" />
        </li>
        <li>
          <span>性别</span>
          <span v-if="userFrom.sex === 'asexual'" class="mid">中性</span>
          <span v-if="userFrom.sex === 'man'" class="mid">男</span>
          <span v-if="userFrom.sex === 'girl'" class="mid">女</span>
          <span class="link el-icon-arrow-right" />
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
          <span class="link el-icon-arrow-right" />
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
          <span class="link el-icon-arrow-right" />
        </li>
        <li @click="changeTitle({name: '邮箱',title: 'email',value: userFrom.email})">
          <span>邮箱</span>
          <span class="mid">{{ userFrom.email }}</span>
          <span class="link el-icon-arrow-right" />
        </li>
        <li class="pwd" @click="changeTitle({name: '密码',title: 'password',value: '123455'})">
          <span>密码</span>
          <span class="link el-icon-arrow-right" />
        </li>
      </ul>
      <div class="logout">
        <span @click="logout">退出应用</span>
      </div>
    </div>
    <!-- 裁剪图片 -->
    <div>
      <vue-cropper :is-crop="isCrop" :imgurl="cropimg" @upload="uploadImg" />
    </div>
    <!-- 信息修改框 电话，邮箱，密码 -->
    <div :style="isdym" class="dym dialog">
      <info-card
        :change-info="changeInfo"
        :name="userFrom.name || ''"
        @modify="modifyInfo"
        @close="closeBox"
      />
    </div>
    <!-- 签名， 昵称 -->
    <div :style="isqn" class="qn dialog">
      <qn-card :qn-content="content" @modify="modifyInfo" @close="closeBox" />
    </div>
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
      birthday: '1995-11-24',
      cropimg: '', // 截图url
      isCrop: false,
      isdym: {
        right: '-100%'
      }, // 修改电话，邮箱，密码容器是否显示
      isqn: {
        right: '-100%'
      }, // 修改签名昵称容器是否显示
      changeInfo: {} // 向infocard组件传递数据
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    baseUrl() {
      return this.$store.getters.baseUrl
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
    changeAvatar(file) {
      const fileName = file.name
      const regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/
      if (regex.test(fileName.toLowerCase())) {
        console.log(file)
        console.log(URL.createObjectURL(file.raw))
        this.cropimg = URL.createObjectURL(file.raw)
        this.isCrop = true
      } else {
        this.isCrop = false
        this.$message.error('请选择图片文件')
      }
    },
    closeBox(value) {
      this.isdym.right = '-100%'
      this.isqn.right = '-100%'
      this.isCrop = false
    },
    changeTitle(value) {
      this.changeInfo = !value ? '' : value
      this.isdym.right = '0'
    },
    qnMethod(value) {
      this.content = !value ? {} : value
      this.isqn.right = '0'
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
          this.closeBox()
        })
      }
    },
    // 修改用户信息
    modifyInfo(value) {
      const obj = {}
      console.log(value)
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
@import "../../style/header.scss";
#userInfo {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f4f4f4;
  .qn,
  .dym {
    background-color: #ffff;
    transition: all 0.3s;
  }
  .dialog {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    box-sizing: border-box;
    overflow: hidden;
  }
}
header {
  position: relative;
  .link {
    font-size: 24px;
    font-weight: 600;
  }
  .right {
    flex: 1;
    text-align: center;
    font-size: 20px;
  }
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  .avatar,.registered{
    margin-bottom: 8px;
  }
  .avatar-uploader {
    width: 100%;
  }
  .upload {
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      border-radius: 10px;
    }
    .mid {
      text-align: left;
    }
  }
  .mid {
    flex: 1;
    margin-left: 16px;
    display: flex;
  }
  .select {
    position: absolute;
    opacity: 0;
  }
  ul li {
    display: flex;
    border-bottom: 1px solid #f4f4f4;
    height: 52px;
    padding: 0 16px 0;
    background-color: #ffff;
    justify-content: space-between;
    align-items: center;
    position: relative;
    color: rgba(39, 40, 50, 0.6);
    img {
      height: 52px;
      width: 52px;
    }
  }
  ul li:hover {
    background-color: #f3f4f6;
  }
  ul li span:first-child {
    font-weight: 600;
    color: #222222;
  }
}
.logout {
  margin-top: 8px;
  background-color: #ffff;
  padding: 0 16px 0;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
}
.logout:hover {
  color: rgb(8, 68, 107);
}
</style>
