define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();

    require("../nav/nav.css");
    var carNum = require("../commonFn");
    var navTpl = require("../nav/nav.tpl");

    var app = {
		init: function(){
            var me = this;
            me.getIndexUrl();
        },
        carNumber: function(){
            var params = {
                "pageNum":1,
                "pageSize":1000
            }
            setup.commonAjax("cart/listCartProducts.do", params, function(msg){
                var data = msg.data.length;
                if(data == 0){
                    $(".shoppingCar p").hide();
                }else{
                    $(".shoppingCar p").show();
                    $(".shoppingCar p").html(data);
                }
            }) 
        },
        getIndexUrl: function(){
            box.render($(".navBar"),"",navTpl,function(){
                carNum.init();
                if(!!$("#shopHome")[0]){
                    $(".navBar ul li.indexIcon i").css({"background-image":"url(../imgs/c/bk_navIcon.png)","background-position":"-4px -31px"});
                    $(".navBar ul li.indexIcon").addClass("selected")
                }else if(!!$("#shoppingCar")[0]){
                    //当前页面导航样式
                    $(".navBar ul li.shoppingCar i").css({"background-image":"url(../imgs/c/bk_navIcon.png)","background-position":"-50px -32px"});
                    $(".navBar ul li.shoppingCar").addClass("selected");
                }else if(!!$(".myInfo")[0]){
                    $(".navBar ul li.myInfor i").css({"background-image":"url(../imgs/c/bk_navIcon.png)","background-position":"-87px -32px"});
                    $(".navBar ul li.myInfor").addClass("selected")
                }
                if(!$("#shopHome")[0]){
                    setup.commonAjax("store/getStoreInfo.do","", function(msg){
                        $(".navBar .indexIcon a").attr("href",msg.htmlUrl);
                    })  
                }
            });
        }
    };
    app.init();
});
