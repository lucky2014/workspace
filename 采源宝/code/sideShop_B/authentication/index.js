define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    require("ajaxfileupload");
    require("../ajaxfileupload/index");
    require("../authentication/index.css");

    var app = {
		init: function(){
            $("input[type=text]").click(function(){
                $(this).focus();
            });
            $(".certifiBtn").click(function(){
                var regIdCard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
                if($("#idName").val()==""){
                    $.alert("姓名不能为空！","提示");
                }else if($("#idNumber").val()==""){
                    $.alert("身份证不能为空！","提示");
                }else if(!regIdCard.test($("#idNumber").val())){
                    $.alert("身份证格式不正确！","提示");
                }else{
                    app.identifyHuman();
                }
            });
			$(".authentication").removeClass("hide");
		},
        identifyHuman:function(){
            var data={
                name:$("#idName").val(),
                identification:$("#idNumber").val()
            }
            setup.commonAjax_B(2,"store/identifyHuman.do",data,function(){
                history.go(-1);
            });
        },
	};
    app.init();
});


