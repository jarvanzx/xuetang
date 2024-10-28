<template>
  <view class="page-user-rank page-wrap" :style="{paddingTop: (statusBarHeight + 44) + 'px'}">
    <image src="https://jzxt.qifudaren.net/static/rank/bg-rank.png" class="index-top" mode=""></image>
    <!-- <view class="page-custom-top-nav">
      <image src="https://jzxt.qifudaren.net/static/common/back.png" class="back-img" mode="" @click="toBack"></image>
    </view> -->
    <cus-nav-bar title="状元榜" show-back show-title :backgroundColor="scrolled ? '#FFF' : 'transparent'"></cus-nav-bar>
    <view class="page-main-content">
      <view class="rank-title"></view>
      <view class="rank-list">
        <view class="rank-item bg-white" v-for="(item, index) in rankList" :key="item.id">
          <image v-if="index < 3" :src="`https://jzxt.qifudaren.net/static/rank/rank-${item.rank}.png`"
            class="rank-item-index" mode="aspectFill"></image>
          <view class="rank-item-des">{{item.gift}}</view>
          <view class="rank-user-list">
            <view class="rank-user-item flex justify-between align-center">
              <view class="rank-user-info flex align-center">
                <view class="rank-user-ava-wrap">
                  <image :src="`https://jzxt.qifudaren.net/static/rank/ava-${item.rank}.png`" class="rank-ava-bg"
                    mode="">
                  </image>
                  <image :src="item.user.avatar" class="rank-user-ava" mode="aspectFill"></image>
                </view>
                <view class="unick line-1">{{item.user.nickname}}</view>
              </view>
              <view class="rank-user-study">
                <view class="rank-study-time">{{item.cur_view_time_hour}}小时</view>
                <view class="rank-index-number">第{{item.rank}}名</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="page-fixed-footer">
        <view class="rank-bottom page-footer-wrap">
          <view class="rank-my flex-sub">
            <view class="rank-my-item flex justify-between align-center">
              <view class="rank-user-info flex align-center">
                <view class="rank-user-ava-wrap">
                  <image :src="`https://jzxt.qifudaren.net/static/rank/ava-${item}.png`" class="rank-ava-bg"
                    mode="aspectFill">
                  </image>
                  <image :src="getUrl(userInfo.avatar)" class="rank-user-ava" mode="aspectFill"></image>
                </view>
                <view>
                  <view class="rank-my-name">我</view>
                  <view>累计学习：{{userStudy.total_view_time_hour}}小时</view>
                </view>
              </view>
              <view class="rank-user-study">
                <view>本期学习</view>
                <view class="rank-my-time">{{userStudy.cur_view_time_hour}}小时</view>
                <view>第{{userStudy.user_rank}}名</view>
              </view>
            </view>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
  import {
    getUrl
  } from '../../utils/utils';
  export default {
    data() {
      return {
        rankList: [],
        activityInfo: {},
        userStudy: {},
        userInfo: {},
        scrolled: false,
        statusBarHeight: 0
      };
    },
    onLoad() {
      const windowInfo = uni.getWindowInfo()
      this.statusBarHeight = windowInfo.statusBarHeight
      this.getRank()
      const user = uni.getStorageSync('userInfo')
      this.userInfo = user
    },
    onPageScroll(e) {
      if (e.scrollTop > (this.statusBarHeight + 44)) {
        this.scrolled = true
      } else {
        this.scrolled = false
      }
    },
    methods: {
      getUrl,
      async getRank() {
        try {
          const {
            data
          } = await this.$Api.getCourseRank({})
          const {
            activity_info,
            rank,
            user_study
          } = data
          this.activityInfo = activity_info
          this.rankList = rank
          this.userStudy = user_study
        } catch (e) {
          //TODO handle the exception
        }
      },
      toBack() {
        uni.navigateBack()
      }
    }
  }
</script>

<style lang="scss">
  .page-user-rank {
    background: #ECEEFF;
    min-height: 100vh;
    padding-bottom: calc(236rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(236rpx + env(safe-area-inset-bottom));

    .index-top {
      width: 100%;
      height: 860rpx;
      position: absolute;
      top: 0;
    }

    .page-main-content {
      position: relative;
    }

    .rank-title {
      font-family: YouSheBiaoTiYuan, YouSheBiaoTiYuan;
      font-weight: 400;
      font-size: 56rpx;
      color: #FFFFFF;
      line-height: 66rpx;
      text-shadow: 0px 4px 0px #978BF8;
      margin: 28rpx auto 0;
      text-align: center;
    }

    .rank-list {
      padding: 32rpx;
      margin-top: 24rpx;
    }

    .rank-user-ava {
      width: 93rpx;
      height: 93rpx;
      background: #D9D9D9;
      border-radius: 50%;
    }

    .rank-ava-bg {
      position: absolute;
      left: 0;
      top: 0;
      height: 120rpx;
      width: 120rpx;
      min-width: 120rpx;
      z-index: 1;
    }

    .rank-user-ava-wrap {
      margin-right: 16rpx;
      position: relative;
      height: 120rpx;
      width: 120rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rank-item {
      padding: 16rpx;
      border-radius: 16rpx;
      margin-bottom: 24rpx;

      .rank-item-index {
        width: 134rpx;
        height: 52rpx;
        display: block;
        margin: 0 auto;
      }

      .rank-item-des {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        text-align: center;
        padding-bottom: 8rpx;
      }

      .rank-user-item {
        width: 650rpx;
        height: 152rpx;
        background: #F8F8F8;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        margin-top: 16rpx;
        padding: 16rpx 32rpx;

        .unick {
          max-width: 350rpx;
          font-size: 16px;
          font-weight: bold;
          color: #000000;
        }
      }


      .rank-study-time {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 32rpx;
        color: #7644FF;
      }

      .rank-index-number {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #999999;
        text-align: center;
      }
    }

    .rank-bottom {
      height: 220rpx;
    }

    .rank-my-item {
      width: 686rpx;
      height: 156rpx;
      background: #7644FF;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #FFFFFF;

      padding: 16rpx 32rpx;

      .rank-user-ava-wrap {
        margin-right: 16rpx;
      }

      .rank-my-name {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 36rpx;

      }

      .rank-my-time {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 36rpx;
        color: #FFFFFF;
      }

      .rank-user-study {
        text-align: center;
      }
    }
  }
</style>