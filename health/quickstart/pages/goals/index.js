const util = require('../../utils/util.js')
const app = getApp();
Page({
  data:{
  	goals: [
  		{index:0, step: 5000},
  		{index:1, step: 10000},
  		{index:2, step: 15000}
  	],
    currentItem: 0,
    step: 5000,
    imageUrl:"../imgs/b2.jpg", 
    viewHeigh: "",
    viewWidth: ""
  },
  setActive: function(e){
  	var dataset = e.currentTarget.dataset;
    //设置当前样式
    this.setData({
      'currentItem': dataset.index,
      'step': dataset.step

    });
  },
  goRank: function(){
    var me = this;
    wx.request({
      url: 'https://yun.iliujia.com/liujia-health-server/health/saveStepsGoal.do?t='+new Date().getTime(),
      data: {
        stepsGoal: me.data.step,
        openId: app.globalData.openId,
      },
      method: "post",
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.resultCode == 1000){
          wx.reLaunch({
            url: '../rank/index?t='+new Date().getTime()
          });
        }
      }
    });
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
    wx.request({
      url: 'https://yun.iliujia.com/liujia-health-server/health/checkHasSetStepsGoal.do?t='+new Date().getTime(),
      data: {
        openId: app.globalData.openId
      },
      method: "post",
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (re) {

        var currentItem = 0;
        if(re.data.returnObject == 15000){
          currentItem = 2;
        }else if(re.data.returnObject == 10000){
          currentItem = 1;
        }else{
          currentItem = 0;
        }
        if(re.data.resultCode == 1000){
          me.setData({
            currentItem: currentItem,
            step: re.data.returnObject,
          });
        }
      }
    });
  }
});