<template>
  <div id="group">
    <div class="header">
      <div class="close" @click="$router.push('/')">取消</div>
      <div class="set">创建群聊</div>
    </div>
    <div class="opsition">
      <van-uploader :after-read="afterRead">
        <div class="cover" @click="isCrop = !isCrop">
          <img :src="img | avatar" alt="">
        </div>
      </van-uploader>
      <div class="name">
        <input v-model="name" type="text" placeholder="群名称">
      </div>
    </div>
    <div class="main">
      <div class="title">用户</div>
      <div class="data">
        <div v-for="(item,index) in data" :key="index" class="letter">
          <div class="letter-name">{{ index.toUpperCase() }}</div>
          <div v-for="(i,n) in item" :key="n" class="dataList">
            <div class="icon" @click="checkUser(i,$event)" />
            <div class="avatar"><img :src="i.friendID.avatar | avatar" alt=""></div>
            <div class="xingming">{{ i.friendID.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <van-button :disabled="disabled " @click="setGroup">创建({{ num }})</van-button>
    </div>
    <cropper-vue :is-crop="isCrop" :imgurl="imgurl" class="cropper" @upload="upload" />
  </div>
</template>

<script>
import { getAllFriend, setGroup } from '@/api/user'
import cropperVue from '@/components/cropper.vue'
export default {
  components: {
    cropperVue
  },
  data() {
    return {
      isIcon: 'el-icon-check',
      data: {},
      name: '',
      isCrop: false,
      imgurl: '',
      img: 'http://www.huohuo90.com/assets/%E7%BE%A4%E8%81%8A.png',
      num: 0,
      disabled: false,
      groupFriend: []
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
    checkUser(item, e) {
      const className = e.target.className
      if (className.indexOf(this.isIcon) >= 0) {
        e.target.className = 'icon'
        const index = this.groupFriend.indexOf(item)
        this.groupFriend.splice(index, 1)
        this.num -= 1
      } else {
        e.target.className = 'icon' + ' ' + this.isIcon
        this.groupFriend.push(item)
        this.num += 1
      }
      console.log(this.groupFriend)
    },
    initData() {
      getAllFriend({ userID: this.oneSelf.id }).then((res) => {
        this.data = res.data
      })
    },
    afterRead(file) {
      console.log(file)
      this.isCrop = !this.isCrop
      this.imgurl = file.content
    },
    upload(value) {
      console.log(value)
      this.img = value
    },
    setGroup() {
      this.disabled = true
      const test = /^[a-z0-9_-]{3,16}$/
      if (!test.test(this.name) || this.img.trim() === '') {
        alert('用户名或头像错误')
        return
      }
      const obj = { name: this.name, userID: this.oneSelf.id, avatar: this.img, username: this.oneSelf.name, groupFriend: this.groupFriend }
      setGroup(obj).then((res) => {
        console.log(res)
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/header.scss';
#group {
  display: flex;
  flex-direction: column;
}
.header {
  position: relative;
  background-color: #ffffff;
  margin-bottom: 30px;
  .set {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
.opsition {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 20px;
  .cover {
    margin-bottom: 30px;
    background-color: #ffe431;
    padding: 9px;
    border-radius: 20px;
    box-shadow: 0 18px 20px 0 rgba(39,40,50,0.10);
    img {
      width: 80px;
      height: 80px;
      border-radius: 20px;
    }
  }
  .name {
    width: 100%;
    height: 46px;
    border-radius: 23px;
    input {
      border-radius: 23px;
      background: #F3F4F6;
      padding: 0 20px;
      width: 100%;
      height: 100%;
      border: 0;
      outline: none;
      font-size: 16px;
      text-align: center;
    }
    input::-ms-input-placeholder{
        text-align: center;
    }
    input::-webkit-input-placeholder{
        text-align: center;
    }
  }
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 16px;
  overflow: hidden;
  .title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .data {
    flex: 1;
    overflow-x: hidden;
   overflow-y: scroll;
  }
  .dataList {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      margin: 0 16px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    }
    .icon {
      width: 24px;
      height: 24px;
      font-size: 20px;
      padding: 2px;
      background-color: #ffe431;
      border-radius: 50%;
    }
    .xingming {
      font-size: 18px;
    }
  }
}
.footer {
  height: 40px;
  padding: 0 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  position: relative;
  z-index: 1;
  .van-button {
  border-radius: 6px;
  box-shadow:  0 0 6px #c0afaf;
  width: 100%;
  height: 100%;
  line-height: 40px;
  text-align: center;
  background-color: #FFE431;
  }
}
</style>
