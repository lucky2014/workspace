//app.js
App({
  onLaunch: function () {
    var me = this;
    wx.checkSession({
      fail: function(){
        wx.showModal({
          title: '提示',
          content: '当前登录状态无效！',
          success: function(res) {
            if (res.confirm) {
              
            } else if (res.cancel) {
              
            }
          }
        })
        // 登录
        me.login();
      },
      success: function(options){
        // 登录
        var options = JSON.stringify(options,null,2)
        wx.showModal({
          title: '提示',
          content: options,
          success: function(res) {
            if (res.confirm) {
              
            } else if (res.cancel) {
              
            }
          }
        })
        me.login();
      }
    });
  },
  globalData: {
    userInfo: null
  },
  checkHasAuthen: function(employeeOpenid){ //检查用户是否认证绑定
    wx.request({
      url: 'https://wx.yinnima.com/liujia-health-server/health/checkHasAuthen.do',
      data: {
        employeeOpenid: employeeOpenid
      },
      method: "post",
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //console.log("checkHasAuthen:"+JSON.stringify(res,null,2));
        if(res.data.resultCode == 9998){
          wx.reLaunch({
            url: '/pages/reg/index'
          });
        }else{

          wx.request({
            url: 'https://wx.yinnima.com/liujia-health-server/health/checkHasSetStepsGoal.do',
            data: {
              openId: employeeOpenid
            },
            method: "post",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (re) {
              //console.log("checkHasSetStepsGoal:"+JSON.stringify(re,null,2));
              if(re.data.resultCode == 1000){
                wx.reLaunch({
                  url: '/pages/rank/index'
                });
              }else{
                wx.reLaunch({
                  url: '/pages/goals/index'
                });
              }
            }
          });
        }
      }
    })
  },
  login: function(){
    var me = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://wx.yinnima.com/liujia-health-server/health/getLoginInfoByCode.do',
            data: {
              code: res.code
            },
            method: "post",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (re) {
              //console.log("getLoginInfoByCode:"+JSON.stringify(re,null,2));
              if(re.data.resultCode == 1000){
                wx.setStorageSync('openId', re.data.returnObject);
                me.globalData.openId = re.data.returnObject;
                me.checkHasAuthen(re.data.returnObject);

                
              }
            }
          });


          // 获取用户信息
          wx.getSetting({
            success: res => {
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
                    scope: 'scope.werun',
                    success() {
                        // 用户已经同意小程序使用计步功能
                        wx.getWeRunData();
                    }
                })
              }
            }
          })
        } else {
          //console.log('获取用户登录态失败！' + res.errMsg)
          wx.showModal({
            title: '提示',
            content: '获取用户登录态失败！',
            success: function(res) {
              if (res.confirm) {
                
              } else if (res.cancel) {
                
              }
            }
          })
        }
      }
    })
  }
})