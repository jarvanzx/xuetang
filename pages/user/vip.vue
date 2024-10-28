<template>
  <view class="page-user-vip has-combtn-padding">
    <view class="page-custom-top-nav fixed nav-bg box-content" :style="{paddingTop: barHeight + 'px'}">
      <image src="https://jzxt.qifudaren.net/static/common/back.png" class="back-img" mode="" @click="back"></image>
      <view>会员</view>
    </view>
    <view class="page-content" :style="{paddingTop: (barHeight + 42) + 'px'}">
      <view class="vip-nav">
        <template v-for="(item, index) in vipList">
          <view :key="item.id" v-if="item.name == '君子金卡'"
            :class="['vip-nav-item', tabNav == index ? 'vip-nav-item-active' : '']" @click="changeNav(index)">
            {{item.name}}
          </view>
          <view v-else :key="item.id" :class="['vip-nav-item', tabNav == index ? 'vip-nav-item-active-2' : '']"
            @click="changeNav(index)">{{item.name}}</view>
        </template>

      </view>

      <view class="vip-swiper">
        <!-- :next-margin="tabNav === 1? '16px' : 0" :previous-margin="tabNav === 1? '0' : '16px'" -->
        <swiper @change="changeSwiper" :current="tabNav" next-margin="16px" previous-margin="16px">
          <swiper-item v-for="item in vipList" :key="item.id">
            <view class="vip-wrap relative">
              <image
                :src="item.name == '君子金卡' ? 'https://jzxt.qifudaren.net/static/vip/jinka.png' : 'https://jzxt.qifudaren.net/static/vip/hehuoren.png'"
                class="vip-nav-img" mode="widthFix"></image>
              <div class="price-line flex justify-between align-center">
                <view class="price" :class="{'price-2': item.name=='君子合伙人'}">
                  <text style="font-size: 48rpx; margin-right: 10rpx;">{{item.salesprice}}</text>元/{{item.unit_text}}
                </view>
                <view class="buy-btn" :class="{'buy-btn-2': item.name=='君子合伙人'}" @click="toPayVip">
                  {{userInfo.user_vip.vip_id == item.id ? '立即续费' : '立即开通'}}
                </view>
              </div>
            </view>
          </swiper-item>
        </swiper>
        <!-- 	<image src="https://jzxt.qifudaren.net/static/user/lv-1.png" v-if="tabNav === 1" class="vip-nav-img" mode="widthFix"></image>
      	<image src="https://jzxt.qifudaren.net/static/user/lv-2.png" v-else class="vip-nav-img" mode="widthFix"></image> -->
      </view>
      <image
        :src="vipList[tabNav]['name'] == '君子金卡' ? 'https://jzxt.qifudaren.net/static/user/nav-title.png' : 'https://jzxt.qifudaren.net/static/user/nav-title-2.png'"
        class="vip-nav-title" mode="aspectFill"></image>

      <view class="text-center flex justify-around align-center">
        <view class="nav-item flex-1" v-for="(item, index) in vipList[tabNav].rights" :key="item">
          <image v-if="vipList[tabNav]['name'] == '君子金卡'"
            :src="`https://jzxt.qifudaren.net/static/user/tab-nav-${index + 1}.png`" class="nav-item-img"
            mode="aspectFill"></image>
          <image v-else :src="`https://jzxt.qifudaren.net/static/user/tab-nav2-${index + 1}.png`" class="nav-item-img"
            mode="aspectFill">
          </image>
          <view class="nav-item-title no-wrap">{{item}}</view>
        </view>
      </view>
      <view class="vip-card-1">
        <image :src="vipList[tabNav].privilege_img_url" mode="widthFix"
          style="width: 100%; min-height: 400rpx;display: flex; overflow: hidden; border-radius: 16rpx;">
        </image>
      </view>
      <view v-if="false" class="vip-card" :class="{'vip-card-2': tabNav === 0}">
        <image src="https://jzxt.qifudaren.net/static/user/card-title.png" v-if="tabNav === 1"
          class="vip-card-title-img" mode=""></image>
        <image src="https://jzxt.qifudaren.net/static/user/card-title-2.png" v-else class="vip-card-title-img" mode="">
        </image>
        <view class="vip-card-course" v-for="item in 4" :key="item">
          <image src="https://jzxt.qifudaren.net/static/temp/shop-1.png" class="vip-course-cover" mode=""></image>
          <view class="flex-sub vip-course-info">
            <view class="line-2 vip-course-name">
              价值9800元《人生之道》线下课价值9800元《人生之道》线下课价值9800元《人生之道》线下课价值9800元《人生之道》线下课</view>
            <view class="vip-course-des">3天3夜名额1位</view>
          </view>
        </view>

        <view class="vip-card-course align-center">
          <image src="https://jzxt.qifudaren.net/static/user/icon-jinka.png" class="vip-course-cover-2" mode="">
          </image>
          <view class="line-1 vip-course-name flex-sub">金卡学习资格买一年送一年</view>
        </view>
        <view class="vip-card-course align-center">
          <image src="https://jzxt.qifudaren.net/static/user/icon-tuiguang.png" class="vip-course-cover-2" mode="">
          </image>
          <view class="line-1 vip-course-name flex-sub">拥有推广权益</view>
        </view>
        <view class="vip-card-course align-center">
          <image src="https://jzxt.qifudaren.net/static/user/icon-discount.png" class="vip-course-cover-2" mode="">
          </image>
          <view class="line-1 vip-course-name flex-sub">商城购买产品9折</view>
        </view>
        <view class="vip-card-course align-center">
          <image src="https://jzxt.qifudaren.net/static/user/icon-tuiguang.png" class="vip-course-cover-2" mode="">
          </image>
          <view class="line-1 vip-course-name flex-sub">拥有推广权益</view>
        </view>
        <view class="vip-card-course align-center">
          <image src="https://jzxt.qifudaren.net/static/user/icon-jinka.png" class="vip-course-cover-2" mode="">
          </image>
          <view class="line-1 vip-course-name flex-sub">拥有君子金卡所有权益</view>
        </view>
      </view>
      <view class="vip-bottom-tips">本产品为虚拟产品不可退款</view>
      <view class="page-fixed-footer">
        <view class="vip-bottom page-footer-wrap">
          <view class="vip-price"><text>{{vipList[tabNav]['salesprice']}}</text>元/{{vipList[tabNav]['unit_text']}}
          </view>
          <view class="subbtn" @click="toPayVip">
            <image src="https://jzxt.qifudaren.net/static/user/icon-vip-bottom.png" v-if="tabNav === 0"
              class="vip-bottom-img" mode="aspectFill"></image>
            <image src="https://jzxt.qifudaren.net/static/user/icon-vip-bottom-2.png" v-else class="vip-bottom-img"
              mode="aspectFill"></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    pay
  } from '../../utils/pay';
  export default {
    data() {
      return {
        tabNav: 0,
        vipList: [],
        barHeight: 44,
        userInfo: {}
      };
    },
    async onLoad() {
      this.barHeight = uni.getStorageSync('barHeight')
      await this.getVips()
      this.getUserInfo()
    },
    methods: {
      async getUserInfo() {
        try {
          const {
            data
          } = await this.$Api.getUserInfo();
          this.userInfo = data;
        } catch (e) {
          //TODO handle the exception
        }
      },
      async getVips() {
        try {
          const {
            data
          } = await this.$Api.getVipList({})
          if (Array.isArray(data) && data.length > 0) {
            const vips = data.map(item => {
              const rights = item.privilege_content.split('\r\n').filter(item => item != '')
              return {
                ...item,
                rights
              }
            })
            this.vipList = vips
          }
        } catch (e) {
          //TODO handle the exception
        }
      },
      async toPayVip() {
        console.log(111);
        pay('vip', 'createVipOrder', this.vipList[this.tabNav]['id'], 'vip_id', this.vipList[this.tabNav]['name'])
        return;
        try {
          // #ifdef APP
          const appres = await this.$Api.createVipOrder({
            vip_id: this.vipList[this.tabNav]['id'],
            platform: 'app'
          })
          if (appres.code === 200) {
            const {
              order_no
            } = appres.data
            const {
              data: payData
            } = await this.$Api.toPayOrder({
              order_id: order_no,
              platform: 'app',
              type: 'vip',
              pay_type: 1
            })
            const params = encodeURIComponent(JSON.stringify(payData.pay_data))
            uni.navigateTo({
              url: `/pages/pay/pay?payData=${params}`
            })
          }
          // #endif
          // #ifdef MP-WEIXIN
          const resmp = await this.$Api.createVipOrder({
            vip_id: this.vipList[this.tabNav]['id'],
            platform: 'wxmini',
          })
          const {
            data: payData
          } = await this.$Api.toPayOrder({
            order_id: resmp.data.order_no,
            platform: 'wxmini',
            type: 'vip',
            pay_type: 1
          })
          uni.requestPayment({
            provider: 'wxpay',
            timeStamp: payData.pay_data.timeStamp,
            nonceStr: payData.pay_data.nonceStr,
            package: payData.pay_data.package,
            signType: payData.pay_data.signType,
            paySign: payData.pay_data.paySign,
            success: (res) => {
              uni.showToast({
                title: '支付成功',
                icon: 'none'
              })
            },
            fail: (err) => {
              uni.showToast({
                title: '支付失败',
                icon: 'none'
              })
            },
            complete: () => {}
          })
          // #endif
        } catch (e) {
          //TODO handle the exception
        }
      },
      back() {
        uni.navigateBack()
      },
      changeNav(i) {
        this.tabNav = i
      },
      changeSwiper(e) {
        this.tabNav = e.detail.current
      }
    }
  }
</script>

<style lang="scss">
  .page-user-vip {
    min-height: 100vh;
    background-color: #2D3649;
    color: #fff;

    .nav-bg {
      background-color: #2D3649;
    }

    .box-content {
      box-sizing: content-box;
    }

    .page-fixed-footer {
      background: transparent;
    }

    .vip-bottom {
      width: 686rpx;
      height: 106rpx;
      border: 1rpx solid #999;
      background-color: #2b2b36;
      margin: 0 auto;
      border-radius: 52rpx;
      padding-left: 52rpx;
      padding-right: 0;
      position: relative;
      overflow: hidden;

      .vip-bottom-img {
        height: 104rpx;
        width: 286rpx;
        display: flex;
      }

      .vip-price {
        font-family: DIN, DIN;
        color: #F1F1F1;
        font-size: 32rpx;

        span {
          font-weight: bold;
          font-size: 48rpx;
        }
      }
    }

    .vip-bottom-tips {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;
      text-align: center;
      margin-top: 24rpx;
    }

    .vip-card-1 {
      width: 654rpx;
      background: linear-gradient(315deg, #FFF3E0 0%, #FFFBFB 100%);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin: 80rpx auto 0;
      position: relative;
    }

    .vip-card {
      width: 654rpx;
      min-height: 1077rpx;
      background: linear-gradient(315deg, #FFF3E0 0%, #FFFBFB 100%);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin: 80rpx auto 0;
      position: relative;
      padding-top: 48rpx;
      padding-bottom: 16rpx;
      color: #333;

      &.vip-card-2 {
        background: linear-gradient(315deg, #D0CBFF 0%, #F1F4FF 100%);
      }

      .vip-card-title-img {
        width: 269rpx;
        height: 49rpx;
        display: block;
        position: absolute;
        top: -8rpx;
        left: 50%;
        margin-left: -134.5rpx;
        z-index: 2;
      }

      .vip-card-course {
        width: 622rpx;
        background: #FFFFFF;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        padding: 24rpx;
        display: flex;
        margin: 0 auto 16rpx;

      }

      .vip-course-cover {
        width: 128rpx;
        height: 128rpx;
        border-radius: 12rpx 12rpx 12rpx 12rpx;
        margin-right: 16rpx;
      }

      .vip-course-cover-2 {
        height: 64rpx;
        width: 64rpx;
        min-width: 64rpx;
        margin-right: 24rpx;
      }

      .vip-course-name {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 28rpx;
        color: #000000;
      }

      .vip-course-des {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
      }

      .vip-course-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }

    .vip-nav {
      width: 348rpx;
      height: 62rpx;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
      margin: 32rpx auto 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rpx;
      position: relative;
      z-index: 10;

      &-item {
        height: 58rpx;
        border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
        text-align: center;
        line-height: 58rpx;
        padding: 0 32rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 24rpx;
        color: #FFFFFF;
      }

      .vip-nav-item-active {
        background: linear-gradient(315deg, #C89A40 0%, #F3D294 100%), #7644FF;

        &-2 {
          background: linear-gradient(312deg, #31385F 0%, #A088FF 100%);
        }
      }
    }

    swiper {
      // width: 712rpx;
      height: 427rpx;
      margin: 0 auto 0;
      margin-left: 32rpx;
      margin-right: 16rpx;
      overflow: hidden;
    }

    .vip-nav-img {
      width: 712rpx;
      min-width: 712rpx;
      height: 427rpx;
      display: block;
      margin-top: -40rpx;
    }

    .vip-nav-title {
      width: 171rpx;
      height: 48rpx;
      display: block;
      margin: 64rpx auto 0;
    }

    .nav-item {
      margin-top: 32rpx;
    }

    .nav-item-img {
      width: 120rpx;
      height: 138rpx;
      margin-bottom: 12rpx;
    }
  }

  .price-line {
    position: absolute;
    left: 38rpx;
    bottom: 38rpx;
    width: 540rpx;

    .price {
      font-size: 30rpx;
      color: #B5782A;
    }

    .price-2 {
      color: #FAFBFC;
    }

    .buy-btn {
      width: 174rpx;
      height: 60rpx;
      background: linear-gradient(118deg, #FFF9E9 0%, #FCF5D9 100%);
      border-radius: 30rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 29rpx;
      color: #73583A;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .buy-btn-2 {
      color: #1A2850;
      background: #FAFBFC;
      ;
    }
  }
</style>