<script>
  import {
    audioHandler
  } from './utils/audio'
  export default {
    onLaunch: function() {
      console.log('App Launch')
      // #ifdef MP-WEIXIN
      const manager = uni.getUpdateManager()
      manager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          manager.onUpdateReady(function() {
            uni.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  manager.applyUpdate()
                }
              }
            })
          })
          manager.onUpdateFailed(function() {
            // 新的版本下载失败
            uni.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
      // #endif
      const windowInfo = uni.getWindowInfo()
      if (!uni.getStorageSync('barHeight')) {
        uni.setStorageSync('barHeight', windowInfo.statusBarHeight)
      }
      audioHandler()
    },
    onShow: function() {
      console.log('App Show')
      // uni.hideTabBar()
      // #ifndef MP
      uni.hideTabBar()
      // #endif
    },
    onHide: function() {
      console.log('App Hide')
    }
  }
</script>

<style lang="scss">
  /*每个页面公共css */
  @import "@/uni_modules/uview-ui/index.scss";
  @import "colorui/main.wxss";
  @import "colorui/icon.wxss";
  @import "colorui/animation.wxss";
  @import 'common.scss';

  .container {
    width: 750rpx;
    min-height: 100vh;
  }

  .mr-sm {
    margin-right: 10rpx;
  }

  .mr-md {
    margin-right: 20rpx;
  }

  .bg-f8 {
    background: #f8f8f8;
  }

  .safe-botton {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: content-box;
  }

  .page-wrap {
    padding-top: 88rpx;
    /* #ifdef MP */
    padding-top: 160rpx;
    /* #endif */
  }

  .page-top-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 550rpx;
    z-index: 0;
  }

  .my-dialog {
    padding: 48rpx;

    .cu-modal-title {
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #000000;
    }

    .cu-modal-content {
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #333333;
      margin-top: 16rpx;
    }

    .cu-modal-btn {
      width: 279rpx;
      height: 80rpx;
      margin-top: 48rpx;
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      background: #086EFF;
      color: #fff;

      &.cancle-btn {
        background-color: #fff;
        color: #086EFF;
        border: 2rpx solid #086EFF;
      }
    }
  }

  .page-commom-btn {
    width: 686rpx;
    height: 88rpx;
    background: #086EFF;
    text-align: center;
    line-height: 88rpx;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    margin: 0 auto 0;
    font-size: 32rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
  }

  .has-combtn-padding {
    box-sizing: border-box;
    padding-bottom: calc(75px + constant(safe-area-inset-bottom)) !important;
    padding-bottom: calc(75px + env(safe-area-inset-bottom)) !important;
  }

  .safe-area {
    padding-bottom: constant(safe-area-inset-bottom) !important;
    padding-bottom: env(safe-area-inset-bottom) !important;
  }

  .page-handle-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
    z-index: 9;
    padding-top: 24rpx
  }

  .page-top-nav {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 104rpx;

    .page-top-nav-item {
      width: 16.6667%;
      text-align: center;
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #666666
    }

    .cur-page-top-nav-item {
      font-size: 36rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #000000;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -12rpx;
        left: 50%;
        width: 44rpx;
        height: 6rpx;
        background: #086EFF;
        border-radius: 1rpx 1rpx 1rpx 1rpx;
        margin-left: -22rpx;
      }
    }
  }

  .textarea-wrap {
    position: relative;

    .text-count {
      position: absolute;
      z-index: 1;
      bottom: 26rpx;
      right: 32rpx;
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #888888;

      text {
        color: #1989FF;
      }
    }
  }

  .solids-wrap {
    min-width: 176rpx;
    min-height: 176rpx;
    background: rgba(8, 110, 255, 0.06);
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    opacity: 1;
    border: 2rpx dashed #086EFF;
    padding: 0 !important;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    font-size: 24rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #086EFF;
  }

  .upload-img {
    height: 52rpx;
    width: 52rpx;
  }

  button::after {
    border: none;
  }

  button {
    border: none;
    padding: 0;
    margin: 0;
    background-color: transparent;
  }

  .reset-btn {
    background: transparent;
    border: none;
    padding: 0 !important;
    margin: 0;
    font-size: 28px;
    line-height: 1 !important;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    outline: 0;
    background-color: transparent;
    opacity: 0;
    z-index: 1;
  }

  checkbox.round .wx-checkbox-input,
  checkbox.round .uni-checkbox-input {
    border-radius: 100rpx;
  }
</style>