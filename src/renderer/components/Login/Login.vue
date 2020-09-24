<template>
  <div class="login">
    <breathing />
    <div class="login-container enter-fade">
      <img width="263" src="@/assets/login.svg" alt="">
      <p class="login-title">名冠微信好友转移BOT</p>
      <p class="login-title2">微信客户资源一键转移至企业微信</p>
      <el-button @click="login" style="width: 161px" :loading="isLoading" type="primary" size="medium" round>登录微信</el-button>
    </div>
    <el-dialog :visible.sync="showDialog" width="450px">
      <span slot="title"><img class="title-icon" src="@/assets/warning-tips.png" alt="">操作提示</span>
      <span>系统检查到你微信已经打开，<span style="font-weight: bold">请彻底关闭微信</span>后，再通过本软件“登录微信”</span>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="showDialog = false">知 道 了</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      showDialog: false,
      isLoading: false
    }
  },
  sockets: {
    login(res) {
      const {cmd} = res
      this.isLoading = false
      if (!cmd) {
        this.showDialog = true
      } else {
        this.$router.push('/Directory')
      }
    }
  },
  mounted() {
    this.$route.query.type === 'change' && this.login()
  },
  methods: {
    login() {
      this.isLoading = true
      this.$socket.emit('login')
      // this.$router.push('/Directory')
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  padding-top: 85px;

  .login-container {
    margin: 0 auto;
    text-align: center;

    .login-title {
      margin-top: 10px;
      font-size: 20px;
      line-height: 3;
      color: #6D6D6D;
    }

    .login-title2 {
      margin-bottom: 24px;
      line-height: 1;
      font-size: 23px;
      color: #333333;
    }
  }

  .title-icon {
    vertical-align: bottom;
    margin-right: 10px;
  }
}
</style>