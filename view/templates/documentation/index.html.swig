{% extends '../layouts/base.html.swig' %}

{# Include sidebar #}
{% block sidebar %}
  {% include "../includes/partials/sidebar.html.swig" %}
{% endblock %}


{% block content %}

  {# No item documented #}
  {% if item_count == 0 %}
    <section id="sass-api-empty-section" class="main__section wdesk-docs-section wdesk-sassdoc-section">
      <div class="page-header">
        <h1 id="sass-api-empty" class="main__heading">Seems like nothing has been documented yet!</h1>
      </div>
    </section>

  {# Some items documented #}
  {% else %}

    {# Loop over data #}
    {% for type, obj in data %}

      {# Group items from object by display type and only keep `true` #}
      {% set object = (obj | groupby('display'))['true'] %}

      {# If there is at least one item to display, go #}
      {% if object.length > 0 %}
        <section class="main__section wdesk-docs-section wdesk-sassdoc-section">
          <div class="page-header">
            <h1 id="{{ type }}" class="main__heading">{{ (type + 's') | capitalize }}</h1>
          </div>

          {# Loop over items in current group #}
          {% for item in object %}

            {# Display item #}
            {% set partial = "../includes/items/" + type + ".html.swig" %}

            <section id="{{ item.context.type }}-{{ item.context.name }}-section" class="wdesk-docs-section wdesk-sassdoc-section main__item  item{% if item.alias %}  item--alias{% endif %}{% if item.deprecated %}  item--deprecated{% endif %}">
              {% include partial with { item: item, display: display } %}
            </section>

          {% endfor %}
        </section>

      {% endif %}

    {% endfor %}

  {% endif %}

{% endblock %}
