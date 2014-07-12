{% if item.returns %}
  <h3 class="item__sub-heading">Returns</h3>
  <div class="sassdoc__item-description">
    {% if item.returns[0].type == '*' %}
      <code>Any</code>
    {% else %}
      <code>{{ item.returns[0].type | split('|') | trim | capitalize | join(', ') }}</code>
    {% endif %}
    {% if item.returns[0].description %}{{ item.returns[0].description | markdown }}{% endif %}
  </div>
{% endif %}