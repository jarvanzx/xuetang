<template>
  <view class="page-notes-detail">
    <!-- <view class="notes-title">真的猛士，敢于直面惨淡的人生，敢于正视淋漓的鲜血。 —— 鲁迅</view>
    <view class="notes-time">2024-04-23 14:27:05</view>
    <view class="notes-item">
      Meme股、科技股、比特币——所有这些都在今年大幅上涨，引起了看空者的注意，他们在当今市场的许多角落看到了泡沫的迹象。与此同时，看多者坚持认为这是夸大其词，认为预测泡沫迹象还为时过早。
    </view>
    <view class="flex justify-between align-center note-imgs">
      <image src="https://jzxt.qifudaren.net/static/temp/index/notes-1.png" class="note-temp-img" mode=""></image>
      <image src="https://jzxt.qifudaren.net/static/temp/index/notes-2.png" class="note-temp-img" mode=""></image>
    </view>
    <view class="notes-item">
      会议强调，要“用好政策空间、找准发力方向，扎实推动经济高质量发展”“大力推动现代化产业体系建设”“通过增加居民收入扩大消费”“切实优化民营企业发展环境”“加大民生保障力度”等。其中，消费、住房、就业等工作部署事关你我，一起来了解。
    </view>
    <image src="https://jzxt.qifudaren.net/static/temp/index/notes-3.png" mode="widthFix" class="margin-top"></image>
    <view class="notes-item">
      刘某及同伴三人前往该射击俱乐部进行射击体验。工作人员杜某靖对刘某进行射击指导时，枪支意外走火，子弹击中杜某靖。事发后，俱乐部工作人员立即将杜某靖送医救治。24日11时许，杜某靖因抢救无效死亡。
    </view>
    <view class="notes-audio-wrap">
      <image src="https://jzxt.qifudaren.net/static/user/icon-play-audio.png" class="icon-48 margin-right-sm" mode="">
      </image>
      <view class="note-audio-con">
        <view v-for="item in 68" :key="item" :style="{'--d': 7 - item, height: (5 + (item + 4)%5 *2) + 'px'  }"
          :class="{'audio-temp-active': item <30}" class="audio-temp"></view>
      </view>
    </view> -->
    <view class="note-content">{{noteDetail.content}}</view>
    <view class="note-images">
      <image v-for="(image, index) in noteDetail.imageList" :key="image" :src="image" @click="onPreview(index)"
        class="note-img" mode="aspectFill"></image>
    </view>
    <view class="note-handle">
      <view class="note-time">{{noteDetail.createtime_text}}</view>
      <view class="handle-icon">
        <view class="icon-wrap" @click="toEdit">
          <view class="cuIcon-edit"></view>
        </view>
        <view class="icon-wrap" @click="toDelete">
          <view class="cuIcon-delete"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        noteId: '',
        noteDetail: {}
      };
    },
    onLoad(options) {
      console.log(options)
      uni.setNavigationBarTitle({
        title: '笔记详情'
      })
      // 获取笔记详情
      this.noteId = options.id
      this.getNoteDetail()
      uni.$on('public', () => {
        this.getNoteDetail()
      })
    },
    onUnload() {
      uni.$off('public')
    },
    methods: {
      toEdit() {
        const {
          id,
          content,
          imageList
        } = this.noteDetail
        const obj = {
          id,
          content,
          imageList
        }
        const noteStr = JSON.stringify(obj)
        const encoded = encodeURIComponent(noteStr)
        uni.navigateTo({
          url: '/pages/sub-nav/circleRelease?topic=2&action=edit&note=' + encoded
        })
      },
      toDelete() {
        uni.showModal({
          title: '提示',
          content: '确认删除该条笔记么?',
          cancelText: '取消',
          confirmText: '删除',
          success: async (res) => {
            if (res.confirm) {
              const resp = await this.$Api.deleteNotes({
                forum_id: this.noteId
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
      onPreview(index) {
        uni.previewImage({
          current: index,
          urls: this.noteDetail.imageList
        })
      },
      getNoteDetail() {
        // 获取笔记详情
        this.$Api.getForumDetail({
          forum_id: this.noteId
        }).then(res => {
          console.log(res.data);
          const info = res.data
          info.imageList = info.images !== '' ? info.images.split(',') : []
          this.noteDetail = info
          console.log(this.noteDetail);
        })
      }
    }
  }
</script>

<style lang="scss">
  .page-notes-detail {
    padding: 32rpx 48rpx;

    .note-content {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
      line-height: 38rpx;
      text-align: justified;
      font-style: normal;
      text-transform: none;
    }

    .note-images {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto;
      gap: 16rpx;
      margin-top: 32rpx;

      .note-img {
        width: 200rpx;
        height: 200rpx;
        border-radius: 12rpx;
      }
    }

    .notes-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #000000;
    }

    .note-handle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      align-items: center;
      margin-top: 32rpx;
    }

    .note-time {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      margin-top: 8rpx;
    }

    .handle-icon {
      width: 160rpx;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .icon-wrap {
        width: 48rpx;
        height: 48rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .notes-item {
      margin-top: 32rpx;
    }

    .note-temp-img {
      width: 319rpx;
      height: 197rpx;
    }

    .note-imgs {
      margin-top: 32rpx;
    }

    .notes-audio-wrap {
      width: 654rpx;
      height: 80rpx;
      background: #F8F8F8;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      display: flex;
      align-items: center;
      padding: 16rpx;
      margin: 32rpx auto;
    }

    .note-audio-con {
      display: flex;
      align-items: center;
      position: relative;
      height: 30rpx;

      .audio-temp {
        // background: linear-gradient(to top, #d299c2 0%, #fef9d7 100%);
        width: 4rpx;
        height: 22rpx;

        background: #ccc;
        border-radius: calc(30rpx * 0.2 * 0.5);
        margin-right: 4rpx;

        // animation: loading 2.5s infinite linear;
        // animation-delay: calc(0.2s * var(--d));
        // animation-iteration-count: 1; /* 只运行一次 */
        //  animation-fill-mode: forwards; /* 保持最后的状态 */
        &:last-child {
          margin-right: 0;
        }

        &.audio-temp-active {
          background: #7644FF;
        }
      }

    }

    @keyframes loading {
      0% {
        background-image: linear-gradient(to right, #7644FF 0%, #7644FF 100%);
        height: 20%;
        border-radius: calc(30rpx * 0.2 * 0.5);
      }

      50% {
        background-image: linear-gradient(to top, #7644FF 0%, #7644FF 100%);
        height: 100%;
        border-radius: calc(30rpx * 1 * 0.5);
      }

      100% {
        background-image: linear-gradient(to top, #7644FF 0%, #7644FF 100%);
        height: 20%;
        border-radius: calc(30rpx * 0.2 * 0.5);
      }
    }
  }
</style>