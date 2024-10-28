<template>
  <view class="coupon-list">
    <view class="coupon-item" v-for="item in coupons" :key="item.id" @click="select(item)">
      <view class="coupon-left bg-white">
        <view class="coupon-title coupon-title-none" v-if="item === 1">无门槛</view>
        <view class="coupon-title" v-else>{{item.amount_text}}</view>
        <view class="coupon-time">
          <span class="text-333">{{item.get_end_time}}前有效</span>
          <!--<span class="text-red" v-else>3天后 到期</span>-->
        </view>
        <view class="coupon-use">
          <view>
            <span class="coupon-use-des">使用说明</span> <span class="cuIcon-unfold"></span>
          </view>
          <view class="coupon-use-info line-1">
            {{item.description}}
          </view>
        </view>
        <image src="https://jzxt.qifudaren.net/static/user/coupon-used.png" class="coupon-status-img" v-if="item >8"
          mode=""></image>
        <view class="top-dot"></view>
        <view class="bottom-dot"></view>
      </view>
      <view class="coupon-right" :class="{'coupon-right-used': item > 8}">
        <view>
          <span class="coupon-money">{{item.amount}}</span>
          <span class="coupon-utils" v-if="item.type=='reduce'">元</span>
          <span class="coupon-utils" v-if="item.type=='discount'">折</span>
        </view>
        <view v-if="!geted" class="cu-btn bg-red round coupon-btn" @click="getOneCoupon(item)">{{item.get_status_text}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "CouponBox",
    props: {
      geted: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        coupons: [],
        page: 1,
        list_rows: 20,
        pageMax: false,
      };
    },
    mounted() {
      this.getCoupon();

    },
    beforeDestroy() {
      this.page = 1
      this.pageMax = false
      this.coupons = []
    },

    methods: {
      async getCoupon() {
        const {
          data
        } = await this.$Api.getCouponList()
        this.coupons = data.data ?? []
      },

      async getOneCoupon(item) {
        if (item.get_status == 'can_get') {
          const {
            code
          } = await this.$Api.postCouponGet({
            id: item.id
          })
          if (code == 1) {
            uni.showToast({
              title: '领取成功',
              icon: 'none',
            })
            this.getCoupon();
          } else {
            this.$emit('useCoupon', item.id)
          }
        }

      },
      select(id) {
        if (this.geted) return
        this.$emit('select', id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .coupon-list {
    width: 100%;
    padding: 24rpx;
    background-color: #f8f8f8;

    .coupon-item {
      display: flex;
      width: 686rpx;
      margin: 0 auto 16rpx;
    }

    .top-dot {
      position: absolute;
      top: -12rpx;
      right: -12rpx;
      height: 24rpx;
      width: 24rpx;
      border-radius: 50%;
      background-color: #f8f8f8;
    }

    .bottom-dot {
      position: absolute;
      bottom: -12rpx;
      right: -12rpx;
      height: 24rpx;
      width: 24rpx;
      border-radius: 50%;
      background-color: #f8f8f8;
    }

    .coupon-status-img {
      position: absolute;
      right: 12rpx;
      top: 0;
      height: 128rpx;
      width: 128rpx;
    }

    .coupon-left {
      padding: 24rpx 32rpx;
      width: 490rpx;
      border-top-left-radius: 16rpx;
      border-bottom-left-radius: 16rpx;
      position: relative;
    }

    .coupon-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 28rpx;
      color: #000000;

      &.coupon-title-none {
        color: #999;
      }
    }

    .coupon-time {
      margin-top: 8rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
    }

    .coupon-use {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      margin-top: 16rpx;
    }

    .coupon-use-des {
      margin-right: 14rpx;
    }

    .coupon-use-info {
      margin-top: 16rpx;
    }

    .coupon-right {
      width: 196rpx;
      background-color: #FFEBED;
      padding: 24rpx 32rpx;
      border-top-right-radius: 16rpx;
      border-bottom-right-radius: 16rpx;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      border-left: 2rpx dotted #eee;

      &.coupon-right-used {
        background: rgba(0, 0, 0, 0.06);

        .coupon-btn {
          display: none;
        }

        .coupon-money {
          color: #999999;
        }

        .coupon-utils {
          color: #999999;
        }
      }

      .coupon-money {
        font-family: DIN, DIN;
        font-weight: bold;
        font-size: 60rpx;
        color: #FD493B;
      }

      .coupon-utils {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 24rpx;
        color: #FD493B;
      }

      .coupon-btn {
        margin-top: 12rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #FFFFFF;
        width: 140rpx;
        height: 42rpx;
        line-height: 42rpx;
        padding: 4rpx 24rpx;
      }
    }
  }
</style>