//index.js
//获取应用实例
const utils = require("../../utils/util.js");
const addToCar = require("../../utils/addToCar.js");
Page({
    data: {
      firstIndex: -1,
      attrValueList: [],
      showCar: 0,
      selectNum: 1
        // imgUrls: [
        //     'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        //     'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
        //     'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        //     'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
        //     'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'],
        // indcatorDots: true,
        // autoPlay: true,
        // interval: 5000,
        // duration: 500,
        // width:wx.getSystemInfoSync().windowWidth
    },
    onLoad: function (option){
      var me = this;
      var goodsId = option.goodsId;
      addToCar.isAddToCarFn(me, goodsId,1);
      utils.ajaxFn("store/getStoreInfo.do", "", function (msg) {
        me.setData({
          storeData: msg,
          showCar: 0
        });
      });
    },
    //点击购物车按钮
    isAddToCar: function(event) {
      var me = this;
      var status = event.currentTarget.dataset.status;
      if(status == 2){
        me.setData({
          isBuy:1
        })
      }
      addToCar.isAddToCarCommon(me);
    },
    //关闭加入购物车弹框
    cutAddToCar: function() {
      var me = this;
      addToCar.cutAddToCarCommon(me);
       me.setData({
          isBuy:0
        })
    },
    //选中商品属性
    selectSku: function(event) {
      var me = this;
      addToCar.selectAttrValue(event,me);
    },
    //改变商品数量
    changeNumTap: function(event){
      var me = this;
      addToCar.changeNumTapFn(event,me);
    },
    //输入数量
    bindblurtap: function(event){
      var me = this;
      addToCar.bindblurtapFn(event,me);
    },
    addToCarBtn: function(event){
      var me = this;
      addToCar.addToCarBtnFn(event,me);
      
    },
    gotoIndex: function(){
      wx.navigateTo({
        url: '../index/index'
      })
    },
    onShareAppMessage: function (res) {
      return {
        title: this.data.goodsDetail.name,
        path: '/pages/goodsDetail/goodsDetail?goodsId='+this.data.goodsDetail.id,
        imageUrl: this.data.goodsDetail.pic
      }
    },
});
// var types = ['default']
// var pageObject = {
//   data: {
//     defaultSize: 'default',
//     disabled: false,
//     plain: false,
//     loading: false
//   },
//   setDisabled: function(e) {
//     this.setData({
//       disabled: !this.data.disabled
//     })
//   },
//   setPlain: function(e) {
//     this.setData({
//       plain: !this.data.plain
//     })
//   },
//   setLoading: function(e) {
//     this.setData({
//       loading: !this.data.loading
//     })
//   }
// }

