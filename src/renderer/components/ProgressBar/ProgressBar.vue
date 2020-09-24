<template>
  <div class="progress-bar">
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
      <span v-if="sending">快捷键F11暂停</span>
      <div v-else>
        <el-button @click="finish" :loading="this.isFinish">结束</el-button>
        <el-button @click="keepOn" type="primary" :disabled="isFinish">继续</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  // import {remote} from 'electron'

  export default {
    name: "ProgressBar",
    data() {
      return {
        sending: true,
        isFinish: false,
        addNum: 0,
        second: 0
      }
    },
    computed: {
      ...mapState(['completedNum']),
      schedule() {
        console.log(Math.ceil(this.completedNum / this.addNum * 100))
        return !this.addNum && !this.completedNum ? 0 : Math.ceil(this.completedNum / this.addNum * 100)
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
        this.addNum = peopleNum
        this.second = second
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
      },
      keepOn() {
        this.$socket.emit('run_go')
        this.sending = !this.sending
      }
    }
  }
</script>

<style lang="less" scoped>
  .progress-bar {
    white-space: nowrap;
    height: 100%;
    padding: 8px 0;
    -webkit-app-region: drag;
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