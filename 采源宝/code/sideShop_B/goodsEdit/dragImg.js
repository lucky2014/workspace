define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var animation = false;
    function startMove(obj,json,fnEnd){  
        var arr = [];
        var speedArr = [];
        var bStopArr = [];
        for(var attr in json){
        	var cur = (attr == 'opacity') ? Math.round(parseFloat(getStyle(obj,attr))*100) : parseInt(getStyle(obj,attr)); //对opacity 特殊处理 
        	arr[attr] = cur;
        	speedArr[attr] = 2;
        	bStopArr[attr] = true;
        }
        clearInterval(obj.timer);
        obj.timer = null;
        obj.timer = setInterval(function(){  
            var bStop = true;   // 假设所有的值都到了
            for( var attr in json ){    //遍历json属性  
                var cur = (attr == 'opacity') ? Math.round(parseFloat(getStyle(obj,attr))*100) : parseInt(getStyle(obj,attr)); //对opacity 特殊处理  
                speedArr[attr] += (json[attr] - cur)/5;   
                speedArr[attr] *= 0.65;
                arr[attr]+=speedArr[attr];
                if(Math.abs(speedArr[attr])<1 && Math.abs(arr[attr]-json[attr])<1){
                   animation = false;
				   obj.style[attr] = json[attr] + 'px';
				}else{
				   animation = true;
				   obj.style[attr] = arr[attr]+ 'px';
				   bStop = false;   //如果没有达到目标值，则bStop设为false;
				}   
            }
            if(bStop){  
                animation = false;
                clearInterval(obj.timer); 
                obj.timer = null; 
                if(fnEnd) fnEnd();   //执行回调函数  
            }
        },30);  
    }
    function getStyle(obj,name){  
        return obj.currentStyle ? obj.currentStyle[name] : window.getComputedStyle(obj,null)[name]; //浏览器兼容性处理，注意getComputedStyle为只读属性  
    }
    var app = {
		init: function(){
			this.updateImgs();
		},
		updateImgs:function(){
			var aPos=[];
			var height = $(".dragList").height();
			$(".dragList").height(height);
			for(var i = 0;i<$(".dragList li").length;i++){
				var offsetLeft = $(".dragList li").eq(i).offset().left-$(".dragList").parent().offset().left;
				var offsetTop = $(".dragList li").eq(i).offset().top-$(".dragList").parent().offset().top;
				var width = $(".dragList li img").eq(i).width();
				var height = $(".dragList li img").eq(i).height();
				aPos[i] = {
					"left":offsetLeft,
					"top":offsetTop,
					"width":width,
					"height":height
				}
			}
			for(var i=0; i<$(".dragList li").length; i++){
				$(".dragList li")[i].style.left=aPos[i].left+'px';
	            $(".dragList li")[i].style.top=aPos[i].top+'px';
	            $(".dragList li")[i].style.position='absolute';
	            $(".dragList li")[i].style.margin=0;
	            $(".dragList li")[i].style.width = aPos[i].width+"px";
	            $(".dragList li")[i].style.height = aPos[i].height+"px";
	            $(".dragList li")[i].style.zIndex = 1;
	        }
	        this.drag();
		},
		drag:function(){
			var me = this;
			var minZindex = 1;
			$(".dragList").delegate("li","touchstart",function(e){
				if(!animation){
					e = e.originalEvent.changedTouches[0];
					var self = this;
					var disX = e.clientX - $(this)[0].offsetLeft;
					var disY = e.clientY - $(this)[0].offsetTop;
					var oldLf = $(self)[0].offsetLeft;
					var oldTp = $(self)[0].offsetTop;
					minZindex++;
					$(self).css("z-index",minZindex);
					$(window).bind("touchmove",function(e){
						e = e.originalEvent.changedTouches[0];
						var x = e.clientX - disX;
						var y = e.clientY - disY;
						$(self).css("left",x+"px");
						$(self).css("top",y+"px");
					});
					$(window).bind("touchend",function(e){
						$(window).unbind("touchmove");
						$(window).unbind("touchend");
						if(me.checkBox(self)){
							var target = me.checkBox(self)[0];
							var newLf = $(target)[0].offsetLeft;
							var newTp = $(target)[0].offsetTop;
							startMove(self,{
								"left":newLf,
								"top":newTp
							});
							startMove(target,{
								"left":oldLf,
								"top":oldTp
							});
						}else{
							startMove(self,{
								"left":oldLf,
								"top":oldTp
							});
						}
					});
				}
				return false;
			})
		},
		check:function(oDiv,oDiv2){
			var t1 = oDiv.offsetTop;  
            var l1 = oDiv.offsetLeft;  
            var r1 = oDiv.offsetLeft + oDiv.offsetWidth;  
            var b1 = oDiv.offsetTop + oDiv.offsetHeight;  

            var t2 = oDiv2.offsetTop;  
            var l2 = oDiv2.offsetLeft;  
            var r2 = oDiv2.offsetLeft + oDiv2.offsetWidth;  
            var b2 = oDiv2.offsetTop + oDiv2.offsetHeight;  
            if(b1<t2 || l1>r2 || t1>b2 || r1<l2){// 表示没碰上  
            	return false;
            }else{  
                return true; 
            }  
		},
		checkBox:function(target){
			var minDistance = 9999;
			var targetCenterPointX = $(target).offset().left+$(target).width()/2;
			var targetCenterPointY = $(target).offset().top+$(target).height()/2;
			var ind = $(target).index();
			var checkList = [];
			var minTarget = null;
			for(var i=0; i<$(".dragList li").length; i++){
				if(i!=ind){
					if(this.check($(target)[0],$(".dragList li")[i])){
						var centerPointX = $(".dragList li").eq(i).offset().left+$(".dragList li").eq(i).width()/2;
						var centerPointY = $(".dragList li").eq(i).offset().top+$(".dragList li").eq(i).height()/2;
						var distance = Math.sqrt(Math.pow((targetCenterPointX-centerPointX),2)+Math.pow((targetCenterPointY-centerPointY),2));
						if(distance<minDistance){
							minDistance = distance;
							minTarget = $(".dragList li").eq(i);
						}
					}
				}
			}
			return minTarget;
		}
	};
    app.init();
});


