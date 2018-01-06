const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    
  },
  onLoad : function(){
  	wx.showLoading({
	  title: '登录中',
	})
  	wx.login({
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
              	app.globalData.userId = msg.returnObject.userId;
              	app.globalData.key = msg.returnObject.token;
              	wx.getSetting({
			      	success: res => {
			         	 wx.getUserInfo({
			            	success: res => {
			              	// 可以将 res 发送给后台解码出 unionId
			              		var data = {
			              			headImg : res.userInfo.avatarUrl,
			              			nickName : res.userInfo.nickName,
			              		}
			              		app.globalData.username = res.userInfo.nickName;
			              		wx.request({
							        url:util.url3,
							        method : 'POST',
							        header : {'content-type':"application/x-www-form-urlencoded"},
							        dataType : 'json',
							        data:{cmd:"updateUserInfo",value:JSON.stringify(util.getAjax(data))},
							        success: function(res) {
							          var msg = res.data;
							          if(msg.resultCode == 1000){
							          	 var data = {
											targetType:1,
											pageSize:10,
											pageNum:1,
										 }
										 wx.request({
											url:util.url,
											method : 'POST',
											header : {'content-type':"application/x-www-form-urlencoded"},
											dataType : 'json',
											data:{cmd:"qryWorks",value:JSON.stringify(util.getAjax(data))},
											success: function(res) {
												if(res.data.resultCode==1000&&res.data.returnObject.length==0){
													wx.reLaunch({
										               url: "./../templet/index"
										            })
												}else{
													wx.reLaunch({
										               url: "./../list/list"
										            })
												}
											}
										 })
							          }
							        }
							     })
			            	}
			          	})
			      	}
			   })
            }
          },
          fail : function(res){
            console.log(res)
          }
        })
      }
    })
  }
})
