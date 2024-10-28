<template>
  <view class="page-circle-release page-wrap">
    <view class="cu-bar search">
      <image src="https://jzxt.qifudaren.net/static/common/back-black.png" class="icon-48"
        style="margin-right: 98rpx; margin-left: 32rpx;" @click="toBack" mode=""></image>
      <view class="page-title">{{pageConfig[pageType].title}}</view>
      <view class="action" style="margin-right: 32rpx;">
        <view class="cu-btn round release-btn" @click="toSave">{{pageConfig[pageType].btn}}</view>
        <!-- <image src="https://jzxt.qifudaren.net/static/shop/icon-cart.png" @click="toCart"  class="chat-icon"  mode=""></image> -->
      </view>
    </view>
    <template v-if="true">
      <textarea name="" v-model="textarea" :placeholder="pageConfig[pageType].hold" class="release-area" id="" cols="30"
        rows="10"></textarea>
      <view class="upload-wrap">
        <view class="upload-img-wrap-image relative" v-for="(item, index) in imageList" :key="item">
          <image :src="item.path" class="upload-img" mode="aspectFill"></image>
          <view class="icon-wrap flex justify-center align-center" @click="remove(index)">
            <image src="/static/common/close-fill.png" class="icon-fill" mode="aspectFill"></image>
          </view>
        </view>
        <view class="upload-img-wrap" @click="addImage">
          <image src="https://jzxt.qifudaren.net/static/circle/icon-upload.png" class="icon-upload" mode=""></image>
          <view>添加</view>
        </view>
      </view>
    </template>
    <template v-else>
      <!-- <textarea name="" v-model="textarea" placeholder="不积跬步无以至千里" class="release-area" id="" cols="30"
        rows="10"></textarea> -->
      <view class="sign">
        <u--textarea v-model="textarea" placeholder="不积跬步无以至千里" :count="40"></u--textarea>
      </view>
      <!-- <view class="action" style="margin-right: 32rpx;">
        <view class="cu-btn round release-btn" @click="toSave">{{pageConfig[pageType].btn}}</view>
      </view> -->
    </template>
  </view>
</template>

<script>
  import {
    API_BASE_URL,
    ENV_VERSION,
    USER_ID_KEY,
    TOKEN_KEY,
    FROM
  } from "../../config/env"

  export default {
    data() {
      return {
        textarea: '',
        pageType: 1,//1:成长圈，2:笔记
        imageList: [],
        pageConfig: {
          1: {
            title: '发表想法',
            btn: '发布',
            hold: '请输入你此刻的想法',
            loadingText: '发布中',
            successText: '发布成功',
            failText: '发布失败',
          },
          2: {
            title: '记录笔记',
            btn: '记录',
            hold: '请输入笔记',
            loadingText: '记录中',
            successText: '记录成功',
            failText: '记录失败',
          }
        },
        noteDetail: {},
        count: 9,
        action: 'add'
      };
    },
    onLoad(query) {
      if (query.topic !== undefined) {
        this.pageType = query.topic
      }
      if(query.action && query.action == 'edit') {
        this.action = query.action
        const json = decodeURIComponent(query.note)
        const note = JSON.parse(json)
        this.noteDetail = note
        this.textarea = note.content
        this.imageList = note.imageList.map(item => ({path: item, uploaded: true}))
        this.count = 9 - this.imageList.length
      }
    },
    methods: {
      remove(idx) {
        this.imageList.splice(idx, 1)
        this.count++
      },
      addImage() {
        const that = this;
        uni.chooseImage({
          count: this.count, //默认9
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          //sourceType: ['album'], //从相册选择
          success: (res) =>  {
            that.imageList = that.imageList.concat(res.tempFiles);
            this.count = this.count - res.tempFiles.length
          }
        });
      },
      toSave() {
        this.toSaveCircle();
      },
      toSaveSign() {

      },
      async toSaveCircle() {
        uni.showLoading({
          title: this.pageConfig[this.pageType].loadingText
        });
        const that = this;
        let token = uni.getStorageSync(TOKEN_KEY);
        // 使用Promise.all来同步上传所有文件
        Promise.all(this.imageList.filter(item => !item.uploaded).map(filePath => {
          return new Promise((resolve, reject) => {
            uni.uploadFile({
              url: API_BASE_URL + '/api/common/upload', // 服务器上传接口
              filePath: filePath.path,
              name: 'file', // 必须填写，后台用来接收文件
              formData: {
                // 其他POST请求中的额外参数
              },
              header: {
                token: token
              },
              success: (uploadFileRes) => {
                console.log(uploadFileRes.data, uploadFileRes);
                resolve(uploadFileRes);
              },
              fail: (error) => {
                reject(error);
              },
            });
          });
        })).then(async (results) => {

          let imagelist = this.imageList.filter(item => item.uploaded).map(item => item.path);
          for (let i = 0; i < results.length; i++) {
            let temp = JSON.parse(results[i].data);
            imagelist.push(temp.data.fullurl)
          }
          try{
            if(this.action == 'edit') {
              await this.$Api.updateNotes({
                forum_id: this.noteDetail.id,
                content: this.textarea,
                images: imagelist.join(',')
              })
            } else {
              let res = await that.$Api.addForum({
                kind: this.pageType,
                content: that.textarea,
                images: imagelist.join(',')
              })
            }
            uni.$emit('public')
            uni.hideLoading()
            uni.showToast({
              title: this.pageConfig[this.pageType]['successText'],
            })
            setTimeout(function() {
              uni.navigateBack()
            }, 1000)
          }catch(e){
            //TODO handle the exception
            uni.showToast({
              title: this.pageConfig[this.pageType]['failText'],
              icon: 'error'
            })
          }
        }).catch(error => {
          uni.hideLoading()
          console.error('Upload failed', error);
        });
        //for(let i=0;i<this.imageList.length;i++){
        //	let upitem=await this.$Api.postCommonUpload({
        //		file:
        //	})
        //}

        //uni.navigateBack()
      },
      toBack() {
        uni.navigateBack()
      }
    }
  }
</script>

<style lang="scss">
  .page-circle-release {
    .release-area {
      height: 520rpx;
      padding: 32rpx;
      color: #333;
    }

    .sign {
      width: 750rpx;
      padding: 20rpx 32rpx;
    }

    .page-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 36rpx;
      color: #000000;
    }

    .upload-wrap {
      padding: 32rpx;
      display: flex;
      flex-wrap: wrap;
    }

    .upload-img-wrap-image {
      width: 208rpx;
      height: 208rpx;
      background: rgba(118, 68, 255, 0.06);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-bottom: 20rpx;
      margin-right: 20rpx;

      .upload-img {
        width: 100%;
        height: 100%;
        border-radius: 16rpx;
      }

      .icon-wrap {
        width: 54rpx;
        height: 54rpx;
        position: absolute;
        top: 0;
        right: 0;

        .icon-fill {
          width: 48rpx;
          height: 48rpx;
        }
      }
    }

    .upload-img-wrap {
      width: 208rpx;
      height: 208rpx;
      background: rgba(118, 68, 255, 0.06);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border: 1rpx dashed #7644FF;
      margin-bottom: 20rpx;
      margin-right: 20rpx;
    }

    .icon-upload {
      height: 52rpx;
      width: 52rpx;
    }

    .release-btn {
      // position: fixed;
      // bottom: 64rpx;
      // left: 50%;
      // width: 686rpx;
      // margin-left: -343rpx;
      width: 136rpx;
      background: #7644FF;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 36rpx;
      color: #FFFFFF;
    }
  }
</style>