<template>
  <view class="container">
    <view>
      <view class="form-group">
        <label class="label">订单信息</label>
        <view class="order-item-goods flex" v-for="gitem in orderInfo.items" :key="gitem.id">
          <image :src="gitem.goods_image" class="order-goods-cover" mode="aspectFill">
          </image>
          <view class="order-goods-info">
            <view class="order-goods-name line-2">{{gitem.goods_title}}</view>
            <view class="text-price order-goods-price">{{gitem.goods_price}}</view>
            <view class="order-goods-count">数量：x{{gitem.goods_num}}</view>
          </view>
        </view>
      </view>
      <view class="form-group">
        <label class="label" for="mobile">联系方式</label>
        <input type="number" class="input-box" id="mobile" v-model="form.mobile" placeholder="请输入手机号">
      </view>
      <view class="form-group flex justify-between align-center">
        <label class="label">售后原因</label>
        <view class="right-cnt flex align-center" @click="show=true">
          <view class="cnt">{{form.reason || '请选择'}}</view>
          <image src="/static/common/arrow-right.png" mode="aspectFill" class="icon-36"></image>
        </view>
      </view>
      <view class="form-group">
        <label class="label">问题描述</label>
        <textarea class="textarea" v-model="form.content"></textarea>
      </view>
      <view class="form-group">
        <label class="label">上传图片</label>
        <view class="image-box">
          <view class="image-item" v-for="(item, index) in images" :key="index">
            <image :src="item" mode="aspectFill" style="width: 100%;height: 100%;"></image>
            <image src="/static/common/clear.png" mode="aspectFill" class="icon-44 icon-close"
              @click.stop="deleteImg(index)"></image>
          </view>
          <view class="image-item upload flex justify-center align-center" @click="chooseImg">
            <image src="/static/common/plus.png" mode="aspectFill" class="icon-44"></image>
          </view>
        </view>
      </view>
      <view class="form-group">
        <button class="button" @click="submitForm">提交申请</button>
      </view>
    </view>
    <u-popup :show="show" closeable>
      <view class="wrap">
        <view class="title">选择退款原因</view>
        <view class="reasons">
          <view class="reason flex align-center justify-between" v-for="(reason, index) in reasons" :key="index"
            @click="selectReason(index)">
            <view class="reason-txt">{{ reason }}</view>
            <view class="iconfont icon-check">
              <image v-if="resaonIndex === index" src="/static/common/checked.png" mode="aspectFill" class="icon-44">
              </image>
              <image v-else src="/static/common/check.png" mode="aspectFill" class="icon-44"></image>
            </view>
          </view>
        </view>
        <view class="button-confirm" @click="confirm">确定</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
  import {
    API_BASE_URL,
    TOKEN_KEY
  } from '../../config/env';
  export default {
    data() {
      return {
        show: false,
        images: [],
        orderInfo: {},
        reasons: [
          '与商家协商一致',
          '商品破损/包装问题',
          '快递未送达',
          '未按约定时间发货',
          '商家发错货',
          '少件/漏发',
          '其他原因'
        ],
        form: {
          type: 'refund',
          order_id: '',
          reason: '',
          content: '',
          images: [],
          order_item_id: '',
          mobile: ''
        },
        resaonIndex: '',
        count: 9
      }
    },
    onLoad(query) {
      if (query.oid) {
        this.form.order_id = query.oid
        this.getDetail()
      }
    },
    methods: {
      async postApply() {
        await this.$Api.applyAftersale(this.form)
        uni.showToast({
          title: '申请成功',
          icon: 'success',
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      },
      uploadFile() {
        const token = uni.getStorageSync(TOKEN_KEY);
        Promise.all(this.images.map(item => {
          return new Promise((resolve, reject) => {
            uni.uploadFile({
              url: API_BASE_URL + '/api/common/upload', // 服务器上传接口
              filePath: item,
              name: 'file', // 必须填写，后台用来接收文件
              formData: {
                // 其他POST请求中的额外参数
              },
              header: {
                token: token
              },
              success: (uploadFileRes) => {
                console.log(uploadFileRes.data, uploadFileRes);
                resolve(uploadFileRes);
              },
              fail: (error) => {
                reject(error);
              },
            });
          })
        })).then(async (results) => {
          const imgs = results.map(item => {
            const temp = JSON.parse(item.data)
            return temp.data.fullurl
          })
          this.form.images = imgs
          this.postApply()
        })
      },
      deleteImg(idx) {
        this.images.splice(idx, 1)
      },
      chooseImg() {
        uni.chooseImage({
          count: this.count,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            this.images = this.images.concat(res.tempFilePaths)
            this.count -= res.tempFilePaths.length
          }
        })
      },
      selectReason(index) {
        this.resaonIndex = index
      },
      confirm() {
        this.form.reason = this.reasons[this.resaonIndex]
        this.show = false
      },
      async getDetail() {
        const {
          data
        } = await this.$Api.getDetailOrder({
          id: this.form.order_id
        })
        console.log(data);
        this.orderInfo = data
        this.form.order_item_id = this.orderInfo.items[0]?.id
      },
      submitForm() {
        uni.showLoading()
        try {
          if (!this.form.reason) {
            return uni.showToast({
              title: '请选择退款原因',
              icon: 'none',
            })
          }
          this.uploadFile()
        } catch (e) {
          //TODO handle the exception
        } finally {
          uni.hideLoading()
        }
        // 在这里处理表单提交逻辑
        // 可以将表单数据发送到后端进行处理
        console.log(this.orderId, this.reason, this.description, this.image)
      },
      uploadImage(e) {
        // 处理图片上传逻辑
        const file = e.target.files[0]
        // 可以将文件上传到后端或者进行其他处理
        this.image = file
      }
    }
  }
</script>

<style lang="scss">
  .container {
    padding: 20px;
  }

  .form-group {
    margin-bottom: 20px;

    .image-box {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 10rpx;

      .image-item {
        width: 160rpx;
        height: 160rpx;
        border-radius: 8rpx;
        position: relative;

        .icon-close {
          padding: 4rpx;
          position: absolute;
          top: 0;
          right: 0;
        }
      }

      .upload {
        border: 1px dashed #ccc;
      }
    }
  }

  .label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .order-item-goods {
    margin-bottom: 24rpx;
  }

  .order-goods-cover {
    width: 160rpx;
    height: 160rpx;
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

  .input,
  .textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .input-box {
    height: 58rpx;
    border: 1px solid #ccc;
    border-radius: 8rpx;
    padding: 0 20rpx;
  }

  .button {
    width: 100%;
    height: 88rpx;
    background-color: #7644FF;
    color: #fff;
    border: none;
    border-radius: 44rpx;
  }

  .wrap {
    padding: 40rpx 30rpx;

    .title {
      font-weight: bold;
      font-size: 32rpx;
      color: #333333;
      padding: 10rpx 0;
    }

    .reasons {
      width: 100%;
      margin: 10rpx auto;

      .reason {
        margin-bottom: 16rpx;
      }
    }

    .button-confirm {
      margin-top: 40rpx;
      width: 100%;
      height: 68rpx;
      background: #7644FF;
      color: #fff;
      border-radius: 12rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>