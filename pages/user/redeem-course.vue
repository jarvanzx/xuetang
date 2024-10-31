<template>
  <view class="redeem">
    <!-- <view class="redeem-item flex align-center" v-for="item in courseList" :key="item.id">
      <image :src="item.course.thumb_image" class="course-img" mode="aspectFill"></image>
      <view class="course-right">
        <view class="title">{{item.course.name}}</view>
        <view class="btn" @click="redeemCourse(item)">兑换</view>
      </view>
    </view> -->
    <!-- <CourseItem v-for="item in courseList" :key="item.id" :item="item.course" :show-line="true" /> -->
    <view v-for="item in courseList" :key="item.id" class="course-item relative" :class="{ 'show-line': showLine }">
      <image :src="getImg(item.course.thumb_image)" class="course-cover" mode="aspectFill"></image>
      <view class="flex-sub course-item-right">
        <view class="course-title line-1">{{ item.course.name }}</view>
        <view class="course-des line-1">{{ item.course.description }}</view>
        <!-- <view class="flex align-center course-teacher-wrap relative">
          <image :src="teacher.thumb_image" class="teacher-ava" mode="aspectFill"></image>
          <view class="teacher-txt" style="margin-right: 16rpx">讲师</view>
          <view class="teacher-txt">{{ teacher.name }}</view>
          <image src="https://jzxt.qifudaren.net/static/audio/btn-play.png" class="icon-pay" mode="aspectFill"></image>
        </view> -->
        <view class="flex align-center" style="margin-top: 16rpx;">
          <image src="https://jzxt.qifudaren.net/static/index/icon-watch.png" class="study-icon" mode="aspectFill">
          </image>
          <view class="study-des">{{ item.course.play_count }}人学过</view>
        </view>
        <view class="flex align-center justify-between course-info-wrap">
          <view class="flex align-center">
            <template>
              <view class="text-price text-red" v-if="item.course.is_charge !== 0">{{ item.course.salesprice }}</view>
              <view class="text-red flex align-center" v-else>
                <view class="f-price" style="margin-right: 10rpx; text-decoration: line-through;">
                  {{ item.course.salesprice }}
                </view>
                免费
              </view>
              <image :src="`https://jzxt.qifudaren.net/static/index/course-tag-${isCharge[item.course.is_charge]}.png`"
                class="course-tag" mode="aspectFill"></image>
            </template>
          </view>
          <view class="btn" @click="redeemCourse(item)">兑换</view>
        </view>
      </view>
    </view>
    <empty-hold v-if="courseList.length == 0"></empty-hold>
  </view>
</template>

<script>
  import CourseItem from '@/components/CourseItem.vue'
  export default {
    components: {
      CourseItem
    },
    data() {
      return {
        courseList: [],
        code: '',
        showLine: true
      };
    },
    onLoad(query) {
      this.code = query.code
      this.getCourses()
    },
    methods: {
      getImg(url) {
        if (/^http/.test(url)) {
          return url;
        } else {
          return IMG_BASE_URL + url;
        }
      },
      async getCourses() {
        const {
          data
        } = await this.$Api.getCourseByCode({
          course_code: this.code
        })
		
		console.log("data",data);
        if (data.length > 0) {
          this.courseList = data
          return
        }
        // uni.showToast({
        //   title: '该兑换码无效',
        // })
      },
      redeemCourse(course) {
        uni.showModal({
          title: '提示',
          content: '确定兑换该课程吗？',
          success: async (res) => {
            if (res.confirm) {
              const {
                code,
                msg
              } = await this.$Api.postCodeToCourse({
                course_code: course.code,
                course_code_id: course.id
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
            } else {
              uni.showToast({
                title: '取消兑换',
                icon: 'none',
              })
            }
          },
          fail() {
            uni.showToast({
              title: '兑换失败',
              icon: 'none',
            })
          }
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  page {
    background-color: #f7f7f7;
  }

  .redeem {
    width: 750rpx;
    min-height: 100vh;
    padding: 30rpx;
    background-color: #FFFFFF;

    .redeem-item {
      background: #FFFFFF;
      border-radius: 12rpx;
      padding: 24rpx;
      margin-bottom: 30rpx;

      .course-img {
        width: 160rpx;
        height: 192rpx;
        border-radius: 12rpx;
        flex-shrink: 0;
        margin-right: 16rpx;
      }

      .course-right {
        height: 192rpx;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .title {
          font-size: 30rpx;
          font-weight: bold;
          color: #333333;
        }

        .btn {
          width: 160rpx;
          height: 60rpx;
          line-height: 60rpx;
          text-align: center;
          background: #7644FF;
          border-radius: 30rpx;
          color: #fff;
          font-size: 28rpx;
        }
      }
    }
  }

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
      line-height: 36rpx;
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
      margin-top: 18rpx;
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

  .btn {
    width: 140rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    background: #7644FF;
    border-radius: 30rpx;
    color: #fff;
    font-size: 28rpx;
  }
</style>