const hSwiper=require("../../component/hSwiper/hSwiper.js");
const util = require('../../utils/util.js')
var option={
	data:{
		//swiper插件变量
		hSwiperVar:{},
		themeUrl : "",
	},
	id : 1,
	onLoad:function(){
		var me = this;
		var data = {};
	    data.pageSize = 0;
	    data.pageNum = 0;
	    data.targetType = 1;
	    wx.request({
	      url:util.url2,
	      method : 'POST',
	      header : {'content-type':"application/x-www-form-urlencoded"},
	      dataType : 'json',
	      data:{cmd:"qryThemes",value:JSON.stringify(util.getAjax(data,1))},
	      success: function(res) {
	        console.log(res);
	        var msg = res.data;
	        if(msg.resultCode == 1000){
	          var obj = msg.returnObject;
	          var list = [];
	          for(var i=0;i<obj.length;i++){
	             list.push({img:obj[i].previewImg,name:obj[i].name,themeid:obj[i].themeId})
	          };
	          var swiper=new hSwiper({reduceDistance:105,varStr:"hSwiperVar",list:list})
	          swiper.afterViewChange=function(data,index){
				 me.id = JSON.parse(data).themeid;
				 console.log(me.id)
			  };
	        }
	      }
	    })
	},
	gotoeditor : function(){
		var me = this;
		var data = {
	      themeId : me.id,
	    }
	    wx.request({
	      url:util.url2,
	      method : 'POST',
	      header : {'content-type':"application/x-www-form-urlencoded"},
	      dataType : 'json',
	      data:{cmd:"qryThemeData",value:JSON.stringify(util.getAjax(data))},
	      success: function(res) {
	        var msg = res.data;
	        if(msg.resultCode == 1000){
	          if(JSON.parse(msg.returnObject).atlasData){
	          	me.setData({
		          	themeUrl:"https://ep.diantimes.cn/group1"+JSON.parse(msg.returnObject).atlasData.split("group1")[1],
		        })
	          }
	          wx.navigateTo({
				url : "../editor/editor?articledata="+JSON.parse(msg.returnObject).articleData
			  })
	        }
	      }
	    })
	}
};

Page(option);