<template>
  <view v-if="type != 'hao'">
    <view class="course-item relative" :class="{ 'show-line': showLine }" @click="toDetail">
      <image v-if="showClose" src="/static/common/delete2.png" mode="aspectFill" class="icon-close"
        @click.stop="uncollect"></image>
      <image :src="getImg(item.thumb_image)" class="course-cover" mode="aspectFill"></image>
      <view class="flex-sub course-item-right">
        <view class="course-title line-1">{{ item.name }}</view>
        <view class="course-des line-1">{{ item.description }}</view>
        <view class="flex align-center course-teacher-wrap relative" v-if="!isBook">
          <image :src="teacher.thumb_image" class="teacher-ava" mode="aspectFill"></image>
          <view class="teacher-txt" style="margin-right: 16rpx">讲师</view>
          <view class="teacher-txt">{{ teacher.name }}</view>
          <image src="https://jzxt.qifudaren.net/static/audio/btn-play.png" class="icon-pay" mode="aspectFill"></image>
        </view>
        <view class="flex align-center justify-between course-info-wrap">
          <view class="flex align-center">
            <template v-if="isBook">
              <view class="courss-item-time" style="padding: 2rpx">{{ item.tags }}</view>
            </template>
            <template v-else>
              <view class="text-price text-red" v-if="item.is_charge !== 0">{{ item.salesprice }}</view>
              <view class="text-red flex align-center" v-else>
                <view class="text-price f-price" style="margin-right: 10rpx; text-decoration: line-through;">
                  {{ item.salesprice }}
                </view>
                免费
              </view>
              <image :src="`https://jzxt.qifudaren.net/static/index/course-tag-${isCharge[item.is_charge]}.png`"
                class="course-tag" mode=""></image>
            </template>
          </view>
          <view class="flex align-center">
            <image src="https://jzxt.qifudaren.net/static/index/icon-watch.png" class="study-icon" mode="aspectFill">
            </image>
            <view class="study-des">{{ item.play_count }}人学过</view>
          </view>
        </view>
        <!--        <view class="flex align-center justify-between course-info-wrap" v-else>
          <view class="flex align-center">
            <image src="https://jzxt.qifudaren.net/static/index/icon-watch.png" class="study-icon" mode="aspectFill">
            </image>
            <view class="study-des">{{ item.play_count }}人学过</view>
          </view>
        </view> -->
      </view>
    </view>
  </view>

  <view v-else>
    <view class="course-item relative" :class="{ 'show-line': showLine }" @click="$emit('detail')">
      <image v-if="showClose" src="/static/common/close.png" mode="aspectFill" class="icon-close"
        @click.stop="uncollect"></image>
      <image :src="getImg(item.thumb_image)" class="course-cover" mode="aspectFill"></image>
      <view class="flex-sub course-item-right">
        <view class="course-title line-1">{{ item.name }}</view>
        <view class="course-des line-1">{{ item.description }}</view>
        <view class="flex align-center course-teacher-wrap relative">
          <image :src="item.teacher.thumb_image" class="teacher-ava" mode="aspectFill"></image>
          <view class="teacher-txt">讲师</view>
          <view class="teacher-txt">{{ item.teacher.name }}</view>
          <!-- <image src="https://jzxt.qifudaren.net/static/audio/btn-play.png" class="icon-pay" mode="aspectFill"></image> -->
        </view>
        <view class="course-info-wrap book-mt">
          <view class="flex align-center">
            <!-- <template v-if="isBook">
              <view class="courss-item-time" style="padding: 2rpx">{{ item.tags }}</view>
            </template> -->
            <template>
              <view class="text-price text-red" v-if="item.is_charge !== 0">{{ item.salesprice || item.favorite_num }}
              </view>
              <view class="text-red" v-else>免费</view>
              <image :src="`https://jzxt.qifudaren.net/static/index/course-tag-${isCharge[item.is_charge]}.png`"
                class="course-tag" mode=""></image>
            </template>
          </view>
          <view class="view-line">
            <view class="flex align-center" v-if="isBook && type == 'hao'">
              <image src="https://jzxt.qifudaren.net/static/index/icon-watch.png" class="study-icon" mode="aspectFill">
              </image>
              <view class="study-des">{{ item.view_num?item.view_num:item.play_count }}人学过</view>
            </view>
            <view class="flex align-center" v-else>
              <image src="https://jzxt.qifudaren.net/static/index/icon-watch.png" class="study-icon" mode="aspectFill">
              </image>
              <view class="study-des">{{ item.play_count }}人学过</view>
            </view>
          </view>
        </view>
        <!--        <view class="flex align-center justify-between course-info-wrap" v-else>
          <view class="flex align-center">
            <image src="https://jzxt.qifudaren.net/static/index/icon-watch.png" class="study-icon" mode="aspectFill">
            </image>
            <view class="study-des">{{ item.play_count }}人学过</view>
          </view>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script>
  import {
    IMG_BASE_URL
  } from '../config/env';
  export default {
    name: 'CourseItem',
    data() {
      return {
        isCharge: {
          0: 0,
          1: 1,
          2: 0,
          3: 2
        }
      };
    },
    props: {
      item: {},
      isBook: {},
      isCollect: {},
      teacher: {},
      type: '',
      showClose: Boolean,
      showLine: Boolean
    },
    methods: {
      toDetail() {
        const {
          type,
          id
        } = this.item
        if (type === 1) {
          uni.navigateTo({
            url: `/pages/courseDetail/courseDetail?course_id=${id}`
          })
        } else {
          uni.navigateTo({
            url: `/pages/audioDetail/audioDetail?course_id=${id}`
          })
        }
      },
      getImg(url) {
        if (/^http/.test(url)) {
          return url;
        } else {
          return IMG_BASE_URL + url;
        }
      },
      toUrl(url) {
        if (!url) return;
        uni.navigateTo({
          url: url
        });
      },
      uncollect() {
        this.$emit('uncollect', this.item.id);
      }
    }
  };
</script>

<style lang="scss">
  .course-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    position: relative;

    // &:last-child::after{
    //   display: none;
    // }
    .icon-close {
      width: 42rpx;
      height: 42rpx;
      position: absolute;
      right: 10rpx;
      top: 10rpx;
    }

    .course-cover {
      width: 160rpx;
      max-width: 180rpx;
      height: 192rpx;
      margin-right: 16rpx;
      border-radius: 12rpx;
    }

    .course-item-right {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 192rpx;
      width: calc(100% - 218rpx);
    }

    .courss-item-time {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
    }

    .teacher-ava {
      height: 32rpx;
      width: 32rpx;
      border-radius: 50%;
      margin-right: 8rpx;
    }

    .course-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 30rpx;
      color: #000000;
      line-height: 33rpx;
    }

    .course-des {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      color: #535459;
      margin-top: 12rpx;
      line-height: 28rpx;
    }

    .course-teacher-wrap {
      margin-top: 12rpx;

      .teacher-txt {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #000000;
        line-height: 28rpx;
        text-align: left;
        font-style: normal;
      }

      .icon-pay {
        position: absolute;
        right: 20rpx;
        width: 48rpx;
        height: 48rpx;
      }
    }

    .study-icon {
      height: 24rpx;
      width: 24rpx;
      margin-right: 8rpx;
    }

    .course-info-wrap {
      margin-top: 28rpx;
    }

    .book-mt {
      margin-top: 14rpx;
    }

    .view-line {
      margin-top: 8rpx;
    }

    .course-tag {
      height: 32rpx;
      width: 128rpx;
      margin-left: 8rpx;
    }

    .study-des {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 20rpx;
      color: #999999;
    }
  }

  .show-line {
    position: relative;

    &::after {
      position: absolute;
      content: '';
      width: 100%;
      left: 0;
      bottom: 0;
      height: 1px;
      background-color: #e2e2e2;
      transform: scaleY(0.5);
    }
  }
</style>