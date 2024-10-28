<template>
  <view class="agreement safe-area">
    <rich-text :nodes="htmlStr"></rich-text>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        htmlStr: '',
        agreeType: ''
      };
    },
    onLoad(query) {
      this.agreeType = query.type
      this.getAgreement()
      uni.setNavigationBarTitle({
        title: query.title
      })
    },
    methods: {
      async getAgreement() {
        const res = await this.$Api.getAgreement({
          biaoshi: this.agreeType
        })
        this.htmlStr = res.data.content
      }
    }
  }
</script>

<style lang="scss">
.agreement{
  padding: 32rpx;
}
</style>
