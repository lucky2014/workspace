var util =  require('../../utils/util.js');
Page({
   data: {
    arrow: []
  },
  onLoad:function(options){
    var me = this;
    var data = {
      targetType:1,
    };
    wx.request({
      url:util.url2,
      method : 'POST',
      header : {'content-type':"application/x-www-form-urlencoded"},
      dataType : 'json',
      data:{cmd:"qryCategorys",value:JSON.stringify(util.getAjax(data,1))},
      success: function(res) {
        console.log(res);
        var msg = res.data;
        if(msg.resultCode == 1000){
          var obj = msg.returnObject;
          var arr = [];
          for(var i=0;i<obj.length;i++){
            arr.push({
              categoryid : obj[i].categoryId,
              image: obj[i].smallCoverUrl,
              title:obj[i].name,
              showView:false
            })
          };
          me.setData({
            arrow : arr
          });
        }
      }
    })
  },
  onChangeShowState:function(e){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    console.log(e);
    prevPage.setData({
      class: e.target.dataset.class||e.currentTarget.dataset.class,
      artType : e.target.dataset.categoryid,
    })
    wx.navigateBack();
  }
})
