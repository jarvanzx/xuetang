<template>
	<view class="page-setting">
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="搜索问题" confirm-type="search"></input>
			</view>
		</view>
		<view class="cu-list menu sm-border card-menu margin-top">
			<view class="cu-item arrow">
				<view class="content">
					<text class="text-black">如何核销订单</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content padding">
					<text class="text-grey">您可以点击app底部【我的】【推荐好友/合伙人】进入推荐页 → 点击邀请海报 → 分享给好友，可通过扫一扫和邀请链接进入。</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="text-black">如何邀请好友</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="text-black">如何修改个人信息</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="text-black">帮助中心问题</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="text-black">帮助中心问题</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="text-black">帮助中心问题</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
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
