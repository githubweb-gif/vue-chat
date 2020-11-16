<template>
  <div>
    <header>
      <div class="back">
        <router-link to="/login"><van-icon name="arrow-left" /></router-link>
      </div>
    </header>
    <div class="submit">
      <div class="hello">
        <p>注册</p>
      </div>
      <van-form :show-erro="false" @submit="submitForm">
        <van-field
          v-model="loginForm.name"
          label-width="3em"
          :error="false"
          name="validator"
          label="用户名"
          placeholder="请取个名字"
          :rules="rules.name"
          @focus="rules.name[0].message = '名称不正确，3 到 12 个字符'"
        />
        <van-field
          v-model="loginForm.email"
          name="validator"
          label-width="3em"
          :error="false"
          label="邮箱"
          type="email"
          placeholder="请输入邮箱"
          :rules="rules.email"
          @focus="rules.email[0].message = '请输入正确的邮箱'"
        />
        <van-field
          v-model="loginForm.code"
          label-width="3em"
          name="pattern"
          label="验证码"
          :error="false"
          placeholder="请输入验证码"
          :rules="rules.code"
        >
          <template v-slot:right-icon>
            <span class="code" @click="getCode">获取验证码</span>
          </template>
        </van-field>
        <van-field
          v-model="loginForm.password"
          label-width="3em"
          :type="passwordType"
          name="pattern"
          label="密码"
          :error="false"
          placeholder="这里输入密码"
          :rules=" rules.password"
        >
          <template v-slot:right-icon>
            <span
              class="iconfont"
              :class="passwordType === 'password' ? 'icon-eye2' : 'icon-eye'"
              @click="pwdType"
            />
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button :disabled="isDisabled" round block type="info" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { validName, validEmail } from '@/until/validate'
import { getCode } from '@/api/user'
export default {
  data() {
    return {
      // 明文和密码切换
      passwordType: 'password',
      // 提交按钮的禁用
      isDisabled: false,
      // 注册表单
      loginForm: {
        name: '',
        password: '',
        email: '',
        code: ''
      },
      // 表单验证规则
      rules: {
        name: [
          {
            required: true,
            validator: this.checkName,
            message: '名称不正确，3 到 12 个字符',
            trigger: 'onBlur'
          }
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
    // 提交注册
    submitForm() {
      this.isDisabled = true
      this.$store.dispatch('registered', this.loginForm).then((res) => {
        this.$router.push('/login')
      }).catch(() => {
        this.isDisabled = false
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
    // 获取验证码
    getCode() {
      const email = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
      if (!email.test(this.loginForm.email)) {
        alert('请输入合法邮箱')
        return
      }
      getCode({ email: this.loginForm.email })
        .then((data) => {
          alert('验证码已发送注意查收')
        })
        .catch(() => {})
    },
    async checkName(value) {
      const name = /^[\s\S]{2,12}$/
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
header {
  width: 100%;
  height:1.173333rem;
  margin-bottom: 1.066667rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  padding: 0 0.426667rem;
  box-sizing: border-box;
}
.submit {
  padding: 0.72rem 0.6rem 0;
  .hello {
    margin-bottom: 0.96rem;
    p {
      font-size: 0.746667rem;
      font-weight: 600;
    }
  }
}
</style>
