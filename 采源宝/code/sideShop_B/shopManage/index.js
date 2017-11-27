define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    require("ajaxfileupload");
    require("../ajaxfileupload/index");
    require("../shopManage/index.css");
    var shopBgImg=[
        {
            html:"默认一",
            src:"http://122.224.214.231:8001/group1/M00/00/97/wKgCRFoRc9-Aem0JAAF91j2dkSg051.jpg",
            type:1
        },
        {
            html:"默认二",
            src:"http://122.224.214.231:8001/group1/M00/00/97/wKgCRFoRc_KAA_UUAAGYGunOe20066.jpg",
            type:2
        },
        {
            html:"默认三",
            src:"http://122.224.214.231:8001/group1/M00/00/97/wKgCRFoRc_yASl2FAAELpPiDdGI192.jpg",
            type:3
        },
    ]
    var app = {
		init: function(){
            setup.commonAjax_B(2,"store/getStoreInfo.do",{},function(msg){
                //$("#shopHead").attr("src",msg.store_logo);
                $("#shopName").val(msg.storeName);
                var shopBgData=shopBgImg[0];
                for(var i=1;i<shopBgImg.length;i++){
                    if(shopBgImg[i].src==msg.backPic){
                        shopBgData = shopBgImg[i];
                    }
                }
                $("#shopBg").html(shopBgData.html).attr("imgType",shopBgData.type);
                if(msg.shortIntro){
                    $("#shopSummary").html("已设置");
                }else{
                    $("#shopSummary").html("未设置");
                }
                if(msg.contactPhone){
                    $("#sellerPhone").val(msg.contactPhone);
                }
                if(msg.contactPhoneSub){
                    $("#servicePhone").val(msg.contactPhoneSub);
                }
                $("#goodsRose").val(msg.incrPersent);
                if(msg.isCertification==0){
                    $("#InfoAuther").attr("isCertification",msg.isCertification).html("未认证").css("color","#A2A2A2");
                }else{
                    $("#InfoAuther").attr("isCertification",msg.isCertification).html("已认证").css("color","#BEA474");
                }
                if(!msg.zfbQrUrl){
                    $("#alipaySet").html("未设置");
                }else{
                    $("#alipaySet").html("已设置");
                }
                if(!msg.wxQrUrl){
                    $("#wechatSet").html("未设置");
                }else{
                    $("#wechatSet").html("已设置");
                }
            });
            $(".shopManage").removeClass("hide");
			$(".inputLi").click(function(){
                $(this).find("input").focus();
            });
            $(".linkLi").click(function(){
                if($(this).attr("type")=="shopBackground"){
                    location.href = "shopEdit.html?editTpl="+$(this).attr("type")+"&imgType="+$("#shopBg").attr("imgType");
                }else if($(this).attr("type")=="InfoAuthentication"){
                    location.href = "shopEdit.html?editTpl="+$(this).attr("type")+"&isCertification="+$("#InfoAuther").attr("isCertification");
                }else{
                    location.href = "shopEdit.html?editTpl="+$(this).attr("type");
                }
            });
            $("#shopName").blur(function(){
                if($(this).val()!=""){
                    var data={
                        storeName:$(this).val()
                    }
                    setup.commonAjax_B(2,"store/updateStoreInfo.do",data,function(){})
                }
            });
            $("#sellerPhone").blur(function(){
                var val = $(this).val();
                if(val.length != 11&&val.length != ""){
                    $.alert("手机号码必须为11位数字！", "提示");
                    return ;
                }else{
                    if(val.length != ""&&!/^1[34578]\d{9}$/.test(val)){
                        $.alert("请输入正确的手机号码！", "提示");
                        return ;
                    }else{
                        var data={
                            phone:$(this).val(),
                            type:1
                        }
                        setup.commonAjax_B(2,"store/updateStorePhone.do",data,function(){})
                    }
                }
            });
            $("#servicePhone").blur(function(){
                var val = $(this).val();
                if(val.length != 11&&val.length != ""){
                    $.alert("手机号码必须为11位数字！", "提示");
                    return ;
                }else{
                    if(val.length != ""&&!/^1[34578]\d{9}$/.test(val)){
                        $.alert("请输入正确的手机号码！", "提示");
                        return ;
                    }else{
                        var data={
                            phone:$(this).val(),
                            type:2
                        }
                        setup.commonAjax_B(2,"store/updateStorePhone.do",data,function(){})
                    }
                }
            });
            $("#goodsRose").blur(function(){
                if($(this).val()!=""&&$(this).val()>=0&&$(this).val()<=500){
                    var data={
                        value:$(this).val(),
                        type:1
                    }
                    setup.commonAjax_B(2,"store/updateStoreProductsIncrease.do",data,function(){})
                }else{
                    $.alert("统一商品涨幅必须为0-500之间的数值", "提示");
                }
            });
		},
	};
    app.init();
});
