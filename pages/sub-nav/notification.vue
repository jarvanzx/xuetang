<template>
  <view class="container bg-f8">
    <view class="handle-line flex  justify-between align-center">
      <view class="tabs flex align-center">
        <view class="tab-item" :class="{activeTab: activeTab == 0}" @click="changeTab(0)">
          未读消息
          <view v-if="unread> 0" class="msg-cnt">{{unread}}</view>
        </view>
        <view class="tab-item" :class="{activeTab: activeTab == 1}" @click="changeTab(1)">
          已读消息
        </view>
        <!-- <view class="tab-item" :class="{activeTab: activeTab == 1}" @click="changeTab(1)">
          活动消息
          <view v-if="unread> 0" class="msg-cnt">{{unread}}</view>
        </view>
        <view class="tab-item" :class="{activeTab: activeTab == 2}" @click="changeTab(2)">
          系统消息
          <view v-if="unread> 0" class="msg-cnt">{{unread}}</view>
        </view> -->
      </view>
      <view class="clear-all">
        <image src="../../static/common/clear-all.png" mode="aspectFill" class="icon-44"></image>
      </view>
    </view>
    <scroll-view scroll-y="true" class="scroll-wrap safe-area">
      <template v-if="activeTab == 0">
        <view class="msg-item" v-for="(item, idx) in notificationList" :key="item.id">
          <view class="is_read" v-if="item.read == 0"></view>
          <view class="msg-title line-2">{{item.title}}</view>
          <view class="content" v-if="activeId == item.id">{{item.content}}</view>
          <view class="sub-msg flex align-center justify-between">
            <view class="msg-time">{{item.createtime}}</view>
            <view class="msg-more flex align-center" @click="getMore(item.id, idx)">
              <text style="margin-right: 20rpx;">查看详情</text>
              <image src="/static/common/arrow-right.png" class="icon-36" mode="aspectFill"></image>
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="msg-item" v-for="(item, idx) in notificationList2" :key="item.id">
          <view class="is_read" v-if="item.read == 0"></view>
          <view class="msg-title line-2">{{item.title}}</view>
          <view class="content" v-if="activeId == item.id">{{item.content}}</view>
          <view class="sub-msg flex align-center justify-between">
            <view class="msg-time">{{item.createtime}}</view>
            <view class="msg-more flex align-center" @click="getMore(item.id, idx)">
              <text style="margin-right: 20rpx;">查看详情</text>
              <image src="/static/common/arrow-right.png" class="icon-36" mode="aspectFill"></image>
            </view>
          </view>
        </view>

      </template>
    </scroll-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        notificationList: [],
        notificationList2: [],
        tabs: ['未读', '已读'],
        activeTab: 0,
        activeId: ''
      };
    },
    computed: {
      unread() {
        return this.notificationList.filter(item => item.read === 0).length
      },
    },
    onLoad() {
      this.getNotificationList();
    },
    methods: {
      async getMore(id, idx) {
        this.activeId = id
        if (this.notificationList[idx].read == 1) return
        await this.$Api.messageRead({
          id
        })
        this.notificationList[idx].read = 1
      },
      getNotificationList() {

        this.$Api.messageList({
          is_read: this.activeTab
        }).then(res => {
          console.log(res);
          if (this.activeTab == 0) {
            this.notificationList = res.data.data
          } else {
            this.notificationList2 = res.data.data
          }

          // this.unread = this.notificationList.filter(item => item.read === 0).length
        })


        // this.notificationList = [{
        //   title: '通知1',
        //   content: '通知内容1',
        //   time: '2021-01-01 12:00:00'
        // }, {
        //   title: '通知2',
        //   content: '通知内容2',
        //   time: '2021-01-02 12:00:00'
        // }];
      },
      changeTab(index) {
        this.activeTab = index;
        this.getNotificationList();
      }
    },
  }
</script>

<style lang="scss">
  .handle-line {
    width: 100%;
    height: 88rpx;
    padding: 10rpx 24rpx;

    .tab-item {
      margin-right: 60rpx;
      padding: 10rpx;
      font-size: 30rpx;
      position: relative;

      .msg-cnt {
        position: absolute;
        top: -10rpx;
        right: -30rpx;
        min-width: 30rpx;
        max-width: 60rpx;
        height: 30rpx;
        padding: 4rpx;
        background-color: #FF3B30;
        border-radius: 15rpx;
        color: #FFFFFF;
        font-size: 24rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .activeTab {
      color: #7644FF;
      font-weight: bold;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 10%;
        width: 80%;
        height: 4rpx;
        background: #7644FF;
        border-radius: 2rpx;
      }
    }
  }

  .scroll-wrap {
    width: 750rpx;
    height: calc(100vh - 88rpx);
    padding: 24rpx;

    .msg-item {
      width: 100%;
      padding: 24rpx;
      background-color: #FFFFFF;
      margin-bottom: 24rpx;
      border-radius: 12rpx;
      position: relative;

      &:last-child {
        margin-bottom: 0;
      }

      .is_read {
        width: 12rpx;
        height: 12rpx;
        background-color: #FF3B30;
        border-radius: 50%;
        position: absolute;
        top: 24rpx;
        right: 24rpx;
      }

      .msg-title {
        font-size: 30rpx;
        color: #333333;
      }

      .content {
        margin-top: 16rpx;
      }

      .sub-msg {
        margin-top: 24rpx;
        color: #9E9E9E;
      }
    }
  }
</style>