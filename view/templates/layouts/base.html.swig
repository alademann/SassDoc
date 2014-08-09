<!doctype html>

{% set project_title = package.title ? package.title : (package.name | capitalize) %}
{% set project_title = project_title | default('SassDoc') %}

{# Count how many items will be displayed #}
{% set item_count = 0 %}

{# To avoid repeating the same condition over and over again,
 # do it once and add a `display` key to items
 #}
{% for group, object in data %}
  {% for item in object %}
    {% if (display.access.indexOf(item.access[0]) != -1) and not (not display.alias and item.alias[0]) %}
      {% set item_count = item_count + 1 %}
      {% set item['display'] = true %}
    {% else %}
      {% set item['display'] = false %}
    {% endif %}
  {% endfor %}
{% endfor %}

<html lang="en">
<head>
  {# Include head content #}
  {% include "../includes/partials/head.html.swig" with project_title %}
</head>
<body class="wdesk-docs-body page-api">

  {# Include top navbar #}
  {% include "../includes/partials/navbar.html.swig" with project_title %}

  {# Include header #}
  {% include "../includes/partials/header.html.swig" with project_title %}

  {# Wrapper #}
  <div class="container wdesk-docs-container sassdoc-container">

    {# Sidebar #}
    <aside role="nav" class="sidebar col-md-3 wdesk-docs-sidebar">
      {% block sidebar %}{% endblock %}
    </aside>

    {# Main container #}
    <article role="main" class="col-md-9 wdesk-docs-main wdesk-sassdoc-main">
      {% block content %}{% endblock %}
    </article>

  </div>

  {# Include footer #}
  {% include "../includes/partials/footer.html.swig" with project_title %}

  {# Include scripts #}
  {% include "../includes/partials/scripts.html.swig" %}
</body>
</html>
