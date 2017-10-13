const util = require('../../utils/util.js');
Page({
  data:{
    stepList: [
      {
        sort: 1,
        image: "../imgs/j1.png",
        avatarUrl: "http://wx.qlogo.cn/mmhead/4rnYrgxLHUkpLqaI5V7EWSQhkc1J46OEIfFDZOUhm0g/132",
        nickName: "清梅",
        jobNumber: 17,
        step: 5000
      },
      {
        sort: 2,
        image: "../imgs/j2.png",
        avatarUrl: "http://wx.qlogo.cn/mmhead/4rnYrgxLHUkpLqaI5V7EWSQhkc1J46OEIfFDZOUhm0g/132",
        nickName: "清梅",
        jobNumber: 3,
        step: 15000
      },
      {
        sort: 3,
        image: "../imgs/j3.png",
        avatarUrl: "http://wx.qlogo.cn/mmhead/4rnYrgxLHUkpLqaI5V7EWSQhkc1J46OEIfFDZOUhm0g/132",
        nickName: "清梅",
        jobNumber: 7,
        step: 10000
      },
      {
        sort: 4,
        image: "",
        avatarUrl: "http://wx.qlogo.cn/mmhead/4rnYrgxLHUkpLqaI5V7EWSQhkc1J46OEIfFDZOUhm0g/132",
        nickName: "清梅",
        jobNumber: 483,
        step: 5000
      }
    ],
  },
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh();
    var _this = this;
    _this.setData({
      stepList:[]
    });

    wx.login({

    });
  },
  onShareAppMessage: function(){
    return {
      title: "分享的标题. ",
      desc: "分享一段描述. ",
      path: location.href,
      success: function(){
        console.log("分享成功!");
      },
      fail: function(){
        console.log("分享失败!");
      }
    }
  },
  goGoals: function(){
    wx.navigateTo({
      url: '../goals/index'
    });
  },
  goDesc: function(){
    wx.navigateTo({
      url: '../desc/index'
    });
  },
  goDetail: function(){
    wx.navigateTo({
      url: '../detail/index'
    });
  },
  goWeekRank: function(){
    wx.navigateTo({
      url: '../weekRank/index'
    });
  },
  onLoad: function() {
  },
  onError: function(msg) {
    console.log(msg)
  },
  onReady: function(){
    var canvasC=wx.createCanvasContext("canvasThree3");
    canvasC.drawImage("../imgs/j1.png",0,0);
    canvasC.draw()
  }
});