<template>
  <view class="page-income-list">
    <view class="income-list">
      <view class="income-item bg-white" v-for="item in list" :key="item.id">
        <view class="income-item-top flex align-center justify-between">
          <view class="income-item-time">下单时间：{{item.createtime}}</view>
          <view class="income-item-status">{{item.commission_reward_status_text}}</view>
          <!-- <view class="income-item-status income-item-status-2" v-else>已到账</view> -->
        </view>
        <view class="income-item-goods flex">
          <image :src="item.order_item.goods_image" class="income-goods-cover" mode="aspectFill"></image>
          <view class="income-goods-info">
            <view class="income-goods-name line-2">{{item.order_item.goods_title}}</view>
            <view class="income-goods-price">消费金额： <span class="text-price income-price-sale">{{item.amount}}</span>
            </view>
          </view>
        </view>
        <view class="flex align-center justify-end income-money">
          佣金
          <span class="text-price ">{{item.amount}}</span>
        </view>
      </view>
    </view>
    <empty-hold v-if="list.length == 0"></empty-hold>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        page: 1,
        pagesize: 20,
        pageMax: false,
        total: 0
      };
    },
    onLoad() {
      this.incomeList()
    },
    onReachBottom() {
      if (!this.pageMax) this.incomeList()
    },
    methods: {
      async incomeList() {
        const {
          data
        } = await this.$Api.commissionLog({
          page: this.page,
          list_rows: this.pagesize
        })
        const {
          data: list,
          total
        } = data
        this.list = this.list.concat(list)
        if (this.list.length >= total) this.pageMax = true
        this.page++
      }
    }
  }
</script>

<style lang="scss">
  .page-income-list {
    min-height: 100vh;
    background-color: #f8f8f8;
    padding: 16rpx 32rpx;

    .income-item {
      width: 686rpx;
      height: 326rpx;
      background: #FFFFFF;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      padding: 24rpx;
      margin: 0 auto 16rpx;
    }

    .income-item-goods {
      margin-top: 24rpx;
    }

    .income-item-time {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
    }

    .income-item-status {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #1989FF;

      &-2 {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #5CC02D;
      }
    }

    .income-goods-cover {
      width: 120rpx;
      height: 144rpx;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      min-width: 120rpx;
      margin-right: 16rpx;
    }

    .income-goods-name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 28rpx;
      color: #333333;
    }

    .income-goods-price {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;
      margin-top: 24rpx;
    }

    .income-money {
      margin-top: 30rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;

      .text-price {
        font-family: DIN, DIN;
        font-weight: 500;
        font-size: 36rpx;
        color: #7644FF;
        margin-left: 8rpx;
      }
    }
  }
</style>