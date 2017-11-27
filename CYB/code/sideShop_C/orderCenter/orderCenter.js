define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var getStoreInfo = require("../common_c/getStoreInfo");
    var preOrderList = require("../orderCenter/orderCenter.tpl");
    require("weui");
    var app = {
        submitOrderData:{},
        receiverId: setup.getQueryString("receiverId"),
        storeId:0,
        actualPrice:0,
        num:0,
        listReceiverInfos:function(cb){
            var me = this;
            setup.commonAjax("customer/listReceiverInfos.do",{},function(msg){
                //console.log(JSON.stringify(msg,null,2));
                if(msg.length>0){
                    $.each(msg, function(i,v){
                        if(me.receiverId){
                            if(v.id == me.receiverId){
                                $(".receiverName").html(v.name);
                                $(".receiver_moible").html(v.phone);
                                $(".receiverAddress").html(v.provinceName+v.cityName+v.districtName+v.address);
                            }                        
                        }else if(v.isDefault == 1 || v.isDefault == "1"){
                            $(".receiverName").html(v.name);
                            $(".receiver_moible").html(v.phone);
                            $(".receiverAddress").html(v.provinceName+v.cityName+v.districtName+v.address);
                            me.receiverId = v.id;
                        }else{
                            $(".receiverName").html("选择地址");
                        }
                    });
                }else{
                    $(".receiverName").html("选择地址");
                }
                me.storeId = getStoreInfo.id;
                cb&&cb(msg);
            })
        },
        getValueByAttrFn:function(target,params){
            var arr = target.attr("data-param").split(",");
            for(var i = 0;i<arr.length;i++){
                var param = arr[i].split(":")[0];
                var val = arr[i].split(":")[1];
                params[param] = Number(val)||Number(val)||(val);
            }
        },
        canGetValueFn:function(target,params){
            var val = $.trim(target.html()||target.val());
            params[target.attr("data-param")] = Number(val)||Number(val)||(val);
        },
        getParams:function(msg){
            var paramsArr = [];
            var params = {};
            
            var data = [];
            var preOrderData = JSON.parse(localStorage.getItem("preOrderData"));
            for(var i = 0;i<msg.length;i++){
                data[i] = {};
                data[i].remark = $(".container .detailList").eq(i).find(".leaveWords").val();
                data[i].goodsParams = [];
                for(var j = 0;j<msg[i].goodsInfo.length;j++){
                    data[i].resourceId = msg[i].goodsInfo[j].resourceNo;
                    // data[i].goodsParams.push({
                    //     goodsId:msg[i].goodsInfo[j].goodsId1688,
                    //     skuId:msg[i].goodsInfo[j].sku.skuId1688,
                    //     specId:msg[i].goodsInfo[j].sku.specId,
                    //     storeId:getStoreInfo.id,
                    //     num:msg[i].goodsInfo[j].num||1
                    // }) 
                    data[i].goodsParams.push({
                        goodsId:msg[i].goodsInfo[j].goodsId,
                        skuId:msg[i].goodsInfo[j].sku.skuId,
                        specId:msg[i].goodsInfo[j].sku.specId,
                        storeId:getStoreInfo.id,
                        num:msg[i].goodsInfo[j].num||1
                    })
                }
            }
            params.storeId = this.storeId;
            params.receiverId = this.receiverId;
            params.type = 1;
            params.data = JSON.stringify(data);
            console.log(getStoreInfo)
            return params;
        },
		init: function(){
            var me = this;
			$("#submitOrder").click(function(){
                me.submitOrder();
                return false;
				window.location.href="orderPayment.html";
			});
            $(".detail-address a").click(function(){
                if(setup.getQueryString("fromGoodsDetail")){
                    location.href = "addressIndex.html?isFrom=1&fromGoodsDetail="+setup.getQueryString("fromGoodsDetail");
                }else{
                    location.href = "addressIndex.html?isFrom=1";
                }
            })
            window.preOrderData = JSON.parse(localStorage.getItem("preOrderData"));
            me.listReceiverInfos(function(){
                if(!setup.getQueryString("fromGoodsDetail")){
                    var params = {
                        receiverId:(me.receiverId||""),
                        cartIds:preOrderData.join(",")
                    }
                    setup.commonAjax("order/preOrderFromCart.do",params,function(msg){
                        var totalPrice = 0;
                        var transferFee = 0;
                        var num = 0;
                        if(msg.length==0){
                            $("#submitOrder").attr("disabled",true);
                        }
                        for(var i = 0;i<msg.length;i++){
                            totalPrice+=(msg[i].totalPrice||0);
                            transferFee+=(msg[i].transferFee||0);
                            num+=msg[i].goodsInfo.length;
                        }
                        me.num = num;
                        $(".priceTotal .fee").html(parseFloat(totalPrice));
                        $(".pricePost .fee").html(parseFloat(transferFee));
                        me.actualPrice = parseFloat(totalPrice+(transferFee||0));
                        $(".needPay .fee,.feeTotal").html(parseFloat(me.actualPrice));
                        me.submitOrderData = msg;
                        box.render($(".container"),msg,preOrderList);
                        if(!me.receiverId){
                            $(".sendWay .rt").html("请先选择收货地址");
                        }
                    })
                }else{
                    var arr = [];
                    window.preOrderData = JSON.parse(localStorage.getItem("fromDetailPreOrderData"));
                    delete preOrderData.price;
                    var params = {
                        receiverId:(me.receiverId||""),
                        data:JSON.stringify(preOrderData)
                    }
                    setup.commonAjax("order/preOrder.do",params,function(msg){
                        var totalPrice = 0;
                        var transferFee = 0;
                        var num = 0;
                        var data = new Array(msg);
                        for(var i = 0;i<data.length;i++){
                            totalPrice+=(data[i].totalPrice||0);
                            transferFee+=(data[i].transferFee||0);
                            num+=data[i].goodsInfo.length;
                        }
                        me.submitOrderData = data;
                        me.num = num;
                        $(".priceTotal .fee").html(parseFloat(totalPrice));
                        $(".pricePost .fee").html(parseFloat(transferFee));
                        me.actualPrice = parseFloat(totalPrice+(transferFee||0));
                        $(".needPay .fee,.feeTotal").html(parseFloat(me.actualPrice));
                        box.render($(".container"),data,preOrderList);
                        if(!me.receiverId){
                            $(".sendWay .rt").html("请先选择收货地址");
                        }
                    })
                }
                
            });
        },
        submitOrder:function(){
            var me = this;
            var params = this.getParams(this.submitOrderData);
            if(!me.receiverId){
                $.toast("请选择收货地址", "text");
                return false;   
            }
            $(".shoppingCar-title .desc").html(getStoreInfo.storeName);
            setup.commonAjax("order/submitOrder.do",params,function(){
                if(!setup.getQueryString("fromGoodsDetail")){
                    var cart = JSON.parse(localStorage.getItem("preOrderData"));
                    setup.commonAjax("cart/deleteCartProduct.do",{storeId:getStoreInfo.id,cartIds:JSON.stringify(cart)},function(){
                        location.href = "orderPayment.html?actualPrice="+me.actualPrice+"&num="+me.num;
                    });
                }else{
                    location.href = "orderPayment.html?actualPrice="+me.actualPrice+"&num="+me.num;
                }
            })
        }
    };
    app.init();
});
