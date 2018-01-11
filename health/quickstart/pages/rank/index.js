const app = getApp();
Page({
  data:{
    stepList: [],
    isDisplay: "none"
  },
  goGoals: function(){
    wx.navigateTo({
      url: '../goals/index?t='+new Date().getTime()
    });
  },
  goReport: function(){
    wx.navigateTo({
      url: '../report/index?t='+new Date().getTime()
    });
  },
  goDesc: function(){
    wx.navigateTo({
      url: '../desc/index?t='+new Date().getTime()
    });
  },
  goDetail: function(){
    wx.navigateTo({
      url: '../detail/index?t='+new Date().getTime()
    });
  },
  goWeekRank: function(){
    wx.navigateTo({
      url: '../weekRank/index?t='+new Date().getTime()
    });
  },
  onShow: function(options){
   
  },
  onLoad: function(options) {
    var me = this;
    //获取目标步数
    //console.log(options.step);
    wx.showLoading({
      title: '加载中',
    });
    
    /*wx.showModal({
      title: '提示',
      content: JSON.stringify(options,null,2),
      success: function(d) {
                  
      }
    });*/
    //如果是分享页面来的
    if(options.isShare){
      me.setData({
        isDisplay: "none"
      });
      
      wx.reLaunch({
        url: '../reg/index?t='+new Date().getTime()
      });
    }else{
      me.setData({
        isDisplay: "block"
      });
      if (wx.getWeRunData) {
        me.getWeRunData();
      }else{
        wx.showModal({
          title: '提示',
          content: '您的微信版本过低，不能请求计步功能！请升级您的微信版本再试试！',
          success: function(d) {
            if (d.confirm) {
                wx.reLaunch({
                  url: '../error/index?t='+new Date().getTime()
                });      
            } else if (d.cancel) {
              wx.reLaunch({
                url: '../error/index?t='+new Date().getTime()
              });
            }
            
          }
        });
      } 
    }

    
  },
  drawCircle: function(percent){
    var me = this;
    
    var context = wx.createCanvasContext('myCanvas');//创建并返回绘图上下文context对象。 
    var Timer;
    
    var R = -76;
    if(percent < 0.25){
      R = 30;
    }else if(percent < 0.75){
      R = -50;
    }

    percent = (percent>=1) ? 1: percent;
    //var preA = Math.PI/180;
    //var rotateAngle = percent*360;
    //var rotataRadians = percent*360;
    //var rotataRadians = preA*rotateAngle;
    var startAa =- Math.PI/2;
    var startA = 0;
    function drawStep(){
      if(startA < percent){
        startA += 0.05;
      }else{
        clearInterval(Timer);
      }

      
      /*if(percent < 1){
        if(startA < rotataRadians){
          startA += 0.1;
        }
      }else{
        if(startA < 2){
          startA += 0.1;
        }
      }*/

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


      context.arc(0, 0, 76, 0, startA*2*Math.PI , false);
      context.stroke();
      context.draw(); 


      //画图
      /*if(startAa < rotataRadians- Math.PI/2){
        startAa+=0.1;
      }else{
        clearInterval(Timer);
      }*/
      context.save();
    }
    drawStep();
    Timer=setInterval(drawStep,30);   
    wx.hideLoading();
    wx.pageScrollTo({
      scrollTop: 0
    });  
  },
  onShareAppMessage: function(){
    return {
      title: "运动大挑战",
      desc: "",
      path: "../rank/index?isShare=1&t="+new Date().getTime(),
      success: function(){
        console.log("分享成功!");
      },
      fail: function(){
        console.log("分享失败!");
      }
    }
  },
  onPullDownRefresh: function(){
    var me = this;
    wx.showLoading({
      title: '加载中',
    });
    
    me.getWeRunData();
    wx.stopPullDownRefresh();
  },
  getWeRunData: function(){
    var me = this;
    wx.getWeRunData({
      success: function(re) {
        me.setData({
          isDisplay: "block"
        });
        const encryptedData = re.encryptedData;
        wx.request({
          url: 'https://yun.iliujia.com/liujia-health-server/health/updateEmployeeStepInfo.do?t='+new Date().getTime(),
          data: {
            encryptedData: encryptedData,
            iv: re.iv,
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
    })
  }
});