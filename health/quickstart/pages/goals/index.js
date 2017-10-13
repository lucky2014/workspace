const util = require('../../utils/util.js')
Page({
  data:{
  	goals: [
  		{index:0, step: 5000},
  		{index:1, step: 10000},
  		{index:2, step: 15000}
  	],
    currentItem: 0,
    imageUrl:"../imgs/b2.jpg", 
    viewHeigh: "",
    viewWidth: ""
  },
  setActive: function(e){
  	var id = e.currentTarget.dataset.index;
    //设置当前样式
    this.setData({
      'currentItem':id
    })
  },
  goRank: function(){
  	wx.navigateTo({
      url: '../rank/index'
    })
  },
  imageLoad:function(e){ 
    var viewSize = util.getViewWHInfo(e); 
    this.setData({ 
       viewHeigh: viewSize.height, 
       viewWidth: viewSize.width 
    }); 
  }
});