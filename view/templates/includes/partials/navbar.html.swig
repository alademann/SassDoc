<div role="navigation" class="navbar navbar-fixed-top wdesk-docs-navbar">
    <div class="container">
        <ul class="nav navbar-nav mobile nav-blocks">
            <li>
                <button type="button" class="navbar-toggle hitarea no-text collapsed" data-toggle="collapse" data-target=".docs-nav-collapse">
                    <i class="icon icon-md icon-menu-list"></i>
                </button>
            </li>
        </ul>
        <div class="navbar-header navbar-brand">
            <a class="brand-link" href="../">
                <div role="img" class="brand-logo">
                    <span class="sr-only">Wdesk</span>
                    <!--[if lt IE 9]>
                        <img src="../assets/img/brand/wdesk-logo_white.png">
                    <![endif]-->
                </div>
                Web Skin
            </a>
        </div>
        <div class="docs-nav-collapse nav-collapse collapse">
            <ul class="nav navbar-nav">
                <li>
                    <a class="hitarea" href="../getting-started/">Getting Started</a>
                </li>
                <li>
                    <a class="hitarea" href="../css/">CSS</a>
                </li>
                <li>
                    <a class="hitarea" href="../components/">Components</a>
                </li>
                <li>
                    <a class="hitarea" href="../javascript/">JavaScript</a>
                </li>
                <li class="active">
                    <a class="hitarea" href="./">Sass API</a>
                </li>
            </ul>
        </div>

        <form class="sassdoc__searchbar searchbar dropdown">
            <fieldset class="searchbar__form" id="js-search">
                <label for="js-search-input" class="visually-hidden">Search</label>
                <input type="search" name="search" id="js-search-input"
                       placeholder="Search"
                       class="searchbar__field form-control"
                       autocomplete="off"
                       autofocus
                       aria-haspopup="true"
                       aria-expanded="true">
                <ul role="menu" id="js-search-suggestions" class="searchbar__suggestions dropdown-menu"></ul>
            </fieldset>
        </form>

        <ul class="nav navbar-nav nav-blocks docs-options-nav pull-right">
            <li>
                <button type="button" class="hitarea no-text"
                        title="Documentation Options"
                        data-toggle="options"
                        data-target="#docs-options"
                        disabled>
                    <i class="icon icon-md icon-cog"></i>
                </button>
            </li>
        </ul>
    </div>
</div>