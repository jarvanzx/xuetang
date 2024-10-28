<template>
  <view class="page-cart has-combtn-padding">
    <!-- <checkbox-group @change="checkbox_change"> -->
    <!--    <view class="handle-line flex justify-between align-center">
      <view class="delete-btn" v-if="managed">删除</view>
      <view class="hold" style="width: 1rpx; height: 1rpx;"></view>
      <view class="manage" @click="managed = !managed">管理</view>
    </view> -->
    <view class="flex padding-sm bg-white goods-item" v-for="item in list" :key="item.id">
      <view class="check-box">
        <image :src="`https://jzxt.qifudaren.net/static/shop/icon-${item.checked ? 'has' : 'no'}.png`"
          @click="toCheck(item)" class="icon-32 margin-right-8" mode=""></image>
        <!--        <image src="https://jzxt.qifudaren.net/static/shop/icon-no.png" @click="toCheck(item)"
          class="icon-32 margin-right-8" v-else mode=""></image> -->
      </view>
      <!-- 	<checkbox class="red checked round" :value="item.goodsId" @click.stop=""
					:checked="item.checked ? true : false" style="transform:scale(0.7);" /> -->
      <image :src="item.goods.image" @click="toDetail(item.goods_id)" class="goods-img" mode="aspectFill"></image>
      <view class="flex goods-right">
        <view class="goods-title" @click="toDetail(item.goods_id)">{{ item.goods.title }}</view>
        <view class="flex align-center justify-between">
          <view class="text-price text-red">{{ item.snapshot_price }}</view>
          <uni-number-box :min="1" :max="100" :value="item.goods_num"
            @change="(e) => valChange(e, item)"></uni-number-box>
        </view>
        <image src="/static/common/remove.png" mode="aspectFill" class="icon-remove icon-36"
          @click.stop="removeGoods(item)"></image>
      </view>
    </view>
    <!-- </checkbox-group> -->
    <view class="page-fixed-footer">
      <view class="cart-bottom page-footer-wrap">
        <view @click="checkAll" class="flex align-center">
          <image src="https://jzxt.qifudaren.net/static/shop/icon-has.png" class="icon-32 margin-right-8" v-if="hasAll"
            mode=""></image>
          <image src="https://jzxt.qifudaren.net/static/shop/icon-no.png" class="icon-32 margin-right-8" v-else mode="">
          </image>
          <text>全选</text>
        </view>
        <!-- <label @click="checkAll">
					<checkbox class="red checked round"
						:checked="selectList.length === list.length && list.length >0 ? true: false"
						style="transform:scale(0.7);" /><text>全选</text>
				</label> -->
        <view class="text-right check-out">
          <view>
            合计
            <text class="text-price text-red">{{ allPrice }}</text>
          </view>
        </view>
        <view class="cu-btn round btn-submit" @click="toSave">结算</view>
      </view>
    </view>
    <empty-hold v-if="list.length == 0"></empty-hold>
  </view>
</template>

<script>
  import EmptyHold from '../../components/EmptyHold.vue';
  export default {
    data() {
      return {
        list: [],
        selectList: [],
        number: 1,
        goodsList: [],
        managed: false,
      };
    },
    computed: {
      allPrice() {
        const price = this.list.reduce((total, item) => {
          if (item.checked) {
            total += item.goods_num * item.snapshot_price;
          }
          return total;
        }, 0);
        return price.toFixed(2);
      },
      hasAll() {
        return this.list.every(item => item.checked == true)
      }
    },
    components: {
      EmptyHold
    },
    onLoad() {
      uni.showLoading({
        title: '加载中...',
        icon: 'none'
      });
      this.getCartList();
    },
    methods: {
      async removeGoods(param) {
        uni.showLoading()
        await this.$Api.cartDelete({
          id: param.id
        })
        this.getCartList()
        uni.hideLoading()
      },
      toSave() {
        let temp = [];
        this.list.forEach((el) => {
          if (el.checked) {
            temp.push(el);
          }
        });
        if (temp.length == 0) {
          return uni.showToast({
            title: '请先选择商品',
            icon: 'none'
          });
        }
        let param = [];
        temp.forEach((el) => {
          param.push({
            goods_id: el.goods_id,
            goods_num: el.goods_num,
            goods_sku_price_id: el.goods_sku_price_id
          });
        });
        let paramtemp = {
          order_type: 'goods',
          from: 'cart',
          goods_list: param
        };

        uni.navigateTo({
          url: '/pages/confirmOrder/confirmOrder?data=' + JSON.stringify(paramtemp)
        });
      },
      toDetail(id) {
        uni.navigateTo({
          url: '/pages/goodsDetail/goodsDetail?goodsId=' + id
        });
      },
      toCheck(item) {
        item.checked = !item.checked;
        this.$forceUpdate();
      },

      async getCartList() {
        let res = await this.$Api.getCart({});
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].checked = false;
        }
        this.list = res.data;
        uni.hideLoading();
      },
      checkbox_change(e) {
        this.selectList = e.detail.value;
        console.log('checkbox_change', e);
      },
      fnThrottle(fn, delay, duration) {
        let that = this;
        let timer = this.timer;
        let begin = Date.now();
        return function() {
          let context = that;
          let args = arguments;
          let current = Date.now();
          clearTimeout(timer);
          if (current - begin >= duration) {
            fn.apply(context, args);
            begin = current;
          } else {
            that.timer = setTimeout(function() {
              fn.apply(context, args);
            }, delay);
          }
        };
      },
      valChange(e, item) {
        this.fnThrottle(this.changeCount, 300)(e, item);
        console.log('valChange', e, item);
      },
      calcTotalPrice() {
        let total = 0;
        this.list.map((el) => {
          if (el.checked) {
            total += +el.goods_num * +el.snapshot_price;
          }
        });
      },
      async changeCount(e, item) {
        let that = this;
        console.log(item.goods_num, 'deee');
        const idx = this.list.findIndex((goods) => goods.id == item.id);
        let prev = 0;
        if (idx > -1) {
          prev = this.list[idx].goods_num;
          this.list[idx].goods_num = e;
        }
        await this.$Api
          .postUpdateCart({
            goods_id: item.goods_id,
            goods_num: e,
            goods_sku_price_id: item.goods_sku_price_id,
            type: 'cover'
          })
          .catch((err) => {
            uni.showToast({
              title: err?.msg || '修改失败',
              icon: 'none'
            });
            this.list[idx].goods_num = prev;
          });
      },
      //全选
      checkAll() {
        this.list = this.list.map((el) => {
          return {
            ...el,
            checked: !el.checked
          };
        });
        // if (this.hasAll) {
        //   this.list = this.list.map((el) => {
        //     return {
        //       ...el,
        //       checked: !el.checked
        //     }
        //   })
        //   this.hasAll = false
        // } else {
        //   this.list = this.list.map((el) => {
        //     return {
        //       ...el,
        //       checked: true
        //     }
        //   })
        //   this.hasAll = true
        // }
        // this.$forceUpdate()
      }
    }
  };
</script>
<style lang="scss">
  .page-cart {
    min-height: 100vh;
    padding: 0 32rpx;
    background-color: #f8f8f8;

    .handle-line {
      height: 54rpx;
      margin-bottom: 20rpx;

      .delete-btn {
        font-size: 26rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        width: 124rpx;
        height: 54rpx;
        background: #7644ff;
        border-radius: 27rpx;
        text-align: center;
        line-height: 54rpx;
      }
    }

    .btn-submit {
      width: 192rpx;
      height: 68rpx;
      background: #7644ff;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 32rpx;
      color: #ffffff;
    }

    .cart-item-title {
      background-color: #fff;
      padding-left: 32rpx;
      line-height: 40rpx;
      font-size: 32rpx;
      padding-top: 16rpx;
    }

    .cart-bottom {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      font-size: 24rpx;
      padding: 0 32rpx;
    }

    .goods-item {
      color: #333;
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;
      border-radius: 16rpx;

      .goods-img {
        height: 150rpx;
        width: 150rpx;
        min-width: 150rpx;
        margin-right: 16rpx;
        background-color: #eee;
        border-radius: 16rpx;
      }

      .goods-right {
        flex: 1;
        height: 150rpx;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
      }

      .goods-title {
        width: 400rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        color: #333;
      }

      .icon-remove {
        position: absolute;
        right: 10rpx;
        top: 30%;
      }
    }

    .check-out {
      font-size: 14px;
    }
  }
</style>