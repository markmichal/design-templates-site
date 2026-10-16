/*
 * Design Templates gallery (templates.crutastic.com)
 * Cru Creative 1 Media's free Canva templates.
 *
 * This page lives on GitHub Pages. The list of events and designs comes from the
 * gallery's Google Apps Script program (the FEED address below), which is also
 * where designers add templates through the Template Manager. Preview pictures
 * load straight from Google Drive.
 */
(function () {
  'use strict';
  // Where the designs come from: the gallery's Google Apps Script program.
  var FEED = 'https://script.google.com/macros/s/AKfycbwQioMI8A0DwemLLLtDo0CLR_eKjR0uKSSAraKZ__efaqtBXoFVQWe3H0fU-A4Uf4ySNg/exec';
  var SAVED_KEY = 'tplGalleryData_v1';   // last list of designs, so repeat visits show instantly
  var DATA = null;
  var START_EVENT = new URLSearchParams(location.search).get('event') || '';

  var state = { eventId: '', category: 'All', q: '' };
  var imageCache = {};
  var driveImagesFailed = false;
  var $ = function (id) { return document.getElementById(id); };
  var EXTERNAL_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>';

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'className') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function eventById(id) {
    for (var i = 0; i < DATA.events.length; i++) if (DATA.events[i].id === id) return DATA.events[i];
    return null;
  }
  var liveEvents = [], pastEvents = [];

  function countFor(eventId) {
    return DATA.templates.filter(function (t) { return t.eventId === eventId; }).length;
  }
  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }
  function pluralLabel(cat) { return /s$/i.test(cat) ? cat : cat + 's'; }
  function monthYear(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  }
  function isSafeLink(url) { return /^https:\/\/(([a-z0-9-]+\.)*canva\.com|canva\.link)(\/|$)/i.test(url); }

  /* ---------- Images ---------- */

  function showPlaceholder(box) {
    box.innerHTML = '';
    box.className = box.className.replace(/\bis-loading\b/, '') + ' is-empty';
    box.appendChild(el('span', { text: 'Preview coming soon' }));
  }

  function loadInline(img, t, box) {
    if (imageCache[t.imgId]) { img.src = imageCache[t.imgId]; return; }
    fetch(FEED + '?format=json&img=' + encodeURIComponent(t.imgId))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.image) throw new Error('no image');
        imageCache[t.imgId] = j.image;
        img.src = j.image;
      })
      .catch(function () { showPlaceholder(box); });
  }

  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      var job = entry.target._job; if (job) job();
    });
  }, { rootMargin: '400px' }) : null;

  function setImage(box, t, eager) {
    if (!t.imgId) { showPlaceholder(box); return; }
    box.classList.add('is-loading');
    var img = el('img', { alt: eager ? '' : 'Preview of ' + t.title, decoding: 'async' });
    img.addEventListener('load', function () { box.classList.remove('is-loading'); });
    box.appendChild(img);
    var job = function () {
      if (driveImagesFailed) { loadInline(img, t, box); return; }
      img.onerror = function () {
        img.onerror = null;
        driveImagesFailed = true; // Drive is blocking us; use the backup route from now on.
        loadInline(img, t, box);
      };
      img.src = t.img;
    };
    if (observer && !eager) { box._job = job; observer.observe(box); } else job();
  }

  /* ---------- Several pictures: arrows, dots, swipe ---------- */

  var CHEVRON_LEFT = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  var CHEVRON_RIGHT = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  function picturesOf(t) {
    if (t.images && t.images.length) return t.images;
    return t.imgId ? [{ id: t.imgId, url: t.img }] : [];
  }

  function buildPictures(box, t) {
    var pics = picturesOf(t);
    if (pics.length < 2) { setImage(box, t); return; }

    box.classList.add('carousel');
    var n = pics.length;
    var current = 0;
    var loaded = {};
    var track = el('div', { className: 'track' });
    var slides = pics.map(function (p, i) {
      var sl = el('div', { className: 'slide', role: 'group', 'aria-roledescription': 'slide', 'aria-label': (i + 1) + ' of ' + n });
      track.appendChild(sl);
      return sl;
    });
    var viewport = el('div', { className: 'viewport', 'aria-live': 'polite' }, [track]);

    function load(i) {
      if (loaded[i]) return;
      loaded[i] = true;
      // First picture loads when the card scrolls into view; the rest load as people click through.
      setImage(slides[i], { title: t.title + ', option ' + (i + 1), imgId: pics[i].id, img: pics[i].url }, i !== 0);
    }

    var prev = el('button', { type: 'button', className: 'arrow', 'aria-label': 'Previous option' });
    var next = el('button', { type: 'button', className: 'arrow', 'aria-label': 'Next option' });
    prev.innerHTML = CHEVRON_LEFT;
    next.innerHTML = CHEVRON_RIGHT;
    var dots = el('div', { className: 'dots' });
    var dotButtons = pics.map(function (p, i) {
      var d = el('button', { type: 'button', className: 'dot', 'aria-label': 'Show option ' + (i + 1) + ' of ' + n });
      d.addEventListener('click', function () { go(i); });
      dots.appendChild(d);
      return d;
    });

    function go(i) {
      current = (i + n) % n;
      load(current);
      load((current + 1) % n); // get the next one ready
      track.style.transform = 'translateX(' + (-100 * current) + '%)';
      slides.forEach(function (sl, k) { sl.setAttribute('aria-hidden', String(k !== current)); });
      dotButtons.forEach(function (d, k) { d.setAttribute('aria-current', String(k === current)); });
    }
    prev.addEventListener('click', function () { go(current - 1); });
    next.addEventListener('click', function () { go(current + 1); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
    });

    // Swipe on phones
    var startX = null, startY = null;
    viewport.addEventListener('pointerdown', function (e) { startX = e.clientX; startY = e.clientY; });
    viewport.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      startX = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(current + (dx < 0 ? 1 : -1));
    });
    viewport.addEventListener('pointercancel', function () { startX = null; });

    box.appendChild(viewport);
    box.appendChild(el('div', { className: 'controls' }, [prev, dots, next]));
    load(0);
    go(0);
  }

  /* ---------- Render ---------- */

  var ALL = 'all';

  function newestFirst(a, b) { return b.createdAt < a.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : 0; }

  /** Every design from every live event, newest first. */
  function allLiveTemplates() {
    var live = {};
    liveEvents.forEach(function (ev) { live[ev.id] = true; });
    return DATA.templates.filter(function (t) { return live[t.eventId]; }).sort(newestFirst);
  }

  function renderHeroArt() {
    var art = $('heroArt');
    art.innerHTML = '';
    // The 3 newest designs that have a picture
    var pool = allLiveTemplates().filter(function (t) { return t.imgId; }).slice(0, 3);
    // With 3 designs, the first one sits in front (middle).
    var slots = pool.length === 3 ? ['fan-2', 'fan-1', 'fan-3'] : pool.length === 2 ? ['fan-2', 'fan-1'] : ['fan-2'];
    pool.forEach(function (t, i) {
      var card = el('div', { className: 'fan ' + slots[i] });
      setImage(card, t, true);
      art.appendChild(card);
    });
    art.className = 'hero-art count-' + pool.length;
    art.hidden = !pool.length;
  }

  function renderEventSelect() {
    var sel = $('eventSelect');
    sel.innerHTML = '';
    var current = eventById(state.eventId);
    if (liveEvents.length) sel.appendChild(el('option', { value: ALL, text: 'All designs (newest first)' }));
    if (current && current.status === 'archived') {
      sel.appendChild(el('option', { value: current.id, text: 'Past event: ' + current.name }));
    }
    liveEvents.forEach(function (ev) { sel.appendChild(el('option', { value: ev.id, text: ev.name })); });
    sel.value = state.eventId;
    sel.parentNode.hidden = !liveEvents.length && !current;
  }

  function templatesForEvent() {
    if (state.eventId === ALL) return allLiveTemplates();
    return DATA.templates.filter(function (t) { return t.eventId === state.eventId; });
  }

  function renderChips(list) {
    var present = {};
    list.forEach(function (t) { present[t.category] = true; });
    var cats = DATA.categories.filter(function (c) { return present[c]; });
    Object.keys(present).forEach(function (c) { if (c && cats.indexOf(c) < 0) cats.push(c); });
    if (state.category !== 'All' && cats.indexOf(state.category) < 0) state.category = 'All';

    var box = $('chips');
    box.innerHTML = '';
    ['All'].concat(cats).forEach(function (c) {
      var b = el('button', { type: 'button', className: 'chip', 'aria-pressed': String(state.category === c), text: c === 'All' ? 'All' : pluralLabel(c) });
      b.addEventListener('click', function () { state.category = c; renderChips(templatesForEvent()); renderGrid(templatesForEvent()); });
      box.appendChild(b);
    });
    box.hidden = cats.length < 2;
  }

  function renderGrid(list) {
    var q = state.q.trim().toLowerCase();
    var shown = list.filter(function (t) {
      if (state.category !== 'All' && t.category !== state.category) return false;
      if (!q) return true;
      var ev = eventById(t.eventId);
      return (t.title + ' ' + t.tip + ' ' + t.category + ' ' + t.format + ' ' + (ev ? ev.name : '')).toLowerCase().indexOf(q) >= 0;
    });

    var grid = $('grid');
    grid.innerHTML = '';
    var count = $('count');
    count.hidden = !shown.length;
    count.textContent = plural(shown.length, 'design');

    if (!state.eventId) {
      grid.appendChild(el('div', { className: 'empty', text: 'No designs are posted yet. Check back soon!' }));
      return;
    }
    if (!shown.length) {
      grid.appendChild(el('div', { className: 'empty', text: list.length ? 'Nothing matches that. Try another word or tap "All".' : 'No designs for this event yet. Check back soon!' }));
      return;
    }

    var cols = [];
    for (var c = 0; c < columnCount(); c++) cols.push(grid.appendChild(el('div', { className: 'col' })));

    shown.forEach(function (t, i) {
      var box = el('div', { className: 'thumb' });
      buildPictures(box, t);
      var meta = el('div', { className: 'card-meta' }, [
        t.category ? el('span', { className: 'tag', text: t.category }) : null,
        t.format ? el('span', { className: 'fmt', text: t.format }) : null
      ]);
      var fromEvent = state.eventId === ALL ? eventById(t.eventId) : null;
      var body = el('div', { className: 'card-body' }, [
        meta.childNodes.length ? meta : null,
        el('h3', { text: t.title }),
        fromEvent ? el('div', { className: 'card-event', text: fromEvent.name }) : null,
        t.tip ? el('p', { className: 'tip', text: t.tip }) : null
      ]);
      if (isSafeLink(t.canvaLink)) {
        var a = el('a', {
          className: 'btn btn-primary', href: t.canvaLink, target: '_blank', rel: 'noopener noreferrer',
          'aria-label': 'Use this template: ' + t.title + ' (opens Canva in a new tab)'
        });
        a.innerHTML = '<span>Use <span class="long">this </span>template</span>' + EXTERNAL_ICON;
        body.appendChild(a);
      }
      cols[i % cols.length].appendChild(el('article', { className: 'card' }, [box, body]));
    });
  }

  function columnCount() {
    var w = $('grid').clientWidth || window.innerWidth;
    return w >= 900 ? 4 : w >= 640 ? 3 : 2;
  }

  function renderPast() {
    var list = $('pastList');
    list.innerHTML = '';
    pastEvents.forEach(function (ev) {
      var n = countFor(ev.id);
      var b = el('button', { type: 'button' }, [
        el('span', { text: ev.name }),
        el('span', { className: 'quiet', text: [monthYear(ev.createdAt), plural(n, 'design')].filter(String).join(' · ') })
      ]);
      b.addEventListener('click', function () { selectEvent(ev.id); scrollToId('designs'); });
      list.appendChild(el('li', {}, [b]));
    });
    $('pastCount').textContent = pastEvents.length;
    $('past').hidden = !pastEvents.length;
    $('navPast').hidden = !pastEvents.length;
  }

  function render() {
    var isAll = state.eventId === ALL;
    var ev = eventById(state.eventId);
    $('eventName').textContent = isAll ? 'All designs' : ev ? ev.name : DATA.title;
    $('eventDesc').textContent = isAll ? 'The newest designs from every event. Pick an event above to narrow it down.' : ev ? ev.description : '';
    $('eventDesc').hidden = !(isAll || (ev && ev.description));
    $('pastNote').hidden = !(ev && ev.status === 'archived');
    $('browseLabel').textContent = isAll ? 'Browse all designs' : ev && ev.status === 'live' ? 'Browse ' + ev.name : 'Browse designs';
    renderEventSelect();
    var list = templatesForEvent();
    renderChips(list);
    renderGrid(list);
  }

  function selectEvent(id) {
    state.eventId = id;
    state.category = 'All';
    state.q = '';
    $('q').value = '';
    render();
    try { history.replaceState(null, '', id === ALL || !id ? location.pathname : '?event=' + encodeURIComponent(id)); } catch (e) { /* fine */ }
  }

  /** Smooth in-page jumps. */
  function scrollToId(id) {
    var target = $(id);
    if (!target) return;
    if (id === 'past') target.open = true;
    var focusAt = id === 'designs' ? $('filters') : target;
    focusAt.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Start ---------- */

  document.querySelectorAll('[data-scroll]').forEach(function (b) {
    b.addEventListener('click', function () { scrollToId(b.dataset.scroll); });
  });
  $('eventSelect').addEventListener('change', function (e) { selectEvent(e.target.value); });
  $('q').addEventListener('input', function (e) { state.q = e.target.value; renderGrid(templatesForEvent()); });
  $('backToCurrent').addEventListener('click', function () { selectEvent(liveEvents.length ? ALL : ''); });

  var lastCols = 0;
  window.addEventListener('resize', function () {
    var n = columnCount();
    if (n !== lastCols && DATA) { lastCols = n; renderGrid(templatesForEvent()); }
  });

  /* ---------- Loading the designs ---------- */

  var shown = '';   // the data currently on screen, to skip redrawing when nothing changed

  function show(data) {
    var json = JSON.stringify(data);
    if (json === shown) return;
    var firstTime = !DATA;
    shown = json;
    DATA = data;
    liveEvents = DATA.events.filter(function (e) { return e.status === 'live'; });
    pastEvents = DATA.events.filter(function (e) { return e.status === 'archived'; });
    driveImagesFailed = driveImagesFailed || DATA.imageMode === 'inline';
    if (DATA.title) $('siteTitle').textContent = DATA.title;

    if (firstTime) {
      // Opens to "All designs" unless the link points at one event (?event=...)
      state.eventId = eventById(START_EVENT) ? START_EVENT : liveEvents.length ? ALL : (pastEvents[0] && pastEvents[0].id) || '';
    } else if (state.eventId !== ALL && !eventById(state.eventId)) {
      state.eventId = liveEvents.length ? ALL : '';
    }
    $('eventSelect').disabled = false;
    $('grid').removeAttribute('aria-busy');
    document.body.classList.remove('is-loading');
    renderHeroArt();
    renderPast();
    render();
  }

  function showError() {
    if (DATA) return; // keep showing the saved copy
    var grid = $('grid');
    grid.removeAttribute('aria-busy');
    grid.innerHTML = '';
    var box = el('div', { className: 'load-error' }, [
      el('p', { text: 'We couldn\'t load the designs right now. Please try again in a moment.' })
    ]);
    var retry = el('button', { type: 'button', className: 'btn btn-primary', text: 'Try again' });
    retry.addEventListener('click', function () { grid.innerHTML = ''; grid.setAttribute('aria-busy', 'true'); load(); });
    box.appendChild(retry);
    grid.appendChild(box);
    $('eventSelect').innerHTML = '<option>Designs unavailable</option>';
  }

  function load() {
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
    fetch(FEED + '?format=json', { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) {
        clearTimeout(timer);
        if (!data || data.error || !Array.isArray(data.events)) throw new Error((data && data.error) || 'bad data');
        try { localStorage.setItem(SAVED_KEY, JSON.stringify({ savedAt: Date.now(), data: data })); } catch (e) { /* private window */ }
        show(data);
      })
      .catch(function () { clearTimeout(timer); showError(); });
  }

  // 1) Show what this browser saw last time, right away (if anything)
  try {
    var saved = JSON.parse(localStorage.getItem(SAVED_KEY) || 'null');
    if (saved && saved.data && Array.isArray(saved.data.events)) show(saved.data);
  } catch (e) { /* nothing saved, or private window */ }
  // 2) Get the latest from Google and update the page if anything changed
  load();
})();
