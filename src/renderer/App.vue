<template>
  <div id="app">
    <v-header />
    <router-view></router-view>
    <div class="qr-code">
      <img width="14" src="@/assets/qr-code-small.png" alt="">
      联系客服
    </div>
  </div>
</template>

<script>
  import {miniWindow} from "./utils/miniWindow"

  export default {
    name: 'App',
    data() {
      return {
        showHeader: true
      }
    },
    beforeDestroy() {
      miniWindow && miniWindow.close()
    }
  }
</script>

<style lang="less">
  *, body, html {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
  }

  body, html {
    width: 100%;
    height: 100%;
  }

  #app {
    height: 100%;
    overflow: hidden;
    background: #F5F9FD;

    .qr-code {
      position: absolute;
      right: 0;
      bottom: 30px;
      width: 32px;
      padding: 10px 9px;
      text-align: center;
      font-size: 14px;
      border-radius: 4px 0 0 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
      color: #6A6A6A;
      cursor: pointer;
    }
  }
  @keyframes enterFade {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .enter-fade {
    animation: enterFade .8s;
  }
</style>
