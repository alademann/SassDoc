<header role="banner" class="header wdesk-docs-header">
    <div class="container">
        <h1>{{ project_title }}{% if version %}<small> - {{ version }}{% endif %}</small></h1>
        {% if package.description %}
        <div class="header__description lead">
            {{ package.description | markdown }}
        </div>
        {% endif %}
    </div>
</header>
