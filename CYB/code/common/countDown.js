define(function(require,exports,module){
    var countdown = {
        init: function(times, succCb, errCb){
            var me = this;
            setInterval(function(){
                var now, end, times;
                //var strings = ($("#endTime").val()).replace(/\-/g,"/");
                end = new Date(times).getTime();
                now = new Date().getTime();
                Ttimes = (end - now)/1000;
                if(Ttimes>0){
                    me.timesChange(Ttimes, succCb)
                }else{
                    //$(".countdown .p1").html("");
                    //$("#timer").html("该活动已结束！").addClass("lh58");
                    errCb && errCb();
                }
                
            }, 1000);
        },
        timesChange: function(times, succCb){
            var me = this;
            var timerBox = $("#timer");
            var d = h = m = s = 0;
            if(times > 0){
                d = Math.floor((times / 86400)) > 0 ? zero(Math.floor((times / 86400))) : "00";

                times = (times - d*86400);
                h = Math.floor(times/3600) > 0 ? zero(Math.floor(times /3600)) : "00";

                times = (times - h*3600);
                m = Math.floor(times / 60) > 0 ? zero(Math.floor(times / 60)) : "00";
                
                times = (times - m*60);
                s = Math.floor(times) > 0 ? zero(Math.floor(times)) : "00";


                function zero(t){
                    return t>9 ? t : "0"+t;
                }
              
                var str_time = d+"<span class='timain'>天</span>"+h+"<span class='timain'>时</span>"+m+"<span class='timain'>分</span>"+s+"<span class='timain'>秒</span>";
                
                //timerBox.html(str_time);
                succCb && succCb;
            }
        }
    };
    

    
    //ios时间为 2009/09/09
    //使用countdown.init("2008-09-09",function(){}, function(){});
    return countdown.init;
});