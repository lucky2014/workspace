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
        y: (height - (width-20)/4*3) / 2,
        width: width-20,
        height: (width-20)/4*3
      }
    },
	imgList : [],
  },
  length : 0,
  index : null,
  overList : [],
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
  	var me = this;
    this.wecropper.getCropperImage((src) => {
      if (src) {
        me.overList.push({"img":src});
        if(me.length < me.data.imgList.length){
        	console.log(me.data.imgList[me.length])
        	me.wecropper.pushOrign(me.data.imgList[me.length])
      		me.length++;
        }else{
        wx.showLoading({
          title: '正在上传',
          mask : true,
        })
        var data = {};
		    var theDate = {cmd:"uploadFile",value:JSON.stringify(util.getAjax(data))};
		    util.uploadimg(me.overList,theDate,function(imgarr){
	        var pages = getCurrentPages();
	        var prevPage = pages[pages.length - 2];
	        var arr = prevPage.data.contect;
          var index = parseInt(me.index)+1;
          var imgs = [];
          for(var i=0;i<imgarr.length;i++){
            imgs.push(imgarr[i].fileUrl)
          }
          arr.splice(index,0,{
            "type":3,
            "status":1,
            "index":me.totalIndex,
            "total":arr.length,
            "imgs":imgs,
            "height":(wx.getSystemInfoSync().windowWidth-30)*3/4,
          });
          for(var i=0;i<arr.length;i++){
            arr[i].total = arr.length-1;
            arr[i].index = i
          }
          console.log(arr)
          prevPage.setData({
            contect : arr,
            temporary : []
          })
          wx.hideLoading();
          wx.navigateBack();
		    });
        }
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  uploadTap () {
    const self = this
  },
  onLoad (option) {
    var self = this;
    const { cropperOpt } = this.data
    self.index = option.index;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    self.setData({
  		imgList : prevPage.data.temporary,
  	})
    new weCropper(cropperOpt)
      .on('ready', (ctx) => {
        /*console.log(`wecropper is ready for work!`)*/
      })
      .on('beforeImageLoad', (ctx) => {
        /*console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)*/
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        /*console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)*/
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        /*console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)*/
      })
      .updateCanvas()
      self.wecropper.pushOrign(self.data.imgList[self.length])
      self.length++;
  }
})