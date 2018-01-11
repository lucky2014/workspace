Page({
  data:{
  },
  /*onShareAppMessage: function(){
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
  },*/
  goDesc: function(){
    wx.navigateTo({
      url: 'https://mp.weixin.qq.com/s?__biz=MzI5OTA1MDA5NQ==&mid=2247483746&idx=1&sn=18542c9b158a3f1e5b06d8984f041503&chksm=ec9d3462dbeabd74be85784e5d0ef16686df399daa139d7df738060e501a3674bfef040d0922#rd'
    });
  },
});