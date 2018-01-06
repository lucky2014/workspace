//index.js
//获取应用实例
var initData = 'this is first line\nthis is second line'
var extraLine = [];
Page({
  data: {
    text: initData,
    arrow: [
      {
        image:"../../imgs/head_Img.png",
        title:"今晚吃鸡大吉大利",
        infor:"企业名称"
    },
  ]
  },
  add: function(e) {
    extraLine.push('other line')
    this.setData({
      text: initData + '\n' + extraLine.join('\n')
    })
  },
  remove: function(e) {
    if (extraLine.length > 0) {
      extraLine.pop()
      this.setData({
        text: initData + '\n' + extraLine.join('\n')
      })
    }
  }
})