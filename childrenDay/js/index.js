var app = {
	init: function(){
		var me = this;
		
	},
	commafy: function(num){
		var reg = /(?=(?!\b)(\d{3})+$)/g; 
    	return String(num.replace(/\,/g,"")).replace(reg, ',');  
	}
};

app.init();

//
var h = $(window).height();
var w = $(window).width();
$("body,html").height(h);
$(".swiper-slide").height(h).width(w).css("overflow","hidden");
setTimeout(function(){
	$(".p1 .circle1,.p1 .circle2,.p1 .circle3,.p1 .hand").show();
},6000);
var swiper = new Swiper('.swiper-container', {
    pagination: '',
    direction: 'horizontal',
    slidesPerView: 1,
    paginationClickable: false,
    spaceBetween: 0,
    mousewheelControl: true,
    onSlideChangeEnd: function(swiper){
		var nowInd = swiper.activeIndex;
		//alert(nowInd);
		if(nowInd == 0){
			$(".p2 .textBox,.p4 .textBox,.p3 .textBox,.p2 .circle1,.p2 .circle2, .p2 .circle3,.p2 .hand").hide();
			setTimeout(function(){
				$(".p1 .circle1,.p1 .circle2,.p1 .circle3,.p1 .hand").show();
			},6000);

			$(".p1 .text1").addClass("fadeIn1");
			$(".p1 .text2").addClass("fadeIn2");
			$(".p1 .text3").addClass("fadeIn3");

			$(".p2 .text1").removeClass("fadeIn1");
			$(".p2 .text2").removeClass("fadeIn2");
			$(".p2 .text3").removeClass("fadeIn3");
		}else if(nowInd == 1){
			//所有文字隐藏
			$(".p1_textBox,.p2 .textBox,.p4 .textBox,.p3 .textBox,.p3 .circle1, .p3 .circle2, .p3 .circle3,.p3 .hand").hide();
			//所有背面隐藏，正面显示
			$(".p2_back").removeClass("back");
			$(".p2_front").removeClass("font");

			setTimeout(function(){
				$(".p2 .textBox").show();
			},100);
			setTimeout(function(){
				$(".p2 .circle1, .p2 .circle2, .p2 .circle3,.p2 .hand").show();
			},6000);

			$(".p1 .text1,.p3 .text1").removeClass("fadeIn1");
			$(".p1 .text2,.p3 .text2").removeClass("fadeIn2");
			$(".p1 .text3,.p3 .text3").removeClass("fadeIn3");

			$(".p2 .text1").addClass("fadeIn1");
			$(".p2 .text2").addClass("fadeIn2");
			$(".p2 .text3").addClass("fadeIn3");
		}else if(nowInd == 2){
			//所有文字隐藏
			$(".p1_textBox,.p2 .textBox,.p3 .textBox,.p4 .textBox,.p4 .circle1, .p4 .circle2, .p4 .circle3,.p4 .hand").hide();
			//所有背面隐藏，正面显示
			$(".p2_back").removeClass("back");
			$(".p2_front").removeClass("font");

			$(".p2 .text1").removeClass("fadeIn1");
			$(".p2 .text2").removeClass("fadeIn2");
			$(".p2 .text3").removeClass("fadeIn3");

			setTimeout(function(){
				$(".p3 .textBox").show();
			},100);
			setTimeout(function(){
				$(".p3 .circle1, .p3 .circle2, .pp3 .circle3,.p3 .hand").show();
			},6000);
			$(".p3 .text1").addClass("fadeIn1");
			$(".p3 .text2").addClass("fadeIn2");
			$(".p3 .text3").addClass("fadeIn3");

			$(".p2 .text1,.p4 .text1").removeClass("fadeIn1");
			$(".p2 .text2,.p4 .text2").removeClass("fadeIn2");
			$(".p2 .text3,.p4 .text3").removeClass("fadeIn3");
		}else if(nowInd == 3){
			//所有文字隐藏
			$(".p2 .textBox,.p4 .textBox,.p3 .textBox,.p5 .p5_textBox, .p5 .num,.p5 .circle1, .p5 .circle2, .p5 .circle3,.p5 .hand").hide();
			//所有背面隐藏，正面显示
			$(".p2_back").removeClass("back");
			$(".p2_front").removeClass("font");

			//第三页文字显示
			setTimeout(function(){
				$(".p4 .textBox").show();
			},100);
			setTimeout(function(){
				$(".p4 .circle1,.p4 .circle2,.p4 .circle3,.p4 .hand").show();
			},6000);
			$(".p4 .text1").addClass("fadeIn1");
			$(".p4 .text2").addClass("fadeIn2");
			$(".p4 .text3").addClass("fadeIn3");

			$(".p3 .text1,.p5 .text1").removeClass("fadeIn1");
			$(".p3 .text2,.p5 .text2").removeClass("fadeIn2");
			$(".p3 .text3,.p5 .text3").removeClass("fadeIn3");
			$(".p5 .text4").removeClass("fadeIn4");
			$(".p5 .text5").removeClass("fadeIn5");
			$(".p5 .num").removeClass("fadeIn6");
		}else if(nowInd == 4){
			//所有文字隐藏
			$(".p2 .textBox,.p4 .textBox,.p3 .textBox, .p5 .p5_textBox, .p5 .num").hide();

			$(".p4 .text1").removeClass("fadeIn1");
			$(".p4 .text2").removeClass("fadeIn2");
			$(".p4 .text3").removeClass("fadeIn3");

			//第五页文字显示
			setTimeout(function(){
				$(".p5 .p5_textBox").show();
			});
			setTimeout(function(){
				$(".p5 .num").show();
			},10000);
			$(".p5 img.text1").addClass("fadeIn1");
			$(".p5 img.text2").addClass("fadeIn2");
			$(".p5 img.text3").addClass("fadeIn3");
			$(".p5 img.text4").addClass("fadeIn4");
			$(".p5 img.text5").addClass("fadeIn5");
			$(".p5 num.text6").addClass("fadeIn6");
		}
    },
    nextButton:'.swiper-button-next', //下一页
});


$(".p2_front").click(function(){
	$(this).addClass("font").siblings(".p2_back").addClass("back");
});


//填写数值
$(".p5 input[name=num]").bind("input propertychange",function(){
	var val = $(this).val();
	val = app.commafy(val);
	$(this).val(val);
}); 




/*$("#audio1")[0].addEventListener("loadedmetadata",function(){
    this.play();
});*/
/*$(function(){

	$("#audio1")[0].play();

})*/
document.addEventListener("WeixinJSBridgeReady", function () {
    $("#audio1")[0].play();
}, false);
/*audioName.play();//解决iphone上不能自动播放问题*/
$(".musicPlay img").click(function(){ //暂停/播放背景音乐
	var audioName = document.getElementById("audio1");
	if(!audioName.paused){
		audioName.pause();
		$(this).removeClass("change");
	}else{
		audioName.play();
		$(this).addClass("change");
	}
})

//alert(w+ "----" + h);  //360/570,432/660,360/526
if(w/h>0.64 && w/h<0.65){
	$(".p1 .p1_textBox").css({"margin-top": "36px"});
    $(".cm_main .banner").css({"width": "80%"});
    $(".p5 .p5_textBox").css({"margin-top": "20px"});
    $(".p1 .hand").css({"right": "20%", "top":"78vh"});
    $(".circle1, .circle2, .circle3").css({"right": "10vw", "top": "55.6vh"});
    $(".p1 .circle1, .p1 .circle2, .p1  .circle3").css({"right": "29vw", "top": "76vh"});
    
    $(".cm_main .banner img.hand").css({"bottom":"-10px","right": "8px"});
    $(".resMask").css({"padding": "10% 10% 0"});
    $(".showResult .percent").css({"top": "47vh", "right": "22vw"});
    $(".showResult").css({"top":"5%"})
}
if(w/h>=0.65 && w/h<=0.66){
	$(".p1 .p1_textBox").css({"margin-top": "36px"});
    $(".cm_main .banner").css({"width": "80%"});
    $(".p5 .p5_textBox").css({"margin-top": "20px"});
    $(".p1 .hand").css({"right": "20%", "top":"78vh"});
    $(".circle1, .circle2, .circle3").css({"right": "10vw", "top": "55.6vh"});
    $(".p1 .circle1, .p1 .circle2, .p1  .circle3").css({"right": "29vw", "top": "76vh"});
    
    $(".cm_main .banner img.hand").css({"bottom":"-10px","right": "8px"});
    $(".resMask").css({"padding": "10% 10% 0"});
    $(".showResult .percent").css({"top": "47vh", "right": "22vw"});
    $(".showResult").css({"top":"5%"})
    $(".p5 .num img.btb").css({"top":"14.6em"});
    $(".p5 .num input").css({"margin-top":"25px"});
}
if(w/h>0.66){
	$(".p1 .p1_textBox").css({"margin-top": "36px"});
    $(".cm_main .banner").css({"width": "80%"});
    $(".p5 .p5_textBox").css({"margin-top": "20px"});
    $(".p1 .hand").css({"right": "20%", "top":"78vh"});
    $(".circle1, .circle2, .circle3").css({"right": "10vw", "top": "55.6vh"});
    $(".p1 .circle1, .p1 .circle2, .p1  .circle3").css({"right": "29vw", "top": "76vh"});
    
    $(".cm_main .banner img.hand").css({"bottom":"-10px","right": "8px"});
    $(".resMask").css({"padding": "10% 10% 0"});
    $(".showResult .percent").css({"top": "47vh", "right": "22vw"});
    $(".showResult").css({"top":"5%"})
}

function is_weixn(){  
    	var ua = navigator.userAgent.toLowerCase();  
        if(ua.match(/MicroMessenger/i)=="micromessenger") {  
             
        } else {   
             window.location.href="404.html";
        }  
} 
$(document).ready(function(){
  is_weixn()
})