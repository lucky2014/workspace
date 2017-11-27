define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();

    var app = {
        receiverId: setup.getQueryString("receiverId"),
        fromGoodsDetail: setup.getQueryString("fromGoodsDetail"),
        isFrom: setup.getQueryString("isFrom"),
		init: function(){
			var me = this;
			me.listReceiverInfos();
        },
        listReceiverInfos: function(){
        	var tpl = require("../../sideShop_C/addressAll/index.tpl");
        	setup.commonAjax("customer/listReceiverInfos.do", {}, function(msg){
                
                var data = {
                    defaultData: {},
                    datas: []
                };
                $.each(msg, function(i,v){
                    if(v.isDefault == 1){
                        data.defaultData = v;
                        data.isShow = 1;
                    }else{
                        data.datas.push(v);
                    }
                });
                //console.log(JSON.stringify(msg,null,2));
        		box.render($(".addressAll"), data, tpl);
        	});
        }
    };


    app.init();

    $(".addressAll").delegate("dt,dd", "click", function(){
        var receiverId = $(this).attr("receiverId");
        if(app.isFrom){
            if(app.fromGoodsDetail){
                location.href = "../sideShop_C/orderCenter.html?receiverId="+receiverId+"&fromGoodsDetail="+app.fromGoodsDetail+"&isFrom="+app.isFrom;
            }else{
                location.href = "../sideShop_C/orderCenter.html?receiverId="+receiverId;
            }
        }
    });

    if(app.fromGoodsDetail){
        $(".buttons_buttom_add").attr("href", "addressEdit.html?isAdd=1&fromGoodsDetail="+ app.fromGoodsDetail+"&isFrom="+app.isFrom)
    }else{
        $(".buttons_buttom_add").attr("href", "addressEdit.html?isAdd=1")
    }
});
