define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    // require("../goodsEdit/dragImg.js");
    var goodsId  = setup.getQueryString("id") || 22;
    var app = {
		init: function(){
			var me = this;
			me.getProductInfo();
			
		},
		getProductInfo: function(){
			var goodsEditDetailTpl = require("../goodsEdit/goodsEdit_detail.tpl");
			//var goodsId = setup.getQueryString("id");
			setup.commonAjax_B(1,"product/getProductShareInfo.do",{"id":goodsId},function(msg){
				//console.log(msg)
				box.render($(".goodsEdit_detail"),msg,goodsEditDetailTpl)
            });
		},
	};
    app.init();
});


