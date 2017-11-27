define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    require("../../common/jquery.qrcode.min");

    var app = {
    	actualPrice: setup.getQueryString("actualPrice"),
    	num: setup.getQueryString("num"),
		init: function(){
			var me = this;
			$("#payment h1 span b").html(me.num);
			$("#payment h1 i em").html(me.actualPrice);
			$("#payment ul li").click(function(e){
				var _this = $(this);
				setup.commonAjax("store/getStoreInfo.do", "", function(msg){
					if(_this.hasClass("alipay")){
						var payUrl = msg.zfbQrUrl;
						if(payUrl){
							$(".payOut").show();
						}else{
							$.alert("商家未提供支付宝收款二维码，请联系商家付款！", "提示");
							return false;
						}
					}else{
						var payUrl = msg.wxQrUrl;
						if(payUrl){
							$(".payOut").show();
						}else{
							$.alert("商家未提供微信收款二维码，请联系商家付款！", "提示");
							return false;
						}
					}
					/*if(payUrl){
						$(".qrcode").qrcode({
						    render: "canvas",
						    width: 160,
						    height: 160,
						    text: payUrl
						});
						var canvas=$(".qrcode").find('canvas')[0];
						var image = me.convertCanvasToImage(canvas);*/
						$(".qrcode").html("<img src="+payUrl+">")
					/*}*/
	        	})
				$(document).on("click", function(){
				       $(".payOut").hide();
				       $(".qrcode").html("");
				});

				   e.stopPropagation();
			});
			$(".payInfor").on("click", function(e){
			    e.stopPropagation();
			});
        },
        convertCanvasToImage: function(canvas) {
        	var image = new Image();
        	image.src = canvas.toDataURL("image/png");
        	return image;
        }
    };
    app.init();
});
