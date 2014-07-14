<ul role="menu" class="nav wdesk-docs-sidenav wdesk-sassdocs-sidenav fade">
  {# No item documented #}
  {% if item_count == 0 %}
    <li>No documented item.</li>

  {# Some items documented #}
  {% else %}

    {# Loop over data #}
    {% for type, obj in data %}

      {# Group items from object by display type and only keep `true` #}
      {% set obj = (obj | groupby('display'))['true'] %}

      {# If there is at least one item to display, go #}
      {% if obj.length > 0 %}

        <li>
          <a class="hitarea" href="#{{ type }}">{{ (type + 's') | capitalize }}</a>

          <ul class="nav">
            {# Loop over items in current group #}
            {% for item in obj %}

              {# Display item #}
              <li>
                <a class="hitarea" href="#{{ item.context.type }}-{{ item.context.name }}">
                  {{ item.context.name }}
                  {% if item.access[0] == "private" %}<em class="sidebar__annotation  sidebar__annotation--private">private</em>{% endif %}
                  {% if item.alias != false %}<em class="sidebar__annotation  sidebar__annotation--alias">alias</em>{% endif %}
                </a>
              </li>

            {% endfor %}
          </ul>
        </li>

      {% endif %}

    {% endfor %}

  {% endif %}
</ul>