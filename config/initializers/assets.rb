# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w( jquery.cookie.js jquery-ui.js outdoor-map.js micello.js area_index.js exp_index.js indoor_index.js indoor_ad.js info_index.js info_contact.js outdoor_index.js terms_index.js top_index.js gtm.js ga.js micellomap.js micellomap_impl.js AdminLTE.min.css _all-skins.min.css jQuery-2.2.0.min.js jquery.slimscroll.min.js fastclick.min.js app.min.js demo.js icheck.min.js _all.css tooljs.js tooljs_list.js papaparse.min.js theme.css main.js jquery_ujs.js)
