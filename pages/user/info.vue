<template>
  <view class="page-user-info">
    <view class="cu-list menu sm-border card-menu margin-top">
      <view class="cu-item arrow">
        <view class="content">
          <text class="text-black">头像</text>
        </view>
        <!-- #ifdef APP-PLUS -->
        <view class="action" @click="changeAvatar">
          <image :src="userInfo.avatar" class="my-ava-img" mode="aspectFill"></image>
        </view>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <button class="cus-button" open-type="chooseAvatar" @chooseavatar="chooseAvatar">
          <image v-if="userInfo.avatar" :src="userInfo.avatar" class="my-ava-img" mode="aspectFill"></image>
          <image v-else src="/static/common/df.png" class="my-ava-img" mode="aspectFill"></image>
        </button>
        <!-- #endif -->
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="text-black">昵称</text>
        </view>
        <view class="action" @click="editUser('nickname')">
          <span>{{userInfo.nickname}}</span>
        </view>
      </view>
      <view class="cu-item ">
        <view class="content">
          <text class="text-black">手机号</text>
        </view>
        <view class="action">
          <span>{{userInfo.mobile}}</span>
        </view>
      </view>
    </view>
    <view class="cu-list menu sm-border card-menu margin-top">
      <view class="cu-item arrow" @click="editUser('bio')">
        <view class="content">
          <text class="text-black">个性签名</text>
        </view>
        <view class="action sign">
          <view class="text-gray line-1 sign-txt">{{userInfo.bio}}</view>
        </view>
      </view>
    </view>
    <u-popup :show="showIpt" mode="bottom" round="12" @close="showIpt = false" closeable>
      <view class="wrap">
        <template v-if="iptKey == 'nickname'">
          <view class="ipt-wrap">
            <!-- #ifdef APP-PLUS -->
            <u--input v-model="form.nickname" type="nickname" placeholder="请输入昵称"></u--input>
            <!-- #endif -->

            <!-- #ifdef MP-WEIXIN -->
            <view class="input-box">
              <input type="nickname" :cursor-spacing="10" :value="form.nickname" style="width: 100%;height: 100%;"
                placeholder="请输入昵称" @input="nickChange" />
            </view>
            <!-- #endif -->

          </view>
        </template>
        <template v-if="iptKey == 'bio'">
          <view class="ipt-wrap">
            <u--textarea v-model="form.bio" placeholder="请输入签名"></u--textarea>
          </view>
        </template>
        <view class="btns">
          <view class="btn btn-save" @click="showIpt = false">取消</view>
          <view class="btn btn-share" @click="onSubmit">确认</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
  import {
    API_BASE_URL,
    TOKEN_KEY
  } from '../../config/env';
  // import upload from '../../uni_modules/uview-ui/libs/config/props/upload';
  export default {
    data() {
      return {
        userInfo: {},
        sign: '不积跬步无以至千里',
        showIpt: false,
        iptKey: 'nickname',
        form: {
          nickname: '',
          bio: '不积跬步无以至千里'
        }
      };
    },
    onLoad() {
      this.getUserInfo()
    },
    methods: {
      chooseAvatar(e) {
        this.uploadFile(e.detail.avatarUrl)
      },
      nickChange(e) {
        console.log(e);
        this.form.nickname = e.detail.value
      },
      editUser(type) {
        this.showIpt = true
        this.iptKey = type
      },
      changeAvatar() {

        uni.chooseImage({
          count: 1,
          success: (res) => {
            this.uploadFile(res.tempFilePaths[0])
          }
        })
      },
      uploadFile(file) {
        const token = uni.getStorageSync(TOKEN_KEY)
        uni.uploadFile({
          url: API_BASE_URL + '/api/common/upload', // 服务器上传接口
          filePath: file,
          name: 'file', // 必须填写，后台用来接收文件
          formData: {
            // 其他POST请求中的额外参数
          },
          header: {
            token: token
          },
          success: (uploadFileRes) => {
            console.log(uploadFileRes.data, uploadFileRes);
            let temp = JSON.parse(uploadFileRes.data);
            this.submitUserInfo({
              avatar: temp.data.fullurl,
              nickname: this.userInfo.nickname,
              bio: this.userInfo.bio || ''
            })
          },
          fail: (error) => {},
        });
      },
      onSubmit() {
        this.submitUserInfo({
          avatar: this.userInfo.avatar,
          ...this.form
        })
      },
      async submitUserInfo(info) {
        await this.$Api.postUserInfo(info)
        this.showIpt = false
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        this.getUserInfo()
      },
      async getInfo() {
        let res = await this.$Api.getForumCircleHeader()
        if (res.data?.sign) {
          this.sign = res.data.sign
        }
      },
      toUserSign() {
        uni.navigateTo({
          url: '/pages/sub-nav/circleRelease?topic=1'
        })
      },
      async getUserInfo() {
        try {
          const {
            data
          } = await this.$Api.getUserInfo()
          this.userInfo = data
          this.form.nickname = data.nickname
          this.form.bio = data.bio
        } catch (e) {
          //TODO handle the exception
        }
      },
    }
  }
</script>

<style lang="scss">
  .page-user-info {
    background-color: #f8f8f8;
    min-height: 100vh;
    overflow: hidden;

    .my-ava-img {
      height: 64rpx;
      width: 64rpx;
      border-radius: 50%;
    }

    .action {
      min-width: 120rpx;
      text-align: right;
    }

    .sign {
      flex: 4;
      max-width: 400rpx;
      min-width: 200rpx;

      .sign-txt {
        width: 100%;
      }
    }
  }

  .wrap {
    padding-top: 80rpx;
  }

  .ipt-wrap {
    padding: 24rpx;
  }

  .btns {
    width: 100%;
    height: 136rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24rpx;
    padding: 30rpx;

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
    }
  }

  .input-box {
    width: 100%;
    height: 78rpx;
    padding: 12rpx 18rpx;
    border: 1px solid #ccc;
    border-radius: 8rpx;
    text-align: left;
    vertical-align: middle;
  }

  .cus-button {
    padding: 0;
    display: flex;
    align-items: center;
  }
</style>