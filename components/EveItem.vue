<template>
  <view style="margin-bottom: 24rpx;">
    <view class="evaluate-item">
      <view class="tenders-item flex">
        <image :src="getUrl(item.user.avatar)" :class="{'tenders-item-img-detail': isDetail}" @click="toUser(item.user)"
          class="tenders-item-img" mode="aspectFill"></image>
        <view class="tenders-item-right">
          <view class="tenders-item-name flex justify-between align-center">
            <view class="flex align-center" @click="toUser(item.user)">
              {{item.user.nickname}}
              <view class="eve-user-type" v-if="item.user.job_text">{{item.user.job_text}}</view>
            </view>
            <!-- <view class="more-delete" v-if="userInfo.id == item.user.id">
              <image src="/static/common/more.png" mode="aspectFill" class="icon-44"></image>
              删除
            </view> -->
          </view>
          <view class="eve-item-left-con" @click="toDetail">
            {{item.content}}
          </view>
          <view v-if="item.imageslist.length == 4" class="circle-img-4" @click.stop="toDetail">
            <image :src="imageitem" class="eve-card-img" mode="aspectFill" v-for="(imageitem, index) in item.imageslist"
              :key="imageitem" @click.stop="preview(index)"></image>
          </view>
          <view v-else class="circle-img" @click.stop="toDetail">
            <image :src="imageitem" class="eve-card-img" mode="aspectFill" v-for="(imageitem, index) in item.imageslist"
              :key="imageitem" @click.stop="preview(index)"></image>
          </view>
          <view class="tenders-item-time flex align-center">
            {{item.createtime_text}}
            <div class="delet-txt" v-if="userInfo.id == item.user.id" @click.stop="deletOne(item)">删除</div>
          </view>
          <view class="flex align-center justify-between" style="margin-top: 12rpx;">
            <view class="flex align-center" @click.stop="showReward= true">
              <image src="https://jzxt.qifudaren.net/static/audio/reward.png" class="icon-48 margin-right-8" mode="">
              </image>
              <!-- <image src="https://jzxt.qifudaren.net/static/circle/icon-reward.png" class="icon-36 margin-right-8" mode=""></image> -->
              打赏
            </view>
            <view class="flex align-center" @click="postZan(item)">
              <image src="https://jzxt.qifudaren.net/static/circle/icon-like.png" v-if="item.is_fav_count==0"
                class="icon-36 margin-right-8" mode=""></image>
              <image src="../static/common/like-red-fill.png" v-if="item.is_fav_count==1" class="icon-36 margin-right-8"
                mode=""></image>
              点赞 <text v-if="item.fav_count > 0" style="margin-left: 12rpx;">{{item.fav_count}}</text>
            </view>
            <view class="flex align-center" @click.stop="handleComment">
              <image src="https://jzxt.qifudaren.net/static/circle/icon-comment.png" class="icon-36 margin-right-8"
                mode=""></image>评论 <text v-if="item.comment_count > 0"
                style="margin-left: 12rpx;">{{item.comment_count}}</text>
            </view>
          </view>
          <view class="like-wrap flex align-center" v-if="item.is_fav.length > 0">
            <!-- https://jzxt.qifudaren.net/static/circle/icon-haslike.png -->
            <image src="../static/common/like-red-fill.png" class="icon-36" mode=""></image>
            <image v-for="zan in item.is_fav" :key="zan.id" :src="getUrl(zan.user.avatar)" class="like-user-ava"
              mode="aspectFill"></image>
          </view>
          <view class="eve-sub-item-wrap" v-if="item.comments.length > 0">
            <view class="eve-sub" v-for="commentItem in item.comments" :key="commentItem.id">
              <image :src="getUrl(commentItem.user.avatar)" class="eve-sub-img" mode="aspectFill"></image>
              <view class="eve-sub-left">
                <!-- <view class="eve-sub-title">李四 </view> -->
                <!-- <view class="eve-sub-time">2023-11-25 22:44:02</view> -->
                <view class="eve-sub-content">{{commentItem.content}}</view>
              </view>
            </view>
          </view>
        </view>

      </view>
    </view>
    <u-popup :show="showComment" mode="bottom" closeable round="16" @close="close">
      <view class="reward-pop-wrap">
        <view class="reward-pop-title speed-pop-title">评论</view>
        <view class="flex align-center justify-between comment-handler-wrap">
          <input type="text" v-model="commentText" :cursor-spacing="10" placeholder="请输入" class="comment-input" />
          <view class="cu-btn round btn-comment-send" @click="addComment">发送</view>
        </view>
      </view>
    </u-popup>
    <u-popup :show="showReward" mode="bottom" round="16" @close="close">
      <view class="reward-pop-wrap">
        <view class="reward-pop-title">请选择打赏的金额</view>
        <view class="flex price-tag-wrap">
          <view class="price-tag" @click="selectPrice(item.price)"
            :class="{'price-tag-active': selected === item.price}" v-for="item in priceList" :key="item.price">
            {{item.price}}元
          </view>
        </view>
        <view class="reward-pop-title">其他金额</view>
        <input type="text" :value="curPrice" placeholder="请输入其他金额" class="reward-input" @change="handleAmount">
        <view class="cu-btn block round pay-reward-btn" @click="toReward">确认支付</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
  import {
    pay
  } from '../utils/pay';
  import {
    getUrl
  } from '../utils/utils';
  export default {
    name: "EveItem",
    data() {
      return {
        scoreIndex: 4,
        item1: this.item,
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
        finalAmount: '',
        commentText: '',
        showComment: false,
        userInfo: {}
      };
    },
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      isDetail: {
        type: Boolean,
        default: false
      },
      isList: {
        type: Boolean,
        default: false
      },
    },
    mounted() {
      try {
        const user = uni.getStorageSync('userInfo')
        this.userInfo = user
      } catch (e) {
        //TODO handle the exception
      }
    },
    methods: {
      getUrl,
      deletOne(item) {
        uni.showModal({
          title: '提示',
          content: '确定删除吗？',
          success: (res) => {
            if (res.confirm) {
              this.$Api.deleteNotes({
                forum_id: item.id
              }).then(res => {
                uni.showToast({
                  title: '删除成功',
                  icon: 'none'
                })
                this.$emit('delete', item.id)
              }).catch(err => {
                uni.showToast({
                  title: err?.msg || '操作失败!',
                  icon: 'none'
                })
              })
            }
          }
        })
      },
      async toReward() {
        await pay('reward', 'createRewardOrder', this.finalAmount, 'amount', '打赏')
        this.showReward = false
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
      close() {
        this.showReward = false
        this.showComment = false
      },
      async postZan(item) {
        const res = await this.$Api.postToggleFav({
          forum_id: item.id
        })
        this.$emit('zan', item.id)
      },
      handleComment() {
        if (this.isList) {
          this.showComment = true
        }
      },
      addComment() {
        if (this.commentText == '') return
        this.$Api.postAddComment({
          forum_id: this.item.id,
          content: this.commentText
        }).then(res => {
          this.commentText = ''
          this.showComment = false
          this.$emit('comment', res.data)
          uni.showToast({
            title: '评论成功',
            icon: 'none'
          })
        })
      },
      preview(index) {
        uni.previewImage({
          current: index,
          count: this.item.imageslist.length,
          urls: this.item.imageslist
        })
      },
      toDetail() {
        if (this.isDetail) return
        uni.navigateTo({
          url: '/pages/sub-nav/circleDetail?forum_id=' + this.item.id
        })
      },
      toUser(user) {
        const json = JSON.stringify(user)
        const str = encodeURIComponent(json)
        uni.navigateTo({
          url: '/pages/sub-nav/circleList?user=' + str
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .reward-pop-wrap {
    padding: 32rpx;
    position: relative;

    .speed-pop-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 36rpx;
      color: #000000;
      text-align: center;
      margin-top: 0;
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

    .reward-pop-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #333333;
      margin-top: 16rpx;
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

  .evaluate-item {
    background-color: #fff;
    border-radius: 12rpx;
    // padding: 0 32rpx 32rpx;
    margin-bottom: 24rpx;

    .evaluate-item-top {
      height: 100rpx;
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      color: #000000;
    }

    .eve-user-type {
      width: 70rpx;
      height: 36rpx;
      background: linear-gradient(133deg, #D791FF 0%, #6E39FF 100%);
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 20rpx;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8rpx;
    }

    .cu-btn {
      border-radius: 8rpx 8rpx 8rpx 8rpx;
    }

    .tenders-item-img {
      height: 96rpx;
      width: 96rpx;
      min-width: 96rpx;
      background: #F8F8F8;
      border-radius: 80rpx;
      margin-right: 16rpx;
    }

    .tenders-item-img-detail {
      height: 96rpx;
      width: 96rpx;
      min-width: 96rpx;
    }

    .star-img {
      min-width: 32rpx;
      width: 32rpx;
      height: 32rpx;
      margin-right: 4rpx;
    }

    .tenders-item-right {
      width: calc(100vw - 176rpx);
    }

    .tenders-item-name {
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      color: #000000;
    }

    .tenders-item-time {
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #999999;
      margin-top: 12rpx;
    }

    .delet-txt {
      color: #6E39FF;
      font-size: 12px;
      margin-left: 14rpx;
      padding: 4rpx;
    }

    .more-delete {
      font-size: 10px;
      font-weight: 400;
      color: #999999;
    }

    .circle-img {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 180rpx);
      grid-template-rows: auto;
      gap: 10rpx;
      margin-top: 16rpx;
    }

    .circle-img-4 {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, 180rpx);
      grid-template-rows: auto;
      gap: 10rpx;
      margin-top: 16rpx;
    }

    .eve-item-left-con {
      font-size: 28rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 33rpx;
      margin-top: 12rpx;
    }

    .eve-card-img {
      width: 180rpx;
      height: 180rpx;
      border-radius: 8rpx;
      align-self: start;
    }

    .eve-sub-item-wrap {
      width: 100%;
      min-width: 526rpx;
      //min-height: 156rpx;
      background: #F8F8F8;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      margin-top: 24rpx;
      padding: 24rpx;

      .eve-sub {
        display: flex;
        margin-bottom: 24rpx;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .eve-sub-img {
        width: 48rpx;
        height: 48rpx;
        min-width: 48rpx;
        background-color: #eee;
        border-radius: 48rpx 48rpx 48rpx 48rpx;
        border: 1rpx solid rgba(255, 255, 255, 0.5);
      }

      .eve-sub-left {
        margin-left: 16rpx;

        .eve-sub-title {
          font-size: 28rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          color: #000000;

          .eve-sub-identity {
            font-size: 28rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }

        .eve-sub-time {
          font-size: 24rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #999999;
        }

        .eve-sub-content {
          font-size: 28rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 33rpx;
          margin-top: 8rpx;
        }
      }
    }

    .like-wrap {
      height: 80rpx;
      background: #F6F6F6;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      padding: 16rpx;
      margin-top: 24rpx;

      .icon-36 {
        margin-right: 16rpx;
      }

      .like-user-ava {
        height: 48rpx;
        width: 48rpx;
        border-radius: 50%;
        margin-right: 10rpx;
      }
    }
  }
</style>