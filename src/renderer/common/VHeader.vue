<template>
  <div class="app-header">
    <img src="@/assets/logo.png" alt="" style="vertical-align: middle;"><span class="version">（尊享版<span style="margin: 0 7px">|</span>长期使用）</span>
    <div title="关闭" class="right-icon close" @click="closeWindow"></div>
    <div title="最小化" class="right-icon line" @click="setWin('min')"></div>
    <el-dropdown class="user-info" v-if="$route.name === 'Directory'" trigger="click" size="small">
      <span>
        <img class="user-avatar" src="@/assets/avatar.png" alt="">已登录<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="isDeleteDialog = true">退出登录</el-dropdown-item>
<!--        <el-dropdown-item @click.native="$router.push({path: '/Login', query: {type: 'change'}})">切换账号</el-dropdown-item>-->
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
        title="提示"
        :visible.sync="isDeleteDialog"
        width="450px"
        :before-close="handleClose">
      <span>是否删除当前微信已添加数据?（如果切换账号请点击是）</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logout(false)">否</el-button>
        <el-button type="primary" @click="logout(true)">是</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {miniWindow} from "../utils/miniWindow"

export default {
  name: 'VHeader',
  data() {
    return {
      isDeleteDialog: false,
      isClose: false
    }
  },
  methods: {
    setWin(type) {
      if (type === 'close') {
        this.$socket.emit('con_exit')
        setTimeout(() => {
          miniWindow && miniWindow.close()
          this.$electron.ipcRenderer.send(type)
        }, 1000)
      } else {
        this.$electron.ipcRenderer.send(type)
      }
    },
    logout(type) {
      if (type) {
        this.$socket.emit('cli_clog')
        this.$socket.emit('init_data')
        if (this.isClose) {
          this.setWin('close')
        } else {
          this.$router.push('/Login')
        }
      } else {
        if (this.isClose) {
          this.setWin('close')
        } else {
          this.$socket.emit('init_data')
          this.$router.push('/Login')
        }
      }
      this.isClose = false
      this.isDeleteDialog = false
    },
    closeWindow() {
      this.isDeleteDialog = true
      this.isClose = true
    },
    handleClose() {
      this.isDeleteDialog = false
      this.isClose = false
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
  background: url("../assets/header-bg.png") no-repeat center / cover;
  -webkit-app-region: drag;

  .version {
    font-size: 12px;
    color: #FFAA00;
  }

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
    color: #fff;
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