define(function(require,exports,module){
	var $ = require("jquery");
    var setup = require("setup");
    var Engine = require("engine");
    var dialog = require("../common/dialog/dialog");
    var box = Engine.init();
    var app = {
        deleteChoose:function(currEle){
        	var targetArr = this.checkChoose(currEle);
        	var feeList = targetArr.feeList;
        	for(var i = 0;i<feeList.length;i++){
        		var target = $(feeList[i].target);
        		$(target).parents(".myicon-checked-box").remove();
        	}
            return targetArr;
        },
        checkAll:function(currEle,checkAllEle){
        	var me = this;
        	var bool = me.isChooseAll(currEle);
        	$(currEle).each(function(i,v){
        		if(bool){
        			$(v).removeClass("active");
	        		$(checkAllEle).removeClass("active");
	        	}else{
	        		$(v).addClass("active");
	        		$(checkAllEle).addClass("active");
	        	}
        	})
            me.initCheckedChoose(currEle);
        },
        isChooseAll:function(currEle){
        	var arr = [];
        	$(currEle).each(function(i,v){
        		if(!$(v).hasClass("active")){
        			arr.push(0);
        		}
        	})
        	return (arr.length==0)?true:false;
        },
        checkChoose:function(currEle){
        	var maxLen = 0;
        	var targetArr = {
                ind:0,
                maxLen:0,
                totalPrice:0,
                feeList:[
                    
                ],
                preOrderList:[],
                ids:[],
                cart:[]
            }               
        	$(currEle).each(function(i,target){
        		if(!($(target).hasClass("checkAll")||$(target).hasClass("hasChecked"))){
        			if($(target).hasClass("active")){
        				targetArr.ind++;
        				targetArr.maxLen = maxLen;
        				targetArr.feeList.push({
        					target:target,
        					unitPrice:Number($(target).parents(".myicon-checked-box").find(".unitPrice").html()),
        					amount:	Number($(target).parents(".myicon-checked-box").find(".shopFee-cur").html())
        				});
                        targetArr.preOrderList.push({
                            goodsid:Number($(target).parents(".myicon-checked-box").attr("goodsid")),
                            skuid:Number($(target).parents(".myicon-checked-box").attr("skuid")),
                            storeId:Number($(target).parents(".myicon-checked-box").attr("storeId"))||0,
                            cartId:Number($(target).parents(".myicon-checked-box").attr("data-id"))||0,
                        });
                        targetArr.cart.push(Number($(target).parents(".myicon-checked-box").attr("data-id")));
                        targetArr.ids.push(Number($(target).parents(".myicon-checked-box").attr("data-id")))
        			}
        			maxLen++;
        		}
        	});
        	return targetArr;
        },
        addCheckAll:function(){
            if(this.isChooseAll(".myicon-checked-box .myicon-checked")){
                $(".checkAll,.hasChecked").addClass("active");
            }else{
                $(".checkAll,.hasChecked").removeClass("active");
            }
        },
        initCheckedChoose:function(currEle){
        	var targetArr = this.checkChoose(currEle);
        	var feeList = targetArr.feeList;
        	var totalPrice = 0;
        	for(var i = 0;i<feeList.length;i++){
        		var unitPrice = feeList[i].unitPrice;
        		var amount = feeList[i].amount;
        		var target = feeList[i].target;
        		totalPrice+=amount*unitPrice;
        	}
            $(currEle).each(function(i,target){
                var amount = $(target).parents(".shoppingCar-product").find(".shopFee-cur").html();
                $(target).parents(".shoppingCar-product").find(".desc-fee").html(amount);
                $(target).parents(".shoppingCar-product").attr("num",amount);
            })
            targetArr.totalPrice = totalPrice.toFixed(2);
			$(".feeTotal").html(targetArr.totalPrice);
        	$(".choosed").html("已选("+targetArr.ind+")");
        	if(totalPrice<=0){
        		$("#balance").attr("disabled",true);
        	}else{
        		$("#balance,#deleteChoose").removeAttr("disabled");
        	}
        	if(targetArr.ind<=0){
        		$("#balance").val("结算");
        		$("#deleteChoose").attr("disabled",true);
        		$(".hasChecked").removeClass("active");
        	}else{
        		$("#deleteChoose").removeAttr("disabled");
        		$("#balance").val("结算("+targetArr.ind+")");
        		$(".hasChecked").addClass("active");
        	}
            this.addCheckAll();
            return targetArr;
        }
    };
    return app;
});
