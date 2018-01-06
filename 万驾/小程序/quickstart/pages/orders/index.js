//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    list: [
      {
        time: "2010-12-12 20:09:00",
        title: "考试无忧套餐A",
        nodes: [
          {
            name: 'em',
            attrs: {
              class: 'status red',
              style: ''
            },
            children: [{
              type: 'text',
              text: '未支付'
            }]
          },
          {
            name: 'h1',
            attrs: {
              class: 'price',
              style: ''
            },
            children: [{
              type: 'text',
              text: '200.00元'
            }]
          },
        ]
      },
      {
        time: "2010-12-12 20:09:00",
        title: "考试无忧套餐A",
        nodes: [
          {
            name: 'em',
            attrs: {
              class: 'status red',
              style: ''
            },
            children: [{
              type: 'text',
              text: '未支付'
            }]
          },
          {
            name: 'h1',
            attrs: {
              class: 'price',
              style: ''
            },
            children: [{
              type: 'text',
              text: '200.00元'
            }]
          },
        ]
      },
      {
        time: "2010-12-12 20:09:00",
        title: "考试无忧套餐A",
        nodes: [
          {
            name: 'em',
            attrs: {
              class: 'status red',
              style: ''
            },
            children: [{
              type: 'text',
              text: '未支付'
            }]
          },
          {
            name: 'h1',
            attrs: {
              class: 'price',
              style: ''
            },
            children: [{
              type: 'text',
              text: '200.00元'
            }]
          },
        ]
      },
      {
        time: "2010-12-12 20:09:00",
        title: "考试无忧套餐A",
        nodes: [
          {
            name: 'em',
            attrs: {
              class: 'status cancel',
              style: ''
            },
            children: [{
              type: 'text',
              text: '已取消'
            }]
          },
          {
            name: 'h1',
            attrs: {
              class: 'price cancel',
              style: ''
            },
            children: [{
              type: 'text',
              text: '200.00元'
            }]
          },
        ]
      },
      {
        time: "2010-12-12 20:09:00",
        title: "女司机保过险",
        nodes: [
          {
            name: 'em',
            attrs: {
              class: 'status green',
              style: ''
            },
            children: [{
              type: 'text',
              text: '已支付'
            }]
          },
          {
            name: 'h1',
            attrs: {
              class: 'price',
              style: ''
            },
            children: [{
              type: 'text',
              text: '180.00元'
            }]
          },
        ]
      },
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../detail/index'
    })
  },
})
