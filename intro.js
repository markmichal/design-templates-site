/*
 * Intro video.
 * - Opens by itself the first time someone visits (once per browser). It's marked as seen
 *   the moment it opens, so it never opens by itself again, however it's closed.
 * - "Watch the intro" at the top opens it anytime. The same video also sits in How it works.
 */
(function () {
  'use strict';
  var KEY = 'tplIntroSeen_v1';
  var dialog = document.getElementById('introDialog');
  if (!dialog) return;
  var videos = Array.prototype.slice.call(document.querySelectorAll('video.intro-video'));
  var popupVideo = dialog.querySelector('video');

  function storageWorks() {
    try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return true; } catch (e) { return false; }
  }
  function seenBefore() { try { return localStorage.getItem(KEY) === 'yes'; } catch (e) { return true; } }
  function rememberSeen() { try { localStorage.setItem(KEY, 'yes'); } catch (e) { /* private window */ } }

  function open() {
    videos.forEach(function (v) { if (v !== popupVideo) v.pause(); });
    if (typeof dialog.showModal !== 'function') {
      // Very old browsers: just scroll to the player in How it works
      document.getElementById('howVideo').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!dialog.open) dialog.showModal();
  }

  function close() { popupVideo.pause(); if (dialog.open) dialog.close(); }

  dialog.addEventListener('close', function () { popupVideo.pause(); });   // Esc key
  dialog.addEventListener('cancel', function () { popupVideo.pause(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); }); // click outside
  Array.prototype.forEach.call(document.querySelectorAll('[data-intro-close]'), function (b) {
    b.addEventListener('click', close);
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-intro-open]'), function (b) {
    b.addEventListener('click', open);
  });
  // Only one video plays at a time
  videos.forEach(function (v) {
    v.addEventListener('play', function () { videos.forEach(function (o) { if (o !== v) o.pause(); }); });
  });

  // First visit: show it once, after the page has drawn. If this browser can't remember
  // (some private windows), don't pop it up at all, so nobody sees it on every visit.
  if (storageWorks() && !seenBefore()) {
    rememberSeen();
    setTimeout(open, 900);
  }
})();
