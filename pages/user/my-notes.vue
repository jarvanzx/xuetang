<template>
  <view class="page-my-notes">
    <view class="cu-bar search bg-white">
      <view class="search-form round">
        <text class="cuIcon-search"></text>
        <input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="搜索笔记"
          confirm-type="search"></input>
      </view>
    </view>
    <view class="note-list">
      <view class="note-item" v-for="item in listData" :key="item.id" @click="toDetail(item)">
        <view class="note-title">{{item.content}}</view>
        <view class="flex align-center justify-between note-info">
          <view class="note-time">{{item.createtime_text}}</view>
          <image src="https://jzxt.qifudaren.net/static/user/icon-delete.png" class="icon-36"
            @click.stop="toDelete(item.id)" mode=""></image>
        </view>
      </view>
    </view>
    <view class="add-btn" @click="toPublish">
      <i class="cuIcon-roundadd isize"></i>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        listData: [],
        page: 1,
        pageSize: 10,
        pageMax: false,
        isLoadMore: false
      };
    },
    onShow() {
      this.page = 1
      this.listData = []
      this.pageMax = false
      this.getData()
    },
    onReachBottom() {
      if(!this.pageMax) {
        this.getData()
      }
    },
    methods: {
      async getData() {
        let {
          data
        } = await this.$Api.getForumMyList({
          kind: 2,
          page: this.page,
          pagesize: this.pageSize
        })
        if (data?.data.length < data?.per_page) {
          this.pageMax = true
        }
        this.listData = this.listData.concat(data.data)
        this.page++
      },
      toDetail(note) {
        uni.navigateTo({
          url: '/pages/user/notes-detail?id=' + note.id
        })
      },
      toDelete(id) {
        uni.showModal({
          title: '提示',
          content: '确认删除该条笔记么?',
          cancelText: '取消',
          confirmText: '删除',
          success: async (res) => {
            if (res.confirm) {
              const resp = await this.$Api.deleteNotes({
                forum_id: id
              })
              if (resp.code === 1) {
                uni.showToast({
                  icon: 'none',
                  title: '删除成功'
                })
                this.page = 1
                this.listData = []
                this.pageMax = false
                this.getData()
              }
            }
          }
        })
      },
      toPublish() {
        uni.navigateTo({
          url: '/pages/sub-nav/circleRelease?topic=2'
        })
      }
    }
  }
</script>

<style lang="scss">
  .page-my-notes {
    background-color: #F8F8F8;
    overflow: hidden;
    min-height: 100vh;

    .note-list {
      margin-top: 32rpx;
    }

    .note-item {
      border-radius: 16rpx;
      width: 686rpx;
      background: #FFFFFF;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin: 0 auto 32rpx;
      padding: 32rpx;
    }

    .note-info {}

    .note-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 32rpx;
      color: #000000;
      margin-bottom: 32rpx;
    }

    .note-time {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
    }

    .add-btn {
      position: fixed;
      bottom: 30%;
      right: 10px;

      .isize {
        font-size: 34px;
      }
    }
  }
</style>