<template>
  <view class="page-offline-classes">
    <view class="class-list">
      <view class="class-item bg-white" v-for="(item, index) in list" :key="item.id">
        <view class="class-item-title">{{item.name}}</view>
        <view class="class-item-desc">
			{{!item.isExpand?item.introduce1:item.introduce}}
        </view>
		<view class="link" v-if="item.isShow" @click="showBack(index)">{{!item.isExpand?'展示':'收起'}}</view>
        <view class="class-item-medias">
          <view class="class-media-item">
            <image :src="item.thumb_image" @click="viewImg(item.thumb_image)" class="class-media-img" mode="aspectFill"></image>
          </view>
        </view>
        <view class="handle flex justify-end">
          <view style="width: 200rpx;">
            <u-button size="small" text="报名" color="#8740FF" @click="toRepost(item.id)"></u-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        page: 1,
        pagesize: 100,
        pageMax: false
      };
    },
    onLoad() {
      this.getList()
    },
    onReachBottom() {
      if (!this.pageMax) {
        this.getList()
      }
    },
    methods: {
      toRepost(id) {
        // this.$Api.createOfflineOrder({course_id: id})
        uni.navigateTo({
          url: '/pages/sub-nav/enroll?id=' + id
        })
      },
      async getList() {
        let {
          data
        } = await this.$Api.getOfflineCourse()
        if (Array.isArray(data?.data) && data.data.length > 0) {
          const list = data.data.map(item => {
            item.exp = false
            return item
          })
          this.list = this.list.concat(list);
		  
		  this.list.forEach((v,i)=>{
			  if(v.introduce.length>60){
				  this.$set(this.list[i],'introduce1',v.introduce.slice(0, 60)+ "...");
				  this.$set(this.list[i],'isShow',true);
				  this.$set(this.list[i],'isExpand',false);
			  }else{
				 this.$set(this.list[i],'isShow',false);
				 this.$set(this.list[i],'isExpand',true);
			  }
		  })
		  
          this.pageMax = this.list.length >= data.total
          this.page++
        }
      },
	  
	  showBack(index){
		  console.log(this.list[index].isShow)
		  this.list[index].isExpand = !this.list[index].isExpand
	  },
	  
      toExp(idx) {
        this.$set(this.list, idx, {
          ...this.list[idx],
          exp: true
        })
      },
	  viewImg(url){
		  uni.previewImage({
		  	urls:[url]
		  })
	  }
    }
  }
</script>

<style lang="scss">
	.ellipsis-multiline {
	  display: -webkit-box;
	  -webkit-box-orient: vertical;
	  -webkit-line-clamp: 3;
	  max-height:200rpx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	}
	
	
  .page-offline-classes {
    min-height: 100vh;
    background-color: #f8f8f8;
    padding: 16rpx 32rpx;
    overflow: hidden;

    .class-item {
      border-radius: 16rpx;
      padding: 32rpx;
      margin-bottom: 16rpx;
    }

    .class-item-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 32rpx;
      color: #000000;
    }

    .class-item-desc {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      line-height: 32rpx;
      color: #333333;
      margin-top: 16rpx;
      position: relative;
    }
    
    .text-block{
      max-height: 96rpx;
    }

    .btn-exp {
      text-align: right;
      // position: absolute;
      // right: 0;
      // bottom: 0;
    }

    .class-item-medias {
      margin-top: 24rpx;
      display: flex;
      flex-wrap: wrap;
    }

    .class-media-item {
      width: 205rpx;
      height: 205rpx;
      min-width: 205rpx;
      border-radius: 8rpx;
      margin-right: 4rpx;
      margin-bottom: 4rpx;
      overflow: hidden;

      .class-media-img {
        width: 205rpx;
        height: 205rpx;
      }

      &:nth-child(3n) {
        margin-right: 0;
      }
    }
	.link{
		color: rgb(41, 121, 255);
		margin-top:10rpx;
	}
  }
</style>