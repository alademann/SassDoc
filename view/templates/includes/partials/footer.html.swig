<footer class="wdesk-docs-footer" role="contentinfo">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <p>The {{ project_title }} Style Guide was hand made with love by <a href="https://github.com/aaronlademann-wf" target="_blank" onclick="ga('send', 'event', 'Footer Actions', 'Web Skin Team', 'Aaron Lademann')">Aaron Lademann</a> and the <a href="{{ package.homepage }}/graphs/contributors" target="_blank" onclick="ga('send', 'event', 'Footer Actions', '{{ project_title }} Team', '{{ project_title }} Team')">{{ project_title }} Team</a>.</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <ul class="footer-links">
                    <li>Currently <a href="{{ package.homepage }}/releases/tag/{{ package.version }}" target="_blank" onclick="ga('send', 'event', 'Footer Actions', 'Version link', 'Version {{ package.version }}')">v{{ package.version }}</a></li>
                    <li class="text-muted">&middot;</li>
                    <li><a href="{{ package.homepage }}/releases" target="_blank" onclick="ga('send', 'event', 'Footer Actions', 'Releases', 'Releases')">Releases</a></li>
                    <li class="text-muted">&middot;</li>
                    <li><a href="{{ package.homepage }}/blob/master/CONTRIBUTING.md" target="_blank" onclick="ga('send', 'event', 'Footer Actions', 'Contribute', 'Contribute')">Contribute</a></li>
                    <li class="text-muted">&middot;</li>
                    <li><a href="{{ package.homepage }}/issues/?state=open" target="_blank" onclick="ga('send', 'event', 'Footer Actions', 'Issues', 'Issues')">Issues</a></li>
                    <li class="text-muted">&middot;</li>
                    <li><a href="{{ package.homepage }}/issues/new" target="_blank" onclick="ga('send', 'event', 'Footer Actions', 'Issues', 'Report an Issue')">Report an Issue</a></li>
                    <li class="text-muted">&middot;</li>
                    <li><a href="#" onclick="return false;" data-toggle="tooltip" data-html="true" title="Room name is &lt;strong&gt;&ldquo;Web Skin - Dev&rdquo;&lt;/strong&gt;">Contact Us on HipChat</a></li>
                </ul>
                <p><small class="text-muted">Copyright &copy; {{ now | date('Y') }} Workiva</small></p>
            </div>
        </div>
    </div>
</footer>