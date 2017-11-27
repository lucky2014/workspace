define(function(require,exports,module){
    var $ = require("jquery");
    var setup = require("setup");
    var Engine = require("engine");
    var dialog = require("../../common/dialog/dialog");
    var shoppingList = require("../../common/shoppingList");
    var box = Engine.init();
    require("../common_c/nav/nav");
    var scrollApp = require("../../common/scroll/index");
    var getStoreInfo = require("../common_c/getStoreInfo");
    var listStoreProductsTpl = require("../shoppingCar/index.tpl");
    if(getStoreInfo){
        var storeId = getStoreInfo.id;
    }else{
        var storeId = 1;
    }
    var app = {
        userId:storeId,
        deleteCartProduct:function(params){
            var me = this;
            setup.commonAjax("cart/deleteCartProduct.do",params,function(){
                scrollApp.init(".main","cart/listCartProducts.do",{storeId:me.userId},function(msg){
                    me.listCartProducts(msg);
                });
            });
        },
        updateCartProductsCount:function(params){
            setup.commonAjax("cart/updateCartProductsCount.do",params,function(){
                shoppingList.initCheckedChoose(".myicon-checked");
            });
            shoppingList.initCheckedChoose(".main .myicon-checked");
        },
        listCartProducts:function(msg){
            if(msg.data){
                if(msg.data.length>0){
                    $(".shoppingCar-bottom").show();
                    $(".shoppingCar>p").html(msg.data.length);
                    $("#shoppingCar>.shoppingCar-content>.main").html("");
                    box.render($("#shoppingCar>.shoppingCar-content>.main"),msg,listStoreProductsTpl);
                    $(".navBar .shoppingCar p").html(msg.data.length);
                }else{
                    $(".main>.shoppingCar-product").hide();
                    $(".noShop").show();
                    var noShop = '<div class="noShop" style="text-align: center;margin-top: 106px;">'+
                                    '<img src="../../imgs/c/noShop.png" style="width:108px;">'+
                                   ' <p style="color:#A2A2A2;margin-top: 14px;">购物车空空如也</p>'+
                                '</div>';
                    $("#shoppingCar>.shoppingCar-content>.main").html(noShop);
                    $(".shoppingCar-bottom").hide();
                    $(".navBar .shoppingCar p").html(msg.data.length).hide();
                }
            }else{
                var noShop = '<div class="noShop" style="text-align: center;margin-top: 106px;">'+
                                '<img src="../../imgs/c/noShop.png" style="width:108px;">'+
                               ' <p style="color:#A2A2A2;margin-top: 14px;">购物车空空如也</p>'+
                            '</div>';
                $("#shoppingCar>.shoppingCar-content>.main").html(noShop);
            }
            shoppingList.initCheckedChoose(".myicon-checked");
        },
        init: function(){
            var me = this;
            $(".shoppingCar-title .desc").html(getStoreInfo.storeName);
            $(".main").delegate(".myicon-checked-box","click",function(){
                if(!($(this).find(".myicon-checked").hasClass("checkAll")||$(this).find(".myicon-checked").hasClass("hasChecked"))){
                    $(this).find(".myicon-checked").toggleClass("active");
                }
                shoppingList.initCheckedChoose(".main .myicon-checked");
            });
            $(".shoppingCar-title").delegate(".editBox","click",function(){
                $(".shopFee").removeClass("add-active").removeClass("del-active");
                $(".productList").toggleClass("edit-active");
                shoppingList.initCheckedChoose(".main .myicon-checked");
            });
            $(".complete-bottom").click(function(){
                shoppingList.checkAll(".main .myicon-checked",".checkAll");
            });
            $(".edit-bottom").click(function(){
                shoppingList.checkAll(".main .myicon-checked",".hasChecked");
            });
            $(".main").delegate(".shopFee-span","click",function(){
                var shopFee = $(this).parent().find(".shopFee");
                var canAdd = $(this).hasClass("add")?true:false;
                var productList = $(this).parents(".myicon-checked-box");
                var shopFeeCur = shopFee.find(".shopFee-cur");
                var curValue = Number(shopFeeCur.html());
                var currentNum = shopFeeCur.attr("currentNum");
                var canChangeValue = curValue<currentNum?true:false;
                if(canAdd){
                    if(canChangeValue){
                        curValue++;
                    }else{
                        alert("不能添加更多了哦");
                        return false;
                    }
                    shopFeeCur.html(curValue);
                }else{
                    curValue<2?1:curValue--;
                    shopFeeCur.html(curValue);
                }
                var params = {
                    storeId:getStoreInfo.id,
                    goodsId:Number(productList.attr("goodsid")),
                    skuId:Number(productList.attr("skuId")),
                    num:Number(curValue)||1
                }
                me.updateCartProductsCount(params);
                return false;
            })
            $("#balance").click(function(){
                var data = shoppingList.initCheckedChoose(".main .myicon-checked");
                console.log(data);
                localStorage.setItem("preOrderData",JSON.stringify(data.ids));
                location.href = "orderCenter.html";
                return false;
            })
            $("#deleteChoose").click(function(){
                dialog.init({
                    "title":"温馨提示",
                    "content":"您是否确定要删除所选产品吗?"
                },function(){
                    var deleteParams = shoppingList.deleteChoose(".main .myicon-checked");
                    me.deleteCartProduct({storeId:getStoreInfo.id,cartIds:JSON.stringify(deleteParams.cart)});
                });
                return false;
            });
            $(".main").delegate(".delete","click",function(){
                var self = this;
                dialog.init({
                    "title":"温馨提示",
                    "content":"您是否确定要删除所选产品吗?"
                },function(){
                    var deleteParams = [$(self).parents(".shoppingCar-product").attr("data-id")];
                    me.deleteCartProduct({storeId:getStoreInfo.id,cartIds:JSON.stringify(deleteParams)});
                });
            });
            scrollApp.init(".main","cart/listCartProducts.do",{storeId:me.userId},function(msg){
                me.listCartProducts(msg);
            });
        },
    };
    app.init();
});