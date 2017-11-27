{{#each this}}
    <div class="shoppingCar-product myicon-checked-box" status="{{manageStatusChange status}}" data-id="{{id}}" style="height: 114px;">
        <div class="shoppingCar-product-content">
            <span class="imgSpan"><img src="{{coverUrl}}"></span>
            <div class="product-content-box product-content">
                <h3 class="product-content-title">{{name}}</h3>
                <p class="product-contain">
                    <span class="desc">销量 {{saleValume}}</span>
                    {{#if currentNum}}<span class="desc">库存 {{currentNum}}</span>{{/if}}
                </p>
                <p class="clearFix desc-parent">
                    <span>¥{{originPrice}}{{#if cost}}<i class="desc">／赚{{#profit originPrice cost}}{{/profit}}</i>{{/if}}</span>
                    <span class="edit_anchor">
                        <a class="infoEdit"></a>
                        <a class="update"></a>
                        <a class="editActive"></a>
                    </span>
                </p>
            </div>
            <div class="product-content-box product-right">
                <h3 class="product-content-title unitPrice">200.00</h3>
                <span class="desc-fee desc">0</span>
            </div>
        </div>
    </div>
{{/each}}