{% if item.file.path %}
  <h3 class="item__sub-heading">Found at</h3>

  <p><a target="_blank" href="{{ package.homepage }}/blob/master/{{ item.file.path }}" onclick="ga('send', 'event', 'Sass Api', 'Found At', '{{ item.file.path }}')"><code>{{ item.file.path }}</code></a></p>
{% endif %}