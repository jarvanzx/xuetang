<template>
  <view class="container">
    <tt-cropper mode="free" :imageUrl="imageUrl" :width="500" :height="500" :radius="0" :delay="300" @cancel="onCancel"
      @confirm="onConfirm"></tt-cropper>
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
        topInfo: {},
        imageUrl: '',
        resultUrl: ''
      };
    },
    onLoad() {
      this.getInfo()
    },
    mounted() {
      uni.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album'],
        success: (res) => {
          this.imageUrl = res.tempFilePaths[0];
        },
        fail: (err) => {
          console.log(err)
          uni.navigateBack()
        }
      })
    },
    methods: {
      onCancel() {
        this.imageUrl = "";
        uni.navigateBack()
      },

      // 确定裁剪
      onConfirm(res) {
        console.log(res);
        this.resultUrl = res.tempFilePath;
        this.handleCrop(res)
      },
      async getInfo() {
        let res = await this.$Api.getForumCircleHeader()
        this.topInfo = res.data
      },
      handleCrop(e) {
        let token = uni.getStorageSync(TOKEN_KEY);
        uni.uploadFile({
          url: API_BASE_URL + '/api/common/upload', // 服务器上传接口
          filePath: e.tempFilePath,
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
                this.imageUrl = "";
                uni.switchTab({
                  url: '/pages/circle/circle'
                })
              })
            })
          },
          fail: (error) => {},
        });
      }
    }
  }
</script>

<style lang="scss">
  .container {
    width: 100%;
    height: 100vh;
  }
</style>