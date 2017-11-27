define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    var dialog = require("../../common/dialog/dialog");
    require("../../common/city_picker");

    var app = {
        h: $(window).height(),
        receiverId: setup.getQueryString("receiverId"),
        isAdd: setup.getQueryString("isAdd"),
        isDefault: setup.getQueryString("isDefault"),
        fromGoodsDetail: setup.getQueryString("fromGoodsDetail"),
        isFrom: setup.getQueryString("isFrom"),
		init: function(){
            var me = this;
			//FastClick.attach(document.body);
            //选择省市区
            $("#start").cityPicker({
                title: "选择省市区",
                onChange: function (picker, values, displayValues) {
                  //console.log(values, displayValues);
                }
            });

		    //删除联系人
		    $(document).on("click", "#show-actions-bg", function() {
		        $.actions({
		          actions: [
		            {
		              text: "删除联系人",
		              className: 'delCustomer bg-danger',
		            }
		          ]
		        });
		    });

            //固定取消、保存按钮
            $(".wrap").css("height", (me.h-50)+"px");    
            //判断是否是编辑状态
            if(app.isAdd){
                $("#show-actions-bg").hide();
            }else{
                $("#show-actions-bg").show();
                me.getReceiverInfo();
            }
        },
        checkSloganCount: function(self){
            var max = 60 || $('#count_max').text();
            var text = self.val();
            var len = text.length; 
            $('#count').text(len);    
            if(len >= 59){
                $('#count').text(60);  
                $('.weui-cell-warn').show();
                self.val(text.substring(0,60))
            }else{
                $('.weui-cell-warn').hide();
            }     
        },
        //编辑收件人信息
        updateReceiverInfo: function(){
            var me = this;
            app.checkValueIsNull(function(name,phone,address,postCode){
                var pcd = $("#start").val().split(" ");
                var pcdId = $("#start").attr("data-codes").split(",");
                var data = {
                    id: app.receiverId,
                    name: $("#name").val(),
                    phone: $("#phone").val(),
                    provinceName: pcd[0],
                    cityName: pcd[1],
                    districtName: pcd[2],
                    provinceId: pcdId[0],
                    cityId: pcdId[1],
                    districtId: pcdId[2],
                    address: $("#addressInfo").val(),
                    postCode: $("#postCode").val(),
                    isDefault: $("#switchCP").get(0).checked ? 1 : 0
                };

                setup.commonAjax("customer/updateReceiverInfo.do", data, function(msg){
                    if(me.fromGoodsDetail){
                        location.href = "addressIndex.html?fromGoodsDetail="+fromGoodsDetail+"&isFrom="+app.isFrom;;
                    }else{
                        location.href = "addressIndex.html"
                    }
                });
            })
        },
        //编辑状态下获取收件人信息
        getReceiverInfo: function(){
            var me = this;
            var data = {
                receiverId: app.receiverId
            };

            setup.commonAjax("customer/getReceiverInfo.do", data, function(msg){
                $("#name").val(msg.name);
                $("#phone").val(msg.phone);
                $("#start").val(msg.provinceName+" "+msg.cityName+" "+msg.districtName);
                $("#addressInfo").val(msg.address);
                $("#count").html(msg.address.length);
                $("#postCode").val(msg.postCode);
                if(!me.isDefault){
                    $("#switchCP").removeAttr("checked");
                }

            });
        },
        //添加收件人信息
        saveReceiverInfo: function(){
            var me = this;
            app.checkValueIsNull(function(name,phone,address,postCode){
                var pcd = $("#start").val().split(" ");
                var pcdId = $("#start").attr("data-codes").split(",");
                var data = {
                    name: name,
                    phone: phone,
                    provinceName: pcd[0],
                    cityName: pcd[1],
                    districtName: pcd[2],
                    provinceId: pcdId[0],
                    cityId: pcdId[1],
                    districtId: pcdId[2],
                    address: address,
                    postCode: postCode,
                    isDefault: $("#switchCP").get(0).checked ? 1 : 0
                };

                setup.commonAjax("customer/saveReceiverInfo.do", data, function(msg){
                    if(me.fromGoodsDetail){
                        location.href = "addressIndex.html?fromGoodsDetail="+me.fromGoodsDetail+"&isFrom="+app.isFrom;;
                    }else{
                        location.href = "addressIndex.html"
                    }
                });
            });
        },
        checkValueIsNull: function(cb){
            var name = $("#name").val();
            var phone = $("#phone").val();
            var address = $("#addressInfo").val();
            var postCode = $("#postCode").val();

            if(!name){
               $.alert("收件人姓名不能为空！", "提示");
               return ;
            }
            if(!phone){
               $.alert("手机号码不能为空！", "提示");
               return ;
            }else{
                if(phone.length != 11){
                    $.alert("手机号码必须为11位数字！", "提示");
                    return ;
                }else{
                    if(!/^1[34578]\d{9}$/.test(phone)){
                        $.alert("请输入正确的手机号码！", "提示");
                        return ;
                    }
                }
            }

            if(!address){
               $.alert("收件人详细地址不能为空！", "提示");
               return ;
            }
            cb && cb(name,phone,address,postCode);
        }
    };



    //验证邮编
    $("#postCode").blur(function(e){
    	var val = $(this).val();
        if(val){
            if(val.length != 6){
                $.alert("邮政编码必须为6位数字！", "提示");
                return ;
            }else{
                if(!/^[0-9]*$/.test(val)){
                    $.alert("请输入正确的邮政编码！", "提示");
                    return ;
                }
            }
        }
    	
    });

    //输入宣言时提示  
    $('#addressInfo').on('input', function(){
        app.checkSloganCount($(this));   
    });

    //验证手机号
    $("#phone").blur(function(e){
        var val = $(this).val();
        if(val.length != 11){
            $.alert("手机号码必须为11位数字！", "提示");
            return ;
        }else{
            if(!/^1[34578]\d{9}$/.test(val)){
                $.alert("请输入正确的手机号码！", "提示");
                return ;
            }
        }
    });

    //选择省市区时，判断键盘是不是收起
    $(function(){
        $('#start').click(function(){
            var h2 = $(window).height();
            if(h2 != app.h){
                $(".wrap input, .wrap textarea").blur();
            }
        });
    });

    //删除联系人
    $("body").delegate(".delCustomer", "click", function(){
        setup.commonAjax("customer/deleteReceiverInfo.do", {receiverId: app.receiverId}, function(msg){
            $.toast("操作成功", function() {
              //console.log('close');
              location.href = "addressIndex.html"
            });
            $(".weui-toast").css("left", "65%")
        });
    });

    //点击保存
    $(".buttons_buttom_ok").click(function(){
        if(app.isAdd){
            app.saveReceiverInfo();
        }else{
            app.updateReceiverInfo();
        }
    });
    //点击取消
    $(".buttons_buttom_cancel").click(function(){
        if(app.fromGoodsDetail){
            location.href = "addressIndex.html?fromGoodsDetail="+app.fromGoodsDetail+"&isFrom="+app.isFrom;
        }else{
            location.href = "addressIndex.html"
        }
    });

    app.init();
});
