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
  imageLoad:function(e){ 
    var viewSize = util.getViewWHInfo(e); 
    this.setData({ 
       viewHeigh: viewSize.height, 
       viewWidth: viewSize.width 
    });  
  },
  onLoad: function(){
    var me = this;

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (app.globalData.userInfo) {
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
        }else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          })
        };
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
          })
        }
      }
    });
  },
  checkHasAuthen: function(openId){
    var me = this;
    wx.request({
      url: 'https://wx.yinnima.com/liujia-health-server/health/checkHasAuthen.do',
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
        url: 'https://wx.yinnima.com/liujia-health-server/health/getSmsCode.do',
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

      wx.request({
        url: 'https://wx.yinnima.com/liujia-health-server/health/updateUserInfoAuthenBind.do',
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
            })
          }
        }
      });
    }
  },
  checkHasSetStepsGoal: function(){
    wx.request({
      url: 'https://wx.yinnima.com/liujia-health-server/health/checkHasSetStepsGoal.do',
      data: {
        openId: app.globalData.openId
      },
      method: "post",
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (re) {
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
})
