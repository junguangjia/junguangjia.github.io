/* Progressive enhancement: no third-party player is loaded before a click.
   Without this script, the poster and text link still open the video on YouTube. */
(function () {
  'use strict';

  document.querySelectorAll('.teaching-video-link[data-youtube-id]').forEach(function (link) {
    var id = link.dataset.youtubeId;
    var title = link.dataset.videoTitle;
    var container = link.closest('.teaching-video');
    if (!container || !title || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'teaching-video-link teaching-video-button';
    /* Labels come from data attributes so each page language can set them. */
    button.setAttribute('aria-label', (link.dataset.playAria || 'Play on this page') + (link.dataset.labelSep || ': ') + title);
    while (link.firstChild) button.appendChild(link.firstChild);
    button.querySelector('.teaching-video-label').textContent = link.dataset.playLabel || '▶ Play video';
    link.replaceWith(button);

    var frameTitle = link.dataset.frameTitle || (title + ' — UC San Diego TA teaching');
    button.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      var params = new URLSearchParams({
        autoplay: '1', playsinline: '1', rel: '0', origin: window.location.origin
      });
      frame.title = frameTitle;
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?' + params.toString();
      frame.width = '560';
      frame.height = '315';
      frame.loading = 'eager';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.setAttribute('tabindex', '0');
      container.replaceChildren(frame);
      frame.focus({ preventScroll: true });
    }, { once: true });
  });
}());
