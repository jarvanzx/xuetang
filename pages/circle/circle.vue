<template>
  <view class="page-circle has-combtn-padding">
    <cus-nav-bar title="成长圈" :backgroundColor="scrolled ? '#FFF' : 'transparent'" :showTitle="scrolled"></cus-nav-bar>
    <view class="circle-bg" v-if="topInfo.loadflag" :style="{'background-image': 'url('+getBg()+')'}" @click="toCover">
      <view class="pub-wrap">
        <image src="https://jzxt.qifudaren.net/static/circle/icon-camera.png" @click.stop="toRelease"
          class="icon-camera" mode=""></image>
        <view class="pub-txt">
          成长打卡
        </view>
      </view>
      <view class="circle-user-wrap" @click.stop="toUser">
        <image :src="getUrl(topInfo.avatar)" class="user-ava" mode="aspectFill"></image>
        <view class=" ">{{topInfo.nickname}}
          <view class="eve-user-type" v-if="topInfo.job_text">{{topInfo.job_text}}</view>
        </view>
      </view>

    </view>
    <view class="user-sign">{{topInfo.sign}}</view>
    <view class="eve-list" scroll-y="true">
      <!-- <div v-for="item in 5" @click="toDetail">
				<EveItem  />
			</div> -->
      <EveItem :item="item" v-for="item in list" :key="item.id" :isList="true" @comment="onComment" @zan="onZan"
        @delete="handleDelete" />
      <cus-loading :loading="loading"></cus-loading>
    </view>
    <tab-bar :selected="1"></tab-bar>

  </view>
</template>

<script>
  import TabBar from "@/components/tabbar.vue"
  import EveItem from '@/components/EveItem.vue';
  import {
    getUrl
  } from '@/utils/utils.js';
  export default {
    data() {
      return {
        list: [],
        topInfo: {
          loadflag: false
        },
        page: 1,
        pagesize: 10,
        pageMax: false,
        showCmt: false,
        scrolled: false,
        statusBarHeight: 0,
        loading: false
      };
    },
    onShow() {
      // #ifndef MP
      uni.hideTabBar()
      // #endif
      // this.getList();
      this.getInfo()
    },
    onLoad() {
      uni.$on('delete-circle', id => {
        this.handleDelete(id)
      })
      const {
        statusBarHeight
      } = uni.getWindowInfo()
      this.statusBarHeight = statusBarHeight
      uni.$on('zan', id => {
        this.onZan(id)
      })
      uni.$on('public', () => {
        this.page = 1
        this.pageMax = false
        this.list = []
        this.getList()
      })
      // uni.$on('comment', id => {
      //   console.log(id);
      //   this.onComment(id)
      // })
      this.getList()
      this.getInfo()
    },
    components: {
      EveItem,
      TabBar
    },
    async onReachBottom() {
      if (this.pageMax) return
      this.loading = true
      await this.getList();
      this.loading = false
    },
    onPageScroll(e) {
      if (e.scrollTop > (this.statusBarHeight + 44)) {
        this.scrolled = true
      } else {
        this.scrolled = false
      }
    },
    async onPullDownRefresh() {
      this.page = 1
      this.pageMax = false
      this.list = []
      await this.getList()
      uni.stopPullDownRefresh()
    },
    onShareAppMessage() {
      return {
        title: '一起分享学习心得',
        path: '/pages/circle/circle'
      }
    },
    onShareTimeline() {
      return {
        title: '一起分享学习心得',
        path: '/pages/circle/circle'
      }
    },
    methods: {
      getUrl,
      getBg() {
        return this.topInfo.cover_img_url ? this.topInfo.cover_img_url :
          'https://jzxt.qifudaren.net/static/temp/cicle/c-1.png'
      },
      handleDelete(id) {
        const idx = this.list.findIndex(item => item.id == id)
        console.log(idx);
        if (idx > -1) {
          this.list.splice(idx, 1)
        }
      },
      toUser() {
        const user = {
          nickname: this.topInfo.nickname,
          avatar: this.topInfo.avatar,
          id: this.topInfo.uid,
          url: `/u/${this.topInfo.uid}`
        }
        const json = JSON.stringify(user)
        const str = encodeURIComponent(json)
        uni.navigateTo({
          url: '/pages/sub-nav/circleList?user=' + str
        })
      },
      async onComment(data) {
        this.list.push(data)
        // const idx = this.list.findIndex(item => item.id == cid)
        // console.log(idx);
        // let rescomm = await this.$Api.getCommentList({
        //   forum_id: cid,
        // });
        // const circle = this.list[idx]
        // circle.comments = rescomm.data?.data
        // // ?.sort((a, b) => a.createtime - b.createtime)
        // this.$set(this.list, idx, circle)
      },
      async onZan(cid) {
        const idx = this.list.findIndex(item => item.id === cid)
        let {
          data
        } = await this.$Api.getForumDetail({
          forum_id: cid
        });
        const circle = {
          ...this.list[idx],
          fav_count: data.fav_count,
          is_fav_count: data.is_fav_count
        }
        this.$set(this.list, idx, circle)
        this.$forceUpdate()
      },
      scrolltolowerFunc() {
        if (this.pageMax) return
        this.getList();
      },
      async getInfo() {
        let res = await this.$Api.getForumCircleHeader()
        console.log('res', res)
        res.data.loadflag = true;
        this.topInfo = res.data
      },
      async getCircle() {
        let res = await this.$Api.getForumList({
          topic_id: 0,
          page: this.page,
          pagesize: this.pagesize
        })
        console.log('topic_id', res)
        const list = res.data.data
        for (let i = 0; i < list.length; i++) {
          list[i].imageslist = list[i]['images'] !== '' ? list[i].images.split(',') : []
        }
        this.list = this.list.concat(list)
      },
      async getList() {
        let res = await this.$Api.getForumList({
          kind: 1,
          page: this.page,
          pagesize: this.pagesize
        })
        console.log('topic_id', res)

        const list = res.data.data
        if (list?.length < this.pagesize) {
          this.pageMax = true
        }
        for (let i = 0; i < list.length; i++) {
          list[i].imageslist = list[i]['images'] !== '' ? list[i].images.split(',') : []
        }
        this.list = this.list.concat(list)
        this.page++
        // let res2= await this.$Api.getForumMyList({topic_id: 0})
      },
      toDetail() {
        uni.navigateTo({
          url: '/pages/sub-nav/circleDetail'
        })
      },
      toRelease() {
        uni.navigateTo({
          url: '/pages/sub-nav/circleRelease?topic=1'
        })
      },
      toCover() {
        uni.navigateTo({
          url: '/pages/sub-nav/cover-edit'
        })
      },

    }
  }
</script>

<style lang="scss" scoped>
  .page-circle {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .circle-bg {
    height: 440rpx;
    width: 100%;
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;


  }

  .user-sign {
    // position: absolute;
    // left: 32rpx;
    // bottom: -68rpx;
    width: calc(100% - 64rpx);
    margin-top: 48rpx;
    margin-left: 32rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #666666;
    line-height: 33rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
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
    margin-top: 8rpx;
  }

  .pub-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 126rpx;
    right: 32rpx;
    /* #ifdef MP */
    top: 196rpx;
    /* #endif */
    font-size: 14px;
  }

  .icon-camera {
    height: 52rpx;
    width: 52rpx;

  }

  .circle-user-wrap {
    width: 100%;
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
    padding: 0 32rpx;
    margin-top: 48rpx;
  }

  .has-tab-padding {
    padding-bottom: calc(75px + constant(safe-area-inset-bottom)) !important;
    padding-bottom: calc(75px + env(safe-area-inset-bottom)) !important;
  }
</style>