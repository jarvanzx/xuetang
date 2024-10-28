<template>
	<view class="page-famous-teacher-detail">
		<CourseTeacher :item="teacherDetail"/>
		<view class="teacher-int">{{teacherDetail.description}}</view>
		<!--<view class="teacher-int">重要会议指出，要用好政策空间、找准发力方向，扎实推动经济高质量发展。要精准有力实施宏观调控，加强逆周期调节和政策储备。要继续实施积极的财政政策和稳健的货币政策，延续、优化、完善并落实好减税降费政策，发挥总量和结构性货币政策工具作用，大力支持科技创新、实体经济和中小微企业发展。要保持人民币汇率在合理均衡水平上的基本稳定。要活跃资本市场，提振投资者信心。</view>
		<view class="teacher-int">重要会议指出，要用好政策空间、找准发力方向，扎实推动经济高质量发展。要精准有力实施宏观调控，加强逆周期调节和政策储备。要继续实施积极的财政政策和稳健的货币政策，延续、优化、完善并落实好减税降费政策，发挥总量和结构性货币政策工具作用，大力支持科技创新、实体经济和中小微企业发展。要保持人民币汇率在合理均衡水平上的基本稳定。要活跃资本市场，提振投资者信心。</view>-->
	</view>
</template>

<script>
	import CourseTeacher from "@/components/CourseTeacher.vue"
	export default {
		data() {
			return {
				teacherDetail:{},
        teacherId: ''
			};
		},
    onLoad(options) {
      this.teacherId = options.teacherId
    },
		async mounted() {
			let res = await this.$Api.getTeacherDetail({id: this.teacherId})
			console.log(res)
			this.teacherDetail=res.data
		},
		components:{
			CourseTeacher
		},
		methods:{
			
		}
	}
</script>

<style lang="scss">
	 .page-famous-teacher-detail {
		 padding: 16rpx 32rpx;
		 min-height: 100vh;
		 .course-teacher {
			 width: 686rpx;
		 }
		 .teacher-int {
			 font-family: PingFang SC, PingFang SC;
			 font-weight: 400;
			 font-size: 28rpx;
			 color: #333333;
			 margin-top: 32rpx;
		 }
	 }
</style>
