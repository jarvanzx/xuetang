<template>
  <view class="page-confirm-order has-combtn-padding">
    <view class="confirm-address flex align-center justify-between" @click="toAddressList">
      <image src="https://jzxt.qifudaren.net/static/shop/icon-location.png" class="icon-location" mode="aspectFill">
      </image>
      <template v-if="!addressInfo.address">
        <view class="address-info">请选择收货地址</view>
      </template>
      <template v-else>
        <view class="address-info">
          <view class="address-info-detail line-2">
            {{addressInfo.province_name}}{{addressInfo.city_name}}{{addressInfo.district_name}}{{addressInfo.address}}
          </view>
          <view class="address-info-user flex align-center">
            <view>{{addressInfo.consignee}}</view>
            <view class="margin-left">{{addressInfo.mobile}}</view>
          </view>
        </view>
      </template>
      <image src="https://jzxt.qifudaren.net/static/shop/right-arr.png" class="icon-right" mode=""></image>
    </view>

    <view class="confirm-goods">
      <view class="confirm-goods-item" v-for="item in goodsList" :key="item.goods_id">
        <image :src="item.goods.image" class="confirm-goods-cover" mode="aspectFill"></image>
        <view class="confirm-goods-info">
          <view class="confirm-goods-name line-2">{{item.goods.title}}</view>
          <view class="confirm-goods-price text-price">{{item.goods_amount}}</view>
          <view class="confirm-goods-num">数量：x{{item.goods_num}}</view>
        </view>
      </view>
    </view>
    <view class="confirm-order">
      <view class="flex align-center justify-between confirm-cell">
        <view class="confirm-cell-label">商品金额</view>
        <view class="text-price confirm-cell-price">{{detailData.goods_amount}}</view>
      </view>
      <view class="flex align-center justify-between confirm-cell">
        <view class="confirm-cell-label">运费金额</view>
        <view class="text-price confirm-cell-price">{{detailData.dispatch_amount}}</view>
      </view>
      <view class="flex align-center justify-between confirm-cell" @click="openShow">
        <view class="confirm-cell-label">
          <image src="https://jzxt.qifudaren.net/static/shop/icon-quan.png" class="icon-quan" mode="aspectFill"></image>
          优惠券<text v-if="listData.length > 0">{{listData.length}}</text>
        </view>
        <view class="flex align-center confirm-cell-discount">
          -
          <view class="text-price confirm-cell-price">{{detailData.coupon_discount_fee}}</view>
        </view>
      </view>
      <!--<view class="flex align-center justify-between confirm-cell">
				<view class="confirm-cell-label">
					<image src="https://jzxt.qifudaren.net/static/shop/icon-zhe.png" class="icon-quan" mode=""></image>
					全场9折
				</view>
				<view class="flex align-center confirm-cell-discount">
					-
					<view class="text-price confirm-cell-price">199</view>
				</view>
			</view>-->
      <view class="confirm-cell confirm-order-all">
        优惠 <span class="text-price">{{detailData.total_discount_fee}}</span>
        <span class="order-need-pay">应付款 <span class="text-price">{{detailData.pay_fee}}</span></span>
      </view>
    </view>
    <view class="page-fixed-footer">
      <view class="cart-bottom page-footer-wrap">
        <view class="text-right">
          <view>合计 <text class="text-price text-red text-bold price-all">{{detailData.pay_fee}}</text></view>
        </view>
        <view class="cu-btn round btn-submit" @click="toSave">提交订单</view>
      </view>
    </view>
    <u-popup :show="show" :round="40" :closeOnClickOverlay="true" mode="bottom" @close="closebottom"
      style="height: 100%;">
      <view class="coupons-list">
        <view class="coupon-item" v-for="item in listData" :key="item.id">
          <view class="coupon-left bg-white">
            <view class="coupon-title coupon-title-none" v-if="item === 1">无门槛</view>
            <view class="coupon-title" v-else>{{item.amount_text}}</view>
            <view class="coupon-time">
              <span class="text-333">{{item.use_end_time}}前有效</span>
              <!--<span class="text-red" v-else>3天后 到期</span>-->
            </view>
            <view class="coupon-use">
              <view>
                <span class="coupon-use-des">使用说明</span> <span class="cuIcon-unfold"></span>
              </view>
              <view class="coupon-use-info">
                {{item.description}}
              </view>
            </view>
            <image src="https://jzxt.qifudaren.net/static/user/coupon-used.png" class="coupon-status-img" v-if="item >8"
              mode=""></image>
            <view class="top-dot"></view>
            <view class="bottom-dot"></view>
          </view>
          <view class="coupon-right" :class="{'coupon-right-used': item > 8}" @click="toCollect(item.id)">
            <view>
              <span class="coupon-money">{{item.amount}}</span>
              <span class="coupon-utils" v-if="item.type=='reduce'">元</span>
              <span class="coupon-utils" v-if="item.type=='discount'">折</span>
            </view>
            <!-- <view class="cu-btn bg-red round coupon-btn">去领取</view> -->
          </view>
          <image :src="`/static/common/${couponId == item.id ? 'checked' : 'check'}.png`" mode="aspectFill"
            class="icon-44" @click="toCollect(item.id)" style="margin-left: 12rpx;"></image>
        </view>
        <view v-if="listData.length==0">
          <u-empty mode="coupon">
          </u-empty>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
  // import coupon from "../user/coupon.vue"
  export default {
    data() {
      return {
        allPrice: '399.00',
        params: null,
        detailData: null,
        goodsList: [],
        addressInfo: {},
        show: false,
        listData: [],
        loaded: false,
        page: 1,
        pagesize: 10,
        avalibleCoupons: [],
        couponId: ''
      };
    },
    // components: {
    //   coupon
    // },
    async onLoad(options) {
      const query = options.data
      try {
        const json = decodeURIComponent(query)
        this.params = JSON.parse(json)
        // this.couponId = this.params.coupon_id
        await this.getAvalibleCoupons()
        await this.getDefaultAd();
        this.getCalcInfo();

        // this.getMyFo();
      } catch (e) {
        //TODO handle the exception
      }
    },
    onShow() {
      this.getDefaultAd();
    },
    methods: {
      async getAvalibleCoupons() {
        const {
          data
        } = await this.$Api.getOrderCoupons(this.params)
        console.log(data);
        this.listData = data.can_use
        if (data.can_use?.length > 0) {
          const coupon = data.can_use.sort((a, b) => Number(b.coupon_money) - Number(a.coupon_money))
          this.couponId = coupon[0].id
          this.params.coupon_id = this.couponId
        }
      },

      toCollect(id) {
        if (this.couponId == id) {
          this.couponId = ''
          return

        }
        this.couponId = id
        this.show = false
      },
      async getMyFo() {
        let res = await this.$Api.getUserCoupon({
          page: this.page,
          pagesize: this.pagesize
        })
        this.listData = res.data.data
      },
      openShow() {
        this.show = true;
      },
      closebottom() {
        this.show = false;
      },
      async getDefaultAd() {
        let res = await this.$Api.getAddressDefault({})
        if (res?.data) {
          this.addressInfo = res.data;
          this.params.address_id = res.data.id
        }

      },
      async getCalcInfo() {
        if (this.params) {
          let res = await this.$Api.postCalcOrder(this.params)
          this.detailData = res.data
          this.goodsList = res.data.goods_list
        }
      },
      toAddressList() {
        console.log(this.addressInfo.id);
        uni.navigateTo({
          url: '/pages/addressList/addressList?address_id=' + this.addressInfo.id
        })
      },
      async toSave() {
        if (!this.addressInfo) {
          return uni.showToast({
            title: '请选择地址',
            icon: 'none'
          })
        }
        let res = await this.$Api.postGoodsCreateOrder({
          order_type: 'goods',
          from: this.params.from,
          goods_list: this.params.goods_list,
          address_id: this.addressInfo.id,
          coupon_id: this.couponId
        })
        uni.redirectTo({
          url: `/pages/pay/pay?order_id=${res.data.order_sn}&price=${res.data.pay_fee}&action=goods`
        })
      }
    }
  }
</script>

<style lang="scss">
  .page-confirm-order {
    padding: 16rpx 32rpx;
    background-color: #f8f8f8;
    min-height: 100vh;

    .confirm-address {
      background-color: #fff;
      border-radius: 16rpx;
      width: 686rpx;
      height: 200rpx;
      padding: 32rpx;
      margin: 0 auto 16rpx;

      .address-info {
        flex: 1;
        padding: 0 16rpx;
      }

      .address-info-detail {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 32rpx;
        color: #000000;
      }

      .address-info-user {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #666666;
        margin-top: 8rpx;
      }

      .icon-location {
        height: 64rpx;
        width: 64rpx;
      }

      .icon-right {
        height: 52rpx;
        width: 52rpx;
      }
    }

    .confirm-goods {
      background-color: #fff;
      border-radius: 16rpx;
      width: 686rpx;
      padding: 32rpx;
      margin: 0 auto 16rpx;
      overflow: hidden;
      padding-bottom: 0;

      .confirm-goods-item {
        margin-bottom: 32rpx;
        display: flex;
      }

      .confirm-goods-cover {
        width: 160rpx;
        height: 192rpx;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        min-width: 160rpx;
        margin-right: 16rpx;

      }

      .confirm-goods-name {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 28rpx;
        color: #333333;
      }

      .confirm-goods-price {
        font-family: DIN, DIN;
        font-weight: bold;
        font-size: 36rpx;
        color: #333333;
        margin-top: 12rpx;
      }

      .confirm-goods-num {
        margin-top: 12rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #999999;
      }
    }

    .confirm-order {
      background-color: #fff;
      border-radius: 16rpx;
      width: 686rpx;
      margin: 0 auto 16rpx;
      overflow: hidden;
      padding: 0 24rpx;

      .confirm-cell {
        height: 88rpx;
      }

      .confirm-cell-label {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 32rpx;
        color: #333333;
        display: flex;
        align-items: center;
      }

      .confirm-cell-price {
        font-family: DIN, DIN;
        font-weight: bold;
        font-size: 32rpx;
        color: #000000;
      }

      .icon-quan {
        height: 36rpx;
        width: 36rpx;
        margin-right: 8rpx;
      }

      .confirm-cell-discount {
        font-family: DIN, DIN;
        font-weight: bold;
        font-size: 32rpx;
        color: #7644FF;

        .confirm-cell-price {
          color: #7644FF;
        }
      }

      .confirm-order-all {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .text-price {
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 28rpx;
          color: #7644FF;
        }

        .order-need-pay {
          margin-left: 48rpx;

          .text-price {
            font-family: DIN, DIN;
            font-weight: 500;
            font-size: 38rpx;
            color: #000000;
          }
        }
      }
    }

    .cart-bottom {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      font-size: 24rpx;
      padding: 0 32rpx;

      .price-all {
        font-family: DIN, DIN;
        font-weight: bold;
        font-size: 36rpx;
        color: #FF2E00;
      }
    }

    .btn-submit {
      width: 192rpx;
      height: 88rpx;
      background: #7644FF;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 32rpx;
      color: #FFFFFF;
    }
  }

  .coupons-list {
    height: 600rpx;
    padding: 16rpx 32rpx;
    border-radius: 40rpx;
    background-color: #f8f8f8;
    overflow-y: auto;

    .coupon-item {
      display: flex;
      align-items: center;
      width: 686rpx;
      min-height: 222rpx;
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
      min-height: 222rpx;
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
        width: 120rpx;
        height: 42rpx;
        line-height: 42rpx;
        padding: 4rpx 24rpx;
      }
    }
  }
</style>