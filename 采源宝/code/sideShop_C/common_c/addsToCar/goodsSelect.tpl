{{#with this}}
	<div class="addHeader">
		<img src="{{pic}}"/>
		<ul>
			<li class="price">¥<em>{{priceTotal}}</em></li>
			<li class="stock">库存 <span>{{totalCurrentNum}}</span></li>
		</ul>
		<i><img src="../imgs/c/cut.png"/></i>
	</div>
	<div class="addSelect">
		{{#each newStu}}
			<div class="commonSelect">
				<h2 attrName="{{attrName}}">{{attrName}}</h2>
				<ul>
					<!-- <li class="selected">pu白色</li> -->
					{{#each attrVal}}
					<li val="{{this}}">{{this}}</li>
					{{/each}}
				</ul>
			</div>
		{{/each}}
	</div>
	<div class="numSelect">
		<span>购买数量</span>
		<ul>
			<li class="reduceNum">-</li>
			<li class="nowNum"><input type="number" value="1"></li>
			<li class="addNum">+</li>
		</ul>
	</div>
	<p class="addCarButton" goodsId="{{id}}" status="{{status}}" totalCurrentNum="{{totalCurrentNum}}">{{goodsStatus status totalCurrentNum}}</p>
{{/with}}