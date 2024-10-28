<template>
  <view>
    <web-view :src="webUrl"></web-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        webUrl: ''
      }
    },
    onLoad(query) {
      const uri = decodeURIComponent(query.url)
      this.webUrl = uri
    },
    methods: {
      
    }
  }
</script>

<style>

</style>
