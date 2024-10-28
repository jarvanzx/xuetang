<template>
	<view class="page">
		<view class="label">选择反馈类型</view>
		<radio-group class="radio-group" @change="typeChange">
			<view class="radio-item" v-for="item in types" :key="item.id">
				<label>
					<radio class="radio" color="#8441FF" :value="item.id" /><text>{{ item.name }}</text>
				</label>
			</view>
		</radio-group>
		
		<view class="label mt_20">请简单描述您的问题</view>
		<textarea class="textarea" cols="30" rows="10" placeholder="输入内容" v-model="form.content"></textarea>
		
    <view class="label mt_20">请留下联系方系</view>
    <input type="tel" v-model="form.contact" placeholder="请输入手机号" class="phone-input" />
		
    <view class="label mt_20">补充图片</view>
		<view class="upload" @click="chooseImage" v-if="!form.images"></view>
		<view class="image" v-else>
			<text class="close" @click="close">×</text>
			<image :src="form.images" mode="aspectFill"></image>
		</view>
		
		<view class="submit" :class="{disabled}" @click="submit">
			提交
		</view>
	</view>
</template>

<script>
import { API_BASE_URL, TOKEN_KEY } from '../../config/env'
	export default {
		data() {
			return {
				types: [
					{id: 'interactive', name: '页面交互'},
					{id: 'function', name: 'App功能'},
				],
				form: {
					reason: '',
					content: '',
					images: '',
          contact: ''
				}
			}
		},
		computed: {
			disabled() {
				return !this.form.reason || !this.form.content || !this.form.contact
			}
		},
    onLoad() {
      this.getFeedbacks()
    },
		methods: {
      async getFeedbacks() {
        try{
          const {data} = await this.$Api.getFeedTypes()
          this.types = data
        }catch(e){
          //TODO handle the exception
          console.error(e)
        }
      },
			typeChange(v) {
				this.form.reason = v.detail.value
			},
			chooseImage() {
				let token = uni.getStorageSync(TOKEN_KEY);
				uni.chooseImage({
				  count: 1, //默认1
				  sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				  //sourceType: ['album'], //从相册选择
				  success: (res) => {
				    uni.uploadFile({
				      url: API_BASE_URL + '/api/common/upload', // 服务器上传接口
				      filePath: res.tempFilePaths[0],
				      name: 'file', // 必须填写，后台用来接收文件
				      header: {
				        token: token
				      },
				      success: (uploadFileRes) => {
				        console.log(uploadFileRes.data, uploadFileRes);
				        let temp = JSON.parse(uploadFileRes.data);
                console.log(temp);
				        this.form.images = temp.data.fullurl
				      },
				      fail: (error) => {},
				    });
				  }
				});
			},
			close() {
				this.form.images = ''
			},
			submit() {
				if(this.disabled) return
				console.log(this.form);
        this.$Api.postFeedback(this.form).then(res => {
           uni.showToast({
             title: '提交成功',
             icon: 'success'
           })
           setTimeout(() => {
             uni.navigateBack()
           }, 1000)
         }).catch(e => {
           console.error(e)
         })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		padding: 32rpx;
		background: #fff;
		color: #333;
		.label {
			margin-bottom: 24rpx;
			font-weight: bold;
		}
		.radio-group {
			display: flex;
			flex-wrap: wrap;
		}
		.radio-item {
			width: 33.33%;
			margin-bottom: 20rpx;
			.radio {
				transform: scale(0.7);
			}
		}
		.textarea {
			border: 1px solid #eee;
			width: 100%;
			padding: 24rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
		}
    .phone-input{
      border: 1px solid #eee;
      width: 100%;
      height: 68rpx;
      padding: 10rpx 24rpx;
      box-sizing: border-box;
      border-radius: 16rpx;
    }
		.image {
			width: 160rpx;
			height: 160rpx;
			border-radius: 16rpx;
			border: 1px solid #eee;
			position: relative;
			image {
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
			}
			.close {
				position: absolute;
				top: -10rpx;
				right: -10rpx;
				z-index: 5;
				width: 40rpx;
				height: 40rpx;
				border-radius: 20rpx;
				background: #ef5656;
				color: #fff;
				text-align: center;
				line-height: 40rpx;
			}
		}
		.upload {
			border: 1px solid #eee;
			width: 160rpx;
			height: 160rpx;
			border-radius: 16rpx;
			position: relative;
			text-align: center;
			&::after {
				content: '';
				width: 40%;
				height: 4rpx;
				border-radius: 2rpx;
				background: #eee;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
			&::before {
				content: '';
				width: 4rpx;
				height: 40%;
				border-radius: 2rpx;
				background: #eee;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}
		.submit {
			width: 600rpx;
			height: 84rpx;
			border-radius: 42rpx;
			background: #8441FF;
			text-align: center;
			line-height: 84rpx;
			color: #fff;
			position: fixed;
			left: 50%;
			transform: translateX(-50%);
			bottom: 50rpx;
			z-index: 5;
			transition: background 0.2s ease;
			&.disabled {
				background: #c7c8c9;
				transition: background 0.2s ease;
			}
		}
	}
	.mt_20 {
		margin-top: 40rpx;
	}
</style>
