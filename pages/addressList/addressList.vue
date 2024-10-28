<template>
  <view class="page-address-list has-combtn-padding">
    <view class="address-list-wrap">
      <view class="confirm-address flex align-center justify-between" v-for="(item, index) in datalist" :key="item.id"
        @click="chooseAddress(item.id)">
        <image src="https://jzxt.qifudaren.net/static/shop/icon-has.png" v-if="curIndex === index"
          @click.stop="toSelect(index)" class="icon-location" mode="aspectFill"></image>
        <image src="https://jzxt.qifudaren.net/static/shop/icon-no.png" v-else @click="toSelect(index)"
          class="icon-location" mode="aspectFill"></image>
        <view class="address-info">
          <view class="address-info-detail line-2">
            {{item.province_name}}{{item.city_name}}{{item.district_name}}{{item.address}}
          </view>
          <view class="address-info-user flex align-center">
            <view>{{item.consignee}}</view>
            <view class="margin-left">{{item.mobile}}</view>
          </view>
        </view>
        <image src="https://jzxt.qifudaren.net/static/shop/icon-edit.png" class="icon-right" @click.stop="toDetail(item)"
          mode=""></image>
      </view>
    </view>
    <view class="page-fixed-footer">
      <view class="address-bottom page-footer-wrap">
        <view class="cu-btn round " @click="toAdd">新增地址</view>
        <view class="cu-btn round btn-submit" @click="goDetail">确认选择</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        curIndex: -1,
        datalist: [],
        addressId: ''
      };
    },
    onLoad(options) {
      if(options.address_id) {
        this.addressId = options.address_id
      }
    },
    onShow() {
      this.getList();
    },
    methods: {
      async goDetail() {
        if (this.curIndex != -1) {
          const address = this.datalist[this.curIndex]
          address.is_default = true
          let res = await this.$Api.postDetailAddress(address)
          uni.navigateBack()
        } else {
          uni.showToast({
            title: '请选择地址',
            icon: 'none'
          })
        }

      },
      async getList() {
        let res = await this.$Api.getAddressList();
        this.datalist = res.data
        this.curIndex = this.datalist.findIndex(item => item.id == this.addressId)
      },
      toDetail(item) {
        uni.navigateTo({
          url: '/pages/addressDetail/addressDetail?address_id=' + item.id
        })
      },
      chooseAddress(id) {
        uni.$emit('chooseAddress', id)
      },
      toAdd() {
        uni.navigateTo({
          url: '/pages/addressDetail/addressDetail'
        })
      },
      toSave() {
        uni.navigateBack()
      },
      toSelect(index) {
        if (index === this.curIndex) {
          this.curIndex = -1
        } else {
          this.curIndex = index
        }
      }
    }
  }
</script>

<style lang="scss">
  .page-address-list {
    min-height: 100vh;
    background-color: #f8f8f8;

    .address-bottom {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      font-size: 24rpx;
      padding: 0 32rpx;

      .cu-btn {
        width: 335rpx;
        height: 88rpx;
        background: #FFFFFF;
        border: 2rpx solid #DDDDDD;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 32rpx;
        color: #333333;
      }

      .btn-submit {
        background: #7644FF;
        color: #fff;
      }
    }

    .confirm-address {
      background-color: #fff;
      border-radius: 16rpx;
      width: 686rpx;
      height: 200rpx;
      padding: 24rpx;
      margin: 0 auto 16rpx;

      .address-info {
        flex: 1;
        padding: 0 32rpx;
      }

      .address-info-detail {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 32rpx;
        color: #000000;
      }

      .address-info-user {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #666666;
        margin-top: 8rpx;
      }

      .icon-location {
        height: 36rpx;
        width: 36rpx;
      }

      .icon-right {
        height: 52rpx;
        width: 52rpx;
      }
    }
  }
</style>