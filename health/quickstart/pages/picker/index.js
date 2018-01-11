Page({
  onLoad: function(){
    wx.request({
      url: 'https://wx.yinnima.com/liujia-health-server/health/listHealthInfoReports.do', //仅为示例，并非真实的接口地址
      data: {
         openId: "oDdMR0dhb44UL0r8-VohI3xPGVJU"
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data)
      }
    })
  }
})