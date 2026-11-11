/*
 * The "Share feedback" button in the prototype bar at the top of the page.
 * Sends { name, email, message } to the gallery's Google Apps Script program (doPost
 * in Feedback.gs), which saves it on the Feedback tab of the Sheet. Nothing is emailed.
 */
(function () {
  'use strict';
  var dialog = document.getElementById('fbDialog');
  var form = document.getElementById('fbForm');
  var thanks = document.getElementById('fbThanks');
  var status = document.getElementById('fbStatus');
  var send = document.getElementById('fbSend');
  if (!dialog || !form) return;

  function visitor() {
    try { return localStorage.getItem('tplVisitor') || ''; } catch (e) { return ''; }
  }

  function open() {
    form.hidden = false;
    thanks.hidden = true;
    status.textContent = '';
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    setTimeout(function () { form.elements.message.focus(); }, 50);
  }
  function close() {
    if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
  }

  document.querySelectorAll('[data-feedback-open]').forEach(function (b) { b.addEventListener('click', open); });
  dialog.querySelectorAll('[data-feedback-close]').forEach(function (b) { b.addEventListener('click', close); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); }); // click outside the box

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var message = f.message.value.trim();
    var email = f.email.value.trim();
    if (message.length < 2) { status.textContent = 'Please write a few words first.'; f.message.focus(); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { status.textContent = 'That email address doesn\'t look right.'; f.email.focus(); return; }

    status.textContent = '';
    send.disabled = true;
    send.textContent = 'Sending...';
    var body = JSON.stringify({ name: f.name.value.trim(), email: email, message: message, website: f.website.value, visitor: visitor() });

    // Plain text keeps it a "simple" request, so the browser sends it straight to Google
    fetch(window.tplFeed, { method: 'POST', body: body, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, credentials: 'omit' })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) throw new Error((res && res.error) || 'Something went wrong. Please try again.');
        form.reset();
        form.hidden = true;
        thanks.hidden = false;
        thanks.querySelector('button').focus();
      })
      .catch(function (err) {
        status.textContent = (err && err.message && !/fetch|network|json/i.test(err.message))
          ? err.message
          : 'That didn\'t send. Check your internet connection and try again.';
      })
      .then(function () { send.disabled = false; send.textContent = 'Send feedback'; });
  });
})();
