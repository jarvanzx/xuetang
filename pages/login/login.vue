<template>
  <view class="page-login">
    <view class="login-page-title">君子学堂</view>
    <view class="login-wrap">
      <!-- #ifdef MP-WEIXIN -->
      <view class="self-btn" @click="loginWeixin">
        微信登录
      </view>
      <!-- <button class="login-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">本机号码一键登录</button> -->
      <view class="login-read">
        <!-- <checkbox :value="hasRead" :checked="hasRead" /> -->
        <checkbox-group name="agreement" @change="checkChange">
          <label>
            <checkbox value="checked" :checked="checked" color="#7644FF" style="transform: scale(0.6);" />
            <text>已阅读并同意 <text class="agreement" @click.stop="toAgreement('xsx')">《XXXXX用户服务协议》</text></text>
          </label>
        </checkbox-group>
        <!-- <image src="https://jzxt.qifudaren.net/static/login/select.png" class="select-img" mode=""></image>	 -->
      </view>
      <!-- <button open-type="getPhoneNumber" @getphonenumber="phoneLogin">手机号一键登录</button> -->
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <!--      <view class="self-phone">136****9668</view>
      <view class="self-tips">本机号码</view> -->
      <view class="self-btn" @click="invokLoginPage">
        本机号码一键登录
      </view>
      <view class="login-read">
        <!-- <checkbox :value="hasRead" :checked="hasRead" /> -->
        <checkbox-group name="agreement">
          <label>
            <checkbox value="checked" :checked="checked" color="#7644FF" style="transform: scale(0.6);" />
            <text>已阅读并同意 <text class="agreement" @click.stop="toAgreement('xsx')">《XXXXX用户服务协议》</text></text>
          </label>
        </checkbox-group>
        <!-- <image src="https://jzxt.qifudaren.net/static/login/select.png" class="select-img" mode=""></image>	 -->
      </view>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <view class="other-login-wrap">
        <view class="other-methods">
          <view class="line"></view>
          <view class="other-methods-title">其他登录方式</view>
          <view class="line"></view>
        </view>
        <view class="mehtods-list">
          <view class="methods-item" @click="toIndex">
            <image src="https://jzxt.qifudaren.net/static/login/wx.png" class="login-method-img" mode=""></image>
            微信登录
          </view>
          <view class="methods-item" @click="toIndex">
            <image src="https://jzxt.qifudaren.net/static/login/qq.png" class="login-method-img" mode=""></image>
            QQ登录
          </view>
        </view>
      </view>
      <!-- #endif -->
    </view>
    <u-modal :show="showPhone" :title="title" :content="content" :show-confirm-button="false">
      <view class="flex-1">
        <view class="content flex-1">{{content}}</view>
        <view class="btns flex flex-1">
          <!-- <view class="btn cancel flex-1">取消</view> -->
          <button class="btn confirm flex-1" open-type="getPhoneNumber" @getphonenumber="phoneLogin">确定</button>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
  import {
    ALIY_KEY
  } from '../../config/env';
  // #ifdef APP-PLUS
  const aLiSDKModule = uni.requireNativePlugin('AliCloud-NirvanaPns');
  aLiSDKModule.setAuthSDKInfo(ALIY_KEY);
  // #endif
  export default {
    data() {
      return {
        title: '提示',
        content: '请授权手机号',
        showPhone: false,
        hasRead: false,
        checked: true,
        config: {
          uiConfig: {
            setPrivacyAlertIsNeedShow: false, //二次弹窗是否显示  默认false
            setStatusBarStyle: "1", //设置状态栏字体样式（1：Light 亮色，2：Dark 暗色），不设置则跟随App进入界面
            setNavHidden: "true", //是否隐藏导航栏，默认不隐藏（true：隐藏，false：不隐藏）
            setLogoHidden: 'false', //是否隐藏中间的Logo图片，默认不隐藏（true：隐藏，false：不隐藏）
            setSloganHidden: "true", //是否隐藏slogan文案，默认不隐藏（true：隐藏，false：不隐藏）
            setSwitchHidden: "false", //是否隐藏“切换方式”按钮（true：隐藏，false：不隐藏）
            setCheckboxHidden: "false", //是否隐藏隐私协议前面的勾选框（true：隐藏，false：不隐藏，如果隐藏代表用户强制同意协议，请谨慎使用）
          }
        },
        accessToken: "",
      };
    },
    onLoad() {
      // #ifdef APP-PLUS
      aLiSDKModule.accelerateLoginPage(5000, result => {
        if ("600000" == result.resultCode) {
          console.log("加速成功")
        }
      })
      // #endif
    },
    methods: {
      // #ifdef APP-PLUS
      invokLoginPage() {
        if (!this.checked) {
          aLiSDKModule.getLoginToken(
            5000,
            this.config,
            (tokenResult) => {
              uni.hideLoading();
              console.log(JSON.stringify(tokenResult));
              if ("600001" == tokenResult.resultCode) {
                console.log("授权页拉起成功");

                // 设置是否选中复选框
                aLiSDKModule.setCheckboxIsChecked({
                  check: false,
                });
              } else if ("600000" == tokenResult.resultCode) {
                console.log("获取Token成功");
                this.accessToken = tokenResult.token;
                this.quickLogin()
                //手动关闭授权页
                aLiSDKModule.quitLoginPage();
              } else {
                //手动关闭授权页
                aLiSDKModule.quitLoginPage();
              }
            },
            (clickResult) => {
              console.log(JSON.stringify(clickResult));
              switch (clickResult.resultCode) {
                case "700000":
                  console.log("用户点击返回按钮");
                  break;
                case "700001":
                  console.log("用户切换其他登录方式");
                  break;
                case "700002":
                  console.log("用户点击登录按钮");
                  if (!clickResult.result.isChecked) {
                    //Toast样式可参考：https://www.html5plus.org/doc/zh_cn/nativeui.html#plus.nativeUI.toast
                    plus.nativeUI.toast("请同意服务条款", {
                      duration: 2000
                    });
                  }
                  break;
                case "700003":
                  console.log("用户点击checkBox");
                  break;
                case "700004":
                  console.log("用户点击协议");
                  break;
              }
            },
            (customUiResult) => {
              console.log("点击了自定义控件 " + JSON.stringify(customUiResult));
              if ("close" == customUiResult.widgetId) {
                //点击了自定义的关闭授权页按钮
                aLiSDKModule.quitLoginPage();
              } else {
                plus.nativeUI.toast(
                  "点击了自定义按钮，widgetId：" + customUiResult.widgetId
                );
              }
            }
          );
        }
      },

      quickLogin() {
        console.log(111);
        this.$Api.aliQuickLogin({
          access_token: this.accessToken,
          invite_code: uni.getStorageSync('invite_code') || ''
        }).then((resdata) => {
          const {
            userinfo
          } = resdata.data
          uni.setStorageSync('userInfo', userinfo)
          uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000,
            complete() {
              const pages = getCurrentPages()
              if (pages.length > 1) {
                uni.navigateBack()
                return
              }
              uni.switchTab({
                url: '/pages/index/index',
              })
            }
          })
        })
      },
      // #endif
      checkChange(e) {
        console.log(e.detail.value);
        const val = e.detail.value
        if (val.length > 0) {
          this.checked = true
        } else {
          this.checked = false
        }
      },
      toAgreement(url) {
        const str = encodeURIComponent(url)
        uni.navigateTo({
          url: '/pages/web/web?url=' + str
        })
      },
      phoneLogin(e) {
        const {
          code
        } = e.detail
        if (code) {
          this.$Api.getMobileByCode({
            phone_code: code
          }).then(res => {
            console.log(res);
            uni.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000,
              complete() {
                const pages = getCurrentPages()
                if (pages.length > 1) {
                  uni.navigateBack()
                  return
                }
                uni.switchTab({
                  url: '/pages/index/index',
                })
              }
            })
          })
        }
      },
      loginWeixin() {
        if (!this.checked) {
          uni.showToast({
            title: '请先同意用户协议',
            icon: 'none'
          })
          return
        }
        let that = this
        wx.login({
          success(res) {
            if (res.code) {
              that.$Api.postOpenIdByCode({
                code: res.code
              }).then(data => {
                uni.setStorageSync('open_id', data.data.open_id);
                uni.setStorageSync('session_key', data.data.session_key);
                that.$Api.loginByThirdlogin({
                  open_id: data.data.open_id,
                  platform: 'wxmini'
                }).then(resdata => {
                  console.log('www', resdata)
                  const {
                    userinfo
                  } = resdata.data
                  uni.setStorageSync('userInfo', userinfo)
                  if (!userinfo?.mobile) {
                    that.showPhone = true
                    return
                  }

                  uni.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 2000,
                    complete() {
                      const pages = getCurrentPages()
                      if (pages.length > 1) {
                        uni.navigateBack()
                        return
                      }
                      uni.switchTab({
                        url: '/pages/index/index',
                      })
                    }
                  })
                })
                console.log('deeedata', data)
              })

            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      },
      toIndex() {
        let that = this
        uni.login({
          "provider": 'weixin',
          "onlyAuthorize": true,
          success(res) {
            if (res.code) {
              that.$Api.postOpenIdByCode({
                code: res.code,
              }).then(res2 => {
                console.log('code: res.code,', res2)
                that.$Api.loginByThirdlogin({
                  open_id: res2.data.open_id,
                  platform: 'wxapp',
                  open_id: res2.data.open_id
                }).then(loginRes => {
                  uni.setStorageSync('hasLogin', 1)
                  uni.switchTab({
                    url: '/pages/index/index'
                  })
                  console.log('wxapp', loginRes)
                })
              })
            }
          },
          fail(err) {
            console.log(err)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .page-login {
    overflow: hidden;
  }

  .login-page-title {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 56rpx;
    color: #000000;
    line-height: 66rpx;
    margin: 216upx auto;
    text-align: center;
  }

  .self-phone {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 56rpx;
    color: #000000;
    line-height: 66rpx;
    text-align: center;
    margin: 190upx auto 0;
  }

  .self-tips {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #999999;
    line-height: 33rpx;
    text-align: center;
  }

  .self-btn {
    width: 654rpx;
    height: 88rpx;
    background: #7644FF;
    border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 32rpx;
    color: #FFFFFF;
    text-align: center;
    line-height: 88rpx;
    margin: 48upx auto 0;
  }

  .login-btn {
    width: 654rpx;
    height: 88rpx;
    background: #7644FF;
    border-radius: 1998rpx 1998rpx 1998rpx 1998rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 32rpx;
    color: #FFFFFF;
    text-align: center;
    line-height: 88rpx;
    margin: 48upx auto 0;
    border: none;

    &::after {
      padding: 0;
    }
  }

  .login-read {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 26rpx;
    color: #999999;
    margin: 96rpx auto 0;
    margin-left: 10rpx;

    .agreement {
      color: #7644FF;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
    }
  }

  .other-methods {
    display: flex;
    align-items: center;
    justify-content: center;

    .line {
      width: 114rpx;
      height: 1rpx;
      background-color: #eee;
    }

    &-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      margin: 0 16rpx;
    }
  }

  .other-login-wrap {
    position: absolute;
    bottom: calc(48rpx + constant(safe-area-inset-bottom));
    bottom: calc(48rpx + env(safe-area-inset-bottom));
    left: 0;
    width: 100%;
  }

  .mehtods-list {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;
  }

  .methods-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    &:first-child {
      margin-right: 88rpx;
    }
  }

  .login-method-img {
    height: 96rpx;
    width: 96rpx;
    border-radius: 50%;
    margin-bottom: 8rpx;
  }

  .content {
    font-size: 16px;
    text-align: center;
    margin: 24rpx auto;
  }

  .btn {
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
  }

  .confirm {
    border: none;
    // border-left: 1px solid #eee;
    color: #7644FF;

    &::after {
      border: none;
      padding: 0;
    }
  }
</style>