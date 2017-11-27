{{#each this}}
<div class="temp_List" type="{{type}}">
	<dl>
	    <dt>{{typeName}}</dt>
	    {{#each childList}}
	    <dd><a templateId="{{id}}" href="ps_templateDetail.html?templateId={{id}}&cardId={{cardId}}"><img src="{{imageUrl}}" /><span>{{name}}</span></a></dd>
	    {{/each}}
	</dl>
</div>
{{/each}}
