<template>
	<view class="page-my-studies">
		<view class="study-list">
			<view class="study-item" v-for="item in 10">
				<view class="study-item-cover">
					<image src="https://jzxt.qifudaren.net/static/temp/shop-1.png" mode=""></image>
				</view>
				<view class="study-item-info flex-sub">
					<view class="study-item-title">翟先生讲程朱理学</view>
					<view class="study-item-desc line-2">程朱理学，亦称为“程朱道学”，是宋明理学的主要派别之一，也是理学各派中也是理学各派中也是理学各派中也是理学各派中也是理学各派中也是理学各派中也是理学各派中也是理学各派中也是理学各派中</view>
					<view class="study-item-btn">继续学习</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
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
			background-image: url('https://jzxt.qifudaren.net/static/temp/shop-1.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;
			// backdrop-filter: blur(80px);
			filter: blur(8px);
			padding: 32rpx;
			background-color: #fff;
			display: flex;
		}
		.study-item-cover {
			height: 192rpx;
			width: 160rpx;
			min-width: 160rpx;
			margin-right: 16rpx;
			image {
				height: 100%;
				width: 100%;
			}
		}
		.study-item-info {
			
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
	}
</style>
