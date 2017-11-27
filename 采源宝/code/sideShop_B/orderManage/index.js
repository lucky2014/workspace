define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    require("../orderManage/index.css");

    var app = {
        loading:false,
        orderListData:{
            pageSize:10,
            pageNum:1
        },
		init: function(){
            var navHtml = require("../orderManage/sellerOrderNav.tpl");
            box.render($(".orderNav"), "", navHtml);
            app.getBusinessOrdersNum();

            var orderStatus = setup.getQueryString("status");
            if(!orderStatus){
                orderStatus = 0;
            }
            $(".orderStatus[status="+orderStatus+"]").addClass("current");

            app.orderListData.status = orderStatus;
            app.getOrderList(app.orderListData);

            $("body").css({"padding":"33px 0 10px 0"});
            $(".orderManage").removeClass("hide");

            $("#searchInput").keyup(function(e){
                e = window.event || e;
                if(e.keyCode==13){
                    app.orderListData.searchParam = $("#searchInput").val();
                    app.orderListData.pageNum = 1;
                    app.getOrderList(app.orderListData);
                }
            });

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
                app.orderListData.status = $(this).attr("status");
                app.orderListData.pageNum = 1;
                app.getOrderList(app.orderListData);
            });
            $(".updateBtn").click(function(){
                $("#searchInput").val("");
                app.orderListData.searchParam = $("#searchInput").val();
                app.orderListData.pageNum = 1;
                app.getOrderList(app.orderListData);
            });
            $(document).on("click", ".orderBtn2", function() {
                if($(this).attr("synchro")==0){
                    if(!$(this).attr("clickType")){
                        $(this).attr("clickType",1);
                        app.placeOrder($(this).parents("li").attr("orderId"),$(this));
                    }
                }else{
                    $.alert("请在采源宝订单中心完成支付。", "该订单已同步");
                }
            });
            $(document).on("click", ".orderBtn1", function() {
                var _that = $(this);
                if($(this).html()=="删除订单"){
                    $.confirm("您确定要删除该订单吗?", "确认删除?", function() {
                        app.deleteOrder(_that.parents("li").attr("orderId"),2);
                    }, function() {
                        //取消操作
                    });
                }else if($(this).html()=="关闭订单"){
                    $.confirm("您确定要关闭该订单吗?", "确认关闭?", function() {
                        app.deleteOrder(_that.parents("li").attr("orderId"),1);
                    }, function() {
                        //取消操作
                    });
                }else if($(this).html()=="查看物流"){
                    location.href="logistics.html?orderId="+$(this).parents("li").attr("orderId");
                }
            });
            $(document.body).infinite().on("infinite", function() {
                if(app.loading) return;
                app.loading = true;
                setTimeout(function() {
                    app.orderListData.pageNum++;
                    app.getOrderList(app.orderListData);
                }, 100);
            });
            //app.countDown(3600);
		},
        getBusinessOrdersNum:function(){
            setup.commonAjax_B(2,"store/getBusinessOrdersNum.do",{},function(msg){
                $("#todayOrders").html(msg.todayOrders);
                $("#unPays").html(msg.BunPays+msg.CunPays);
                $("#unShipping").html(msg.unShipping);
                $("#shipping").html(msg.shipping);
                $("#finish").html(msg.finish);
                $("#cance").html(msg.cance);
            });
        },
        placeOrder:function(id,_that){
            var theData={
                orderId:id
            }
            setup.commonAjax_B(3,"order/syncOrder.do",theData,function(msg){
                _that.attr("synchro",1).html("订单已同步，请去采源宝支付").siblings(".orderBtn1").remove();
                $.alert("请在采源宝订单中心完成支付。", "同步成功");
            });
        },
        deleteOrder:function(id,type){
            var closeData={
                orderId:id,
                operateType:type
            }
            setup.commonAjax_B(3,"order/deleteAndCancelBusinessOrder.do",closeData,function(msg){
                app.orderListData.pageNum = 1;
                app.getBusinessOrdersNum();
                app.getOrderList(app.orderListData);
            });
        },
        getOrderList:function(orderData){
            setup.commonAjax_B(3,"order/listBusinessOrders.do",orderData,function(msg){
                var orderListHtml = require("../orderManage/orderList.tpl");
                if(orderData.pageNum==1){
                    $(".orderListDiv").find(".orderList").html("");
                    if(msg.data.length<1){
                        $(".noData").show();
                        $(".weui-loadmore").hide();
                    }else{
                        $(".noData").hide();
                    }
                }else{
                    $(".noData").hide();
                }

                $.each(msg.data, function(i,v){
                    if(v.status == 1||v.status == 8){
                        v.statusColor = "#AA2327";
                        if(v.status == 1){
                            v.btn1 = "关闭订单";
                            v.btn2 = "确认收款，同步订单至采源宝";
                            v.synchro = 0;
                        }else{
                            v.synchro = 1;
                            v.btn2 = "订单已同步，请去采源宝支付";
                        }
                    }else if(v.status == 3){
                        v.statusColor = "#6CB287";
                        //v.btn1 = "查看物流";
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
                    $.each(v.orderDetails, function(j,goods){
                        goods.gain = goods.profit*1.0;
                        v.goodsNum+=goods.num;
                    });
                });
                box.render($(".orderListDiv").find(".orderList"), msg, orderListHtml);

                if( orderData.pageNum == msg.page.pages){
                    app.loading = true;
                    //$(document.body).destroyInfinite();
                    $(".weui-loadmore").hide();
                }else{
                    app.loading = false;
                }
            });
        },
        countDown: function(x){
            var wait = x;
            function timeDown(o){
                if( o >= 0){
                    $(".countDown").html(app.changeTime(o))
                    o--;
                    
                    setTimeout(function(){
                        timeDown(o);
                    }, 1000);
                }else{
                    console.log("stop")
                }           
            }
            timeDown(wait);
        },
        changeTime:function(time){
            var hour = "0"+parseInt(time/3600);
            if(time%3600/60>=10){
                var minute = parseInt(time%3600/60);
            }else{
                var minute = "0"+parseInt(time%3600/60);
            }
            if(time%3600%60>=10){
                var second = parseInt(time%3600%60);
            }else{
                var second = "0"+parseInt(time%3600%60);
            }
            return hour+":"+minute+":"+second;
        },
	};
    app.init();
});
