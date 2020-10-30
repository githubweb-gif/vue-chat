<template>
  <div id="login">
    <header>
      <p class="registered">
        <router-link to="/registered">注册</router-link>
      </p>
    </header>
    <div class="logo">
      <img src="../../assets/img/火.png" alt="">
    </div>
    <div class="submit">
      <div class="hello">
        <p>登录</p>
        <span>你好，欢迎来到火火</span>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="rules" class="demo-ruleForm">
        <el-form-item prop="name">
          <el-input
            v-model="loginForm.name"
            placeholder="请输入名字/邮箱"
            @blur="message = ''"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            @blur="message = ''"
          />
          <span
            class="iconfont"
            :class="passwordType === 'password' ? 'icon-eye2' : 'icon-eye'"
            @click="pwdType"
          />
        </el-form-item>
        <span class="message" style="color: red">{{ message }}</span>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        name: 'admin',
        password: '123456'
      },
      rules: {
        name: [{ required: true, message: '请输入名字/邮箱', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      },
      message: '',
      passwordType: 'password'
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch('login', this.loginForm)
            .then((res) => {
              this.$router.push({ path: '/' })
            })
            .catch(() => {
              this.message = '用户名或密码错误'
            })
        } else {
          return false
        }
      })
    },
    pwdType() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
}
header {
  width: 100%;
  height: 1.173333rem;
  line-height: 1.173333rem;
  margin-bottom: 1.066667rem;
  p {
    float: right;
    font-size: 0.48rem;
    margin-right: 0.746667rem;
    font-weight: 600;
  }
}
.logo {
  text-align: center;
  margin-bottom: 0.72rem;
  img {
    width: 2.56rem;
  }
}
.submit {
  flex: 1;
  padding: 0 0.826667rem;
  .hello {
    margin-bottom: 0.96rem;
    p {
      font-size: 0.746667rem;
      margin-bottom: 0.186667rem;
      font-weight: 600;
    }
    span {
      font-size: 0.533333rem;
      color: rgba(39, 40, 50, 0.5);
    }
  }
}

.el-form {
  .message {
    margin-left: 0.4rem;
    font-size: 0.373333rem;
  }
  .iconfont {
    font-size: 0.32rem;
  }
  .btn {
    box-sizing: border-box;
    .el-button {
      width: 100%;
      height: 1.28rem;
      background-color: #ffe431;
      border: 0;
      border-radius: 0.64rem;
      color: #222;
      font-size: 0.426667rem;
      font-weight: 600;
    }
  }
  .el-form-item {
    position: relative;
    margin-bottom: 0.586667rem;
    .el-input {
      font-size: 0.373333rem;
    }
    span {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
