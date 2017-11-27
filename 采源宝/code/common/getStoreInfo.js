define(function(require,exports,module){
	var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var msg = {
	    "resultCode":1000,
	    "returnObject":{
			"id":0,
		    "storeName":"sxxx小",
		    "shortIntro":"小店简介",
			"htmlUrl":"afsf12414gvfwgsdg",
			"status":0,
		    "storeLogo":"http://xxxx.jpg",
		    "isCertification":1
	    }
	};
	var app = {
		init:function(){
			var obj = null;
			setup.commonAjax("store/getStoreInfo.do",{"storeId":1},function(msg){
				obj = msg.returnObject||msg;
			},null,false);
			return obj||msg;
		}
	}
	return app.init();
})