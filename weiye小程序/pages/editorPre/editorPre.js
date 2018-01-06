const app = getApp()
const util = require('../../utils/util.js')
Page({
  data : {
    contect: [], //type:1为文字,2为图片  status 1为健在，2为删除 total:位总数减1,并不是总数
    title : "作品预览",//标题
    name : "",//名字
    date : "2017-12-08",
    templateList: [],//模板列表
    left:0,//滚动距离
    temView : 1,
    themesid : 1,
    pmWidth : wx.getSystemInfoSync().windowWidth/75*52,
    pmHeight : wx.getSystemInfoSync().windowHeight,
  },
  onLoad: function (option) {
    var me = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var arr = prevPage.data.contect;
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
            if(prevPage.data.themesid == obj[i].themeId){
              list.push({
                img : obj[i].previewImg,
                type : 1,
                id : obj[i].themeId,
                name : app.globalData.username,
              })
            }else{
              list.push({
                img : obj[i].previewImg,
                type : 0,
                id : obj[i].themeId,
                name : app.globalData.username,
              })
            }
            
          };
          me.setData({
            contect : arr,
            templateList : list,
            width : list.length*75+25,
            themesid : prevPage.data.themesid,
          })
        }
      }
    })
  },
  chooseTem : function(event){
    var me = this;
    var arr = me.data.templateList;
    var index = event.currentTarget.dataset.index;
    for(var i = 0;i<arr.length;i++){
      if(i == index){
        arr[i].type = 1;
        me.setData({
          themesid : arr[i].id,
        })
      }else{
        arr[i].type = 0;
      }
    }
    var left = (index-2)*75;
    me.setData({
      templateList : arr,
      left : left<0?0:left,
    })
  },
  showtempate : function(){
    this.setData({
      temView : 1,
    })
  },
  hidetempate : function(){
    var me = this;
    var arr = me.data.templateList;
    var id = null
    for(var i=0;i<arr.length;i++){
      if(arr[i].type == 1){
        id = arr[i].id;
      }
    }
    var data = {
      themeId : id,
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
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            themesid : id,
            articleData : JSON.parse(msg.returnObject).articleData,
            themePic : "https://ep.diantimes.cn/group1"+JSON.parse(msg.returnObject).atlasData.split("group1")[1],
          })
        }
      }
    })
    this.setData({
      temView : 0,
    })
  },
  backbtn : function(){
    wx.navigateBack();
  }
})
