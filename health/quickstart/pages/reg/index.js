//input.js
const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    selectArea:false,
    areaIndex:0,  
    area:['杭州龙骞科技有限公司','浙江鸿程计算机系统有限公司'],
    imageUrl:"../imgs/b1.jpg", 
    viewHeigh: "",
    viewWidth: "",
    smsCodeValue: "获取验证码",
    times: 60,
    disabled: false,
    submitDisabled: false,
    isDisplay: "none"
  },
  bindPickerChange: function(e){  
    this.setData({  
        areaIndex: e.detail.value  
    })  
  },
  imageLoad: function(e){ 
    var viewSize = util.getViewWHInfo(e); 
    this.setData({ 
       viewHeigh: viewSize.height, 
       viewWidth: viewSize.width 
    });  
  },
  onLoad: function(){
    var me = this;

    // 判断用户微信版本信息
    if (wx.getWeRunData) {
      wx.authorize({
        scope: 'scope.werun',
        success() {
          // 用户已经同意小程序使用计步功能
          wx.getWeRunData();
          
          wx.login({
            success: res => {
              // 获取用户信息授权
              if (app.globalData.userInfo) {
                me.setData({
                  userInfo: app.globalData.userInfo,
                  hasUserInfo: true
                })
              }else {
                // 在没有 open-type=getUserInfo 版本的兼容处理
                wx.getUserInfo({
                  success: res => {
                    app.globalData.userInfo = res.userInfo
                    me.setData({
                      userInfo: res.userInfo,
                      hasUserInfo: true
                    })
                  }
                })
              };

              //请求验证
              if (res.code) {
                wx.request({
                  url: 'https://wx.yinnima.com/liujia-health-server/health/getLoginInfoByCode.do?t='+new Date().getTime(),
                  data: {
                    code: res.code
                  },
                  method: "post",
                  header: {
                      'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (re) {
                    if(re.data.resultCode == 1000){
                      wx.setStorageSync('openId', re.data.returnObject);
                      app.globalData.openId = re.data.returnObject;
                      me.checkHasAuthen(re.data.returnObject);
                    }
                  }
                });
              } else {
                //console.log('获取用户登录态失败！' + res.errMsg)
                wx.showModal({
                  title: '提示',
                  content: '获取用户登录态失败！',
                  success: function(d) {
                    if (d.confirm) {
                      
                    } else if (d.cancel) {
                      
                    }
                  }
                });
                wx.hideLoading();
              }
            }
          });


        }
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '您的微信版本过低，不能请求计步功能！请升级您的微信版本再试试！',
        success: function(d) {
          if (d.confirm) {
              wx.reLaunch({
                url: '/pages/error/index?t='+new Date().getTime()
              });      
          } else if (d.cancel) {
            wx.reLaunch({
              url: '/pages/error/index?t='+new Date().getTime()
            });
          }
        }
      });
      wx.hideLoading();
    }
    //显示加载中
    wx.showLoading({
      title: '加载中',
    });
  },
  checkHasAuthen: function(openId){
    var me = this;
    wx.request({
      url: 'https://wx.yinnima.com/liujia-health-server/health/checkHasAuthen.do?t='+new Date().getTime(),
      data: {
        employeeOpenid: openId
      }, 
      method: "post",
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.resultCode == 1000){
          me.setData({
            isDisplay: "none"
          });
          //检验是否绑定目标步数
          me.checkHasSetStepsGoal();
        }else{
          me.setData({
            isDisplay: "block"
          });
          wx.hideLoading();
        }
      }
    });
  },
  bindInputPhone: function(e){
    this.setData({
      phone: e.detail.value
    });
  },
  getSmsCode: function(e){
    var me = this;
    if(!me.data.phone){
      wx.showToast({
        title: '手机号不能为空',
        image: "../imgs/warn.png",
        duration: 2000,
      });
    }else if(!/^1[34578]\d{9}$/.test(me.data.phone) && (me.data.phone.length != 11)){
      wx.showToast({
        title: '手机号不正确',
        image: "../imgs/warn.png",
        duration: 2000,
      });
    }else{
      wx.showToast({
        title: '验证码发送中',
        image: "../imgs/r.png",
        duration: 2000,
      });

      wx.request({
        url: 'https://wx.yinnima.com/liujia-health-server/health/getSmsCode.do?t='+new Date().getTime(),
        data: {
          openId: app.globalData.openId,
          phone: me.data.phone
        },
        method: "post",
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if(res.data.resultCode == 1000){
          }
        }
      });

      me.setData({
        disabled: !me.data.disabled
      });
      var countDown = setInterval(function(){
        me.data.times--;
        me.setData({
          times: me.data.times,
          smsCodeValue: me.data.times + "秒后重新获取"
        });
        
        if(me.data.times == 0){
          me.setData({
            times: 60,
            smsCodeValue: "获取验证码",
            disabled: !me.data.disabled
          });
          clearInterval(countDown);
        }
      },1000);

    }
  },
  formSubmit: function(e) {
    var me = this;
    var datas = e.detail.value;
    datas.companyTitle = me.data.area[me.data.areaIndex];
    datas.employeeNickName = me.data.userInfo.nickName;
    datas.employeeImageUrl = me.data.userInfo.avatarUrl;
    datas.employeeOpenid = app.globalData.openId;

    if(!datas.employeeNumber){
      wx.showToast({
        title: '工号不能为空',
        image: "../imgs/warn.png",
        duration: 2000,
      });
    }else if(!datas.phone){
      wx.showToast({
        title: '手机号不能为空',
        image: "../imgs/warn.png",
        duration: 2000,
      });
    }else if(!datas.smsCode){
      wx.showToast({
        title: '验证码不能为空',
        image: "../imgs/warn.png",
        duration: 2000,
      });
    }else{
      me.setData({
        submitDisabled: !me.data.submitDisabled
      });

      //显示加载中
      wx.showLoading({
        title: '加载中',
      });
      wx.request({
        url: 'https://wx.yinnima.com/liujia-health-server/health/updateUserInfoAuthenBind.do?t='+new Date().getTime(),
        data: datas,
        method: "post",
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if(res.data.resultCode == 1000){
            //提交确认
            me.checkHasSetStepsGoal();

            me.setData({
              submitDisabled: !me.data.submitDisabled
            });
          }else{
            wx.showModal({
              title: '提示',
              content: '您的信息无法绑定。请联系健康管理工作人员处理！',
              success: function(d) {
                if (d.confirm) {
                  me.setData({
                    submitDisabled: !me.data.submitDisabled
                  });
                } else if (d.cancel) {
                  me.setData({
                    submitDisabled: !me.data.submitDisabled
                  });
                }
              }
            });
            wx.hideLoading();
          }
        }
      });
    }
  },
  checkHasSetStepsGoal: function(){
    wx.request({
      url: 'https://wx.yinnima.com/liujia-health-server/health/checkHasSetStepsGoal.do?t='+new Date().getTime(),
      data: {
        openId: app.globalData.openId
      },
      method: "post",
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (re) {
        wx.hideLoading();
        if(re.data.resultCode == 1000){
          wx.reLaunch({
            url: '/pages/rank/index?t='+new Date().getTime()
          });
        }else{
          wx.reLaunch({
            url: '/pages/goals/index?t='+new Date().getTime()
          });
        }
      }
    });
  }
})
