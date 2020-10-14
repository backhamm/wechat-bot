<template>
  <div class="directory">
    <div class="left">
      <p class="left-title">通讯列表（<span style="color: #0078EF">{{ userList.length }}</span>人）</p>
      <div class="left-item" v-for="(item, i) of userList" :key="i">
        <img width="32" height="32" src="@/assets/usericon.png" alt="">
        <span class="username">{{ item }}</span>
      </div>
    </div>
    <div class="right">
      <div class="operating-tips" v-if="showOperatingTips">
        <p class="operating-ready"><img style="margin-right: 5px; vertical-align: sub" src="@/assets/begin.png" alt="">程序准备中...</p>
        请在企业微信里，给<span style="font-weight: bold">【需要转移好友的微信】发送“开始”</span>（必须是本电脑当前登录的个人微信）
      </div>
      <template v-else>
        <div v-if="!firstEnd">
          <div>
            <img width="240" src="@/assets/directory.svg" alt="">
            <p class="begin-tips">请打开并登录企业微信方可执行以下操作</p>
          </div>
          <el-button @click="readySend(false)" type="primary" :disabled="!userList.length || isSending" size="medium" round>统一发送好友名片至企业微信</el-button>
        </div>
        <div v-else>
          <div class="tips">已添加<span style="color: #0078EF">{{ userList.length - maxPeople }}</span>人，剩余<span style="font-weight: bold">{{ maxPeople }}</span>人</div>
          <el-button class="btn" @click="readySend(false)" type="primary" size="medium" round :disabled="!userList.length || isSending">继续添加剩余好友</el-button>
          <br>
          <el-button class="btn" @click="readySend(true)" style="margin-top: 16px;" type="primary" size="medium" plain round :disabled="!userList.length || isSending">重新添加</el-button>
        </div>
      </template>
    </div>
    <el-dialog class="params-log" title="参数设置" :visible.sync="paramsVisible" width="480px">
      <div>
        <p class="log-title">可添加好友：{{ maxPeople }}人</p>
        <div class="log-input">
          转移数量：
          <el-input-number style="width: 160px" v-model="params.peopleNum" controls-position="right" :min="1" :max="maxPeople" step-strictly></el-input-number>
          人
          <p class="input-tips">最大值不超过好友数量，且数值为整数</p>
        </div>
        <div class="log-input">
          添加频率：
          <el-select style="width: 160px" v-model="params.second" placeholder="请选择">
            <el-option label="4秒" :value="4"></el-option>
            <el-option label="5秒" :value="5"></el-option>
            <el-option label="6秒" :value="6"></el-option>
          </el-select>
          <p class="input-tips">建议频率4秒</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendCarte">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import {createMiniWindow, miniWindow} from "../../utils/miniWindow"
import {MyLoading} from "../../common/globalComponents"

export default {
  name: "Directory",
  data() {
    return {
      loadUserList: false,
      paramsVisible: false,
      isSending: false,
      firstEnd: false,
      showOperatingTips: false,
      // 是否重新发送
      isReset: false,
      maxPeople: null,
      params: {
        peopleNum: 5,
        second: 4
      },
      // userList: ['安居客--王总', '安居客-sssssssssssssssss-王总', '安居客--王总', '安居客--王总', '安居客--王总', '安居客--王总', '安居客--王总', '安居客--王总', '安居客--王总', '安居客--王总', '安居客--王总', '安居客--王总', '安居客--王总', '安居客--王总', '安居客--王总'],
      userList: [],
      sendType: 0
    }
  },
  sockets: {
    userList({data}) {
      if (Array.isArray(data)) {
        this.userList = data
        this.loadUserList.close()
      }
    },
    workLog({cmd, msg, data}) {
      if (cmd) {
        this.maxPeople = this.isReset ? this.userList.length : data.len
      } else {
        this.$message.error(msg)
      }
    },
    addPeople({data}) {
      // !miniWindow && createMiniWindow(JSON.stringify(this.params))
      this.setCompletedNum(data.execute)
    },
    sendEnd() {
      this.isSending = false
      this.firstEnd = true
      this.showOperatingTips = false
      this.$socket.emit('work_log')
      setTimeout(() => {
        miniWindow.close()
      }, 2000)
    }
  },
  mounted() {
    !this.userList.length && (this.loadUserList = MyLoading.service({
      target: '.directory',
      text: '好友加载中，请稍后...'
    }))
  },
  methods: {
    ...mapActions(['setCompletedNum']),
    readySend(reset) {
      this.setCompletedNum(0)
      this.paramsVisible = true
      this.isReset = reset
      this.$socket.emit('work_log')
    },
    sendCarte() {
      this.isSending = true
      this.isReset && this.$socket.emit('reset_list')
      this.$socket.emit('run_log', JSON.stringify(this.params))
      this.paramsVisible = false
      this.showOperatingTips = true
      createMiniWindow(JSON.stringify(this.params))
    }
  }
}
</script>

<style lang="less" scoped>
.directory {
  display: flex;
  height: calc(100% - 48px);
  overflow: hidden;

  /deep/ .el-input-number.is-controls-right .el-input__inner {
    text-align: left;
  }

  .title-icon {
    vertical-align: bottom;
    margin-right: 10px;
  }

  .params-log {
    /deep/ .el-dialog {
      .el-dialog__header {
        padding: 10px 20px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
      }

      .el-dialog__headerbtn {
        top: 10px;
      }

      .el-dialog__body {
        padding: 20px 40px;
      }

      .el-dialog__footer {
        padding: 10px 20px;
        border-top: 1px solid #eee;
      }

      .log-title {
        margin-bottom: 21px;
      }

      .log-input {
        padding: 0 15px;

        &:not(:last-child) {
          margin-bottom: 24px;
        }

        .input-tips {
          padding-left: 75px;
          line-height: 2;
          font-size: 12px;
          color: #909699;
        }
      }
    }
  }

  .left {
    width: 192px;
    height: 100%;
    overflow: auto;
    background: #fff;

    .left-title {
      padding-left: 16px;
      line-height: 24px;
      font-size: 12px;
      background: #F0F0F0;
      color: #606366;
    }

    .left-item {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 56px;
      line-height: 32px;
      padding: 12px 16px;
      border-top: 1px solid #EBEBEB;
      font-size: 14px;
      color: #303233;

      .username {
        vertical-align: top;
        margin-left: 5px;
      }
    }
  }

  .right {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 100%;
    text-align: center;

    .operating-tips {
      width: 353px;
      margin-bottom: 30px;
      line-height: 2;
      text-align: left;
      font-size: 14px;

      .operating-ready {
        font-size: 16px;
        font-weight: bold;
        color: #000;
      }
    }

    .begin-tips {
      margin: 25px 0 16px;
      font-size: 20px;
      color: #303233;
    }

    .tips {
      width: 437px;
      line-height: 83px;
      border: 1px solid #F5F5F5;
      font-size: 28px;
      font-weight: 500;
      color: #303233;
    }

    .btn {
      width: 160px;
    }
  }
}
</style>