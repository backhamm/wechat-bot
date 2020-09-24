<template>
  <div class="tips-page">
    <breathing />
    <p class="title">初始化说明</p>
    <div class="tips-container enter-fade">
      <div class="item" v-for="item of tipsList" :key="item.title">
        <p class="item-title">{{item.title}}<span class="item-tips">{{item.titleTips}}</span></p>
        <div class="item-main">
          <p class="list-item" v-for="el of item.list" :key="el">{{el}}</p>
        </div>
      </div>
      <div class="footer">
        <el-checkbox v-model="checked">已清楚，不再提示</el-checkbox>
        <el-button style="width: 107px;margin-top: -6px" @click="understood" type="primary">知道了</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TipsPage",
  data() {
    return {
      tipsList: [
        {
          title: '初始化引导',
          titleTips: '(在你操作该工具前，请确保已完成以下外部操作)',
          list: ['1、在电脑上安装本软件给定的微信客户端（安装后不打开）；', '2、在电脑上安装企业微信客户端，需打开并登录（登录与“需要转移好友的微信”互为好友的企业微信）；']
        },
        {
          title: '操作步骤',
          titleTips: '(完成以上操作，在本软件中执行一下步骤)',
          list: ['1、点击“登录微信”，完成扫码登录；', '2、登录成功后，点击“统一发送好友名片至企业微信”；', '3、打开企业微信，对需要发送名片的微信发送“开始”，系统开始自动操作；', '4、等待以上操作完成，即可完成统一发送添加邀请；']
        }
      ],
      checked: localStorage.getItem('showTips')
    }
  },
  created() {
    this.checked > 0 && this.$router.push('/Login')
  },
  methods: {
    understood() {
      localStorage.setItem('showTips', this.checked > 0 ? '1' : '0')
      this.$router.push('/Login')
    }
  }
}
</script>

<style lang="less" scoped>
  .tips-page {
    margin-top: -48px;
    padding-top: 68px;
    background: url("../../assets/verification-bg.jpg") no-repeat top center/ 100% 345px;

    .title {
      margin-bottom: 20px;
      line-height: 40px;
      text-align: center;
      font-size: 24px;
      font-weight: 500;
      color: #fff;
    }

    .tips-container {
      width: 568px;
      height: 439px;
      margin: 0 auto;
      padding: 20px 22px 0;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.19);
      background: #fff;
      color: #303233;

      .item {
        font-size: 14px;

        .item-tips {
          margin-left: 10px;
          font-weight: normal;
          color: #C0C6CC;
        }

        .item-title {
          line-height: 44px;
          font-weight: bold;
        }

        .item-main {
          padding: 16px;
          line-height: 1.5;
          background: #F8F8FA;
          border-radius: 5px;
          border: 1px solid #EBEBEB;

          .list-item:not(:last-child) {
            margin-bottom: 10px;
          }
        }
      }

      .footer {
        display: flex;
        justify-content: space-between;
        padding-top: 30px;
      }
    }
  }
</style>