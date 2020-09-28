<template>
  <div>
    <header>
      <div class="back">
        <router-link to="/login"><span class="el-icon-arrow-left" /></router-link>
      </div>
    </header>
    <div class="logo">
      <img src="../../assets/img/火.png" alt="">
    </div>
    <div class="login">
      <div class="hello">
        <p>注册</p>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="rules" :status-icon="false">
        <el-form-item prop="name">
          <el-input
            v-model="loginForm.name"
            placeholder="请取个名字"
            @blur="validate('name')"
          />
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="请输入邮箱"
            @blur="validate('email')"
          />
          <span class="iconfont icon-185078emailmailstreamline" />
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            placeholder="请输入验证码"
            @blur="validate('code')"
          />
          <span class="code" @click="getCode">获取验证码</span>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="这里输入密码"
            @blur="validate('password')"
          />
          <span
            class="iconfont"
            :class="passwordType === 'password' ? 'icon-eye2' : 'icon-eye'"
            @click="pwdType"
          />
        </el-form-item>
        <el-form-item class="btn">
          <el-button
            :disabled="isDisabled"
            :style="background"
            type="primary"
            @click="submitForm()"
          >注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validName, validEmail } from '@/until/validate'
import { getCode } from '@/api/user'
export default {
  data() {
    const checkEmail = async(rule, value, callback) => {
      const email = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
      if (value.trim() === '') {
        callback(new Error('请输入邮箱'))
      } else if (!email.test(value.trim())) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        const valid = await validEmail(value.trim())
        if (valid) {
          callback(new Error('邮箱已被占用'))
        } else {
          callback()
        }
      }
    }
    const checkName = async(rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('请输入名字'))
      } else if (value.trim().length < 3 || value.trim().length > 12) {
        callback(new Error('长度在 3 到 12 个字符'))
      }
      const valid = await validName(value.trim())
      if (valid) {
        callback(new Error('名字已被占用'))
      } else {
        callback()
      }
    }
    return {
      // 明文和密码切换
      passwordType: 'password',
      // 提交按钮的禁用和切换
      isDisabled: true,
      // 只有状态全部为true时才可以提交表单
      valid: {
        name: false,
        password: false,
        email: false,
        code: false
      },
      // 提交按钮的颜色
      background: {
        backgroundColor: 'rgb(175 169 169)'
      },
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
            validator: checkName,
            trigger: blur
          }
        ],
        email: [
          {
            required: true,
            validator: checkEmail,
            trigger: blur
          }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: blur },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: blur }
        ],
        code: [
          { required: true, message: '请填写验证码', trigger: blur },
          { min: 6, max: 6, message: '6个字符', trigger: blur }
        ]
      }
    }
  },
  watch: {
    valid: {
      deep: true,
      handler() {
        for (const i in this.valid) {
          if (!this.valid[i]) {
            this.isDisabled = true
            this.background.backgroundColor = 'rgb(175 169 169)'
            break
          } else {
            this.isDisabled = false
            this.background.backgroundColor = '#ffe431'
          }
        }
      }
    }
  },
  methods: {
    // 单独验证表单某一字段是否通过
    validate(data) {
      this.$refs.loginForm.validateField(data, (valid) => {
        if (valid === '') {
          this.valid[data] = true
        } else {
          this.valid[data] = false
        }
      })
    },
    // 提交注册
    submitForm() {
      this.$store.dispatch('registered', this.loginForm).then((res) => {
        this.$router.push('/login')
      })
    },
    // 明文和密码切换
    pwdType() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 获取验证码
    getCode() {
      if (!this.valid.email) {
        // alert('请输入合法邮箱')
        return
      }
      getCode({ email: this.loginForm.email })
        .then((data) => {
          console.log(data)
          alert('验证码已发送注意查收')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  height: 44px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30px;
  padding: 0 16px;
  box-sizing: border-box;
}
.logo {
  text-align: center;
  img {
    width: 96px;
  }
}
.login {
  padding: 27px 31px 0;
  .hello {
    margin-bottom: 36px;
    p {
      font-size: 28px;
      font-weight: 600;
    }
  }
}

.el-form {
  .btn {
    padding: 40px 27px 0;
    box-sizing: border-box;
    .el-button {
      width: 100%;
      height: 48px;
      background-color: #ffe431;
      border: 0;
      border-radius: 24px;
      color: #222;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .el-form-item {
    position: relative;
    span {
      position: absolute;
      top: 0;
      right: 0;
    }
    .code {
      background-color: #81afd3;
      padding: 4px 10px;
      border-radius: 14px;
      line-height: 25px;
    }
    .code:hover {
      background-color: rgb(89, 131, 117);
    }
  }
}
</style>
