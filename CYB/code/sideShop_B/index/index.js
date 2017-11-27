define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    require("../index/index.css");
    require("../../sideShop_C/common_c/shopInfor/shopInfor.css");
    require("../../common/jquery.qrcode.min");
    var app = {
        storeId: setup.getQueryString("storeId"),
        isSuccess:setup.getQueryString("isSuccess"),
        goodsId:setup.getQueryString("goodsId"),
		init: function(pageNum, pageSize, grandType){
            var me = this;
            if(this.isSuccess=="1"||this.isSuccess==1){
                $(".dialog").show();
            }else{
                $(".dialog").hide();
            }
            $(".close").click(function(){
                history.replaceState({ title: "我的小店" },"我的小店", "index.html")
                $(".dialog").hide();
            });
            $(".editGood").click(function(){
                history.replaceState({ title: "我的小店" },"我的小店", "index.html")
                location.href = "goodsEdit.html?goodsId="+me.goodsId;
            });
            setup.commonAjax_B(2,"store/getStoreInfo.do",{},function(msg){
                var goodsShareTpl = require("../../sideShop_C/index/shopShare.tpl");
                //$("#shopHead").attr("src",msg.storeLogo);
                $("#shopName").html(msg.storeName);
                if(msg.isCertification==0){
                    $.modal({
                        text: "根据国家相关法律法规、共同维护互联网交易环境，需实名认证审核后才能继续使用小店。请先填写重要信息。",
                        buttons: [{
                            text: "立即认证",
                            onClick: function(){
                                location.href="authentication.html";
                            }
                        },{
                            text: "跳过"
                        },]
                    });
                }
                msg.backPic = msg.backPic ? msg.backPic : "http://122.224.214.231:8001/group1/M00/00/97/wKgCRFoRc9-Aem0JAAF91j2dkSg051.jpg";
                box.render($(".goodsShare"),msg,goodsShareTpl);
                $(".qrcode").qrcode({
                    render: "canvas",
                    width: $(".qrcode").width(),
                    height: $(".qrcode").height(),
                    text: msg.htmlUrl
                });
                //$("#lookMyShop").attr("href",msg.htmlUrl);
            });
            setup.commonAjax_B(2,"store/getBusinessOrdersNum.do",{},function(msg){
                $("#todayValume").html(msg.todayValume);
                $("#todayOrders").html(msg.todayOrders);
                $("#unPays").html(msg.BunPays+msg.CunPays);
                $("#unShipping").html(msg.unShipping);
                $("#shipping").html(msg.shipping);
            });
			$(".myShop").removeClass("hide");
            $("body").delegate("#lookMyShop","click",function(){
                $(".goodsShare").show();
                if(!$(".doPic")[0]){
                    $.showLoading();
                }
                require("../../sideShop_C/common_c/html2canvas/index");
            });
             $("body").delegate(".goodsShare i","click",function(){
                 $(".goodsShare").hide();
            })
		},
	};
    app.init();
});


