define(function(require,exports,module){
    var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    //var goodsSelect = require("../common_c/addsToCar/goodsSelect");
    var goodsSelectTpl = require("../../sideShop_C/common_c/addsToCar/goodsSelect.tpl");

    var app = {
        init: function(isAddToCar,callBack){
            var me = this;
            var params = {
                "pageNum":1,
                "pageSize":1000
            }
            setup.commonAjax("cart/listCartProducts.do", params, function(msg){
                if(isAddToCar){
                    callBack && callBack(msg);
                }else{
                    var data = msg.data.length;
                    if(data == 0){
                        $(".shoppingCar p").hide();
                    }else{
                        $(".shoppingCar p").show();
                        $(".shoppingCar p").html(data);
                    }
                } 
            }) 
        },
        addsToCar: function(){
            var me = this;
            $(".home_shopGoods img.addToCar").click(function(){
                var _this = $(this);
                var thId = _this.siblings("a").attr("id");
                setup.commonAjax("product/getProductInfo.do", {"id":thId}, function(msg){
                    /*if(msg.origin_price && msg.max_price){
                         msg.priceLow = msg.origin_price;
                          msg.priceHig = msg.max_price;
                          if(msg.priceHig == msg.priceLow){
                             msg.priceTotal = Number(msg.priceLow).toFixed(2);
                          }else{
                             msg.priceTotal = Number(msg.priceLow).toFixed(2)+"~"+Number(msg.priceHig).toFixed(2);
                          }
                    }else{
                         msg.priceTotal = Number(msg.origin_price).toFixed(2) || Number(msg.max_price).toFixed(2);
                    }*/
                    
                    msg.priceTotal = _this.siblings("a").find("p i").html().substr(1);
                    //console.log(msg.priceTotal)
                    me.goodsSelect(msg);

                    $(".addInner p.addCarButton").css("background","#1C1B20");
                    $(".addInner p.addCarButton").attr("goodsId",thId);
                    $(".addShopping").show();
                    $(".addInner").slideDown();
                })
                         
            });
        },
        goodsSelect: function(msg){
            var me = this;
            var changeMsg = {};

            $.each(msg.skuInfos,function(i,v){
                $.each(v.attributes,function(j,k){
                    changeMsg[k.attrName] = {};
                })
            });
            $.each(msg.skuInfos,function(m,n){
                $.each(n.attributes,function(p,q){
                    changeMsg[q.attrName][q.attrVal] = q.attrVal;
                })
            });

            var arr = [];
            $.each(changeMsg,function(key,val){
                var newArr = [];
                $.each(val,function(a,attrVal){
                    newArr.push(attrVal)
                });
                arr.push({"attrName":key,"attrVal":newArr})
            })
            //console.log(msg)
            msg.newStu = arr;
            msg.pic = msg.imgage.images[0];
            box.render($(".addInner"),msg,goodsSelectTpl,function(){
                if(msg.status !=1 || msg.totalCurrentNum == 0){
                    $(".addCarButton").addClass("cantBuy");
                }
                //选择商品数量
                var nowNumClass = $(".numSelect ul li.nowNum input");
                $("body").delegate(".numSelect ul li.addNum","click",function(){
                    var nowNum = nowNumClass.val();
                    var currentNum = $(".addHeader .stock span").html();
                    if(nowNum != currentNum){
                        nowNum++;
                        nowNumClass.val(nowNum);
                    }
                    else{
                        $.toast("数量超出范围", "forbidden");
                    }
                });
                $("body").delegate(".numSelect ul li.reduceNum","click",function(){
                    var nowNum = nowNumClass.val();
                    if(nowNum>1){
                        nowNum--;
                        nowNumClass.val(nowNum);
                    }else{
                        $.toast("数量超出范围", "forbidden");
                    }
                });
                //输入商品数量
                nowNumClass.blur(function(){
                    var currentNum = $(".addHeader .stock span").html();
                    if(!nowNumClass.val() || nowNumClass.val() <= 0 || nowNumClass.val()>currentNum){
                        $.toast("数量超出范围", "forbidden");
                        nowNumClass.val("1");
                    }
                });
                me.calcuPriceFn(msg);
            },1);
            
        
        },
        calcuPriceFn: function(msg){
            var me = this;
            //获取对应属性的价格
                var thattrVal = [];
                $.each(msg.skuInfos,function(i,v){
                    var str = "";
                    $.each(v.attributes,function(j,k){
                        if(str){
                            str = str+";"+k.attrVal;
                        }else{
                            str += k.attrVal;
                        }
                        
                    })
                    thattrVal.push({
                        "attribute":str,
                        "price":v.cost,
                        "retailPrice":msg.retailPrice||"无",
                        "currentNum":v.currentNum,
                        "value":Number(v.sellPrice)-Number(v.cost),
                        //"type":v.type,
                        "sellPrice":v.sellPrice,
                        "imgUrL":(msg.skuInfos[i].attributes)[0].imgUrl,
                        "skuId":v.id
                    })
                    
                })
                var thisAttr = "";
                $.each($(".commonSelect ul"),function(i,v){
                    thisAttr +=$(".commonSelect ul").eq(i).attr("data-attrval");
                })
                $.each(thattrVal,function(a,result){
                    if(result.attribute == thisAttr){
                        $(".addHeader .price em").html(result.sellPrice);
                        $(".addHeader .stock span").html(result.currentNum);
                        $(".addHeader>img").attr("src",result.imgUrL);
                    }
                })
                me.cantSelectedBtn(thattrVal,msg)

        },
        cantSelectedBtn: function(thattrVal,msg){
            $('.commonSelect ul li').click(function () {
                //alert(currentNum+","+nowNum)
                //console.log($(this))
                if ($(this).hasClass('b')) {
                    return;//被锁定了
                }
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    $(this).parents(".commonSelect").removeAttr("data-attrval")
                    $(".addHeader .stock span").html(msg.totalCurrentNum);
                }else {
                    $(this).siblings().removeClass('selected');
                    $(this).addClass('selected');
                    $(this).parents(".commonSelect").attr("data-attrval",$(this).html());
                }
                var select_ids = _getSelAttrId();

                //已经选择了的规格
                var $_sel_goods_attr = $('.commonSelect ul li.selected').parents('.commonSelect');

                // step 1
                var all_ids = filterAttrs(select_ids);
                //比较选择的规格个数是否和键值个数是否一样
                if ($('.commonSelect ul li.selected').length == all_ids.length) {
                    //根据键值查询数据对应信息,并赋值
                    $.each(thattrVal, function (idx, obj) {
                        sel_sku_key = all_ids.join(';');
                        if (obj['attribute'] == sel_sku_key) {
                            $('.addHeader .price em').text(Number(obj['sellPrice']).toFixed(2));
                            $('.addHeader .stock span').text(obj['currentNum']);
                            $('.addHeader>img').attr("src",obj['imgUrL']);
                            $('.addCarButton').attr("skuId",obj['skuId']);
                           /* $('#sku_id').val(obj['id']);*/
                        }
                    });
                } else {
                   /* $('#sku_id').val('');*/
                }

                //获取未选择的
                var $other_notsel_attr = $('.commonSelect').not($_sel_goods_attr);

                //设置为选择属性中的不可选节点
                $other_notsel_attr.each(function () {
                    set_block($(this), all_ids);


                });

                //step 2
                //设置已选节点的同级节点是否可选
                $_sel_goods_attr.each(function () {
                    update_2($(this));
                });


            });
            //获取所有包含指定节点的路线
            function filterProduct(ids) {
                var result = [];
                $(thattrVal).each(function (k, v) {
                    _attr = ';' + v['attribute'] + ';';
                    _all_ids_in = true;
                    for (k in ids) {
                        if (_attr.indexOf(';' + ids[k] + ';') == -1) {
                            _all_ids_in = false;
                            break;
                        }
                    }
                    if (_all_ids_in) {
                        result.push(v);
                    }

                });
                return result;
            }

            //获取 经过已选节点 所有线路上的全部节点
            // 根据已经选择得属性值，得到余下还能选择的属性值
            function filterAttrs(ids) {
                var products = filterProduct(ids);
                //console.log(products);
                var result = [];
                $(products).each(function (k, v) {
                    result = result.concat(v['attribute'].split(';'));

                });
                return result;
            }


            //已选择的节点数组
            function _getSelAttrId() {
                var list = [];
                $('.commonSelect ul li.selected').each(function () {
                    list.push($(this).attr('val'));
                });
                return list;
            }
            function update_2($goods_attr) {
                // 若该属性值 $li 是未选中状态的话，设置同级的其他属性是否可选
                var select_ids = _getSelAttrId();
                var $li = $goods_attr.find('ul li.selected');

                var select_ids2 = del_array_val(select_ids, $li.attr('val'));

                var all_ids = filterAttrs(select_ids2);

                set_block($goods_attr, all_ids);
            }

            function set_block($goods_attr, all_ids) {
                //根据 $goods_attr下的所有节点是否在可选节点中（all_ids） 来设置可选状态
                $goods_attr.find('ul li').each(function (k2, li2) {
                    if ($.inArray($(li2).attr('val'), all_ids) == -1) {
                        $(li2).addClass('b');
                    } else {
                        $(li2).removeClass('b');
                    }
                });

            }
            function del_array_val(arr, val) {
                //去除 数组 arr中的 val ，返回一个新数组
                var a = [];
                for (k in arr) {
                    if (arr[k] != val) {
                        a.push(arr[k]);
                    }
                }
                return a;
            }
        },
    };
    return app;
});
