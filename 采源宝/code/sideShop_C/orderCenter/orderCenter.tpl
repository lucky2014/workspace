{{#each this}}
	<div class="main detailList getValueByAttr" data-param="originalPrice:{{totalPrice}},totalPrice:{{jisuan totalPrice transferFee}}">
		<!-- <div class="shoppingCar-title container-fixed">
			<span>店铺:</span>
			<span class="desc">我的个性小铺</span>
		</div> -->
		<div class="shoppingCar-content">
			{{#each goodsInfo}}
				<div class="shoppingCar-product myicon-checked-box">
					<div class="shoppingCar-product-content">
						<img src="{{coverUrl}}">
						<div class="product-content-box product-content">
							<h3 class="product-content-title">{{name}}</h3>
							<p class="desc-parent">
								<span class="desc">
									{{sizeAndColorChange sku.attributes}}
								</span>
							</p>
						</div>
						<div class="product-content-box product-right">
							<h3 class="product-content-title unitPrice">{{sku.sellPrice}}</h3>
							<span class="desc-fee desc">{{num}}</span>
						</div>
					</div>
				</div>
			{{/each}}
		</div>
		{{#if goodsInfo}}
			<div class="sendInfo">
				<div class="sendWay">
					<p class="desc lf">配送方式</p>
					<p class="rt">
						{{#if transferFee}}买家自费 <span class="feeSelf">{{transferFee}}</span>{{else}}商家 包邮
						{{/if}}
					</p>
				</div>
				<div class="leaveMessage">
					<textarea rows="3" placeholder="给卖家留言" data-param="remark" maxlength="100" class="leaveWords canGetValue"></textarea>
				</div>
			</div>
		{{/if}}
	</div>
{{/each}}