// JavaScript Document
// create by zcy 2016/10/10
    
function runCircle(settings){
	var defaultSetting={ 
		url:'images/1.gif',   //飞机小图地址
		obj:'',                  //场景添加的canvas id 名
		percent:1,               //圆环转动的百分比  0-1 
		circleBottomColor:"#fff",//圆环底色
		innerColorStart:'#2698ff',  //内部圆环 渐变色
		innerColorMid: "#b1ff69",
		innerColorEnd:'#70faff'
	}; 
	var option=$.extend({},defaultSetting,settings); 

	var imageUrl= option.url;
	var obj=option.obj;
	var percent=option.percent;
	var innerColorStart=option.innerColorStart;
	var innerColorMid=option.innerColorMid;
	var innerColorEnd=option.innerColorEnd;
	var circleBottomColor=option.circleBottomColor;

	var preA=Math.PI/180;
	
	var canvasC=document.getElementById(obj);
	/*控制运动*/
	var context=canvasC.getContext('2d');
	var windowW= 210;
	var lineW1=5; //曲线
	var R1;
	var canvasW = canvasH = 182;
	R=parseInt(canvasW/2-2*lineW1-10); //内环半径
	R1=parseInt(canvasW/2-lineW1-10); //外环半径
	var rotateAngle=percent*360;
	var rotataRadians=preA*rotateAngle;
	canvasC.width = canvasW;
	canvasC.height = canvasH;

	var x=canvasC.width/2;
	var y=canvasC.height/2;
	var startAa=-Math.PI/2;
	var startA=0;
	var Timer;
	var preSceond=100/(Math.PI*2)
	
	function drawScreen(){
		if(startA<rotataRadians){
			startA+=0.1;
		}
		//
		var img=new Image()
		img.src=""
		context.drawImage(img,0,0);
		//
		context.save();
		context.translate(x,y);
		context.rotate(-Math.PI/2);
		
		// Linear gradients
		context.beginPath();
		var gradient2 = context.createLinearGradient(R1, 0,-R1,0);
		gradient2.addColorStop(0, innerColorStart);
		gradient2.addColorStop(0.5, innerColorMid);
		gradient2.addColorStop(1, innerColorEnd);
		context.lineCap="round";
		context.strokeStyle=gradient2;
		context.lineWidth=lineW1;
		context.arc(0,0,R1,0,startA,false);
		context.stroke();
		context.closePath();
		
		//内环
		context.beginPath();
		context.strokeStyle=circleBottomColor;
		context.lineWidth=1;
		context.arc(0,0,R,0,Math.PI*2,false);
		context.stroke();
		context.closePath();
		context.restore();
  
		//画图
		if(startAa<rotataRadians-Math.PI/2){
			startAa+=0.1;
		}else{
			clearInterval(Timer);
		}
		context.save();
	}
	drawScreen();
	Timer=setInterval(drawScreen,20);
}