define(function(require,exports,module){
	var $ = require("jquery");
    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var app = {
    	init:function(){
    		$("#content li").click(function(){
    			$(this).toggleClass("active");
    		})
    	}
    }
    var params = {
        offerId: '549383272221',
        content: 'hello test',
        feedId: '1222222',
        feedType: '0',
    };
    Pan.call('AliShare.distribute', params, function(){
        console.log(12314)
    }, function(msg){
        alert(JSON.stringify(msg))
    } );
    app.init();
})