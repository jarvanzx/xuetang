<template>
	<view>
		<view class="VerticalBox">
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop"
				style="height:calc(100vh )">
				<view class="cu-item" :class="index == tabCur ? 'text-green cur' : ''" v-for="(item, index) in list"
					:key="index" @tap="TabSelect" :data-id="index">
					{{ item.name }}
				</view>
			</scroll-view>
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh )"
				:scroll-into-view="'main-' + mainCur" @scroll="VerticalMain">
				<view class="total-book">
					共 <span>{{total}}</span> 本，本月新增 <span>{{month_total}}</span>本
				</view>
				<view class="course-book-item" type="hao" v-for="(item, index) in booklist" :key="index"
					:id="'main-' + index">
					<CourseItem type="hao" :item="item" :isBook="true" @detail="onDetail(item)"></CourseItem>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		IMG_BASE_URL
	} from '../../config/env';
	import CourseItem from '@/components/CourseItem.vue';
	export default {
		data() {
			return {
				list: [],
				tabCur: 0,
				mainCur: 0,
				verticalNavTop: 0,
				load: true,
				booklist: [],
				total: 0,
				month_total: 0
			};
		},
		components: {
			CourseItem
		},
		onLoad() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			let list = [{}];
			for (let i = 0; i < 26; i++) {
				list[i] = {};
				list[i].name = String.fromCharCode(65 + i);
				list[i].id = i;
			}
			this.list = list;
			this.listCur = list[0];
			this.getData();
			this.getBookCount()
		},
		onReady() {
			uni.hideLoading()
		},
		methods: {
			onDetail(course) {
				const {
					type,
					id,
					course_file
				} = course
				const str = encodeURIComponent(JSON.stringify(course))

				console.log(type + '-------' + id)


				if (course_file.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '暂无章节！'
					})
					return false;
				}

				if (type === 1) {
					uni.navigateTo({
						// chapter_id
						url: `/pages/courseDetail/courseDetail?course_id=${id}&chapter=${str}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/audioDetail/audioDetail?chapter_id=${id}&chapter=${str}`
					})
				}
			},
			async getData() {
				let res = await this.$Api.getArticleCategoryList({});
				this.list = res.data;
				this.listCur = this.list[0];
				this.getbookList(this.listCur.id)
			},
			async getbookList(id) {
				let res = await this.$Api.getCourseList({
					book_type: id,
					category_id: 6
				})
				this.booklist = res.data.data;
			},
			async getBookCount() {
				this.$Api.getBookCount({}).then(res => {
					const {
						total,
						month_total
					} = res.data
					this.total = total
					this.month_total = month_total
				})
			},
			TabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.mainCur = e.currentTarget.dataset.id;
				this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50
				this.listCur = this.list[this.tabCur];
				this.getbookList(this.listCur.id)
			},
			VerticalMain(e) {
				// #ifdef MP-ALIPAY
				return false //支付宝小程序暂时不支持双向联动 
				// #endif
				let that = this;
				let tabHeight = 0;
				if (this.load) {
					for (let i = 0; i < this.list.length; i++) {
						let view = uni.createSelectorQuery().select("#main-" + this.list[i].id);
						view.fields({
							size: true
						}, data => {
							this.list[i].top = tabHeight;
							tabHeight = tabHeight + data.height;
							this.list[i].bottom = tabHeight;
						}).exec();
					}
					this.load = false
				}
				let scrollTop = e.detail.scrollTop + 10;
				for (let i = 0; i < this.list.length; i++) {
					if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
						this.verticalNavTop = (this.list[i].id - 1) * 50
						this.tabCur = this.list[i].id
						console.log(scrollTop)
						return false
					}
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.fixed {
		position: fixed;
		z-index: 99;
	}

	.total-book {
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		font-size: 28rpx;
		color: #000000;
		margin: 24rpx;

		span {
			color: #7644FF;
		}
	}

	.course-book-item {
		padding: 0 24rpx;
	}

	.VerticalNav.nav {
		width: 200upx;
		white-space: initial;
	}

	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		background-color: #F8F8F8;
		margin: 0;
		border: none;
		height: 106rpx;
		line-height: 106rpx;
		position: relative;
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		font-size: 30rpx;
		color: #666666;
	}

	.VerticalNav.nav .cu-item.cur {
		background-color: #fff;
		font-family: PingFang SC, PingFang SC;
		font-weight: 600;
		font-size: 30rpx;
		color: #7644FF;
		height: 106rpx;
		line-height: 106rpx;
	}

	.VerticalNav.nav .cu-item.cur::after {
		/* content: "";
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto; */
	}

	.VerticalBox {
		display: flex;
	}

	.VerticalMain {
		background-color: #f1f1f1;
		flex: 1;
		width: 550rpx;
	}
</style>