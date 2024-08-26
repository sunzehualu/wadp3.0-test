<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户名称
                <div class="pull-right">\{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">\{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">\{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">\{{ user.createTime }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="people" />直属领导
                <div class="pull-right">\{{ userFull.leaderFull }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="cascader" />任职部门
                <div class="pull-right" style="width: calc(100% - 90px)">
                  <AutoTooltip
                    :content="userFull.deptFull"
                    style="text-align: right"
                  />
                </div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />负责部门
                <div class="pull-right" style="width: calc(100% - 90px)">
                  <AutoTooltip
                    :content="userFull.respDeptFull"
                    style="text-align: right"
                  />
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/**
 * 个人中心
 * 功能：
 *   1.显示个人基本信息
 *   2.修改个人密码
 */
import userAvatar from './userAvatar'
import userInfo from './userInfo'
import resetPwd from './resetPwd'
import { getUserProfile } from '@/api/framework/user'
import AutoTooltip from '@/components/AutoTooltip/index.vue'

export default {
  name: 'Profile',
  components: { AutoTooltip, userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      userFull: {},
      roleGroup: {},
      postGroup: {},
      activeTab: 'userinfo'
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data
        this.userFull = response.relationGroup
      })
    }
  }
}
</script>
