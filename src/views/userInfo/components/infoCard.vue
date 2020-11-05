<template>
  <div class="ani">
    <div class="header">
      <van-icon name="arrow-left" @click="closeBox" />
    </div>
    <p>请设置密码。你可以用火火绑定的账号+密码登录，比如使用邮箱+密码登录，更快捷。</p>
    <div class="account">
      <div>
        <i class="title">账号</i>
        <span>{{ name }}</span>
      </div>
    </div>
    <van-form :show-erro="false" @submit="ok">
      <van-field
        v-model="form.password"
        label-width="4em"
        :error="false"
        name="pattern"
        type="password"
        label="密码"
        placeholder="这里输入密码"
        :rules="rules.password"
      />
      <van-field
        v-if="changeInfo.title && changeInfo.title.indexOf('password') === -1 && changeInfo.value"
        v-model="changeInfo.value"
        label-width="4em"
        :disabled="true"
        :label="'原' + changeInfo.name"
      />
      <van-field
        v-if="changeInfo.title.indexOf('password') === -1"
        v-model="form.content"
        label-width="4em"
        name="validator"
        :label="'新' + changeInfo.name"
        :error="false"
        :rules="changeInfo.title==='phone'? rules.phone : rules.email"
      />
      <van-field
        v-else
        v-model="form.content"
        label-width="4em"
        name="pattern"
        :type="passwordType"
        :label="'新' + changeInfo.name"
        :error="false"
        :rules="rules.password"
      >
        <template v-slot:right-icon>
          <span
            class="iconfont"
            :class="passwordType === 'password' ? 'icon-eye2' : 'icon-eye'"
            @click="pwdType"
          />
        </template>
      </van-field>
      <van-field
        v-if="changeInfo.title && changeInfo.title.indexOf('password') !== -1"
        v-model="form.verify"
        label-width="4em"
        :type="passwordType"
        name="pattern"
        label="确认密码"
        :error="false"
        :rules="rules.password"
      />
      <van-field
        v-if="changeInfo.title && changeInfo.title.indexOf('email') !== -1"
        v-model="form.code"
        label-width="4em"
        type="number"
        name="pattern"
        label="验证码"
        :error="false"
        :rules="rules.code"
      >
        <template v-slot:right-icon>
          <button type="button" @click="getCode">获取验证码</button>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          完成
        </van-button>
      </div>
    </van-form>
    <div class="tip">
      密码必须是8-16位的字符，字符组合(不能纯数字)
      <div>忘记原密码？</div>
    </div>
  </div>
</template>

<script>
import { getCode } from '@/api/user'
import { validName, validEmail } from '@/until/validate'
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
      },
      passwordType: 'password',
      // 表单验证规则
      rules: {
        phone: [
          { pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '请输入正确的手机号码', trigger: 'onBlur' },
          { required: true, message: '请输入手机号码', trigger: 'onBlur' }
        ],
        email: [
          {
            required: true,
            validator: this.checkEmail,
            trigger: 'onBlur',
            message: '请输入正确的邮箱'
          }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'onBlur' },
          { pattern: /^[\s\S]{6,18}$/, message: '长度在 6 到 18 个字符', trigger: 'onBlur' }
        ],
        code: [
          { required: true, message: '请填写验证码', trigger: 'onBlur' },
          { pattern: /^[\s\S]{6}$/, message: '6个字符', trigger: 'onBlur' }
        ]
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
        if (this.form.verify !== this.form.content) {
          alert('密码不相等')
          return
        }
        obj['verify'] = this.form.verify
      }
      this.$emit('modify', obj)
      this.initData()
    },
    getCode() {
      getCode({ email: this.form.content }).then((res) => {
        console.log(res)
      })
    },
    // 明文和密码切换
    pwdType() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    async checkName(value) {
      const name = /^[a-z0-9_-]{3,12}$/
      if (name.test(value)) {
        const valid = await validName(value)
        if (valid) {
          this.rules.name[0].message = '名称已被占用'
          return false
        } else {
          return true
        }
      } else {
        this.rules.name[0].message = '名称不正确，3 到 12 个字符'
        return false
      }
    },
    async checkEmail(value) {
      const email = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
      if (value.trim() === '') {
        this.rules.email[0].message = '请输入邮箱'
        return false
      } else if (!email.test(value)) {
        this.rules.email[0].message = '请输入正确的邮箱'
        return false
      } else {
        const valid = await validEmail(value)
        if (valid) {
          this.rules.email[0].message = '邮箱已被占用'
          return false
        } else {
          return true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/header.scss";
.header {
  padding: 0 0.426667rem;
  .van-icon {
    font-size: 0.64rem;
    font-weight: 600;
  }
  .ok {
    padding: 0.133333rem 0.32rem;
    background-color: #24b410;
    border-radius: 0.106667rem;
    color: #ffff;
  }
}
.ani {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #ffff;
  z-index: 3;
  p {
    margin-bottom: 0.533333rem;
    font-size: 0.373333rem;
    color: #808580;
  }
  .account,.tip,p {
    padding: 0 0.426667rem;
  }
  .account {
    height: 1.066667rem;
    line-height: 1.066667rem;
    color: #808580;
    margin-bottom: 0.586667rem;
    div {
      border-bottom: 0.026667rem solid #808580;
      span {
      padding: 0 0.4rem;
    }
    .title {
      display: inline-block;
      width: 1.6rem;
      padding-right: 0.32rem;
      box-sizing: border-box;
    }
    }
  }
  .tip {
    font-size: 0.373333rem;
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
    height: 100%;
  }
}
</style>
