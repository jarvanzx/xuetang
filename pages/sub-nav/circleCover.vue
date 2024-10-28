<template>
  <view class="page-circle-cover">
    <view class="status-bar" :style="{paddingTop: statusBarHeight + 'px'}" @click="toBack">
      <image src="/static/common/back.png" class="icon-back" mode="aspectFill"></image>
    </view>
    <image :src="backImg"
      class="circle-cover-top" @click="toUpload" mode="aspectFill"></image>
    <!--<image src="https://jzxt.qifudaren.net/static/temp/cicle/c-1.png" class="circle-cover-top" ></image>-->
    <view class="sign-box">
      <u--textarea v-model="sign" placeholder="请输入签名" ></u--textarea>
    </view>
    <view class="cu-btn block round release-btn save-btn" @click="onSave">保存</view>
    <view class="cu-btn block round release-btn " @click="toBack">取消</view>
  </view>
</template>

<script>
  import {
    API_BASE_URL,
    ENV_VERSION,
    USER_ID_KEY,
    TOKEN_KEY,
    FROM
  } from "../../config/env"

  export default {
    data() {
      return {
        topInfo: {},
        statusBarHeight: 44,
        sign: '',
        backImg: ''
      };
    },
    onLoad() {
      this.statusBarHeight = uni.getWindowInfo().statusBarHeight
      this.getInfo()
    },
    methods: {
      async getInfo() {
        let res = await this.$Api.getForumCircleHeader()
        this.topInfo = res.data
        this.sign = res.data.sign
        this.backImg = res.data.cover_img_url ?? 'https://jzxt.qifudaren.net/static/temp/cicle/c-1.png'
      },
      toBack() {
        uni.navigateBack()
      },
      toUpload() {
        const that = this;
        let token = uni.getStorageSync(TOKEN_KEY);
        uni.chooseImage({
          count: 1, //默认1
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          //sourceType: ['album'], //从相册选择
          success: function(res) {
            uni.uploadFile({
              url: API_BASE_URL + '/api/common/upload', // 服务器上传接口
              filePath: res.tempFilePaths[0],
              name: 'file', // 必须填写，后台用来接收文件
              formData: {
                // 其他POST请求中的额外参数
              },
              header: {
                token: token
              },
              success: (uploadFileRes) => {
                console.log(uploadFileRes.data, uploadFileRes);
                let temp = JSON.parse(uploadFileRes.data);
                that.backImg = temp.data.fullurl
              },
              fail: (error) => {},
            });
          }
        });
      },
      onSave() {
        this.$Api.postSaveCircle({
          cover_img_url: this.backImg,
          sign: this.sign
        }).then(() => {
          this.getInfo()
          uni.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          uni.navigateBack()
        })
      }
    }
  }
</script>

<style lang="scss">
  .page-circle-cover {
    width: 100%;
    height: 100vh;
    
    .sign-box{
      width: 100%;
      padding: 0 24rpx;
      margin-top: 16rpx;
    }
    .status-bar{
      width: 100%;
      height: 42px;
      background-color: transparent;
      position: absolute;
      z-index: 99;
      box-sizing: content-box;
      
      .icon-back{
        width: 52rpx;
        height: 52rpx;
        position: absolute;
        left: 32rpx;
        bottom:16rpx;
      }
    }
    .circle-cover-top {
      width: 100%;
      height: 588rpx;
    }

    .release-btn {
      width: 686rpx;
      height: 88rpx;
      line-height: 88rpx;
      margin: 32rpx auto 0;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 36rpx;
      background: #FFFFFF;
      border: 2rpx solid #DDDDDD;
    }

    .save-btn {
      background: #7644FF;
      color: #FFFFFF;
      margin-top: 140rpx;
    }
  }
</style>