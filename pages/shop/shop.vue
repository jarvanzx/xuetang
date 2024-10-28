<template>
  <!-- #ifdef APP -->
  <view class="page-shop" :style="{paddingTop: statusBarHeight + 'px'}">
  <!-- #endif -->
    <!-- #ifdef MP -->
    <view class="page-shop" :style="{paddingTop: (statusBarHeight + 42) + 'px'}">
    <!-- #endif -->

      <view class="cu-bar search" style="height: 42px;">
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input @focus="InputFocus" @change="InputBlur" :adjust-position="false" type="text" placeholder="请搜索"
            confirm-type="search"></input>
        </view>
        <view class="action">
          <!-- <i class="cuIcon-cart" @click="toCart"></i> -->
          <image src="https://jzxt.qifudaren.net/static/shop/icon-cart.png" @click="toCart" class="chat-icon"
            mode="aspectFill"></image>
          <!-- <image src="https://jzxt.qifudaren.net/static/index/chat.png" class="chat-icon"  mode=""></image> -->
        </view>
      </view>
      <scroll-view scroll-y="true" class="scrollPage" :style="{height: usefulHeight + 'px'}"
        @scrolltolower="scrollLower">
        <!-- <image src="https://jzxt.qifudaren.net/static/index/bg.png" class="index-top" mode="aspectFill"></image> -->

        <view class="swiper-wrap">
          <swiper class="iswiper" :indicator-dots="false" indicator-color="rgba(255,255,255,0.5)"
            indicator-active-color="#fff" :autoplay="true" :interval="3000" :duration="1000">
            <swiper-item v-for="item in bannerList" :key="item.thumb_image" @click="handleBanner(item)">
              <image class="swiper-item" :src="item.thumb_image" mode="aspectFill"></image>
            </swiper-item>
          </swiper>
        </view>

        <!-- 		<view class="index-audio-wrap">
			<view class="index-audio">
				<image src="https://jzxt.qifudaren.net/static/temp/shop-1.png" class="audio-img" mode=""></image>
				<view>
					<view class="audio-title">音频专区 <image src="https://jzxt.qifudaren.net/static/index/audio-status.png" class="audio-status" mode=""></image></view>
					<view class="audio-tips">每日带来新的音频智慧</view>
				</view>
				<image src="https://jzxt.qifudaren.net/static/index/audio-play.png" class="audio-paly" mode=""></image>
			</view>
		</view> -->


        <!-- 图片banner -->
        <!-- 		<view class="banner-wrap">
			<view class="banner-item">
				<image src="https://jzxt.qifudaren.net/static/index/nav-vip.png" class="banner-item-img" mode=""></image>
			</view>
			<view class="banner-item">
				<image src="https://jzxt.qifudaren.net/static/index/nav-rank.png" class="banner-item-img" mode=""></image>
			</view>
			<view class="banner-item">
				<image src="https://jzxt.qifudaren.net/static/index/nav-lottery.png" class="banner-item-img" mode=""></image>
			</view>
		</view> -->


        <view class="shop-nav">
          <swiper :autoplay="false" style="width: 100%;" :style="{height: row2 ? '324rpx' : '162rpx'}">
            <swiper-item v-for="(item, index) in gridNav" :key="index">
              <view class="nav-grid">
                <view class="nav-item" v-for="grid in item" :key="grid.name"
                  @click="toUrl('/pages/classify/classify?classifyId='+grid.id)">
                  <image :src="API_BASE_URL+grid.image" class="nav-item-img" mode="aspectFill"></image>
                  <view class="nav-item-title text-center">{{grid.name}}</view>
                </view>
              </view>
            </swiper-item>
          </swiper>
        </view>

        <view class="swiper-wrap recommend-banner" v-if="false">
          <swiper class="iswiper" :indicator-dots="true" indicator-color="rgba(255,255,255,0.5)"
            indicator-active-color="#fff" :autoplay="true" :interval="3000" :duration="1000">
            <swiper-item v-for="item in recommendbannerList" :key="item.id">
              <image class="swiper-item" :src="item.thumb_image" mode="aspectFill"></image>
            </swiper-item>
          </swiper>
        </view>
        <scroll-view scroll-x class="scroll-wrap">
          <view class="order-nav">
            <view class="order-nav-item" :class="[TabCur == 'all' ? 'cur-nav-item' : '']" @click="handleTab(0, 'all')">
              全部</view>
            <view v-for="(item,index) in navList" :key="item.name" @click="handleTab(item.id, index)"
              :class="TabCur == index?'cur-nav-item':''" class="order-nav-item">{{item.name}}</view>
          </view>
        </scroll-view>
        <ShopCourse :goods-list="goodsList" />
        <cus-loading :loading="loading"></cus-loading>
        <view class="space-hold"></view>
        <!-- 		<view class="shop-courses ">
			<view class="course-item bg-white" v-for="item in 10">
				<image src="https://jzxt.qifudaren.net/static/temp/shop-1.png" class="course-cover" mode=""></image>
				<view class="course-item-info">
					<view class="course-title line-2">翟先生翟先生讲程朱理学翟先生讲程朱理学翟先生讲程朱理学翟先生讲程朱理学翟先生讲程朱理学讲程朱理学</view>
					<view class="flex align-center justify-between">
						<view class="text-price text-red text-bold">199.00</view>
						<view class="text-gray">已售 999</view>
					</view>
				</view>
			</view>
		</view> -->
      </scroll-view>
      <tab-bar :selected="3"></tab-bar>
    </view>
</template>

<script>
  import TabBar from "@/components/tabbar.vue"
  import ShopCourse from '@/components/ShopCourseItem.vue'
  import {
    API_BASE_URL
  } from "@/config/env"
  export default {
    data() {
      return {
        bannerList: [],
        recommendbannerList: [],
        title: 'Hello',
        numIndex: 1,
        TabCur: "all",
        classifyId: 0,
        navList: [],
        gridNav: [],
        API_BASE_URL,
        statusBarHeight: 0,
        usefulHeight: 0,
        row2: false,
        goodsList: [],
        page: 1,
        pagesize: 10,
        loading: false
      }
    },

    components: {
      ShopCourse,
      TabBar
    },
    onLoad() {
      const {
        statusBarHeight,
        safeArea
      } = uni.getWindowInfo()
      console.log(safeArea);
      this.statusBarHeight = statusBarHeight
      // #ifdef APP
      this.usefulHeight = safeArea.height - 42
      // #endif
      // #ifdef MP
      this.usefulHeight = safeArea.height - 42 - 42
      // #endif
      this.getBanners()
      this.getnavData()
      this.getTabNav()
      // this.getRecommendInfo()
    },
    onReady() {

    },
    onShow() {
      // #ifndef MP
      uni.hideTabBar()
      // #endif
    },
    onShareAppMessage() {
      return {
        title: '总有一款适合你',
        path: '/pages/shop/shop'
      }
    },
    onShareTimeline() {
      return {
        title: '总有一款适合你',
        path: '/pages/shop/shop'
      }
    },
    methods: {
      handleBanner(banner) {
        const {
          resource_id,
          jump_type
        } = banner
        switch (jump_type) {
          case 1:
            uni.navigateTo({
              url: `/pages/audioDetail/audioDetail?course_id=${resource_id}`
            })
            break;
          case 2:
            uni.navigateTo({
              url: `/pages/courseDetail/courseDetail?course_id=${resource_id}`
            })
            break;
          case 3:
            uni.navigateTo({
              url: `/pages/user/coupon`
            })
            break;
          case 4:
            uni.navigateTo({
              url: '/pages/goodsDetail/goodsDetail?goodsId=' + resource_id
            })
            break;
          default:
            break;
        }
      },
      async scrollLower() {
        if (this.total > this.goodsList.length) {
          this.loading = true
          this.page++
          await this.getGoods()
          this.loading = false
        }
      },
      updateInfo(id) {
        this.classifyId = id
        this.page = 1
        this.goodsList = []
        this.getGoods()
      },
      async getGoods() {
        let res = await this.$Api.getShopGoodList({
          category_id: this.classifyId,
          list_rows: this.pagesize,
          page: this.page
        })
        console.log('res', res)
        this.goodsList = this.goodsList.concat(res.data.data)
        this.total = res.data.total
      },
      handleTab(id, index) {
        this.TabCur = index
        this.classifyId = id
        this.goodsList = []
        this.page = 1
        this.getGoods()
      },
      async getBanners() {
        let res = await this.$Api.getBanners({
          group: 'shop_index'
        })
        console.log('res', res)
        this.bannerList = res.data
      },
      async getRecommendInfo() {
        let res = await this.$Api.getBanners({
          group: 'shop_home_recommend'
        })
        console.log('res', res)
        this.recommendbannerList = res.data
      },
      async getTabNav() {
        let res = await this.$Api.getShopCategory({
          level: 1,
          id: 3,
          is_show_below: 1
        })
        if (res.data.children) {
          this.navList = res.data.children
        }
      },
      async getnavData() {
        let res = await this.$Api.getShopCategory({
          level: 1,
          id: 3,
          is_show_below: 0
        })
        console.log('res', res)
        const {
          children,
          parent_id
        } = res.data
        if (children?.length > 0) {
          const list = []
          const page = Math.ceil(children.length / 10)
          for (let i = 0; i < page; i++) {
            list.push(children.slice(i * 10, (i + 1) * 10))
          }
          this.gridNav = list;
          if (children.length > 5) {
            this.row2 = true
          }
          this.classifyId = parent_id
          this.getGoods()
        }

      },
      changeIndex(i) {
        this.numIndex = i
      },
      toCart() {
        uni.navigateTo({
          url: '/pages/cart/cart'
        })
      },
      toUrl(url) {
        uni.navigateTo({
          url
        })
      }
    }
  }
</script>

<style lang="scss">
  page {
    background: #ECEEFF;
  }

  .scrollPage {
    // height: calc(100vh - 240rpx)
    // padding-bottom: 60px;
  }

  .space-hold {
    width: 100%;
    height: 60px;
  }

  .page-shop {
    background-image: url('https://jzxt.qifudaren.net/static/index/bg.png');
    background-position: top;
    background-repeat: no-repeat;
    min-height: 100vh;
    overflow: hidden;

    .swiper-wrap {
      margin: 0 auto;
    }

    .search-form {
      background: rgba(255, 255, 255, 0.6) !important;
    }

    .iswiper {
      width: 686rpx;
      height: 332rpx;
      margin: 30rpx auto 0;
    }

    .swiper-item {
      width: 686rpx;
      height: 332rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      background-color: #9136f9;
    }

    .recommend-banner {
      swiper {
        height: 240rpx;
      }

      .swiper-item {
        height: 240rpx;
      }
    }

    .shop-nav {
      width: 686rpx;
      // height: 332rpx;
      background: rgba(255, 255, 255, 0.88);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      padding: 24rpx;
      box-sizing: border-box;
      margin: 32rpx auto;

      .nav-grid {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: auto;
        gap: 24rpx;

        .nav-item {
          width: 100%;
          height: 142rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          box-sizing: border-box;

          .nav-item-img {
            width: 64rpx;
            height: 64rpx;
            background: #7644FF;
            border-radius: 50%;
            display: flex;
            flex-shrink: 0;
          }

          .nav-item-title {
            margin-top: 12rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 24rpx;
            color: #000000;
            line-height: 28rpx;
            text-align: center;
            font-style: normal;
          }
        }
      }
    }

    // .nav-item {
    //   &:nth-child(-n+5) {
    //     margin-bottom: 32rpx;
    //   }
    // }

    .nav-item-img {
      background-color: #7644FF;
    }

    .cuIcon-cart {
      font-size: 48rpx;
      color: #fff;
    }

    .scroll-wrap {
      padding: 0 32rpx;
    }

    .order-nav {
      margin: 0 auto 0;
      flex-wrap: nowrap;
    }

    .order-nav-item {
      min-width: 128rpx;
      margin-right: 32rpx;
      white-space: nowrap;

      &.cur-nav-item {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 32rpx;
        color: #7644FF;
      }
    }
  }

  .index-top {
    width: 100%;
    height: 368rpx;
    position: absolute;
    top: 0;
  }

  .chat-icon {
    height: 52rpx;
    width: 52rpx;
    color: #fff;
  }
</style>