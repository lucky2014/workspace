define(function(require,exports,module){
	var data={
        "receiver": {
            "name": "Catherine",
            "phone": "135002331232",
            "address": "浙江省杭州市西湖区文一西路522号西溪科创园2幢1单元2楼"
        },
        "orderInfo": {
            "orderId": 1,
            "orderNo": "W9DCI77790980BNM",
            "status": 2,
            "totalPrice": 425,
            "transferFee": 25,
            "createTime": "2017-10-11 15:33:33",
            "payTime": "2017-10-11 15:35:12",
            "remark": "衣服要白色的",
            "goodsTotalPrice": 400
        },
        "goodsInfo": [
            {
                "goodsId": 1,
                "name": "秋款大衣",
                "cover": "../imgs/b/img1.jpg",
                "num": 2,
                "sku": {
                    "skuId": "sku1121ws44q",
                    "sellPrice": 200,
                    "attrs": [
                        {
                            "attrName": "颜色",
                            "attrValue": "白色"
                        },
                        {
                            "attrName": "尺码",
                            "attrValue": "XL"
                        }
                    ]
                }
            }
        ]
    }
    return data;
});
