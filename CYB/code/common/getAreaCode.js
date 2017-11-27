define(function(require,exports,module){
  var $ = require("jquery");
  var setup = require("setup");
  
  var app = {
    init: function(areaCode, cb){
      var param =  areaCode ? ({ areaCode: areaCode }) : "";
      setup.commonAjax("customer/getAreaCode.do", param, function(msg){
        var nameRet = msg.map(function (d) {
          return d.name;
        });
        var codeRet = msg.map(function (d) {
          return d.code;
        });

        //console.log(JSON.stringify(nameRet,null,2));

        cb && cb({
          name: nameRet,
          code: codeRet
        });
      });
    },
    provincesName: [
      "北京",
      "天津",
      "河北省",
      "山西省",
      "内蒙古自治区",
      "辽宁省",
      "吉林省",
      "黑龙江省",
      "上海",
      "江苏省",
      "浙江省",
      "安徽省",
      "福建省",
      "江西省",
      "山东省",
      "河南省",
      "湖北省",
      "湖南省",
      "广东省",
      "广西壮族自治区",
      "海南省",
      "重庆",
      "四川省",
      "贵州省",
      "云南省",
      "西藏自治区",
      "陕西省",
      "甘肃省",
      "青海省",
      "宁夏回族自治区",
      "新疆维吾尔自治区",
      "香港特别行政区",
      "澳门特别行政区"
    ],
    provincesCode:  [
      "110000",
      "120000",
      "130000",
      "140000",
      "150000",
      "210000",
      "220000",
      "230000",
      "310000",
      "320000",
      "330000",
      "340000",
      "350000",
      "360000",
      "370000",
      "410000",
      "420000",
      "430000",
      "440000",
      "450000",
      "460000",
      "500000",
      "510000",
      "520000",
      "530000",
      "540000",
      "610000",
      "620000",
      "630000",
      "640000",
      "650000",
      "710000",
      "820000"
    ],
    initCitiesName: [
      "北京市"
    ],
    initCitiesCode: [
      "110100"
    ],
    initDistrictsName: [
      "东城区",
      "西城区",
      "朝阳区",
      "丰台区",
      "石景山区",
      "海淀区",
      "门头沟区",
      "房山区",
      "通州区",
      "顺义区",
      "昌平区",
      "大兴区",
      "怀柔区",
      "平谷区",
      "密云县",
      "延庆县"
    ],
    initDistrictsCode: [
      "110101",
      "110102",
      "110105",
      "110106",
      "110107",
      "110108",
      "110109",
      "110111",
      "110112",
      "110113",
      "110114",
      "110115",
      "110116",
      "110117",
      "110228",
      "110229"
    ]
  };  
  

  //app.init("110100");
  module.exports = app;
});