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
    wx.request({
      url: 'https://yun.iliujia.com/liujia-health-server/health/listStepsRecords.do',
      data: {
        openId: app.globalData.openId,
      },
      method: "post",
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(JSON.stringify(res,null,2));
        if(res.data.resultCode == 1000){
          for(var i=0;i<res.data.returnObject.length;i++){
            res.data.returnObject[i].stepsDate = util.formatTime(res.data.returnObject[i].stepsDate);
          }

          me.setData({
            stepList: res.data.returnObject
          });
        }
      }
    });
  }
});