<template>
  <view class="bottom-custom-wrap">
    <view class="fixed-paly-wrap" @click="playTap" :class="{isPlay: $store.state.isPlaying}">
      <image :src="playPoster" class="audio-play-cover" :class="{isPlay: audioPlaying}" mode="aspectFill"></image>
      <image :src="btnStateImg" class="audio-play-btn" mode="aspectFill"></image>
      <!-- https://jzxt.qifudaren.net/static/index/Vector@2x.png -->
    </view>
    <u-tabbar fixed :value="selected" @change="change1" activeColor="#7644FF" :placeholder="false">
      <u-tabbar-item v-for="(item,index) in tabbarList" :text="item.text" :key="index">
        <image class="tabbar-icon" slot="active-icon" :src="item.selectedIconPath"></image>
        <image class="tabbar-icon" slot="inactive-icon" :src="item.iconPath"></image>
      </u-tabbar-item>
    </u-tabbar>
  </view>

</template>

<script>
  import {
    mapGetters,
    mapState
  } from 'vuex'
  export default {
    name: "tab-bar",
    props: {
      selected: {
        type: Number
      }
    },
    data() {
      return {
        playBg: 'https://jzxt.qifudaren.net/static/temp/icon-audio-play.png',
        tabbarList: [{
            "pagePath": "/pages/index/index", //页面路径，必须在 pages 中先定义
            "iconPath": "/static/tabbar/home.png", //建议尺寸为 81px * 81px
            "selectedIconPath": "/static/tabbar/home-a.png", //建议尺寸为 81px * 81px
            "text": "首页" //菜单上按钮文字，在 5+APP 和 H5 平台为非必填。例如中间可放一个没有文字的+号图标
          },
          {
            "pagePath": "/pages/circle/circle", //页面路径，必须在 pages 中先定义
            "iconPath": "/static/tabbar/circle.png", //建议尺寸为 81px * 81px
            "selectedIconPath": "/static/tabbar/circle-a.png", //建议尺寸为 81px * 81px
            "text": "成长圈" //菜单上按钮文字，在 5+APP 和 H5 平台为非必填。例如中间可放一个没有文字的+号图标
          },
          {
            "pagePath": "",
            "iconPath": "",
            "selectedIconPath": "",
            "text": ""
          },
          {
            "pagePath": "/pages/shop/shop", //页面路径，必须在 pages 中先定义
            "iconPath": "/static/tabbar/shop.png", //建议尺寸为 81px * 81px
            "selectedIconPath": "/static/tabbar/shop-a.png", //建议尺寸为 81px * 81px
            "text": "商城" //菜单上按钮文字，在 5+APP 和 H5 平台为非必填。例如中间可放一个没有文字的+号图标
          },
          {
            "pagePath": "/pages/my/my",
            "iconPath": "/static/tabbar/my.png",
            "selectedIconPath": "/static/tabbar/my-a.png",
            "text": "我的"
          }
        ]
      };
    },
    computed: {
      ...mapState(['audioPlaying', 'audioList', 'playIndex', 'currentCourseId']),
      btnStateImg() {
        return this.audioPlaying ? '/static/common/pause.png' : 'https://jzxt.qifudaren.net/static/index/Vector@2x.png'
      },
      playPoster() {
        console.log();
        if (this.currentCourseId && this.audioList.length > 0) {
          return this.audioList[this.playIndex].poster_image
        }
        return this.playBg
      }
    },
    methods: {
      ...mapGetters(['getCourseId']),
      change1(val) {
        // 因为在pages中配置了需要跳转的页面为 tabbar页面 
        // 所以不能使用navigateTo 只能使用下面这个方法跳转。
        uni.switchTab({
          url: this.tabbarList[val].pagePath
        })
      },
      playTap() {
        if (this.getCourseId()) {
          uni.navigateTo({
            url: '/pages/audioDetail/audioDetail?course_id=' + this.getCourseId()
          })
        }
      },
    }
  }
</script>

<style lang="scss">
  .bottom-custom-wrap {
    .tabbar-icon {
      height: 50rpx;
      width: 50rpx;
      padding: 6rpx;
    }

    .fixed-paly-wrap {
      position: fixed;
      bottom: calc(44rpx + constant(safe-area-inset-bottom));
      bottom: calc(44rpx + env(safe-area-inset-bottom));
      left: 50%;
      margin-left: -52rpx;
      width: 104rpx;
      height: 104rpx;
      box-shadow: 0rpx 2rpx 16rpx 0rpx rgba(138, 65, 255, 0.1);
      border-radius: 52rpx;
      background-color: #fff;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .audio-play-cover {
      height: 100rpx;
      width: 100rpx;
      border-radius: 50rpx;
    }

    .audio-play-btn {
      position: absolute;
      height: 48rpx;
      width: 45rpx;
    }

    .isPlay {
      animation: rotate 6s linear infinite;
    }

    @keyframes rotate {
      form {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }
  }
</style>