<template>
  <!-- #ifdef MP -->
  <view class="page-index page-wrap has-combtn-padding" :style="{paddingTop: (barHeight + 40) + 'px'}">
  <!-- #endif -->
    <!-- #ifndef MP -->
    <view class="page-index page-wrap has-combtn-padding" :style="{paddingTop: barHeight + 'px'}">
    <!-- #endif -->

      <image src="https://jzxt.qifudaren.net/static/index/bg.png" class="index-top" mode="aspectFill"></image>
      <view class="cu-bar search">
        <view class="search-form round" @click="toSearch">
          <text class="cuIcon-search"></text>
          <!-- <input :adjust-position="false" type="text" placeholder="请搜索" confirm-type="search"></input> -->
          <view class="input-hold" style="color: #fff;">请搜索</view>
        </view>
        <view class="action" style="position: relative;">
          <!-- <image src="https://jzxt.qifudaren.net/static/index/chat.png" class="chat-icon" mode="aspectFill"></image>
          <button open-type="contact" class="contact-btn">
            <image src="https://jzxt.qifudaren.net/static/index/chat.png" class="chat-icon" mode="aspectFill"></image>
          </button> -->
          <image src="https://jzxt.qifudaren.net/static/index/chat.png" class="chat-icon" mode="aspectFill"
            @click="toMessage"></image>
          <view class="unread" v-if="msgCnt > 0">{{msgCnt}}</view>
        </view>
      </view>
      <!-- <button open-type="getPhoneNumber" @getphonenumber="getPhone">获取手机号</button> -->
      <view class="swiper-wrap">
        <swiper :indicator-dots="false" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff"
          :autoplay="true" :interval="3000" :duration="1000">
          <swiper-item v-for="item in bannerList" :key="item.id">
            <image class="swiper-item" :src="item.thumb_image" mode="aspectFill" @click="handleBanner(item)"></image>
          </swiper-item>
          <!-- 	<swiper-item>
					<image  class="swiper-item" src="https://jzxt.qifudaren.net/static/temp/index/index-1.png" mode=""></image>
				</swiper-item> -->
        </swiper>
      </view>

      <view class="index-audio-wrap">
        <view class="audio-box">
          <view v-for="item in teacherAudio" :key="item.id" class="index-audio" @click="toAudioDetail(item)">
            <image :src="item.thumb_image" style="border:2rpx solid #8840FF" class="audio-img" mode="aspectFill">
            </image>
            <view class="audio-left">
              <view class="audio-title">
                <view class="ellipsis">{{item.name}}</view>
                <image src="https://jzxt.qifudaren.net/static/audio/playing.gif" class="audio-status" mode="aspectFill">
                </image>
                <view class="new-notice" v-if="item.is_new === 1">新</view>
                <view class="new-notice" v-if="item.is_hot === 1">热</view>
              </view>
              <view class="audio-tips line-2">{{item.description}}</view>
            </view>
            <image src="https://jzxt.qifudaren.net/static/index/audio-play.png" class="audio-paly" mode="aspectFill">
            </image>
          </view>
        </view>
      </view>


      <!-- 图片banner -->
      <view class="banner-wrap">
        <view class="banner-item" @click="toUrl('/pages/user/vip')">
          <image src="https://jzxt.qifudaren.net/static/index/nav-vip.png" class="banner-item-img" mode=""></image>
        </view>
        <view class="banner-item" @click="toUrl('/pages/user/rank')">
          <image src="https://jzxt.qifudaren.net/static/index/nav-rank.png" class="banner-item-img" mode=""></image>
        </view>
        <view class="banner-item" @click="toUrl('/pages/user/lottery')">
          <image src="https://jzxt.qifudaren.net/static/index/nav-lottery.png" class="banner-item-img" mode=""></image>
        </view>
      </view>


      <view class="index-nav">
        <view class="grid  text-center col-5">
          <view class="nav-item" v-for="item in navList" :key="item.name" @click="toUrl(item.path)">
            <image :src="`https://jzxt.qifudaren.net/static/index/${item.url}.png`" class="nav-item-img" mode="">
            </image>
            <view class="nav-item-title">{{item.name}}</view>
          </view>
          <!-- #ifdef MP -->
          <view class="nav-item">
            <button class="reset-btn" open-type="contact"></button>
            <image :src="`https://jzxt.qifudaren.net/static/index/nav-kehu.png`" class="nav-item-img" mode=""></image>
            <view class="nav-item-title">联系客服</view>
          </view>
          <!-- #endif -->
          <!-- #ifdef APP -->
          <view class="nav-item" @click="toUrl()">
            <image :src="`https://jzxt.qifudaren.net/static/index/nav-kehu.png`" class="nav-item-img" mode=""></image>
            <view class="nav-item-title">联系客服</view>
          </view>
          <!-- #endif -->
        </view>
      </view>


      <view class="index-courses bg-white">
        <!-- 	<view class="course-teacher">
				<view class="course-img-wrap">
					<image src="https://jzxt.qifudaren.net/static/index/course-teacher.png" class="course-teacher-img" mode=""></image>
					<view class="course-teacher-name">翟先生</view>
				</view>
				<view>
					<view class="flex align-center">
						<view class="teacher-tag">程朱理学学科领头人</view>
						<view class="teacher-tag">程朱理学学科领头人</view>
					</view>
					<view class="teacher-des">翟先生是北京大学、清华大学、的荣誉教授，是程朱理学的当代学科研究领头人、博士生导师，带来200人...</view>
				</view>
			</view> -->
        <view @click="toUrl('/pages/user/famous-teacher-detail?teacherId='+teacher.id)">
          <CourseTeacher :item="teacher" />
        </view>
        <scroll-view scroll-x class="course-nums-wrap">
          <view class="content-item flex-1 flex align-center">
            <view v-for="(item, index) in tableContent" :key="index" class="course-nums-item"
              :class="{'course-nums-item-active': numIndex === index}" @click="changeIndex(index)">
              {{item.start}}-{{item.end}}集
            </view>
          </view>
          <!-- <view class="course-nums">
            <view class="course-nums-item" :class="{'course-nums-item-active': numIndex === 1}" @click="changeIndex(1)">
              1-{{Math.min(totalCount, 50)}}集</view>
            <view class="course-nums-item" v-if="totalCount > 50" :class="{'course-nums-item-active': numIndex === 2}"
              @click="changeIndex(2)">51-{{Math.min(totalCount, 100)}}集</view>
            <view class="course-nums-item" v-if="totalCount > 100" :class="{'course-nums-item-active': numIndex === 3}"
              @click="changeIndex(3)">100-{{Math.min(totalCount, 150)}}集</view>
            <view class="course-nums-item" v-if="totalCount > 150" :class="{'course-nums-item-active': numIndex === 4}"
              @click="changeIndex(4)">151-{{Math.min(totalCount, 200)}}集</view>
          </view> -->
        </scroll-view>
        <CourseItem :teacher="teacher" :item="item" v-for="item in courses" :key="item.id" :show-line="true">
        </CourseItem>
        <!-- <view class="course-item" v-for="item in 10" @click="toUrl('/pages/courseDetail/courseDetail')">
				<image src="https://jzxt.qifudaren.net/static/temp/index/index-3.png" class="course-cover" mode=""></image>
				<view class="flex-sub">
					<view class="course-title">翟先生讲程朱理学</view>
					<view class="course-des">用不焦虑的活法，找到与世界相处的智慧</view>
					<view class="flex align-center course-teacher-wrap">
						<image src="https://jzxt.qifudaren.net/static/temp/shop-1.png" class="teacher-ava" mode=""></image>
						<view>翟先生</view>
					</view>
					<view class="flex align-center justify-between course-info-wrap">
						<view class="flex align-center">
							<view class="text-price text-red">199.00</view>
							<image src="https://jzxt.qifudaren.net/static/index/course-tag-1.png" class="course-tag" mode=""></image>
						</view>
						<view class="flex align-center">
							<image src="https://jzxt.qifudaren.net/static/index/icon-watch.png" class="study-icon" mode=""></image>
							<view class="study-des">9.2万人学过</view>
						</view>
					</view>
				</view>
			</view> -->
      </view>

      <tab-bar :selected="0"></tab-bar>
    </view>
</template>

<script>
  import TabBar from "@/components/tabbar.vue"
  import CourseItem from "@/components/CourseItem.vue"
  import CourseTeacher from "@/components/CourseTeacher.vue"
  // import store from '@/store'
  export default {
    data() {
      return {
        unread: 9,
        title: 'Hello',
        numIndex: 0,
        audioIndex: 1,
        totalCount: 1,
        timer: null,
        teacher: {},
        teacherAudio: [],
        bannerList: [],
        courseList: [],
        barHeight: 44,
        navList: [{
          name: '免费专区',
          url: 'nav-free',
          path: '/pages/sub-nav/free'
        }, {
          name: '微课专区',
          url: 'nav-small',
          path: '/pages/sub-nav/small'
        }, {
          name: '解读好书',
          url: 'nav-book',
          path: '/pages/sub-nav/goodBook'
        }, {
          name: '名师讲堂',
          url: 'nav-teacher',
          path: '/pages/user/famous-teacher'
        }],
        tableContent: [{
            start: 1,
            end: 10
          },
          {
            start: 11,
            end: 20
          },
          {
            start: 21,
            end: 30
          },
          {
            start: 31,
            end: 40
          },
          {
            start: 41,
            end: 50
          },
        ],
        notice: {},
        msgCnt: 0
      }
    },
    components: {
      TabBar,
      CourseItem,
      CourseTeacher
    },
    computed: {
      courses() {
        const {
          start,
          end
        } = this.tableContent[this.numIndex]
        console.log(start, end, 'end');
        return this.courseList.slice(start - 1, end)
      }
    },
    onLoad() {
      const height = uni.getStorageSync('barHeight')
      this.barHeight = height
      // let hasLogin = uni.getStorageSync('hasLogin')
      // if(!hasLogin) {
      // 	uni.redirectTo({
      // 		url: '/pages/login/login'
      // 	})
      // } else {
      // 	
      // }
      this.getInfo()
      this.getRecCourse()
      this.getZhaiCourse()
    },
    onShow() {
      // #ifndef MP
      uni.hideTabBar()
      // #endif
      this.timer = setInterval(() => {
        if (this.audioIndex > 5) {
          this.audioIndex = 1
        } else {
          this.audioIndex++
        }
      }, 1000)
      this.getMessageInfo()
    },
    onHide() {
      clearInterval(this.timer)
    },
    onShareAppMessage() {
      return {
        title: '名师大咖，为你量身定制',
        path: '/pages/index/index'
      }
    },
    onShareTimeline() {
      return {
        title: '名师大咖，为你量身定制',
        path: '/pages/index/index'
      }
    },
    methods: {
      async getMessageInfo() {
        const {
          data
        } = await this.$Api.messageList({
          is_read: 0
        })
        this.msgCnt = data.data?.length ?? 0
      },
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
          default:
            break;
        }
      },
      toMessage() {
        uni.navigateTo({
          url: '/pages/sub-nav/notification'
        })
      },
      toSearch() {
        uni.navigateTo({
          url: '/pages/sub-nav/search-result/search-result'
        })
      },
      async getPhone(e) {
        console.log('getPhone', e)
        let code = e.detail.code
        let res = await this.$Api.getMobileByCode({
          phone_code: code
        })
        console.log('getPhone-res', res)

      },
      async getZhaiCourse() {
        const {
          data
        } = await this.$Api.getCourseList({
          category_id: 5
        })
        console.log(data.data);
        this.courseList = data.data
        this.totalCount = data.total
      },
      async getRecCourse() {
        const {
          data
        } = await this.$Api.getCourseList({
          category_id: 4,
          type: 2
        })
        this.teacherAudio = data.data
      },
      async getInfo() {
        let res = await this.$Api.getBanners({
          group: 'index'
        })
        console.log('res', res)
        this.bannerList = res.data
        let res2 = await this.$Api.getHomeDashbord({
          group: 'index'
        })
        console.log('getHomeDashbord', res2)
        this.teacher = res2.data.home_teacher
        // this.teacherAudio = res2.data.home_audio
        // // store.commit('SET_RECOMMENT_LIST', res2.data.home_audio)
        // uni.setStorageSync('qrcode', res2.data.assistant_qrcode)
        // let res3 = await this.$Api.getHomeRecommendCourse({
        //   home_teacher_id: this.teacher.id
        // })
        // console.log('res3', res3)
        // this.courseList = res3.data.data.sort((a, b) => a.id - b.id)
        // this.totalCount = res3.data.total
      },
      changeIndex(i) {
        this.numIndex = i
      },
      toAudioDetail(item) {
        let url = '/pages/audioDetail/audioDetail'
        if (item.type === 1) {
          url = '/pages/courseDetail/courseDetail'
        }
        uni.navigateTo({
          url: `${url}?course_id=${item.id}`
        })
      },
      toUrl(url) {
        if (!url) return;
        uni.navigateTo({
          url: url,
        })
      }
    }
  }
</script>

<style lang="scss">
  .page-index {
    background: #ECEEFF;
    min-height: 100vh;

    .unread {
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      min-width: 30rpx;
      max-width: 60rpx;
      height: 30rpx;
      padding: 4rpx;
      background-color: #FF3B30;
      border-radius: 15rpx;
      color: #FFFFFF;
      font-size: 20rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .ellipsis {
      max-width: 400rpx;
      white-space: nowrap;
      /* 保持文本在一行，不换行 */
      overflow: hidden;
      /* 超出容器部分隐藏 */
      text-overflow: ellipsis;
      /* 超出部分显示为省略号 */
    }

    .swiper-wrap {
      margin: 0 auto;
    }

    .contact-btn {
      width: 60rpx;
      height: 60rpx;

      &::after {
        padding: 0;
        border: none;
      }
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
    }

    .new-notice {
      width: 40rpx;
      height: 40rpx;
      background: linear-gradient(133deg, #D791FF 0%, #6E39FF 100%), #FF2E00;
      border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 24rpx;
      color: #FFFFFF;
      // position: absolute;
      // top: -14rpx;
      // left: -14rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8rpx;
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
    margin: 24rpx auto;

    swiper {
      width: 686rpx;
      height: 212rpx;
      margin: 0 auto;
    }

    .swiper-item {
      width: 686rpx;
      height: 190rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
    }
  }

  .audio-box {
    width: 686rpx;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    margin: 0 auto;
    margin-bottom: 20rpx;
    overflow: hidden;
  }

  .index-audio {
    width: 686rpx;
    height: 158rpx;
    background: #FFFFFF;
    // box-shadow: 0rpx 8rpx 8rpx 0rpx rgba(0, 0, 0, 0.06);
    // border: 2rpx solid rgba(105, 70, 255, 1);
    /* border-image: linear-gradient(90deg, rgba(105, 70, 255, 1), rgba(156, 60, 255, 1)) 2 2; */
    padding: 24rpx;
    padding-left: 132rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // margin: 0 auto;
    position: relative;

    .audio-img {
      width: 100rpx;
      height: 124rpx;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      position: absolute;
      left: 16rpx;
      bottom: 16rpx;
    }

    .audio-left {
      width: 460rpx;
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
      flex-shrink: 0;
    }

    .audio-status {
      height: 32rpx;
      width: 32rpx;
      margin-left: 20rpx;
      flex-shrink: 0;
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

    .course-nums-wrap {
      width: 100%;
      margin-top: 48rpx;
      height: 58rpx;
    }

    .course-nums {
      display: flex;
      height: 58rpx;
    }

    .course-nums-item {
      width: 160rpx;
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
      flex-shrink: 0;

      &-active {
        background-color: #7644FF;
        color: #fff;
      }
    }

  }
</style>