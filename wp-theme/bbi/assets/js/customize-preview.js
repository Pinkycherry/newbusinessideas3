/**
 * Customizer live preview.
 *
 * Writes each changed token straight onto the preview document's root element
 * as an inline custom property. An inline style on the element is the highest
 * -priority place a custom property can be set short of `!important`, so it
 * beats the compiled stylesheet, the `html.light` block and the theme's own
 * inline override without any of them needing to know about it.
 *
 * The setting-to-variable mapping is handed over from PHP in BBI_TOKEN_MAP
 * rather than being written out again here. Two copies of that map is two
 * places to forget when a token is added, and the failure is silent — the
 * control simply does nothing in the preview while working perfectly once
 * saved, which is a genuinely confusing bug to be handed.
 */
(function (api) {
  'use strict';

  if (!api || typeof BBI_TOKEN_MAP === 'undefined') return;

  var root = document.documentElement;

  Object.keys(BBI_TOKEN_MAP).forEach(function (settingId) {
    var spec = BBI_TOKEN_MAP[settingId];

    api(settingId, function (setting) {
      setting.bind(function (value) {
        // An emptied field means "use the theme default", and the way to say
        // that is to remove the inline property so the stylesheet's own value
        // is uncovered again. Writing an empty string instead sets the
        // property to nothing, which resolves to the `var()` fallback rather
        // than to the default — a different value, and usually a wrong one.
        if (value === '' || value === null || typeof value === 'undefined') {
          root.style.removeProperty(spec.var);
          return;
        }
        root.style.setProperty(spec.var, String(value) + (spec.unit || ''));
      });
    });
  });

  // Site title and tagline, wherever the templates print them.
  api('blogname', function (setting) {
    setting.bind(function (value) {
      var nodes = document.querySelectorAll('.bbi-site-title');
      for (var i = 0; i < nodes.length; i++) nodes[i].textContent = value;
    });
  });

  api('blogdescription', function (setting) {
    setting.bind(function (value) {
      var nodes = document.querySelectorAll('.bbi-site-description');
      for (var i = 0; i < nodes.length; i++) nodes[i].textContent = value;
    });
  });
})(window.wp && window.wp.customize);
