<dl>
    {{#if isShow}}
    <dt class="weui-media-box weui-media-box_appmsg" receiverId="{{defaultData.id}}">
        <a href="addressEdit.html?receiverId={{defaultData.id}}&isDefault=1" style="float:right; padding-top:10px;">
        <div class="weui-media-box__hd">
            <img src="../imgs/c/edit.png" class="edit">
        </div>
        </a>
        <div class="weui-media-box__hd fl">
            <h4 class="weui-media-box__title">{{defaultData.name}}</h4>
            <i>默认</i>
        </div>
        <div class="weui-media-box__bd adMore">
            <h4 class="weui-media-box__title">{{defaultData.phone}}</h4>
            <p class="weui-media-box__desc">{{defaultData.provinceName}}{{defaultData.cityName}}{{defaultData.districtName}}{{defaultData.address}}</p>
        </div>
    </dt>
    {{/if}}
    {{#each datas}}
    <dd class="weui-media-box weui-media-box_appmsg" receiverId="{{id}}">
        <a href="addressEdit.html?receiverId={{id}}" style="float:right; padding-top:10px;">
        <div class="weui-media-box__hd">
            <img src="../imgs/c/edit.png" class="edit">
        </div>
        </a>
        <div class="weui-media-box__hd fl">
            <h4 class="weui-media-box__title">{{name}}</h4>
        </div>
        <div class="weui-media-box__bd adMore">
            <h4 class="weui-media-box__title">{{phone}}</h4>
            <p class="weui-media-box__desc">{{provinceName}}{{cityName}}{{districtName}}{{address}}</p>
        </div>
    </dd>
    {{/each}}
</dl>