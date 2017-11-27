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
			var goodsEditDetailTpl = require("../goodsEdit/goodsEdit_img.tpl");
			//var goodsId = setup.getQueryString("id");
			setup.commonAjax_B(1,"product/getProductInfo.do",{"id":goodsId},function(msg){
				console.log(msg)
				box.render($(".clearFix"),msg,goodsEditDetailTpl)
            });
		},
	};
    app.init();
});


