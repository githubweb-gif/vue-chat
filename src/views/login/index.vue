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
      <van-form :show-erro="false" @submit="login">
        <van-field
          v-model="loginForm.name"
          name="用户名"
          label="用户名"
          placeholder="请输入名字/邮箱"
          :rules="rules.name"
          @blur="message = ''"
        />
        <van-field
          v-model="loginForm.password"
          :type="passwordType"
          name="pattern"
          label="密码"
          placeholder="请输入密码"
          :rules=" rules.password"
          @blur="message = ''"
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
          <van-button :disabled="disabled" round block type="info" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
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
        name: [{ required: true, message: '请输入名字/邮箱', trigger: 'onBlur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'onBlur' },
          { pattern: /^[\s\S]{6,18}$/, message: '长度在 6 到 18 个字符', trigger: 'onBlur' }
        ]
      },
      message: '',
      passwordType: 'password',
      disabled: false
    }
  },
  methods: {
    login() {
      this.disabled = true
      this.$store
        .dispatch('login', this.loginForm)
        .then((res) => {
          this.$router.push({ path: '/' })
        })
        .catch(() => {
          this.message = '用户名或密码错误'
        })
    },
    pwdType() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
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
  display: flex;
  justify-content: center;
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
</style>
