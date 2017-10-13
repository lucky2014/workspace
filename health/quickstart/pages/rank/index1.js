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
  onLoad: function() {
    /*wx.login({
      success: function(res) {
        console.log(JSON.stringify(res,null,2));
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://test.com/onLogin',
            data: {
              code: res.code
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });*/
    wx.getSetting({
      success(res) {
          if (!res.authSetting['scope.record']) {
              wx.authorize({
                  scope: 'scope.record',
                  success() {
                      // 用户已经同意小程序使用计步功能
                      wx.getWeRunData({
                          success(res) {
                              const encryptedData = res.encryptedData
                          }
                      })
                  }
              })
          }
      }
    })
  },
  onError: function(msg) {
    console.log(msg)
  },
  /*onReady: function(){
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('firstCanvas')

    context.setStrokeStyle("#ff0000")
    context.setLineWidth(2)
    //context.moveTo(160, 60)
    context.arc(90, 100, 90, 0, 2*Math.PI, false);
    context.fill()
    context.draw()
  },*/
  /*onReady: function(){
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('firstCanvas');
    const grd = ctx.createLinearGradient(30, 10, 120, 10);
          grd.addColorStop(0, 'red');
          grd.addColorStop(0.16, 'orange');
          grd.addColorStop(0.33, 'yellow');
          grd.addColorStop(0.5, 'green');
          grd.addColorStop(0.66, 'cyan');
          grd.addColorStop(0.83, 'blue');
          grd.addColorStop(1, 'purple');

    context.setStrokeStyle("#ff0000")
    context.setLineWidth(2)
    //context.moveTo(160, 60)
    context.arc(90, 100, 90, 0, 2*Math.PI, false);
    context.stroke()
    context.draw()
  }*/
});