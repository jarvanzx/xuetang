<template>
  <view class="page-circle-list page-container">
    <cus-nav-bar :title="user.nickname" :backColor="scrolled ? 'black' : 'white'"
      :backgroundColor="scrolled ? '#FFF' : 'transparent'" :showTitle="scrolled" showBack></cus-nav-bar>
    <view class="circle-bg" :style="{backgroundImage: `url(${bg})`}">
      <view class="circle-user-wrap">
        <image :src="getUrl(topInfo.avatar)" class="user-ava" mode="aspectFill"></image>
        <view class="">
          <view>
            {{topInfo.nickname}}
          </view>
          <view class="eve-user-type clad" v-if="topInfo.job_text">{{topInfo.job_text}}</view>
        </view>
      </view>
    </view>
    <view class="circle-sign">{{topInfo.sign}}</view>
    <view class="eve-list relative">
      <view class="eve-list-item" v-for="(item,index) in list" :key="item.id" @click="toDetail(item)">
        <view class="eve-list-item-date">{{item.createtime_text}}</view>
        <view class="eve-list-item-con">
          {{item.content}}
        </view>
        <view v-if="item.imageList.length  == 4" class="circle-img-4">
          <image v-for="(img, idx) in item.imageList" :key="img" :src="img" @click.stop="preview(idx, item.imageList)"
            class="eve-card-img" mode="aspectFill"></image>
        </view>
        <view v-else class="circle-img">
          <image v-for="(img, idx) in item.imageList" :key="img" :src="img" @click.stop="preview(idx, item.imageList)"
            class="eve-card-img" mode="aspectFill"></image>
        </view>
        <view class="flex align-center justify-between" style="margin-top: 24rpx;">
          <view class="flex align-center" @click.stop="showReward= true">
            <image src="https://jzxt.qifudaren.net/static/audio/reward.png" class="icon-48 margin-right-8" mode="">
            </image>
            <!-- <image src="https://jzxt.qifudaren.net/static/circle/icon-reward.png" class="icon-36 margin-right-8" mode=""></image> -->
            打赏
          </view>
          <view class="flex align-center" @click.stop="postZan(item, index)">
            <image src="https://jzxt.qifudaren.net/static/circle/icon-like.png" v-if="item.is_fav_count==0"
              class="icon-36 margin-right-8" mode=""></image>
            <image src="/static/common/like-red-fill.png" v-if="item.is_fav_count==1" class="icon-36 margin-right-8"
              mode=""></image>
            点赞 <text v-if="item.fav_count > 0" style="margin-left: 12rpx;">{{item.fav_count}}</text>
          </view>
          <view class="flex align-center" @click.stop="handleCmt(index)">
            <image src="https://jzxt.qifudaren.net/static/circle/icon-comment.png" class="icon-36 margin-right-8"
              mode=""></image>评论 <text v-if="item.comment_count > 0"
              style="margin-left: 12rpx;">{{item.comment_count}}</text>
          </view>
        </view>
        <view class="like-wrap flex align-center" v-if="item.is_fav.length > 0">
          <!-- https://jzxt.qifudaren.net/static/circle/icon-haslike.png -->
          <image src="/static/common/like-red-fill.png" class="icon-36" mode=""></image>
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
      <!-- <scroll-view scroll-y>
        <EveItem :item="item" v-for="item in list" :key="item.id" :isList="true" @comment="onComment" @zan="onZan" />
        <cus-loading :loading="loading"></cus-loading>
      </scroll-view> -->
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
    <empty-hold v-if="list.length == 0"></empty-hold>
  </view>
</template>

<script>
  // import EveItem from '@/components/EveItem.vue';
  import {
    getUrl
  } from "@/utils/utils"
  export default {
    data() {
      return {
        user: {},
        list: [],
        page: 1,
        pageSize: 10,
        pageMax: false,
        statusBarHeight: 0,
        scrolled: false,
        topInfo: {},
        loading: false,
        showReward: false,
        showComment: false,
        cmtId: '',
        commentText: ''
      };
    },

    // components: {
    //   EveItem,
    // },
    computed: {
      bg() {
        return this.topInfo.cover_img_url ? this.topInfo.cover_img_url :
          'https://jzxt.qifudaren.net/static/temp/cicle/c-1.png'
      }
    },
    onLoad(query) {
      const {
        statusBarHeight
      } = uni.getWindowInfo()
      this.statusBarHeight = statusBarHeight
      const json = decodeURIComponent(query.user)
      if (json) {
        this.user = JSON.parse(json)
        this.getCircles()
        this.getInfo()
      }
    },
    onPageScroll(e) {
      if (e.scrollTop > (this.statusBarHeight + 44)) {
        this.scrolled = true
      } else {
        this.scrolled = false
      }
    },
    onReachBottom() {
      if (!this.pageMax) {
        this.getCircles()
      }
    },
    methods: {
      getUrl,
      // onComment(e) {},
      // onZan(e) {},
      handleCmt(idx) {
        this.showComment = true
        this.cmtId = this.list[idx].id
      },
      addComment() {
        if (this.commentText == '') return
        this.$Api.postAddComment({
          forum_id: this.cmtId,
          content: this.commentText
        }).then(res => {
          this.commentText = ''
          this.showComment = false
          this.list.push(res.data)
          const idx = this.list.findIndex(item => item.id == this.cmtId)
          this.list[idx].comment_count += 1
          uni.showToast({
            title: '评论成功',
            icon: 'none'
          })
        })
      },
      async postZan(item, index) {
        const {
          data
        } = await this.$Api.postToggleFav({
          forum_id: item.id
        })
        const val = data.is_fav_count === 1 ? 1 : -1
        this.list[index].is_fav_count = data.is_fav_count
        this.list[index].fav_count = val
      },
      async getInfo() {
        let res = await this.$Api.getForumCircleHeader({
          uid: this.user.id
        })
        console.log('res', res)
        res.data.loadflag = true;
        this.topInfo = res.data
      },
      async getCircles() {
        try {
          const {
            data
          } = await this.$Api.getForumList({
            uid: this.user.id,
            page: this.page,
            pagesize: this.pageSize
          })
          const list = data?.data
          if (list?.length < this.pageSize) {
            this.pageMax = true
          }
          if (list.length > 0) {
            for (let i = 0, len = list.length; i < len; i++) {
              list[i].imageList = list[i].images.split(',').filter(item => item !== '')
            }
            this.list = this.list.concat(list)
            this.page++
          }

        } catch (e) {
          //TODO handle the exception
        }
      },
      preview(idx, list) {
        console.log(idx, list);
        uni.previewImage({
          current: idx,
          count: list.length,
          urls: list
        })
      },
      toBack() {
        uni.navigateBack()
      },

      toDetail(circle) {
        uni.navigateTo({
          url: '/pages/sub-nav/circleDetail?forum_id=' + circle.id
        })
      },
      toRelease() {
        uni.navigateTo({
          url: '/pages/sub-nav/circleRelease?key=1'
        })
      },
      toCover() {
        uni.navigateTo({
          url: '/pages/sub-nav/circleCover'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  // .nav{
  //   width: 100%;
  //   height: 42px;
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   display: flex;
  //   align-items: center;
  //   z-index: 99;
  //   background-color: transparent;
  //   box-sizing: content-box;
  // }
  .page-container {
    width: 750rpx;
    min-height: 100vh;
  }

  .circle-bg {
    height: 440rpx;
    width: 100%;
    // background-image: url('https://jzxt.qifudaren.net/static/temp/cicle/c-1.png');
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
  }

  .eve-user-type {
    max-width: 70rpx;
    padding: 2rpx;
    background: linear-gradient(133deg, #D791FF 0%, #6E39FF 100%);
    border-radius: 8rpx 8rpx 8rpx 8rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: #FFFFFF;
    margin-top: 8rpx;
    text-align: center;
  }

  .back-img-nav {
    position: absolute;
    left: 32rpx;
    bottom: 20rpx;
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

  .eve-card-img {
    width: 180rpx;
    height: 180rpx;
    border-radius: 8rpx;
    align-self: start;
  }

  .eve-list-item-media {
    margin-top: 8rpx;
  }

  .eve-list-item {
    margin-bottom: 48rpx;
  }

  .eve-media-img {
    width: 189rpx;
    height: 180rpx;
    // border-radius: 16rpx 16rpx 16rpx 16rpx;
    min-width: 189rpx;
    margin-right: 4rpx;
    margin-bottom: 4rpx;
    border-radius: 8px;
  }

  .eve-list-item-date {
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 36rpx;
    color: #000000;
  }

  .eve-list-item-con {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #333333;
    margin-top: 8rpx;
  }

  .circle-sign {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #666666;
    margin-top: 48rpx;
    padding-left: 32rpx;
  }

  .icon-camera {
    height: 52rpx;
    width: 52rpx;
    position: absolute;
    top: 106rpx;
    right: 32rpx;
    /* #ifdef MP */
    top: 156rpx;
    /* #endif */
  }

  .circle-user-wrap {
    position: absolute;
    bottom: -32rpx;
    left: 32rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 36rpx;
    color: #FFFFFF;
    display: flex;
    align-items: center;
  }

  .user-ava {
    width: 128rpx;
    height: 128rpx;
    border-radius: 50%;
    border: 4rpx solid #fff;
    margin-right: 16rpx;

  }

  .eve-list {
    padding: 32rpx;
    margin-top: 40rpx;
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
</style>