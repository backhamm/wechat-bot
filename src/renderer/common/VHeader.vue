<template>
  <div class="app-header">
    <img v-if="headerType" width="339" src="@/assets/init-logo.svg" alt="">
    <img v-else width="339" src="@/assets/logo.svg" alt="">
    <div title="关闭" class="right-icon close" @click="setWin('close')"></div>
    <div title="最小化" class="right-icon line" @click="setWin('min')"></div>
    <el-dropdown class="user-info" v-if="$route.name === 'Directory'" trigger="click" size="small">
        <span>
          <img class="user-avatar" src="@/assets/avatar.png" alt="">已登录<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="$router.push('/Login')">退出登录</el-dropdown-item>
        <el-dropdown-item @click.native="$router.push({path: '/Login', query: {type: 'change'}})">切换账号</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import {miniWindow} from "../utils/miniWindow"

export default {
  name: 'VHeader',
  computed: {
    headerType() {
      return ['Verification', 'TipsPage'].includes(this.$route.name)
    }
  },
  methods: {
    setWin(type) {
      if (type === 'close') {
        this.$socket.emit('con_exit')
        setTimeout(() => {
          miniWindow && miniWindow.close()
          this.$electron.ipcRenderer.send(type)
        }, 300)
      } else {
        this.$electron.ipcRenderer.send(type)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.app-header {
  height: 48px;
  padding: 10px 0 0 20px;
  border-bottom: 1px solid #EBEBEB;
  box-shadow: 0 2px 4px rgba(180, 180, 180, 0.1);
  -webkit-app-region: drag;

  .app-title {
    vertical-align: super;
    margin-left: 10px;
    font-size: 15px;
    font-weight: 400;
    color: #303233;
  }

  .user-info {
    float: right;
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
    -webkit-app-region: no-drag;

    .user-avatar {
      vertical-align: middle;
      margin-right: 5px;
    }
  }

  .right-icon {
    float: right;
    display: inline-block;
    margin-right: 10px;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: auto;
    cursor: pointer;
    -webkit-app-region: no-drag;

    &.line {
      background-image: url("../assets/line.png");
    }
    &.rectangle {
      background-image: url("../assets/rectangle.png");
    }
    &.close {
      background-image: url("../assets/close.png");
    }
  }
}
</style>