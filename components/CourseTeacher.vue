<template>
	<view class="course-teacher" >
		<view class="course-img-wrap">
			<image :src="item.thumb_image" class="course-teacher-img" mode="aspectFill"></image>
			<view class="course-teacher-name">{{item.name}}</view>
		</view>
		<view>
			<view class="flex align-center">
				<view class="teacher-tag" v-for="tag in tags" :key="tag">{{tag}}</view>
			</view>
			<view class="teacher-des">{{item.description}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"CourseTeacher",
		data() {
			return {
				
			};
		},
		computed:{
			tags(){
				return this.item.tags?.split(',')
			}
		},
		props:{
			item: Object,
      default:()=>({})
		},
		methods: {
			
		},
		mounted() {
			console.log(this.item)
		},
	}
</script>

<style lang="scss">
	.course-teacher {
			width: 641rpx;
			height: 220rpx;
			background: rgba(117,68,255,0.13);
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			display: flex;
			align-items: start;
			padding-left: 16rpx;
			padding-right: 24rpx;
			padding-bottom: 16rpx;
			padding-top: 22rpx;
		}
		.teacher-tag {
			width: 204rpx;
			height: 40rpx;
			background: linear-gradient( 133deg, #D791FF 0%, #6E39FF 100%);
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
			overflow: auto;
			height: 110rpx;
			// overflow: hidden; /*文本超出隐藏*/
			// 	display:-webkit-box; /*盒子模型微弹性伸缩模型*/
			// 	-webkit-box-orient: vertical;/*伸缩盒子的子元素垂直排列*/
			// 	-webkit-line-clamp: 3; /*文本显示3行*/
		}
</style>