<template>
  <view class="page-user-retail page-wrap">
    <image src="https://jzxt.qifudaren.net/static/index/bg.png" class="index-top" mode=""></image>
    <view class="page-top-nav">
      <image src="https://jzxt.qifudaren.net/static/common/back.png" class="back-img" mode="" @click="back"></image>
      <view>推荐</view>
    </view>
    <view class="flex align-center justify-between retail-user-wrap">
      <view class="flex align-center">
        <image :src="user.avatar" class="retail-user-ava" mode="aspectFill"></image>
        <view class="retail-user-name">{{user.nickname}}</view>
      </view>
      <view class="flex retail-poster-wrap" @click="showShare= true">
        <image src="https://jzxt.qifudaren.net/static/user/retail-poster.png" class="retail-poster-img" mode=""></image>
        <view>推广海报</view>
      </view>
    </view>

    <view class="retail-card-wrap">
      <view class="retail-top-wrap">
        <view class="retail-card-item">
          <view>可提现收益(元)</view>
          <view class="card-item-can">{{commission.commission}}
            <view class="line btn-withdraw cu-btn round"
              @click="toUrl('/pages/user/withdraw?commission=' + commission.commission)">提现</view>
          </view>
        </view>
        <view class="retail-card-item">
          <view>累计收益(元)</view>
          <view class="card-item-all">{{commission.money}}</view>
        </view>
      </view>
      <view class="retail-bottom-wrap flex">
        <view class="retail-bottom-item" @click="toUrl('/pages/user/withdraw-list')">
          <image src="https://jzxt.qifudaren.net/static/user/retail-record.png" class="icon-retail" mode=""></image>
          提现记录
        </view>
        <view class="retail-bottom-item" @click="toUrl('/pages/user/income-list')">
          <image src="https://jzxt.qifudaren.net/static/user/retail-income.png" class="icon-retail" mode=""></image>
          收入明细
        </view>
      </view>
    </view>

    <view class="retail-list">
      <view class="retail-list-title">我的邀请</view>
      <view class="retail-item flex align-center justify-between" v-for="item in list" :key="item.id">
        <view class="flex align-center">
          <image :src="getUrl(item.avatar)" class="retail-list-img" mode="aspectFill"></image>
          <view>
            <view class="retail-item-title">{{item.nickname}}</view>
            <view class="retail-item-time">{{item.createtime}}</view>
          </view>
        </view>
        <view class="retail-status">{{item.total_consume}}</view>
        <!-- <view class="retail-status retail-status-2" v-else>已消费</view> -->
      </view>
    </view>
    <canvas style="width: 311px; height:552px;" canvas-id="firstCanvas" id="firstCanvas" class="firstCanvas"></canvas>
    <u-popup :show="showShare" mode="center" round="16" @close="showShare = false">
      <view class="img-warp">
        <image :src="poster" mode="aspectFill" class="share-poster"></image>
        <view class="btns">
          <view class="btn btn-save" @click="saveImg">保存图片</view>
          <button class="btn btn-share" open-type="share">分享给好友</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
  import {
    getUrl
  } from '../../utils/utils';
  // import posterBg from '../../static/common/poster_bg.png'
  export default {
    data() {
      return {
        list: [],
        user: {},
        commission: {},
        page: 1,
        pagesize: 10,
        pageMax: false,
        qrcode: '',
        poster: '',
        showShare: false
      };
    },
    onLoad() {
      this.getInvite()
      const user = uni.getStorageSync('userInfo')
      this.user = user
    },
    onReady() {
      this.getQrcode().then(() => {
        var context = uni.createCanvasContext('firstCanvas')
        context.drawImage('/static/common/poster_bg.png', 0, 0, 311, 552)
        context.setFontSize(13)
        context.fillText('君子学堂', 129, 501)
        context.setFillStyle('#000000')
        context.save()
        uni.getImageInfo({
          src: this.qrcode,
          success: (res) => {
            context.restore()
            context.drawImage(res.path, 116, 407, 75, 75)
            context.draw(true, () => {
              setTimeout(() => {
                uni.canvasToTempFilePath({
                  canvasId: 'firstCanvas',
                  success: (res) => {
                    this.poster = res.tempFilePath
                  }
                }, this)
              }, 1000)
            })
          }
        })
      })
    },
    onReachBottom() {
      if (!this.pageMax) {
        this.getInvite()
      }
    },
    onShareAppMessage() {
      return {
        title: '君子学堂',
        path: '/pages/index/index?invite=' + this.user.id,
        imageUrl: this.poster
      }
    },
    methods: {
      getUrl,
      async getInvite() {
        try {
          const {
            data,
            code
          } = await this.$Api.getMyInvite({
            page: this.page,
            pagesize: this.pagesize
          })
          if (code == 1) {
            const {
              user,
              invite_list
            } = data
            this.commission = user
            this.list = this.list.concat(invite_list)
            if (invite_list.length < this.pagesize) {
              this.pageMax = true
            }
            this.page++
          }
        } catch (e) {
          //TODO handle the exception
        }
      },
      saveImg() {
        uni.saveImageToPhotosAlbum({
          filePath: this.poster,
          success: (res) => {
            uni.showToast({
              title: '保存成功',
              icon: 'none'
            })
            this.showShare = false
          },
          fail: (err) => {
            if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny' || err.errMsg ===
              'saveImageToPhotosAlbum:fail auth denied') {
              uni.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: (res) => {
                  if (res.confirm) {
                    uni.openSetting({
                      success(settingdata) {
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          uni.showModal({
                            title: '提示',
                            content: '获取权限成功，再次点击图片即可保存',
                            showCancel: false,
                          })
                        } else {
                          uni.showModal({
                            title: '提示',
                            content: '获取权限失败，请点击确定重新获取权限',
                            showCancel: false,
                            success: (res) => {
                              if (res.confirm) {
                                uni.openSetting()
                              }
                            }
                          })
                        }
                      },
                      fail: (err) => {
                        console.log(err)
                        uni.showModal({
                          title: '提示',
                          content: '获取权限失败，请点击确定重新获取权限',
                          showCancel: false,
                          success: (res) => {
                            if (res.confirm) {
                              uni.openSetting()
                            }
                          }
                        })
                      }
                    })
                  }
                }
              })
            }
          }
        })
      },
      canvasIdErrorCallback(err) {
        console.log(err);
      },
      drawImg() {
        // uni.showLoading({
        //   title: '生成中...'
        // })
        const ctx = uni.createCanvasContext('invitePoster', this)
        const images = [
          '../../static/common/poster_bg.png',
          this.qrcode
        ]
        ctx.drawImage('/static/common/poster_bg.png', 0, 0, 311, 552)
        ctx.save()
        ctx.draw(true)

        uni.getImageInfo({
          src: this.qrcode,
          success: (res) => {
            ctx.restore()
            ctx.drawImage(res.path, 116, 417, 75, 75)
            ctx.draw(false, setTimeout(() => {
              uni.canvasToTempFilePath({
                canvasId: 'poster',
                success: (res) => {
                  console.log(res);
                  uni.hideLoading()
                  this.poster = res.tempFilePath
                },
                fail: (err) => {
                  console.log(err);
                  uni.hideLoading()
                }
              })
            }), 1500)
          }
        })
      },
      async getQrcode() {
        const {
          data
        } = await this.$Api.getPosterQrcode({
          platform: 'wxmini',
          kind: 2
        })
        this.qrcode = data.qrcode
        // this.drawImg()
      },
      toUrl(url) {
        uni.navigateTo({
          url
        })
      },
      back() {
        uni.navigateBack()
      }
    },
  }
</script>

<style lang="scss">
  .firstCanvas {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .page-top-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 0 32rpx;
    height: 88rpx;
    position: relative;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 36rpx;
    color: #FFFFFF;
  }

  .back-img {
    height: 52rpx;
    width: 52rpx;
    position: absolute;
    left: 32rpx;
  }

  .page-user-retail {
    background-color: #f8f8f8;
    min-height: 100vh;

    .retail-list {
      width: 686rpx;
      background-color: #fff;
      border-radius: 16rpx;
      padding: 32rpx;
      margin: 32rpx auto 0;

      .retail-list-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 32rpx;
        color: #000000;
      }

      .retail-item {
        height: 144rpx;
      }

      .retail-list-img {
        width: 80rpx;
        height: 80rpx;
        border-radius: 67rpx 67rpx 67rpx 67rpx;
        margin-right: 16rpx;
      }

      .retail-item-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 32rpx;
        color: #000000;
      }

      .retail-item-time {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        margin-top: 2rpx;
      }

      .retail-status {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #FF2E00;

        &-2 {
          color: #7644FF;
        }
      }
    }

    .icon-retail {
      height: 40rpx;
      width: 40rpx;
      margin-right: 8rpx;
    }

    .index-top {
      height: 496rpx;
    }

    .retail-user-wrap {
      padding: 0 32rpx;
      margin-top: 32rpx;
      position: relative;
      z-index: 1;
    }

    .retail-user-ava {
      width: 112rpx;
      height: 112rpx;
      border: 2rpx solid #FFFFFF;
      border-radius: 50%;
      margin-right: 16rpx;
    }

    .retail-user-name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 36rpx;
      color: #FFFFFF;
    }

    .retail-poster-img {
      height: 64rpx;
      width: 64rpx;
      margin-bottom: 8rpx;
    }

    .retail-poster-wrap {
      flex-direction: column;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 24rpx;
      color: #FFFFFF;
      align-items: center;
      justify-content: center;
    }

    .retail-card-wrap {
      width: 686rpx;
      height: 242rpx;
      background: #8441FF;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin: 32rpx auto 0;
      position: relative;
      z-index: 1;

    }

    .retail-bottom-wrap {
      height: 74rpx;

      .retail-bottom-item {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #FFFFFF;
      }
    }

    .retail-top-wrap {
      width: 686rpx;
      height: 170rpx;
      background: #FFFFFF;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      display: flex;

      .retail-card-item {
        width: 50%;
        padding: 0 32rpx;
        margin-top: 40rpx;
        height: 90rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;

        &:first-child {
          border-right: 1rpx solid #eee;
        }
      }

      .card-item-can {
        font-family: DIN, DIN;
        font-weight: 500;
        font-size: 40rpx;
        color: #7644FF;
        display: flex;
        align-items: center;
        margin-top: 8rpx;
      }

      .btn-withdraw {
        min-width: 80rpx;
        height: 42rpx;
        border-radius: 21rpx;
        // border: 1rpx solid #7644FF;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #7644FF;
        padding: 0 16rpx;
        margin-left: 28rpx;
      }

      .card-item-all {
        font-family: DIN, DIN;
        font-weight: 500;
        font-size: 40rpx;
        color: #333333;
        margin-top: 8rpx;
      }
    }
  }

  .share-poster {
    width: 622rpx;
    height: 1104rpx;
  }

  .img-warp {
    width: 622rpx;
    position: relative;

    .btns {
      width: 100%;
      height: 136rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      left: 0;
      bottom: -196rpx;

      .btn {
        font-size: 32rpx;
        width: 305rpx;
        height: 88rpx;
        border-radius: 44rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .btn-save {
        background: #FFFFFF;
        border: 1px solid #DDDDDD;
        color: #333333;
      }

      .btn-share {
        background: #7644FF;
        color: #fff;

        &::after {
          border: none;
        }
      }
    }
  }
</style>