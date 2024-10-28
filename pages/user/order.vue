<template>
  <scroll-view scroll-y="true" class="page-user-order safe-botton" @scrolltolower="scrollLower">
    <view class="order-nav order-tab">
      <view v-for="item in navList" :key="item.type" @click="handleTab(item)"
        :class="item.type==TabCur?'cur-nav-item':''" class="order-nav-item">{{item.name}}</view>
    </view>
    <view class="order-list">
      <view class="order-item" @click="toDetail(item)" v-for="item in listData" :key="item.id">
        <view class="order-item-top">
          <view>订单号： {{item.order_sn}}</view>
          <view class="order-item-status">{{item.status_text}}</view>
        </view>
        <view class="order-goods-list">
          <view class="order-item-goods flex " v-for="gitem in item.items" :key="gitem.id">
            <image :src="gitem.goods_image" class="order-goods-cover" mode="aspectFill">
            </image>
            <view class="order-goods-info">
              <view class="order-goods-name line-2">{{gitem.goods_title}}</view>
              <view class="text-price order-goods-price">{{gitem.goods_price}}</view>
              <view class="order-goods-count">数量：x{{gitem.goods_num}}</view>
            </view>
          </view>
          <view class="flex align-center justify-end">
            <span class="text-gray">总价<span class="text-price">{{item.order_amount}}</span></span>
            <span class="margin-left">实付款<span
                class="text-price text-red text-bold text-lg">{{item.pay_fee}}</span></span>
          </view>
          <view class="flex align-center justify-end margin-top">
            <!-- <view class="cu-btn line round" :class="{'line-blue': keyw == 'pay', 'margin-left': index > 0}"
              v-for="(keyw, index) in item.btns" :key="keyw"
              @click.stop="handleOrder(keyw, item.order_sn, item.pay_fee)">
              {{orderStatus[keyw]['text']}}
            </view> -->
            <template v-if="item.status_code == 'unpaid'">
              <view class="cu-btn line round line-blue" @click.stop="handlePay(item)">立即支付</view>
            </template>
            <template v-else-if="item.status_code == 'nosend'">
              <view class="cu-btn line round line-blue" @click.stop="handleRefund(item)">申请售后</view>
            </template>
            <template v-else>
              <view class="cu-btn line round line-blue" @click.stop="getGoodsExp(item)">查看物流</view>
              <view class="cu-btn line round line-blue" @click.stop="handleRefund(item)">申请售后</view>
              <template v-if="item.status_code == 'noget'">
                <view class="cu-btn line round line-blue" @click.stop="handleConfirm(item)">确认收货</view>
              </template>
              <template v-if="item.status_code == 'nocomment'">
                <view class="cu-btn line round line-blue" @click.stop="handleComment(item)">立即评价</view>
              </template>
            </template>
            <!-- <view class="cu-btn line round line-blue" @click.stop="handleOrder(item)">
              {{statusBtn[item.status_code]['text']}}
            </view> -->
            <!--            <template v-if="item.status_code == 'nosend'">
              <view class="cu-btn line round line-blue" @click.stop="handleOrder(item)">
                {{statusBtn[item.status_code]['text']}}
              </view>
            </template> -->
          </view>
        </view>
      </view>
      <empty-hold v-if="listData.length==0"></empty-hold>
    </view>
  </scroll-view>
</template>

<script>
  import EmptyHold from '@/components/EmptyHold.vue'
  import orderStatus from '@/utils/orderStatus.js'
  export default {
    name: "OrderList",
    data() {
      return {
        TabCur: 'all',
        navList: [{
          name: '全部',
          key: 5,
          type: 'all'
        }, {
          name: '待付款',
          key: 1,
          type: 'unpaid'
        }, {
          name: '待发货',
          key: 2,
          type: 'nosend'
        }, {
          name: '待收货',
          key: 4,
          type: 'noget'
        }, {
          name: '待评价',
          key: 3,
          type: 'nocomment'
        }],
        page: 1,
        pagesize: 10,
        pageMax: false,
        listData: [],
        total: 1,
        orderStatus,
        statusBtn: {
          unpaid: {
            text: '立即支付',
            func: 'handlePay'
          },
          nosend: {
            text: '申请售后',
            func: 'handleRefund',
          },
          nocomment: {
            text: '立即评价',
            func: 'handleComment',
          },
          noget: {
            text: '确认收货',
            func: 'handleConfirm',
          }
        }
      };
    },
    components: {
      EmptyHold
    },
    onLoad(e) {
      console.log(e);
      if (e && e.type) {
        this.TabCur = e.type
      }
    },
    onShow() {
      this.getData();
    },
    methods: {
      async getGoodsExp() {
        // uni.navigateTo({
        //   url: `/pages/user/express?oid=${item.id}`
        // })
        const {
          data
        } = await this.$Api.getExpress({
          id: this.oid
        })
        console.log(data);
      },
      async handleOrder(item) {
        this[this.statusBtn[item.status_code]['func']](item)
      },
      handleComment(order) {
        const obj = {
          title: order.items[0].goods_title,
          image: order.items[0].goods_image,
          item_id: order.items[0].id,
          price: order.pay_fee
        }
        const goods = encodeURIComponent(JSON.stringify(obj))
        uni.navigateTo({
          url: `/pages/user/orderComment?oid=${order.id}&payload=${goods}`

        })
      },
      handleRefund(order) {
        console.log(order);
        uni.navigateTo({
          url: `/pages/user/applyOrder?oid=${order.id}`
        })
      },
      handlePay(item) {
        uni.navigateTo({
          url: `/pages/pay/pay?order_id=${item.order_sn}&price=${item.pay_fee}&action=goods`
        })
      },
      handleConfirm(item) {
        uni.showModal({
          title: '提示',
          content: '确认收货后，将无法退换货，是否确认收货？',
          success: async ({
            confirm
          }) => {
            if (confirm) {
              let res = await this.$Api.confirmOrder({
                id: item.id,
              })
              if (res.data.code == 1) {
                uni.showToast({
                  title: '收货成功',
                  icon: 'none',
                })
                this.getData()
              }
            }
          },
        })
      },
      scrollLower() {
        if (this.pageMax) return
        this.getData()
      },
      handleTab(item) {
        this.TabCur = item.type
        this.page = 1
        this.pageMax = false
        this.listData = []
        this.getData();
      },
      async getData() {
        let res = await this.$Api.getOrderList({
          type: this.TabCur,
          list_rows: this.pagesize,
          page: this.page
        })
        this.listData = this.listData.concat(res.data.data)
        this.total = res.data.total
        this.pageMax = this.listData.length >= this.total
        this.page++
      },
      toDetail(item) {
        uni.navigateTo({
          url: '/pages/orderDetail/orderDetail?order_sn=' + item.order_sn
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-user-order {
    height: 100vh;
    background-color: #f8f8f8;

    .order-tab {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 99;
      width: 100%;
      background-color: #f8f8f8;
    }
  }


  .order-list {
    position: relative;
    // margin-top: 16rpx;
    padding: 0 32rpx 32rpx;
    padding-top: 120rpx;
    width: 100%;
    height: calc(100vh - 104rpx);

    .order-item {
      background-color: #fff;
      border-radius: 16rpx;
      margin: 0 auto 24rpx;
      padding: 0 32rpx 32rpx;
      // box-shadow: 0 0 16rpx 16rpx rgba(0, 96, 255, 0.05);
      overflow: hidden;

      .order-item-top {
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #666666;
        // border-bottom: 1rpx solid #eee;
      }

      .order-item-status {
        font-size: 28rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #7644FF;
      }

      .line-blue {
        color: #7644FF;
        border-color: #7644FF;
        padding: 0 36rpx;
        margin-left: 12rpx;
      }

      .order-item-goods {
        margin-bottom: 24rpx;
      }

      .order-goods-cover {
        width: 160rpx;
        height: 192rpx;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        min-width: 160rpx;
        margin-right: 16rpx;
      }

      .order-goods-name {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 28rpx;
        color: #333333;
      }

      .order-goods-price {
        font-family: DIN, DIN;
        font-weight: bold;
        font-size: 36rpx;
        color: #333333;
        margin-top: 14rpx;
      }

      .order-goods-count {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #999999;
      }
    }
  }
</style>