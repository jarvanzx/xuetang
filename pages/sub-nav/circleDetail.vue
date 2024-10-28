<template>
  <view class="page-circle-detail has-combtn-padding">
    <EveItem ref="circleItem" :isDetail="true" :item="detailData" v-if="detailData" @zan="onZan" @delete="handleDelete">
    </EveItem>
    <view class="flex align-center justify-between comment-handler-wrap">
      <input v-model="text" type="text" placeholder="请输入您的评论" class="comment-input" />
      <view class="cu-btn round btn-comment-send" @click="sendMessage">发送</view>
    </view>
  </view>
</template>

<script>
  import EveItem from '@/components/EveItem.vue';
  export default {
    data() {
      return {
        detailData: null,
        text: '',
        forum_id: ''
      };
    },
    components: {
      EveItem
    },
    onShow() {

    },
    onLoad(options) {
      this.forum_id = options.forum_id
      this.getData();
    },
    methods: {
      handleDelete() {
        uni.$emit('delete-circle', this.forum_id)
        uni.navigateBack()
      },
      async getData() {
        let res = await this.$Api.getForumDetail({
          forum_id: this.forum_id
        });
        res.data.imageslist = res.data.images.length > 0 ? res.data.images.split(',') : ''
        let rescomm = await this.$Api.getCommentList({
          forum_id: this.forum_id,
          page: 1,
          pagesize: 200
        });
        res.data.comments = rescomm.data.data
        // .sort((a, b) => a.createtime - b.createtime)
        this.detailData = res.data
      },
      async onComment(data) {
        // const idx = this.list.findIndex(item => item.id === cid)
        // let rescomm = await this.$Api.getCommentList({
        //   forum_id: cid,
        // });
        // const circle = this.list[idx]
        // circle.comments = rescomm.data.data
        // this.$set(this.list, idx, circle)
        // this.detailData.comments.push(data)
      },
      async onZan(cid) {
        // const idx = this.list.findIndex(item => item.id === cid)
        // let {data} = await this.$Api.getForumDetail({
        // 	forum_id: cid
        // });
        // const circle = {
        //   ...this.list[idx],
        //   is_fav: data.is_fav,
        //   is_fav_count: data.is_fav_count
        // }
        // this.$set(this.list, idx, circle)
        this.getData();
        uni.$emit('zan', cid)
      },
      async sendMessage() {
        if (this.text == '') {
          uni.showToast({
            title: '请输入评价',
            icon: 'none'
          })
          return
        }
        let res = await this.$Api.postAddComment({
          forum_id: this.forum_id,
          content: this.text
        });
        this.text = ''
        // this.detailData.comments.push(res.data)
        uni.showToast({
          title: res.msg,
          icon: 'success'
        })
        this.getData();
      }
    }
  }
</script>

<style lang="scss">
  .page-circle-detail {
    padding: 16rpx 32rpx;

    .comment-input {
      width: 526rpx;
      height: 76rpx;
      background: #F8F8F8;
      border-radius: 40rpx 40rpx 40rpx 40rpx;
      padding: 0 32rpx;
    }

    .comment-handler-wrap {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 32rpx;
      padding-bottom: calc(32rpx + constant(safe-area-inset-bottom)) !important;
      padding-bottom: calc(32rpx + env(safe-area-inset-bottom)) !important;
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
  }
</style>