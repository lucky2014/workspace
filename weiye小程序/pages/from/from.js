const util = require('../../utils/util.js')
Page({
  data : {
    inputList : [],
    date : new Date(),
    dateshow : "无截止时间",
    title : "",
    startdate  : new Date(),
  },
  index : null,
  iseditor : 0,
  onLoad: function (option) {
  	var me = this;
    me.index = parseInt(option.index)+1
    if(option.iseditor){
      me.iseditor = 1;
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      var obj = prevPage.data.contect[option.index];
      console.log(obj)
      me.setData({
        inputList : obj.items,
        title : obj.title,
        dateshow : obj.expirationTime?obj.expirationTime:"无截止时间",
        date : obj.expirationTime,
      })
    }else{
    	me.setData({
    		inputList : [
    			{
            id : 0,
    				title : "",
            value : "",
    			},
    			{
    				id : 0,
            title : "",
            value : "",
    			},
    		]
    	})
    }
  },
  addInput : function(){
  	var me  = this
  	var arr = me.data.inputList
  	arr.push({value : ""})
  	me.setData({
		inputList : arr
	})
  },
  delectInput : function(e){
  	var me = this;
  	var index = e.target.dataset.index;
  	var arr = me.data.inputList;
  	arr.splice(index,1);
  	me.setData({
  		inputList : arr
  	})
  },
  blurFn : function(e){
    var me = this;
    console.log(e)
    var index = e.target.dataset.index;
    var arr = me.data.inputList;
    arr[index].title = e.detail.value;
    me.setData({
  		inputList : arr
  	})
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      dateshow: e.detail.value,
    })
  },
  finish : function(){
  	var me = this;
  	if(!me.data.title){
  		wx.showModal({
	        title: '提示',
	        content: '请输入标题',
	        showCancel:false,
	        success: function(res) {

          }
        })
  	}else{
      var index = me.index;
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      var arr = prevPage.data.contect;
      if(me.iseditor!=1){
        arr.splice(index,0,{
          "type":4,
          "status":1,
          "index":me.totalIndex,
          "total":arr.length,
          "title":me.data.title,
          "items":me.data.inputList,
          "id":0,
          "expirationTime":(me.data.dateshow=="无截止时间"?"":me.data.dateshow)
        });
        for(var i=0;i<arr.length;i++){
          arr[i].total = arr.length-1;
          arr[i].index = i
        }
      }else{
        console.log(index)
        arr[index-1].title = me.data.title;
        arr[index-1].items = me.data.inputList;
        arr[index-1].expirationTime = (me.data.dateshow=="无截止时间"?"":me.data.dateshow);
      }
      prevPage.setData({
        contect : arr,
      })
      wx.navigateBack();
  	}
  },
  blurTitle : function(e){
  	var me = this;
  	me.setData({
  		title : e.detail.value
  	})
  },
  remove : function(){
    this.setData({
      dateshow : "无截止时间",
    })
  }
})
