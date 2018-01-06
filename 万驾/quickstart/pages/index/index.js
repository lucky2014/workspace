//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    viewHeigh: "",
    viewWidth: "",
    list: [
      {
        imgUrl: "../../imgs/test.jpg",
        tipImgUrl: "../../imgs/tj.png",
        bgColor: "#68b4b2",
        nodes: [
          {
            name: 'h1',
            attrs: {
              class: 'title',
              style: ''
            },
            children: [{
              type: 'text',
              text: '考试无忧'
            }]
          },
          {
            name: 'h1',
            attrs: {
              class: 'mealsMark',
              style: ''
            },
            children: [{
              type: 'text',
              text: '套餐A'
            }]
          },
          {
            name: 'p',
            attrs: {
              class: 'info',
              style: ''
            },
            children: [{
              type: 'text',
              text: '再也不用担心考试挂科了！'
            }]
          },
          {
            name: 'p',
            attrs: {
              class: 'price',
              style: ''
            },
            children: [{
              type: 'text',
              text: '200.00元'
            }]
          }
        ]
      },
      {
        imgUrl: "../../imgs/test.jpg",
        bgColor: "#5f95c3",
        tipImgUrl: "../../imgs/hb.png",
        nodes: [
          {
            name: 'h1',
            attrs: {
              class: 'title',
              style: ''
            },
            children: [{
              type: 'text',
              text: '笔试无忧'
            }]
          },
          {
            name: 'h1',
            attrs: {
              class: 'mealsMark',
              style: ''
            },
            children: [{
              type: 'text',
              text: '套餐B'
            }]
          },
          {
            name: 'p',
            attrs: {
              class: 'info',
              style: ''
            },
            children: [{
              type: 'text',
              text: '文盲也驾考！'
            }]
          },
          {
            name: 'p',
            attrs: {
              class: 'price',
              style: ''
            },
            children: [{
              type: 'text',
              text: '100.00元'
            }]
          }
        ]
      },
      {
        imgUrl: "../../imgs/test.jpg",
        bgColor: "#777b84",
        tipImgUrl: "",
        nodes: [
          {
            name: 'h1',
            attrs: {
              class: 'title',
              style: ''
            },
            children: [{
              type: 'text',
              text: '新手女司机'
            }]
          },
          {
            name: 'h1',
            attrs: {
              class: 'mealsMark',
              style: ''
            },
            children: [{
              type: 'text',
              text: '保过险'
            }]
          },
          {
            name: 'p',
            attrs: {
              class: 'info',
              style: ''
            },
            children: [{
              type: 'text',
              text: '女司机科二科三无忧！'
            }]
          },
          {
            name: 'p',
            attrs: {
              class: 'price',
              style: ''
            },
            children: [{
              type: 'text',
              text: '180.00元'
            }]
          }
        ]
      },
      {
        imgUrl: "../../imgs/test.jpg",
        bgColor: "#777b84",
        tipImgUrl: "",
        nodes: [
          {
            name: 'h1',
            attrs: {
              class: 'title',
              style: ''
            },
            children: [{
              type: 'text',
              text: '新手女司机'
            }]
          },
          {
            name: 'h1',
            attrs: {
              class: 'mealsMark',
              style: ''
            },
            children: [{
              type: 'text',
              text: '保过险'
            }]
          },
          {
            name: 'p',
            attrs: {
              class: 'info',
              style: ''
            },
            children: [{
              type: 'text',
              text: '女司机科二科三无忧！'
            }]
          },
          {
            name: 'p',
            attrs: {
              class: 'price',
              style: ''
            },
            children: [{
              type: 'text',
              text: '180.00元'
            }]
          }
        ]
      }
    ]
  },
  //事件处理函数
  bindViewTap: function(options) {
    const index = options.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../reg/index?id='+ index
    });
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  tipImageLoad: function(e){ 
    var viewSize = util.getViewWHInfo(e,0.18); 
    this.setData({ 
       tipViewHeigh: viewSize.height, 
       tipViewWidth: viewSize.width 
    });  
  },
  bnImageLoad: function(e){ 
      var viewSize = util.getViewWHInfo(e,150); 
      this.setData({ 
         viewHeigh: viewSize.height, 
         viewWidth: viewSize.width 
      });  
    },
})
