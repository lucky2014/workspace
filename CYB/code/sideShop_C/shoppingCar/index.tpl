{{#each data}}
    <div class="shoppingCar-product myicon-checked-box" status='{{carStatusChange storeGoodsInfoBase.status}}' data-id="{{id}}" userId="{{userId}}" goodsId="{{goodsId}}" skuId="{{skuId}}" num="{{num}}">
        <div class="shoppingCar-product-left">
            {{#carCanEdit storeGoodsInfoBase.status}}
                <span class="myicon-checked"></span>
                {{else}}
    　　　  {{/carCanEdit}}
        </div>
        <div class="shoppingCar-product-content">
            <div class="coverUrl">
                <img src="{{storeGoodsInfoBase.coverUrl}}">
            </div>
            <div class="product-content-box product-content">
                <h3 class="product-content-title">{{storeGoodsInfoBase.name}}</h3>
                <p class="unitPrice fee-parent">{{goodsSku.sellPrice}}</p><p class="desc zhanshi" style="font-size:12px;margin-top:6px;height:2.4rem;line-height: 1.2rem;overflow: hidden;
    display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;">{{#if skuAttr}}{{sizeAndColorChange skuAttr}}{{/if}}</p>
                
                <p class="desc-parent">
                    <span class="desc"><i class="feeSelf">{{goodsSku.sellPrice}}</i><i class="rt desc-fee">{{num}}</i></span>
                    <span class="shopFee-parent">
                        <input class="del shopFee-span" type="button" value="-" name="">
                        <span class="shopFee"><b class="shopFee-cur" currentnum="{{goodsSku.currentNum}}">{{num}}</b></span>
                        <input class="add shopFee-span" type="button" value="+" name="">
                    </span>
                </p>
                <input type="button" class="btn delete rt" value="刪除" name="">
            </div>
            
        </div>
    </div>
{{/each}}