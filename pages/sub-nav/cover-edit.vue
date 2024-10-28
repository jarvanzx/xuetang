<template>
  <view class="page-setting">
    <view class="cu-list menu sm-border card-menu margin-top">
      <view class="cu-item arrow" @click="toPhoto">
        <view class="content">
          <text class="text-black">选择图片</text>
        </view>
      </view>
      <!--      <view class="cu-item arrow" @click="fromAlbum('camera')">
        <view class="content">
          <text class="text-black">拍一个</text>
        </view>
      </view> -->
      <view class="cu-item arrow" @click="toEditSign">
        <view class="content">
          <text class="text-black">修改签名</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    TOKEN_KEY,
    API_BASE_URL
  } from '../../config/env';
  export default {
    data() {
      return {
        topInfo: {}
      };
    },
    onLoad() {
      // this.getInfo()
    },
    methods: {
      toPhoto() {
        uni.navigateTo({
          url: '/pages/sub-nav/coverCrop'
        })
      },
      toEditSign() {
        uni.navigateTo({
          url: '/pages/sub-nav/edit-sign'
        })
      },
      async getInfo() {
        let res = await this.$Api.getForumCircleHeader()
        this.topInfo = res.data
      },
      fromAlbum(type) {
        let token = uni.getStorageSync(TOKEN_KEY);
        uni.chooseImage({
          count: 1,
          sourceType: [type],
          crop: {
            width: 300,
            height: 300,
            quality: 100,
            // 裁剪框的宽度，如果 0-1 表示比例，1-表示像素值
            // width: 1,
            // 裁剪框的高度，如果 0-1 表示比例，1-表示像素值
            // height: 1,
            // 裁剪框的左上角x坐标，如果 0-1 表示比例，1-表示像素值
            // x: 0, 
            // 裁剪框的左上角y坐标，如果 0-1 表示比例，1-表示像素值
            // y: 0,
            // 是否显示网格线
            grid: true,
            // 是否显示裁剪框中的虚线
            frame: true,
            // 是否显示旋转图标
            rotate: true,
            // 是否显示裁剪框中的比例尺
            // scale: true,
            // 是否可以移动裁剪框
            // moveable: true,
            // 是否可以缩放裁剪框
            // zoom: true,
          },
          success: (res) => {
            console.log(res.tempFilePaths[0])
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
                this.$Api.postSaveCircle({
                  cover_img_url: temp.data.fullurl,
                  sign: this.topInfo.sign
                }).then(() => {
                  uni.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 1500
                  }).finally(() => {
                    uni.navigateBack()
                  })
                })
              },
              fail: (error) => {},
            });
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .page-setting {
    background-color: #F8F8F8;
    overflow: hidden;
    min-height: 100vh;
  }
</style>