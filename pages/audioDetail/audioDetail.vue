<template>
  <view class="page-audio-detail page-wrap" :style="{paddingTop: barHeight + 'px'}">
    <view class="page-main-content">
      <view class="page-custom-top-nav">
        <image src="https://jzxt.qifudaren.net/static/common/back.png" class="back-img" mode="" @click="back">
        </image>
        <view class="vip-nav">
          <view class="vip-nav-item " :class="{'vip-nav-item-active': tabNav === 1}" @click="changeNav(1)">音频
          </view>
          <view class="vip-nav-item" :class="{'vip-nav-item-active': tabNav === 2}" @click="changeNav(2)">文稿
          </view>
        </view>
        <!-- #ifdef MP -->
        <button class="share-btn flex justify-center align-center" open-type="share">
          <image src="https://jzxt.qifudaren.net/static/audio/icon-share.png" class="icon-52 icon-share-mp"
            mode="aspectFill">
          </image>
        </button>
        <!-- #endif -->
        <!-- #ifndef MP -->
        <image src="https://jzxt.qifudaren.net/static/audio/icon-share.png" class="icon-52 icon-share" mode="aspectFill"
          @click="handleShare">
        </image>
        <!-- #endif -->
      </view>
      <template v-if="tabNav === 2">
        <view class="page-text-wrap">
          <view class="audio-text-title">{{courseInfo.name}}</view>
          <view class="audio-detail-teacher">
            <image :src="courseInfo.teacher.thumb_image" class="teacher-ava" mode="aspectFill">
            </image>
            <view>讲师：{{courseInfo.teacher.name}}</view>
          </view>
          <view class="audio-text-content">
            {{this.courseList[this.playIndex].text_show}}
          </view>
        </view>
      </template>
      <template v-if="tabNav === 1">

        <image :src="posterImg" class="audio-detail-cover" mode="aspectFill">
        </image>
        <view class="audio-detail-title line-2">{{audioTitle}}</view>
        <view class="audio-detail-teacher">
          <image :src="courseInfo.teacher.thumb_image" class="teacher-ava" mode="aspectFill"></image>
          <view>讲师：{{courseInfo.teacher.name}}</view>
        </view>
        <view class="audio-handle-wrap">

          <view class="audio-detail-handler-top audio-detail-handler-wrap flex align-center justify-between">
            <view class="audio-handle-item" @click="showTiming = true">
              <image src="https://jzxt.qifudaren.net/static/audio/icon-time.png" class="icon-48" mode="">
              </image>
              {{formatRemainTime}}
            </view>

            <view class="flex align-center">
              <view class="audio-handle-item" @click="toGoods">
                <image src="https://jzxt.qifudaren.net/static/course/icon-recommend.png" class="icon-48"
                  mode="aspectFill"></image>
                <view>推荐产品</view>
              </view>
              <view class="audio-handle-item" @click="toShowWx">
                <image src="https://jzxt.qifudaren.net/static/audio/icon-audio-wx.png" class="icon-48"
                  mode="aspectFill">
                </image>
                <view>联系助教</view>
              </view>
              <view class="audio-handle-item" @click="toCollect">
                <image v-if="chapterCollected" src="/static/common/like-fill.png" class="icon-48" mode="aspectFill">
                </image>
                <image v-else src="https://jzxt.qifudaren.net/static/audio/like.png" class="icon-48" mode="aspectFill">
                </image>
                <view>收藏</view>
              </view>
              <view class="audio-handle-item" @click="showReward = true">
                <image src="https://jzxt.qifudaren.net/static/audio/reward.png" class="icon-48" mode="">
                </image>
                <view>打赏</view>
              </view>
            </view>
          </view>


          <view class="audio-progress-wrap">
            <DrapProgress min="0" :max="100" :mainValue="playPercent" ref="progress" @change="progressChange" />
            <!-- <view class="audio-progress"></view> -->
            <view class="audio-progrees-numbers flex align-center justify-between">
              <view class="audio-cur-time">{{formatTime(audioCurrentTime)}}</view>
              <view class="audio-end-time">{{formatTime(audioDuration)}}</view>
            </view>
          </view>


          <view class="audio-detail-handler-mid audio-detail-handler-wrap flex align-center justify-between">
            <view class="audio-handle-item" @click="changePlayType">
              <image :src="playType[typeIndex]['icon']" class="icon-48" mode="aspectFill">
              </image>
              {{playType[typeIndex]['name']}}
            </view>
            <view class="audio-play-wrap flex align-center justify-between">
              <image src="https://jzxt.qifudaren.net/static/audio/icon-pre.png" class="icon-48"
                @click="handleNext('prev')" mode="aspectFill">
              </image>
              <image src="https://jzxt.qifudaren.net/static/audio/btn-pause.png" @click="toPause" v-if="audioPlaying"
                class="icon-play-btn" mode="aspectFill"></image>
              <image src="https://jzxt.qifudaren.net/static/audio/btn-play.png" @click="toPlay" v-else
                class="icon-play-btn" mode="aspectFill"></image>
              <image src="https://jzxt.qifudaren.net/static/audio/icon-next.png" class="icon-48"
                @click="handleNext('next')" mode="aspectFill">
              </image>
            </view>
            <view class="audio-handle-item" @click="showAudioList = true">
              <image src="https://jzxt.qifudaren.net/static/audio/icon-list.png" class="icon-48" mode="aspectFill">
              </image>
              列表
            </view>
          </view>

          <view class="audio-detail-handler-bottom audio-detail-handler-wrap flex align-center justify-between">
            <view class="audio-handle-item" @click="showSpeed = true">
              <image src="https://jzxt.qifudaren.net/static/audio/icon-speed-1.png" class="icon-48" mode="">
              </image>
              {{curSpeed}}X
            </view>
            <view class="audio-handle-item" @click="toSeek('back')">
              <image src="https://jzxt.qifudaren.net/static/audio/icon-low.png" class="icon-48" mode="">
              </image>
              快退
            </view>
            <view class="audio-handle-item" @click="toSeek('front')">
              <image src="https://jzxt.qifudaren.net/static/audio/icon-fast.png" class="icon-48" mode="">
              </image>
              快进
            </view>
            <view class="audio-handle-item" @click="showComment = true">
              <image src="https://jzxt.qifudaren.net/static/audio/icon-comment.png" class="icon-48" mode="">
              </image>
              评论
            </view>
          </view>
        </view>
      </template>
    </view>
    <u-popup :show="showReward" mode="bottom" round="16" @close="close" @open="open">
      <view class="reward-pop-wrap">
        <view class="reward-pop-title">请选择打赏的金额</view>
        <view class="flex price-tag-wrap">
          <view class="price-tag" @click="selectPrice(item.price)"
            :class="{'price-tag-active': choicedAmount === item.price}" v-for="item in priceList" :key="item.price">
            {{item.price}}元
          </view>
        </view>
        <view class="reward-pop-title">其他金额</view>
        <input type="text" :value="curPrice" placeholder="请输入其他金额" class="reward-input" @change="handleAmount">
        <view class="cu-btn block round pay-reward-btn" @click="toReward">确认支付</view>
      </view>
    </u-popup>
    <u-popup :show="showSpeed" mode="bottom" closeable round="16" @close="close" @open="open">
      <view class="reward-pop-wrap">
        <view class="reward-pop-title speed-pop-title">倍数播放</view>
        <view class="speed-list">
          <view class="speed-item flex align-center justify-between" @click="changeSpeed(item)"
            v-for="item in speedList" :key="item.speed">
            <view>{{item.speed}}倍</view>
            <image src="https://jzxt.qifudaren.net/static/audio/speed-has.png" v-if="item.speed == curSpeed"
              class="icon-36" mode="aspectFill"></image>
            <!-- <view class="speed-no-wrap" @click="changeSpeed(item)" v-else></view> -->
          </view>
        </view>
      </view>
    </u-popup>

    <u-popup :show="showTiming" mode="bottom" closeable round="16" @close="close" @open="open">
      <view class="reward-pop-wrap">
        <view class="reward-pop-title speed-pop-title">定时关闭</view>
        <view class="speed-list">
          <view class="speed-item flex align-center justify-between" @click="changeTime(0)">
            <view>不开启</view>
            <image src="https://jzxt.qifudaren.net/static/audio/speed-has.png" v-if="curTime === 0" class="icon-36"
              mode=""></image>
            <!-- <view class="speed-no-wrap" @click="changeTime({})" v-else></view> -->
          </view>
          <view class="speed-item flex align-center justify-between" @click="changeTime(item)" v-for="item in timeList"
            :key="item.time">
            <view>{{item.time}}分钟</view>
            <image src="https://jzxt.qifudaren.net/static/audio/speed-has.png" v-if="item.time == curTime"
              class="icon-36" mode=""></image>
            <!-- <view class="speed-no-wrap" @click="changeTime(item)" v-else></view> -->
          </view>
          <view class="speed-item flex align-center justify-between" @click="showCustomTiming = true">
            <view>自定义 <span class="text-gray text-sm margin-left-8">{{customTimeStr}}</span>
            </view>
            <image src="https://jzxt.qifudaren.net/static/audio/speed-has.png" v-if="isCustom" class="icon-36" mode="">
            </image>
            <!-- <view class="speed-no-wrap" @click="showCustomTiming = true" v-else></view> -->
          </view>
        </view>
      </view>
      <u-overlay :show="showCustomTiming" zIndex="10076" @click="showCustomTiming = false"></u-overlay>
    </u-popup>
    <u-picker :show="showCustomTiming" ref="uPicker" confirmColor="#7644FF" @cancel="showCustomTiming = false"
      :columns="columns" @confirm="confirm" @change="changeHandler">
    </u-picker>
    <u-popup :show="showAudioList" mode="bottom" closeable round="16" @close="close" @open="open">
      <view class="reward-pop-wrap audio-list-pop-wrap bg-gray">
        <view class="audio-list-icons" style="width:450rpx;">
          <!-- <view class="audio-icon-wrap">
            <image src="https://jzxt.qifudaren.net/static/audio/icon-audio-refresh.png" class="icon-36" mode="">
            </image>
          </view> -->
          <view class="audio-icon-wrap" style="display: flex;">
            <image src="https://jzxt.qifudaren.net/static/audio/icon-audio-sort.png" class="icon-36" mode=""
              @click="courseList.reverse()">
            </image>
          </view>
          <view class="search">
            <input type="text" placeholder="请输入关键词" v-model="courseName" style="background: #fff;height:60rpx;border-radius:12rpx;width:250rpx;padding-left:10rpx;
			margin-right: 10rpx;">
            <text style="width:100rpx" @click="getClassZj()">搜索</text>
          </view>
        </view>

        <scroll-view scroll-y class="audio-list-wrap">
          <view class="audio-list-item bg-white flex justify-between align-center" v-for="(item, index) in courseList"
            :key="item.id" @click="selectCourse(index)">
            <view class="flex">
              <image :src="item.thumb_image || item.poster_image" class="audio-list-cover" mode="aspectFill">
                <view class="flex-sub margin-right">
                  <view class="audio-item-title line-2">{{item.name}}</view>
                  <!-- <view class="margin-top-8 audio-item-refresh">
                    {{item.type_text}}
                  </view> -->
                </view>
            </view>
            <image src="https://jzxt.qifudaren.net/static/course/icon-course-playing.png" v-if="index == playIndex"
              class="icon-48" mode=""></image>
            <image src="https://jzxt.qifudaren.net/static/course/icon-course-play.png" v-else class="icon-48" mode="">
            </image>
          </view>
        </scroll-view>
      </view>
    </u-popup>
    <u-popup :show="showQrcode" mode="center" closeable round="16" @close="close" @open="open">
      <view class="concat-wx-wrap">
        <view class="concat-wx-title">联系助教</view>
        <view class="qr-code-wrap">
          <image :src="qrcode" class="qr-code-img" mode="aspectFill"></image>
        </view>
      </view>
    </u-popup>
    <u-popup :show="showComment" mode="bottom" closeable round="16" @close="close" @open="open">
      <view class="reward-pop-wrap">
        <view class="reward-pop-title speed-pop-title">评论</view>
        <scroll-view scroll-y class="comment-list-wrap" @scrolltolower="commentReachBottom">
          <view class="comment-list-item bg-white flex justify-between align-center" v-for="item in commentList"
            :key="item.id">
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
                        <image src="https://jzxt.qifudaren.net/static/course/icon-yishoucang.png" v-if="item.is_like"
                          class="icon-32 margin-right-8" mode="" />
                        <image v-else src="https://jzxt.qifudaren.net/static/course/icon-shoucang.png"
                          class="icon-32 margin-right-8" mode="aspectFill" />
                      </view>
                      <view style="line-height: 32rpx;">{{item.like_num}}</view>
                    </view>
                  </view>
                  <view class="block reply-content" v-if="item.reply && item.reply.length> 0">
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
        </scroll-view>
        <view class="flex align-center justify-between comment-handler-wrap">
          <input type="text" v-model="commentText" placeholder="请输入" class="comment-input" />
          <view class="cu-btn round btn-comment-send" @click="addComment">发送</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
  import store from '@/store';
  import {
    mapState
  } from 'vuex'
  import {
    IMG_BASE_URL
  } from '../../config/env';
  import {
    pay
  } from '../../utils/pay';
  import DrapProgress from '@/components/DrapProgress.vue'
  import {
    playAudio
  } from '../../utils/audio';
  import UniShare from 'uni_modules/uni-share/js_sdk/uni-share.js';
  const uniShare = new UniShare();
  const SEEK_STEP = 15
  export default {
    data() {
      return {
        audioInstance: null,
        tabNav: 1,
        showReward: false,
        showSpeed: false,
        showTiming: false,
        showAudioList: false,
        showComment: false,
        showCustomTiming: false,
        custTime: [],
        curPrice: '',
        finalAmount: 0,
        choicedAmount: '',
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
        timeList: [{
          time: 10
        }, {
          time: 20
        }, {
          time: 30
        }, {
          time: 60
        }, {
          time: 90
        }],
        columns: [
          Array.from({
            length: 24
          }, (v, k) => k).map(el => el + '小时'),
          Array.from({
            length: 60
          }, (v, k) => k).map(el => el + '分钟')
        ],
        showQrcode: false,
        playType: [{
            name: '循环播放',
            type: 'round',
            icon: 'https://jzxt.qifudaren.net/static/audio/icon-xunhuan.png'
          },
          {
            name: '随机播放',
            type: 'random',
            icon: 'https://jzxt.qifudaren.net/static/audio/loop-random-white.png'
          },
          {
            name: '单曲循环',
            type: 'single',
            icon: 'https://jzxt.qifudaren.net/static/audio/loop-one-white.png'
          }
        ],
        barHeight: 44,
        courseName: "",
        courseId: '',
        courseInfo: {
          teacher: {
            name: ''
          }
        },
        courseList: [],
        commentList: [],
        cmt_page: 1,
        cmt_page_size: 10,
        cmt_page_max: false,
        commentText: '',
        qrcode: '',
        chapterId: ''
      };
    },
    components: {
      DrapProgress
    },
    async onLoad(options) {
      this.barHeight = uni.getStorageSync('barHeight')
      if (options.course_id) {
        this.courseId = options.course_id
        await this.getCourse()
      }

      if (options?.chapter_id) {
        this.chapterId = options.chapter_id
      }
      if (options?.chapter) {
        const course = JSON.parse(decodeURIComponent(options.chapter))
        this.courseList = [course]
        this.courseInfo = course
        this.courseName = course.name
        store.dispatch('setCourseList', this.courseList)
        this.setAudioStore(0)
      }

      if (this.courseId) {
        this.getClassZj();
      }
      this.getComments()
      this.audioInstance = uni.getBackgroundAudioManager()
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
    onUnload() {
      if (this.courseId) {
        this.postStudy(this.playIndex)
        store.commit('SET_LAST_PLAY_COURSE_ID', this.courseId)
      }
    },
    // #ifdef MP-WEIXIN
    onShareAppMessage() {
      // this.audioInstance.pause()
      // this.audioPlaying = false
      const course = this.courseList[this.playIndex]
      return {
        title: course.name,
        path: `/pages/audioDetail/audioDetail?course_id=${this.courseId}&chapter_id=${course.id}`,
        imageUrl: course.poster_image
      }
    },
    onShareTimeline() {
      const course = this.courseList[this.playIndex]
      return {
        title: course.name,
        path: `/pages/audioDetail/audioDetail?course_id=${this.courseId}&chapter_id=${course.id}`,
        imageUrl: course.poster_image
      }
    },
    // #endif
    computed: {
      ...mapState(['audioList', 'playIndex', 'audioDuration', 'audioCurrentTime', 'playPercent', 'curSpeed',
        'curTime', 'isCustom', 'customTimeStr', 'typeIndex', 'audioCanplay', 'audioPlaying', 'study_time',
        'currentCourseId', 'remainTime'
      ]),
      posterImg() {
        const poster = this.courseList[this.playIndex]
        if (poster?.poster_image) {
          if (/^http/.test(poster.poster_image)) {
            return poster.poster_image;
          } else {
            return IMG_BASE_URL + poster.poster_image
          }
        }
        return poster?.thumb_image
      },
      audioTitle() {
        return this.courseList[this.playIndex]?.name ||
          this.courseInfo.name ||
          ''
      },
      formatRemainTime() {
        console.log(this.remainTime);
        if (this.remainTime > 0) {
          const minute = Math.floor(this.remainTime / 60)
          const second = Math.floor(this.remainTime % 60)
          return String(minute).padStart(2, '0') + ':' + String(second).padStart(2, '0')
        }
        return '定时'
      },
      chapterCollected() {
        return this.courseList[this.playIndex]?.collection_status == 0 ? false : true
      }
    },
    methods: {
      handleShare() {
        const _this = this
        const course = this.courseList[this.playIndex]
        const {
          poster_image,
          file,
          name
        } = course
        uniShare.show({
          content: {
            title: _this.courseInfo.name,
            summary: name,
            type: 3,
            summary: '',
            imageUrl: poster_image,
            mediaUrl: file
          },
          menus: [{
              "img": "https://jzxt.qifudaren.net/static/login/wx.png",
              "text": "微信好友",
              "share": { //当前项的分享参数配置。可覆盖公共的配置如下：分享到微信小程序，配置了type=5
                "provider": "weixin",
                "scene": "WXSceneSession"
              }
            },
            {
              "img": "/static/common/timeline.png",
              "text": "微信朋友圈",
              "share": {
                "provider": "weixin",
                "scene": "WXSceneTimeline"
              }
            },
            {
              "img": "/static/common/wxmini.png",
              "text": "微信小程序",
              "share": {
                provider: "weixin",
                scene: "WXSceneSession",
                type: 5,
                miniProgram: {
                  id: '123',
                  path: '/pages/audioDetail/audioDetail',
                  type: 1
                },
              }
            },
          ]
        })
      },
      async getCourse() {
        try {
          const res = await this.$Api.getCourceDetail({
            course_id: this.courseId
          })
          // const {
          //   course_file,
          // } = res.data

          // this.commentList = course_comment
          this.courseInfo = res.data
          // if (course_file?.length > 0) {

          // } else {
          //   uni.showToast({
          //     title: '暂无音频',
          //     icon: 'none'
          //   })
          // }

          // this.audioInstance.play()
          // this.audioPlaying = true
        } catch (e) {
          //TODO handle the exception
        }
      },

      getClassZj() {
        this.$Api.course_file_list({
          course_id: this.courseId,
          q: this.courseName
        }).then(res => {
          this.courseList = res.data.data
          store.dispatch('setCourseList', res.data.data)
          if (this.currentCourseId != this.courseId && this.courseList.length > 0) {
            let idx = 0
            if (this.chapterId) {
              idx = this.courseList.findIndex(item => item.id == this.chapterId)
              if (idx == -1) {
                idx = 0
              }
            }
            this.setAudioStore(idx)
          }
        })

      },
      setAudioStore(idx) {
        this.$store.commit('SET_CURRENT_COURSE_ID', this.courseId)
        this.$store.commit('SET_AUDIO_CURRENTTIME', 0)
        this.$store.commit('SET_AUDIO_DURATION', 0)
        this.$store.commit('SET_AUDIO_READY', false)
        this.$store.commit('SET_PLAY_STATE', false)
        this.$store.commit('SET_PLAY_INDEX', idx)
        this.$store.commit('SET_AUDIO_SPEED', 1)
        this.$store.commit('SET_AUDIO_TYPE_INDEX', 0)
        this.$store.commit('SET_STUDY_TIME', 0)
        this.$store.commit('SET_AUDIO_PERCENT', 0)
        playAudio()
      },
      async getComments() {
        try {
          const {
            data
          } = await this.$Api.getCourseComments({
            course_id: this.courseId,
            page: this.cmt_page,
            page_size: this.cmt_page_size
          })
          if (Array.isArray(data?.data)) {
            if (data.data.length < this.cmt_page_size) {
              this.cmt_page_max = true
            }
            this.commentList = [...this.commentList, ...data.data]
            this.cmt_page += 1
          }

        } catch (e) {
          //TODO handle the exception
        }
      },
      commentReachBottom() {
        if (this.cmt_page_max) return
        this.getComments()
      },
      async postStudy(idx) {
        const course = this.courseList[idx]
        if (!course) {
          return
        }
        await this.$Api.postStudyTime({
          course_id: course.course_id,
          course_file_id: course.id,
          type: 1,
          view_time: this.study_time / 1000
        }).catch(err => {
          console.error(err)
        })
      },
      addComment() {
        if (this.commentText == '') return
        this.$Api.addCourseComment({
          course_id: this.courseId,
          content: this.commentText
        }).then(res => {
          this.getCourse()
          this.commentText = ''
          uni.showToast({
            title: '评论成功',
            icon: 'none'
          })
        })
      },
      handleCommentZan(id) {
        this.$Api.courseCommentFav({
          comment_id: id
        }).then(res => {
          const idx = this.commentList.findIndex(item => item.id === id)
          const like_num = this.commentList[idx]['like_num'] + (this.commentList[idx]['is_like'] ? -1 : 1)
          this.$set(this.commentList, idx, {
            ...this.commentList[idx],
            is_like: !this.commentList[idx]['is_like'],
            like_num: like_num
          })
        })
      },
      handleNext(type) {
        if (!this.audioCanplay) {
          return uni.showToast({
            title: '音频未加载完成',
            icon: 'none'
          })
        }
        uni.showLoading({
          title: '加载中',
          mask: true
        })
        this.$store.dispatch('setPlayState', false)
        this.$store.dispatch('setAudioPercent', 0)
        this.$store.dispatch('setAudioReady', false)
        switch (type) {
          case 'prev':
            this.selectCourse(this.playIndex === 0 ? this.audioList.length - 1 : this.playIndex - 1)
            break;
          case 'next':
            this.selectCourse(this.playIndex === this.audioList.length - 1 ? 0 : this.playIndex + 1)
            break;
        }
      },
      changePlayType() {
        const typeIndex = this.typeIndex === this.playType.length - 1 ? 0 : this.typeIndex + 1
        this.$store.dispatch('setAudioTypeIndex', typeIndex)
        this.$store.dispatch('setPlayTypeStr', this.playType[typeIndex]['type'])
      },
      selectCourse(index) {
        console.log(index);
        if (index == this.playIndex) return
        // this.audioInstance.stop()
        this.$store.dispatch('setPlayIndex', index)
        this.$store.dispatch('setAudioCurrentTime', 0)
        playAudio()
        this.$store.dispatch('setPlayState', true)
        // this.audioInstance.src = this.audioList[index].file
        // this.audioInstance.title = this.audioList[index].name
        // this.audioInstance.coverImgUrl = this.audioList[index].poster_image
        // this.audioInstance.seek(0)
        // this.audioInstance.play()
        uni.hideLoading()
      },
      seekFront() {
        const current = this.audioCurrentTime
        if (current + SEEK_STEP > this.audioInstance.duration) {
          this.audioInstance.seek(this.audioInstance.duration)
          this.$store.dispatch('setAudioCurrentTime', this.audioInstance.duration)
          this.audioInstance.stop()
          return
        }
        this.audioInstance.seek(current + SEEK_STEP)
        this.$store.dispatch('setAudioCurrentTime', this.audioInstance.currentTime + SEEK_STEP)
      },
      seekBack() {
        const current = this.audioCurrentTime
        if (current - SEEK_STEP < 0) {
          this.audioInstance.seek(0)
          this.$store.dispatch('setAudioCurrentTime', 0)
          return
        }
        this.audioInstance.seek(current - SEEK_STEP)
        this.$store.dispatch('setAudioCurrentTime', this.audioInstance.currentTime - SEEK_STEP)
      },
      toSeek(type) {
        switch (type) {
          case 'front':
            this.seekFront()
            break;
          case 'back':
            this.seekBack()
            break;
        }
      },
      playAudio(item, index) {
        this.$store.dispatch('setPlayIndex', index)
        this.audioInstance.src = item.file
        this.audioInstance.title = item.name
        this.audioInstance.coverImgUrl = item.poster_image
        this.audioInstance.play()
      },
      pauseAudio() {
        this.audioInstance.pause()
      },
      formatTime(time) {
        const min = Math.floor(time / 60)
        const sec = Math.floor(time % 60)
        const hour = Math.floor(min / 60)
        const minStr = min % 60 < 10 ? '0' + min % 60 : min % 60
        const secStr = sec < 10 ? '0' + sec : sec
        const hourStr = hour < 10 ? '0' + hour : hour
        return hour > 0 ? `${hourStr}:${minStr}:${secStr}` : `${minStr}:${secStr}`
      },
      toCollect() {
        this.$Api.postChapterCollect({
          course_id: this.courseId,
          course_file_id: this.courseList[this.playIndex]?.id
        }).then(res => {
          const msg = res.data.collection_status ? '收藏成功' : '取消收藏'
          uni.showToast({
            icon: 'none',
            title: msg
          })
          this.courseList[this.playIndex].collection_status = res.data.collection_status
        })
      },
      toShowWx() {
        this.showQrcode = true
      },
      toGoods() {
        const goods = this.courseList[this.playIndex]?.goods ?? {}
        if (Object.keys(goods).length > 0) {
          uni.navigateTo({
            url: '/pages/goodsDetail/goodsDetail?goodsId=' + goods.id
          })
          return
        }
        uni.showToast({
          title: '暂无推荐商品',
          icon: 'none'
        })
      },
      changeHandler(e) {
        const {
          columnIndex,
          value,
          values, // values为当前变化列的数组内容
          index,
          // 微信小程序无法将picker实例传出来，只能通过ref操作
          picker = this.$refs.uPicker
        } = e
        // 当第一列值发生变化时，变化第二列(后一列)对应的选项
        // if (columnIndex === 0) {
        //     // picker为选择器this实例，变化第二列对应的选项
        //     picker.setColumnValues(1, this.columnData[index])
        // }
      },
      // 回调参数为包含columnIndex、value、values
      confirm(e) {
        console.log('confirm', e)
        const [hour, minut] = e.value
        const [ihour, iminut] = e.indexs
        const curTime = ihour * 60 + iminut
        this.$store.dispatch('setAudioTime', curTime)
        const customTimeStr = hour + minut
        this.$store.dispatch('setAudioCustomTime', customTimeStr)
        this.$store.dispatch('setAudioCustom', true)
        this.$store.dispatch('timeDown')
        this.showCustomTiming = false
        // if (this.curTime == 0) {
        //   if (this.timeout) {
        //     clearTimeout(this.timeout)
        //     this.timeout = null
        //   }
        // } else {
        //   if (this.timeout) {
        //     clearTimeout(this.timeout)
        //   }
        //   this.startTiming()
        // }
      },
      changeSpeed(item) {
        this.$store.dispatch('setAudioSpeed', item.speed)
        this.audioInstance.playbackRate = Number(item.speed)
        this.showSpeed = false;
      },
      changeTime(item) {
        console.log(item);
        this.$store.dispatch('setAudioTime', item.time)
        this.$store.dispatch('setAudioCustom', false)
        this.$store.dispatch('setAudioCustomTime', '')
        this.$store.dispatch('timeDown')
        this.showTiming = false;
        // if (item == 0) {
        //   if (this.timeout) {
        //     clearTimeout(this.timeout)
        //     this.timeout = null
        //   }
        // } else {
        //   if (this.timeout) {
        //     clearTimeout(this.timeout)
        //     this.startTiming()
        //   } else {
        //     this.startTiming()
        //   }
        // }
      },
      startTiming() {
        this.timeout = setTimeout(() => {
          const bgAudio = uni.getBackgroundAudioManager()
          bgAudio.stop()
        }, this.curTime * 60 * 1000)
      },

      selectPrice(amount) {
        this.choicedAmount = amount
        this.finalAmount = amount
        this.curPrice = ''
      },

      handleAmount(e) {
        this.finalAmount = e.detail.value
        this.choicedAmount = ''
      },
      async toReward() {
        await pay('reward', 'createRewardOrder', this.finalAmount, 'amount', '打赏')
        this.showReward = false
      },
      toPlay() {
        console.log(this.audioCanplay);
        if (this.audioCanplay) {
          this.$store.dispatch('setPlayState', true)
          this.audioInstance.play()
          return
        }
        uni.showToast({
          title: '音频无法播放！',
          icon: 'error'
        })
      },
      toPause() {
        this.$store.dispatch('setPlayState', false)
        this.audioInstance.pause()
      },
      toComment() {
        this.showComment = true
      },
      back() {
        uni.navigateBack({
          fail() {
            uni.switchTab({
              url: '/pages/index/index'
            })
          }
        })
      },
      changeNav(i) {
        this.tabNav = i
      },
      progressChange(e) {
        if (!this.audioCanplay) {
          return uni.showToast({
            title: '请等待音频加载完成！',
            icon: 'error'
          })
        }
        // TODO: 换算成时间
        console.log('progressChange', e)
        this.$store.dispatch('setAudioPercent', e)
        const time = this.audioDuration * e / 100
        this.audioInstance.seek(time)
        this.$store.dispatch('setAudioCurrentTime', time)
      },
      open() {
        // console.log('open');
      },
      close() {
        this.showReward = false
        this.showSpeed = false
        this.showTiming = false
        this.showAudioList = false
        this.showComment = false
        this.showQrcode = false
        // console.log('close');
      }
    }
  }
</script>

<style lang="scss">
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

      .reply-content {
        width: 590rpx;
        background: #F6F6F6;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        padding: 16rpx;
        margin-top: 24rpx;
      }

      .coruse-eve-recommend {
        width: 100%;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        margin-bottom: 24rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .eve-recommend-user {
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #999999;
        }
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
        font-size: 15px;
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

  .page-audio-detail {
    min-height: 100vh;
    color: #333;
    background-color: #555d76;
    padding-bottom: calc(500rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(500rpx + env(safe-area-inset-bottom));
    // background:url(https://jzxt.qifudaren.net/static/temp/shop-1.png) no-repeat center center fixed;
    // background-repeat: no-repeat;
    position: relative;

    // &:before{
    //   content: "";/* 必须包括 */
    //   position: absolute;/* 固定模糊层位置 */
    //   width:300%;
    //   height:300%;
    //   left: -100%;/* 回调模糊层位置 */
    //   top: -100%;/* 回调模糊层位置 */
    //   background:url(https://jzxt.qifudaren.net/static/temp/shop-1.png) no-repeat center center fixed;/* 与上面的bg中的background设置一样 */
    //   filter: blur(20px);/* 值越大越模糊 */
    //   z-index: -2;/* 模糊层在最下面 */
    // }
    // .page-main-content {
    //   z-index: 0;/* 为不影响内容显示必须为最高层 */
    //   position: relative;
    //   overflow: hidden;
    // }

    .page-text-wrap {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 32rpx 32rpx 32rpx 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #FFFFFF;
      padding: 48rpx;

      .audio-text-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 32rpx;
        color: #FFFFFF;
        text-align: center;
      }

      .audio-text-content {
        margin-top: 16rpx;
      }
    }

    .audio-progress-wrap {
      padding: 0 48rpx;
      margin-top: 44rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #FEFEFE;

      .audio-progress {
        width: 100%;
        height: 4rpx;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }

    .audio-handle-wrap {
      position: fixed;
      bottom: 0;
      width: 100%;
      left: 0;
      background-color: #555d76;
      z-index: 9;
      padding-top: 16rpx;
      padding-bottom: calc(16rpx + constant(safe-area-inset-bottom)) !important;
      padding-bottom: calc(16rpx + env(safe-area-inset-bottom)) !important;
    }

    .audio-detail-handler-wrap {

      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 20rpx;
      color: #FFFFFF;
      padding: 0 48rpx;

      &.audio-detail-handler-top {
        // margin-top: 118rpx;
      }

      &.audio-detail-handler-mid {
        margin-top: 40rpx;
        height: 120rpx;

        .audio-play-wrap {
          width: 382rpx;
          margin-right: 48rpx;
        }

        .icon-play-btn {
          height: 120rpx;
          width: 120rpx;
        }
      }

      &.audio-detail-handler-bottom {
        margin-top: 40rpx;

        .audio-handle-item {
          flex-direction: row;
        }

        .icon-48 {
          margin-bottom: 0;
          margin-right: 8rpx;
        }
      }

      .icon-48 {
        margin-bottom: 4rpx;
      }

      .audio-handle-item {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-right: 48rpx;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .audio-detail-teacher {
      max-width: 248rpx;
      height: 48rpx;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
      margin: 8rpx auto 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #FFFFFF;
      padding: 0 8rpx;

      .teacher-ava {
        height: 40rpx;
        width: 40rpx;
        border-radius: 20rpx;
        margin-right: 8rpx;
      }
    }

    .audio-detail-cover {
      width: 500rpx;
      height: 660rpx;
      box-shadow: 0rpx 8rpx 16rpx 0rpx rgba(0, 0, 0, 0.2);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin: 24rpx auto 0;
      display: block;
    }

    .audio-detail-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #FFFFFF;
      width: 622rpx;
      text-align: center;
      margin: 24rpx auto 0;
    }

    .share-btn {
      position: absolute;
      top: 94rpx;
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

    .icon-share {
      position: absolute;
      width: 52rpx;
      height: 52rpx;
      right: 32rpx;
    }

    .vip-nav {
      width: 224rpx;
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
  }

  .search {
    display: flex;
    align-items: center;
  }
</style>