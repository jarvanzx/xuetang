<template>
  <view class="page-content" :style="{paddingTop: (statusBarHeight + 42) + 'px'}">
    <view class="cu-bar search" style="height: 42px;">
      <image src="https://jzxt.qifudaren.net/static/common/back.png" class="icon-48 margin-left-sm" @click="toBack"
        mode=""></image>
      <view class="search-form round">
        <text class="cuIcon-search"></text>
        <input v-model="keyword" :adjust-position="false" type="text" placeholder="请搜索" confirm-type="search"></input>
      </view>
      <view class="action">
        <image src="https://jzxt.qifudaren.net/static/shop/icon-cart.png" @click="toCart" class="chat-icon" mode="">
        </image>
      </view>
    </view>
    <scroll-view scroll-y class="scrollPage" :style="{height: scrollHeight + 'px'}" @scrolltolower="scrollLower">
      <view class="page-index safe-area">
        <view class="swiper-wrap">
          <swiper :indicator-dots="false" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff"
            :autoplay="true" :interval="3000" :duration="1000">
            <swiper-item v-for="item in bannerList" :key="item.thumb_image">
              <image class="swiper-item" :src="item.thumb_image" mode="aspectFill"></image>
            </swiper-item>
          </swiper>
        </view>
        <ShopCourse :goods-list="goodsList" />
        <cus-loading :loading="loading"></cus-loading>
      </view>
    </scroll-view>
  </view>

</template>

<script>
  import ShopCourse from '@/components/ShopCourseItem.vue'
  export default {
    data() {
      return {
        bannerList: [],
        title: 'Hello',
        numIndex: 1,
        classifyId: '',
        statusBarHeight: 0,
        scrollHeight: 0,
        page: 1,
        pagesize: 10,
        goodsList: [],
        loading: false,
        keyword: ''
      }
    },
    components: {
      ShopCourse
    },
    onLoad(query) {
      if (query.classifyId) {
        this.classifyId = query.classifyId
      }

      const {
        statusBarHeight,
        screenHeight
      } = uni.getWindowInfo()
      this.statusBarHeight = statusBarHeight
      this.scrollHeight = screenHeight - statusBarHeight - 84
      this.getInfo()
      this.getGoods()
    },
    methods: {
      async scrollLower() {
        if (this.total > this.goodsList.length) {
          this.loading = true
          this.page++
          await this.getGoods()
          this.loading = false
        }
      },
      async getInfo() {
        let res = await this.$Api.getBanners({
          group: 'shop_goods_recommend'
        })
        console.log('res', res)
        this.bannerList = res.data
      },
      async getGoods() {
        let res = await this.$Api.getShopGoodList({
          category_id: this.classifyId,
          list_rows: this.pagesize,
          page: this.page,
          keyword: this.keyword
        })
        console.log('res', res)
        this.goodsList = this.goodsList.concat(res.data.data)
        this.total = res.data.total
      },
      changeIndex(i) {
        this.numIndex = i
      },
      toAudioDetail() {
        uni.navigateTo({
          url: '/pages/audioDetail/audioDetail'
        })
      },
      toUrl(url) {
        if (!url) return;
        uni.navigateTo({
          url: url
        })
      },
      toBack() {
        uni.navigateBack()
      },
      toCart() {
        uni.navigateTo({
          url: '/pages/cart/cart'
        })
      }
    }
  }
</script>

<style lang="scss">
  page {
    background: #ECEEFF;
  }

  .page-content {
    width: 750rpx;
    background-image: url('https://jzxt.qifudaren.net/static/index/bg.png');
    background-position: top;
    background-repeat: no-repeat;
    height: 100vh;
    overflow: hidden;
  }

  .scrollPage {
    width: 100%;
  }

  .page-index {
    background: #ECEEFF;
    min-height: 100vh;
    overflow: hidden;

    .swiper-wrap {
      margin: 0 auto;
    }

    .search-form {
      background: rgba(255, 255, 255, 0.6) !important;
    }

    swiper {
      width: 686rpx;
      height: 332rpx;
      margin: 30rpx auto 0;
    }

    .swiper-item {
      width: 686rpx;
      height: 332rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      background-color: red;
    }
  }

  .index-top {
    width: 100%;
    height: 368rpx;
    // background: linear-gradient( 131deg, #6646FF 0%, #9D3BFF 100%);
    // background-image: url('https://jzxt.qifudaren.net/static/index/bg.png');
    // background-size: 100% 100%;
    // border-bottom-left-radius: 48rpx;
    // border-bottom-right-radius: 48rpx;
    position: absolute;
    top: 0;
  }

  .chat-icon {
    height: 52rpx;
    width: 52rpx;
    color: #fff;
  }

  .index-audio-wrap {
    height: 190rpx;
    margin: 24rpx auto;
    overflow: hidden;
  }

  .index-audio {
    width: 686rpx;
    height: 158rpx;
    background: #FFFFFF;
    box-shadow: 0rpx 8rpx 8rpx 0rpx rgba(0, 0, 0, 0.06);
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    border: 2rpx solid rgba(105, 70, 255, 1);
    /* border-image: linear-gradient(90deg, rgba(105, 70, 255, 1), rgba(156, 60, 255, 1)) 2 2; */
    padding: 32rpx;
    padding-left: 168rpx;
    margin: 32rpx auto 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .audio-img {
      width: 120rpx;
      height: 160rpx;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      position: absolute;
      left: 32rpx;
      bottom: 32rpx;
    }

    .audio-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 36rpx;
      color: #000000;
      display: flex;
      align-items: center;
    }

    .audio-tips {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;
      margin-top: 4rpx;
    }

    .audio-paly {
      width: 65rpx;
      height: 65rpx;
      border-radius: 50%;
    }

    .audio-status {
      height: 32rpx;
      width: 32rpx;
      margin-left: 20rpx;
    }
  }

  .banner-wrap {
    display: flex;
    align-items: center;
    width: 686rpx;
    justify-content: space-between;
    margin: 32rpx auto 0;

    .banner-item {
      width: 226rpx;
      height: 122rpx;
    }

    .banner-item-img {
      width: 226rpx;
      height: 122rpx;
    }
  }

  .index-courses {
    width: 686rpx;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    margin: 32rpx auto;
    padding: 24rpx;
    overflow: hidden;

    .course-teacher {
      width: 641rpx;
      height: 220rpx;
      background: rgba(117, 68, 255, 0.13);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      display: flex;
      align-items: center;
      padding-left: 16rpx;
      padding-right: 24rpx;
      padding-bottom: 16rpx;
      padding-top: 22rpx;
    }

    .teacher-tag {
      width: 204rpx;
      height: 40rpx;
      background: linear-gradient(133deg, #D791FF 0%, #6E39FF 100%);
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 20rpx;
      color: #FFFFFF;
      text-align: center;
      line-height: 40rpx;
      margin-right: 8rpx;
    }

    .course-img-wrap {
      width: 186rpx;
      min-width: 186rpx;
      height: 172rpx;
      margin-right: 16rpx;
      position: relative;

      .course-teacher-img {
        height: 138rpx;
        width: 138rpx;
        margin: 0 auto;
        display: block;
      }

      .course-teacher-name {
        width: 180rpx;
        height: 54rpx;
        background: #fff;
        border-radius: 6rpx 6rpx 6rpx 6rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 32rpx;
        color: #8840FF;
        text-align: center;
        line-height: 54rpx;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }

    .teacher-des {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #8840FF;
      margin-top: 20rpx;
    }

    .course-nums-wrap {
      margin-top: 48rpx;
      height: 58rpx;
    }

    .course-nums {
      display: flex;
      height: 58rpx;
    }

    .course-nums-item {
      min-width: 160rpx;
      height: 58rpx;
      background: #ECEEFF;
      border-radius: 58rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #000000;
      text-align: center;
      line-height: 58rpx;
      padding: 0 24rpx;
      margin-right: 24rpx;

      &-active {
        background-color: #7644FF;
        color: #fff;
      }
    }

    .course-item {
      display: flex;
      align-items: center;
      padding: 24rpx 0;

      .course-cover {
        width: 160rpx;
        min-width: 160rpx;
        height: 192rpx;
        margin-right: 16rpx;
      }

      .teacher-ava {
        height: 32rpx;
        width: 32rpx;
        border-radius: 50%;
        margin-right: 8rpx;
      }

      .course-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 28rpx;
        color: #000000;
      }

      .course-des {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        margin-top: 4rpx;
      }

      .course-teacher-wrap {
        margin-top: 12rpx;
      }

      .study-icon {
        height: 24rpx;
        width: 24rpx;
        margin-right: 8rpx;
      }

      .course-info-wrap {
        margin-top: 28rpx;
      }

      .course-tag {
        height: 32rpx;
        width: 128rpx;
        margin-left: 8rpx;
      }

      .study-des {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 20rpx;
        color: #999999;
      }
    }
  }
</style>