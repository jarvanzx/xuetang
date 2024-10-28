<template>
  <view class="page-famous-teacher">
    <view class="famous-teacher-list">
      <view class="famous-teacher-item" @click="changeTeacher(index)"
        :class="{'famous-teacher-item-active': index === curIndex}" v-for="(item, index) in teacherList" :key="item.id">
        <image :src="item.thumb_image" class="famous-teacher-cover" mode="aspectFill">
        </image>
        <view>{{item.name}}</view>
      </view>
    </view>
    <view class="famous-teacher-card">
      <view class="famous-teacher-name">{{currentTeacher.name}}</view>
      <view class="flex align-center">
        <view class="teacher-tag" v-for="item in currentTeacher.ttags" :key="item">{{item}}</view>
      </view>
      <view class="teacher-des">{{currentTeacher.description}}</view>
      <view class="famous-teacher-course">
        <CourseItem v-for="item in courseList" :teacher="item.teacher" :item="item" :key="item.id" :show-line="true"></CourseItem>
      </view>
    </view>
  </view>
</template>

<script>
  import CourseItem from "@/components/CourseItem.vue"
  export default {
    data() {
      return {
        curIndex: 0,
        teacherList: [],
        courseList: [],
        page: 1,
        pageSize: 10,
        pageMax: false,
        currentTeacher: {},
      };
    },
    components: {
      CourseItem
    },
    onLoad() {
      this.getTeacherList()
    },
    computed: {

    },
    onReachBottom() {
      if(this.pageMax) return
      this.getTeacherCourse(this.teacherList[this.curIndex]['id'])
    },
    methods: {
      async getTeacherList() {
        try {
          const {
            data
          } = await this.$Api.getTeacherList({})
          this.teacherList = data?.data || []
          this.setCurrentTeacher()
          this.getTeacherCourse(data?.data[0]['id'])
        } catch (e) {
          //TODO handle the exception
        }
      },
      async getTeacherCourse(teacher_id) {
        try {
          const {
            data
          } = await this.$Api.getCourseList({
            teacher_id,
            page: this.page,
            pagesize: this.pageSize
          })
          this.courseList = this.courseList.concat(data?.data || [])
          this.pageMax = data?.data?.length < this.pageSize
          this.page++
        } catch (e) {
          //TODO handle the exception
        }
      },
      setCurrentTeacher() {
        const teacher = this.teacherList[this.curIndex]
        const teachers = {
          ...teacher,
          ttags: teacher?.tags !== '' ? teacher?.tags.split(',') : []
        }
        this.currentTeacher = teachers
      },
      async changeTeacher(item) {
        this.curIndex = item
        this.courseList = []
        this.page = 1
        this.pageMax = false
        this.setCurrentTeacher()
        await this.getTeacherCourse(this.currentTeacher.id)
        
      }
    }
  }
</script>

<style lang="scss">
  .page-famous-teacher {
    min-height: 100vh;
    background-color: #f8f8f8;

    .famous-teacher-list {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding: 6rpx 32rpx;
      height: 370rpx;
    }

    .famous-teacher-card {
      width: 686rpx;
      background: #FDFDFF;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin: 32rpx auto 0;
      padding: 32rpx 24rpx;

      .teacher-tag {
        width: 204rpx;
        height: 40rpx;
        background: linear-gradient(133deg, #D791FF 0%, #6E39FF 100%);
        border-radius: 8rpx 8rpx 8rpx 8rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 20rpx;
        color: #FFFFFF;
        text-align: center;
        line-height: 40rpx;
        margin-right: 16rpx;
      }

      .teacher-des {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 26rpx;
        color: #999999;
        margin-top: 16rpx;
      }
    }

    .famous-teacher-name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 36rpx;
      color: #000000;
      margin-bottom: 16rpx;
    }

    .famous-teacher-item {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 32rpx;
      color: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 192rpx;
      min-width: 192rpx;
      height: 300rpx;
      background: #FFFFFF;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin-right: 16rpx;
      border: 1rpx solid #fff;

      &.famous-teacher-item-active {
        box-sizing: border-box;
        border: 1rpx solid #7644FF;
        width: 230.4rpx;
        height: 360rpx;
        transition: all .3s linear;
        
        & .famous-teacher-cover {
          width: 192rpx;
          height: 254.4rpx;
        }
      }
    }

    .famous-teacher-cover {
      width: 160rpx;
      height: 212rpx;
      border-radius: 16rpx;
      overflow: hidden;
      margin-bottom: 8rpx;
    }
  }
</style>