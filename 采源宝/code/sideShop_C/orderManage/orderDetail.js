define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    require("../../sideShop_B/orderManage/index.css");

    var app = {
        orderId: setup.getQueryString("orderId"),
		init: function(){
            app.getOrderInfo(setup.getQueryString("orderId"));
		},
        getOrderInfo: function(orderId){
            var data = {
                orderId: orderId
            };
            setup.commonAjax("order/getOrderInfo.do",data,function(msg){
                //状态 0全部 1=C端待付款 2=待发货 3=已发货 4=待评价 5=已经取消,6=已删除,7=完成,8=B端待付款
                if(msg.status == 1||msg.status==8){
                    var topHtml = require("../../sideShop_B/orderManage/tpl/orderStatus1.tpl");
                    $("body").css("padding-bottom",48)
                    msg.btn1 = 1;
                }else if(msg.status==2){
                    var topHtml = require("../../sideShop_B/orderManage/tpl/orderStatus2.tpl");
                }else if(msg.status==3){
                    var topHtml = require("../../sideShop_B/orderManage/tpl/orderStatus3_1.tpl");
                }else if(msg.status==7){
                    var topHtml = require("../../sideShop_B/orderManage/tpl/orderStatus4.tpl");
                }else if(msg.status==5){
                    var topHtml = require("../../sideShop_B/orderManage/tpl/orderStatus5.tpl");
                }
                box.render($(".statusDiv"), "", topHtml);


                $(".orderDetail").removeClass("hide");

                //计算商品价格
                var priceForGoods = msg.orderDetails.price*msg.orderDetails.num;
                msg.priceForGoods = priceForGoods;
                msg.goodsPrice = (msg.totalPrice-msg.transferFee).toFixed(2);
                //转换时间
                msg.createTimeNew = setup.timeFormatter(msg.createTime,1)
                if(msg.payTime){
                    msg.payTimeNew = setup.timeFormatter(msg.payTime,1)
                }else{
                    if(msg.status==5){
                        msg.payTimeNew = "已关闭";
                    }else{
                        msg.payTimeNew = "待付款";
                    }
                }
                msg.goodsNum = 0;
                $.each(msg.orderDetails,function(j,goods){
                    msg.goodsNum+=goods.num;
                });
                var detailTpl = require("../orderManage/orderDetail.tpl");
                box.render($(".orderDetail"), msg, detailTpl);
                if(msg.btn1){
                    $(".payDiv").show();
                }
            });
        }
	};

    //删除/取消订单
    $(".orderDetail").delegate("#closeAndDelOrder", "click", function(){
        var operatorType = $(this).attr("operatorType");
        var data = {
            orderId:  app.orderId,
            operatorType: operatorType
        };
        setup.commonAjax("cus/getOrderInfo.do",data,function(msg){
            if(operatorType == 1){
                msg = "取消成功";
            }else{
                msg = "删除成功";
            }
            $.toast(msg, function() {
              console.log('close');
            });
        });
    });
    app.init();
});
