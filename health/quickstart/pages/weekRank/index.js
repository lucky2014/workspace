const app = getApp();
Page({
  data:{
    stepList: [],
    noDisplay: "none",
    currentUserRankShow: "block",
  },
  onLoad: function() {
    var me = this;
    wx.request({
      url: 'https://wx.yinnima.com/liujia-health-server/health/getUserStepsWeekSortBefore.do',
      data: {
        openId: app.globalData.openId,
        sortKey: 1
      },
      method: "post",
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.resultCode == 1000){

          var userSort = res.data.returnObject.userSort;
          if(userSort.length>0){
            var currentUserRank = res.data.returnObject.currentUserRank;
            for(var i=0;i<userSort.length;i++){
              var bytesCount = 0;
              var employeeNickName = userSort[i].employeeNickName;

              if(/^[A-Za-z\.\-\_\+\$\*\%\@\#\!]+$/.test(employeeNickName)){
                if(employeeNickName.length>8){
                  userSort[i].employeeNickName = userSort[i].employeeNickName.substring(0,8)+"..."; 
                }
              }else{
                if(employeeNickName.length>5){
                  userSort[i].employeeNickName = userSort[i].employeeNickName.substring(0,5)+"..."; 
                }
              }

              if(i<3){
                userSort[i].image = '../imgs/j'+(i+1)+'.png';
              }else{
                userSort[i].image = '';
              }
            }
            me.setData({
              stepList: userSort,
              currentUserRank: currentUserRank,
              currentUserRankShow: (currentUserRank == 0) ? "none" : "block",
              noDisplay: "none"
            });
          }else{
            me.setData({
              noDisplay: "block",
              currentUserRankShow: "none"
            });
          }
        }
      }
    });
  },
});