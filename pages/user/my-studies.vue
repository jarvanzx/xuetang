<template>
  <view class="page-my-studies">
    <view class="study-list">
      <view class="study-item" @click="toDetail(item.course_id)"
        :style="{'backgroundImage': `url(https://jzxt.qifudaren.net/static/temp/shop-1.png)`}" v-for="item in list"
        :key="item.id">
        <view class="study-item-cover">
          <image :src="item.course.thumb_image" mode="aspectFill"></image>
        </view>
        <view class="study-item-info flex-sub">
          <view class="study-item-title">{{item.course.name}}</view>
          <view class="study-item-desc line-2">
            {{item.course.description}}</view>
          <view class="study-item-btn">继续学习</view>
        </view>
        <view class="frosted__glass"></view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        page: 1,
        pagesize: 20,
        pageMax: false
      };
    },
    onLoad() {
      this.getMyStudies()
    },
    onReachBottom() {
      if (!this.pageMax) {
        this.getMyStudies()
      }
    },
    methods: {
      async getMyStudies() {
        try {
          const {
            data,
            total
          } = await this.$Api.getMyStudy({
            page: this.page,
            pagesize: this.pagesize
          })
          if (Array.isArray(data?.data) && data.data.length > 0) {
            this.list = this.list.concat(data.data)
            this.pageMax = this.list.length >= total
            this.page++
          }
        } catch (e) {
          //TODO handle the exception
          console.error(e)
        }
      },
      toDetail(id) {
        uni.navigateTo({
          url: '/pages/courseDetail/courseDetail?course_id=' + id
        })
      }
    }
  }
</script>

<style lang="scss">
  .page-my-studies {
    min-height: 100vh;
    background-color: #f8f8f8;
    padding: 16rpx 32rpx;
    overflow: hidden;

    .study-item {
      width: 686rpx;
      height: 252rpx;
      border-radius: 16rpx;
      margin: 0 auto 32rpx;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 32rpx;
      background-color: #fff;
      display: flex;
      position: relative;
      overflow: hidden;
    }

    .study-item-cover {
      height: 192rpx;
      width: 160rpx;
      min-width: 160rpx;
      margin-right: 16rpx;
      position: relative;
      z-index: 1;

      image {
        height: 100%;
        width: 100%;
      }
    }

    .study-item-info {
      position: relative;
      z-index: 1;
    }

    .study-item-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #FFFFFF;
    }

    .study-item-desc {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #FFFFFF;
      margin-top: 8rpx;
    }

    .study-item-btn {
      width: 172rpx;
      height: 56rpx;
      background: #7644FF;
      border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 12rpx;
    }

    .frosted__glass {
      width: 100%;
      height: 100%;
      border-radius: 16rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(80px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
  }
</style>