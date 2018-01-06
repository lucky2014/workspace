//logs.js
const util = require('../../utils/util.js')
Page({	
	data : {
		list : [],
		empty : 1,
	},
	pageNum:1,
	onLoad : function(){
		var me = this;
		var list = [];
		me.setData({
	      list: list
	    })
	    me.getList(1);
	},
	onPullDownRefresh : function(){
		var me = this;
		var list = [];
		me.setData({
	      list: list
	    })
	    me.pageNum=1,
	    me.getList(me.pageNum);
		wx.stopPullDownRefresh()
	},
	onReachBottom: function(){
		var me = this;
		me.getList(me.pageNum)
	},
	getList: function(pageNum){
		var data = {
			targetType:1,
			pageSize:10,
			pageNum:pageNum
		}
		var me = this;
		wx.request({
			url:util.url,
			method : 'POST',
			header : {'content-type':"application/x-www-form-urlencoded"},
			dataType : 'json',
			data:{cmd:"qryWorks",value:JSON.stringify(util.getAjax(data))},
			success: function(res) {
				var msg = res.data;
				me.pageNum++;
			    if(msg.resultCode==1000&&msg.returnObject.length>0){
			    	var list = me.data.list;
				    for(var i=0;i<msg.returnObject.length;i++){
				    	var obj = msg.returnObject[i];
				    	var liData = {
				    		"name":obj.name,
							"date":util.formatDateFn(obj.modifyTime),
							"look":obj.browseNum,
							"good":obj.praiseNum,
							"img":obj.essayCoverUrl,
							"type" : 1,
							"essayid" : obj.essayId,
							"hasObj" : obj.hasObj
				    	};
				    	list.push(liData);			   		    	
				    };
				    me.setData({
				      list: list,
				       empty: 1,
				    });
			    }
			},
		});
	},
	ediorFn : function(event){
		wx.navigateTo({
		  url: "./../editor/editor?id="+event.target.dataset.essayid
		})
	},
	synchFn : function(e){
		var data = {};
		data.targetId =e.target.dataset.essayid;
		data.targetType = 1;
		wx.request({
			url:util.url,
			method : 'POST',
			header : {'content-type':"application/x-www-form-urlencoded"},
			dataType : 'json',
			data:{cmd:"shareWork",value:JSON.stringify(util.getAjax(data))},
			success: function(res) {
				if(res.data.resultCode==1000){
					wx.navigateTo({
					  url: "./../preview/preview?url="+res.data.returnObject+"&id="+e.currentTarget.dataset.essayid
					})
				}
			}
		})
	},
	delectFn : function(event){
		var me = this;
		wx.showModal({
		  title: '提示',
		  content: '是否删除该文章',
		  success: function(res) {
		    if (res.confirm) {
		    	var data = {
		    		targetType : 1,
		    		targetId : event.target.dataset.essayid,
		    	}
		    	wx.request({
					url:util.url,
					method : 'POST',
					header : {'content-type':"application/x-www-form-urlencoded"},
					dataType : 'json',
					data:{cmd:"delWork",value:JSON.stringify(util.getAjax(data))},
					success: function(res) {
						if(res.data.resultCode==1000){
							var arr = me.data.list;
							var index = event.target.dataset.index;
							arr.splice(index,1);
							me.setData({
								list : arr
							})
							wx.showToast({
							  title: '修改成功',
							  icon: 'success',
							  duration: 2000
							})
						}
					}
				})
		    } else if (res.cancel) {

		    }
		  }
		})
	},
	gotoeditor : function(){
		wx.navigateTo({
			url : "../templet/index"
		})
	},
	preview : function(event){
		wx.navigateTo({
			url : "../preview/preview?id="+event.currentTarget.dataset.essayid
		})
	},
	countFn : function(e){
		if(e.currentTarget.dataset.hasobj == 1){
			wx.navigateTo({
				url : "../count/count?id="+e.currentTarget.dataset.essayid
			})
		}else {
			wx.showModal({
		      title: '提示',
		      content: '该文章内容中无表单或投票',
		      showCancel:false,
		      success: function(res) {
		        if (res.confirm) {
		          
		        } else if (res.cancel) {

		        }
		      }
		    })
		}
	}
})


