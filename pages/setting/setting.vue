<template>
  <view class="page-setting">
    <view class="cu-list menu sm-border card-menu margin-top">
      <view class="cu-item arrow">
        <view class="content">
          <text class="text-black">版本号</text>
        </view>
        <view class="version">{{verson}}</view>
      </view>
      <view class="cu-item arrow" @click="toAgreement('user_service', '用户协议')">
        <view class="content">
          <text class="text-black">用户协议</text>
        </view>
      </view>
      <view class="cu-item arrow" @click="toAgreement('user_secret', '隐私协议')">
        <view class="content">
          <text class="text-black">隐私协议</text>
        </view>
      </view>
    </view>
    <view class="cu-list menu sm-border card-menu margin-top">
      <view class="cu-item arrow" @click="toFeedback">
        <view class="content">
          <text class="text-black">意见反馈</text>
        </view>
      </view>
      <view class="cu-item arrow" @click="handleClear">
        <view class="content">
          <text class="text-black">清除缓存</text>
        </view>
        <view class="cache-size">{{fileSizeString}}</view>
      </view>
      <view class="cu-item arrow" @click="toAgreement('about_us', '关于我们')">
        <view class="content">
          <text class="text-black">关于我们</text>
        </view>
      </view>
    </view>

    <view class="cu-list menu sm-border card-menu margin-top">
      <view class="cu-item arrow" @click="quitAuth">
        <view class="content">
          <text class="text-black">退出登录</text>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
  import {
    TOKEN_KEY
  } from '../../config/env';
  export default {
    data() {
      return {
        fileSizeString: '',
        verson: '1.0.0'
      };
    },
    onLoad() {
      this.formatSize()
    },
    methods: {
      quitAuth() {
        uni.showModal({
          title: '提示',
          content: '确定退出登录吗？',
          success: (res) => {
            if (res.confirm) {
              uni.removeStorageSync(TOKEN_KEY)
              uni.reLaunch({
                url: '/pages/index/index'
              })
            }
          }
        })
      },
      getVersion() {
        // #ifdef APP
        this.verson = plus.runtime.versionCode
        // #endif
        // #ifdef MP-WEIXIN
        const acct = uni.getAccountInfoSync()
        this.verson = acct.miniProgram.version
        // #endif
      },
      toAgreement(type, title) {
        uni.navigateTo({
          url: `/pages/user/agreement?type=${type}&title=${title}`
        })
      },
      toFeedback() {
        uni.navigateTo({
          url: '/pages/user/feedback'
        })
      },
      formatSize() {
        let that = this;
        // #ifdef APP
        plus.cache.calculate(function(size) {
          let sizeCache = parseInt(size);
          if (sizeCache == 0) {
            that.fileSizeString = "0B";
          } else if (sizeCache < 1024) {
            that.fileSizeString = sizeCache + "B";
          } else if (sizeCache < 1048576) {
            that.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";
          } else if (sizeCache < 1073741824) {
            that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";
          } else {
            that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";
          }
        });
        // #endif
        // #ifdef MP-WEIXIN
        const storage = uni.getStorageInfoSync()
        if (storage.currentSize > 1024) {
          this.fileSizeString = (storage.currentSize / 1024).toFixed(2) + 'MB'
        } else {
          this.fileSizeString = storage.currentSize + 'KB'
        }
        // #endif
      },
      handleClear() {
        uni.showModal({
          title: '提示',
          content: '确定要清除缓存吗？',
          success: (res) => {
            if (res.confirm) {
              // #ifdef APP
              this.clearCache()
              // #endif
              // #ifdef MP-WEIXIN
              uni.clearStorageSync()
              this.formatSize()
              // #endif
            }
          }
        })
      },
      clearCache() {
        // #ifdef APP
        let that = this;
        let os = plus.os.name;
        if (os == 'Android') {
          let main = plus.android.runtimeMainActivity();
          let sdRoot = main.getCacheDir();
          let files = plus.android.invoke(sdRoot, "listFiles");
          let len = files.length;
          for (let i = 0; i < len; i++) {
            let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
            plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
              if (entry.isDirectory) {
                entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录  
                  uni.showToast({
                    icon: 'none',
                    title: '缓存清理完成',
                    duration: 2000
                  });
                  that.formatSize(); // 重新计算缓存  
                }, function(e) {
                  console.log(e.message)
                });
              } else {
                entry.remove();
              }
            }, function(e) {
              console.log('文件路径读取失败')
            });
          }
        } else { // ios  
          plus.cache.clear(function() {
            uni.showToast({
              icon: 'none',
              title: '缓存清理完成',
              duration: 2000
            });
            that.formatSize();
          });
        }
        // #endif
      },
    }
  }
</script>

<style lang="scss">
  .page-setting {
    background-color: #F8F8F8;
    overflow: hidden;
    min-height: 100vh;
  }
</style>