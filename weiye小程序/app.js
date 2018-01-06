//app.js
App({
  onLaunch: function () {
    var me = this;
    // 登录
    /*wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url:"https://ep.diantimes.cn/edd_user/wxMPLogin.do",
          method : 'POST',
          header : {'content-type':"application/x-www-form-urlencoded"},
          dataType : 'json',
          data:{code:res.code},
          success: function(res) {
            console.log(res);
            var msg = res.data;
            if(msg.resultCode == 1000){
              me.globalData.userId = msg.returnObject.userId;
              me.globalData.key = msg.returnObject.token;
            }
          },
          fail : function(res){
            console.log(res)
          }
        })
      }
    })*/
  },
  globalData: {
    userId : null,
    key : null,
    username : "",
  }
})