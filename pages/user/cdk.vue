<template>
	<view class="page-user-cdk">
		<view class="cdk-temp">
			<image src="https://jzxt.qifudaren.net/static/user/cdk-text.png" class="cdk-text-img" mode=""></image>
			<view class="cdk-temp-con">
				<span>XXXXX</span>
				<span>XXXXX</span>
				<span>XXXXX</span>
				<span>XXXXX</span>
				<span>XXXXX</span>
			</view>
		</view>
		<view class="cdk-form bg-white">
			<view class="cdk-form-title">激活码</view>
			<input type="text" v-model="code" placeholder="请输入激活码" class="cdk-from-input" />
		</view>
		<view class="cdk-btn cu-btn round block" @click="toRedeem">立即激活</view>
		<view class="cdk-des" v-if="false">
			<view>激活码说明</view>
			<view class="margin-top">
				Meme股、科技股、比特币——所有这些都在今年大幅上涨，引起了看空者的注意，他们在当今市场的许多角落看到了泡沫的迹象。与此同时，看多者坚持认为这是夸大其词，认为预测泡沫迹象还为时过早。</view>
			<view class="margin-top">
				Meme股、科技股、比特币——所有这些都在今年大幅上涨，引起了看空者的注意，他们在当今市场的许多角落看到了泡沫的迹象。与此同时，看多者坚持认为这是夸大其词，认为预测泡沫迹象还为时过早。</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: '',
			};
		},
		methods: {
			async toRedeem() {
				const {
					data
				} = await this.$Api.getCourseByCode({
					course_code: this.code
				})
				// if (data.length == 0) {
				// 	uni.showToast({
				// 		title: '该兑换码无效',
				// 	})
				// 	return
				// }
				
				this.redeemCourse(data.code,data.id);

				// uni.navigateTo({
				//   url: '/pages/user/redeem-course?code=' + this.code
				// })
			},

			async redeemCourse(ma,id) {
				const {
					code,
					msg
				} = await this.$Api.postCodeToCourse({
					course_code: ma,
					course_code_id: id
				})
				if (code == 1) {
					uni.showToast({
						title: '兑换成功',
						icon: 'success'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} else {
					uni.showToast({
						title: msg,
						icon: 'none'
					})
				}

			}
		}
	}
</script>

<style lang="scss">
	.page-user-cdk {
		background-color: #f8f8f8;
		min-height: 100vh;
		padding: 16rpx 32rpx;

		.cdk-des {
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 26rpx;
			color: #999999;
			margin-top: 48rpx;
		}

		.cdk-btn {
			width: 702rpx;
			height: 88rpx;
			background: #7644FF;
			border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
			margin: 48rpx auto 0;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 32rpx;
			color: #FFFFFF;
		}

		.cdk-form {
			border-radius: 16rpx;
			padding: 32rpx;
			margin: 48rpx auto 0;

			.cdk-form-title {
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;
				font-size: 32rpx;
				color: #000000;
			}

			.cdk-from-input {
				width: 622rpx;
				height: 108rpx;
				background: #F8F8F8;
				border-radius: 16rpx;
				margin-top: 16rpx;
				padding: 32rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 32rpx;
				color: #999999;
				;
			}
		}

		.cdk-temp {
			width: 686rpx;
			background: linear-gradient(131deg, #6646FF 0%, #9D3BFF 100%);
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			padding: 32rpx;
			box-sizing: border-box;
			margin: 0 auto;

			.cdk-text-img {
				width: 140rpx;
				height: 38rpx;
			}

			.cdk-temp-con {
				width: 622rpx;
				height: 50rpx;
				background: rgba(255, 255, 255, 0.2);
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				margin: 24rpx auto 0;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 56rpx;
			}
		}
	}
</style>