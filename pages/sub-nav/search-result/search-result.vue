<template>
  <view class="page-meta">
    <view class="search flex align-center">
      <image src="../../../static/common/search.png" class="icon-search" mode="aspectFill"></image>
      <input type="text" v-model="keyword" class="ipt-search" confirm-type="search" placeholder="请输入"
        @confirm="search" />
      <image src="../../../static/common/clear.png" class="icon-search" mode="aspectFill" v-if="keyword"
        @click="clearWord"></image>
    </view>
    <view class="search-result" v-if="searched">
      <scroll-view :scroll-y="true" class="search-srcolled safe-area">
        <view class="course-item" v-for="item in list" :key="item.id">
          <CourseItem :item="item" :teacher="item.teacher"></CourseItem>
        </view>
        <empty-hold v-if="list.length == 0"></empty-hold>
      </scroll-view>
    </view>
    <view class="history" v-else>
      <view class="history-item">
        <view class="title-line flex justify-between align-center">
          <view class="his-title">历史搜索</view>
          <view class="clear-box flex align-center" @click="clearAll">
            <image src="/static/common/delete.png" mode="aspectFill" class="icon-32"></image>
            <view class="clear-txt">清除历史</view>
          </view>
        </view>
        <view class="search-words flex align-center flex-wrap">
          <view class="word-item" v-for="item in history" :key="item" @click="selectWord(item)">{{item}}</view>
        </view>
      </view>
      <view class="history-item">
        <view class="title-line flex justify-between align-center">
          <view class="his-title">搜索热词</view>
          <!-- <view class="clear-box flex align-center" @click="clearAll">
            <image src="/static/common/delete.png" mode="aspectFill" class="icon-32"></image>
            <view class="clear-txt">清除历史</view>
          </view> -->
        </view>
        <view class="search-words flex align-center flex-wrap">
          <view class="word-item" v-for="item in hotWords" :key="item.id" @click="selectWord(item.keyword)">
            {{item.keyword}}
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
  import CourseItem from '@/components/CourseItem.vue';
  export default {
    data() {
      return {
        keyword: '',
        list: [],
        page: 1,
        pageSize: 10,
        pageMax: false,
        searched: false,
        history: [],
        hotWords: []
      };
    },
    components: {
      CourseItem
    },
    methods: {
      async getHotWords() {
        const {
          data
        } = await this.$Api.getSearchKey({})
        this.hotWords = data
      },
      clearAll() {
        uni.showModal({
          title: '提示',
          content: '确定要清空历史记录吗？',
          success: (res) => {
            if (res.confirm) {
              this.history = []
              uni.setStorageSync('searchHistory', this.history)
            }
          }
        })
      },
      clearWord() {
        this.keyword = ''
        this.searched = false
      },
      selectWord(word) {
        this.keyword = word
        this.search()
      },
      search() {
        this.searched = true
        this.list = []
        this.page = 1
        this.pageMax = false
        this.getList()
        const idx = this.history.indexOf(this.keyword)
        if (idx > -1) {
          this.history.splice(idx, 1)
        }
        this.history.unshift(this.keyword)
        if (this.history.length > 10) {
          this.history.pop()
        }
        uni.setStorageSync('searchHistory', this.history)
      },
      async getList() {
        if (this.pageMax) return
        try {
          const {
            data
          } = await this.$Api.getCourseList({
            q: this.keyword.trim()
          })
          if (data.data?.length < this.pageSize) {
            this.pageMax = true
          }
          this.list = this.list.concat(data.data)
          this.page++
        } catch (e) {
          //TODO handle the exception
        }
      }
    },
    onReachBottom() {
      this.getList()
    },
    onLoad() {
      try {
        const history = uni.getStorageSync('searchHistory')
        if (history) {
          this.history = history
        }
      } catch (e) {
        //TODO handle the exception
      }
      this.getHotWords()
    },
  }
</script>

<style lang="scss" scoped>
  .page-meta {
    width: 100%;
    height: 100vh;
    background: #F8F8F8;
    padding-top: 16rpx;

    .search {
      width: 686rpx;
      height: 76rpx;
      background: #FFFFFF;
      border-radius: 40rpx 40rpx 40rpx 40rpx;
      padding: 0 32rpx;
      margin: 0 auto;

      .icon-search {
        width: 40rpx;
        height: 40rpx;
        flex-shrink: 0;
      }

      .ipt-search {
        flex: 1;
        margin-left: 16rpx;
        margin-right: 16rpx;
      }
    }

    .search-result {
      width: 100%;
      margin-top: 16rpx;
      box-sizing: border-box;

      .search-srcolled {
        width: 100%;
        padding: 16rpx 32rpx;
        height: calc(100vh - 108rpx);

        .course-item {
          width: 100%;
          padding: 0 24rpx;
          background-color: #FFFFFF;
          margin-bottom: 16rpx;
          border-radius: 16rpx;
        }
      }
    }

    .history {
      width: 100%;
      padding: 0 32rpx;
      margin-top: 48rpx;

      .his-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 32rpx;
        color: #000000;
        line-height: 38rpx;
        text-align: left;
      }

      .clear-txt {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 26rpx;
        color: #999999;
        line-height: 30rpx;
        text-align: left;
        font-style: normal;
        margin-left: 2rpx;
      }

      .search-words {
        margin-top: 32rpx;
      }

      .word-item {
        padding: 8rpx 16rpx;
        background: #FFFFFF;
        border-radius: 52rpx 52rpx 52rpx 52rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #333333;
        line-height: 33rpx;
        text-align: left;
        margin-right: 16rpx;
        margin-bottom: 16rpx;
      }
    }

    .history-item {
      margin-top: 48rpx;
    }
  }
</style>