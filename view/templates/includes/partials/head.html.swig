<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,
                               initial-scale=1.0,
                               maximum-scale=1.0,
                               target-densityDpi=device-dpi">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<title>{{ project_title }}{% if package.version %} - {{ package.version }}{% endif %}</title>

<!--
    STYLES
-->
<!--[if !IE]> -->
<link href="../assets/css/wdesk.min.css?{{ package.version }}" rel="stylesheet" title="standard">
<link href="../assets/css/wdesk_ie.min.css?{{ package.version }}" rel="alternate stylesheet" title="ie">
<!-- <![endif]-->
<!--[if gte IE 9]>
<link href="../assets/css/wdesk_ie.min.css?{{ package.version }}" rel="stylesheet">
<![endif]-->
<!--[if lte IE 8]>
<link href="../assets/css/wdesk_ie-lt9.min.css?{{ package.version }}" rel="stylesheet">
<![endif]-->
<link href="../assets/css/docs.css?{{ package.version }}" rel="stylesheet">
<link href="assets/css/sassdoc-docs.css?{{ package.version }}" rel="stylesheet">


<!--
    SCRIPTS
-->
<script src="../assets/js/core/wf-js-vendor/dist/wf-vendor.min.js?{{ package.version }}"></script>
<!--[if lte IE 9]>
<script src="../assets/js/core/libs_ie.min.js?{{ package.version }}"></script>
<![endif]-->
<!--[if !IE]> -->
<script src="../assets/js/core/libs.min.js?{{ package.version }}"></script>
<!-- <![endif]-->
<script>
    var toTitleCase = function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    // custom pageview so we can track landing pages where folks are permalinking # locations within a page
    var hash = location.hash.replace('#', ''); // remove #
    var hashTitle = hash.replace(/-/g, ' '); // replace dashes with spaces

    var fullLocation = location.pathname + location.search + hash;
    var gaPage = fullLocation.replace('/index.html', '/'); // remove potential index.html
    var fullLocation = window.location.protocol + '//' + window.location.hostname + gaPage; // set location


    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-17703918-45', 'webfilings.com');

    // custom parameters
    if(hash.length) {
        ga('set', 'title', toTitleCase(hashTitle) + ' · ' + document.title);
    } else {
        ga('set', 'title', document.title);
    }
    ga('set', 'location', fullLocation);
    //

    ga('send', 'pageview');
</script>


<!--
    IMAGE LINKS
    (FAVICONS / APP ICONS / SPLASH SCREENS, ETC)
-->

<!--
    Google TV
-->
<link rel="icon" type="image/png" href="../assets/ico/favicon-196x196.png{{ package.version }}" sizes="196x196">

<!--
    Modern Browser Bookmark "Favicons"
-->
<link rel="icon" type="image/png" href="../assets/ico/favicon-160x160.png{{ package.version }}" sizes="160x160">
<link rel="icon" type="image/png" href="../assets/ico/favicon-96x96.png{{ package.version }}" sizes="96x96">
<link rel="icon" type="image/png" href="../assets/ico/favicon-16x16.png{{ package.version }}" sizes="16x16">
<link rel="icon" type="image/png" href="../assets/ico/favicon-32x32.png{{ package.version }}" sizes="32x32">

<!--
    Standard Browser Bookmark "Favicon"
-->
<link rel="shortcut icon" type="image/x-icon" href="../assets/ico/favicon.ico?{{ package.version }}">

<!--
    App Icons (Android / iOS)
-->
<!-- For iPad w/ high-resolution Retina display on iOS ≥ 7: -->
<link rel="apple-touch-icon" sizes="152x152" href="../assets/ico/apple-touch-icon-152.png?{{ package.version }}">
<!-- For iPad w/ high-resolution Retina display on iOS ≤ 6: -->
<link rel="apple-touch-icon" sizes="144x144" href="../assets/ico/apple-touch-icon-144.png?{{ package.version }}">
<!-- For iPhone w/ high-resolution Retina display on iOS ≥ 7: -->
<link rel="apple-touch-icon" sizes="120x120" href="../assets/ico/apple-touch-icon-120.png?{{ package.version }}">
<!-- For iPhone w/ high-resolution Retina display on iOS ≤ 6: -->
<link rel="apple-touch-icon" sizes="114x114" href="../assets/ico/apple-touch-icon-114.png?{{ package.version }}">
<!-- For the iPad mini & the first/second-generation iPad on iOS ≥ 7: -->
<link rel="apple-touch-icon" sizes="76x76"   href="../assets/ico/apple-touch-icon-76.png?{{ package.version }}">
<!-- For the iPad mini & the first/second-generation iPad on iOS ≤ 6: -->
<link rel="apple-touch-icon" sizes="72x72"   href="../assets/ico/apple-touch-icon-72.png?{{ package.version }}">
<!-- For non-Retina iPhone, iPod Touch, & Android 2.1+ devices: -->
<link rel="apple-touch-icon" href="../assets/ico/apple-touch-icon-57.png?{{ package.version }}">

<!--
    Win8 tiles
-->
<meta name="msapplication-TileImage" content="../assets/ico/mstile-144x144.png?{{ package.version }}">
<meta name="msapplication-TileColor" content="#66CC00">
<meta name="application-name"        content="{{ project_title }}">

<!--
    IE11 tiles
-->
<meta name="msapplication-square70x70logo"   content="../assets/ico/mstile-70x70.png?{{ package.version }}">
<meta name="msapplication-square150x150logo" content="../assets/ico/mstile-150x150.png?{{ package.version }}">
<meta name="msapplication-square310x310logo" content="../assets/ico/mstile-310x310.png?{{ package.version }}">
<meta name="msapplication-wide310x150logo"   content="../assets/ico/mstile-310x150.png?{{ package.version }}">
