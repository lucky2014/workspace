const utils = require("util.js");
var app = {
  //加入购物车动画
  addToCarFn: function (position, time,_this) {
    var animation = wx.createAnimation({
      duration: time,
      timingFunction: 'linear',
    })
    _this.animation = animation

    animation.translateY(position).step()

    _this.setData({
      animationCarData: animation.export()
    })
  }, 
  //弹出属性选择框
  isAddToCarCommon: function (_this) {
    this.addToCarFn(-900, 500,_this);
    setTimeout(function () {
      _this.setData({
        showCar: 1,
      })
    }.bind(_this), 200)
  },
  //关闭属性选择框
  cutAddToCarCommon: function (_this) {
    this.addToCarFn(900, 1000,_this);
    setTimeout(function () {
      _this.setData({
        showCar: 0
      })
    }.bind(_this), 300)
  },
  //请求当前商品详情
  isAddToCarFn: function(me,goodsId,detail) {
    var _this = this;
    utils.ajaxFn("product/getProductInfo.do", {"id": 230}, function(msg) {
      // console.log(JSON.stringify(msg,null,2))
      // _this.goodsDetail(msg,me,_this)
      var skuInfos = msg.skuInfos;
      me.setData({
        includeGroup: skuInfos,
        commodityAttr: skuInfos,
        goodsDetailData: msg
      });
      _this.distachAttrValue(me.data.commodityAttr,me);
      if (me.data.commodityAttr.length == 1) {
        var valList = me.data.commodityAttr[0].attributes;
        valList.forEach(function(v,i){
          me.data.attrValueList[i].selectedValue = v.attrVal;
        });
        this.setData({
          attrValueList: me.data.attrValueList,
          goodsDetailData: msg
        })
      }
     });
    if(!detail){
      _this.isAddToCarCommon(me);
    }
  },
  distachAttrValue: function(commodityAttr,me) {
    var _this = this;
    var attrValueList = me.data.attrValueList;

    commodityAttr.forEach(function(v,i){
      var valList = v.attributes;

      for(var j in valList){
        var comValue = valList[j].attrVal;
        var comKey = valList[j].attrName;
        var ind = _this.getAttrIndex(comKey,attrValueList);

        if (ind >= 0) {
          var attrValues = attrValueList[ind].attrValues;
          if (!_this.isValueExist(comValue,attrValues)) {
            attrValues.push(comValue)
          }
        } else {
          attrValueList.push({
            attrKey: comKey,
            attrValues: [comValue]
          })
        }
      }
    });

    attrValueList.forEach(function(v,i){
      var kValues = v.attrValues;

      kValues.forEach(function(kv,ki){
        if(v.attrValueStatus){
          v.attrValueStatus[ki] = true;
        }else{
          v.attrValueStatus = [];
          v.attrValueStatus[ki] = true;
        }
      })
    });
    me.setData({
      attrValueList: attrValueList
    })
  },
  getAttrIndex: function(attrName, attrValueList) {
    var len = attrValueList.length;
    for (var i = 0; i < len; i++) {
      if (attrName == attrValueList[i].attrKey) {
        break;
      }
    }
    return i < len ? i: -1;
  },
  isValueExist: function(value, valueArr) {
    var len = valueArr.length;
    for (var i = 0; i < len; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < len;
  },
  selectAttrValue: function(e,me) {
    var _this = this;
    var attrValueList = me.data.attrValueList;
    var index = e.currentTarget.dataset.index;
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    var status = e.currentTarget.dataset.status;
    var selectedvalue = e.currentTarget.dataset.selectedvalue;
    var firstIndex = me.data.firstIndex;
    
    if (status || index == firstIndex) {
      if (selectedvalue == value) {
        _this.disSelectValue(attrValueList, index, key, value, me)
      } else {
        _this.selectValue(attrValueList, index, key, value,"",me)
      }
    }
  },
  selectValue: function(attrValueList, index, key, value, unselectStatus,me) {
    var includeGroup = [];
    if (index == me.data.firstIndex && !unselectStatus) {
      var commodityAttr = me.data.commodityAttr;
      attrValueList.forEach(function(v,i){
        v.attrValues.forEach(function(vv,vi){
          v.selectedvalue == '';
        })
      });
    }else {
      var commodityAttr = me.data.includeGroup;
    };

    commodityAttr.forEach(function(v,i){
      var valList = v.attributes;
      valList.forEach(function(vv,vi){
        if(vv.attrName == key && vv.attrVal == value){
          includeGroup.push(v)
        }
      })
    });

    attrValueList[index].selectedValue = value;
    attrValueList.forEach(function(v,i){
      v.attrValues.forEach(function(vv,vi){
        //console.log(v.attrValueStatus[vi])
        v.attrValueStatus[vi] = false;
      })
    });

    attrValueList.forEach(function(v,i){
      includeGroup.forEach(function(k,ki){
        var kvalList = k.attributes;
        kvalList.forEach(function(m,mi){
                //console.log(m.attrName)
          if(v.attrKey == m.attrName){
            var avalues = v.attrValues;
            avalues.forEach(function(n,ni){
              if(n == m.attrVal){
                v.attrValueStatus[ni] = true;
              }
            })
          }
        })
      })
    });

    me.setData({
      attrValueList: attrValueList,
      includeGroup: includeGroup
    });

    var count = 0;
    attrValueList.forEach(function(v,i){
      var aValues = v.attrValues
      aValues.forEach(function(vv,vi){
        if (v.selectedValue) {
          count++;
          return false;
        }
      })
    });

    if (count < 2) {
      me.setData({
        firstIndex: index
      })
    } else {
      me.setData({
        firstIndex: -1
      })
    }

    for (var il = 0; il < attrValueList.length; il++) {
      if (!attrValueList[il].selectedValue) {
        break
      }
    }
    if (il < attrValueList.length) {
      me.setData({
        slAll: 0
      })
    }else{
      me.setData({
        slAll: 1
      })
    }
  },
  disSelectValue: function(attrValueList, index, key, value,me) {
    var _this = this;
    var commodityAttr = me.data.commodityAttr;
    attrValueList[index].selectedValue = '';

    attrValueList.forEach(function(v,i){
      var aValues = v.attrValues;
      aValues.forEach(function(vv,vi){
        v.attrValueStatus[vi] = true;
      })
    });
    me.setData({
      includeGroup: commodityAttr,
      attrValueList: attrValueList
    });
    attrValueList.forEach(function(v,i){
      if(v.selectedValue){
        _this.selectValue(attrValueList, i, v.attrKey, v.selectedValue, true,me)
      }
    });
  },
  //计算不同属性的价格
  calcuPriceFn: function(_this,msg){
    var me = _this;
    // var msg = me.data.goodsDetail;
    // console.log(msg)
    
        var thattrVal = [];
        var skuInfos = msg.skuInfos;
        for(var i in skuInfos){
          var str="";
          var attriSig = skuInfos[i].attributes;
          for(var j in attriSig){
            if(str){
              str = str+";"+attriSig[j].attrVal;
            }else{
              str += attriSig[j].attrVal;
            }
          }
          var v = skuInfos[i];
          thattrVal.push({
              "attribute" : str,
              "price" : Number(v.skuInfo1688.cost).toFixed(2),
              // "retailPrice" : Number(msg.retailPrice).toFixed(2)||"无",
              "currentNum" : v.currentNum,
              // "value" : Number(v.sellPrice)-Number(v.cost),
              
              "sellPrice" : v.sellPrice,
              "imgUrL" : (msg.skuInfos[i].attributes)[0].imgUrl,
              "skuId" : v.id
          })
        }
        return thattrVal;
  },
  //改变商品数量
  changeNumTapFn: function(event,me){
    var nowNum = me.data.selectNum;
    var isadd = event.currentTarget.dataset.isadd;

    if(isadd == 1){
      nowNum = nowNum+1;
    }else if(nowNum>1){
      nowNum = nowNum-1;
    }else{
      wx.showToast({
        title: '数量超出范围',
        image: '/imgs/forbidden.png'
      })
    }
    me.setData({
      selectNum: nowNum
    })
  },
  //输入数量
  bindblurtapFn: function(event,me){
    var currentNum = me.data.currentNum;
    var inputNum = event.detail.value;

    if(inputNum>currentNum || inputNum<1){
      inputNum = 1;
      wx.showToast({
        title: '数量超出范围',
        image: '/imgs/forbidden.png'
      })
    }
    me.setData({
      selectNum: inputNum
    })
  },
  //点击加入购物车按钮
  addToCarBtnFn: function(event,me){
    var _this =this;
    // var msg = me.data.goodsDetail;
    // var attrData = msg.attrData;
    // var skus = msg.skuSign;
    var selectNum = me.data.selectNum;
    var currentNum = me.data.currentNum;
    var id = me.data.includeGroup[0].id;
    var status = event.currentTarget.dataset.status;

    var attrValueList = me.data.attrValueList;

    for(var i in attrValueList){
      if(!attrValueList[i].selectedValue){
        wx.showToast({
         title: '请选择'+attrValueList[i].attrKey,
         image: '/imgs/forbidden.png'
       });
       return false;
      }
    }
    // for(var i in skus){
    //   var isSel = 0;
    //   for(var j in skus[i]){
    //     if(skus[i][j]){
    //       isSel = 1;
    //     }
    //   }
    //   if(isSel == 0){
    //     wx.showToast({
    //       title: '请选择'+i,
    //       image: '/imgs/forbidden.png'
    //     });
    //     return false;
    //   }
    // }

    if(selectNum>currentNum){
      wx.showToast({
        title: '数量超出范围',
        image: '/imgs/forbidden.png'
      });
      return false;
    }

    var commitData = {
        "goodsId" : me.data.goodsDetailData.id,
        "skuId" : id,
        "storeId" : me.data.storeData.id,
        "num" : selectNum
    };
    

    // var thsel = "";
    // for(var ise in skus){ //获取已选属性组合
    //   for(var se in skus[ise]){
    //     if(skus[ise][se]){
    //       if(thsel){
    //         thsel = thsel+";"+se;
    //       }else{
    //         thsel = se;
    //       }
    //     }
    //   }
    // }

    // attrData.forEach(function(av,ai){
    //   if(av.attribute == thsel){
    //     msg.carHeaderData = av;
    //     me.setData({
    //       goodsDetail: msg
    //     })
    //   }
    // })
    // if(status == 1){

    // }
    if(!status){
        // var carData = commonFn.init(1,function(msg){
            //var newData = me.newDataFn(msg);
            //console.log(msg.data)
            // var thCarNum = 0;
            // var thCurentNum = Number($(".addHeader .stock span").html());
            // $.each(msg.data,function(a,av){
            //     if(av.skuId == commitData.skuId){
            //         thCarNum = Number(av.num);
            //         return false;
            //     }
            // })
            // var carData = msg.data.length;
            // if(thCurentNum < thCarNum + Number(commitData.num)){
            //     $.toast("库存不足(含购物车"+thCarNum+"件)", "forbidden");
            // }else{
                utils.ajaxFn("cart/saveProductToCart.do", commitData, function(msg) {
                    me.setData({
                      showCar:0
                    });
                    _this.cutAddToCarCommon(me);
                    wx.showToast({
                      title: '添加成功'
                    });
                })
            // }
        // });
        
    }else{
        var orderData = JSON.stringify(commitData,null,2);
        wx.navigateTo({
          url: '../goodsDetail/goodsDetail?fromGoodsDetail=1&orderData='+orderData
        })
    }
    
  },
  //选中商品属性
  selectSkuFn: function(event,me) {
    var sku = event.currentTarget.dataset.sku;
    var skuout = event.currentTarget.dataset.skuout;
    
    var goodsDetail = me.data.goodsDetail;
    var skus = goodsDetail.skuSign;
    if(skus[skuout][sku]){
      skus[skuout][sku] = false;
    }else{
      for (var val in skus[skuout]) {
        skus[skuout][val]=false;
      }
      skus[skuout][sku] = true;
    }
    me.setData({
      goodsDetail: goodsDetail
    })
  },
}
module.exports = {
  isAddToCarCommon: app.isAddToCarCommon,//弹出属性选择框
  cutAddToCarCommon: app.cutAddToCarCommon,//关闭属性选择框
  addToCarFn:app.addToCarFn,//加入购物车动画
  isAddToCarFn:app.isAddToCarFn,//请求当前商品详情
  calcuPriceFn:app.calcuPriceFn,//计算不同属性的价格
  changeNumTapFn:app.changeNumTapFn,
  bindblurtapFn:app.bindblurtapFn,
  addToCarBtnFn:app.addToCarBtnFn,
  selectSkuFn:app.selectSkuFn,
  distachAttrValue:app.distachAttrValue,
  getAttrIndex:app.getAttrIndex,
  isValueExist:app.isValueExist,
  selectAttrValue:app.selectAttrValue,
  selectValue:app.selectValue,
  disSelectValue:app.disSelectValue,
  goodsDetail:app.goodsDetail



}