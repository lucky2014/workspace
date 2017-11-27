define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    require("../logistics/index.css");

    var app = {
		init: function(pageNum, pageSize, grandType){
            setup.commonAjax("index/getIndexInfo.do",{},function(msg){
                
            });
			$(".logistics").removeClass("hide");
		},
	};
    app.init();
});


