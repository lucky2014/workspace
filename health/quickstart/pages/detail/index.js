const app = getApp();
const util = require('../../utils/util.js')
Page({
  data:{
  	stepList: [
  	]
  },
  onLoad: function(){
    var me = this;
    //获取员工步数列表
    me.listStepsRecords();
  },
  listStepsRecords: function(){
    var me = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'https://yun.iliujia.com/liujia-health-server/health/listStepsRecords.do?t='+new Date().getTime(),
      data: {
        openId: app.globalData.openId,
      },
      method: "post",
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.resultCode == 1000){
          for(var i=0;i<res.data.returnObject.length;i++){
            res.data.returnObject[i].stepsDate = util.formatTime(res.data.returnObject[i].stepsDate);
          }

          me.setData({
            stepList: res.data.returnObject
          });
          wx.hideLoading();
          wx.pageScrollTo({
            scrollTop: 0
          });
        }
      }
    });
  },
  onPullDownRefresh: function(){
    var me = this;
    //获取员工步数列表
    me.listStepsRecords();
    wx.stopPullDownRefresh();
  }
});