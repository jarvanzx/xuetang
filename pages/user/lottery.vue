<template>
  <view class="page-user-lottery page-wrap">
    <image src="https://jzxt.qifudaren.net/static/rank/bg-rank.png" class="index-top" mode=""></image>
    <view class="page-custom-top-nav">
      <image src="https://jzxt.qifudaren.net/static/common/back.png" class="back-img" mode="" @click="toBack"></image>
      <view>{{ lottery.name }}</view>
    </view>
    <view class="page-main">
      <!-- <Wheel :mode="2" /> -->
      <almost-lottery :strFontColors="['#7644FF']" :colors="resultColors" :prizeList="prizeList" :ring-count="3"
        :prizeIndex="prizeIndex" @reset-index="prizeIndex = -1" @draw-before="handleDrawBefore" :selfRotaty="true"
        @draw-start="handleDrawStart" @draw-end="handleDrawEnd" @finish="handleDrawFinish" v-if="prizeList.length" />

      <view class="lottery-card bg-white" style="margin-top: 20rpx">
        <view class="lottery-card-title">活动规则</view>
        <view class="lottery-card-content">{{ lottery.rule_content }}</view>
      </view>
      <view class="lottery-card bg-white">
        <view class="lottery-card-title">奖品介绍</view>
        {{ lottery.introduce }}
        <!-- <view class="lottery-card-reward">奖品一</view>
				<view class="lottery-card-content">
					极目新闻记者了解到，这些患者都有一些共同的习惯：经常把未吃完的食物放在桌上敞着，
				</view>
				<view class="lottery-card-reward">奖品二</view>
				<view class="lottery-card-content">
					极目新闻记者了解到，这些患者都有一些共同的习惯：经常把未吃完的食物放在桌上敞着，
				</view> -->
      </view>
    </view>
  </view>
</template>

<script>
  import Wheel from '../../components/Wheel.vue';
  export default {
    data() {
      return {
        prizeList: [],
        resultColors: [],
        prizeIndex: -1,
        score: 0,
        lottery: {},
        isStart: true,
        lottery_active_id: ''
      };
    },
    components: {
      Wheel
    },
    onLoad() {
      this.getList();

      // this.getLottery()
    },
    methods: {
      handleDrawBefore(callback) {
        // if(this.lottery.user_join_count > 0) {
        //   this.$u.toast('每天只能参与一次')
        //   callback(false)
        //   return
        // }
        const date = new Date()
        const seconds = Math.floor(date.getTime() / 1000)
        if (seconds < this.lottery.start_time) {
          this.$u.toast('活动未开始')
          callback(false)
          return
        }
        if (seconds > this.lottery.end_time) {
          this.$u.toast('活动已结束')
          callback(false)
          return
        }
        if (this.lottery.day_count > this.lottery.user_join_count) {
          this.isStart = true;
          callback(this.isStart);
        } else {
          this.$u.toast('没有抽奖次数了');
          callback(false)
        }
      },
      handleDrawStart() {
        this.$Api
          .go_lottery({
            lottery_active_id: this.lottery_active_id
          })
          .then((res) => {
            console.log(res);
            const idx = this.prizeList.findIndex((item) => item.prizeId == res.data.lottery_active_id);
            this.prizeIndex = idx;
            this.getList();
          });
      },
      handleDrawEnd() {
        console.log('抽奖结束');
        uni.showModal({
          title: '中奖结果',
          content: '恭喜您，中得奖品: ' + this.prizeList[this.prizeIndex]?.prizeName,
          showCancel: false
        });
      },
      handleDrawFinish() {
        console.log('finish');
      },
      toBack() {
        uni.navigateBack();
      },
      async getLottery(id) {
        try {
          const {
            data
          } = await this.$Api.getLottery({
            lottery_active_id: id
          });

          this.lottery = data;
          let colors = ['#E4F0FF', '#F4FAFF', '#fff'];

          this.prizeList = data?.lottery_awards.map((item, index) => {
            let resIndex = index % colors.length;

            if (index == data?.lottery_awards.length - 1) {
              if (colors[resIndex] == this.resultColors[0]) {
                this.resultColors.push(this.resultColors[1]);
              } else {
                this.resultColors.push(colors[resIndex]);
              }
            } else {
              this.resultColors.push(colors[resIndex]);
            }

            return {
              prizeId: item.id,
              prizeName: item.name,
              prizeStock: item.num,
              prizeWeight: item.weigh,
              prizeImage: item.image
            };
          });

          console.log(this.resultColors, 'resultColors');
        } catch (e) {
          //TODO handle the exception
        }
      },
      async getList() {
        try {
          const {
            data
          } = await this.$Api.getLotteryList({});

          let res = await this.$Api.getUserInfo();
          this.score = res.data.score;

          const id = data.data[0]['id'];
          this.lottery_active_id = id;
          this.getLottery(id);
        } catch (e) {
          //TODO handle the exception
        }
      }
    }
  };
</script>

<style lang="scss">
  .page-user-lottery {
    background: #eceeff;
    min-height: 100vh;

    // padding-bottom: calc(236rpx + constant(safe-area-inset-bottom));
    // padding-bottom: calc(236rpx + env(safe-area-inset-bottom));
    .index-top {
      width: 100%;
      height: 860rpx;
      position: absolute;
      top: 0;
    }

    .page-main {
      position: relative;
    }

    .lottery-bg {
      width: 600rpx;
      height: 600rpx;
    }

    .lottery-reward-list {
      position: absolute;
      top: 0;
      left: 0;
      width: 600rpx;
      height: 600rpx;
      border-radius: 50%;
      overflow: hidden;
      transform: rotate(0deg);
      transition: transform 4s ease-out;

      .lottery-reward-item {
        position: absolute;
        transform-origin: 100% 100%;
        width: 50%;
        height: 50%;
        background-color: red;
        text-align: right;
      }

      .lottery-reward-item:nth-child(1) {
        transform: rotate(0deg) skewY(-60deg);
      }

      .lottery-reward-item:nth-child(2) {
        transform: rotate(60deg) skewY(-60deg);
      }

      .lottery-reward-item:nth-child(3) {
        transform: rotate(120deg) skewY(-60deg);
      }

      .lottery-reward-item:nth-child(4) {
        transform: rotate(180deg) skewY(-60deg);
      }

      .lottery-reward-item:nth-child(5) {
        transform: rotate(240deg) skewY(-60deg);
      }

      .lottery-reward-item:nth-child(6) {
        transform: rotate(300deg) skewY(-60deg);
      }
    }

    .lottery-btn {
      width: 183rpx;
      height: 217rpx;
      position: absolute;
      left: 50%;
      margin-left: -91.5rpx;
      top: 182rpx;
      z-index: 1;
    }

    .lottery-main {
      width: 600rpx;
      height: 600rpx;
      // background: linear-gradient( 147deg, #61BDFF 0%, #8457FF 100%);
      border-radius: 50%;
      margin: 32rpx auto 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .lottery-card {
      width: 686rpx;
      background: #ffffff;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      margin: 0 auto 32rpx;
      padding: 32rpx;
    }

    .lottery-card-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #7644ff;
    }

    .lottery-card-content {
      margin-top: 16rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #000000;
    }

    .lottery-card-reward {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 28rpx;
      color: #000000;
      margin-top: 16rpx;
    }
  }
</style>