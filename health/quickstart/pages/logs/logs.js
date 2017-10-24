//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    
  },
  goReg: function(){
    wx.reLaunch({
      url: '/pages/reg/index'
    });
  }
})
