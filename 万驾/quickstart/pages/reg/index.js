//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    viewHeigh: "",
    viewWidth: "",
    banner: {
    	nodes: [
          {
            name: 'h1',
            attrs: {
              class: 'title',
              style: ''
            },
            children: [{
              type: 'text',
              text: '购买成功！'
            }]
          }
        ]
    },
    submitDisabled: false
  },
  imageLoad: function(e){
  	var viewSize = util.getViewWHInfo(e,1); 
  	this.setData({ 
       viewHeigh: viewSize.height, 
       viewWidth: viewSize.width 
    });
  },
  formSubmit: function(e){
  	console.log(e);
  	var datas = e.detail.value;
  	if(!datas.name){
      wx.showToast({
        title: '姓名不能为空',
        image: "../../imgs/warn.png",
        duration: 2000,
      });
    }else if(!datas.id){
      wx.showToast({
        title: '身份证不能为空',
        image: "../../imgs/warn.png",
        duration: 2000,
      });
    }else if(!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(me.data.id) && (me.data.id.length != 18)){
      wx.showToast({
        title: '身份证不正确',
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
			  //隐藏loading
			  wx.hideLoading();
			  if(res.data.resultCode == 1000){
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
  }
})
