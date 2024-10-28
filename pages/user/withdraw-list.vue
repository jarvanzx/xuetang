<template>
	<view class="page-withdraw-list">
		<view class="withdraw-list">
			<view class="withdraw-item bg-white" v-for="item in list" :key="item.id">
				<view class="flex align-center justify-between">
					<view class="withdraw-item-name">提现申请</view>
					<view class="withdraw-item-money">{{item.amount}}</view>
				</view>
				<view class="flex align-center justify-between">
					<view class="withdraw-item-time">{{item.createtime}}</view>
					<view class="withdraw-item-status" v-if="item.status === 0">{{item.status_text}}</view>
					<view class="withdraw-item-status withdraw-item-status-2" v-else>{{item.status_text}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import list from '../../uni_modules/uview-ui/libs/config/props/list';
	export default {
		data() {
			return {
				list: [],
				page: 1,
				pagesize: 20,
				pageMax: false
			};
		},
    onLoad() {
      this.getWithdraw()
    },
    onReachBottom() {
      if(!this.pageMax) this.getWithdraw()
    },
    methods: {
      async getWithdraw() {
        try{
          const {data, total} = await this.$Api.withdrawalLog({page: this.page, list_rows: this.pagesize})
          this.list = this.list.concat(data.data)
          if(this.list.length >= total) this.pageMax = true
          this.page++
        }catch(e){
          //TODO handle the exception
        }
      },
    }
	}
</script>

<style lang="scss">
	.page-withdraw-list {
		min-height: 100vh;
		background-color: #f8f8f8;
		padding: 16rpx 32rpx;
		.withdraw-item {
			width: 686rpx;
			height: 148rpx;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			margin: 0 auto 16rpx;
			padding: 34rpx 32rpx;
		}
		.withdraw-item-name {
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 32rpx;
			color: #000000;
		}
		.withdraw-item-money {
			font-family: DIN, DIN;
			font-weight: 500;
			font-size: 36rpx;
			color: #7644FF;
		}
		.withdraw-item-time {
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 24rpx;
			color: #999999;
		}
		.withdraw-item-status {
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 28rpx;
			color: #1989FF;
			&-2 {
				color: #5CC02D;
			}
		}
	}
</style>
