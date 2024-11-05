<template>
	<view class="page-sub-free safe-area">

		<view class="swiper-wrap">
			<swiper :indicator-dots="true" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff"
				:autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="item in bannerList" :key="item.id">
					<image class="swiper-item" :src="item.thumb_image" mode="aspectFill" @click="handleJump(item)">
					</image>
				</swiper-item>
			</swiper>
		</view>
		<scroll-view class="free-list bg-white" scroll-y="true" @scrolltolower="scrollLower">

			<!-- <view class="free-course-item" v-for="item in courselist" :key="item.id" @click="toCourseDetail(item)">
        <image :src="item.thumb_image" class="free-course-cover" mode="aspectFill"></image>
        <view class="flex-sub">
          <view class="free-course-title line-1">{{item.name}}</view>
          <view class="free-course-des descript">{{item.description}}</view>
          <view class="flex margin-top-sm align-center">
            <image :src="item.teacher.thumb_image" class="icon-32 icon-course-teacher" mode="aspectFill"></image>
            <view>{{item.teacher.name}}</view>
          </view>
          <view class="text-gray margin-top-sm flex align-center">
            <i class="cuIcon-friend margin-right-sm"></i>
            {{item.play_count}}人学过
          </view>
        </view>
      </view> -->
			<CourseItem v-for="item in courselist" :teacher="item.teacher" :item="item" :key="item.id"
				:show-line="true">
			</CourseItem>
		</scroll-view>
	</view>
</template>

<script>
	import CourseItem from '../../components/CourseItem.vue';
	export default {
		data() {
			return {
				bannerList: [],
				courselist: [],
				total: 1,
				page: 1,
				pagesize: 10,
			};
		},
		components: {
			CourseItem
		},
		onLoad() {
			this.getList();
			this.getInfo();
		},
		methods: {
			handleJump(info) {
				const {
					jump_type,
					resource_id
				} = info
				switch (jump_type) {
					case 1:
						uni.navigateTo({
							url: '/pages/audioDetail/audioDetail?course_id=' + resource_id
						})
						break;
					case 2:
						uni.navigateTo({
							url: '/pages/courseDetail/courseDetail?course_id=' + resource_id
						})
						break;
					case 3:
						uni.navigateTo({
							url: '/pages/user/coupon',
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
			async getInfo() {
				let res = await this.$Api.getBanners({
					group: 'free'
				})
				console.log('res', res)
				this.bannerList = res.data
			},
			async getList() {
				let res = await this.$Api.getCourseList({
					category_id: 1,
					page: this.page,
					pagesize: this.pagesize,
					type: 1
				})
				console.log('getFreeCourse', res)
				this.courselist = this.courselist.concat(res.data.data)
				this.total = res.data.total
				this.page = res.data.current_page
			},
			scrollLower() {
				if (this.courselist.length < this.total) {
					this.page++;
					this.getList();
				}
				console.log('scrollLower')
			},
			toCourseDetail(item) {
				uni.navigateTo({
					url: '/pages/courseDetail/courseDetail?course_id=' + item.id
				})
			}
		}
	}
</script>

<style lang="scss">
	.page-sub-free {
		min-height: 100vh;
		background-color: #f8f8f8;

		swiper {
			width: 686rpx;
			height: 240rpx;
			margin: 30rpx auto 0;
		}

		.swiper-item {
			width: 686rpx;
			height: 240rpx;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			background-color: #9136f9;
		}

		.free-list {
			width: 686rpx;
			height: calc(100vh - 240rpx);
			padding: 0 24rpx;
			background: #FDFDFF;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			margin: 32rpx auto 0;
		}

		.free-course-item {
			width: 100%;
			display: flex;
			padding-bottom: 24rpx;
			border-bottom: 1rpx solid #eee;
			padding-top: 24rpx;

			&:last-child {
				border: none;
			}

			.flex-sub {
				width: calc(100% - 176rpx);
			}

			.descript {
				flex: 1;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				// display: -webkit-box;
				// -webkit-line-clamp: 2;
				// /* 显示的行数 */
				// -webkit-box-orient: vertical;
				// overflow: hidden;
				// text-overflow: ellipsis;
			}
		}

		.free-course-cover {
			width: 160rpx;
			height: 192rpx;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			min-width: 160rpx;
			margin-right: 16rpx;
		}

		.free-course-title {
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: 28rpx;
			color: #000000;
		}

		.free-course-des {
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 24rpx;
			color: #999999;
		}

		.icon-course-teacher {
			margin-right: 16rpx;
			border-radius: 16rpx;
		}
	}
</style>