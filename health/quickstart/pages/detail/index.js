Page({
  data:{
  	stepList: [
  		{date:"2017-09-08", step: 5000, goals: 1000},
  		{date:"2017-09-09", step: 4100, goals: 1000},
  		{date:"2017-09-10", step: 3400, goals: 1000},
  		{date:"2017-09-11", step: 2000, goals: 1000},
  		{date:"2017-09-12", step: 15000, goals: 1000},
  		{date:"2017-09-13", step: 5000, goals: 1000},
  		{date:"2017-09-14", step: 4100, goals: 1000},
  		{date:"2017-09-15", step: 3400, goals: 1000},
  		{date:"2017-09-16", step: 2000, goals: 1000},
  		{date:"2017-09-17", step: 15000, goals: 1000},
  		{date:"2017-09-18", step: 5000, goals: 1000},
  		{date:"2017-09-19", step: 4100, goals: 1000},
  		{date:"2017-09-20", step: 3400, goals: 1000},
  		{date:"2017-09-21", step: 2000, goals: 1000},
  		{date:"2017-09-22", step: 15000, goals: 1000},
  		{date:"2017-09-23", step: 5000, goals: 1000},
  		{date:"2017-09-24", step: 4100, goals: 1000},
  		{date:"2017-09-25", step: 3400, goals: 1000},
  		{date:"2017-09-26", step: 2000, goals: 1000},
  		{date:"2017-09-27", step: 15000, goals: 1000},
  	]
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
  }
});