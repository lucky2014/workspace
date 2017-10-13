//input.js

const util = require('../../utils/util.js')
Page({
  data: {
    selectArea:false,
    areaIndex:0,  
    area:['杭州龙骞科技有限公司','浙江大学','阿里巴巴'],
    imageUrl:"../imgs/b1.jpg", 
    viewHeigh: "",
    viewWidth: ""
  },
  bindPickerChange: function(e){  
    this.setData({  
        areaIndex: e.detail.value  
    })  
  },
  goGoals: function(){
    wx.navigateTo({
      url: '../goals/index'
    })
  },
  imageLoad:function(e){ 
  var viewSize = util.getViewWHInfo(e); 
  this.setData({ 
     viewHeigh: viewSize.height, 
     viewWidth: viewSize.width 
  }); 
    
 }  
})
