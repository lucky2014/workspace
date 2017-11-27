define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    require("../orderManage/index.css");
    var app = {
		init: function(){
            app.getOrderDetail(setup.getQueryString("orderId"));
            var btnType = false;
            $("#goToPay").click(function(){
                if(btnType) return;
                btnType = true;
                if($(this).attr("synchro")==0){
                    app.placeOrder($(this).attr("orderId"));
                }else{
                    $.alert("请在采源宝订单中心完成支付。", "该订单已同步");
                }
            });
            $(".remarkInput").click(function(){
                $(this).focus();
            });
		},
        placeOrder:function(id){
            var theData={
                orderId:id,
                remark:$(".remarkInput").val()
            }
            setup.commonAjax_B(3,"order/syncOrder.do",theData,function(msg){
                $("#goToPay").attr("synchro",1);
                $(".payDiv").hide();
                $(".remarkInput").hide();
                $(".remarkInfo").show().find("p").html($(".remarkInput").val());
                $.alert("请在采源宝订单中心完成支付。", "同步成功");
            });
        },
        getOrderDetail:function(orderId){
            var orderData={
                orderId:orderId
            }
            setup.commonAjax_B(3,"order/getBusinessOrderInfo.do",orderData,function(msg){
                if(msg.status==1||msg.status==8){
                    var topHtml = require("../orderManage/tpl/orderStatus1.tpl");
                    $("body").css("padding-bottom",48);
                    $("#goToPay").attr("orderId",msg.id);
                    if(msg.status==1){
                        $(".payDiv").show();
                        $("#goToPay").attr("synchro",0);
                    }else{
                        $("#goToPay").attr("synchro",1);
                    }
                }else if(msg.status==2){
                    var topHtml = require("../orderManage/tpl/orderStatus2.tpl");
                }else if(msg.status==3){
                    var topHtml = require("../orderManage/tpl/orderStatus3_2.tpl");
                }else if(msg.status==7){
                    var topHtml = require("../orderManage/tpl/orderStatus4.tpl");
                }else if(msg.status==5){
                    var topHtml = require("../orderManage/tpl/orderStatus5.tpl");
                }
                if(msg.orderInfo1688.busRemark){
                    $(".remarkDiv").show().find(".remarkInfo").show().find("p").html(msg.orderInfo1688.busRemark);
                }else{
                    if(msg.status==1){
                        $(".remarkDiv").show().find("textarea").show();
                    }
                }
                box.render($(".statusDiv"), "", topHtml);
                $("#buyerPrice").html("¥"+msg.totalPrice.toFixed(2));
                $("#totalPrice").html("¥"+msg.sellerTotalPrice.toFixed(2));
                $("#sellerPrice").html("¥"+msg.sellerTotalPrice.toFixed(2));
                $("#transferFee").html("¥"+msg.transferFee.toFixed(2));
                $("#goodsPrice").html("¥"+(msg.totalPrice-msg.transferFee).toFixed(2));
                $("#earnPrice").html("¥"+(msg.totalPrice-msg.sellerTotalPrice).toFixed(2));
                $("#orderNo").html(msg.orderNo);
                $("#createTime").html(setup.timeFormatter(msg.createTime,1));
                if(msg.payTime){
                    $("#payTime").html(setup.timeFormatter(msg.payTime,1));
                }else{
                    if(msg.status==5){
                        $("#payTime").html("已关闭");
                    }else{
                        $("#payTime").html("待付款");
                    }
                }
                if(msg.remark){
                    $(".buyerMessage").show().find("p").html(msg.remark);
                }else{
                    $(".buyerMessage").hide();
                }
                $(".nameSpan").html(msg.receiverName);
                $(".phoneSpan").html(msg.receiverMoible);
                $(".addressSpan").html(msg.receiverAddress);
                var products = msg.orderDetails;
                box.render($(".goodsList"), products, require("../orderManage/goodsList.tpl"));

                $(".orderDetail").removeClass("hide");
            });
        },
	};
    app.init();
});
