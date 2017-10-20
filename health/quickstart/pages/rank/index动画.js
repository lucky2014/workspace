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
      var context = wx.createContext();

      var imageUrl = '../imgs/1.gif';
      var percent = 1;
      var innerColorStart = "#ffffff";
      var innerColorMid = '#2698ff';
      var innerColorEnd = "#b1ff69";
      var circleBottomColor = '#70faff';

      var preA=Math.PI/180;

      

      /*控制运动*/
      var lineW1=5; //曲线
      var canvasW = 210;
      var R= 96; //内环半径
      var R1= 96; //外环半径
      var rotateAngle = percent*360;
      var rotataRadians = preA*rotateAngle;
      context.width = 210;
      context.height = 210;

      var x = 105;
      var y = 105;
      var startAa=-Math.PI/2;
      var startA = 0;
      var Timer;
      
      //
      context.drawImage("../imgs/circle.png", 0, 0, 210, 210)
      wx.drawCanvas({
        canvasId:1,
        actions:context.getActions()
      });
      context.save();
      context.translate(x,y);
      context.rotate(-Math.PI/2);
      
      function drawScreen(){
        if(startA<rotataRadians){
          startA+=0.1;
        }
        // Linear gradients
        context.beginPath();
        var gradient2 = context.createLinearGradient(R1, 0,-R1,0);
        gradient2.addColorStop(0, innerColorStart);
        gradient2.addColorStop(0.5, innerColorMid);
        gradient2.addColorStop(1, innerColorEnd);
        context.lineCap="round";
        context.setStrokeStyle = gradient2;
        context.lineWidth = lineW1;
        context.arc(0,0,R1,0,startA,false);
        context.stroke();
        context.closePath();
        
        //内环
        context.beginPath();
        context.setStrokeStyle = circleBottomColor;
        context.lineWidth=1;
        context.arc(0,0,R,0,Math.PI*2,false);
        context.stroke();
        context.closePath();
        context.restore();
      
        //画图
        if(startAa<rotataRadians-Math.PI/2){
          startAa+=0.1;
        }else{
          clearInterval(Timer);
        }
        context.save();
      }
      drawScreen();
      Timer=setInterval(drawScreen,20);
  }
});