<template>
  <view class="page_pingjia2">
    <view class="zhuti">
      <view class="touxiang">
        <u--image :showLoading="true" :src="goodsInfo.image" width="80px" height="80px" @click="click"></u--image>
      </view>
      <view class="heti">
        <view class="heti-title">{{goodsInfo.title}}</view>
        <view class="heti-title ht-price">￥{{goodsInfo.price}}</view>
        <view class="text-rate">
          <view class="miaoshu" style="font-size: 12px;">服务评价</view>
          <view class="ve-rate">
            <u-rate :count="5" v-model="evaluateForm.level" :allowHalf="true" activeColor="#FE8938"
              :gutter="0"></u-rate>
          </view>
        </view>
      </view>
    </view>
    <view class="dianping">
      <view class="kuang">
        <u-textarea placeholder="请输入您的评价" v-model="evaluateForm.content" height="100" :maxlength="-1"
          confirmType="done"></u-textarea>
        <view class="space" style="width: 100%;height: 20rpx;"></view>
        <u-upload class="up-load" :fileList="fileList1" @afterRead="afterEvent" @delete="deleteEvent" multiple
          :maxCount="9"></u-upload>
      </view>
      <view class="sub-btn">
        <view class="sub-btn-tijiao" @tap="submitTap">提交</view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    API_BASE_URL,
    TOKEN_KEY
  } from '../../config/env'
  export default {
    data() {
      return {
        oid: '',
        fileList1: [],
        goodsInfo: {},
        evaluateForm: {
          images: [],
          content: '',
          level: 0,
          item_id: ''
        },
        images: [],
        count: 9
      }
    },
    onLoad(event) {
      this.oid = event.oid
      this.goodsInfo = JSON.parse(decodeURIComponent(event.payload))
      this.evaluateForm.item_id = this.goodsInfo.item_id
    },
    methods: {
      async postComment() {
        uni.showLoading()
        try {
          await this.$Api.postGoodsComment(this.oid, {
            comments: [this.evaluateForm]
          });
          uni.showToast({
            title: '评价成功',
            icon: 'none'
          })
          setTimeout(() => {
            uni.navigateBack()
          })
        } catch (e) {
          //TODO handle the exception
        } finally {
          uni.hideLoading()
        }
      },
      uploadFile() {
        const token = uni.getStorageSync(TOKEN_KEY);
        Promise.all(this.fileList1.map(item => {
          return new Promise((resolve, reject) => {
            uni.uploadFile({
              url: API_BASE_URL + '/api/common/upload', // 服务器上传接口
              filePath: item.url,
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
          this.evaluateForm.images = imgs
          this.postComment()
        })
      },
      // 删除图片
      deleteEvent(event) {
        this.fileList1.splice(event.index, 1)
      },
      // 新增图片
      async afterEvent(event) {
        console.log(event);
        this.fileList1 = this.fileList1.concat(event.file)
        this.count = this.count - event.file.length
      },

      submitTap() {
        if (!this.evaluateForm.content) {
          uni.showToast({
            title: '评价内容不能为空！',
            icon: 'none'
          })
          return
        }
        this.uploadFile()
      },
    }
  }
</script>

<style scoped lang="scss">
  .page_pingjia2 {
    height: 100vh;
    width: 100vw;
    background-color: #F4F4F6;

    .pingjia2 {
      color: #fff;

    }

    .zhuti {
      display: flex;
      align-items: center;
      height: 200rpx;
      width: 100%;
      background-color: #ffffff;
    }

    .ve-rate {
      margin-left: 5px;
    }

    .kuang {
      padding-top: 30rpx;
      width: 100%;
      padding: 30rpx 10px 10rpx;
    }

    .up-load {
      margin-top: 30rpx;
      margin-bottom: 20rpx;
    }


    .dianping {
      margin-top: 20rpx;
      height: 100%;
      width: 100%;
      background-color: #ffffff;
      position: relative;
    }

    .miaoshu {
      margin-top: 3px;
      display: flex;
      color: #888888;
    }

    .heti {
      width: 100%;
      margin-left: 15px;

      .heti-title {
        width: 100%;
        font-size: 14px;
        font-weight: 600;
      }

      .ht-price {
        margin-top: 20rpx;
      }

      .text-rate {
        display: flex;
        align-items: center;
        margin-top: 20rpx;
      }

    }

    .touxiang {
      margin-left: 10px;
    }



    .sub-btn {
      width: 100%;
      position: fixed;
      bottom: 120rpx;

      .sub-btn-tijiao {
        box-shadow: 0rpx 5rpx 10rpx rgba(118, 68, 255, 0.4);
        width: 90%;
        margin: 0 auto;
        height: 80rpx;
        border-radius: 50rpx;
        background-color: #7644FF;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>