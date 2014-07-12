{% if item.example %}
  <h3 class="item__sub-heading">Example</h3>

  {% for example in item.example %}
  <div class="highlight highlight-sassdoc-api-example">
    <pre class="item__example"><code class="language-{{ example.type }}">{{ example.code | escape | safe }}</code></pre>
  </div>
  {% endfor %}
{% endif %}