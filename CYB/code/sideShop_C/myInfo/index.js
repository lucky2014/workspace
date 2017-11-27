define(function(require,exports,module){
	//require("../../sideShop_C/myInfo/index.css");
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    require("../common_c/nav/nav");

    var app = {
        storeId: setup.getQueryString("storeId"),
        isSuccess:setup.getQueryString("isSuccess"),
        goodsId:setup.getQueryString("goodsId"),
		init: function(){
            var me = this;
			app.getUserInfo();
            app.getBusinessOrdersNum();
        },
        getUserInfo: function(){
            var data = {
                storeId: app.storeId,
            };
            setup.commonAjax("customer/getUserInfo.do",data, function(msg){
                //console.log(JSON.stringify(msg,null,2));
                $(".myInfo dt").html(msg.name);
                $(".myInfo dd").html("ID："+ msg.customerId);
                $("#unPays").parents("a").attr("href","../sideShop_C/orderManage.html?customerId="+msg.customerId+"&status=1");
                $("#unShipping").parents("a").attr("href","../sideShop_C/orderManage.html?customerId="+msg.customerId+"&status=2");
                $("#shipping").parents("a").attr("href","../sideShop_C/orderManage.html?customerId="+msg.customerId+"&status=3");
                $("#finish").parents("a").attr("href","../sideShop_C/orderManage.html?customerId="+msg.customerId+"&status=7");
                $("#orderManage").attr("href","../sideShop_C/orderManage.html?customerId="+msg.customerId);
            });
        },
        getBusinessOrdersNum: function(){
            setup.commonAjax("store/getBusinessOrdersNum.do",{}, function(msg){
                //console.log(JSON.stringify(msg,null,2));
                $("#unPays").html((msg.BunPays ? msg.BunPays : 0)+(msg.CunPays ? msg.CunPays : 0));
                $("#unShipping").html(msg.unShipping ? msg.unShipping : 0);
                $("#shipping").html(msg.shipping ? msg.shipping: 0);
                $("#finish").html(msg.finish ? msg.finish : 0);
            });
        }
    };
    app.init();
});
