import {
  API_BASE_URL,
  ENV_VERSION,
  USER_ID_KEY,
  TOKEN_KEY,
  FROM
} from "../config/env"
import FormData from './formdata.js'
const request = function(path, method, data = {}, header = {}) {
  let user_id = "";
  let token = "";
  try {
    // let hasP = false
    // 	let pPath = ['promotion/performances', 'promoters/profile', 'promoters/performances', 'announcement']
    // pPath.forEach(el=>{
    // 	if(path.includes(el)) {
    // 		hasP = true
    // 	}
    // })
    // if(hasP) {
    // 	token = uni.getStorageSync('promoters-TOKEN');
    // } else {
    // }
    // console.log('hasp', hasP, token)
    token = uni.getStorageSync(TOKEN_KEY);
    user_id = uni.getStorageSync(USER_ID_KEY);
    // if(!token) {
    //   uni.setStorageSync(TOKEN_KEY, '1820a1d9-50b9-47e1-806a-5dd4aea1dd23')
    //   token = '1820a1d9-50b9-47e1-806a-5dd4aea1dd23'
    // }
  } catch (e) {
    console.log('user_id,token-Error', e)
  }
  header = header || {
    'content-type': 'application/json' //"application/x-www-form-urlencoded"
  };
  header['content-type'] = 'application/json'
  // #ifdef APP
  header['platform'] = 'App'
  // #endif
  // #ifdef MP-WEIXIN
  header['platform'] = 'WechatMiniProgram'
  // #endif

  if (token) {
    header['token'] = token
  }
  // header['Authorization'] = 'asdasdasd'
  let cookie = [];
  // data = Object.assign(data,{token})
  // cookie.push("USERID=" + user_id);
  // cookie.push("TOKEN=" + token);
  // cookie.push("device=" + 1);
  // cookie.push("app_name=" + 1);
  // cookie.push("app_version=" + ENV_VERSION);
  // cookie.push("channel=" + 1);
  // header.cookie = cookie.join("; ");
  console.log('data----1234', token, data)
  return new Promise((resolve, reject) => {
    wx.request({ //后台请求
      url: API_BASE_URL + path,
      header: header,
      method: method,
      data: data,
      success: function(res) {
        if (res.statusCode !== 200) {
          uni.showToast({
            title: res.data.msg || '请求失败',
            icon: 'none'
          })
          if (res.statusCode == 401 || res.data.code === 401) {
            const pages = getCurrentPages()
            const current = pages[pages.length - 1]
            console.log('current', current)
            if (current.route !== 'pages/login/login') {
              uni.redirectTo({
                url: '/pages/login/login'
              })
            }
            console.log('reject-res.data', res.data)
            reject(res.data)
          }
        } else {
          if (res.data.statusCode === 401) {
            const pages = getCurrentPages()
            const current = pages[pages.length - 1]
            console.log('current', current)
            if (current.route !== 'pages/login/login') {
              uni.redirectTo({
                url: '/pages/login/login'
              })
            }
            uni.redirectTo({
              url: '/pages/login/login'
            })
            reject(res.data)
          } else {
            resolve(res.data)
          }

        }
      },
      fail: function(res) {
        reject("not data", res);
      },
      complete: function(res) {
        //uni.setStorageSync(TOKEN_KEY, '1820a1d9-50b9-47e1-806a-5dd4aea1dd23')
        if (res.header.token) {
          uni.setStorageSync(TOKEN_KEY, res.header.token)
        }
        console.log("complete", res);
      },
    });
  });
}

const login = function() {
  try {
    wx.removeStorageSync(USER_ID_KEY)
    wx.removeStorageSync(TOKEN_KEY)
  } catch (e) {}
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        let code = res.code;
        wx.request({
          url: API_BASE_URL + ''
        })
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        // wx.getUserInfo({
        //     withCredentials: true,
        //     success: res => {
        //         let userInfo = res.userInfo;
        //         let name = userInfo.nickName;
        //         let avatar = userInfo.avatarUrl;
        //         let sex = userInfo.gender;
        //         let data = {
        //             code: code,
        //             encryptedData: res.encryptedData,
        //             iv: res.iv,
        //             name: name,
        //             avatar: avatar,
        //             sex: sex,
        //             from: FROM,
        //         };
        //         request("/api/Home/openid", "POST", data).then( (res)=>{
        //           console.log('request-----',res)
        //           try {
        //               // wx.setStorageSync(USER_ID_KEY, res.user_id);
        //             //   console.log('我的的',res.data)
        //               wx.setStorageSync('SESSION_KEY', res.data.session_key);
        //               wx.setStorageSync(TOKEN_KEY, res.data.token);
        //           } catch (e) {
        //               reject(JSON.stringify(e));
        //           }
        //           resolve(res.data)
        //         }).catch( (errMsg)=>{
        //             reject(errMsg)
        //         });
        //     },
        //     fail: function (res) {
        //         console.log(res);

        //         if (res.errMsg && res.errMsg.startsWith("getUserInfo:fail") && res.errMsg.search("unauthorized") != -1) {
        //             // 跳转授权页面
        //             wx.navigateTo({
        //                 url: '/pages/auth/auth'
        //             })
        //             return;
        //         }
        //         wx.getSetting({
        //             success: (res) => {
        //                 if (!res.authSetting["scope.userInfo"]) {
        //                     // 跳转授权页面
        //                     wx.navigateTo({
        //                         url: '/pages/auth/auth'
        //                     })
        //                 }
        //             }
        //         });
        //     }
        // })
      }
    })
  });
};
const toUploadFile = function(file, name) {
  return new Promise((resolve, reject) => {
    // let formData  = new FormData();
    // formData.append('file', file);
    // formData.append('biz', 'temp');
    // uni.request({
    // 	url:API_BASE_URL + '/jeecg-boot/sys/common/upload2', 
    // 	method: 'POST',
    // 	file,
    // 	formData: {
    // 		biz: 'temp'
    // 	},
    // 	header: {
    // 		'content-type': 'multipart/form-data;boundary=' + new Date().getTime(),
    // 		Authorization: uni.getStorageSync('token'),
    // 	},
    // 	success: function(res) {
    // 	    resolve(res.data);
    // 	},
    // 	complete:res=>{
    // 	  console.log('complete',res)
    // 	},
    // 	fail:e=>{
    // 	  reject(e)
    // 	  console.log("fail",e)
    // 	}
    // })
    wx.uploadFile({
      url: API_BASE_URL + '/jeecg-boot/sys/common/upload2', //此处为实际接口地址
      filePath: file, //获取图片路径
      file,
      header: {
        'content-type': 'multipart/form-data;boundary=' + new Date().getTime(),
        Authorization: uni.getStorageSync('token'),
      },
      formData: {
        biz: 'temp'
      },
      name,
      success: function(res) {
        resolve(res.data);
        console.log('success', res)
      },
      complete: res => {
        console.log('complete', res)
      },
      fail: e => {
        reject(e)
        console.log("fail", e)
      }
    })
  })

}
module.exports = {
  request,
  login,
  toUploadFile
};