{{#with this}}
	<div class="swiper-container">
	  <div class="swiper-wrapper">
	  	{{#each imgage.images}}
	    	<div class="swiper-slide"><img src="{{this}}"/></div>
    	{{/each}}
	  </div>
	  <div class="swiper-pagination"></div>
	</div>

	<p class="goodsPrice">
		<span>{{name}}</span>
		<i>¥{{priceTotal}}</i>
		<p class="stock">库存<b>{{totalCurrentNum}}</b></p>
	</p>
	<div class="shareQr">
		<img src="../imgs/c/shareQr.png"/>
		<span>分享码</span>
	</div>
{{/with}}