const util = require('../../utils/util.js')
Page({
  data : {
  	showView: false,
  	contect: [], //type:1为文字,2为图片  status 1为健在，2为删除 total:位总数减1,并不是总数
    overContect : [],
    isEditor : "",
    themesid : 1,
    articleData : "template_01",
    temporary : [],//临时存储图片
    themePic : "",
  },
  totalIndex : -1,
  onLoad: function (option) {
    var me = this;
    if(option.id){
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
            var text = {
              artTitle : obj.name,
              artType : obj.categoryId,
              artCover : obj.essayCoverUrl,
              artComment : obj.commentFlag,
              id : option.id,
            }
            me.setData({
              isEditor : JSON.stringify(text),
              articleData : jsonobj.pageJson[0].themeData.articleData,
              themePic : jsonobj.pageJson[0].themeData.atlasData,
              themesid : jsonobj.pageJson[0].themeData.articleData.substring(10),
            });
          }
        }
      })
    }else if(option.articledata){
      if(option.articledata == "template_01"){
        me.setData({
          contect : [{
            "type":1,
            "status":1,
            "index":0,
            "total":0,
            "text":"",
            "bold":400,
            "color":"#3b3c3d",
            "fontSize":"14",
            "italic":"normal",
            "link":"",
            "linkname":"",
          }],
          articleData : option.articledata,
          themesid : option.articledata.substring(10),
        });
      }else{
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        me.setData({
          contect : [{
            "type":1,
            "status":1,
            "index":0,
            "total":0,
            "text":"",
            "bold":400,
            "color":"#3b3c3d",
            "fontSize":"14",
            "italic":"normal",
            "link":"",
            "linkname":"",
          }],
          themePic : prevPage.data.themeUrl,
          articleData : option.articledata,
          themesid : option.articledata.substring(10),
        });
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
      } else if(data[i].objType == "form"){
        var form = data[i].formObj;
        var obj = {};
        obj.type = 4;
        obj.status = 1;
        obj.index = i;
        obj.total = data.length-1;
        obj.title = form.title;
        obj.items = form.items;
        obj.id = form.id;
        obj.expirationTime = (form.expirationTime==0?"":util.formatDateFn(form.expirationTime));
      } 
      arr.push(obj);
    }
    this.setData({
      contect : arr
    });
  },
  showTap : function () {
    var that = this;
    that.setData({
      showView: true
    })
    that.totalIndex = -1;
  },
  hideTap : function(){
  	var that = this;
    that.setData({
      showView: false
    })
  },
  addFont : function(){ //添加文字
    var me = this;
  	var arr = me.data.contect;
    if(me.totalIndex!=-1){
      var index = me.totalIndex+1
      arr.splice(index,0,{
        "type":1,
        "status":1,
        "index":me.totalIndex,
        "total":arr.length,
        "text":"",
        "bold":400,
        "color":"#3b3c3d",
        "fontSize":"14",
        "italic":"normal",
        "link":"",
        "linkname":"",
      });
      for(var i=0;i<arr.length;i++){
        arr[i].total = arr.length-1;
        arr[i].index = i
      }
    }else{
      for(var i=0;i<arr.length;i++){
        arr[i].total = arr.length;
      }
      arr.push({
        "type":1,
        "status":1,
        "index":arr.length,
        "total":arr.length,
        "text":"",
        "bold":400,
        "color":"#3b3c3d",
        "fontSize":"14",
        "italic":"normal",
        "link":"",
        "linkname":"",
      });
    }
  	this.setData({
  		contect : arr
  	});
  },
  blurFn : function(event){
  	var index = event.target.dataset.index;
  	var arr = this.data.contect;
  	arr[index].text =event.detail.value;
  	this.setData({
  		contect : arr
  	});
  },
  addPicture : function(){
  	var me = this;
    wx.chooseImage({
    	count: 9, // 最多可以选择的图片张数，默认9
    	sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
      	var arr = me.data.contect;
      	for(var i=0;i<res.tempFilePaths.length;i++){
      		var img = res.tempFilePaths[i];
          if(me.totalIndex!=-1){
            var index = me.totalIndex+1+i;
            arr.splice(index,0,{
              "type" : 2,
              "status" : 1,
              "index" : arr.length,
              "total":arr.length,
              "img" : img,
              "desc" : "",
              "bold":400,
              "color":"#3b3c3d",
              "fontSize":"14",
              "italic":"normal",
              "link":"",
              "linkname":"",
            });
          }else{
            arr.push({
              "type" : 2,
              "status" : 1,
              "index" : arr.length,
              "total":arr.length,
              "img" : img,
              "desc" : "",
              "bold":400,
              "color":"#3b3c3d",
              "fontSize":"14",
              "italic":"normal",
              "link":"",
              "linkname":"",
            })
          }
      	}
      	for(var i=0;i<arr.length;i++){
		  		arr[i].total = arr.length-1;
          arr[i].index = i;
		  	}
        me.setData({
		  		contect : arr
		  	});
    	},
    	fail: function() {
      // fail
    	},
    	complete: function() {
      // complete
    	}
    })
  },
  addGif : function(){
    var me = this;
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        if(res.tempFilePaths.length>1){
          var gifindex = (me.totalIndex==-1?me.data.contect.length:me.totalIndex);
          me.setData({
            temporary : res.tempFilePaths
          });
          wx.navigateTo({
            url: "./../pilcrp/pilcrp?index="+gifindex
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '动态图至少上传两张图片',
            showCancel:false,
            success: function(res) {

            }
          })
        }
      },
      fail: function() {
      // fail
      },
      complete: function() {
      // complete
      }
    })
  },
  delectFn : function(event){
    var me = this;
    wx.showModal({
      title: '提示',
      content: '是否删除该插件',
      success: function(res) {
        if (res.confirm) {
          var index = event.currentTarget.dataset.index;
          var arr = me.data.contect;
          /*arr[index].status = 0;*/
          arr.splice(index,1)
          for(var i=0;i<arr.length;i++){
            arr[i].index = i;
            arr[i].total = arr.length-1;
          }
          me.setData({
            contect : arr
          });
        } else if (res.cancel) {

        }
      }
    })
  },
  upFn : function(event){
  	var index = event.currentTarget.dataset.index;
  	var arr = this.data.contect;
  	var value = arr[index];
  	value.index = index-1;
  	arr[index-1].index = index;
  	arr[index] =  arr[index-1];
  	arr[index-1] = value;
  	this.setData({
  		contect : arr
  	});
  },
  downFn : function(event){
  	var index = event.currentTarget.dataset.index;
  	var arr = this.data.contect;
  	var value = arr[index];
  	value.index = index+1;
  	arr[index+1].index = index;
  	arr[index] =  arr[index+1];
  	arr[index+1] = value;
  	this.setData({
  		contect : arr
  	});
  },
  pushFn : function(event){
    var that = this;
  	var index = event.currentTarget.dataset.index;
    that.setData({
      showView: true
    })
    that.totalIndex = index;
  },
  saveFn : function(){
    var me = this;
    var arr = this.data.contect;
    if(arr.length>0){
      me.editorFn()
    }else{
      wx.showModal({
        title: '提示',
        content: '请先添加内容',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            
          } else if (res.cancel) {

          }
        }
      })
    }
  },
  cutImg : function(e){
    var index = this.data.contect[e.target.dataset.index];
    wx.navigateTo({
      url: "./../cropper/index?imgsrc="+index.img+"&index="+index.index
    })
  },
  gotoeditor : function(e){
    var index = this.data.contect[e.target.dataset.index];
    wx.navigateTo({
      url: "./../editorFont/editorFont?index="+index.index
    })
  },
  gotoeditor2 : function(e){
    var index = this.data.contect[e.target.dataset.index];
    wx.navigateTo({
      url: "./../editorFont/editorFont?index="+index.index+"&simple=1"
    })
  },
  editorJson : function(arr){
    var page = [];
    var me = this;
    for(var i=0;i<arr.length;i++){
      if(arr[i].type == 1){
        var obj = {}
        var textObj ={};
        textObj.VAlign = "top";
        textObj.align = "left";
        textObj.bgColor = "#FFFFFF";
        textObj.bold = (arr[i].bold==400?false:true);
        textObj.color = arr[i].color;
        textObj.content = arr[i].text;
        textObj.fontName = "Microsoft Yahe";
        textObj.fontSize = arr[i].fontSize;
        textObj.italic = (arr[i].italic=="normal"?false:true);
        textObj.lineHeight = 1;
        textObj.linkName = arr[i].linkname;
        textObj.linkUrl = arr[i].link;
        obj.textObj = textObj;
        obj.objType = "text";
        page.push(obj);
      }else if(arr[i].type == 2){
        var obj = {}
        var picObj ={};
        picObj.desc = arr[i].text;
        picObj.attachUrl = arr[i].img;
        picObj.attachLocalUrl = arr[i].img;
        picObj.coverUrl = arr[i].img;
        picObj.coverLocalUrl = arr[i].img;
        obj.picObj = picObj;
        obj.objType = "pic";
        obj.selfHeight = arr[i].height;
        obj.selfWidth = arr[i].width;
        page.push(obj);
      }else if(arr[i].type == 3){
        var obj = {}
        var gifObj = {};
        gifObj.desc = "";
        gifObj.duration = 0.25;
        gifObj.type = 1;
        gifObj.items = [];
        for(var k=0;k<arr[i].imgs.length;k++){
          gifObj.items.push({
            "attachUrl": arr[i].imgs[k],
            "attachLocalUrl": arr[i].imgs[k],
            "screenshotUrl": arr[i].imgs[k],
            "screenshotLocalUrl": arr[i].imgs[k]
          })
        }
        obj.atlasObj = gifObj;
        obj.objType = "atlas";
        page.push(obj);
      }else if(arr[i].type == 4){
        var obj = {}
        var formObj = {};
        formObj.title = arr[i].title;
        formObj.id = arr[i].id;
        formObj.expirationTime = (Date.parse(new Date(arr[i].expirationTime))+57599000);
        formObj.items = arr[i].items;
        obj.formObj = formObj;
        obj.objType = "form";
        page.push(obj);
      }else if(arr[i].type == 5){
        var obj = {}
        var mapObj = {};
        mapObj.longitude = arr[i].longitude;
        mapObj.latitude = arr[i].latitude;
        mapObj.screenshotUrl = arr[i].screenshotUrl;
        mapObj.screenshotLocalUrl = arr[i].screenshotLocalUrl;
        mapObj.address = arr[i].address;
        obj.mapObj = mapObj;
        obj.objType = "map";
        page.push(obj);
      }
    }
    me.setData({
      overContect : page
    });
  },
  editorFn : function(){
    wx.showLoading({
      title: '正在上传',
      mask : true,
    })
    var me = this;
    var arr = me.data.contect;
    var imgs = [];
    for(var i=0;i<arr.length;i++){
      if(arr[i].type == 2){
        imgs.push({
          "img" : arr[i].img,
          "index" : arr[i].index,
        })
      }
    }
    if(imgs.length>0){
      var data = {};
      var theDate = {cmd:"uploadFile",value:JSON.stringify(util.getAjax(data))};
      util.uploadimg(imgs,theDate,function(imgarr){
        for(var i = 0;i<imgarr.length;i++){
          arr[imgarr[i].index].img = imgarr[i].fileUrl;
          arr[imgarr[i].index].width = imgarr[i].width;
          arr[imgarr[i].index].height = imgarr[i].height;
        }
      });
    }
    me.editorJson(arr);
    wx.hideLoading();
    if(me.data.isEditor){
      wx.showLoading({
        title: '上传中',
      })
      var editor = JSON.parse(me.data.isEditor);
      var data = {};
      data.targetType = 1;
      data.name = editor.artTitle;
      data.categoryId = editor.artType;
      var jsonStr = me.data.overContect;
      var obj = {
        "id": 1,
        "version": 1,
        "type": 1,
        "containerWidth":  wx.getSystemInfoSync().windowWidth,
        "containerHeight" : wx.getSystemInfoSync().windowHeight,
        "title" : editor.artTitle,
        "coverUrl" : editor.artCover,
        "catalogId" : editor.artType,
        "pageJson" : [],
      }
      var text = {
        "id": 0,
        "isScreen": false,
        "contents":[],
      }
      text.contents = jsonStr;
      text.themeData = {"atlasData":me.data.themePic,"articleData":me.data.articleData};
      obj.pageJson[0] = text;
      data.jsonStr = JSON.stringify(obj);
      data.coverUrl = editor.editorartCover;
      data.commentFlag = editor.artComment;
      data.targetId = editor.id;
      wx.request({
        url:util.url,
        method : 'POST',
        header : {'content-type':"application/x-www-form-urlencoded"},
        dataType : 'json',
        data:{cmd:"editWork",value:JSON.stringify(util.getAjax(data))},
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
    }else{
      wx.navigateTo({
        url: "./../editorOver/editorOver"
      })
    }
  },
  showtempate : function(){
    wx.navigateTo({
      url: "./../editorPre/editorPre"
    })
  },
  addFrom : function(){
    var me = this;
    var arr = me.data.contect;
    for(var i=0;i<arr.length;i++){
      if(arr[i].type == 4){
        wx.showModal({
          title: '提示',
          content: '您已添加过表单',
          showCancel:false,
          success: function(res) {
            if (res.confirm) {
              
            } else if (res.cancel) {

            }
          }
        })
        return false
      }
    }
    var gifindex = (me.totalIndex==-1?me.data.contect.length:me.totalIndex);
    wx.navigateTo({
      url: "./../from/from?index="+gifindex
    })
  },
  editorFrom : function(e){
    var me = this
    wx.navigateTo({
      url: "./../from/from?index="+e.currentTarget.dataset.index+"&iseditor=1"
    })
  },
  addAddress : function(e){
    var me = this;
    var index = parseInt(me.totalIndex==-1?me.data.contect.length:me.totalIndex)+1;
    wx.getLocation({
      success: function(res){
        wx.chooseLocation({
          success: function(res){
            var arr = me.data.contect;
            arr.splice(index,0,{
              "type":5,
              "status":1,
              "index":me.totalIndex,
              "total":arr.length,
              "longitude": res.longitude,
              "latitude": res.latitude,
              "screenshotUrl": "https://ep.diantimes.cn/group1/M00/01/1F/wKgBwFo3JpGAFxzKAAkVVGMybN8785.jpg",
              "screenshotLocalUrl": "https://ep.diantimes.cn/group1/M00/01/1F/wKgBwFo3JpGAFxzKAAkVVGMybN8785.jpg",
              "address": res.name,
              "markers" : [{
                iconPath: "/imgs/others.png",
                id: 0,
                latitude: res.latitude,
                longitude: res.longitude,
                width: 26,
                height: 41
              }]
            });
            for(var i=0;i<arr.length;i++){
              arr[i].total = arr.length-1;
              arr[i].index = i
            }
            me.setData({
              contect : arr,
            })
          }
        })
      }
    })
  },
  /*addAddress : function(){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },*/
  backBtn : function(){
    wx.navigateBack();
  },
  option : function(){
    wx.showLoading({
      title: '正在上传',
      mask : true,
    })
    var me = this;
    var arr = me.data.contect;
    var imgs = [];
    for(var i=0;i<arr.length;i++){
      if(arr[i].type == 2){
        imgs.push({
          "img" : arr[i].img,
          "index" : arr[i].index,
        })
      }
    }
    if(imgs.length>0){
      var data = {};
      var theDate = {cmd:"uploadFile",value:JSON.stringify(util.getAjax(data))};
      util.uploadimg(imgs,theDate,function(imgarr){
        for(var i = 0;i<imgarr.length;i++){
          arr[imgarr[i].index].img = imgarr[i].fileUrl;
          arr[imgarr[i].index].width = imgarr[i].width;
          arr[imgarr[i].index].height = imgarr[i].height;
        }
      });
    }
    me.editorJson(arr);
    wx.hideLoading();
    wx.navigateTo({
      url: "./../editorOver/editorOver"
    })
  }
})
