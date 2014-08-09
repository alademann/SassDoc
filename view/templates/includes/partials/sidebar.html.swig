<ul role="menu" class="nav wdesk-docs-sidenav wdesk-sassdocs-sidenav fade">
  {# No item documented #}
  {% if item_count == 0 %}
    <li class="sidebar__link">No documented item.</li>

  {# Some items documented #}
  {% else %}

    {# Loop over data #}
    {% for type, obj in data %}

      {# Group items from object by display type and only keep `true` #}
      {% set object = (obj | groupby('display'))['true'] %}

      {# If there is at least one item to display, go #}
      {% if object.length > 0 %}

        <li>
          <a class="hitarea" href="#{{ type }}">{{ (type + 's') | capitalize }}</a>

          <ul class="nav">
            {# Loop over items in current group #}
            {% for item in object %}

              {# Display item #}
              <li class="sidebar__item  js-sassdoc__item"  data-name="{{item.context.name}}" data-type="{{ item.context.type }}">
                <a class="sidebar__link hitarea" href="#{{ item.context.type }}-{{ item.context.name }}">
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
