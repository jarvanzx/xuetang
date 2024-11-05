<template>
  <view class="page-goods-detail has-combtn-padding">
    <!-- <view class="nav-line" :style="{height: '44px', paddingTop: statusBarHeight + 'px'}">
      <image src="https://jzxt.qifudaren.net/static/shop/back-black.png" class="back-img" @click="toBack" mode="">
      </image>
    </view> -->
    <cus-nav-bar :title="detailData.title" show-back :backgroundColor="scrolled ? '#FFF' : 'transparent'"
      :showTitle="scrolled" :back-color="scrolled ? 'black' : 'white'"></cus-nav-bar>
    <view class="swiper-wrap">
      <swiper :indicator-dots="false" indicator-color="rgba(255,255,255,0.5)" @change="handleChange"
        indicator-active-color="#fff" :autoplay="true" :interval="3000" :duration="1000">
        <swiper-item v-for="item in detailData.images" :key="item.id">
          <image class="swiper-item" :src="item" mode="aspectFill"></image>
        </swiper-item>

      </swiper>
      <div class="swiper-dot-wrap">{{ currentId }}/{{ detailData.images.length }}</div>
    </view>
    <view class="detail-card">
      <view class="price-line flex" style="margin-bottom: 24rpx; align-items: baseline;">
        <view class="text-price text-red">{{ detailData.price[0] }}</view>
        <view class="o-price" style="margin-left: 30rpx;">￥{{detailData.original_price}} 原价</view>
      </view>

      <view class="detail-title line-2">{{ detailData.title }}</view>
      <!-- <view class="text-price text-red">{{ detailData.price[0] }}</view> -->
      <view class="sale-count">已售{{detailData.sales}}</view>
      <div class="coupons flex justify-between align-center" @click="showCoupon = true">
        <view class="coupon-line flex align-center flex-wrap" style="margin-top: 12rpx;">
          <view class="coupon-item" v-for="item in coupons" :key="item.id">满{{item.enough}}减{{item.amount}}</view>
        </view>
        <image src="/static/common/arrow-right.png" mode="aspectFill" class="icon-44"></image>
      </div>
    </view>
    <!-- <view class="detail-card" v-if="detailData.is_sku === 1">
    </view> -->

    <view class="detail-card">
      <view class="detail-card-title">

        <text v-if="cmt_total > 0">用户评价({{cmt_total}})</text>
        <view class="flex align-center text-gray" @click="toEva">
          全部
          <image src="https://jzxt.qifudaren.net/static/shop/right-arr.png" class="right-arr-img" mode=""></image>
        </view>
      </view>
      <view class="evaluate-item" v-for="item in commenData" :key="item.id">
        <image :src="item.user_avatar" class="evaluate-item-ava" mode="aspectFill"></image>
        <view class="evaluate-item-info">
          <view class="evaluate-item-name">{{ item.user_nickname }}</view>
          <view class="evaluate-item-con">{{ item.content }}</view>
        </view>
      </view>
    </view>

    <view class="detail-card">
      <view class="detail-card-title">商品介绍
      </view>
      <view class="detail-rich-wrap">
        <view v-html="detailData.content"></view>
      </view>
    </view>


    <view class="detail-footer">
      <view class="footer-wrap">
        <view class="flex align-center justify-between footer-wrap-left">
          <view class="footer-wrap-handle" @click="toCollect" v-if="!detailData.favorite">
            <image src="https://jzxt.qifudaren.net/static/shop/collection.png" class="icon-44" mode=""></image>
            <view>收藏</view>
          </view>
          <view class="footer-wrap-handle" @click="toCollect" v-if="detailData.favorite">
            <image src="https://v3.shopro.top/assets/addons/shopro/uniapp/goods/collect_1.gif" class="icon-44" mode="">
            </image>
            <view>已收藏</view>
          </view>
          <!-- #ifdef MP -->
          <view class="footer-wrap-handle">
            <image src="https://jzxt.qifudaren.net/static/shop/service.png" class="icon-44" mode=""></image>
            <view>客服</view>
            <button class="reset-btn" open-type="contact"></button>
          </view>
          <!-- #endif -->
          <!-- #ifdef APP -->
          <view class="footer-wrap-handle">
            <image src="https://jzxt.qifudaren.net/static/shop/service.png" class="icon-44" mode=""></image>
            <view>客服</view>
          </view>
          <!-- #endif -->
          <view class="footer-wrap-handle" @click="toCart">
            <image src="/static/common/cart.png" class="icon-44" mode="aspectFill"></image>
            <view>购物车</view>
          </view>
        </view>
        <view class="flex align-center justify-between footer-wrap-right">
          <view class="cu-btn round line" @click="toAddCart(2)">加入购物车</view>
          <view class="cu-btn round btn-buy" @click="toBuy(1)">立即购买</view>
        </view>
      </view>
    </view>
    <u-popup ref="skuPopup" :show="showSku" @close="showSku = false" mode="bottom" :round="10" :closeable="true"
      :closeOnClickOverlay="true">
      <view class="popup">
        <view class="img">
          <u-image :src="detailData.image" width="178rpx" height="178rpx"></u-image>
          <text class="popPirze">￥{{detailData.price[0]}} <text class="popCount">库存{{detailData.stock}}件</text></text>
        </view>

        <view class="specsList" v-for="(item, idx) in detailData.skus" :key="item.id">
          <text class="tit">{{item.name}}</text>
          <view>
            <text @click="chooseIt(items, idx)" v-for="items in item.children" :key="items.id"
              :class="{specsInfo: true, specsInfoActive: items.id == activeSkuIds[idx]}">{{items.name}}</text>
          </view>
        </view>
        <!-- 数量 -->
        <view class="count">
          购买数量<u-number-box v-model="countvalue" @change="valChange" :min='1' :max="detailData.stock"></u-number-box>
        </view>
        <view @click="buyNow" v-if="status == 1" class="buyNow">立即购买</view>
        <view v-if="status == 2" @click="putShopCar" class="buyNow">确定</view>
      </view>
    </u-popup>
    <u-popup :show="showCoupon" :closeOnClickOverlay="true" @close="showCoupon = false">
      <CouponBox @useCoupon="onUseCoupon"></CouponBox>
    </u-popup>
  </view>
</template>

<script>
  import CouponBox from '@/components/CouponBox.vue';
  export default {
    data() {
      return {
        showCoupon: false,
        detailData: {
          images: []
        },
        currentId: 1,
        commenData: [],
        goodsId: '',
        cmt_total: 0,
        statusBarHeight: 0,
        scrolled: false,
        showSku: false,
        coupons: [],
        currentSku: '',
        activeSkuIds: [],
        status: 1,
        skuPrice: '',
        countvalue: 1,
        couponId: ''
      };
    },
    components: {
      CouponBox
    },
    onLoad(options) {
      this.goodsId = options.goodsId
      this.getData()
      this.getComment()
      const info = uni.getWindowInfo()
      this.statusBarHeight = info.statusBarHeight
      this.getCoupons()
    },
    onPageScroll(e) {
      this.scrolled = e.scrollTop > 50
    },
    onShareAppMessage() {
      return {
        title: this.detailData.title,
        path: '/pages/goodsDetail/goodsDetail?goodsId=' + this.goodsId,
        imageUrl: this.detailData.image
      }
    },
    onShareTimeline() {
      return {
        title: this.detailData.title,
        path: '/pages/goodsDetail/goodsDetail?goodsId=' + this.goodsId,
        imageUrl: this.detailData.image
      }
    },
    methods: {
      onUseCoupon() {
        // this.couponId = val
        this.showCoupon = false
      },
      valChange(e) {
        console.log(e);
        this.countvalue = e.value
      },
      buyNow() {
        if (this.activeSkuIds.length < this.detailData.skus.length) return
        this.createOrder()
      },
      chooseIt(sku, index) {
        if (this.activeSkuIds[index] == sku.id) {
          this.activeSkuIds[index] = ''
          this.skuPrice = this.detailData.price[0]
          return
        }
        this.activeSkuIds[index] = sku.id
        const idx = this.detailData.sku_prices.findIndex(item => item.goods_sku_ids == this.activeSkuIds.join(','))
        this.skuPrice = this.detailData.sku_prices[idx].price
        this.$forceUpdate()
      },
      async getCoupons() {
        try {
          const {
            data
          } = await this.$Api.getCouponList()
          console.log(data);
          this.coupons = data?.data ?? []
        } catch (e) {
          //TODO handle the exception
        }
      },
      async getData() {
        const res = await this.$Api.getShopGoodDetail({
          id: this.goodsId
        })
        res.data.content =(res.data.content.indexOf('<image')!=-1)?res.data.content.replaceAll('<image ', '<image style="width:100%;object-fit:cover;"'):res.data.content
        this.detailData = res.data
        if (this.detailData.is_sku) {
          this.activeSkuIds = this.detailData.sku_prices[0].goods_sku_ids?.split(',') ?? []
        }

      },
      handleChange(event) {
        this.currentId = event.detail.current + 1
      },
      async getComment() {
        const res = await this.$Api.getShopGoodComment({
          goods_id: this.goodsId,
          list_rows: 3
        })
        this.commenData = res.data.data
        this.cmt_total = res.data.total
      },
      toEva() {
        uni.navigateTo({
          url: '/pages/user/evaluate?goodsId=' + this.goodsId
        })
      },
      toBack() {
        uni.navigateBack()
      },
      toCart() {
        uni.navigateTo({
          url: '/pages/cart/cart'
        })
      },
      toBuy(status) {
        this.status = status
        if (this.detailData.is_sku == 1) {
          this.showSku = true
          return
        }
        this.createOrder()
      },
      createOrder() {
        const idx = this.detailData.sku_prices.findIndex(item => item.goods_sku_ids == this.activeSkuIds.join(','))
        let sku_id = this.detailData.sku_prices[idx]?.id
        if (this.detailData.is_sku == 0) {
          sku_id = this.detailData.sku_prices[0].id
        }
        let paramtemp = {
          order_type: 'goods',
          from: 'goodsdetail',
          goods_list: [{
            'goods_id': this.detailData.id,
            'goods_num': this.countvalue,
            'goods_sku_price_id': sku_id
          }],
          // coupon_id: this.couponId
        }
        const query = encodeURIComponent(JSON.stringify(paramtemp))
        uni.navigateTo({
          url: '/pages/confirmOrder/confirmOrder?data=' + query
        })
      },
      toAddCart(status) {
        if (this.detailData.is_sku == 1) {
          this.status = status
          this.showSku = true
          return
        }
        this.putShopCar()
      },
      async putShopCar() {
        const idx = this.detailData.sku_prices.findIndex(item => item.goods_sku_ids == this.activeSkuIds.join(','))
        let sku_id = this.detailData.sku_prices[idx]?.id
        if (this.detailData.is_sku == 0) {
          sku_id = this.detailData.sku_prices[0].id
        }
        let res = await this.$Api.postUpdateCart({
          goods_id: this.goodsId,
          goods_num: 1,
          goods_sku_price_id: sku_id,
          type: 'inc'
        })
        if (res.code == 1) {
          uni.showToast({
            title: '加入购物车成功',
            icon: 'none'
          })
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      },
      async toCollect() {
        let res = await this.$Api.postFavorite({
          goods_id: this.goodsId
        })
        uni.showToast({
          title: res.msg,
          icon: 'none'
        })
        this.getData();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .nav-line {
    width: 750rpx;
    position: fixed;
    left: 0;
    top: 0;
    box-sizing: content-box;
  }

  .page-goods-detail {
    position: relative;
    background-color: #f8f8f8;
    min-height: 100vh;

    .detail-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      padding-bottom: calc(12rpx + constant(safe-area-inset-bottom));
      padding-bottom: calc(12rpx + env(safe-area-inset-bottom));
      background-color: #fff;

      .footer-wrap {
        height: 112rpx;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24rpx;

        .icon-44 {
          margin-bottom: 2rpx;
        }

        .footer-wrap-handle {
          height: 80rpx;
          //width: 80rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          position: relative;
        }

        .footer-wrap-left {
          width: 232rpx;
          font-size: 12px;
        }

        .footer-wrap-right {
          margin-left: 32rpx;
          flex: 1;

          .cu-btn {
            width: 203rpx;
            height: 88rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 30rpx;
            padding: 0 20rpx;
          }

          .btn-buy {
            background: #7644FF;
            color: #fff;
          }
        }
      }
    }

    .back-img {
      height: 52rpx;
      width: 52rpx;
      position: fixed;
      top: 88rpx;
      left: 32rpx;
      z-index: 1;
    }

    .swiper-wrap {
      margin: 0 auto;
      position: relative;
      padding-bottom: 16rpx;

      .swiper-dot-wrap {
        width: 70rpx;
        height: 42rpx;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
        position: absolute;
        right: 24rpx;
        bottom: 24rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    swiper {
      width: 100%;
      height: 895rpx;
      // margin: 30rpx auto 0;
    }

    .swiper-item {
      width: 100%;
      height: 895rpx;
      margin: 0 auto;
      display: block;
      // border-radius: 16rpx;
      overflow: hidden;
    }

    .detail-card {
      // width: 686rpx;
      width: 706rpx;
      background: #FFFFFF;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      padding: 32rpx;
      background-color: #fff;
      margin: 16rpx auto 0;
    }

    .detail-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 36rpx;
      color: #333333;
      margin-bottom: 24rpx;
    }

    .text-price {
      font-family: DIN, DIN;
      font-weight: bold;
      font-size: 44rpx;
      color: #FF2E00;
    }

    .sale-count {
      font-size: 13px;
      color: #888;
      margin-top: 12rpx;
    }

    .detail-card-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .right-arr-img {
        height: 36rpx;
        width: 36rpx;
      }
    }

    .evaluate-item {
      display: flex;
      margin-top: 48rpx;
    }

    .evaluate-item-ava {
      height: 80rpx;
      width: 80rpx;
      border-radius: 50%;
      min-width: 80rpx;
    }

    .evaluate-item-info {
      margin-left: 16rpx;
    }

    .evaluate-item-name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 28rpx;
      color: #000000;
    }

    .evaluate-item-con {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
      margin-top: 8rpx;
    }

    .detail-rich-wrap {
      min-height: 40vh;
      margin-top: 24rpx;

      img {
        width: 100% !important;
      }
    }
  }

  /* 弹出 */
  .popup {
    padding: 33rpx 30rpx 30rpx 20rpx;
  }

  .specsList {
    border-bottom: 1rpx solid #F6F6F6;
  }

  .img {
    display: flex;
    align-items: center;
    margin-bottom: 70rpx;
  }

  .popPirze {
    font-size: 42rpx;
    font-weight: 700;
    color: #f44c43;
    margin-left: 51rpx;
  }

  .popCount {
    font-size: 30rpx;
    color: #797979;
    display: block;
    margin-top: 40rpx;
  }

  .tit {
    font-size: 32rpx;
    color: #464646;
    display: block;
    margin-bottom: 21rpx;
  }

  .specsInfo {
    background: #f5f5f5;
    border-radius: 10rpx;
    padding: 10rpx 50rpx;
    display: inline-block;
    margin: 0 0 48rpx 21rpx;
  }

  .count {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 26rpx 41rpx 26rpx 21rpx;
    border-bottom: 1rpx solid #F6F6F6;
  }

  .buyNow {
    text-align: center;
    padding: 32rpx;
    margin: 25rpx 40rpx;
    background: #7644FF;
    border-radius: 44rpx;
    font-size: 28rpx;
    color: #FFFFFF;
  }

  .bottomPrize {
    display: block;
  }

  .specsInfoActive {
    background: #7644FF;
    color: #FFFFFF;
  }

  .coupon-item {
    margin-right: 12rpx;
    padding: 6rpx 8rpx;
    border: 1px solid #7644FF;
    border-radius: 4rpx;
    white-space: nowarp;
    margin-bottom: 8rpx;
    font-size: 12px;
    color: #7644FF;
  }
</style>