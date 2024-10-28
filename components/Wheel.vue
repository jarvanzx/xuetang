<template>
	<view>
		<view class="wheel_wp sol-class">
			<block v-if="mode == 1">
				<image src="https://jzxt.qifudaren.net/static/lottery/bg-lottery.png" />
				<view class="wheel_pointer" @click="start"
					:style="{'transform': 'rotate(' + deg + 'deg) translateZ(0)'}">
					<image src="https://jzxt.qifudaren.net/static/lottery/btn-lottery.png" />
				</view>
			</block>
			<block v-if="mode == 2">
				<image src="https://jzxt.qifudaren.net/static/lottery/bg-lottery.png"
					:style="{'transform': 'rotate(' + deg + 'deg) translateZ(0)'}" />
				<view class="wheel_pointer" @click="start">
					<image src="https://jzxt.qifudaren.net/static/lottery/btn-lottery.png" />
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		name: "Wheel",
		data() {
			return {
				areaNumber: 6,
				awardNumer: 1,
				speed: 16,
				deg: 0,
				singleAngle: '', // 每片扇形的角度
				isStart: false,
				timer: null
			};
		},
    props: {
      mode: {
        type: Number,
        default: 1
      }
    },
		methods: {
			init() {
				this.singleAngle = 360 / this.areaNumber
			},
			start(){
				console.log('start')
				 this.awardNumer =  Math.floor(Math.random() * 6 + 1);
				this.begin()
			},
			begin() {
				let {
					deg,
					awardNumer,
					singleAngle,
					speed,
					isStart,
					mode
				} = this
				if (isStart) return
				this.isStart = true
				let endAddAngle = 0
				if (mode == 2) {
					endAddAngle = 360 - ((awardNumer - 1) * singleAngle + singleAngle / 2) // 中奖角度
				} else {
					endAddAngle = (awardNumer - 1) * singleAngle + singleAngle / 2 + 360 // 中奖角度
				}
				const rangeAngle = (Math.floor(Math.random() * 4) + 4) * 360 // 随机旋转几圈再停止
				console.log(endAddAngle)
				let cAngle
				deg = 0
				this.timer = setInterval(() => {
					if (deg < rangeAngle) {
						deg += speed
					} else {
						cAngle = (endAddAngle + rangeAngle - deg) / speed
						cAngle = cAngle > speed ? speed : cAngle < 1 ? 1 : cAngle
						deg += cAngle
						if (deg >= endAddAngle + rangeAngle) {
							deg = endAddAngle + rangeAngle
							this.isStart = false
							clearInterval(this.timer)
							this.triggerEvent('success')
						}
					}
					this.singleAngle = singleAngle
					this.deg = deg
					this.mode = mode
				}, 1000 / 60)
			}
		}
	}
</script>

<style lang="scss">
	.wheel_wp {
		width: 600rpx;
		height: 600rpx;
		position: relative;
		margin: 24rpx auto 48rpx;
		z-index: 1;
		image {
			display: block;
			width: 100%;
			height: 100%;
		}

		.wheel_pointer {
			width: 183rpx;
			height: 217rpx;
			position: absolute;
			left: 50%;
			margin-left: -91.5rpx;
			top: 182rpx;
		}

	}
</style>