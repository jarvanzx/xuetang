<template>
  <view class="shop-courses">
    <view class="course-item bg-white" v-for="item in goodsList" :key="item.id" @click="toDetail(item)">
      <image :src="item.image" class="course-cover" mode="aspectFill"></image>
      <view class="course-item-info">
        <view class="course-title line-2">{{item.title}}</view>
        <view class="flex align-center justify-between">
          <view class="text-price text-red text-bold">{{item.price[0]}}</view>
          <view class="text-gray">已售 {{item.show_sales}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "ShopCourseItem",
    data() {
      return {
        goodlist: [],
        pagesize: 10,
        page: 1,
        classifyId: 0,
        total: 1,
      };
    },
    props: {
      goodsList: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      toDetail(item) {
        uni.navigateTo({
          url: '/pages/goodsDetail/goodsDetail?goodsId=' + item.id
        })
      }
    }
  }
</script>

<style lang="scss">
  .shop-courses {
    width: 686rpx;
    margin: 32rpx auto;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;

    .course-item {
      width: 335rpx;
      height: 568rpx;
      border-radius: 16rpx;
      overflow: hidden;
      margin-bottom: 16rpx;

      &:nth-of-type(2n) {
        margin-left: 16rpx;
      }

      .course-cover {
        width: 335rpx;
        height: 400rpx;
      }

      .course-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 28rpx;
        color: #000000;
        margin-bottom: 16rpx;
      }

      .course-item-info {
        padding: 16rpx;
      }
    }
  }
</style>