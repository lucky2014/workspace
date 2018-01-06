var index = ""; 
Page({
  data: {
    text : "",
    bold : "",
    color : "",
    fontSize : "",
    italic : "",
    link : "",
    linkname : "",
    isshowcolor: "hide",
    isshowinput: "hide",
    isshowctrl : "show",
    colorControl : false,
    boldControl :  false,
    italicControl : false,
    colorControl : false,
    colorList : ["000000","ffffff","545454","a9a9a9","00e6c4","00ae5e","67c224","aedb80","fddf00","ff7600","ff4101","ff0012","ff87bf","ff6cad","ff9cad","ff23ab","a30bc7","7f45ff","2748b8","007ec5","e4b100","bb7f00","4fafe3","383a55","466320","7f9118","307ba4","8abeda","b18ada","f1b1e3","f1b1c9","bba153"]
  },
  onLoad: function (option) {
    console.log(wx.getSystemInfoSync())
    index = option.index;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var detail = prevPage.data.contect[index];
    console.log(detail)
    this.setData({
      text : detail.text,
      bold : detail.bold,
      color : detail.color,
      fontSize : parseInt(detail.fontSize),
      italic : detail.italic,
      boldControl : detail.bold==400?false:true,
      italicControl : detail.italic=="italic"?true:false,
      link :detail.link,
      linkname : detail.linkname,
      isshowctrl : option.simple?"hide":"show",
    })
  },
  blurFn : function(event){
    this.setData({
      text : event.detail.value
    });
  },
  linkBlur : function(event){
    this.setData({
      link : event.detail.value
    });
  },
  linknameBlur : function(event){
    this.setData({
      linkname : event.detail.value
    });
  },
  addSize : function(){
    var me = this;
    if(wx.getSystemInfoSync().system.indexOf("iOS")==-1){
      me.setData({
        fontSize : 20
      })
    }else{
      var fontSize = me.data.fontSize;
      if(fontSize<40){
        me.setData({
          fontSize : fontSize+2
        })
      }
    }
  },
  minusSize : function(){
    var me = this;
    if(wx.getSystemInfoSync().system.indexOf("iOS")==-1){
      me.setData({
        fontSize : 16
      })
    }else{
      var fontSize = me.data.fontSize;
      if(fontSize>10){
        me.setData({
          fontSize : fontSize-2
        })
      }
    }
  },
  bold : function(){
    var me = this;
    if(me.data.bold == 400){
      me.setData({
        boldControl : true,
        bold : 600,
      })
    }else{
      me.setData({
        boldControl : false,
        bold : 400,
      })
    }
  },
  italic : function(){
    var me = this;
    if(me.data.italic == "italic"){
      me.setData({
        italicControl : false,
        italic : "normal"
      })
    }else{
      me.setData({
        italicControl : true,
        italic : "italic"
      })
    }
    console.log(me.data)
  },
  finish : function(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var arr = prevPage.data.contect;
    arr[index].text = this.data.text;
    arr[index].fontSize = this.data.fontSize;
    arr[index].color = this.data.color;
    arr[index].bold = this.data.bold ;
    arr[index].italic = this.data.italic;
    arr[index].link = this.data.link;
    arr[index].linkname = this.data.linkname;
    prevPage.setData({
      contect: arr
    })
    wx.navigateBack();
  },
  color : function(){
    var me = this;
    if(me.data.isshowcolor == "hide"){
      me.setData({
        isshowcolor : "show",
        colorControl : true,
        isshowinput : "hide",
        inputControl : false,
      })
    }else{
      me.setData({
        isshowcolor : "hide",
        colorControl : false,
      })
    }
  },
  choose : function(e){
    var color = e.target.dataset.color;
    this.setData({
      color : "#"+color
    })
  },
  input : function(){
    var me = this;
    if(me.data.isshowinput == "hide"){
      me.setData({
        isshowinput : "show",
        inputControl : true,
        isshowcolor : "hide",
        colorControl : false,
      })
    }else{
      me.setData({
        isshowinput : "hide",
        inputControl : false,
      })
    }
  }
})
