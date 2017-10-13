//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          /*wx.request({
            url: 'getLoginInfoByCode.do',
            data: {
              code: res.code
            },
            success: function (res) {
              var sessionId = res.data;
              this.globalData.sessionId = sessionId;
              wx.setStorageSync('sessionId', sessionId)
              that.decodeUserInfo()
            }
          })*/
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        //console.log(JSON.stringify(res,null,2));
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          wx.authorize({
              scope: 'scope.record',
              success() {
                  // 用户已经同意小程序使用计步功能
                  wx.getWeRunData();
              }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})