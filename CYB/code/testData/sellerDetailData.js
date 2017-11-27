define(function(require,exports,module){
    var data={
        "orderDetail":{
            "orderNo":"123",
            "originalPrice":"100",
            "totalPrice":"80",
            "transferFee":"8",
            "status":"1",
            "createTime":"2017-10-11 15:33:33",
            "payTime":"2017-10-11 15:35:12",
            "payType":"1",
            "remark":"1"
        },
        "reveiver":{
            "name":"姓名",
            "address":"地址",
            "phone":"联系号码"
        },
        "products":[{
            "productInfo":{
                "id":"111",
                "name":"商品名称",
                "goodsPic":"a.jpg",
                "price":"100",
                "num":"1"
            },
            "skuInfos":[{
                "attrName":"1",
                "attrVal":"白色"
                },
                {
                "attrName":"2",
                "attrVal":"XL"
            }]
        }]
    }
    return data;
});

