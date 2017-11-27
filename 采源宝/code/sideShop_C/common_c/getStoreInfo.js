define(function(require,exports,module){
	var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
	var app = {
		init:function(){
			var obj = null;
			setup.commonAjax("store/getStoreInfo.do","",function(msg){
				obj = msg.returnObject||msg;
			},function(msg){
				
			},false,false);
			return obj;
		}
	}
	return app.init();
})