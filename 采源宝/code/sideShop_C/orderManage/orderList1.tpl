{{#each data}}
<li orderId={{id}}>
	<div class="statusDiv">订单号：<span class="orderNo">{{orderNo}}</span><span class="statusSpan" style="color:{{statusColor}};">{{orderStatusHtml status 2}}</span></div>
	<div class="goodsList">
		<a href="orderDetail.html?orderId={{id}}">
		{{#each orderDetails}}
			<dl>
				<dt><img src="{{goodsPic}}" /></dt>
				<dd>
					<div class="titleDiv">
						<p class="goodsName">{{goodsName}}</p>
						<span class="specSpan">
							{{skuDesc}}
						</span>
					</div>
					<div class="bottomDiv">
						<span class="priceSpan">¥{{perPrice}}</span>
						<span class="numberSpan">x {{num}}</span>
					</div>
				</dd>
			</dl>
		{{/each}}
		</a>
	</div>
	<div class="priceDiv">共<span class="totalNumber">{{goodsNum}}</span>件，买家实付（含运费<span class="freight">{{transferFee}}</span>）：<span class="totalPrice">¥{{totalPrice}}</span></div>
	<div class="buttonDiv">
		{{#if btn3}}<a class="orderBtn2 confirmBtn ml10">{{btn3}}</a>
		{{/if}}
		{{#if btn2}}<a class="orderBtn2 ml10" href="../sideShop_C/orderPayment.html?actualPrice={{totalPrice}}&num={{goodsNum}}">{{btn2}}</a>
		{{/if}}
		{{#if btn1}}
		<a class="orderBtn1">{{btn1}}</a>
		{{/if}}
	</div>
</li>
{{/each}}