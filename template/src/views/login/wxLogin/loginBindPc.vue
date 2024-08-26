<template>
  <div class="login">
    <div class="loginCode" v-if="isShowLoginForm">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <h3 class="title">企业微信绑定</h3>
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" auto-complete="off" placeholder="用户名" type="text" id="userName">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                auto-complete="off"
                placeholder="密码"
                type="password"
                id="passWord"
              >
              </el-input>
            </el-form-item>
            <el-form-item style="width:76%;">
              <el-button
                :loading="loading"
                size="medium"
                class="loginButton"
                @click.native.prevent="wxBind"
              >
                <span v-if="!loading" style="color:white">绑定</span>
                <span v-else>绑 定 中...</span>
              </el-button>
            </el-form-item>
          </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span style="color:white">Copyright©2022  河北省地理信息集团有限公司</span><span style="margin-left:15px">v\{{wadpVersion}}</span>
    </div>
  </div>
</template>

<script>
/**
 * 企业微信绑定
 * 功能：
 *   用户通过企业微信扫码登录，若没有绑定用户，则跳转绑定页面
 */
import { getToken, setToken, removeToken } from '@/utils/auth'
import { wxLogin,wxBindLogin } from '@/api/framework/login'

export default {
    name: "LoginBindPc",
    data() {
        return {
            codeUrl: "",
            cookiePassword: "",
            loginForm: {
                username: "",
                password: "",
                rememberMe: false,
                openid: ""
            },
            loginRules: {
                username: [
                    { required: true, trigger: "blur", message: "用户名不能为空" }
                ],
                password: [
                    { required: true, trigger: "blur", message: "密码不能为空" }
                ]
            },
            loading: false,
            redirect: undefined,
            activeName: "first",
            code:'',
            isShowLoginForm:false
        };
    },
    watch: {
      $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true
        },
        "$route.query": {
            handler(newVal, oldVal) {
              this.code = this.$route.query["code"];
              this.code && this.getStaffInfo(); //获取到code，调用后端接口换取token
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        // 企业微信扫码登录
        getStaffInfo() {
            let that=this
            wxLogin(this.code).then(res => {
              //1.若返回openid标识没有绑定用户，需要跳转绑定页面进行绑定
              if(res.openid){
                that.isShowLoginForm=true
                //缓存openid
                that.$store.commit('SET_OPENID',res.openid);
                //Cookies.set("openid",res.openid , { expires: 30 });
                //1.2.页面刷新
                that.$alert('企业微信未和用户绑定，请将企业微信和用户绑定!', '扫码登录失败', {
                  confirmButtonText: '确定',
                  callback: action => {
                    //这行代码一定要写，不然扫码登录失败后，刷新页面话会重复登录报提示错误
                    that.$router.push({ path: "/loginBindPc" });
                  }
                });
              }
              //2.有绑定的用户，登录成功
              if(res.token){
                 setToken(res.token)
                that.$store.commit('SET_TOKEN', res.token)
                that.$router.push({ path: this.redirect || "/index" }).catch(() => {});
              }
            }).catch(error => {
              reject(error)
            })
        },
        //绑定
        wxBind(){
          this.$refs.loginForm.validate(valid => {
              if (valid) {
                  this.loading = true;
                  this.loginForm.openid = this.$store.getters.openid;
                  //this.loginForm.openid = Cookies.get('openid')
                  wxBindLogin(this.loginForm.username,this.loginForm.password,this.loginForm.openid).then(res =>{
                    setToken(res.token)
                    this.$store.commit('SET_TOKEN', res.token)
                    this.$router.push({ path: this.redirect || "/index" }).catch(() => {});
                  })
              }
          });
        }
      }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: center;
}
@media screen and (max-width: 1800px){
  .login {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: center;
  }
}

.title {
  font-weight:550;
  margin: 15px 0 30px 53px ;
  text-align: left;
  font-size: 25px;
  color:rgb(0, 127, 225);
  letter-spacing: 2px;
}


.login-form {
  box-shadow: none;;
  border-radius: 9px;
  background: #ffffff;
  background-size: cover;
  background-position: center 0px;
  width: 390px;
  height: 400px;
  padding: 25px 0px 5px 0px;
  .el-form-item{
    width: 76%;
    margin:30px auto;
  }

  .el-input {
    height: 43px;

    input {
      height: 43px;
      padding-left: 11px;
      color:rgb(155,155,155);
      box-shadow: 0 0 0px 1000px rgb(255, 255, 255) inset;
    }
    .el-input__inner{
      background-color: transparent !important;
    }
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
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
  color: white;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}
.el-checkbox{
  .el-checkbox__label{
        font-size: 14px;
  }
}

.el-tabs__header {
  padding: 10px 0px;
  position: relative;
  margin: 0 0 -12px;
  background-color: #ffffff;
  border-radius: 9px;
}
.el-tabs--top .el-tabs__item.is-top:last-child {
  padding-left: 70px;
}
.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding: 0 70px;
}
.loginButton {
  width:100%;
  background-color:rgb(0, 127, 225);
  border: none;
  padding: 18px 20px 18px;
  font-size: 18px
}
</style>
