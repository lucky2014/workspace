const app = getApp();
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
    wx.getWeRunData({
        success(res) {
          console.log(JSON.stringify(res,null,2));
          const encryptedData = res.encryptedData;
          wx.request({
            url: 'https://wx.yinnima.com/liujia-health-server/health/updateEmployeeStepInfo.do',
            data: {
              encryptedData: encryptedData,
              iv: res.iv,
              openId: app.globalData.openId
            },
            method: "post",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res);
              if(res.data.resultCode == 1000){
                
              }
            }
          });
        }
    });
  },
  onError: function(msg) {
    console.log(msg)
  },
  onReady: function(){
    var context = wx.createCanvasContext('myCanvas');//创建并返回绘图上下文context对象。 

    context.translate(105,105);
    context.rotate(-Math.PI/2);
    var Timer;

    var gradient2 = context.createLinearGradient(76, 0,-76,-76);
    gradient2.addColorStop(0, '#2698ff');
    gradient2.addColorStop(0.5, "#b1ff69");
    gradient2.addColorStop(1, '#70faff');
    context.setLineCap("round");
    context.setStrokeStyle(gradient2);
    context.setLineWidth(6);
    context.arc(0,0,76,0,1.5*Math.PI,false);
    context.stroke();
  
    context.draw(); 
  },
  onShow: function(){
    
  }
});