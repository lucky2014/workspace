{{#each this}}
	<a href="goodsDetail.html?goodsId={{id}}&isPageC=1" id="{{id}}">
		<img src="{{coverUrl}}"/>
		<p>
			<span>{{name}}</span>
			<i>¥{{originPrice}}</i>
		</p>
	</a>
	<img src="../imgs/c/shopCar.png" class="addToCar"/>
{{/each}}