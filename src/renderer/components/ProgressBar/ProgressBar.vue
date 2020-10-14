<template>
  <div style="-webkit-app-region: drag;">
    <div v-if="preparing" class="preparing">
      好友名片准备中 <i class="el-icon-loading" style="margin-right: 15px"></i> <span style="color: #666;">发送名片时，准备时间可能较缓慢，请耐心等待~</span>
    </div>
    <div v-else-if="addNum === completedNum" class="send-end">
      <img style="vertical-align: middle; margin-right: 10px" width="30" src="@/assets/send-end.png" alt=""> 发送完成
    </div>
    <div v-else-if="showFinish" class="send-end">
      <img style="vertical-align: middle; margin-right: 10px" width="30" src="@/assets/finish.svg" alt=""> 已结束发送
    </div>
    <div v-else class="progress-bar">
      <div class="left">
        <div v-if="sending">
          <img class="left-icon" src="@/assets/send.svg" alt="">发送中
        </div>
        <div v-else>
          <img class="left-icon" src="@/assets/stop-send.svg" alt="">已暂停
        </div>
      </div>
      <div class="middle">
        <div class="bar-tips">已完成<span style="color: #67c23a">{{ completedNum }}</span>人，还剩{{ addNum - completedNum }}人<span v-if="sending">，大约还剩余{{ (addNum - completedNum) * second }}S</span></div>
        <el-progress :percentage="schedule"></el-progress>
      </div>
      <div class="right">
        <span v-if="sending">快捷键 <span style="font-weight: bold">F11</span> 暂停</span>
        <div v-else>
          <el-button @click="finish" :loading="isFinish">结束</el-button>
          <el-button @click="keepOn" type="primary" :disabled="isFinish">继续</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "ProgressBar",
    data() {
      return {
        sending: true,
        isFinish: false,
        showFinish: false,
        addNum: 0,
        second: 0,
        preparing: true,
        isEnd: false
      }
    },
    computed: {
      ...mapState(['completedNum']),
      schedule() {
        return !this.addNum && !this.completedNum ? 0 : Math.ceil(this.completedNum / this.addNum * 100)
      }
    },
    watch: {
      completedNum(val) {
        val && this.preparing && (this.preparing = false)
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.$socket.emit('run_over')
    },
    methods: {
      init() {
        const {peopleNum, second} = JSON.parse(this.$route.query.params)
        this.addNum = parseInt(peopleNum)
        this.second = parseInt(second)
        document.getElementsByClassName('app-header')[0].style.display = 'none'
        document.getElementsByClassName('qr-code')[0].style.display = 'none'
        this.$electron.remote.globalShortcut.unregisterAll()
        this.$electron.remote.globalShortcut.register('F11', this.stop)
      },
      stop() {
        if (this.sending) {
          this.$socket.emit('run_stop')
          this.sending = !this.sending
        }
      },
      finish() {
        this.isFinish = true
        this.$socket.emit('run_over')
        setTimeout(() => {
          this.showFinish = true
        }, 500)
      },
      keepOn() {
        this.$socket.emit('run_go')
        this.sending = !this.sending
      }
    }
  }
</script>

<style lang="less" scoped>
  .send-end {
    line-height: 62px;
    text-align: center;
    font-size: 14px;
  }

  .preparing {
    width: 100%;
    line-height: 62px;
    text-align: center;
    font-size: 14px;
  }

  .progress-bar {
    white-space: nowrap;
    height: 100%;
    padding: 8px 0;
    color: #303233;

    /deep/ .el-progress__text {
      color: #0078EF;
    }

    &>div {
      display: inline-block;
      vertical-align: top;
    }

    .left {
      width: 113px;
      line-height: 46px;
      border-right: 1px solid #ddd;
      font-size: 14px;

      .left-icon {
        vertical-align: middle;
      }
    }

    .middle {
      width: 363px;
      padding: 8px 20px 0 20px;
      font-size: 14px;
    }

    .right {
      width: 148px;
      padding-left: 16px;
      line-height: 46px;
      border-left: 1px solid #ddd;
      text-align: center;
      font-size: 12px;
      color: #606366;
      -webkit-app-region: no-drag;
    }
  }
</style>