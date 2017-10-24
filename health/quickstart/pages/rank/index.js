const app = getApp();
Page({
  data:{
    stepList: [],
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
  onLoad: function(options) {
    var me = this;
    //获取目标步数
    //console.log(options.step);
    wx.getWeRunData({
        success(res) {
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
              if(res.data.resultCode == 1000){
                var stepsGoal = res.data.returnObject.currentUser.stepsGoal;
                var stepsToday = res.data.returnObject.currentUser.stepsDay;
                var percent = stepsToday/stepsGoal;

                var userSort = res.data.returnObject.userSort;

                for(var i=0;i<userSort.length;i++){
                  var bytesCount = 0;
                  var employeeNickName = userSort[i].employeeNickName;

                  if(/^[A-Za-z\.\-\_\+\$\*\%\@\#\!]+$/.test(employeeNickName)){
                    if(employeeNickName.length>8){
                      userSort[i].employeeNickName = userSort[i].employeeNickName.substring(0,8)+"..."; 
                    }
                  }else{
                    if(employeeNickName.length>5){
                      userSort[i].employeeNickName = userSort[i].employeeNickName.substring(0,5)+"..."; 
                    }
                  }

                  if(i<3){
                    userSort[i].image = '../imgs/j'+(i+1)+'.png';
                  }else{
                    userSort[i].image = '';
                  }
                }
                me.setData({
                  percent: percent,
                  stepsToday: stepsToday,
                  stepsGoal: stepsGoal,
                  stepList: userSort,
                  currentUserRank: res.data.returnObject.currentUserRank
                });
                //画图
                me.drawCircle(percent);

              }
            }
          });
        }
    });
  },
  drawCircle: function(percent){
    var me = this;
    var context = wx.createCanvasContext('myCanvas');//创建并返回绘图上下文context对象。 
    var Timer;
    
    var R = -76;
    var percent = (percent > 1) ? 1 : percent;
    if(percent < 0.25){
      R = 30;
    }else if(percent < 0.75){
      R = -50;
    }
    var preA = Math.PI/180;
    var rotateAngle = percent*360;
    var rotataRadians = preA*rotateAngle;
    var startAa =- Math.PI/2;
    var startA = 0;
    function drawStep(){
      if(startA < rotataRadians){
          startA += 0.1;
      }

      context.beginPath();
      context.translate(105,105);
      context.rotate(-Math.PI/2);
      var gradient2 = context.createLinearGradient(76, 0, R, 0);
      gradient2.addColorStop(0, '#2698ff');
      gradient2.addColorStop(0.5, "#b1ff69");
      gradient2.addColorStop(1, '#70faff');
      context.setLineCap("round");
      context.setStrokeStyle(gradient2);
      context.setLineWidth(6);


      context.arc(0, 0, 76, 0, startA, false);
      context.stroke();
      context.draw(); 


      //画图
      if(startAa < rotataRadians-Math.PI/2){
        startAa+=0.1;
      }else{
        clearInterval(Timer);
      }
      context.save();
    }
    drawStep();
    Timer=setInterval(drawStep,20);    
  },
  onShareAppMessage: function(){
    return {
      title: "运动大比拼",
      desc: "",
      path: location.href,
      success: function(){
        console.log("分享成功!");
      },
      fail: function(){
        console.log("分享失败!");
      }
    }
  }
});