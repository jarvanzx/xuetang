<template>
	<view class="page-course-detail">
		<view class="page-main-content">
			<!-- #ifdef MP -->
			<view class="page-custom-top-nav stikied" :style="{paddingTop: (statusBarHeight + 42) + 'px'}">
			<!-- #endif -->
				<!-- #ifdef APP -->
				<view class="page-custom-top-nav stikied" :style="{paddingTop: statusBarHeight + 'px'}">
				<!-- #endif -->
					<image src="https://jzxt.qifudaren.net/static/common/back-black.png" class="back-img" mode=""
						@click="back">
					</image>
					<view class="vip-nav">
						<view class="vip-nav-item " :class="{'vip-nav-item-active': tabNav === 'goods'}"
							@click="changeNav('goods')">商品
						</view>
						<view class="vip-nav-item" :class="{'vip-nav-item-active': tabNav === 'detail'}"
							@click="changeNav('detail')">详情
						</view>
						<view class="vip-nav-item" :class="{'vip-nav-item-active': tabNav === 'comment'}"
							@click="changeNav('comment')">评论
						</view>
					</view>
					<button open-type="share" class="share-btn flex justify-center align-center">
						<image src="https://jzxt.qifudaren.net/static/course/icon-share-black.png" class="icon-52"
							mode="aspectFill">
						</image>
					</button>
				</view>

				<scroll-view :style="{width: '100%', height: `calc(${safeHeight}px - 84px)`}" scroll-y
					:scroll-into-view="tabNav" scroll-with-animation>
					<view class="course-cover-wrap" id="goods">
						<view class="change-to-audio-wrap flex align-center justify-center" @click="change2Audio">
							<image src="https://jzxt.qifudaren.net/static/course/audio-change.png" class="icon-32">
							</image>
							<view>切换到音频</view>
						</view>
						<video :src="chapters[currCourseIndex]['file']" class="course-video-wrap"
							:poster="chapters[currCourseIndex]['poster_image']" :direction="-90" controls
							object-fit="contain" @timeupdate="onTimeUpdate" @ended="onEnded"
							@fullscreenchange="playerFullScreen" id="videoRef"></video>
						<cover-view @click="showSpeed=true"
							style="position: absolute;right: 10px; top: 50%;widht:48rpx;text-align:center;transform: translate(-50%,-50%);"
							v-if="isDefinitionBtnShow">
							<cover-image src="https://jzxt.qifudaren.net/static/audio/icon-speed-1.png" class="icon-48"
								mode="">
							</cover-image>
							<cover-text style="text-align: center;font-size: 20rpx;">{{number}}X</cover-text>
						</cover-view>
					</view>
					<view class="bg-white course-detial-info">
						<view class="course-detail-title">{{detailData.name}}</view>
						<view class="coruse-detail-tags flex align-center">
							<view class="course-detail-tag-item" v-for="item in detailData.tags_text" :key="item">
								{{item}}
							</view>
						</view>
						<view class="text-gray line-2 margin-top-sm">{{detailData.description}}</view>
						<view class="text-gray margin-top-sm flex align-center">
							<view class="flex align-center margin-right-xl">
								<image src="https://jzxt.qifudaren.net/static/course/icon-keshi.png"
									class="icon-32 margin-right-8" mode="">
								</image>
								{{detailData.class_hour}}课时
							</view>
							<view class="flex align-center">
								<image src="https://jzxt.qifudaren.net/static/course/icon-bofang-2.png"
									class="icon-32 margin-right-8" mode=""></image>
								{{detailData.play_count}}播放
							</view>
						</view>

						<view class="grid col-5 text-gray">
							<view class="flex align-center justify-center info-tab-item" @click="handleCollect">
								<image
									:src="chapterCollected ? '/static/common/like-fill.png' : 'https://jzxt.qifudaren.net/static/course/icon-shoucang.png'"
									class="icon-48" mode=""></image>
								<view>收藏</view>
							</view>
							<view class="flex align-center justify-center info-tab-item" @click="handleCmt">
								<image src="https://jzxt.qifudaren.net/static/course/icon-pinglun.png" class="icon-48"
									mode=""></image>
								<view>评论</view>
							</view>

							<view class="flex align-center justify-center info-tab-item" @click="showReward = true">
								<image src="https://jzxt.qifudaren.net/static/course/icon-dashang.png" class="icon-48"
									mode=""></image>
								<view>打赏</view>
							</view>
							<view class="flex align-center justify-center info-tab-item" @click="toGoods">
								<image src="https://jzxt.qifudaren.net/static/course/icon-recommend.png" class="icon-48"
									mode="">
								</image>
								<view>推荐产品</view>
							</view>
							<view class="flex align-center justify-center info-tab-item" @click="toShowWx">
								<image src="https://jzxt.qifudaren.net/static/course/icon-weixin.png" class="icon-48"
									mode=""></image>
								<view>联系助教</view>
							</view>
						</view>
					</view>


					<view class="course-related bg-white course-detail-card">
						<view class="flex align-center justify-between">
							<view class="course-detail-card-title">相关课程</view>
							<!-- <view class="course-detail-card-more flex align-center">
              更多
              <i class="cuIcon-right"></i>
            </view> -->
						</view>
						<view class="flex align-center related-goods-list">
							<view v-for="pitem in recommedata" :key="pitem.id" class="related-goods-item"
								@click="getRecCourse(pitem.id)">
								<image :src="pitem.thumb_image" class="related-goods-img" mode="aspectFill"></image>
								<view class="related-goods-img-txt">{{pitem.name}}</view>
							</view>
						</view>

					</view>

					<view class="course-detail-card bg-white" id="detail">
						<view class="course-detail-card-nav">
							<view class="course-detail-card-nav-item"
								:class="{'course-detail-card-nav-item-active': cardNav === 1}"
								@click="changeCardNav(1)">课程介绍</view>
							<view class="course-detail-card-nav-item"
								:class="{'course-detail-card-nav-item-active': cardNav === 2}"
								@click="changeCardNav(2)">课程目录</view>
						</view>
						<view class="course-detail-card-content" v-if="cardNav === 1">{{detailData.introduce}}</view>
						<view class="course-detail-card-content course-catalogue-wrap" v-if="cardNav === 2">
							<view class="course-catalogue-title">共<span>{{chapters.length}}</span>节</view>
							<view class="course-catalogue-list">
								<view class="course-catalogue-item flex align-center justify-between"
									v-for="(item,index) in chapters" :key="item.id" @click="changeCourse(index)">
									<view>
										<view class="flex course-catalogue-info">
											<view class="catalogue-info-index">{{index + 1}}</view>
											<view class="catalogue-info-name line-1">{{item.name}}</view>
										</view>
										<view class="course-catalogue-time">
											{{item.file_time}}
										</view>
									</view>
									<image v-if="index == currCourseIndex"
										src="https://jzxt.qifudaren.net/static/course/icon-course-playing.png"
										class="icon-48" mode="aspectFill">
									</image>
									<image v-else src="https://jzxt.qifudaren.net/static/course/icon-course-play.png"
										class="icon-48" mode="aspectFill">
									</image>
								</view>
							</view>
						</view>
					</view>


					<view class="course-detail-card bg-white" id="comment">
						<view class="course-detail-card-title">用户评价</view>
						<view class="padding">
							<view class="course-eve-item flex" v-for="item in commentList" :key="item.id">
								<image :src="item.user.avatar" class="course-eve-ava" mode="aspectFill"></image>
								<view class="course-eve-right flex-sub">
									<view class="flex align-center justify-between">
										<view class="course-eve-username">{{item.user.nickname}}</view>
										<view class="flex align-center">
											<image src="https://jzxt.qifudaren.net/static/course/icon-pinglun-2.png"
												class="icon-36 margin-right" mode="aspectFill"
												@click="replyCmt(item.id)"></image>
											<view class="flex align-center">
												<image @click="handleCommentZan(item.id)"
													:src="item.is_like == 1 ? '/static/common/like-fill.png' : 'https://jzxt.qifudaren.net/static/course/icon-shoucang.png'"
													class="icon-32 " mode="aspectFill">
												</image>
												<text v-if="item.like_num > 0">{{item.like_num}}</text>
											</view>
										</view>
									</view>
									<view class="course-eve-time">{{item.createtime_text}}</view>
									<view class="course-eve-content">
										{{item.content}}
									</view>
									<view class="block" v-if="item.reply && item.reply.length> 0">
										<view class="coruse-eve-likes flex align-center" v-if="false">
											<image src="https://jzxt.qifudaren.net/static/course/icon-shoucang.png"
												class="icon-32 margin-right-8" mode=""></image>
											<view>钱宇辰觉得很赞</view>
										</view>

										<view class="coruse-eve-recommend flex" v-for="cmt in item.reply" :key="cmt.id">
											<view class="eve-recommend-user">{{cmt.user.nickname}}：</view>
											<view class="flex-sub">{{cmt.reply_content}}</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="footer-fixed safe-area" v-if="showBuyBtn"></view>
				</scroll-view>
			</view>

			<view class="page-fixed-footer" v-if="showBuyBtn">
				<view class="course-bottom page-footer-wrap">
					<view class="text-price text-red">
						{{detailData.salesprice}}
					</view>
					<view class="cu-btn round bnt-buy" @click="toSave">直接购买</view>
					<view class="cu-btn round btn-submit" @click="toVip" v-if="detailData.is_charge !== 2">开通会员免费学
					</view>
				</view>
			</view>

			<u-popup :show="showQrcode" mode="center" closeable round="16" @close="close" @open="open">
				<view class="concat-wx-wrap">
					<view class="concat-wx-title">联系助教</view>
					<view class="qr-code-wrap">
						<image :src="qrcode" class="qr-code-img" mode=""></image>
					</view>
				</view>
			</u-popup>

			<u-popup :show="showComment" mode="bottom" closeable round="16" @close="close" @open="open">
				<view class="reward-pop-wrap">
					<view class="reward-pop-title speed-pop-title">评论</view>
					<scroll-view scroll-y class="comment-list-wrap" @scrolltolower="commentMore">
						<view class="comment-list-item bg-white flex justify-between align-center"
							v-for="item in commentList" :key="item.id">
							<view class="flex flex-1">
								<image :src="item.user.avatar" class="comment-item-cover" mode="aspectFill">
									<view class="flex-sub margin-right">
										<view class="comment-item-name">{{item.user.nickname}}</view>
										<view class="margin-top-8 comment-item-con  line-2">
											{{item.content}}
										</view>
										<view class="flex align-center justify-between comment-item-time">
											<view>{{item.createtime_text}}</view>
											<view class="flex align-center justify-center">
												<view class="flex align-center" @click="handleCommentZan(item.id)">
													<image
														src="https://jzxt.qifudaren.net/static/course/icon-yishoucang.png"
														v-if="item.is_like" class="icon-32 margin-right-8" mode="" />
													<image v-else
														src="https://jzxt.qifudaren.net/static/course/icon-shoucang.png"
														class="icon-32 margin-right-8" mode="aspectFill" />
												</view>
												<view style="line-height: 32rpx;">{{item.like_num}}</view>
											</view>
										</view>
									</view>
							</view>
						</view>
					</scroll-view>
					<view class="flex align-center justify-between comment-handler-wrap">
						<input type="text" v-model="commentText" placeholder="请输入" class="comment-input" />
						<view class="cu-btn round btn-comment-send" @click="addComment">发送</view>
					</view>
				</view>
			</u-popup>
			<u-popup :show="showReward" mode="bottom" round="16" @close="close" @open="open">
				<view class="reward-pop-wrap">
					<view class="reward-pop-title">请选择打赏的金额</view>
					<view class="flex price-tag-wrap">
						<view class="price-tag" @click="selectPrice(item.price)"
							:class="{'price-tag-active': selected === item.price}" v-for="item in priceList"
							:key="item.price">
							{{item.price}}元
						</view>
					</view>
					<view class="reward-pop-title">其他金额</view>
					<input type="text" :value="curPrice" placeholder="请输入其他金额" class="reward-input"
						@change="handleAmount">
					<view class="cu-btn block round pay-reward-btn" @click="toReward">确认支付</view>
				</view>
			</u-popup>
			<u-popup :show="showCmtIpt" mode="bottom" round="16" @close="showCmtIpt = false">
				<view class="ipt-wrap padding-24">
					<view class="flex align-center justify-between comment-handler-wrap">
						<u--input type="text" shape="circle" v-model="replyCmtText" placeholder="请输入评论"
							class="comment-input"></u--input>
						<view class="cu-btn round btn-comment-send" @click="replyComment">发送</view>
					</view>
				</view>
			</u-popup>


			<u-popup :show="showSpeed" mode="bottom" closeable round="16" @close="showSpeed=false">
				<view class="reward-pop-wrap">
					<view class="reward-pop-title speed-pop-title">倍数播放</view>
					<view class="speed-list">
						<view class="speed-item flex align-center justify-between" @click="setMultiple(item)"
							v-for="item in speedList" :key="item.speed">
							<view>{{item.speed}}倍</view>
							<image src="https://jzxt.qifudaren.net/static/audio/speed-has.png"
								v-if="item.speed == curSpeed" class="icon-36" mode="aspectFill"></image>
							<!-- <view class="speed-no-wrap" @click="changeSpeed(item)" v-else></view> -->
						</view>
					</view>
				</view>
			</u-popup>


		</view>
</template>

<script>
	import store from '@/store';
	import {
		IMG_BASE_URL
	} from '../../config/env';
	import {
		pay
	} from '../../utils/pay';
	export default {
		data() {
			return {
				tabNav: 'goods',
				cardNav: 1,
				showSpeed: false,
				showQrcode: false,
				detailData: {
					is_charge: 0,
					salesprice: 0
				},
				recommedata: [],
				courseId: '',
				chapterId: '',
				showComment: false,
				commentList: [],
				speedList: [{
						speed: '0.5'
					}, {
						speed: '0.8'
					},
					{
						speed: '1.0'
					}, {
						speed: '1.25'
					},
					{
						speed: '1.5'
					}, {
						speed: '2.0'
					}
				],
				commentText: '',
				page: 1,
				pageSize: 10,
				pageMax: false,
				showReward: false,
				priceList: [{
					price: '3'
				}, {
					price: '6'
				}, {
					price: '25'
				}, {
					price: '50'
				}, {
					price: '98'
				}, {
					price: '198'
				}],
				curPrice: '',
				selected: '',
				number: 1,
				finalAmount: '',
				statusBarHeight: 42,
				qrcode: '',
				currCourseIndex: 0,
				isDefinitionBtnShow: true,
				study_time: 0,
				safeHeight: 0,
				currCmtId: '',
				showCmtIpt: false,
				replyCmtText: '',
				finished: true,
				chapters: []
			};
		},
		computed: {
			showBuyBtn() {
				if (this.detailData.is_buy === 1) {
					return false
				} else {
					if (this.detailData.is_charge === 0) {
						return false
					} else if (this.detailData.is_charge === 1) {
						if (this.detailData.is_vip === 2) {
							return false
						} else {
							return true
						}
					} else if (this.detailData.is_charge == 2) {
						if (this.detailData.is_buy === 1) {
							return false
						} else {
							return true
						}
					} else {
						if (this.detailData.is_vip === 1) {
							return false
						} else {
							return true
						}
					}
				}

			},
			chapterCollected() {
				return this.chapters[this.currCourseIndex]?.collection_status == 0 ? false : true
			}
		},
		onLoad(options) {
			console.log('options', options)
			const {
				statusBarHeight,
				screenHeight
			} = uni.getWindowInfo()
			this.statusBarHeight = statusBarHeight
			this.safeHeight = screenHeight - statusBarHeight
			this.courseId = options?.course_id
			this.chapterId = options?.chapter_id
			if (options?.chapter) {
				const course = JSON.parse(decodeURIComponent(options.chapter))
			}
			// if (this.courseId) {

			// }
			this.getData();
			this.getChapters()
			this.getLike();
			this.getComments()
			try {
				const qrcode = uni.getStorageSync('qrcode')
				if (qrcode) {
					this.qrcode = qrcode
				}
			} catch (e) {
				//TODO handle the exception
				console.error(e)
			}
		},
		onShareAppMessage() {
			return {
				title: this.chapters[this.currCourseIndex].name,
				path: `/pages/courseDetail/courseDetail?course_id=${this.courseId}&chapter_id=${this.chapterId}`,
				imageUrl: this.getUrl(this.chapters[this.currCourseIndex].poster_image)
			}
		},
		onShareTimeline() {
			return {
				title: this.chapters[this.currCourseIndex].name,
				path: `/pages/courseDetail/courseDetail?course_id=${this.courseId}&chapter_id=${this.chapterId}`,
				imageUrl: this.getUrl(this.chapters[this.currCourseIndex].poster_image)
			}
		},
		onHide() {
			this.postStudy(this.currCourseIndex)
		},
		onUnload() {
			this.postStudy(this.currCourseIndex)
			// store.commit('SET_PLAY_COURSE', this.courseId)
		},
		methods: {
			async getChapters() {
				const {
					data
				} = await this.$Api.course_file_list({
					course_id: this.courseId
				})
				this.chapters = data?.data || []

				if (this.chapters.length > 0) {
					const idx = this.chapters.findIndex(item => item.id == this.chapterId)
					if (idx > -1) {
						this.currCourseIndex = idx
					}
				}
			},
			async replyComment() {
				if (this.replyCmtText == '') return
				if (!this.finished) return
				this.finished = false
				if (this.currCmtId) {
					await this.$Api.courseCommentFav({
						comment_id: this.currCmtId,
						opt: 2,
						reply_content: this.replyCmtText
					}).then(() => {
						this.replyCmtText = ''
						this.showCmtIpt = false
						this.finished = true
						this.getComments()
						uni.showToast({
							title: '评论成功',
							icon: 'none'
						})
					})
				} else {
					this.$Api.addCourseComment({
						course_id: this.courseId,
						content: this.replyCmtText
					}).then(res => {
						this.replyCmtText = ''
						this.showCmtIpt = false
						this.finished = true
						this.getComments()
						uni.showToast({
							title: '评论成功',
							icon: 'none'
						})
					})
				}

			},

			playerFullScreen(e) {
				if (e.detail.fullScreen) { //全屏
					uni.createVideoContext('videoRef', this).playbackRate(this.number);
					this.isDefinitionBtnShow = false;
				} else { //非全屏			
					uni.createVideoContext('videoRef', this).playbackRate(this.number);
					this.isDefinitionBtnShow = true;
				}
			},
			handleCmt() {
				this.currCmtId = ''
				this.showCmtIpt = true
			},
			replyCmt(cmid) {
				this.currCmtId = cmid
				this.showCmtIpt = true
			},
			onTimeUpdate(e) {
				this.study_time += 250
			},
			onEnded(e) {
				this.postStudy(this.currCourseIndex).then(() => {
					this.study_time = 0
				})
			},
			changeCourse(index) {
				this.currCourseIndex = index
				this.chapterId = this.chapters[index].id
				this.postStudy(this.currCourseIndex).then(() => {
					this.study_time = 0
				})
			},
			async postStudy(idx) {
				if (this.study_time == 0) return
				const course = this.detailData.course_file[idx]
				await this.$Api.postStudyTime({
					course_id: course.course_id,
					course_file_id: course.id,
					type: 1,
					view_time: this.study_time / 1000
				}).catch(err => {
					console.error(err)
				})
			},
			getUrl(url) {
				if (/^http/.test(url)) {
					return url
				}
				return IMG_BASE_URL + url
			},
			async getRecCourse(id) {
				this.courseId = id;
				this.getData();
				this.getLike();
			},
			async handleCollect() {
				let res = await this.$Api.postChapterCollect({
					// course_id: this.$route.query.course_id
					course_id: this.courseId,
					course_file_id: this.chapters.length > 0 ? this.chapters[this.currCourseIndex].id : ''
				})
				if(this.chapters.length>0){
				  this.chapters[this.currCourseIndex].collection_status = res.data.collection_status	
				}
				
				// this.$set(this.detailData, 'collection_status', res.data.collection_status)
			},
			async getData() {
				this.chapters=[];
				let res = await this.$Api.getCourceDetail({
					// course_id: this.$route.query.course_id
					course_id: this.courseId
				})
				this.detailData = res.data
				// const courses = res.data.course_file
				// if(courses?.lenght > 0) {

				// }
				
				console.log("this.chapters",this.chapters)
				
				if(res.data.course_file && res.data.course_file.length>0){
					this.currCourseIndex=0;
					this.chapters=res.data.course_file;
				}
				
				
				if( res.data.course_file.length==0 && res.data.file){
					this.currCourseIndex=0;
					
					this.chapters=[{file:res.data.file}];
				}
				
				console.log("this.chapters",this.chapters)
				
			},

			async getComments() {
				try {
					const {
						data
					} = await this.$Api.getCourseComments({
						course_id: this.courseId,
					})
					this.commentList = data.data
					// this.commentList = this.commentList.concat(data.data)
					// this.pageMax = this.commentList.length >= data.total
					// this.page++
				} catch (e) {
					//TODO handle the exception
					console.error(e)
				}
			},
			change2Audio() {
				uni.navigateTo({
					url: '/pages/audioDetail/audioDetail?course_id=' + this.courseId+'&category_id='+this.detailData.category_id
				})
			},
			handleZan(id) {
				if (this.detailData.is_like) return
				this.$Api.courseFav({
					course_id: id
				}).then(res => {
					this.$set(this.detailData, 'is_like', true)
					this.$set(this.detailData, 'like_num', this.detailData.like_num + 1)
				})
			},
			commentMore() {
				if (this.pageMax) return
				this.getComments()
			},
			async toReward() {
				await pay('reward', 'createRewardOrder', this.finalAmount, 'amount', '打赏')
				this.showReward = false
				uni.showToast({
					title: '打赏成功',
					icon: 'none'
				})
			},
			handleAmount(e) {
				this.curPrice = e.detail.value
				this.finalAmount = e.detail.value
				this.selected = ''
			},
			selectPrice(price) {
				this.selected = price
				this.curPrice = ''
				this.finalAmount = price
			},
			async getLike() {
				let res = await this.$Api.getCourceGuessLike({
					// course_id: this.$route.query.course_id
					course_id: this.courseId
				})
				this.recommedata = res.data.data
			},
			handleCommentZan(id) {
				const idx = this.commentList.findIndex(item => item.id === id)
				// if (this.commentList[idx]['is_like']) return
				this.$Api.courseCommentFav({
					comment_id: id
				}).then(res => {
					const like_num = this.commentList[idx]['like_num'] + (this.commentList[idx][
							'is_like'
						] ? -1 :
						1)
					this.$set(this.commentList, idx, {
						...this.commentList[idx],
						is_like: !this.commentList[idx]['is_like'],
						like_num: like_num
					})
				})
			},
			addComment() {
				if (this.commentText == '') return
				this.$Api.addCourseComment({
					course_id: this.courseId,
					content: this.commentText
				}).then(res => {
					this.getComments()
					this.commentText = ''
					this.showComment = false
					uni.showToast({
						title: '评论成功',
						icon: 'none'
					})
				})
			},
			toShowWx() {
				this.showQrcode = true
			},
			toGoods() {
				uni.navigateTo({
					url: '/pages/goodsDetail/goodsDetail?goodsId=' + this.detailData.goods_id
				})
			},
			back() {
				uni.navigateBack()
			},
			changeNav(i) {
				this.tabNav = i
			},
			changeCardNav(i) {
				this.cardNav = i
			},
			toSave() {
				// this.$Api.postCreateOrder({
				//   course_id: this.$route.query.course_id,
				//   platform: ''
				// })
				// uni.navigateTo({
				//   url: '/pages/pay/pay?isCourse=1'
				// })
				pay('course', 'postCreateOrder', this.courseId, 'course_id', this.detailData.name)
			},
			toVip() {
				uni.navigateTo({
					url: '/pages/user/vip'
				})
			},
			open() {
				// console.log('open');
			},

			// 设置倍数
			setMultiple(number) {
				this.number = Number(number.speed);
				console.log(this.number)
				uni.createVideoContext('videoRef', this).playbackRate(this.number);
				this.showSpeed = false;

			},

			close() {
				this.showQrcode = false
				// console.log('close');
				this.showComment = false
				this.showReward = false
			},
		}
	}
</script>

<style lang="scss">
	.page-course-detail {
		min-height: 100vh;
		color: #333;
		background-color: #f8f8f8;
		// padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
		// padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
		position: relative;

		.stikied {
			box-sizing: content-box;
			position: sticky;
			top: 0;
			z-index: 99;
			background-color: #FFFFFF;
		}

		.course-detail-card-more {
			padding-right: 24rpx;
			padding-top: 32rpx;
			padding-bottom: 16rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 28rpx;
			color: #999999;
		}

		.related-goods-img {
			width: 160rpx;
			height: 192rpx;
			border-radius: 8px;
		}

		.related-goods-img-txt {
			width: 160rpx;
			height: 38px;
			white-space: nowrap;
			/* 确保文本不换行 */
			overflow: hidden;
			/* 隐藏超出容器的文本 */
			text-overflow: ellipsis;
			/* 超出部分显示为省略号 */
		}

		.related-goods-list {
			padding: 0 32rpx;
			flex-wrap: nowrap;
			overflow-x: auto;
		}

		.related-goods-item {
			width: 160rpx;
			min-width: 160rpx;
			margin-right: 16rpx;

		}

		// 评论弹窗
		.reward-pop-wrap {
			padding: 32rpx;
			position: relative;

			&.audio-list-pop-wrap {
				padding: 32rpx 16rpx;
				border-radius: 32rpx;
				overflow: hidden;
			}

			.comment-input {
				width: 526rpx;
				height: 76rpx;
				background: #F8F8F8;
				border-radius: 40rpx 40rpx 40rpx 40rpx;
				padding: 0 32rpx;
			}

			.comment-handler-wrap {
				padding: 16rpx 0;
			}

			.btn-comment-send {
				width: 136rpx;
				height: 76rpx;
				background: #7644FF;
				border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 36rpx;
				color: #FFFFFF;
			}

			.comment-list-wrap {
				max-height: 836rpx;
				min-height: 220rpx;
				margin-top: 16rpx;

				.comment-item-cover {
					height: 64rpx;
					width: 64rpx;
					border-radius: 50%;
					min-width: 64rpx;
					margin-right: 24rpx;
				}

				.comment-list-item {
					padding: 32rpx 0;

					.flex-1 {
						flex: 1
					}
				}

				.comment-item-name {
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #666666;
				}

				.comment-item-con {
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 28rpx;
					color: #333333;
					margin-top: 8rpx;
				}

				.comment-item-time {
					margin-top: 4rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #999999;
				}
			}

			.audio-list-wrap {
				max-height: 836rpx;
				margin-top: 16rpx;

				.audio-list-cover {
					height: 128rpx;
					width: 112rpx;
					min-width: 112rpx;
					border-radius: 8rpx;
					overflow: hidden;
					margin-right: 16rpx;
				}

				.audio-list-item {
					width: 718rpx;
					height: 176rpx;
					background: #FFFFFF;
					border-radius: 16rpx 16rpx 16rpx 16rpx;
					margin-bottom: 16rpx;
					padding: 24rpx 32rpx;
				}

				.audio-item-title {
					font-family: PingFang SC, PingFang SC;
					font-weight: 500;
					font-size: 28rpx;
					color: #000000;
				}

				.icon-48 {
					min-width: 48rpx;
				}

				.audio-item-refresh {
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #000000;
				}
			}

			.custom-time-confirm-btn {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 32rpx;
				color: #7644FF;
				position: absolute;
				right: 32rpx;
				top: 24rpx;
			}

			.audio-list-icons {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 160rpx;

				.audio-icon-wrap {
					height: 64rpx;
					width: 64rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					background-color: #fff;
				}
			}

			.reward-pop-title {
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;
				font-size: 32rpx;
				color: #333333;
				margin-top: 16rpx;
			}

			.speed-pop-title {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 36rpx;
				color: #000000;
				text-align: center;
				margin-top: 0;
			}

			.speed-item {
				height: 116rpx;
				border-bottom: 1rpx solid #eee;
			}

			.speed-no-wrap {
				height: 36rpx;
				width: 36rpx;
				min-width: 36rpx;
				border-radius: 4rpx;
				border: 1rpx dotted #666;
			}

			.pay-reward-btn {
				width: 702rpx;
				height: 88rpx;
				background: #7644FF;
				border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
				line-height: 88rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 32rpx;
				color: #FFFFFF;
				margin-top: 56rpx;
			}

			.reward-input {
				margin-top: 16rpx;
				width: 686rpx;
				height: 84rpx;
				background: #F8F8F8;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				padding: 0 24rpx;
			}

			.price-tag-wrap {
				flex-wrap: wrap;
				margin-top: 16rpx;

				.price-tag {
					width: 207rpx;
					height: 80rpx;
					background: #F8F8F8;
					border-radius: 16rpx 16rpx 16rpx 16rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 28rpx;
					color: #000000;
					text-align: center;
					line-height: 80rpx;
					margin-bottom: 32rpx;
					margin-right: 32rpx;

					&:nth-child(3n) {
						margin-right: 0;
					}

					&.price-tag-active {
						background: rgba(118, 68, 255, 0.06);
						border: 1rpx solid #7644FF;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 28rpx;
						color: #7644FF;
					}
				}
			}
		}

		.course-cover-wrap {
			position: relative;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 24rpx;
			color: #FFFFFF;

			.change-to-audio-wrap {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #FFFFFF;
				position: absolute;
				top: 16rpx;
				left: 50%;
				z-index: 19;
				margin-left: -95rpx;
				width: 190rpx;
				height: 50rpx;
				background: rgba(0, 0, 0, 0.5);
				border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
			}

			.icon-32 {
				margin-right: 2rpx;
			}

			.course-video-wrap {
				height: 420rpx;
				width: 100%;
			}

			.course-detial-cover {
				height: 420rpx;
				width: 100%;
			}
		}

		.course-catalogue-wrap {
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 28rpx;
			color: #000000;

			.course-catalogue-title {
				span {
					font-family: PingFang SC, PingFang SC;
					font-weight: 500;
					font-size: 32rpx;
					color: #7644FF;
				}
			}

			.course-catalogue-item {
				margin: 0 auto;
				padding: 24rpx 0;
				border-bottom: 1rpx solid #eee;

				&:last-child {
					border: none;
				}
			}

			.course-catalogue-time {
				padding-left: 58rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;
				margin-top: 8rpx;
			}

			.course-catalogue-info {
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;
				font-size: 28rpx;
				color: #000000;
			}

			.catalogue-info-index {
				margin-right: 16rpx;
			}

			.catalogue-info-title {
				width: 548rpx;
			}
		}

		.course-eve-item {
			margin-bottom: 48rpx;

			.course-eve-ava {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				min-width: 80rpx;
				margin-right: 16rpx;
			}

			.course-eve-username {
				font-family: PingFang SC, PingFang SC;
				font-weight: 600;
				font-size: 28rpx;
				color: #000000;
			}

			.course-eve-time {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;
			}

			.course-eve-content {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
				margin-top: 24rpx;
			}

			.coruse-eve-likes {
				width: 590rpx;
				background: #F6F6F6;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				padding: 16rpx;
				margin-top: 24rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;

			}

			.coruse-eve-recommend {
				width: 590rpx;
				background: #F6F6F6;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				padding: 16rpx;
				margin-top: 24rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #333333;

				.eve-recommend-user {
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #999999;
				}
			}
		}

		.course-bottom {
			justify-content: space-between;

			.bnt-buy {
				width: 176rpx;
				height: 88rpx;
				background: #FFFFFF;
				border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
				border: 2rpx solid #7644FF;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 32rpx;
				color: #7644FF;
				padding: 0;
			}

			.text-price {
				font-family: DIN, DIN;
				font-weight: 500;
				font-size: 40rpx;
				color: #FF2E00;
			}

			.btn-submit {
				width: 272rpx;
				height: 88rpx;
				background: #7644FF;
				border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 32rpx;
				color: #FFFFFF;
				padding: 0;
			}
		}

		.course-detail-card {
			margin-top: 16rpx;

			.course-detail-card-title {
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;
				font-size: 32rpx;
				color: #333333;
				padding-left: 24rpx;
				padding-top: 32rpx;
				padding-bottom: 16rpx;
			}

			.course-detail-card-nav {
				display: flex;
				height: 92rpx;
				align-items: center;
				padding: 0 32rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 32rpx;
				color: #666666;
			}

			.course-detail-card-content {
				padding: 32rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
			}

			.course-detail-card-nav-item {
				margin-right: 48rpx;
				position: relative;
				height: 92rpx;
				line-height: 92rpx;

				&-active {
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					font-size: 32rpx;
					color: #7644FF;

					&::after {
						content: '';
						position: absolute;
						width: 64rpx;
						height: 6rpx;
						background: #7644FF;
						border-radius: 198rpx 198rpx 0rpx 0rpx;
						left: 50%;
						margin-left: -32rpx;
						bottom: 12rpx;
					}
				}
			}
		}

		.info-tab-item {
			flex-direction: column;
			margin-top: 40rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;

			.icon-48 {
				margin-bottom: 8rpx;
			}
		}

		.course-detial-info {
			padding: 32rpx;

			.coruse-detail-tags {
				margin-top: 16rpx;
			}

			.course-detail-tag-item {
				// width: 112rpx;
				padding: 4rpx 16rpx;
				height: 42rpx;
				background: linear-gradient(133deg, #D791FF 0%, #6E39FF 100%);
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;
				font-size: 24rpx;
				color: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 8rpx;
			}
		}

		.course-detail-title {
			font-family: PingFang SC, PingFang SC;
			font-weight: 600;
			font-size: 36rpx;
			color: #000000;
		}

		.icon-share {
			position: absolute;
			right: 32rpx;
		}

		.share-btn {
			position: absolute;
			bottom: 10rpx;
			right: 32rpx;
			z-index: 9;
			width: 60rpx;
			height: 60rpx;

			&::after {
				padding: 0;
				border: none;
				border-radius: 0;
			}

			.icon-share-mp {
				width: 52rpx;
				height: 52rpx;
			}
		}

		.vip-nav {
			width: 336rpx;
			height: 58rpx;
			background: #fff;
			border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
			margin: 0 auto 0;
			display: flex;
			align-items: center;
			justify-content: space-between;

			&-item {
				height: 58rpx;
				border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
				text-align: center;
				line-height: 58rpx;
				padding: 0 32rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;
				font-size: 24rpx;
				color: #7644FF;
			}

			.vip-nav-item-active {
				background: #7644FF;
				color: #fff;
			}
		}

		.ipt-wrap {
			width: 100%;
			padding: 32rpx;

			.btn-comment-send {
				width: 136rpx;
				height: 76rpx;
				background: #7644FF;
				border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 36rpx;
				color: #FFFFFF;
				margin-left: 12rpx;
			}
		}
	}

	.page-main-content {
		width: 100%;
		height: 100vh;
	}

	.footer-fixed {
		width: 100%;
		height: 144rpx;
		box-sizing: content-box;
	}

	.multipleItem {
		width: 60rpx;
		height: 30rpx;
		background: rgba(0, 0, 0, .4);
		text-align: center;
		font-size: 20rpx;
		color: #fff;
		text-align: center;
		line-height: 30rpx;
		border-radius: 30rpx;
		margin-bottom: 10rpx;
	}
</style>