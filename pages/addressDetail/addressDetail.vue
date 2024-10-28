<template>
  <view class="page-address-detail">
    <view class="cu-list menu sm-border card-menu ">
      <view class="cu-item">
        <view class="content">
          <text class="text-grey">收货人姓名</text>
        </view>
        <view class="action">
          <input type="text" v-model="consignee" placeholder="请输入收货人姓名" />
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="text-grey">收货人电话</text>
        </view>
        <view class="action">
          <input type="text" v-model="mobile" placeholder="请输入收货人电话" />
        </view>
      </view>

    </view>
    <view class="cu-list menu sm-border card-menu margin-top">
      <view class="cu-item arrow">
        <view class="content">
          <text class="text-grey">所在地区</text>
        </view>

        <picker mode="multiSelector" v-if="oldAddressList.length>0" :value="multiIndex" :range="newAddressList"
          range-key="name" @change="pickerChange" @columnchange="pickerColumnchange">
          <view class="uni-input">
            {{newAddressList[0][multiIndex[0]].name}}-{{newAddressList[1][multiIndex[1]].name}}-{{newAddressList[2][multiIndex[2]].name}}
          </view>
        </picker>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="text-grey">详细地址</text>
        </view>
        <view class="action" @click="getLocation">
          <image src="https://jzxt.qifudaren.net/static/shop/icon-address.png" class="icon-address" mode=""></image>
        </view>
      </view>
      <textarea name="" id="" v-model="address" cols="30" rows="10" class="my-textarea" placeholder="请输入"></textarea>
    </view>
    <view class="page-fixed-footer">
      <view class="address-bottom page-footer-wrap">
        <view class="cu-btn round block btn-save" @click="toSave">保存</view>
      </view>
    </view>

  </view>
</template>

<script>
  import {
    AMAP_KEY
  } from '../../config/env';
  export default {
    data() {
      return {
        oldAddressList: [],
        newAddressList: [
          [],
          [],
          []
        ],
        multiIndex: [0, 0, 0],
        consignee: '',
        mobile: '',
        address: '',
        addressId: '',
        phoneValid: false
      }
    },
    watch: {
      mobile(val) {
        if (/^1[3456789]\d{9}$/.test(val)) {
          this.phoneValid = true;
        } else {
          this.phoneValid = false;
        }
      }
    },
    onReady() {
      if (this.addressId) {
        uni.setNavigationBarTitle({
          title: '编辑地址'
        });
      }
    },
    onLoad(options) {
      this.addressId = options?.address_id || ''
      this.getArea();
    },
    methods: {
      async getDetail() {
        let res = await this.$Api.getDetailAddress({
          id: this.addressId
        })
        this.consignee = res.data.consignee;
        this.mobile = res.data.mobile;
        this.address = res.data.address;

        for (let i = 0; i < this.oldAddressList.length; i++) {
          if (this.oldAddressList[i].name == res.data.province_name) {
            this.multiIndex[0] = i;
          }
        }
        this.newAddressList[1] = this.oldAddressList[this.multiIndex[0]].children.map((item, index) => {
          // console.log('item:',item);
          var obj = {
            name: item.name,
            value: item.id
          }
          return obj
        })
        for (let i = 0; i < this.newAddressList[1].length; i++) {
          if (this.newAddressList[1][i].name == res.data.city_name) {
            this.multiIndex[1] = i;
          }
        }
        this.newAddressList[2] = this.oldAddressList[this.multiIndex[0]].children[this.multiIndex[1]].children.map((
          item, index) => {
          var obj = {
            name: item.name,
            value: item.id
          }
          return obj
        })
        for (let i = 0; i < this.newAddressList[2].length; i++) {
          if (this.newAddressList[2][i].name == res.data.city_name) {
            this.multiIndex[2] = i;
          }
        }

      },
      getLocation() {
        console.log('getLocation');
        uni.chooseLocation({
          success: (res) => {
            console.log(res);
            // this.address = res.address
            const {
              longitude,
              latitude
            } = res
            uni.request({
              url: `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${AMAP_KEY}`,
              method: 'GET',
              success: (res) => {
                console.log(res.data);
                if (res.data.status == 1) {
                  const {
                    regeocode
                  } = res.data
                  const {
                    addressComponent,
                    formatted_address
                  } = regeocode
                  const {
                    province,
                    city,
                    district
                  } = addressComponent
                  
                  const index0 = this.oldAddressList.findIndex(item => item.name == province)
                  const index1 = this.oldAddressList[index0].children.findIndex(item => item.name == city)
                  const index2 = this.oldAddressList[index0].children[index1].children.findIndex(item => item.name == district)
                  console.log(index0,index1,index2);
                  this.newAddressList[0] = this.oldAddressList.map(item => ({name: item.name, value: item.id}))
                  this.newAddressList[1] = this.oldAddressList[index0]['children'].map(item => ({name: item.name, value: item.id}))
                  this.newAddressList[2] = this.oldAddressList[index0]['children'][index1]['children'].map(item => ({name: item.name, value: item.id}))
                  this.multiIndex = [index0, index1, index2]
                  this.address = formatted_address.split(district)[1]
                }
              },
              fail: (err) => {
                console.log(err);
              }
            })
          }
        })
      },
      getArea() {
        this.$Api.getAreaList({}).then((res) => {
          this.oldAddressList = res.data;
          this.initAddress()
          if (this.addressId) {
            this.getDetail()
          }
        });
      },
      async toSave() {
        if (this.consignee == '') {
          return uni.showToast({
            title: '请输入姓名',
            icon: 'none'
          })
        }
        if (this.mobile == '') {
          return uni.showToast({
            title: '请输入手机号码',
            icon: 'none'
          })
        }
        if (this.address == '') {
          return uni.showToast({
            title: '请输入地址',
            icon: 'none'
          })
        }
        if (!this.phoneValid) {
          return uni.showToast({
            title: '手机号码不正确',
            icon: 'none'
          })
        }
        const address = {
          consignee: this.consignee,
          mobile: this.mobile,
          address: this.address,
          province_name: this.newAddressList[0][this.multiIndex[0]].name,
          province_id: this.newAddressList[0][this.multiIndex[0]].value,
          city_name: this.newAddressList[1][this.multiIndex[1]].name,
          city_id: this.newAddressList[1][this.multiIndex[1]].value,
          district_name: this.newAddressList[2][this.multiIndex[2]].name,
          district_id: this.newAddressList[2][this.multiIndex[2]].value,
          region: this.newAddressList[0][this.multiIndex[0]].name + '-' + this.newAddressList[1][this.multiIndex[1]]
            .name + '-' + this.newAddressList[2][this.multiIndex[2]].name
        }
        if (this.addressId) {
          address['id'] = this.addressId
          let res = await this.$Api.postDetailAddress(address)
        } else {
          let res = await this.$Api.postAddress(address)
        }

        uni.navigateBack()
      },
      initAddress() {
        this.newAddressList[0] = this.oldAddressList.map((item, index) => {
          // console.log('item:',item);
          var obj = {
            name: item.name,
            value: item.id
          }
          return obj
        })
        this.newAddressList[1] = this.oldAddressList[this.multiIndex[0]].children.map((item, index) => {
          // console.log('item:',item);
          var obj = {
            name: item.name,
            value: item.id
          }
          return obj
        })
        this.newAddressList[2] = this.oldAddressList[this.multiIndex[0]].children[this.multiIndex[1]].children.map((
          item, index) => {
          // console.log('item:',item);
          var obj = {
            name: item.name,
            value: item.id
          }
          return obj
        })

      },
      pickerChange(e) {
        console.log('pickerChange:', e);
      },
      pickerColumnchange(e) {

        if (e.detail.column === 0) {
          this.multiIndex[0] = e.detail.value;

          this.newAddressList[1] = this.oldAddressList[this.multiIndex[0]].children.map((item, index) => {
            // console.log('item:',item);
            var obj = {
              name: item.name,
              value: item.id
            }
            return obj
          })
          this.newAddressList[2] = this.oldAddressList[this.multiIndex[0]].children[this.multiIndex[1]].children.map((
            item, index) => {
            // console.log('item:',item);
            var obj = {
              name: item.name,
              value: item.id
            }
            return obj
          })

          this.multiIndex.splice(1, 1, 0)
          this.multiIndex.splice(2, 1, 0)
        }
        if (e.detail.column === 1) {
          this.multiIndex[1] = e.detail.value
          this.newAddressList[2] = this.oldAddressList[this.multiIndex[0]].children[this.multiIndex[1]].children.map((
            item, index) => {
            // console.log('item:',item);
            var obj = {
              name: item.name,
              value: item.id
            }
            return obj
          })

          // 第二列 滑动 第三列 变成第一个
          this.multiIndex.splice(2, 1, 0)
        }
        if (e.detail.column === 2) {
          if (e.detail.value > 0) {
            this.multiIndex = [this.multiIndex[0], this.multiIndex[1], e.detail.value];
          }

        }
      },
    }
  }
</script>

<style lang="scss">
  .cc_area_pick_view {
    height: 400px;
    width: 100%;

  }

  .cc_area_colum_view {
    line-height: 35px;
    text-align: center;
    font-size: 28upx;
  }

  .page-address-detail {
    background-color: #f8f8f8;
    min-height: 100vh;
    overflow: hidden;

    .icon-address {
      height: 52rpx;
      width: 52rpx;
    }

    .my-textarea {
      background-color: #fff;
      width: 100%;
      padding: 32rpx;
      height: 124rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 32rpx;

      &::placeholder {
        color: #999999;
      }
    }

    .btn-save {
      width: 702rpx;
      height: 88rpx;
      background: #7644FF;
      border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 32rpx;
      color: #FFFFFF;
    }
  }
</style>