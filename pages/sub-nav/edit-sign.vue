<template>
  <view class="container padding-lr-sm">
    <view class="handle-line flex justify-end align-center" style="height: 44px;">
      <view class="save-btn" :class="{disabled: disabled}" @click="toSave">保存</view>
    </view>
    <view class="input-line margin-top-xs padding-tb-sm u-border-bottom">
      <input class="flex-1" type="text" v-model="sign" placeholder="请输入签名" />
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        sign: '',
        topInfo: {},
      };
    },
    onLoad() {
      this.getInfo()
    },
    computed: {
      disabled() {
        return this.sign == '' || this.sign == this.topInfo.sign
      }
    },
    methods: {
      async getInfo() {
        let res = await this.$Api.getForumCircleHeader()
        this.topInfo = res.data
        this.sign = res.data.sign
      },
      toSave() {
        if (this.disabled) return
        uni.showLoading({
          title: '保存中',
          mask: true
        })
        this.$Api.postSaveCircle({
          sign: this.sign,
          cover_img_url: this.topInfo.cover_img_url,
        }).then(res => {
          uni.hideLoading()
          uni.showToast({
            title: '保存成功'
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 1000)
        }).catch(err => {
          uni.hideLoading()
        })
      }
    }
  }
</script>

<style lang="scss">
  .save-btn {
    width: 140rpx;
    height: 68rpx;
    background-color: #7644FF;
    color: #fff;
    font-size: 28rpx;
    text-align: center;
    line-height: 68rpx;
    border-radius: 34rpx;
    ;
  }

  .disabled {
    opacity: 0.7;
  }
</style>