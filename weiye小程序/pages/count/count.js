const util = require('../../utils/util.js')
Page( {  
  data: {  
    winWidth: 0,  
    winHeight: 0,  
    currentTab: 0,  
    date : '',
    stuat : '',
    title : '',
    joinPs : 0,
    lookPs : 0,
    inforList : []
  }, 
  pageNum : 1,
  id : null, 
  over : 0,
  onLoad: function(option) {  
    var that = this;  
    wx.getSystemInfo( {  
      success: function(res) {  
        that.setData( {  
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight  
        });  
      }  
    }); 
    that.id = option.id;
    that.getform(1);
  }, 
  getform : function(pageNum){
    var me = this;
    var data = {
      targetType : 1,
      targetId : me.id,
      type : 1,
      pageSize : 20,
      pageNum : pageNum,
    } 
    wx.request({
      url:util.url,
      method : 'POST',
      header : {'content-type':"application/x-www-form-urlencoded"},
      dataType : 'json',
      data:{cmd:"qryWorkInteractData",value:JSON.stringify(util.getAjax(data))},
      success: function(res) {
        if(res.data.resultCode==1000){
          me.pageNum++
          var msg = res.data.returnObject;
          var endtime = msg.endTime;
          var nowtime = Date.parse(new Date());
          if(endtime>nowtime){
            var time = (endtime-nowtime)/1000;
            var day = parseInt(time/86400);
            var hourse =  parseInt((time%86400)/3600);
            var minute =  parseInt((time-day*86400-hourse*3600)/60 );
            var newtime = day+"天"+hourse+"小时"+minute+"分"
          }else if(endtime){
            var newtime = "00天00小时00分"
          }else{
            var newtime = "无期限"
          }
          var inforList = me.data.inforList;
          for(var i=0;i<msg.objData.length;i++){
            var addDate = util.formatDateFn(msg.objData[i].submitTime,"long");
            inforList.push({
              date : addDate.substring(0,10),
              time : addDate.substring(12,21),
              items : me.objtoobj(JSON.parse(msg.objData[i].submitContent)),
            })
          }
          var expireFlag = (msg.expireFlag ==1?'进行中':"已结束");
          me.setData({
            date : newtime,
            stuat : expireFlag,
            title : msg.objTitle,
            joinPs : msg.joinNum,
            lookPs : msg.browseNum,
            inforList : inforList,
          })
          if(msg.objData.length == 0){
            me.over = 1;
          }
        }
      },
    })
  },
  bindChange: function( e ) {  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
  
  },  
  swichNav: function( e ) {  
  
    var that = this;  
    if( this.data.currentTab === e.currentTarget.dataset.current ) {  
      return false;  
    } else {  
      that.setData( {  
        currentTab: e.currentTarget.dataset.current  
      })  
    }  
  },
  objtoobj:function(arr){
    var arr = arr;
    var newarr = [];
    for(var i=0;i<arr.length;i++){
      for(var key in arr[i]){  
        newarr.push({
          title : key,
          value : arr[i][key]
        })
      }
    }
    return newarr
  },
  bottom : function(){
    if(this.over == 0){
      this.getform(this.pageNum);
    }
  }
})  