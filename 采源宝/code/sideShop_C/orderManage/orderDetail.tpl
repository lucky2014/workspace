{{#with this}}
<div class="addressDiv mb10"><a>
	<div><span class="nameSpan">{{receiverName}}</span><span class="phoneSpan">{{receiverMoible}}</span></div>
	<p>{{receiverAddress}}</p>
	<i class="posIcon"><img src="../imgs/b/posIcon.png" width="100%" /></i>
</a></div>
<div class="goodsInfo">
	<div class="goodsList">
		{{#each orderDetails}}
		<a><dl>
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
		</dl></a>
		{{/each}}
	</div>
	<div class="priceDiv">
		<div class="priceDetail">
			<p>商品总金额<span>¥{{goodsPrice}}</span></p>
			<p>运费<span>¥{{transferFee}}</span></p>
		</div>
		<div class="priceTotal">
			<p>应付金额<span>¥{{totalPrice}}</span></p>
		</div>
	</div>
</div>
{{#if remark}}
<div class="buyerMessage" style="margin-bottom:10px;">给卖家留言：<p>{{remark}}</p></div>
{{/if}}
<div class="orderInfo">
	<p>订单编号：<span>{{orderNo}}</span></p>
	<p>下单时间：<span>{{createTimeNew}}</span></p>
	<p>付款时间：<span>{{payTimeNew}}</span></p>
</div>

{{#if btn1}}
<div class="payDiv">
	<p>合计：<span>¥{{totalPrice}}</span>（含运费）</p>
	<a href="../sideShop_C/orderPayment.html?actualPrice={{totalPrice}}&num={{goodsNum}}">去支付</a>
</div>
{{/if}}

{{/with}}