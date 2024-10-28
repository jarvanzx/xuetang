<template>
  <view class="page-pay">
    <view class="pay-course-title" v-if="orderOptions['type'] == 'course'">《{{orderOptions.title}}》</view>
    <view class="pay-course-title" v-else-if="orderOptions.title">{{orderOptions.title}}</view>
    <view class=" pay-price">
      <span class="pay-price-utils">￥</span>
      {{orderOptions.price}}
    </view>
    <view class="pay-time">剩余时间 {{formatTime(remainTime)}}</view>
    <view class="pay-card">
      <view class="pay-card-title">支付方式</view>
      <!-- #ifdef MP-WEIXIN -->
      <view class="pay-card-cell flex align-center justify-between">
        <view class="flex align-center">
          <image src="https://jzxt.qifudaren.net/static/shop/icon-wx.png" class="pay-icon" mode="aspectFill"></image>
          <view>微信支付</view>
        </view>
        <image src="https://jzxt.qifudaren.net/static/shop/icon-has.png" class="icon-selected" mode="aspectFill">
        </image>
      </view>
      <!-- #endif -->
      <!-- #ifdef APP -->
      <view class="pay-card-cell flex align-center justify-between" v-for="(item, index) in payList" :key="index">
        <view class="flex align-center">
          <image :src="`https://jzxt.qifudaren.net/static/shop/${item.icon}`" class="pay-icon" mode="aspectFill">
          </image>
          <view>{{item.name}}</view>
        </view>
        <image @click="payType = item.pay_type"
          :src="`https://jzxt.qifudaren.net/static/shop/icon-${payType == item.pay_type ? 'has' : 'no'}.png`"
          class="icon-selected" mode="aspectFill"></image>
      </view>
      <!-- #endif -->

    </view>
    <view class="cu-btn round block btn-pay" @click="toPay">确认支付</view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        payType: 1,
        isCourse: false,
        detailinfo: {},
        orderOptions: {},
        payList: [{
            icon: 'icon-wx.png',
            name: '微信支付',
            pay_type: 1
          },
          {
            icon: 'icon-alipay.png',
            name: '支付宝',
            pay_type: 2
          },
          {
            icon: 'icon-bankpay.png',
            name: '云闪付',
            pay_type: 3
          }
        ],
        payMap: {
          1: 'wxpay',
          2: 'alipay',
          3: 'unionpay'
        },
        remainTime: 900,
        timer: null
      };
    },
    onLoad(options) {
      this.orderOptions = options
      this.timer = setInterval(() => {
        this.remainTime--
        if (this.remainTime <= 0) {
          clearInterval(this.timer)
          this.orderOptions.title = '订单超时，请返回重新下单'
        }
      }, 1000)
    },
    onShow() {
      // this.getData();
    },
    methods: {
      formatTime(time) {
        const min = Math.floor(time / 60)
        const sec = Math.floor(time % 60)
        const hour = Math.floor(min / 60)
        const minStr = min % 60 < 10 ? '0' + min % 60 : min % 60
        const secStr = sec < 10 ? '0' + sec : sec
        const hourStr = hour < 10 ? '0' + hour : hour
        return hour > 0 ? `${hourStr}:${minStr}:${secStr}` : `${minStr}:${secStr}`
      },
      async getData() {
        let res = await this.$Api.getDetailOrder({
          id: this.$route.query.order_sn
        })
        this.detailinfo = res.data;
      },
      async coursePay() {
        const {
          data: payData
        } = await this.$Api.toPayOrder({
          order_id: this.orderOptions.order_id,
          // #ifdef MP-WEIXIN
          platform: 'wxmini',
          open_id: uni.getStorageSync('open_id'),
          // #endif
          // #ifdef APP
          platform: 'app',
          // #endif
          type: this.orderOptions.type,
          pay_type: this.payType
        })
        uni.requestPayment({
          provider: this.payMap[this.payType],
          // #ifdef MP-WEIXIN
          timeStamp: payData.pay_data.timeStamp,
          nonceStr: payData.pay_data.nonceStr,
          package: payData.pay_data.package,
          signType: payData.pay_data.signType,
          paySign: payData.pay_data.paySign,
          // #endif
          // #ifdef APP
          orderInfo: payData.pay_data,
          // #endif
          success: (res) => {
            uni.showToast({
              title: '支付成功',
              icon: 'none'
            })
            setTimeout(() => {
              uni.navigateBack({
                delta: 1,
                fail() {
                  uni.switchTab({
                    url: '/pages/index/index',
                  })
                }
              })
            }, 1000)
          },
          fail: (err) => {
            uni.showToast({
              title: err?.message || '支付失败',
              icon: 'none'
            })
          },
          complete: () => {}
        })
      },
      async goodsPay() {
        let paytype = ''
        if (this.payType == 1) {
          paytype = 'wechat'
        } else if (this.payType == 2) {
          paytype = 'alipay'
        }

        const {
          data: payData,
          code
        } = await this.$Api.shopOrderPrePay({
          order_sn: this.orderOptions.order_id,
          openid: uni.getStorageSync('open_id'),
          payment: paytype
        }, {
          // #ifdef MP-WEIXIN
          platform: 'WechatMiniProgram',
          // #endif
          // #ifdef APP
          platform: 'app'
          // #endif
        })
        if (code !== 1) {
          uni.showToast({
            title: '支付失败',
            icon: 'none'
          })
          return
        }
        uni.requestPayment({
          provider: this.payMap[this.payType],
          // #ifdef MP-WEIXIN
          timeStamp: payData.pay_data.timeStamp,
          nonceStr: payData.pay_data.nonceStr,
          package: payData.pay_data.package,
          signType: payData.pay_data.signType,
          paySign: payData.pay_data.paySign,
          // #endif
          // #ifdef APP
          orderInfo: payData.pay_data,
          // #endif
          success: (res) => {
            uni.showToast({
              title: '支付成功',
              icon: 'none'
            })
            clearInterval(this.timer)
            setTimeout(() => {
              uni.redirectTo({
                url: '/pages/order/order'
              })
            }, 1200)
          },
          fail: (err) => {
            uni.showToast({
              title: '支付失败',
              icon: 'none'
            })
          },
          complete: () => {}
        })
      },
      async toPay() {
        if (this.payType === '') {
          uni.showToast({
            title: '请选择支付方式',
            icon: 'none'
          })
          return
        }
        if (this.orderOptions.action == 'goods') {
          this.goodsPay()
        } else {
          this.coursePay()
        }
      }
    }
  }
</script>

<style lang="scss">
  .page-pay {
    min-height: 100vh;
    background-color: #f8f8f8;
    overflow: hidden;
    padding: 0 32rpx;

    .pay-course-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 32rpx;
      color: #000000;
      text-align: center;
      margin: 58rpx auto 0;
    }

    .pay-price {
      font-family: DIN, DIN;
      font-weight: bold;
      font-size: 72rpx;
      color: #000000;
      margin-top: 58rpx;
      text-align: center;
    }

    .pay-price-utils {
      font-family: DIN, DIN;
      font-weight: 500;
      font-size: 48rpx;
      color: #000000;
    }

    .pay-time {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;
      margin-top: 24rpx;
      text-align: center;
    }

    .pay-card {
      background-color: #fff;
      border-radius: 16rpx;
      margin: 64rpx auto 0;
      padding: 0 24rpx;
    }

    .pay-card-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #000000;
      height: 88rpx;
      line-height: 88rpx;
    }

    .pay-card-cell {
      height: 88rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 32rpx;
      color: #333333;

      .pay-icon {
        height: 48rpx;
        width: 48rpx;
        margin-right: 14rpx;
      }

      .icon-selected {
        height: 36rpx;
        width: 36rpx;
      }
    }

    .btn-pay {
      margin: 64rpx auto 0;
      width: 654rpx;
      height: 88rpx;
      background: #7644FF;
      border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 32rpx;
      color: #FFFFFF;
    }
  }
</style>