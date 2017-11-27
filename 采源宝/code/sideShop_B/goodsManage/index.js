define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    var shoppingList = require("../../common/shoppingList.js");
    var listProductsTpl = require("../goodsManage/index.tpl");
    var listProductsAllTpl = require("../goodsManage/listProductsAll.tpl");
    var animation = true;
    function startMove(obj,json,fnEnd){  
        clearInterval(obj.timer);   //先清除之前的定时器 
        obj.timer = setInterval(function(){  
            var bStop = true;   // 假设所有的值都到了  
            for( var attr in json ){    //遍历json属性  
                var cur = (attr == 'opacity') ? Math.round(parseFloat(getStyle(obj,attr))*100) : parseInt(getStyle(obj,attr)); //对opacity 特殊处理  
                var speed = (json[attr] - cur)/6;  
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);    //speed 数字转化，防止不能到达目标的bug  
                if( cur != json[attr]){
                    bStop = false;   //如果没有达到目标值，则bStop设为false;  
                    animation = false;
                } 
                if(attr == 'opacity'){  
                    obj.style.filter = 'alpha(opacity='+ (cur + speed) +')';  
                    obj.style.opacity = (cur + speed)/100;  
                }else{  
                    obj.style[attr] = cur + speed + 'px';     
                }     
            }
            if(bStop){  
                animation = true;
                clearInterval(obj.timer);  
                if(fnEnd) fnEnd();   //执行回调函数  
            }  
        },30);  
    }
    function getStyle(obj,name){  
        return obj.currentStyle ? obj.currentStyle[name] : window.getComputedStyle(obj,null)[name]; //浏览器兼容性处理，注意getComputedStyle为只读属性  
    }
    $.fn.clkEvent = function(cb){
        $(this).click(function(e){
             e.stopPropagation();
             if(animation){
                try{
                    cb&&cb();
                }catch(err){

                }
             }
             return false;
        })
    };
    $.fn.authorizeClkEvent = function(authorize,cb){
        $(this).delegate(authorize,"click",function(e){
            e.stopPropagation();
            if(animation){
                try{
                    cb&&cb(this);
                }catch(err){

                }
            }
            return false;
        });
    };  
    var app = {
        loading:false,
        deleteAndOutStockProductParams:{
            ids:"",
            type:1,
        },
        getDeleteAndOutStockProductParams:function(currEle){
            var targetArr = shoppingList.checkChoose(currEle);
            var ids = targetArr.ids;
            this.deleteAndOutStockProductParams.ids = ids.join(",");
            return targetArr;
        },
        getDeleteAndOutStockProductSingleParams:function(id){
            var id = $(".edit_Pop").attr("data-id")||"";
            this.deleteAndOutStockProductParams.ids = id;
        },
        deleteAndOutStockBatchProduct:function(cb){
            var me = this;
            setup.commonAjax_B(1,"product/deleteAndOutStockProduct.do",this.deleteAndOutStockProductParams,function(msg){
                setup.commonAjax_B(1,"product/getProductsNum.do",{},function(msg){
                    $("#sortList li").eq(0).html("出售中（"+(msg.sellValume||0)+"）");
                    $("#sortList li").eq(1).html("已售罄（"+(msg.outStackValume||0)+"）");
                    $("#sortList li").eq(2).html("已下架（"+(msg.soldOutValume||0)+"）");
                });
                cb&&cb();
            });
        },
        listProductsParams:{
            status:1,
            name:"",
            pageSize:10,
            pageNum:1
        },
        totalPage:0,
        listProducts:function(type){
            var me = this;
            var msg = {"resultCode":1000,"returnObject":[{"coverUrl":"电脑封面","createTime":1510716729000,"currentNum":55,"endRow":0,"id":2,"intro":"电脑简介","name":"电脑","pageNum":0,"pageSize":10,"pages":0,"saleValume":5,"sellPrice":563.00,"startRow":0,"total":0},{"coverUrl":"https://cbu01.alicdn.com/img/ibank/2017/301/423/4558324103_1050330489.jpg","createTime":1510648731000,"currentNum":150,"endRow":0,"id":1,"intro":"简介","name":"【3433花样家居服混批 尺寸：5-17】","pageNum":0,"pageSize":10,"pages":0,"saleValume":8,"sellPrice":39.00,"startRow":0,"total":0}]};
            this.listProductsParams.status = type||1;
            this.listProductsParams.name = $.trim($("#searchInput").val());
            $(".edit_Pop").hide();
            setup.commonAjax_B(1,"product/getProductsNum.do",{},function(msg){
                $("#sortList li").eq(0).html("出售中（"+(msg.sellValume||0)+"）");
                $("#sortList li").eq(1).html("已售罄（"+(msg.outStackValume||0)+"）");
                $("#sortList li").eq(2).html("已下架（"+(msg.soldOutValume||0)+"）");
            });
            setup.commonAjax_B(1,"product/listProducts.do",this.listProductsParams,function(msg){
                if(msg){
                    app.totalPage = msg.page.pages;
                    box.render($("#shoppingList"),msg.data,listProductsTpl);
                    box.render($("#shoppingListAll"),msg.data,listProductsAllTpl);
                    shoppingList.initCheckedChoose(".myicon-checked-box .myicon-checked");
                }else{
                    $("#shoppingList,#shoppingListAll").html("<p style='width:100%;height:80px;line-height:80px;color:#ccc;text-align:center;'>暂无数据</p>");
                }
                $(".weui-loadmore").hide();
            });
            return false;
        },
        getTarget:function(target,ind){
            var index = ind||Number($(".edit_Pop").attr("targetIndex"))||0;
            return $(target).eq(index);
        },
        edit_PopAnimation:function(ind,endCb){
            var offsetTop = $(".shoppingCar-content>div").eq(ind).offset().top-$(".productList").offset().top+$(".productList")[0].scrollTop;
            startMove($(".edit_Pop")[0],{"top":offsetTop},function(){
                endCb&&endCb();
                var id = $(".shoppingCar-content>div").eq(ind).attr("data-id");
                $(".edit_Pop").attr("targetIndex",ind).attr("data-id",id);
            });
        },
        deleteProductFn:function(target){
            var me = this;
            var ind = $(target).index();
            if(ind>=$(".shoppingCar-product").length-1){
                ind = ind>1?ind-1:0;
                var id = $(".myicon-checked-box").eq(ind).attr("data-id");
            }else{
                var id = $(".myicon-checked-box").eq(ind-1).attr("data-id");
            }
            me.edit_PopAnimation(ind);
            $(target).remove();
            if($(".myicon-checked-box").length==0){
                $(".edit_Pop").fadeOut(300);
            }
        },
		init: function(){
            var me = this;
            me.listProducts();
            $(document.body).infinite().on("infinite", function() {
                if(app.totalPage){
                    if(app.listProductsParams.pageNum<app.totalPage){
                        app.listProductsParams.pageNum++;
                        $(".weui-loadmore").show();
                        app.listProducts(app.listProductsParams.status);
                    }
                }
            });
            $("#shoppingList,#shoppingListAll").authorizeClkEvent(".infoEdit",function(self){
                var listStatus = $(self).parents(".shoppingCar-product").attr("status");
                var offsetTop = $(self).parents(".shoppingCar-product").offset().top;
                var offsetHeight = $(self).parents(".shoppingCar-product")[0].offsetHeight;
                $(".edit_Pop").height(offsetHeight).fadeIn(300);
                me.edit_PopAnimation($(self).parents(".shoppingCar-product").index());
                $(".sectionList>div").eq(0).attr("list-status",listStatus);
            })
            $(".zhiding i").clkEvent(function(){
                $(".productList")[0].scrollTop = 0;
                $(".limited").removeClass("limited");
                var target = me.getTarget(".shoppingCar-product");
                var id = $(target).attr("data-id");
                setup.commonAjax_B(1,"product/updateProductTop.do",{id:id},function(msg){
                    $(".shoppingCar-content>div").eq(0).before("<div class='limited' data-id='"+id+"'></div>");
                    var ind = $(target).index();
                    var html = $(target).html();
                    var offsetHeight = $(target)[0].offsetHeight;
                    startMove($(".limited")[0],{"height":offsetHeight});
                    me.edit_PopAnimation(0,function(){
                        var listStatus = $(target).attr("status");
                        $(".limited").addClass("shoppingCar-product myicon-checked-box").attr("status",listStatus).append(html);
                        $(".sectionList>div").eq(0).attr("list-status",listStatus);
                    });
                    $(target).remove();
                });
            });
            $("#shoppingList,#shoppingListAll").authorizeClkEvent(".shoppingCar-product",function(self){
                var id = $(self).attr("data-id");
            });
            $(".xiajia").clkEvent(function(self){
                $(".edit_Pop").hide();
                me.deleteAndOutStockProductParams.type = 2;
                me.getDeleteAndOutStockProductSingleParams(".myicon-checked-box");
                var target = me.getTarget(".shoppingCar-product");
                me.deleteAndOutStockBatchProduct(function(){
                    me.deleteProductFn(target);
                })
            });
            $(".shangjia").clkEvent(function(self){
                $(".edit_Pop").hide();
                me.deleteAndOutStockProductParams.type = 3;
                me.getDeleteAndOutStockProductSingleParams(".myicon-checked-box");
                var target = me.getTarget(".shoppingCar-product");
                me.deleteAndOutStockBatchProduct(function(){
                    me.deleteProductFn(target);
                })
            });
            $(".shanchu i").clkEvent(function(){
                $(".edit_Pop").hide();
                me.deleteAndOutStockProductParams.type = 1;
                me.getDeleteAndOutStockProductSingleParams();
                var target = me.getTarget(".shoppingCar-product");
                me.deleteAndOutStockBatchProduct(function(){
                    me.deleteProductFn(target);
                })
            });
            $(".cutShare").click(function(){
                $(".edit_Pop").fadeOut(300);
            })
            $("#sortList li").click(function(){
                app.listProductsParams.pageNum = 1;
                app.totalPage = 1;
                $("#shoppingList,#shoppingListAll").html("");
                $(this).addClass("active").siblings().removeClass("active");
                var status = $(this).attr("status");
                var type = $(this).attr("type");
                $(".productList,footer").attr("status",status);
                me.listProducts(type);
            });
            $("#shoppingList,#shoppingListAll").authorizeClkEvent(".shoppingCar-product-left",function(self){
                if(!($(self).find(".myicon-checked").hasClass("checkAll")||$(self).find(".myicon-checked").hasClass("hasChecked"))){
                    $(self).find(".myicon-checked").toggleClass("active");
                    shoppingList.addCheckAll();
                }
            });
            $(".onshelf").click(function(){
                me.deleteAndOutStockProductParams.pageNum = 1;
                me.deleteAndOutStockProductParams.type = 3;
                var targetArr = me.getDeleteAndOutStockProductParams(".myicon-checked-box .myicon-checked");
                if(targetArr.feeList.length==0){
                    return;
                }
                me.deleteAndOutStockBatchProduct(function(){
                    $(".edit_Pop").hide();
                    for(var i = 0 ;i<targetArr.feeList.length;i++){
                        var target = $(targetArr.feeList[i].target).parents(".myicon-checked-box");
                        me.deleteProductFn(target);
                    }
                });
            });
            $(".unshelf").click(function(){
                me.deleteAndOutStockProductParams.pageNum = 1;
                me.deleteAndOutStockProductParams.type = 2;
                var targetArr = me.getDeleteAndOutStockProductParams(".myicon-checked-box .myicon-checked");
                if(targetArr.feeList.length==0){
                    return;
                }
                me.deleteAndOutStockBatchProduct(function(){
                    $(".edit_Pop").hide();
                    for(var i = 0 ;i<targetArr.feeList.length;i++){
                        var target = $(targetArr.feeList[i].target).parents(".myicon-checked-box");
                        me.deleteProductFn(target);
                    }
                });
            });
            $(".weui-icon-search").click(function(){
                me.listProductsParams.pageNum = 1;
                $("#shoppingList,#shoppingListAll").html("");
                me.listProducts(app.listProductsParams.status);
            });
            $(document).keydown(function (event) {
                if(event.keyCode==13){
                    me.listProductsParams.pageNum = 1;
                    $("#shoppingList,#shoppingListAll").html("");
                    me.listProducts(app.listProductsParams.status);
                    return false;
                }
            });
            $(".deleteBtn").click(function(){
                me.deleteAndOutStockProductParams.type = 1;
                var targetArr = me.getDeleteAndOutStockProductParams(".myicon-checked-box .myicon-checked");
                if(targetArr.feeList.length==0){
                    return;
                }
                 me.deleteAndOutStockBatchProduct(function(){
                    $(".edit_Pop").hide();
                    for(var i = 0 ;i<targetArr.feeList.length;i++){
                        var target = $(targetArr.feeList[i].target).parents(".myicon-checked-box");
                        me.deleteProductFn(target);
                    }
                });
            })
            $(".footer-bottom").eq(0).click(function(){
                shoppingList.checkAll(".section .myicon-checked",".checkAll");
            });
            $(".footer-bottom").eq(1).click(function(){
                location.href="goodsManage.html";
            });
            $("#shoppingList,#shoppingListAll").authorizeClkEvent(".editActive",function(self){
                var id = $(self).parents(".myicon-checked-box").attr("data-id");
                location.href = "goodsEdit.html?goodsId="+id;
            });
            $("#shoppingList,#shoppingListAll").authorizeClkEvent(".edit_anchor",function(self){
                return false;
            });
		},
	};
    app.init();
});