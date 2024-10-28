<template>
  <view class="page-confirm-order has-combtn-padding">
    <view class="confirm-address flex align-center justify-between">
      <image src="https://jzxt.qifudaren.net/static/shop/icon-location.png" class="icon-location" mode="aspectFill">
      </image>
      <view class="address-info">
        <view class="address-info-detail line-2">
          {{detailInfo.address.province_name + detailInfo.address.city_name + detailInfo.address.district_name + detailInfo.address.address}}
        </view>
        <view class="address-info-user flex align-center">
          <view>{{detailInfo.address.consignee}}</view>
          <view class="margin-left">{{detailInfo.address.mobile}}</view>
        </view>
      </view>
    </view>

    <view class="confirm-goods">
      <view class="confirm-goods-item" v-for="item in detailInfo.items" :key="item.id">
        <image :src="getUrl(item.goods_image)" class="confirm-goods-cover" mode="aspectFill"></image>
        <view class="confirm-goods-info">
          <view class="confirm-goods-name line-2">{{item.goods_title}}</view>
          <view class="confirm-goods-price text-price">{{item.goods_price}}</view>
          <view class="confirm-goods-num">数量：x{{item.goods_num}}</view>
        </view>
      </view>
    </view>
    <view class="confirm-order">
      <view class="flex align-center justify-between confirm-cell">
        <view class="confirm-cell-label">商品金额</view>
        <view class="text-price confirm-cell-price">{{detailInfo.goods_amount}}</view>
      </view>
      <view class="flex align-center justify-between confirm-cell">
        <view class="confirm-cell-label">运费金额</view>
        <view class="text-price confirm-cell-price">{{detailInfo.dispatch_amount}}</view>
      </view>
      <view class="flex align-center justify-between confirm-cell">
        <view class="confirm-cell-label">
          <image src="https://jzxt.qifudaren.net/static/shop/icon-quan.png" class="icon-quan" mode="aspectFill"></image>
          优惠券
        </view>
        <view class="flex align-center confirm-cell-discount">
          -
          <view class="text-price confirm-cell-price">{{detailInfo.coupon_discount_fee}}</view>
        </view>
      </view>
      <view class="flex align-center justify-between confirm-cell" v-if="detailInfo.promo_types_text.length > 0">
        <view class="confirm-cell-label">
          <image src="https://jzxt.qifudaren.net/static/shop/icon-zhe.png" class="icon-quan" mode="aspectFill"></image>
          {{detailInfo.promo_types_text[0]}}
        </view>
        <view class="flex align-center confirm-cell-discount">
          -
          <view class="text-price confirm-cell-price">{{detailInfo.promo_discount_fee}}</view>
        </view>
      </view>
      <view class="confirm-cell confirm-order-all">
        优惠 <span class="text-price">{{detailInfo.total_discount_fee}}</span>
        <span class="order-need-pay">应付款 <span class="text-price">{{detailInfo.order_amount}}</span></span>
      </view>
    </view>

    <view class="confirm-order" v-if="detailInfo.status !== 'unpaid'">
      <view class="flex align-center justify-between confirm-cell">
        <view class="confirm-cell-label">实际支付金额</view>
        <view class="text-price confirm-cell-price">{{detailInfo.pay_fee}}</view>
      </view>
      <view class="flex align-center justify-between confirm-cell">
        <view class="confirm-cell-label">支付方式</view>
        <view class="">{{detailInfo.pay_types_text[0]}}</view>
      </view>
      <view class="flex align-center justify-between confirm-cell">
        <view class="confirm-cell-label">支付时间</view>
        <view class="">{{detailInfo.paid_time}}</view>
      </view>
      <view class="flex align-center justify-between confirm-cell">
        <view class="confirm-cell-label">支付流水号</view>
        <view class=""></view>
      </view>
      <view class="flex align-center justify-between confirm-cell">
        <view class="confirm-cell-label">订单号</view>
        <view class="">{{detailInfo.order_sn}}</view>
      </view>
    </view>
    <view class="page-fixed-footer">
      <view class="order-bottom page-footer-wrap">
        <template v-if="detailInfo.status == 'paid'">
          <view class="cu-btn round " @click="toAfterSale">发起售后</view>
          <view class="cu-btn round btn-submit" @click="toWriteOff">核销码</view>
        </template>
        <template v-else-if="detailInfo.status == 'unpaid'">
          <view class="cu-btn round " @click="cancelOrder">取消订单</view>
          <view class="cu-btn round btn-submit" @click="toPay">去支付</view>
        </template>
        <template v-else>
          <view class="cu-btn round " @click="deleteOrder">删除订单</view>
          <view class="cu-btn round btn-submit" @click="rebuy">再次购买</view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import { IMG_BASE_URL } from '../../config/env';
  export default {
    data() {
      return {
        allPrice: 0,
        detailInfo: {},
        orderSn: '',
        addressInfo: {}
      };
    },
    onShow() {
      this.getData();
    },
    onLoad(query) {
      this.orderSn = query.order_sn
    },
    methods: {
      getUrl(url) {
        if(/^http/.test(url)) {
          return url
        } else {
          return IMG_BASE_URL + url
        }
      },
      toAfterSale() {
        uni.navigateTo({
          url: '/pages/afterSale/afterSale'
        })
      },
      toWriteOff() {},
      cancelOrder() {},
      toPay() {
        uni.navigateTo({
          url: `/pages/pay/pay?order_id=${this.detailInfo.order_sn}&price=${this.detailInfo.pay_fee}&action=goods`
        })
      },
      deleteOrder() {},
      rebuy() {
        const goods_list = this.detailInfo.items.map(item => {
          return {
            goods_id: item.id,
            goods_sku_price_id: item.goods_sku_price_id,
            goods_num: item.goods_num
          }
        })
        const goodsInfo = {
          goods_list,
          from: 'order',
          order_type: 'goods'
        }
        const query = JSON.stringify(goodsInfo)
        uni.navigateTo({
          url: '/pages/confirmOrder/confirmOrder?data=' + query
        })
      },
      async getData() {
        let res = await this.$Api.getDetailOrder({
          id: this.orderSn
        })
        this.detailInfo = res.data;
      },
      toAddressList() {
        uni.navigateTo({
          url: '/pages/addressList/addressList'
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

    .order-bottom {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      font-size: 24rpx;
      padding: 0 32rpx;

      .cu-btn {
        width: 335rpx;
        height: 88rpx;
        background: #FFFFFF;
        border: 2rpx solid #DDDDDD;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 32rpx;
        color: #333333;
      }

      .btn-submit {
        background: #7644FF;
        color: #fff;
      }
    }
  }
</style>