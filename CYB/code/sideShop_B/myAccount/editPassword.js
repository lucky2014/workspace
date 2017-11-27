define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    require("../myAccount/index.css");

    var app = {
		init: function(pageNum, pageSize, grandType){
			$(".editPassword").removeClass("hide");
		},
	};
    app.init();
});


