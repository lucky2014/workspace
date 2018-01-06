const app = getApp()
const util = require('../../utils/util.js')
Page({
  data : {
    contect: [], //type:1为文字,2为图片  status 1为健在，2为删除 total:位总数减1,并不是总数
    title : "",//标题
    name : "",//名字
    date : "",
    url : "",
    showBtn : "hide",
    showView : "hide",
    themesid : 1,
    pmWidth : wx.getSystemInfoSync().windowWidth/75*52,
    pmHeight : wx.getSystemInfoSync().windowHeight,
    speHeight : "auto",
  },
  onLoad: function (option) {
    var me = this;
    var id = option.id;
    var data = {};
    data.targetType = 1;
    data.targetId = id;
    wx.request({
      url:util.url,
      method : 'POST',
      header : {'content-type':"application/x-www-form-urlencoded"},
      dataType : 'json',
      data:{cmd:"qryWorkDetail",value:JSON.stringify(util.getAjax(data))},
      success: function(res) {
        var msg = res.data;
        if(msg.resultCode == 1000){
          var obj = msg.returnObject;
          var jsonobj = JSON.parse(obj.jsonStr);
          var arr = jsonobj.pageJson[0].contents;
          me.analysis(arr);
          if(option.url){
            me.setData({
              themesid : jsonobj.pageJson[0].themeData.articleData.substring(10),
              url : option.url,
              title : obj.name,
              date : util.formatDateFn(obj.modifyTime),
              showBtn : 'show',
              showView : 'show',
              speHeight : jsonobj.pageJson[0].themeData.articleData.substring(10)==2?(me.data.pmHeight-150+"px"):"auto",
              name : app.globalData.username,
            });
          }else{
            me.setData({
              themesid : jsonobj.pageJson[0].themeData.articleData.substring(10),
              title : obj.name,
              date : util.formatDateFn(obj.modifyTime),
              speHeight : jsonobj.pageJson[0].themeData.articleData.substring(10)==2?(me.data.pmHeight-150+"px"):"auto",
              name : app.globalData.username,
            });
          }
        }
      }
    });
  },
  onShareAppMessage: function (res) {
    var me = this;
    return {
      title: me.data.title,
      path: '/pages/webview/webview?url='+me.data.url,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  analysis : function(data){
    var arr = [];
    for(var i=0;i<data.length;i++){
      if(data[i].objType == "text"){
        var text = data[i].textObj;
        var obj = {};
        obj.type = 1;
        obj.status = 1;
        obj.index = i;
        obj.total = data.length-1;
        obj.text = text.content;
        obj.bold = text.bold?600:400;
        obj.color = text.color;
        obj.fontSize = text.fontSize;
        obj.italic = text.italic?"italic":"normal";
        obj.link = text.linkUrl;
        obj.linkname = text.linkName;
      }else if(data[i].objType == "pic"){
        var pic = data[i].picObj;
        var obj = {};
        obj.type = 2;
        obj.status = 1;
        obj.index = i;
        obj.total = data.length-1;
        obj.text = pic.desc;
        obj.img = pic.coverUrl;
        obj.width = data[i].selfWidth;
        obj.height = data[i].selfHeight;
      }else if(data[i].objType == "atlas"){
        var gif = data[i].atlasObj;
        var obj = {};
        obj.type = 3;
        obj.status = 1;
        obj.index = i;
        obj.total = data.length-1;
        obj.text = gif.desc;
        obj.imgs = [];
        obj.height = (wx.getSystemInfoSync().windowWidth-30)*3/4;
        for(var k=0;k<gif.items.length;k++){
          obj.imgs.push(gif.items[k].attachUrl)
        }
      }else if(data[i].objType == "form"){
        var form = data[i].formObj;
        var obj = {};
        obj.type = 4;
        obj.status = 1;
        obj.index = i;
        obj.total = data.length-1;
        obj.title = form.title;
        obj.items = form.items;
        obj.expirationTime = util.formatDateFn(form.expirationTime);
      }else if(data[i].objType == "map"){
        var form = data[i].formObj;
        var obj = {};
        obj.type = 4;
        obj.status = 1;
        obj.index = i;
        obj.total = data.length-1;
        obj.title = form.title;
        obj.items = form.items;
        obj.expirationTime = util.formatDateFn(form.expirationTime);
      }
      arr.push(obj);
    }
    this.setData({
      contect : arr
    });
  },
  showtap : function () {
    var me = this;
    me.setData({
      showView: "show"
    })
  },
  hidetap : function(){
    var me = this;
    me.setData({
      showView: "hide"
    })
  },
  openUrl : function(){
    var me = this; 
    var data = {
      content : me.data.url
    }
    wx.request({
      url:util.url2,
      method : 'POST',
      header : {'content-type':"application/x-www-form-urlencoded"},
      dataType : 'json',
      data:{cmd:"sendWXMPText",value:JSON.stringify(util.getAjax(data))},
      success: function(res) {

      }
    })
  },
  copyFn : function(){
    var me = this;
    wx.setClipboardData({
      data: me.data.url,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  }
})
