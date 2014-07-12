# =================================================
#   WDESK COMPASS CONFIG [SASS API DOCS]
#   This config file is used to generate the
#   Sass API Documentation Styles
# =================================================

  sass_dir          = "scss"
  http_path         = "assets"
  css_dir           = "#{http_path}/css"
  fonts_dir         = "#{http_path}/fonts"
  images_dir        = "#{http_path}/img"
  javascripts_dir   = "#{http_path}/js"

  # compass compile -e development
    if environment != :production
      output_style  = :nested
      line_comments = true
    end

  # compass compile -e production
    if environment == :production
      output_style  = :compact
      line_comments = true
    end

# To enable relative paths to assets via compass helper functions. Uncomment:
  relative_assets = true

# Silence deprecation warnings
  disable_warnings = false

# uncomment to disable cache-busting
  # asset_cache_buster :none
