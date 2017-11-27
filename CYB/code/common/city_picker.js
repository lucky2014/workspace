define(function(require,exports,module){
  var $ = require("jquery");
  var getAreaCode = require("../common/getAreaCode");

	+function($){		
		$.fn.cityPicker = function(params) {
		  params = $.extend({}, defaults, params);
		  return this.each(function() {
        $(this).blur();
  			var self = this;
    
        var currentProvince = getAreaCode.provincesName[0];
        var currentCity = getAreaCode.initCitiesName[0];
        var currentDistrict = getAreaCode.initDistrictsName[0];
    
        var cols = [
          {
            displayValues: getAreaCode.provincesName,
            values: getAreaCode.provincesCode,
            cssClass: "col-province"
          },
          {
            displayValues: getAreaCode.initCitiesName,
            values: getAreaCode.initCitiesCode,
            cssClass: "col-city"
          }
        ];
    
        if(params.showDistrict) cols.push({
          values: getAreaCode.initDistrictsCode,
          displayValues: getAreaCode.initDistrictsName,
          cssClass: "col-district"
        });
    
        var config = {
          cssClass: "city-picker",
          rotateEffect: false,  //为了性能
          formatValue: function (p, values, displayValues) {
            return displayValues.join(' ');
          },
          onChange: function (picker, values, displayValues) {
            //console.log(JSON.stringify(picker.cols[0],null,2));
            var newProvince = picker.cols[0].displayValue;
            var newCity;
            if(newProvince !== currentProvince) { //如果省份不等于北京
              getAreaCode.init(picker.cols[0].value, function(msg){
                var newCities = msg.name;
                    newCity = newCities[0];
                var citysCode = msg.code;

                picker.cols[1].replaceValues( citysCode, newCities );
                
                //获取区域
                getAreaCode.init(citysCode[0], function(re){
                  picker.cols[2].replaceValues(re.code,re.name);


                  currentProvince = newProvince;
                  currentCity = newCity;
                  picker.updateValue();
                  return false; // 因为数据未更新完，所以这里不进行后序的值的处理


                })
              });
            } else {
              if(params.showDistrict) {
                newCity = picker.cols[1].displayValue;
                if(newCity !== currentCity) {
                  getAreaCode.init(picker.cols[1].value, function(re){
                    picker.cols[2].replaceValues(re.code,re.name);
                    currentCity = newCity;
                    picker.updateValue();
                    return false; // 因为数据未更新完，所以这里不进行后序的值的处理
                  });
                }
              }
            }
            //如果最后一列是空的，那么取倒数第二列
            var len = (values[values.length-1] ? values.length - 1 : values.length - 2)
            $(self).attr('data-code', values[len]);
            $(self).attr('data-codes', values.join(','));
            if (params.onChange) {
              params.onChange.call(self, picker, values, displayValues);
            }
          },
          cols: cols
        };


        if(!self) return;
        var p = $.extend({}, params, config);
        //计算value
        var val = $(self).val();
        if (!val) val = '北京 北京市 东城区';
        currentProvince = val.split(" ")[0];
        currentCity = val.split(" ")[1];
        currentDistrict= val.split(" ")[2];
        
        if(val) {
          var currentPCode,currentCCode,currentDCode;
          var tokens = val.split(' ');
          $.each(getAreaCode.provincesName,function(i,v){
            if (v === tokens[0]){
              currentPCode = getAreaCode.provincesCode[i];
            }
          });

          getAreaCode.init(currentPCode, function(msg){
            $.each(msg.name,function(i,v){
              if (v === tokens[1]){
                currentCCode = (msg.code)[i];
              }
            });
            p.cols[1].values = msg.code;
            p.cols[1].displayValues = msg.name;


            if (tokens[2]) {
              getAreaCode.init(currentCCode, function(re){
                $.each(re.name,function(i,v){
                  if (v === tokens[2]){
                    currentDCode = (re.code)[i];
                  }
                });
                p.cols[2].values = re.code;
                p.cols[2].displayValues = re.name;
                p.value = [currentPCode, currentCCode, currentDCode];
                $("#start").attr("data-codes", p.value);
                $(self).picker(p);
              });
            }else{
              p.value = [currentPCode, currentCCode];
              $("#start").attr("data-codes", p.value);
              $(self).picker(p);
            }
          });
        }else{
          $(this).picker(p);
        }
		  });
		};
	
		defaults = $.fn.cityPicker.prototype.defaults = {
		  showDistrict: true //是否显示地区选择
		};
	}($);
});