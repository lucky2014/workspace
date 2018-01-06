const app = getApp()

var CryptoJS = require('aes.js');
var CusBase64 = require('base64.min.js');
var md5 = require('jquery.md5.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
var imgUrl = "https://ep.diantimes.cn/edd_file/service.do";
var url = "https://ep.diantimes.cn/edd_content/service.do";
var url2 = "https://ep.diantimes.cn/edd_basis/service.do";
var url3 = "https://ep.diantimes.cn/edd_user/service.do"
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function getAjax(theData,type){
  var data = {
    timeStamp: new Date().getTime(),
  };
  for (var p in theData) {
    var name = p; //属性名称
    var value = theData[p]; //属性对应的值
    data[name] = theData[p];
  }
  if(type == 1){
    var key = "dd_wap@hzlq#2017";
  }else{
    var key = app.globalData.key;
  }
  var obj = {
    userId : app.globalData.userId,
    fromSource : 3,
    osType : 6,
    version : "1.0.1",
    versionCode : 10001,
    data : encrypt(JSON.stringify(data),key),
    timeStamp : data.timeStamp,
    hashCode : md5.hexMD5(data.timeStamp+"dd_2017@hzlq"),
  }
  return obj
}
function encrypt(word,aesKey) {
  var key = CryptoJS.enc.Utf8.parse(aesKey);
  var iv   = CryptoJS.enc.Latin1.parse("hzlq-dd-aes@2017");
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {iv:iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
  return encrypted.toString();
}
//多张图片上传
function uploadimg(data,theData,cb){
  var i = 0;
  var arr = [];
  function add(){
    wx.uploadFile({
      url: imgUrl, 
      filePath: data[i].img,
      name: 'file',//这里根据自己的实际情况改
      formData:theData,
      success: (res) => {
        var msg = JSON.parse(res.data)
        if(msg.resultCode == 1000){
          arr.push({
            fileUrl : "https://ep.diantimes.cn/group1"+msg.returnObject.fileUrl.split("group1")[1],
            height : msg.returnObject.height,
            width : msg.returnObject.width,
            index : data[i].index,
          });
        }
      },
      fail: (res) => {

      },
      complete: (res) => {
        i++; 
        if(i==data.length){   //当图片传完时，停止调用     
          cb&&cb(arr);
        }else{//若图片还没有传完，则继续调用函数
            add()
        } 
      }
    });
  }
  add();
}
function singleUp(src,cb){
  var data = {};
  var theData = {cmd:"uploadFile",value:JSON.stringify(getAjax(data))};
  wx.uploadFile({
    url: imgUrl, 
    filePath: src,
    name: 'file',//这里根据自己的实际情况改
    formData:theData,
    success: (res) => {
      var msg = JSON.parse(res.data)
      if(msg.resultCode == 1000){
        cb&&cb("https://ep.diantimes.cn/group1"+msg.returnObject.fileUrl.split("group1")[1])
      }
    }
  })
}
function formatDateFn(t, long) { //时间格式化
    var _this = this;
    t = new Date(t);
    var year = t.getFullYear();
    var month = formatNumFn(t.getMonth() + 1);
    var date = formatNumFn(t.getDate());
    var hour = formatNumFn(t.getHours());
    var minute = formatNumFn(t.getMinutes());
    var second = formatNumFn(t.getSeconds());
    if (long == 'long') {
      return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
    } else {
      return year + "-" + month + "-" + date;
    }
}
function formatNumFn(n) {
  return (n > 9) ? n : "0" + n;
}
module.exports = {
  formatTime: formatTime,
  getAjax : getAjax,
  imgUrl : imgUrl,
  uploadimg : uploadimg,
  url : url,
  url2 : url2,
  url3 : url3,
  singleUp : singleUp,
  formatDateFn : formatDateFn,
}
