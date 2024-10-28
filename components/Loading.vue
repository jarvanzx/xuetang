<template>
  <view class="loading-box" v-if="loading">
    <image src="../static/common/loading.png" class="icon-loading" mode="aspectFill"></image>
  </view>
</template>

<script>
  export default {
    name:"cus-loading",
    data() {
      return {
        
      };
    },
    props: {
      loading: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
.loading-box{
  width: 750rpx;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  .icon-loading{
    width: 32rpx;
    height: 32rpx;
    animation: rotate 1s linear infinite;
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>