{% if item.parameters.length > 0 %}
  <h3 class="item__sub-heading">Parameters</h3>

  <div class="table-responsive">
    <table class="table item__parameters">
      <caption class="sr-only">Lists the parameters for the {{ item.name }} {{ item.type }}</caption>
      <thead>
        <tr>
          <th scope="col"><span class="visually-hidden">{{ item.type }} parameter </span>Name</th>
          <th scope="col"><span class="visually-hidden">{{ item.type }} parameter </span>Type</th>
          <th scope="col"><span class="visually-hidden">{{ item.type }} parameter </span>Default value</th>
          <th scope="col"><span class="visually-hidden">{{ item.type }} parameter </span>Description</th>
        </tr>
      </thead>
      <tbody>
        {% for parameter in item.parameters %}
          <tr class="item__parameter">
            <th scope="row" data-label="name">
              <code class="language-scss">${{ parameter.name }}</code>
            </th>
            <td data-label="type">
              <code class="language-scss">
                {% if parameter.type == '*' %}
                  Any
                {% else %}
                  {{ parameter.type | split('|') | trim | capitalize | join(', ')}}
                {% endif %}
              </code>
            </td>
            <td data-label="default">
            {% if not parameter.default %}
              <i class="text-muted">&mdash;<i class="sr-only"> no default value</i></i>
            {% else %}
              <code class="language-scss">{{ parameter.default }}</code>
            {% endif %}
            </td>
            <td data-label="desc">
              {{ parameter.description | markdown | default('<i class="text-muted">&mdash;<i class="sr-only"> no default value</i></i>') | safe }}
            </td>
          </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>

{% endif %}
