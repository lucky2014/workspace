{{#with this}}
	<section class="editPics">
		<img src="{{pic}}"/>
		<span>{{name}}</span>
		<i class="moreIcon"></i>
	</section>

	<section class="editTitle">
		<h2>商品标题</h2>
		<textarea rows="2" maxlength="30">{{name}}</textarea>
		<span><i>{{titleLen}}</i>/30</span>
	</section>

	<!-- <section class="editClassify">
		<h2>商品分类</h2>
		<i class="moreIcon"></i>
	</section> -->

	<section class="editPicsText">
		<h2>图文详情</h2>
		<i class="moreIcon"></i>
	</section>

	<section class="editRules">
			<h2>商品规格</h2>
			<div class="colorSelect commonSelect">
				<!-- <h2>颜色</h2> -->
				<ul>
					{{#each thattrVal}}
						 <li price="{{price}}" retailPrice="{{retailPrice}}" currentNum="{{currentNum}}" sellPrice="{{sellPrice}}" type="{{type}}" value="{{value}}">{{attribute}}</li> 
						<!-- <li class="selected">pu白色</li> -->
					{{/each}} 
				</ul>
			</div>
			<div class="priceForms">
				
			</div>
		
	</section>
{{/with}}