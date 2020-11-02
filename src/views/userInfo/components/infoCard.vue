<template>
  <div class="ani">
    <div class="header">
      <span class="link el-icon-arrow-left" @click="closeBox" />
      <div class="ok" @click="ok">完成</div>
    </div>
    <p>请设置密码。你可以用火火绑定的账号+微信密码登录，比如使用邮箱+密码登录，更快捷。</p>
    <el-form label-position="left" label-width="70px">
      <div class="account">
        <i class="title">账号</i>
        <span>{{ name }}</span>
      </div>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item
        v-if="changeInfo.title && changeInfo.title.indexOf('password') === -1 && changeInfo.value"
        :disabled="true"
        :label="'原' + changeInfo.name"
      >
        <el-input v-model="changeInfo.value" />
      </el-form-item>
      <el-form-item :label="'新' + changeInfo.name">
        <el-input v-model="form.content" :type="changeInfo.title" />
      </el-form-item>
      <el-form-item
        v-if="changeInfo.title && changeInfo.title.indexOf('password') !== -1"
        label="确认密码"
      >
        <el-input v-model="form.verify" type="password" />
      </el-form-item>
      <el-form-item
        v-if="changeInfo.title && changeInfo.title.indexOf('email') !== -1"
        class="code"
        label="验证码"
      >
        <el-input v-model="form.code" />
        <button type="button" @click="getCode">获取验证码</button>
      </el-form-item>
    </el-form>
    <span class="tip">
      密码必须是8-16位的数字，字符组合(不能纯数字)
      <div>忘记原密码？</div>
    </span>

  </div>
</template>

<script>
import { getCode } from '@/api/user'
export default {
  props: {
    changeInfo: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {
        password: '',
        verify: '',
        content: '',
        code: ''
      }
    }
  },
  methods: {
    initData() {
      for (const i in this.form) {
        this.form[i] = ''
      }
    },
    closeBox() {
      this.$emit('close', true)
      this.initData()
    },
    ok() {
      const obj = {
        title: this.changeInfo.title,
        content: this.form.content,
        password: this.form.password
      }
      if (this.changeInfo.title === 'password') {
        obj['verify'] = this.form.verify
      }
      this.$emit('modify', obj)
      this.initData()
    },
    getCode() {
      getCode({ email: this.form.content }).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/header.scss";
.header {
  .link {
    font-size: 24px;
    font-weight: 600;
  }
  .ok {
    padding: 5px 12px;
    background-color: #24b410;
    border-radius: 4px;
    color: #ffff;
  }
}
.ani {
  padding: 0 16px;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #ffff;
  z-index: 3;
  p {
    margin-bottom: 20px;
    font-size: 14px;
    color: #808580;
  }
  .account {
    border-bottom: 1px solid #808580;
    height: 40px;
    line-height: 40px;
    color: #808580;
    margin-bottom: 22px;
    span {
      padding: 0 15px;
    }
    .title {
      display: inline-block;
      width: 60px;
      padding-right: 12px;
      box-sizing: border-box;
    }
  }
  .tip {
    font-size: 14px;
    div {
      color: #1a5277;
    }
  }
}
.code {
  position: relative;
  button {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(0, 50%);
  }
}
</style>
