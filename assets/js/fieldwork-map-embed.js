/* Resize only the same-origin atlas iframe that sent the message. */
(function () {
  'use strict';
  if (window.__artvennAtlasHeightListener) return;
  window.__artvennAtlasHeightListener = true;
  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin || !event.data ||
        event.data.type !== 'artvenn:field-atlas:height') return;
    var height = Number(event.data.height);
    if (!Number.isFinite(height) || height < 300 || height > 3000) return;
    document.querySelectorAll('iframe.fieldwork-atlas-frame').forEach(function (frame) {
      if (frame.contentWindow === event.source) {
        var next = Math.ceil(height + 2);
        if (Math.abs(frame.getBoundingClientRect().height - next) > 2) {
          frame.style.height = next + 'px';
        }
      }
    });
  });
}());
