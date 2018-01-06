/**
 * Created by sail on 2017/6/1.
 */
import weCropper from '../../dist/weCropper.js'
const util = require('../../utils/util.js')
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
var src = "";
Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: 10,
        y: (height - (width-20)/375*180) / 2,
        width: width-20,
        height: (width-20)/375*180
      }
    }
  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    this.wecropper.getCropperImage((src) => {
      if (src) {
        wx.showLoading({
          title: '正在上传',
          mask : true,
        })
        util.singleUp(src,function(src){
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            coverImg: src,
            artCover : src,
          })
          wx.hideLoading();
          wx.navigateBack();
        })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  uploadTap () {
    const self = this
    console.log(src)
  },
  onLoad (option) {
    var self = this;
    const { cropperOpt } = this.data
    src = option.src;
    new weCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
      self.wecropper.pushOrign(src)
  }
})