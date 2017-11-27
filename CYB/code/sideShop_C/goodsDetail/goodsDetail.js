define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    
    require("../common_c/shopInfor/shopInfor");
    var goodsSelect = require("../common_c/addsToCar/goodsSelect");
    var carNum = require("../common_c/commonFn");
    var weui = require("weui");
    var isPageC = setup.getQueryString("isPageC");
    
    var app = {
		init: function(){
            var me = this;
            goodsSelect.init();
            if(!isPageC){
                $(".goodsDetail_nav").remove();
                $(".detailInfor").css("padding-bottom","1px");
            }
            //购物车数量
            carNum.init();

        },
    };
    app.init();
});
