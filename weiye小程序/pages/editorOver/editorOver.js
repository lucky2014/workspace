const util = require('../../utils/util.js')
Page({
  data : {
    coverImg : "", 
    class : "其他",
    artTitle : "",
    artType : 99,   
    artComment : 2,   //1kai 2bukai
    artCover : "http://www.diantimes.cn/default/cover_1.png",
  },
  isEditor : 0,
  id : null,
  onLoad : function(){
    var me = this;
    
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if(prevPage.data.isEditor){
      me.isEditor = 1;
      var obj = JSON.parse(prevPage.data.isEditor);

      var class1 = (obj.artType==1?"邀请函":obj.artType==2?"招聘":obj.artType==3?"企业文化":obj.artType==4?"企业介绍":obj.artType==5?"品牌推广":obj.artType==6?"活动促销":obj.artType==7?"新品发布":obj.artType==8?"产品介绍":obj.artType==9?"招商加盟":obj.artType==10?"总结汇报":"其他");
      me.setData({
        artTitle : obj.artTitle,
        artType : obj.artType,   
        artComment : obj.artComment,   //0否 1是
        artCover : obj.artCover,
        class: class1,
        coverImg : prevPage.data.themePic||"http://www.diantimes.cn/default/cover_1.png",
      })
      me.id = obj.id;
    }else{
      me.setData({
        coverImg : prevPage.data.themePic||"http://www.diantimes.cn/default/cover_1.png",
        artCover : prevPage.data.themePic||"http://www.diantimes.cn/default/cover_1.png",
      })
    }
  },
  chooseImg : function(event){
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        wx.navigateTo({
          url: "../cover/cover?src="+res.tempFilePaths[0]
        })
      },
      fail: function() {
      // fail
      },
      complete: function() {
      // complete
      }
    })
  },
  choseClass : function(event){
    wx.navigateTo({
      url: "../classify/classify"
    })
  },
  overFn : function(){
    var me = this;
    if(!me.data.artTitle){
      wx.showToast({
        title: '请输入文字标题',
        duration: 2000
      })
    }else{
      wx.showLoading({
        title: '上传中',
      })
      var data = {};
      data.targetType = 1;
      data.name = me.data.artTitle;
      data.categoryId = me.data.artType;
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      var jsonStr = prevPage.data.overContect;
      var obj = {
        "id": 1,
        "version": 1,
        "type": 1,
        "containerWidth":  wx.getSystemInfoSync().windowWidth,
        "containerHeight" : wx.getSystemInfoSync().windowHeight,
        "title" : me.data.artTitle,
        "coverUrl" : me.data.artCover,
        "catalogId" : me.data.artType,
        "pageJson" : [],
      }
      var text = {
        "id": 0,
        "isScreen": false,
        "contents":[],
      }
      text.contents = jsonStr;
      text.themeData = {"atlasData":prevPage.data.themePic,"articleData":prevPage.data.articleData};
      obj.pageJson[0] = text;
      data.jsonStr = JSON.stringify(obj);
      data.coverUrl = me.data.artCover;
      data.commentFlag = me.data.artComment;
      if(me.isEditor == 1){
        data.targetId = me.id;
        var cmd = "editWork"
      }else{
        var cmd = "createWork"
      }
      console.log(obj)
      wx.request({
        url:util.url,
        method : 'POST',
        header : {'content-type':"application/x-www-form-urlencoded"},
        dataType : 'json',
        data:{cmd:cmd,value:JSON.stringify(util.getAjax(data))},
        success: function(res) {
          var msg = res.data;
          if(msg.resultCode == 1000){
            wx.showToast({
              title: '保存成功',
              duration: 2000
            })
            setTimeout(function(){
              wx.reLaunch({
                url: "./../list/list"
              })
            },2000)
          }
        }
      })
    }
  },
  blurFn : function(event){
    this.setData({
      artTitle : event.detail.value
    });
  },
  switch1Change : function(event){
    this.setData({
      artComment : event.detail?1:2
    });
  },
})