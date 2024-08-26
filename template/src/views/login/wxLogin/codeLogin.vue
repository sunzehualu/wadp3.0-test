<template>
    <!-- 扫码登录 -->
    <div class="code" id="wx_qrcode">
    </div>
</template>

<script>
/**
 * 扫码登录页面
 * 功能：
 *   用户可通过企业微信扫码登录
 */
export default {
    name:"codeLogin",
    data() {
        return {
          corpid:"",
          agentid:"",
          redirectUrl:"",
        };
    },
    watch: {
        "$route.query": {
            handler(newVal, oldVal) {
              this.code = this.$route.query["code"];
              this.code && this.getStaffInfo(); //获取到code，调用后端接口换取token
            },
            deep: true,
            immediate: true,
        },
    },
    mounted(){
        //2.根据参数构造二维码
      this.initWxParam()
    },
    methods: {
       async initWxParam(){
            //1.初始化企业微信参数
            await this.getConfigKey("wx.corpid").then(response => {
              this.corpid = response.msg;
            });
            await this.getConfigKey("wx.agentid").then(response => {
              this.agentid = response.msg;
            });
            await this.getConfigKey("wx.redirectUrl").then(response => {
              this.redirectUrl = response.msg;
            });
            await this.initCode();
        },
         // 构造实例
        initCode() {
            new WwLogin({
                id: "wx_qrcode",
                // [appid] 企业微信的CorpID，在企业微信管理端查看
                appid: this.corpid,
                // [agentid] 授权方的网页应用ID，在具体的网页应用中查看
                agentid: this.agentid,
                // [redirect_uri] 重定向地址，需要进行UrlEncode
                redirect_uri: encodeURIComponent(`${this.redirectUrl}loginBindPc`),
                // [state] 用于保持请求和回调的状态，授权请求后原样带回给企业。
                // 该参数可用于防止csrf攻击（跨站请求伪造攻击），建议企业带上该参数，可设置为简单的随机数加session进行校验
                state: 'STATE',	//这里可使用上面appid
                // [href] 自定义样式链接，企业可根据实际需求覆盖默认样式
                href:"data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDIwMHB4O30NCi5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDogMjAwcHg7fQ0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30=",
                lang: "zh",
            });
        },
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.code {
  box-shadow: none;;
  border-radius: 9px;
  background: #ffffff;
  background-size: cover;
  background-position: center 0px;
  width: 390px;
  height: 350px;
  padding: 25px 0px 5px 0px;
  text-align: center !important;
}
</style>
