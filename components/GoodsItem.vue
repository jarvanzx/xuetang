<template>
  <view class="goods-item flex align-center relative" @click="$emit('detail')">
    <image v-if="showClose" src="/static/common/close.png" mode="aspectFill" class="icon-close" @click.stop="uncollect">
    </image>
    <image class="goods-img course-cover" :src="goods.image" mode="aspectFill"></image>
    <view class="right">
      <view class="title line-2">{{goods.title}}</view>
      <view class="price">
        <text class="price-num">￥</text>
        <text class="price-origin">{{goods.price[0]}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "GoodsItem",
    data() {
      return {

      };
    },
    props: {
      goods: {
        type: Object,
        default: () => ({})
      },
      showClose: Boolean
    },
    methods: {
      uncollect() {
        this.$emit('uncollect')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .goods-item {
    padding: 24rpx;
    background-color: #fff;
    border-radius: 16rpx;
  }

  .icon-close {
    width: 42rpx;
    height: 42rpx;
    position: absolute;
    right: 10rpx;
    top: 10rpx;
  }

  .course-cover {
    width: 160rpx;
    min-width: 160rpx;
    height: 192rpx;
    margin-right: 16rpx;
    border-radius: 12rpx;
  }

  .right {
    height: 192rpx;
    width: calc(100% - 218rpx);

    .title {
      font-weight: 500;
      font-size: 28rpx;
      color: #000000;
      word-break: break-all;
    }
    .price{
      margin-top: 10rpx;
    }
    .price-num{
      font-weight: 500;
      font-size: 24rpx;
      color: #FF2E00;
      line-height: 28rpx;
      text-align: left;
    }
    .price-origin{
      font-weight: bold;
      font-size: 36rpx;
      color: #FF2E00;
      line-height: 42rpx;
      text-align: left;
      font-style: normal;
    }
  }
</style>