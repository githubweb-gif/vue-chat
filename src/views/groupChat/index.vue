<template>
  <div id="group">
    <group-pepole title="创建" :show="false" :disabled="disabled" :data="data" @checkedPeople="setGroup">
      <template v-slot:header>
        <div class="header">
          <div class="close" @click="$router.push('/')">取消</div>
          <div class="set">创建群聊</div>
        </div>
      </template>
      <template v-slot:opsition>
        <div class="opsition">
          <van-uploader :after-read="afterRead">
            <div class="cover">
              <img src="../../assets/img/群聊.png" alt="">
            </div>
          </van-uploader>
          <div class="name">
            <input v-model="name" type="text" placeholder="群名称">
          </div>
        </div>
      </template>
    </group-pepole>
    <cropper-vue :is-crop="isCrop" :imgurl="imgurl" class="cropper" @upload="upload" />
  </div>
</template>

<script>
import { getAllFriend, setGroup } from '@/api/user'
import cropperVue from '@/components/cropper.vue'
import groupPepole from '@/components/groupPepole.vue'
export default {
  components: {
    cropperVue,
    groupPepole
  },
  data() {
    return {
      data: {},
      name: '',
      isCrop: false,
      imgurl: '',
      disabled: false,
      img: ''
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
        this.data = res.data
      })
    },
    afterRead(file) {
      this.isCrop = !this.isCrop
      this.imgurl = file.content
    },
    upload(value) {
      this.img = value
    },
    setGroup(data) {
      const test = /^[a-z0-9_-]{3,16}$/
      if (!test.test(this.name) || this.img === '') {
        this.$dialog.alert({
          message: '用户名或头像错误'
        })
        return
      }
      this.disabled = true
      const obj = { name: this.name, userID: this.oneSelf.id, avatar: this.img, username: this.oneSelf.name, groupFriend: data }
      setGroup(obj).then((res) => {
        this.$router.push('/')
      }).catch(() => {
        this.$dialog.alert({
          message: '创建失败'
        })
        this.disabled = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/header.scss';
.header {
  position: relative;
  background-color: #ffffff;
  font-size: 0.5rem;
  margin-bottom: 0.8rem;
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
  padding: 0 0.427rem;
  margin-bottom: 0.5rem;
  .cover {
    margin-bottom: 0.8rem;
    background-color: #ffe431;
    padding: 0.24rem;
    border-radius: 0.53rem;
    box-shadow: 0 0.48rem 0.5rem 0 rgba(39,40,50,0.10);
    img {
      width: 2.13rem;
      height: 2.13rem;
      border-radius: 0.53rem;
      display: block;
    }
  }
  .name {
    width: 100%;
    height: 1.267rem;
    border-radius: 0.613rem;
    input {
      border-radius: 0.613rem;
      background: #F3F4F6;
      padding: 0 0.53rem;
      width: 100%;
      height: 100%;
      border: 0;
      outline: none;
      font-size: 0.427rem;
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
</style>
