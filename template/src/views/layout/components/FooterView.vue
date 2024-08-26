<template>
  <div class="footer">
    <p>{{ footerView }}</p>
  </div>
</template>

<script>
/**
 * 脚注
 * 功能：
 *   显示设置的脚注内容
 */
export default {
  name: 'FooterView',
  components: {
  },
  data(){
    return{
      footerView:'Copyright © 2022 河北省地理信息集团版本所有'
    }
  },
  computed: {
  },
  created() {
    this.getConfigKey("layout.components.footerView").then(response => {
      this.footerView = response.msg;
    });
  },
}
</script>

<style lang="scss" scoped>
.footer{background: #F4F6FB;padding-bottom: 15px;padding-top: 20px;position: fixed;
    bottom: 0;
    width: 100%;}
.footer p{text-align: center;font-size: 12px;height: 20px;line-height: 20px;margin: 0;color: #B0A9AC;}
</style>
 