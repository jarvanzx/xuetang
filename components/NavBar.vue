<template>
  <view class="nav-bar" :style="{backgroundColor, paddingTop: statusBarheight + 'px'}">
    <view class="back-arrow" v-if="showBack" @click="onBack">
      <image :src="backColor == 'white' ? '/static/common/back-white.png' : '/static/common/back-black.png'"
        class="icon-44" mode="aspectFill"></image>
    </view>
    <view class="title" v-if="showTitle" :style="{color: titleColor, fontSize: fontSize}">{{title}}</view>
    <slot name="more"></slot>
  </view>
</template>

<script>
  export default {
    name: "CusNavBar",
    props: {
      backColor: {
        type: String,
        default: '#fff'
      },
      backgroundColor: {
        type: String,
        default: '#fff'
      },
      title: {
        type: String,
        default: ''
      },
      showTitle: {
        type: Boolean,
        default: false
      },
      titleColor: {
        type: String,
        default: '#000'
      },
      fontSize: {
        type: String,
        default: '16px'
      },
      showBack: {
        type: Boolean,
        default: false
      },
      showHome: {
        type: Boolean,
        default: false
      },
      showMore: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        statusBarheight: 42
      };
    },
    computed: {},
    mounted() {
      const {
        statusBarHeight
      } = uni.getWindowInfo()
      this.statusBarheight = statusBarHeight
    },
    methods: {
      onBack() {
        uni.navigateBack({
          delta: 1,
          fail: () => {
            uni.switchTab({
              url: '/pages/index/index'
            })
          }
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .nav-bar {
    width: 100%;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    position: fixed;
    top: 0;
    left: 0;
    box-sizing: content-box;
    z-index: 9999;
    transition: all linear .3s;

    .back-arrow {
      position: absolute;
      left: 32rpx;
      bottom: 10rpx;
      width: 54rpx;
      height: 54rpx;
    }

    .title {
      font-size: 16px;
      color: #000;
      max-width: 350rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>