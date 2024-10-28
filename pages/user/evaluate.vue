<template>
  <view class="page-user-evaluate">
    <view class="evaluate-list">
      <view class="evaluate-item" v-for="item in commenData" :key="item.id">
        <image :src="getUrl(item.user_avatar)" mode="aspectFill" class="evaluate-item-ava"></image>
        <view class="evaluate-item-info flex-1">
          <view class="evaluate-item-name flex align-center justify-between">{{item.user_nickname}}
            <image src="https://jzxt.qifudaren.net/static/shop/icon-eva.png" class="icon-36" mode="aspectFill"></image>
          </view>
          <view class="evaluate-item-time">{{item.createtime}}</view>
          <view class="evaluate-item-con">{{item.content}}</view>
          <view class="evaluate-item-replay" v-if="item.reply.length > 0">
            <view class="reply-item" v-for="reply in item.reply" :key="reply.id">
              <view class="evaluate-replay-name">{{reply.user.nickname}}：</view>
              <view class="evaluate-replay-con">{{reply.content}}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <empty-hold v-if="commenData.length == 0"></empty-hold>
  </view>
</template>

<script>
  import {
    getUrl
  } from '../../utils/utils';
  export default {
    data() {
      return {
        commenData: [],
        pagesize: 10,
        page: 1,
        goodsId: '',
        pageMax: false
      };
    },
    onLoad(options) {
      this.goodsId = options.goodsId
      this.getComment()
    },
    methods: {
      getUrl,
      async getComment() {
        const res = await this.$Api.getShopGoodComment({
          goods_id: this.goodsId,
          list_rows: this.pagesize,
          page: this.page
        })
        this.commenData = res.data.data
      },
    }
  }
</script>

<style lang="scss">
  .page-user-evaluate {
    min-height: 100vh;
    padding: 32rpx;

    .evaluate-item {
      display: flex;
      margin-bottom: 48rpx;
    }

    .evaluate-item-ava {
      height: 80rpx;
      width: 80rpx;
      min-width: 80rpx;
      border-radius: 50%;
      margin-right: 16rpx;
    }

    .evaluate-item-name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 28rpx;
      color: #000000;
    }

    .evaluate-item-time {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
    }

    .evaluate-item-con {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
      margin-top: 24rpx;
    }

    .evaluate-item-replay {
      width: 590rpx;
      background: #F6F6F6;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      padding: 16rpx;
      display: flex;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      margin-top: 24rpx;

      .evaluate-replay-con {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        flex: 1;
      }
    }
  }
</style>