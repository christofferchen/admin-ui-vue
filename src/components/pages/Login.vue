<template>
  <el-row class="loginbg">
    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px" class="login-container">
      <h3 class="title">欢迎登陆{{ this.$appConfig.title }}</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model.trim="loginForm.username" @keyup.enter.native="login" auto-complete="off" placeholder="账号">
          <template slot="prepend">
            <i class="fa fa-user"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" @keyup.enter.native="login" auto-complete="off" placeholder="密码">
          <template slot="prepend">
            <i class="fa fa-lock"></i>
          </template>
        </el-input>
      </el-form-item>
      <!-- <el-checkbox v-model="remember" class="remember">记住密码</el-checkbox> -->
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="login" :loading="loading">
          <i class="fa fa-sign-in"></i> 登录</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      remember: false,
      loading: false,
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    let user = localStorage.getItem('user')
    if (user) {
      this.loginForm.username = user.username
      this.loginForm.password = user.PassWord
    }
  },
  methods: {
    getQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let url = location.href
      let num = url.indexOf('?')
      let params = url.substr(num + 1)
      let r = params.match(reg)
      if (r != null) return unescape(r[2])
      return null
    },
    login () {
      let self = this
      if (self.loading) return false

      self.$refs.loginForm.validate(valid => {
        if (valid) {
          self.loading = true
          self.$api.membership
            .login(self.loginForm)
            .then(data => {
              sessionStorage.setItem('user', JSON.stringify(data.user))
              sessionStorage.setItem('token', data.token)
              if (self.remember) {
                localStorage.setItem('user', {
                  UserName: self.loginForm.username,
                  PassWord: self.loginForm.password
                })
              }
              self.$api.membership.getMenu().then(result => {
                self.$auth.init(result)

                let lastPage = self.getQueryString('lastPage')
                if (lastPage) {
                  self.$router.replace({ path: lastPage })
                } else {
                  if (data.user.Type === 1) {
                    self.$router.replace({ path: '/' })
                  } else {
                    self.$router.replace({ path: '/merchantInfo' })
                  }
                }
              })
            })
            .catch(() => {
              self.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.loginbg {
  background: #3e96c9 url(../../assets/loginbg3.png) no-repeat center center;
  height: 100%;
}

.login-container {
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  /* box-shadow: 0 0 25px #cac6c6;*/
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
