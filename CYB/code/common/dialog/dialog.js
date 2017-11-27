define(function(require,exports,module){
	var $ = require("jquery");
	require("weui");
    var setup = require("setup");
    var Engine = require("engine");
    var dialogTpl = require("../dialog/dialog.tpl");
    require("weui/weui.css");
    var box = Engine.init();
    var dialog = {
    	init:function(config,confirmCb){
            $("#dialog").html("");
            box.render($("#dialog"),config,dialogTpl);
            setTimeout(function(){
                $("#dialog-confirm").click(function(){
                    confirmCb&&confirmCb();
                    $("#dialog>div").fadeOut(300);
                });
                $("#dialog-concel").click(function(){
                    $("#dialog>div").fadeOut(300);
                })
            },300);

    	}
    }
    return dialog;
});