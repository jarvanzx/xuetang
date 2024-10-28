<template>
  <view class="page-user-withdraw page-wrap">
    <image src="https://jzxt.qifudaren.net/static/index/bg.png" class="index-top" mode=""></image>
    <view class="page-top-nav">
      <image src="https://jzxt.qifudaren.net/static/common/back.png" class="back-img" mode="" @click="back"></image>
      <view class="flex-sub text-white" style="width: 100%;text-align: center;">申请提现</view>
    </view>
    <view class="withdraw-money-wrap">
      <view class="withdraw-money">{{commission}}</view>
      <view>可提现收入</view>
    </view>
    <view class="cdk-form bg-white">
      <view class="cdk-form-title">申请提现金额</view>
      <input type="number" v-model.number="iptValue" placeholder="请输入要提现的金额" class="cdk-from-input" />
      <view class="cdk-btn cu-btn round block" :class="{disabled}" @click="onApply">申请提现</view>
    </view>
    <view class="cdk-des">
      <view class="cdk-des-title">提现规则</view>
      <view class="margin-top">
        Meme股、科技股、比特币——所有这些都在今年大幅上涨，引起了看空者的注意，他们在当今市场的许多角落看到了泡沫的迹象。与此同时，看多者坚持认为这是夸大其词，认为预测泡沫迹象还为时过早。</view>
      <view class="margin-top">
        Meme股、科技股、比特币——所有这些都在今年大幅上涨，引起了看空者的注意，他们在当今市场的许多角落看到了泡沫的迹象。与此同时，看多者坚持认为这是夸大其词，认为预测泡沫迹象还为时过早。</view>
    </view>
  </view>
</template>

<script>
  // 需要绑定账户等操作
  export default {
    data() {
      return {
        commission: 0,
        iptValue: '',
      };
    },
    onLoad(options) {
      if (options.commission) {
        this.commission = options.commission
      }
    },
    computed: {
      disabled() {
        return this.iptValue > this.commission
      },
    },
    methods: {
      onApply() {
        if (this.disabled) {
          return uni.showToast({
            title: '提现金额不能大于可提现金额',
            icon: 'none',
          })
        }
      },
      back() {
        uni.navigateBack()
      }
    }
  }
</script>

<style lang="scss">
  .page-user-withdraw {
    background-color: #f8f8f8;
    min-height: 100vh;

    .index-top {
      height: 496rpx;
    }

    .withdraw-money-wrap {
      text-align: center;
      position: relative;
      z-index: 1;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #FFFFFF;
      margin-top: 56rpx;

      .withdraw-money {
        font-family: DIN, DIN;
        font-weight: 500;
        font-size: 56rpx;
        color: #FFFFFF;
      }
    }

    .cdk-des {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      color: #999999;
      margin-top: 48rpx;
      padding: 0 32rpx;
    }

    .cdk-des-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 28rpx;
      color: #333333;
    }

    .cdk-btn {
      width: 622rpx;
      height: 88rpx;
      background: #7644FF;
      border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
      margin: 48rpx auto 0;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 32rpx;
      color: #FFFFFF;
    }

    .cdk-form {
      border-radius: 16rpx;
      padding: 32rpx;
      margin: 32rpx auto 0;
      position: relative;
      width: 686rpx;
      height: 368rpx;
      background: #FFFFFF;
      z-index: 1;

      .cdk-form-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 32rpx;
        color: #000000;
      }

      .cdk-from-input {
        width: 622rpx;
        height: 108rpx;
        background: #F8F8F8;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        margin-top: 16rpx;
        padding: 32rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 32rpx;
        color: #999999;
        ;
      }
    }

    .cdk-temp {
      width: 686rpx;
      background: linear-gradient(131deg, #6646FF 0%, #9D3BFF 100%);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      padding: 32rpx;
      box-sizing: border-box;
      margin: 0 auto;

      .cdk-text-img {
        width: 140rpx;
        height: 38rpx;
      }

      .cdk-temp-con {
        width: 622rpx;
        height: 50rpx;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8rpx 8rpx 8rpx 8rpx;
        margin: 24rpx auto 0;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 56rpx;
      }
    }
  }

  .disabled {
    opacity: .7;
  }
</style>