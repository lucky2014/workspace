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
    submitDisabled: false
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
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
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
    }
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
        url: 'https://yun.iliujia.com/liujia-health-server/health/getSmsCode.do',
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
        url: 'https://yun.iliujia.com/liujia-health-server/health/updateUserInfoAuthenBind.do',
        data: datas,
        method: "post",
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if(res.data.resultCode == 1000){
            wx.request({
              url: 'https://yun.iliujia.com/liujia-health-server/health/checkHasSetStepsGoal.do',
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

            me.setData({
              submitDisabled: !me.data.submitDisabled
            });
          }else{
            wx.showModal({
              title: '提示',
              content: '您的信息无法绑定。请联系健康管理工作人员处理！',
              success: function(res) {
                if (res.confirm) {
                  me.setData({
                    submitDisabled: !me.data.submitDisabled
                  });
                } else if (res.cancel) {
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
})
