{{#with this}}	
	<section class="editTitle">
		<h2>商品描述</h2>
		<textarea rows="4">{{detailInfo}}</textarea>
	</section>
	<section class="editTitle picsEdit">
		<h2>商品图片
			<!-- <span class="desc">（长按图片进行拖动排序）</span> -->
		</h2>
		<div class="imgList dragList">
			<ul class="clearFix">
				{{#each imgage.images}}
					<li>
						<img src="{{this}}">
					</li>
				{{/each}}
			</ul>
		</div>
	</section>
{{/with}}