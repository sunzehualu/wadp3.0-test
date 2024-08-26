<template>
  <div class="login">
    <div class="content">
      <div class="content_right">
        <el-tabs v-model="activeName">
          <el-tab-pane label="账密登录" name="first">
            <el-form
              ref="loginForm"
              :model="loginForm"
              :rules="loginRules"
              class="login-form"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  type="text"
                  auto-complete="off"
                  placeholder="请输入用户名"
                >
                  <svg-icon
                    slot="prefix"
                    icon-class="user"
                    class="el-input__icon input-icon"
                    style="
                      color: #5ba8f6;
                      font-size: 20px;
                    "
                  />
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  auto-complete="off"
                  placeholder="请输入密码"
                  @keyup.enter.native="handleLogin"
                >
                  <svg-icon
                    slot="prefix"
                    icon-class="password"
                    class="el-input__icon input-icon"
                    style="color: #5ba8f6;"
                  />
                </el-input>
              </el-form-item>
              <el-form-item prop="code" v-show="isShowCode">
                <el-input
                  v-model="loginForm.code"
                  auto-complete="off"
                  placeholder="请输入验证码"
                  style="width: 71%"
                  @keyup.enter.native="handleLogin"
                >
                  <svg-icon
                    slot="prefix"
                    icon-class="validCode"
                    class="el-input__icon input-icon"
                    style="color: #5ba8f6;"
                  />
                </el-input>
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
              </el-form-item>
              <el-checkbox
                v-model="loginForm.rememberMe"
                style="margin: 0px 0px 25px 0px; color: #8b8888"
                >记住密码</el-checkbox
              >
              <el-form-item style="width: 100%">
                <el-button
                  :loading="loading"
                  size="medium"
                  type="primary"
                  style="width: 100%; height: 42px"
                  @click.native.prevent="handleLogin"
                >
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="扫码登录" name="second" v-if="wxFlag">
            <codeLogin />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span style="color: white">Copyright©2022 河北省地理信息集团有限公司</span
      ><span style="margin-left: 15px">v\{{ wadpVersion }}</span>
    </div>
  </div>
</template>

<script>
/**
 * 登录页面
 * 功能：
 *  1.用户登录
 *  2.选择是账号密码登录，还是扫码登录
 */
import { getCode } from '@/api/framework/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import codeLogin from '@/views/login/wxLogin/codeLogin.vue'

export default {
  name: 'Login',
  components: { codeLogin },
  data() {
    return {
      codeUrl: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        code: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
      },
      loading: false,
      redirect: undefined,
      isShowCode: false,
      activeName: 'first',
      wxFlag: false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getConfigKey('wx.flag').then(response => {
      this.wxFlag = JSON.parse(response.msg)
    })
    this.getCode()
    this.getCookie()
    this.enterLogin()
  },
  methods: {
    /**存在预填写用户名密码的情况下，允许使用回车登录 */
    enterLogin() {
      document.onkeydown = e => {
        e = window.event || e
        if (
          this.$route.path == '/login' &&
          (e.code == 'Enter' || e.code == 'enter' || e.code == 'NumpadEnter')
        ) {
          if (e.target.type == 'password') {
            //当前光标所在输入框进行判断
            if (
              this.loginForm.password == e.target.value ||
              e.target.value == null
            ) {
              this.handleLogin()
            }
          } else {
            if (
              this.loginForm.username == e.target.value ||
              e.target.value == null
            ) {
              //对于中文输入法的回车登录限制
              this.handleLogin()
            }
          }
        }
      }
    },
    /**
     * 查询是否开启验证码，如果开启的话展示验证码
     */
    getCode() {
      getCode().then(res => {
        this.isShowCode = res.captchaEnabled
        if(this.isShowCode){
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), {
              expires: 30
            })
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30
            })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.$router
                .push({ path: this.redirect || '/index' })
                .catch(() => {})
            })
            .catch(() => {
              this.loading = false
              this.getCode()
            })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../../assets/images/login-background.jpg');
  background-size: 100% 100%;
}

.title {
  font-size: 30px;
  margin: 0px auto 30px 9px;
  text-align: left;
  color: #666666;
}

.login-form {
  width: 22%;
  float: right;
  border-radius: 6px;
  width: 420px;

  .el-input {
    height: 48px;

    input {
      height: 45px;
      padding-left: 44px;
    }
  }

  .input-icon {
    height: 35px;
    width: 18px;
    margin: 0 5px 0 5px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 25%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: rgb(20, 16, 16);
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
.login-form .el-input__inner {
  border: 0px;
  box-shadow: inset 0 0 0 1000px rgb(245 250 254);
  -webkit-box-shadow: 0 0 0 1000px rgb(245 250 254) inset;
}
.content {
  width: 100%;
}
.content_right {
  width: 420px;
  position: absolute;
  right: calc(6.875vw + 35px);
  top: calc((100vh - 418px) / 2);
}
</style>
