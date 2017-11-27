{{#with this}}
	<ul class="rulesDetails">
		<li class="cost"><b>成本</b><span>{{price}}</span></li>
		<li class="price"><b>建议零售价</b><span>{{retailPrice}}</span></li>
		<li class="repertory"><b>库存{{currentNum}}件</b><span>利润 <i>{{value}}</i></span></li>
		<li class="confirmPrice"><b>确认售价</b><input type="number" pattern="[0-9]*" value="{{sellPrice}}"></li>
	</ul>
	<ul class="modifyBtn">
		<li>批量修改利润</li>
		<li>保存修改</li>
	</ul>
	<div id="popUp">
		<div class="pop">
			<ul class="mode">
				<li type="1" class="active">按利润比例</li>
				<li type="2" >按利润值</li>
			</ul>
			<p class="ratio inp">
				<input type="number"><span>%</span>
			</p>
			<p class="valueNum inp">
				<input type="number"><span>元</span>
			</p>
			<ul class="insureBtn">
				<li type="1">确定</li>
				<li>取消</li>
			</ul>
		</div>
	</div>
{{/with}}