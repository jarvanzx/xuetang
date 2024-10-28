<template>
  <view class="container bg-gray-f8">
    <view class="box-wrap info">
      <view class="info-item">
        <view class="label">联系人</view>
        <input v-model="name" type="text" class="ipt" placeholder="请输入联系人" />
      </view>
      <view class="info-item">
        <view class="label">联系电话</view>
        <input v-model="mobile" type="number" class="ipt" placeholder="请输入手机号" />
      </view>
    </view>
    <view class="box-wrap remark">
      <view class="label">备注</view>
      <textarea v-model="remark" class="ipt-area" placeholder="输入备注"></textarea>
    </view>
    
    <view class="handle-area flex align-center justify-between safe-area">
<!--      <view class="price">1247</view> -->
      <view class="submit-btn" @click="submit">报名</view>
    </view>
  </view>
</template>

<script>
	import {request} from "@/utils/request.js"
  export default {
    data() {
      return {
        courseId: '',
        name: '',
        mobile: '',
        remark: ''
      };
    },
    onLoad(options) {
      this.courseId = options.id
    },
	methods:{
		submit(){
			
			
			if(!this.name || !this.mobile){
				this.$u.toast('联系人，联系电话都不能为空');
				return;
			}
			
			
			
			request("/api/xiluedu.offline_order/create_order", "post", {
				offline_course_id:this.courseId,
				username:this.name,
				mobile:this.mobile,
				user_note:this.remark
			}).then(res=>{
				if(res){
					if(res.code==1){
						this.$u.toast('报名成功');
						
						setTimeout(()=>{
							uni.navigateBack()
						},500)
					}else{
						this.$u.toast(res.msg);
					}
					
				}
			})
			
		}
	}
  }
</script>

<style lang="scss" scoped>
.bg-gray-f8{
  background-color: #f8f8f8;
  padding-top: 24rpx;
}
.box-wrap{
  width: calc(100% - 48rpx);
  margin: 0 auto;
  background-color: #ffffff;
  padding: 0 32rpx;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  
  .info-item{
    width: 100%;
    padding: 30rpx 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    
    &::after{
      position: absolute;
      content: "";
      width: 100%;
      height: 1px;
      left: 0;
      bottom: -0.5px;
      background-color: #eeeeee;
    }
    &:last-child::after{
      display: none;
    }
    
    .label{
      color: #333333;
      font-size: 32rpx;
    }
    .ipt{
      text-align: right;
      font-size: 30rpx;
    }
  }
  
}
.remark{
  padding-bottom: 30rpx;
  .label{
    width: 100%;
    padding: 30rpx 0;
    color: #333333;
    font-size: 32rpx;
  }
  
  .ipt-area{
    width: 100%;
    min-height: 156rpx;
    color: #333333;
    font-size: 32rpx;
  }
}
.handle-area{
  width: 750rpx;
  height: 180rpx;
  background-color: #ffffff;
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 24rpx;
  
  .price{
    font-weight: bold;
    font-size: 40rpx;
    color: #FF2E00;
    position: relative;
    &::before{
      content: "￥";
      font-size: 28rpx;
    }
  }
  .submit-btn{
    width: 100%;
    height: 88rpx;
    background: #7644FF;
    border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #FFFFFF;
    line-height: 38rpx;
    text-align: center;
    font-style: normal;
    line-height: 88rpx;
  }
}
</style>
