define(function(require,exports,module){
    var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var commonFn = require("../../common_c/commonFn");
    require("../../common_c/addsToCar/goodsSelect.css");
    var goodsId = setup.getQueryString("id");

    var app = {
        init: function(){
            var me = this;
            //点击加入购物车or立即下单
            $("body").delegate(".goodsDetail_nav .canBuy","click",function(){
                var _this = $(this);
                if(_this.attr("status") == 1 || !_this.attr("status")){
                    $(".addInner p.addCarButton").css("background","#1C1B20");
                    $(".addInner p.addCarButton").html("加入购物车").attr("status","1");
                }else{
                    $(".addInner p.addCarButton").css("background","#aa2327");
                    $(".addInner p.addCarButton").html("立即下单").attr("status","2");
                }
                
                $(".addShopping").show();
                $(".addInner").slideDown();
                
            });
            //隐藏商品选择模块
            $("body").delegate(".addInner .addHeader i,.addShopping","click",function(){
                $(".addInner").slideUp();
                $(".addShopping").hide();
            });
            
            me.commitOrder();
        },
        commitOrder: function(){
            var me = this;
            $("body").delegate(".addInner p.addCarButton","click",function(){
                var _this = $(this);
                var status = _this.attr("status");
                var isCommit = 1;
                var totalCurrentNum = _this.attr("totalCurrentNum");
                /*var skuInfos = [];*/
                if((status==1 || status==2)&& totalCurrentNum != 0){
                    $.each($(".addSelect .commonSelect"),function(i,v){
                        if(!$(v).attr("data-attrval")){
                            var valName = $(v).find("h2").html();
                            $.toast("请选择"+valName, "forbidden");
                            isCommit = 0;
                            return false; 
                        }
                    })
                    if(isCommit == 1){
                        var currentNum = $(".stock span").html();
                        var selNum = $(".nowNum input").val();

                        if(Number(selNum) > Number(currentNum)){
                            $.toast("数量超出范围", "forbidden");
                            isCommit = 0;
                            return false; 
                        }else{
                            var commitData = {
                                /*"skuInfos" : skuInfos,*/
                                /*"price" : $(".addHeader .price em").html(),*/
                                "goodsId" : $("p.addCarButton").attr("goodsId"),
                                "skuId" : _this.attr("skuId"),
                                "storeId" : $(".shopInfor dl").attr("storeId"),
                                "num" : $(".nowNum input").val()
                            };
                            if(status == 1 || !status){
                                var carData = commonFn.init(1,function(msg){
                                    //var newData = me.newDataFn(msg);
                                    //console.log(msg.data)
                                    var thCarNum = 0;
                                    var thCurentNum = Number($(".addHeader .stock span").html());
                                    $.each(msg.data,function(a,av){
                                        if(av.skuId == commitData.skuId){
                                            thCarNum = Number(av.num);
                                            return false;
                                        }
                                    })
                                    var carData = msg.data.length;
                                    if(thCurentNum < thCarNum + Number(commitData.num)){
                                        $.toast("库存不足(含购物车"+thCarNum+"件)", "forbidden");
                                    }else{
                                        setup.commonAjax("cart/saveProductToCart.do ", commitData, function(msg){
                                            $(".addInner").slideUp();
                                            $(".addShopping").hide();
                                            if(thCarNum == 0 || carData == 0){
                                                $(".shoppingCar a p").show();
                                                $("li.shoppingCar p").html(Number($("li.shoppingCar p").html())+1)
                                            }
                                            $.toast("添加成功");
                                        })
                                    }
                                });
                                
                            }else if(status == 2){
                                localStorage.setItem("fromDetailPreOrderData",JSON.stringify(commitData,null,2));
                                window.location.href = "orderCenter.html?fromGoodsDetail='1'";
                            }
                        }
                    }
                }
            });
        },
        newDataFn: function(msg){
            var newData = [];
            $.each(msg.data,function(i,v){
                var str = "";
                $.each(v.skuAttr,function(j,k){
                    if(str){
                        str = str+"，"+k.attrVal;
                    }else{
                        str+=k.attrVal;
                    }
                })
                newData.push({
                    "attribute":str,
                    "num":v.num
                })
                
            })
            return newData;
        }
    };
    return app;
});
