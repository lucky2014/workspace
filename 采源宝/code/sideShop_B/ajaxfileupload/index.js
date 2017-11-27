define(function(require,exports,module){
	var $ = require("jquery");
    var setup = require("setup");
    //上传二维码
    require("ajaxfileupload");
    function ajaxFileUpload(obj, url){
        $.ajaxFileUpload({
            url: setup.url_B + "shop/" + url,
            type: 'post',
            secureuri: false, //一般设置为false
            async: true,
            fileElementId: obj, // 上传文件的id、name属性名
            dataType: 'json', //返回值类型，一般设置为json、application/json
            success: function(msg) {
                //console.log(JSON.stringify(msg,null,2));
                if (msg.resultCode == 1000) {
                    //成功要做的事
                    if($(".authentication").length==0){
                        history.go(0);
                    }else{
                        $.alert("上传成功！", "提示");
                    }
                }
            },
            error: function(msg){
                //console.log(msg);
            }
        });
    }
    $(".cardLogo").change(function(){
        ajaxFileUpload("AlipayQR", "store/uploadAlipayQR.do"); //activity/mainImgUpload.do  card/uploadLogo.do
    });
    //上传支付宝收款二维码
    $(".uploadLi").delegate("#zfbInput", "change", function() {
        var me = $(this);
        ajaxFileUpload("aliFile", "store/uploadAlipayQR.do"); //activity/mainImgUpload.do  card/uploadLogo.do
    });

    //上传微信收款二维码
    $(".uploadLi").delegate("#wxInput", "change", function() {
        var me = $(this);
        ajaxFileUpload("wxFile", "store/uploadWeChatQR.do"); //activity/mainImgUpload.do  card/uploadLogo.do
    });
    
});