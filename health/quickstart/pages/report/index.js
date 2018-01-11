//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    arrow : [],
    inforData: {}
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url:'https://yun.iliujia.com/liujia-health-server/health/listHealthInfoReports.do?t='+new Date().getTime(),
      data:{
        openId: app.globalData.openId
      },
      method : 'POST',
      dataType : 'json',
      header : {'content-type':"application/x-www-form-urlencoded"},
      success: function(msg) {
        //console.log(msg);
        var me = that;
        var arrow = [];
        //健康数据
        for(var i=0;i<msg.data.returnObject.examInfo.length;i++){
            var obj = msg.data.returnObject.examInfo[i];
            //console.log(obj);
            var liData = {
              "date": util.formatTime(obj.healthExamDate),
              "bmi":obj.bmi,
              "employeeName":obj.employeeName,
              "employeeNumber":obj.employeeNumber,
              "fruitConsum":obj.fruitConsum,
              "hipCircum":obj.hipCircum,
              "moveIndex":obj.moveIndex,
              "pressIndex1":obj.pressIndex1,
              "pressIndex2":obj.pressIndex1,
              "suggestion":obj.suggestion,
              "waistCircum":obj.waistCircum,
              "waistToHip":obj.waistToHip
            };
            arrow.push(liData);    
        };
        that.setData({
          arrow: arrow
        });

        //用户信息
        var mainInfor = msg.data.returnObject.userInfo;
        //console.log(mainInfor);
        var inforData = {
          "companyTitle":mainInfor.companyTitle,
          "employeeImageUrl":mainInfor.employeeImageUrl,
          "employeeNickName":mainInfor.employeeNickName,
          "employeeNumber" : mainInfor.employeeNumber,
          "phone" : mainInfor.phone
        };
        that.setData({
          inforData: inforData
        });
      },
    });
  },
})
