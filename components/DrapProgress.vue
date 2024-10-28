<template>
  <view>
    <view class="slider-container" @click="onClick">
      <view class="flex-move"></view>
      <!-- 		<movable-area class="sliderBar" :style="{width: (100)+'%'}" :damping="10">
				<view class="gone" :style="{width: x +'px'}"></view>
				<movable-view class="slider" direction="horizontal" :x="x" @change="onChange">
					<view class="score-view">{{ ['年','cm', 'k'].includes(utils) && score === 0 ? '?' : score }}{{utils}}{{after? score == maxScore ? '以上' : '': '' }}</view>
				</movable-view>
			</movable-area> -->
      <view class="sliderBar u-sliderBar" :style="{width: (100)+'%'}" :damping="10">
        <view class="gone u-gone" :style="{width: mainValue +'%'}"></view>
        <view class="slider u-slider" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"
          @touchcancel="onTouchEnd" :style="{left: mainValue+ '%'}" direction="horizontal" :x="x">
          <!-- <view class="score-view s-score-view">{{ ['年','cm', 'k'].includes(utils) && score === 0 ? '?' : score }}{{utils}}{{after? score == maxScore ? '以上' : '': '' }}</view> -->
        </view>
      </view>
      <!-- <view :style="{width: ((minScore) / maxScore) * 100 +'%'}"></view> -->
    </view>
  </view>
</template>

<script>
  function deBounce(fn, delay = 500, immediate) {
    let timer = null,
      immediateTimer = null;

    return function() {
      let args = arguments,
        context = this;

      // 第一次触发
      if (immediate && !immediateTimer) {

        fn.apply(context, args);
        //重置首次触发标识，否则下个周期执行时会受干扰
        immediateTimer = setTimeout(() => {
          immediateTimer = null;
        }, delay);
      }
      // 存在多次执行时，重置动作需放在timer中执行；
      if (immediateTimer) clearTimeout(immediateTimer);
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        fn.apply(context, args);
        timer = null;
        immediateTimer = null;
      }, delay);
    }
  }
  export default {
    props: {
      max: {
        type: Number,
        default: 10
      },
      min: {
        type: Number,
        default: 0
      },
      defaultValue: {
        type: Number,
        default: 0
      },
      utils: {
        type: String,
        default: ''
      },
      after: {},
      mainValue: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        slideBarWidth: 0,
        minScore: this.min ? this.min : 0,
        maxScore: this.max ? this.max : 10,
        x: 0,
        y: 0,
        score: '?',
        value: 0,
        sliderRect: {},
        step: 1,
        newValue: '',
        barStyle: {}
      };
    },
    mounted() {
      var that = this;
      console.log('defaultValue', this.defaultValue, this.min, this.minScore, this.maxScore)
      // 解决报错问题
      let el = uni.createSelectorQuery().in(this)
      this.$nextTick(() => {
        el.select(".slider-container").boundingClientRect(function(res) {
          that.slideBarWidth = res.width
          that.sliderRect = res
          // 根据 defaultValue 计算出初始位置和分数
          console.log('slideBarWidth', res.width)
          if (that.defaultValue) {
            that.score = that.defaultValue || 0
            // console.log(that.defaultValue / that.maxScore * that.slideBarWidth)
            // that.mainValue = (that.defaultValue - that.minScore) / (that.maxScore - that.minScore) * 100
            // console.log('that.x ', that.x)
            // that.score = that.defaultValue
          }
        }).exec();
      })
    },
    methods: {
      fnThrottle(fn, delay, duration) {
        let that = this;
        let timer = this.timer;
        let begin = Date.now();
        return function() {
          let context = that;
          let args = arguments;
          let current = Date.now();
          clearTimeout(timer);
          if (current - begin >= duration) {
            fn.apply(context, args);
            begin = current;
          } else {
            that.timer = setTimeout(function() {
              fn.apply(context, args);
            }, delay);
          }
        }
      },
      chaneEvent(e) {
        this.x = e.detail.x
        this.score = this.min + Math.ceil(this.x / this.slideBarWidth * (this.maxScore - this.minScore))
        // console.log('parseInt(this.x / this.slideBarWidth * (this.maxScore - this.minScore))', this.x / this.slideBarWidth * (this.maxScore - this.minScore))
        // console.log('onChange',e.detail.x,this.min,this.minScore, this.slideBarWidth, this.score, this.maxScore)
        this.$emit('change', this.score)
      },
      // onChange(e) {
      // 	if(!e.detail.source) return
      // 	this.fnThrottle(this.chaneEvent,30)(e)
      // },
      onChange: deBounce(function(e, i) {
        // 这里是为了防止设置默认值的时候重复触发
        console.log('onChange', e)
        if (!e.detail.source) return
        this.chaneEvent(e)
        // this.fnThrottle( this.chaneEvent,100)(e)
      }, 50),
      onTouchStart(event) {
        if (this.disabled) return;
        this.startX = 0;
        // 触摸点集
        let touches = event.touches[0];
        // 触摸点到屏幕左边的距离
        this.startX = touches.clientX;
        // 此处的this.value虽为props值，但是通过$emit('input')进行了修改
        this.startValue = this.format(this.value);
        // 标示当前的状态为开始触摸滑动
        this.status = 'start';
      },
      onTouchMove(event) {
        if (this.disabled) return;
        // 连续触摸的过程会一直触发本方法，但只有手指触发且移动了才被认为是拖动了，才发出事件
        // 触摸后第一次移动已经将status设置为moving状态，故触摸第二次移动不会触发本事件
        if (this.status == 'start') this.$emit('start');
        let touches = event.touches[0];
        // 滑块的左边不一定跟屏幕左边接壤，所以需要减去最外层父元素的左边值
        this.distanceX = touches.clientX - this.sliderRect.left;
        // 获得移动距离对整个滑块的百分比值，此为带有多位小数的值，不能用此更新视图
        // 否则造成通信阻塞，需要每改变一个step值时修改一次视图
        let val = (this.distanceX / this.sliderRect.width) * 100;
        if (val < 0) {
          this.newValue = 0
        } else if (val > 100) {
          this.newValue = 100
        } else {
          this.newValue = val
        }
        const moveValue = Math.floor(this.newValue)
        this.score = this.min + Math.ceil(moveValue / 100 * (this.maxScore - this.minScore))

        console.log('newValue', this.newValue, this.score)
        this.status = 'moving';
        // 发出moving事件
        this.$emit('change', moveValue);
        // this.updateValue(this.newValue, true);
      },
      onTouchEnd() {
        if (this.disabled) return;
        if (this.status === 'moving') {
          // this.updateValue(this.newValue, false);
          this.$emit('end');
        }
        this.status = 'end';
        // this.$emit('change', this.mainValue)
      },
      updateValue(value, drag) {
        // 去掉小数部分，同时也是对step步进的处理
        // const width = this.format(value);
        // console.log('mainValue', width)
        // // 不允许滑动的值超过max最大值，百分比也不能超过100
        // if(width > this.max || width > 100) return;
        // // 设置移动的百分比值
        // let barStyle = {
        // 	width: width + '%'
        // };
        // // 移动期间无需过渡动画
        // if (drag == true) {
        // 	barStyle.transition = 'none';
        // } else {
        // 	// 非移动期间，删掉对过渡为空的声明，让css中的声明起效
        // 	delete barStyle.transition;
        // }
        // // 修改value值
        // console.log('width', width)
        // this.$emit('input', width);
        // this.barStyle = barStyle;
        this.$emit('change', this.score)
      },
      format(value) {
        // 将小数变成整数，为了减少对视图的更新，造成视图层与逻辑层的阻塞
        return Math.round(Math.max(this.min, Math.min(value, this.max)) / this.step) * this.step;
      },
      onClick(event) {
        console.log(event.detail);
        // if (this.disabled) return;
        // 直接点击滑块的情况，计算方式与onTouchMove方法相同
        const value = ((event.detail.x - this.sliderRect.left) / this.sliderRect.width) * 100;
        const moveValue = Math.floor(value)
        this.score = this.min + Math.ceil(moveValue / 100 * (this.maxScore - this.minScore))
        this.$emit('change', moveValue)
      }
    }
  }
</script>

<style lang="scss">
  .slider-container {
    display: flex;
    width: 100%;
    height: 64rpx;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      height: 12rpx;
      border-radius: 24rpx;
      background-color: #ddd;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 100%;
    }

    .flex-move {
      flex: 1;
      height: 12rpx;
      border-radius: 24rpx;
      // background-color: $uni-color-primary;
      background-color: #EEEEEE;
      margin-top: 0;
      position: relative;
      z-index: 1;
    }

    .sliderBar {
      height: 100%;
      border-radius: 64rpx;
      width: 100%;

      .gone {
        // background-color: $uni-color-primary;
        background-color: #EEEEEE;
        height: 100%;
        position: absolute;
        left: 0;
        height: 12rpx;
        top: 28rpx;
        max-width: 100%;
        z-index: 1;
        border-radius: 24rpx;
      }

      .slider {
        width: 0;
        height: 100%;
        position: relative;
        z-index: 2;
        top: -40rpx;

        &::after {
          content: '';
          position: absolute;
          top: 20rpx;
          border-radius: 24rpx;
          // background: url(https://cjxd.oss-cn-shenzhen.aliyuncs.com/static/register/icon@2x.png);
          // background-size: 100% 100%;
          background-color: #fff;
          width: 24rpx;
          height: 24rpx;
          transform: translatex(-50%);
        }

        .score-view {
          position: absolute;
          min-width: 120rpx;
          padding: 0 16rpx;
          text-align: center;
          height: 56rpx;
          line-height: 56rpx;
          color: white;
          border-radius: 24rpx;
          top: -180%;
          top: -70rpx;
          left: 50%;
          text-align: center;
          transform: translateX(-50%);
          background-color: #fff;
          font-size: 24rpx;
          font-family: MiSans-Medium, MiSans;
          font-weight: 500;
          color: #FFFFFF;

          &::after {
            content: '';
            position: absolute;
            border: 10rpx solid transparent;
            border-top-color: #fff;
            top: 99%;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
    }

    .u-sliderBar {
      .u-slider {
        top: 0;
      }
    }
  }
</style>