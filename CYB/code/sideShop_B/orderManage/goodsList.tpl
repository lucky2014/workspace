{{#each this}}
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