<template>
  <view class="page-user-collect">
    <view class="col-nav flex justify-center align-center">
      <view class="wrap flex justify-center align-center">
        <view v-for="item in colTab" :key="item.type" @click="changeTab(item.type)"
          class="nav-item flex justify-center align-center" :class="{'active-tab': selected == item.type}">
          {{item.name}}
        </view>
      </view>
    </view>
    <scroll-view class="scroll-view" scroll-y="true">
      <template v-if="selected == 'course'">
        <!-- <course-item :is-collect="true" v-for="item in courseList" :key="item.id" :item="item.course_file" show-close
          @uncollect="handleCollect"></course-item> -->
        <view class="course-item relative" v-for="item in courseList" :key="item.id" @click="toCourseDetail(item)">
          <image src="/static/common/delete2.png" mode="aspectFill" class="icon-close"
            @click.stop="handleCollect(item.course_file)">
          </image>
          <image :src="item.course_file.poster_image" class="course-cover" mode="aspectFill"></image>
          <view class="flex-sub course-item-right">
            <view class="course-title line-1">{{item.course_file.name}}</view>
            <view class="course-des line-1">{{ item.course_file.type_text }}</view>
            <!-- <view class="course-des line-1">{{ item.course_file.description }}</view> -->
            <!-- <view class="flex align-center course-teacher-wrap relative">
              <image :src="item.teacher.thumb_image" class="teacher-ava" mode="aspectFill"></image>
              <view class="teacher-txt">讲师</view>
              <view class="teacher-txt">{{ item.teacher.name }}</view>
              <image src="https://jzxt.qifudaren.net/static/audio/btn-play.png" class="icon-pay" mode="aspectFill"></image>
            </view> -->
            <!-- <view class="course-info-wrap book-mt">
              <view class="flex align-center">
                <template>
                  <view class="text-price text-red" v-if="item.is_charge !== 0">
                    {{ item.salesprice || item.favorite_num }}
                  </view>
                  <view class="text-red" v-else>免费</view>
                  <image :src="`https://jzxt.qifudaren.net/static/index/course-tag-${isCharge[item.is_charge]}.png`"
                    class="course-tag" mode=""></image>
                </template>
              </view>
              <view class="view-line">
                <view class="flex align-center" v-if="isBook && type == 'hao'">
                  <image src="https://jzxt.qifudaren.net/static/index/icon-watch.png" class="study-icon"
                    mode="aspectFill">
                  </image>
                  <view class="study-des">{{ item.view_num }}人学过</view>
                </view>
                <view class="flex align-center" v-else>
                  <image src="https://jzxt.qifudaren.net/static/index/icon-watch.png" class="study-icon"
                    mode="aspectFill">
                  </image>
                  <view class="study-des">{{ item.play_count }}人学过</view>
                </view>
              </view>
            </view> -->
          </view>
        </view>
        <empty-hold v-if="courseList.length == 0"></empty-hold>
      </template>
      <template v-else>
        <goods-item :is-collect="true" v-for="item in goodsList" :key="item.id" :goods="item.goods" show-close
          @uncollect="goodsUnCollect(item.goods_id)" @detail="toDetail(item.goods_id)"></goods-item>
        <empty-hold v-if="goodsList.length == 0"></empty-hold>
      </template>
    </scroll-view>
  </view>
</template>

<script>
  import CourseItem from "@/components/CourseItem.vue"
  import GoodsItem from "@/components/GoodsItem.vue"
  export default {
    data() {
      return {
        courseList: [],
        goodsList: [],
        page: 1,
        pageSize: 10,
        pageMax: false,
        selected: 'course',
        colTab: [{
            name: '课程',
            type: 'course'
          },
          {
            name: '商品',
            type: 'goods'
          },
        ]
      };
    },
    components: {
      CourseItem,
      GoodsItem
    },
    onLoad() {
      this.getCourse()
    },
    onReachBottom() {
      if (!this.pageMax) {
        this.getCourse()
      }
    },
    methods: {
      toCourseDetail(info) {
        let url = '/pages/courseDetail/courseDetail'
        if (info.course_file.type === 2) {
          url = '/pages/audioDetail/audioDetail'
        }
        uni.navigateTo({
          url: `${url}?course_id=${info.course_file.course_id}&chapter_id=${info.collection_id}`
        })
      },
      toDetail(id) {
        uni.navigateTo({
          url: '/pages/goodsDetail/goodsDetail?goodsId=' + id
        })
      },
      handleCollect(course) {
        uni.showModal({
          title: '提示',
          content: '确定取消收藏吗？',
          success: (res) => {
            if (res.confirm) {
              this.$Api.postChapterCollect({
                course_id: course.course_id,
                course_file_id: course.id
              }).then(res => {
                this.page = 1
                this.pageMax = false
                this.courseList = []
                this.getCourse()
              })
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        })
      },
      goodsUnCollect(id) {
        uni.showModal({
          title: '提示',
          content: '确定取消收藏吗？',
          success: (res) => {
            if (res.confirm) {
              this.toCollect(id).then(() => {
                this.page = 1
                this.pageMax = false
                this.goodsList = []
                this.getFavGoods()
              })
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        })
      },
      async toCollect(gid) {
        let res = await this.$Api.postFavorite({
          goods_id: gid
        })
        uni.showToast({
          title: res.msg,
          icon: 'none'
        })
      },
      async getCourse() {
        try {
          const {
            data
          } = await this.$Api.getChapterCollect()
          if (data?.data?.length < this.pageSize) {
            this.pageMax = true
          }
          this.courseList = this.courseList.concat(data.data)
          this.page++

        } catch (e) {
          //TODO handle the exception
        }
      },

      async getFavGoods() {
        try {
          const {
            data
          } = await this.$Api.getGoodsFavs({
            type: 'favorite',
            page: this.page,
            list_rows: this.pageSize
          })
          if (data?.data?.length < this.pageSize) {
            this.pageMax = true
          }
          this.goodsList = this.goodsList.concat(data.data)
          this.page++

        } catch (e) {
          //TODO handle the exception
        }
      },
      changeTab(type) {
        this.selected = type
        this.page = 1
        this.pageMax = false
        switch (type) {
          case 'course':
            this.courseList = []
            this.getCourse()
            break;
          case 'goods':
            this.goodsList = []
            this.getFavGoods()
            break;
        }
      }
    }
  }
</script>

<style lang="scss">
  .page-user-collect {
    padding: 0 32rpx;
    background: #F8F8F8;
    min-height: 100vh;

    .col-nav {
      width: 100%;
      height: 84rpx;
      position: fixed;
      top: 0;
      left: 0;

      .wrap {
        width: 320rpx;
        height: 64rpx;
        border-radius: 32rpx;
        background-color: #FFFFFF;
        overflow: hidden;

        .nav-item {
          width: 160rpx;
          height: 64rpx;
        }

        .active-tab {
          background-color: #7644FF;
          color: #ffffff;
        }
      }
    }

    .scroll-view {
      width: 100%;
      height: calc(100vh - 84rpx);
      padding-top: 94rpx;

      .course-item {
        display: flex;
        align-items: center;
        padding: 24rpx;
        position: relative;
        background-color: #ffffff;
        border-radius: 12rpx;

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

          .course-title {
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            font-size: 30rpx;
            color: #000000;
            line-height: 33rpx;
          }

          .teacher-ava {
            height: 32rpx;
            width: 32rpx;
            border-radius: 50%;
            margin-right: 8rpx;
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
      }
    }
  }
</style>