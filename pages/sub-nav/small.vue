<template>
	<view class="page-sub-small">
		<view class="swiper-wrap">
			<swiper :indicator-dots="true" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="item in bannerList" :key="item.id">
					<image  class="swiper-item" :src="item.thumb_image" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<scroll-view class="small-course-list bg-white" scroll-y="true" @scrolltolower="scrollLower">
			<view class="small-course-item" v-for="item in courselist" :key="item.id">
				<view class="small-course-top">
					<image :src="item.thumb_image" v-if="item.thumb_image" class="small-course-cover" mode="aspectFill"></image>
					<image src="https://jzxt.qifudaren.net/static/sub-nav/small-bg-1.png" v-else class="small-course-cover" mode=""></image>
					<!-- <view class="small-course-status">敬请期待</view> -->
					<view class="small-course-status small-course-status-living">
						<image src="https://jzxt.qifudaren.net/static/sub-nav/icon-living.png" v-if="item <= 1" class="icon-48" mode=""></image>
						{{item > 1? '敬请期待': '直播中'}}
					</view>
					<view class="small-course-name">{{item.name}}</view>
				</view>
				<view class="flex align-center justify-between small-course-bottom">
					<view class="small-course-title line-2">{{item.description}}</view>
					<view class="cu-btn course-btn">{{item > 1? '付费学习': '进入直播间'}}</view>
					<!-- <view class="cu-btn course-btn">付费学习</view> -->
				</view>
			</view>
			<!--<view class="small-course-item" v-for="item in 4">
				<view class="small-course-top">
					<image src="https://jzxt.qifudaren.net/static/temp/shop-1.png" v-if="item <= 1" class="small-course-cover" mode=""></image>
					<image src="https://jzxt.qifudaren.net/static/sub-nav/small-bg-1.png" v-else class="small-course-cover" mode=""></image>
					<view class="small-course-status small-course-status-living">
						<image src="https://jzxt.qifudaren.net/static/sub-nav/icon-living.png" v-if="item <= 1" class="icon-48" mode=""></image>
						{{item > 1? '敬请期待': '直播中'}}
					</view>
					<view class="small-course-name">{{item.name}}</view>
				</view>
				<view class="flex align-center justify-between small-course-bottom">
					<view class="small-course-title line-2">{{item.description}}</view>
					<view class="cu-btn course-btn">{{item > 1? '付费学习': '进入直播间'}}</view>
				</view>
			</view>-->
		</scroll-view>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				bannerList:[],
				courselist:[],
				total:1,
				page:1,
				pagesize:10,
			};
		},
		onLoad(e) {
			if(e && e.book) {
				uni.setNavigationBarTitle({
					title: '解读好书'
				})
			}
			this.getInfo();
			this.getList();
		},
		methods: {
			async getInfo(){
				let res = await this.$Api.getBanners({group: 'wei'})
				console.log('res', res)
				this.bannerList = res.data
			},
			async getList(){
				let res = await this.$Api.getCourseList({category_id:2,page:this.page,pagesize:this.pagesize})
				console.log('getFreeCourse', res)
				this.courselist=this.courselist.concat(res.data.data)
				this.total=res.data.total
				this.page=res.data.current_page
			},
			scrollLower(){
				if(this.courselist.length<this.total){
					this.page++;
					this.getList();
				}
				console.log('scrollLower')
			},
		}
	}
</script>

<style lang="scss">
	.page-sub-small {
		min-height: 100vh;
		background-color: #f8f8f8;
    .swiper-wrap{
      padding-top: 30rpx;
    }
		swiper {
			width: 686rpx;
			height: 240rpx;
			margin: 0 auto;
		}
		.swiper-item {
			width: 686rpx;
			height: 240rpx;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			background-color: #9136f9;
		}
		.small-course-list {
			width: 686rpx;
			margin: 32rpx auto;
			height: calc(100vh - 334rpx);
		}
		.small-course-item {
			width: 686rpx;
			height: 340rpx;
			background: #FFFFFF;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			margin-bottom: 32rpx;
		}
		.small-course-cover {
			width: 686rpx;
			height: 240rpx;
			border-radius: 16rpx;
		}
		.small-course-top {
			position: relative;
		}
		.small-course-bottom {
			padding: 16rpx 24rpx;
		}
		.small-course-title {
			flex: 1;
			margin-right: 32rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 24rpx;
			color: #333333;
		}
		.course-btn {
			width: 172rpx;
			min-width: 172rpx;
			height: 56rpx;
			background: #7644FF;
			padding: 8rpx 16rpx;
			border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 28rpx;
			color: #FFFFFF;
		}
		.small-course-status {
			width: 144rpx;
			height: 48rpx;
			background: rgba(255,255,255,0.1);
			border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
			border: 1rpx solid #eee;
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: 28rpx;
			color: #FFFFFF;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 96rpx;
			left: 50%;
			margin-left: -72rpx;
			z-index: 1;
			&-living {
				width: 172rpx;
				margin-left: -86rpx;
				height: 56rpx;
				top: 92rpx;
			}
		}
		.small-course-name {
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: 28rpx;
			color: #FFFFFF;
			position: absolute;
			bottom: 24rpx;
			left: 32rpx;
			z-index: 1;
		}
	}
</style>
