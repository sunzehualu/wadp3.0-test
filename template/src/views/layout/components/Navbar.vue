<template>
  <div class="navbar" :style="{ 'background-color': settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/>
    <div class="right-menu">
      <div class="menuName">
        您好，\{{ this.$store.getters.name }}
      </div>
      <template v-if="device!=='mobile'">

      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatarUrl" class="user-avatar">
          <i class="el-icon-caret-bottom" :style="{color:settings.sideTheme === 'theme-dark' ? variables.menuText : 'rgba(0,0,0,.65)'}"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
/**
 * 顶部菜单功能栏
 * 功能：
 *   显示顶部菜单栏、用户姓名、用户头像信息
 */
import variables from '../../../style/variables.scss'
import { mapGetters,mapState} from 'vuex'
import Breadcrumb from '../../../views/layout/components/Breadcrumb'
import TopNav from '../../../views/layout/components/TopNav'
import Hamburger from '../../../views/layout/components/Hamburger'
import { getFile } from "../../../api/framework/common"

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    ...mapState(["settings"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    },
    variables() {
      return variables;
    },
  },
  created() {
    this.getAvatarUrl();
  },
  data(){
    return{
      // 头像链接
      avatarUrl: ''
    }
  },
  methods: {
    // 获取头像链接
    getAvatarUrl() {
      // 没有自定义头像，则使用默认头像(id为1)
      getFile(this.avatar).then(res => {
        const url = window.URL.createObjectURL(res);
        this.avatarUrl = url;
      });
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = process.env.BASE_URL + 'index';
        })
      })
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #0c1943;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #000000;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.menuName{
  height: 40px;
  line-height: 41px;
  margin:5px 10px 0 0;
  text-align: center;
  color: #fff;
  font-weight: 700;
}     
</style>
