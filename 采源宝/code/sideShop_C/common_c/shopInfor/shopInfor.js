define(function(require,exports,module){
    var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var commonFn = require("../commonFn");
    require("../shopInfor/shopInfor.css");
    require("../../../common/jquery.qrcode.min");

    var app = {
        "goodsId" : setup.getQueryString("goodsId"),
        init: function(){
            var me = this;
            me.getStoreInfo();

            $("body").delegate(".shareQr","click",function(){
                $(".goodsShare").show();
                if(!$(".doPic")[0]){
                    $.showLoading();
                }
                require("../html2canvas/index");
            });
            $("body").delegate(".goodsShare .tips i","click",function(){
                 $(".goodsShare").hide();
            })
        },
        //店铺信息
        getStoreInfo: function(){
            var me = this;
            var shopInforTpl =  require("../shopInfor/shopInfor.tpl"); 
            setup.commonAjax("store/getStoreInfo.do","", function(msg){
                $("#shopHome").show();
                box.render($(".shopInfor"),msg,shopInforTpl,function(){
                    /*$(".shopInfor dl dd").width(($(".shopInfor dl").width()-120)+"px");
                    $.each($(".home_shopGoods ul li"),function(i,v){
                        $(".shopInfor dl dd").width(($(".shopInfor dl").width()-120)+"px");
                    })*/
                });
                if(!!$(".home_banner")[0]){
                    //var msgJson = require("../../goodsDetail/json");
                    var bannerTpl =  require("../../index/banner.tpl");
                    var goodsShareTpl = require("../../index/shopShare.tpl");
                    var shopInforShareTpl = require("../../common_c/shopInfor/shopInforShare.tpl");
                    msg.backPic = msg.backPic ? msg.backPic : "http://122.224.214.231:8001/group1/M00/00/97/wKgCRFoRc9-Aem0JAAF91j2dkSg051.jpg";
                    $(".shopInfor .shareQr span").html("分享店铺码");
                    box.render($(".home_banner"),msg,bannerTpl,function(){
                        $("#word").css("left" , $(document).width());
                        setInterval(function(){
                            me.scrollText()
                        },20)
                    });
                    box.render($(".goodsShare"),msg,goodsShareTpl);
                    box.render($(".shopInfor"),"",shopInforShareTpl);
                    //goodsSelect.goodsSelect(msgJson);
                    $(".qrcode").qrcode({
                        render: "canvas",
                        width: $(".qrcode").width(),
                        height:  $(".qrcode").height(),
                        text: msg.htmlUrl
                    });
                    $("title").html(msg.storeName);
                    $(".navBar .indexIcon a").attr("href",msg.htmlUrl);
                }else if(!!$(".goodsDetail_header")[0]){
                    require("../../../common/swiper");
                    if(msg.contactPhoneSub){
                        $(".goodsDetail_nav .service a").attr("href","tel:"+msg.contactPhoneSub);
                    }
                    $(".goodsDetail_nav .myShop a").attr("href",msg.htmlUrl);
                    $(".shopInfor .gotoIndex").attr("href",msg.htmlUrl);
                    me.getProductDetail(function(){
                        var goodsMsg = {
                            "storeLogo" :msg.storeLogo,
                            "storeName": msg.storeName,
                            "goodsPrice":$(".topGood .goodsPrice i").html(),
                            "goodsTitle":$(".topGood .goodsPrice span").html(),
                            "goodsPic":$(".swiper-slide").eq(0).find("img").attr("src"),
                            "coverUrl":$(".topGood").attr("coverUrl")
                        };
                        var goodsShareTpl = require("../../goodsDetail/goodsShare.tpl");
                        $(".shopInfor .shareQr span").html("分享码");
                        box.render($(".goodsShare"),goodsMsg,goodsShareTpl);
                       /* var timestamp = Date.parse(new Date());
                        $(".goodsShareInner>img").attr("src",goodsMsg.coverUrl+"?"+timestamp)*/
                        //console.log(goodsMsg)
                        $(".qrcode").qrcode({
                            render: "canvas",
                            width: $(".qrcode").width(),
                            height: $(".qrcode").height(),
                            text: window.location.href
                        });
                    });
                    $(".goodsDetail_nav .service a").click(function(){
                        if(!$(this).attr("href")){
                            $.alert("商家暂未设置客服电话！", "提示");
                        }
                    })   
                }

               
            }); 
        },
        //商品详情
        getProductDetail: function(callBack){
            var swiperPicsTpl = require("../../goodsDetail/swiperPics.tpl");
            var detailInforTpl = require("../../goodsDetail/detailInfor.tpl")
            var msg = require("../../goodsDetail/json");
            
            setup.commonAjax("product/getProductInfo.do", {"id":app.goodsId}, function(msg){
                //console.log(JSON.stringify(msg,null,2));
                $("#goodsDetail").show();
               if(msg.origin_price && msg.max_price){
                    msg.priceLow = msg.origin_price;
                     msg.priceHig = msg.max_price;
                     if(msg.priceHig == msg.priceLow){
                        msg.priceTotal = Number(msg.priceLow).toFixed(2);
                     }else{
                        msg.priceTotal = Number(msg.priceLow).toFixed(2)+"~"+Number(msg.priceHig).toFixed(2);
                     }
               }else{
                    msg.priceTotal = Number(msg.origin_price).toFixed(2) || Number(msg.max_price).toFixed(2);
               }
               //console.log(msg)
                box.render($("#goodsDetail .topGood"),msg,swiperPicsTpl,function(){
                    $(".topGood").attr("coverUrl",msg.coverUrl);
                    if(msg.imgage.images.length>1){
                        $(".swiper-slide").height($(".swiper-slide").width());
                        $(".swiper-container").swiper({
                          loop: true,
                          autoplay: 3000,
                          autoplayDisableOnInteraction : false,
                          paginationType:"fraction"
                        });
                    }
                });
                box.render($(".detailInfor"),msg,detailInforTpl);
                 callBack&&callBack();
                commonFn.goodsSelect(msg);
                $(".canBuy").attr("id",msg.id)
                if(!msg.totalCurrentNum){
                    $(".goodsDetail_nav .ulRight .canBuy").hide();
                    $(".goodsDetail_nav .ulRight .cantBuy").html("已售罄").show();
                }else{
                    if(msg.status == 1){
                        $(".goodsDetail_nav .ulRight .canBuy").show();
                        $(".goodsDetail_nav .ulRight .cantBuy").hide();
                    }else if(msg.status == 2){
                        $(".goodsDetail_nav .ulRight .canBuy").hide();
                        $(".goodsDetail_nav .ulRight .cantBuy").show();
                    }else if(msg.status == 3 || msg.status == 4){
                        $(".goodsDetail_nav .ulRight .canBuy").hide();
                        $(".goodsDetail_nav .ulRight .cantBuy").html("已下架").show();
                    }
                }
            });
        },
        scrollText: function(){
            var resource = document.getElementById("word");  
            var left = parseInt(resource.getBoundingClientRect().left);//获取当前文字所在x轴位置，并转换为int类型  
            if(-left>$("#word").width()){
                left = $(document).width();
            }
            left--;  
            //if(x == rx)//判断到达最左目标后，标志设置为0 
            resource.style.left = left + "px";//设置对象的x轴位置    
        }
    };
    app.init();
});
