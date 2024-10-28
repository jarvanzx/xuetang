<template>
  <view class="empty">
    <image src="/static/common/empty.png" class="empty-img" mode="aspectFill"></image>
    <view class="tip">暂无数据!</view>
  </view>
</template>

<script>
  export default {
    name: "empty-hold",
    data() {
      return {

      };
    }
  }
</script>

<style lang="scss" scoped>
  .empty {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);

    .empty-img {
      width: 200rpx;
      height: 200rpx;
    }
    .tip {
      font-size: 28rpx;
      color: #999;
      text-align: center;
      margin-top: 20prx;
    }
  }
</style>