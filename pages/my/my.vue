<template>
  <view>
    <scroll-view :scroll-y="true" class="mine page-my" :style="{height: screenHeight + 'px'}">
      <image src="https://jzxt.qifudaren.net/static/my/bg.png" class="my-bg" mode="widthFix"></image>
      <view class="has-combtn-padding" :style="{paddingTop: (statusBarHeight + 44) + 'px'}">
        <view class="flex align-center my-info-wrap" @click="toUrl('/pages/user/info')">
          <image :src="getUrl(userInfo.avatar)" class="my-ava" mode="aspectFill"></image>
          <view>
            <view class="my-name flex align-center flex-wrap">
              <view class="nickname mr-md">
                {{ userInfo.nickname }}
              </view>
              <view class="eve-user-type" v-if="userInfo.job_text">{{ userInfo.job_text }}</view>
              <view class="vip-tag" v-if="userInfo.user_vip.id">{{ userInfo.user_vip.vip_name }} LV{{userInfo.level}}
              </view>
            </view>
            <view class="my-id">{{userInfo.job_text}}编号：{{ userInfo.code }}</view>
            <view class="my-invtie">邀请人：{{ userInfo.parent_user_code }}</view>
          </view>
        </view>
        <view class="my-partner" v-if="userInfo.user_vip.id">
          <view class="swiper-item" @click="toUrl('/pages/user/vip')">
            <image :src="`https://jzxt.qifudaren.net/static/user/${vipBg[userInfo.user_vip.vip_name]}.png`"
              class="user-banner-img" mode="aspectFill"></image>
            <view class="no-time">{{ userInfo.user_vip.expire_time_text }}到期</view>
          </view>
          <!-- <swiper :indicator-dots="false" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" :autoplay="true" :interval="3000" :duration="1000">
            <swiper-item v-for="item in userInfo.user_vip" :key="item.id">
              <view class="swiper-item" @click="toUrl('/pages/user/vip')">
                <image src="https://jzxt.qifudaren.net/static/user/banner01.png" class="user-banner-img" mode="aspectFill"></image>
                <view class="no-time" v-if="userInfo.level !== 0 && userInfo.level === 1">{{ userInfo.user_vip.expire_time_text }}到期</view>
              </view>
            </swiper-item>
                   <swiper-item>
              <view class="swiper-item" @click="toUrl('/pages/user/vip')">
                <image src="https://jzxt.qifudaren.net/static/user/banner02.png" class="user-banner-img" mode=""></image>
                <view class="no-time no-time-2" v-if="userInfo.level !== 0 && userInfo.level === 2">{{ userInfo.user_vip.expire_time_text }}到期</view>
              </view>
            </swiper-item>
          </swiper> -->
        </view>
        <view class="cu-list my-collect menu sm-border card-menu margin-top">
          <view class="cu-item arrow" @click="toUrl('/pages/user/collect')">
            <view class="content flex align-center">
              <image src="https://jzxt.qifudaren.net/static/my/collect.png" class="icon-44 margin-right-8" mode="">
              </image>
              <text class="text-black">我的收藏</text>
            </view>
          </view>
        </view>
        <view class="index-nav">
          <view class="grid text-center col-4">
            <view class="nav-item" v-for="item in navList" :key="item.name" @click="toUrl(item.path)">
              <image :src="`https://jzxt.qifudaren.net/static/my/nav-${item.url}.png`" class="nav-item-img" mode="">
              </image>
              <view class="nav-item-title">{{ item.name }}</view>
            </view>
          </view>
        </view>

        <view class="index-nav order-nav">
          <view class="grid text-center col-5 flex-sub">
            <view class="nav-item order-nav-item" v-for="item in navList2" :key="item.name"
              @click="toUrl('/pages/user/order?type=' + item.type)">
              <image :src="`https://jzxt.qifudaren.net/static/my/order-${item.url}.png`"
                class="nav-item-img order-nav-item-img" mode=""></image>
              <view class="nav-item-title">{{ item.name }}</view>
            </view>
          </view>
        </view>

        <view class="cu-list menu sm-border card-menu margin-top">
          <view class="cu-item arrow" @click="toUrl('/pages/user/retail')">
            <view class="content flex align-center">
              <image src="https://jzxt.qifudaren.net/static/my/icon-friend.png" class="meun-icon" mode=""></image>
              <text class="text-black">推荐好友/合伙人</text>
            </view>
          </view>
          <view class="cu-item arrow" @click="toUrl('/pages/user/cdk')">
            <view class="content flex align-center">
              <image src="https://jzxt.qifudaren.net/static/my/icon-code.png" class="meun-icon" mode=""></image>
              <text class="text-black">激活码</text>
            </view>
          </view>
          <view class="cu-item arrow" @click="toUrl('/pages/help/help')">
            <view class="content flex align-center">
              <image src="https://jzxt.qifudaren.net/static/my/icon-help.png" class="meun-icon" mode=""></image>
              <text class="text-black">帮助中心</text>
            </view>
          </view>
          <view class="cu-item arrow" @click="toUrl('/pages/setting/setting')">
            <view class="content flex align-center">
              <image src="https://jzxt.qifudaren.net/static/my/icon-setting.png" class="meun-icon" mode=""></image>
              <text class="text-black">设置</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <tab-bar :selected="4"></tab-bar>
  </view>
</template>

<script>
  import TabBar from '@/components/tabbar.vue';
  import {
    getUrl
  } from '@/utils/utils.js';
  export default {
    data() {
      return {
        vipBg: {
          '君子合伙人': 'banner01',
          '君子金卡': 'banner02'
        },
        userInfo: {},
        navList: [{
            name: '线下课',
            url: '1',
            path: '/pages/user/offline-classes'
          },
          {
            name: '我的学习',
            url: 2,
            path: '/pages/user/my-studies'
          },
          {
            name: '我的笔记',
            url: '3',
            path: '/pages/user/my-notes'
          },
          {
            name: '优惠券',
            url: '4',
            path: '/pages/user/coupon'
          },
          // {
          //   name: '账户余额',
          //   url: '5'
          // }
        ],
        navList2: [{
            name: '待付款',
            type: 'unpaid',
            url: 1
          },
          {
            name: '待发货',
            type: 'nosend',
            url: 2
          },
          {
            name: '待收货',
            type: 'noget',
            url: 3
          },
          {
            name: '待评价',
            type: 'nocomment',
            url: 4
          },
          {
            name: '全部',
            type: 'all',
            url: 5
          }
        ],
        screenHeight: 0,
        statusBarHeight: 0
      };
    },
    components: {
      TabBar
    },
    onLoad() {
      const info = uni.getWindowInfo()
      this.screenHeight = info.screenHeight - 50
      this.statusBarHeight = info.statusBarHeight
    },
    onShow() {
      // #ifndef MP
      uni.hideTabBar();
      // #endif
      this.getUserInfo();
    },
    onShareAppMessage() {
      return {
        title: '君子学堂',
        path: '/pages/index/index'
      }
    },
    onShareTimeline() {
      return {
        title: '君子学堂',
        path: '/pages/index/index',
      }
    },
    methods: {
      getUrl,
      async getUserInfo() {
        try {
          const {
            data
          } = await this.$Api.getUserInfo();
          this.userInfo = data;
          uni.setStorage({
            key: 'userInfo',
            data: data
          });
        } catch (e) {
          //TODO handle the exception
        }
      },
      toUrl(url) {
        uni.navigateTo({
          url: url
        });
      }
    }
  };
</script>

<style lang="scss">
  .page-my {
    position: relative;
    // min-height: 100vh;
    background: #eceeff;
    // padding-bottom: 66rpx;

    .mine {
      width: 100%;
    }

    .my-bg {
      width: 100vw;
      height: 859rpx;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }

    .my-ava {
      width: 112rpx;
      height: 112rpx;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      border: 2rpx solid #ffffff;
      border-radius: 50%;
      margin-right: 16rpx;
    }

    .my-info-wrap {
      height: 176rpx;
      padding: 32rpx 48rpx;
      position: relative;
      z-index: 1;
    }

    .my-name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 44rpx;
      color: #000000;
    }

    .eve-user-type {
      // width: 70rpx;
      // height: 36rpx;
      padding: 6rpx 14rpx;
      background: linear-gradient(133deg, #d791ff 0%, #6e39ff 100%);
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 20rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8rpx;
    }

    .vip-tag {
      padding: 6rpx 14rpx;
      background: linear-gradient(133deg, #d791ff 0%, #6e39ff 100%);
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 20rpx;
      color: #ffffff;
      margin-right: 8rpx;
    }

    .my-id {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
    }

    .my-invtie {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #666666;
      margin-top: 8rpx;
    }

    swiper {
      width: 686rpx;
      height: 196rpx;
    }

    .swiper-item {
      width: 686rpx;
      height: 196rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
    }

    .my-partner {
      width: 686rpx;
      height: 196rpx;
      margin: 32rpx auto 0;
      border-radius: 16rpx;
      position: relative;
      z-index: 1;

      .user-banner-img {
        height: 196rpx;
        width: 686rpx;
      }

      .no-time {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.6);
        position: absolute;
        bottom: 24rpx;
        left: 32rpx;
        line-height: 1;
        z-index: 1;

        &-2 {
          color: rgba(172, 110, 31, 0.6);
        }
      }
    }

    .order-nav {
      height: 202rpx;
      padding: 16rpx 0;
    }

    .order-nav-item {
      height: 170rpx;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
    }

    .order-nav-item-img {
      height: 57rpx !important;
      width: 56rpx !important;
      border-radius: 0 !important;
      margin-bottom: 16rpx !important;
    }

    .meun-icon {
      height: 40rpx;
      width: 40rpx;
      margin-right: 16rpx;
    }
  }
</style>