define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    require("../shopManage/index.css");
    var editHtml = require("{editTpl}.tpl");
    box.render($(".shopEdit"), "", editHtml);
    var app = {
		init: function(){
            if(setup.getQueryString("editTpl")=="shopBackground"){
                var imgType = setup.getQueryString("imgType");
                $(".shopBg").find("li[imgType="+imgType+"]").addClass("current");
                $(".bgImg").attr("src",$(".shopBg").find("li.current").find("img").attr("src"));
            }else if(setup.getQueryString("editTpl")=="shopSummary"){
                 setup.commonAjax_B(2,"store/getStoreInfo.do",{},function(msg){
                    $("#shopSummaryInput").val(msg.shortIntro);
                    $(".enterNumber").html($("#shopSummaryInput").val().length);
                 });
            }else{
                var isCertification = setup.getQueryString("isCertification");
                if(isCertification==0){
                    $(".notCertifi").show();
                }else{
                    $(".certifi").show();
                    setup.commonAjax_B(2,"store/getIdentify.do",{},function(msg){
                        $("#nameP").html(msg.name);
                        var idNumber = msg.identification;  
                        var newIdNumber = idNumber.substr(0, 4) + '**********' + idNumber.substr(14);
                        $("#numberP").html(newIdNumber);
                    });
                }
            }
            $(".infoCertifi").find("input").click(function(){
                $(this).focus();
            });
            $(".shopSummary").find("textarea").keyup(function(){
                if($(this).val().length<=40){
                    $(".enterNumber").html($(this).val().length);
                }
            });
            $(".editSummary").click(function(){
                if($("#shopSummaryInput").val()!=""){
                    var data={
                        shortIntro:$("#shopSummaryInput").val()
                    }
                    setup.commonAjax_B(2,"store/updateStoreInfo.do",data,function(){
                        history.go(-1);
                    });
                }
            });
            $(".shopBg").find("li").click(function(){
                $(".bgImg").attr("src",$(this).find("img").attr("src"));
                $(this).addClass("current").siblings().removeClass("current");
            });
            $(".editBackground").click(function(){
                var data={
                    picUrl:$(".bgImg").attr("src")
                }
                setup.commonAjax_B(2,"store/uploadStoreBackPic.do",data,function(){
                    history.go(-1);
                });
            });
            $(".certifiBtn").click(function(){
                var data={
                    name:$("#idName").val(),
                    identification:$("#idNumber").val()
                }
                setup.commonAjax_B(2,"store/identifyHuman.do",data,function(){
                    history.go(-1);
                });
            });
        },
	};
    app.init();
});
