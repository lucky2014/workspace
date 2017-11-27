define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    require("../../sideShop_B/orderManage/index.css");

    var app = {
        loading:false,
		init: function(){
            var navHtml = require("../orderManage/buyerOrderNav.tpl");
            box.render($(".orderNav"), "", navHtml);


            var orderStatus = setup.getQueryString("status");
            if(!orderStatus){
                orderStatus = 0;
            }
            $(".orderStatus[status="+orderStatus+"]").addClass("current");

            var orderData={
                customerId:setup.getQueryString("customerId"),
                status:orderStatus,
                //searchParam:$("#searchInput").val(),
                pageNum:1,
                pageSize:10
            }
            app.getOrderList(orderData);

            $(".confirmBtn").click(function(){

            });

            $("body").css({"padding":"33px 0 10px 0"});
            $(".orderManage").removeClass("hide");

            $(".moreStatus").click(function(){
                if($(this).hasClass("current")){
                    $(this).removeClass("current");
                    $(".moreNav").hide();
                }else{
                    $(this).addClass("current");
                    $(".moreNav").show();
                }
            });
			$(".orderStatus").click(function(){
                $(".orderStatus").removeClass("current");
                $(this).addClass("current");
                $(".moreNav").hide();
                $(".moreStatus").removeClass("current");
                orderData.status = $(this).attr("status");
                orderData.pageNum = 1;
                app.getOrderList(orderData);
            });
            $(document).on("click", ".orderBtn1", function() {
                var _that = $(this);
                if($(this).html()=="删除订单"){
                    $.confirm("您确定要删除该订单吗?", "确认删除?", function() {
                        app.deleteOrder(_that.parents("li").attr("orderId"),2,orderData);
                    }, function() {
                        //取消操作
                    });
                }else if($(this).html()=="关闭订单"){
                    $.confirm("您确定要关闭该订单吗?", "确认关闭?", function() {
                        app.deleteOrder(_that.parents("li").attr("orderId"),1,orderData);
                    }, function() {
                        //取消操作
                    });
                }else if($(this).html()=="查看物流"){
                    location.href="../sideShop_B/logistics.html?orderId="+$(this).parents("li").attr("orderId");
                }
            });
            $(document.body).infinite().on("infinite", function() {
                if(app.loading) return;
                app.loading = true;
                setTimeout(function() {
                    orderData.pageNum++;
                    app.getOrderList(orderData);
                }, 1000);
            });
            $("#searchInput").keyup(function(e){
                e = window.event || e;
                if(e.keyCode==13){
                    orderData.searchParam = $("#searchInput").val();
                    orderData.pageNum = 1;
                    app.getOrderList(orderData);
                }
            });
            /*var orderListHtml = require("../orderManage/orderList.tpl");
            box.render($(".orderListDiv").find("ul"), "", orderListHtml);*/
            //app.countDown(3600);
		},
        deleteOrder:function(id,type,orderData){
            var closeData={
                orderId:id,
                operatorType:type
            }
            setup.commonAjax("order/closeAndDelOrder.do",closeData,function(){
                orderData.pageNum = 1;
                app.getOrderList(orderData);
            });
        },
        getOrderList:function(orderData){
            setup.commonAjax("order/listOrders.do",orderData,function(msg){
                var orderListHtml = require("../orderManage/orderList1.tpl");
                if(orderData.pageNum==1){
                    $(".orderListDiv").find("ul").html("");
                    if(msg.data.length<1){
                        $(".noData").show();
                        $(".weui-loadmore").hide();
                    }else{
                        $(".noData").hide();
                    }
                }else{
                    $(".noData").hide();
                }
                if(msg.data.length!=10){
                    app.loading = true;
                }else{
                    app.loading = false;
                }

                $.each(msg.data, function(i,v){
                    if(v.status == 1||v.status == 8){
                        v.statusColor = "#AA2327";
                        if(v.status == 1){
                            v.btn1 = "关闭订单";
                        }
                        v.btn2 = "去支付";
                    }else if(v.status == 3){
                        v.statusColor = "#6CB287";
                        //v.btn1 = "查看物流";
                        //v.btn3 = "确认收货";
                    }else if(v.status == 7){
                        v.statusColor = "#6CB287";
                        //v.btn1 = "查看物流";
                    }else if(v.status == 5){
                        v.statusColor = "#A2A2A2";
                        v.btn1 = "删除订单";
                    }else{
                        v.statusColor = "#AA2327";
                    }
                    v.goodsNum = 0;
                    $.each(v.orderDetails,function(j,goods){
                        v.goodsNum+=goods.num;
                    });
                });
                box.render($(".orderListDiv").find("ul"), msg, orderListHtml);

                if(orderData.pageNum == msg.page.pages){
                    //$(document.body).destroyInfinite();
                    $(".weui-loadmore").hide();
                }
            });
        },
	};
    app.init();
});
