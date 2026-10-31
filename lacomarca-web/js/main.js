/* La Comarca Meats: interaction + motion.
   GSAP + ScrollTrigger (scroll), Lenis (smooth scroll), Motion (modals, micro-interactions).
   Motion personality: Premium (motion-design skill). One signature curve, three durations. */
(function () {
  'use strict';

  var EASE = [0.16, 1, 0.3, 1];          // signature curve (entrances)
  var EASE_IN = [0.4, 0, 1, 1];          // exits
  var GSAP_EASE = 'expo.out';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var M = window.Motion || null;

  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------ i18n */
  var LANG_KEY = 'lcm_lang';
  var lang = localStorage.getItem(LANG_KEY) || 'es';
  var T = function (k) { return (I18N[lang] && I18N[lang][k]) || I18N.es[k] || ''; };

  function applyLang(l) {
    lang = l === 'en' ? 'en' : 'es';
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) { var v = T(el.dataset.i18n); if (v) el.textContent = v; });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', T(el.dataset.i18nAria)); });
    $$('[data-set-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.setLang === lang)); });
    document.title = lang === 'en' ? 'La Comarca Meats | A trusted origin' : 'La Comarca Meats | Origen de confianza';
    renderProductTexts();
    ScrollTrigger.refresh();
  }

  /* ---------------------------------------------------------- smooth scroll */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function scrollToEl(target, offset) {
    var el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    var off = offset != null ? offset : -(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 70);
    if (lenis) lenis.scrollTo(el, { offset: off, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ----------------------------------------------------------------- header */
  var header = $('[data-header]');
  var lastY = 0;
  function onScrollHeader() {
    var y = window.scrollY;
    header.classList.toggle('is-solid', y > window.innerHeight * 0.6);
    var hide = y > lastY && y > window.innerHeight && !document.body.classList.contains('nav-open');
    header.classList.toggle('is-hidden', hide);
    lastY = y;
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  var burger = $('[data-burger]'), nav = $('[data-nav]');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    header.classList.add('is-solid');
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2 || !$(id)) return;
    e.preventDefault();
    nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('nav-open');
    scrollToEl(id, id === '#inicio' ? 0 : undefined);
  });
  $$('[data-set-lang]').forEach(function (b) { b.addEventListener('click', function () { applyLang(b.dataset.setLang); }); });

  /* ------------------------------------------------------- video sources */
  // Local re-encoded clip first (video/*.mp4, dense keyframes for scrubbing), remote original as fallback.
  // Scrub clips are loaded whole as a blob so seeking works on any host (no HTTP range support needed).
  function setRemote(v) { if (v.dataset.srcRemote) { v.src = v.dataset.srcRemote; v.load(); } }
  $$('video[data-src-remote]').forEach(function (v) {
    var local = v.dataset.srcLocal;
    if (!local || location.protocol === 'file:') { setRemote(v); return; }
    if (v.hasAttribute('data-scrub')) {
      fetch(local).then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob(); })
        .then(function (blob) { v.src = URL.createObjectURL(blob); v.load(); })
        .catch(function () { setRemote(v); });
    } else {
      fetch(local, { method: 'HEAD' }).then(function (r) { if (!r.ok) throw 0; v.src = local; v.load(); })
        .catch(function () { setRemote(v); });
    }
  });

  /* ------------------------------------------------------- hero (scrub) */
  var hero = $('[data-hero]');
  var heroVideo = $('video[data-scrub]', hero);
  var playhead = { target: 0, cur: 0 };

  if (reduce) {
    heroVideo.loop = true; heroVideo.autoplay = true; heroVideo.play().catch(function () {});
  } else {
    // prime decoder (iOS needs a play() before seeking shows frames)
    var prime = function () { heroVideo.play().then(function () { heroVideo.pause(); }).catch(function () {}); };
    heroVideo.addEventListener('loadedmetadata', prime, { once: true });
    window.addEventListener('touchstart', prime, { once: true, passive: true });

    // smoothed playhead: scroll writes a target, rAF walks toward it (scroll-craft pattern)
    gsap.ticker.add(function () {
      var d = heroVideo.duration;
      if (!d || isNaN(d)) return;
      var tgt = playhead.target * (d - 0.05);
      playhead.cur += (tgt - playhead.cur) * 0.18;
      if (Math.abs(playhead.cur - heroVideo.currentTime) > 1 / 30 && !heroVideo.seeking && heroVideo.readyState >= 1) {
        heroVideo.currentTime = playhead.cur;
      }
    });

    var heroTl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero, start: 'top top', end: '+=170%', pin: true, scrub: 0.6,
        onUpdate: function (st) { playhead.target = st.progress; }
      }
    });
    heroTl
      .to('[data-hero-media]', { scale: 1.08, duration: 1 }, 0)
      .to('[data-hero-progress]', { scaleX: 1, duration: 1 }, 0)
      .to('[data-hero-s1]', { yPercent: -18, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0.12)
      .fromTo('[data-hero-s2]', { yPercent: 24, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 0.46)
      .to('[data-hero-s2]', { autoAlpha: 0, yPercent: -12, duration: 0.2, ease: 'power2.in' }, 0.86);
  }

  // hero intro (on load)
  if (!reduce) {
    gsap.from('.hero__scene--1 .line > *', { yPercent: 110, duration: 1.1, ease: GSAP_EASE, stagger: 0.12, delay: 0.15 });
    gsap.from('.hero__scene--1 .eyebrow, .hero__lead, .hero__ctas, .hero__foot', { y: 24, autoAlpha: 0, duration: 0.9, ease: GSAP_EASE, stagger: 0.08, delay: 0.45 });
  }
  $('[data-skip-hero]').addEventListener('click', function () { scrollToEl('#nosotros'); });

  /* ------------------------------------------------- reveals & parallax */
  if (!reduce) {
    gsap.set('[data-reveal]', { autoAlpha: 0, y: 28, filter: 'blur(6px)' });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%', once: true,
      onEnter: function (els) { gsap.to(els, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: GSAP_EASE, stagger: 0.08, overwrite: true }); }
    });
    $$('[data-stagger]').forEach(function (list) {
      gsap.from(list.children, { autoAlpha: 0, y: 24, duration: 0.8, ease: GSAP_EASE, stagger: 0.07,
        scrollTrigger: { trigger: list, start: 'top 85%', once: true } });
    });
    $$('[data-mask]').forEach(function (m) {
      gsap.fromTo(m, { clipPath: 'inset(100% 0% 0% 0% round 18px)' }, { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.2, ease: 'expo.inOut',
        scrollTrigger: { trigger: m, start: 'top 85%', once: true } });
      var img = $('[data-parallax]', m);
      if (img) gsap.fromTo(img, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* --------------------------------------------- cinema (frame opens up) */
  var cinema = $('[data-cinema]');
  var cinemaVideo = $('video', cinema);
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) cinemaVideo.play().catch(function () {}); else cinemaVideo.pause(); });
  }, { threshold: 0.15 }).observe(cinema);

  var mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    gsap.timeline({ scrollTrigger: { trigger: cinema, start: 'top top', end: '+=120%', pin: true, scrub: 0.6 } })
      .to('[data-cinema-frame]', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1 }, 0)
      .to('[data-cinema-frame] video', { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
      .to('[data-cinema-caption]', { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.7);
    gsap.set('[data-cinema-caption]', { y: 20 });
  });

  /* --------------------------------------------------- value chain (pin) */
  var chain = $('[data-chain]');
  var steps = $$('[data-chain-step]', chain);
  function setSteps(p) {
    var n = Math.min(steps.length, Math.floor(p * (steps.length + 0.6)));
    steps.forEach(function (s, i) { s.classList.toggle('is-on', i < n); });
  }
  mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', function () {
    gsap.to('[data-chain-progress]', { scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: chain, start: 'top top', end: '+=140%', pin: true, scrub: 0.5, onUpdate: function (st) { setSteps(st.progress); } } });
  });
  mm.add('(max-width: 860px), (prefers-reduced-motion: reduce)', function () {
    gsap.to('[data-chain-progress]', { scaleY: 1, scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.chain__track', start: 'top 75%', end: 'bottom 45%', scrub: true, onUpdate: function (st) { setSteps(st.progress); } } });
  });

  /* ------------------------------------------- quality gallery (lateral pan) */
  mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', function () {
    var track = $('[data-hscroll-track]');
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    gsap.to(track, { x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: '[data-hscroll]', start: 'center center', end: function () { return '+=' + dist(); }, pin: '.quality', scrub: 0.6, invalidateOnRefresh: true } });
  });
  mm.add('(max-width: 860px)', function () {
    var h = $('[data-hscroll]'); h.style.overflowX = 'auto';
    return function () { h.style.overflowX = ''; };
  });

  /* ------------------------------------------------------- counters */
  $$('[data-count]').forEach(function (el) {
    var end = +el.dataset.count, pre = el.dataset.prefix || '';
    var fmt = function (v) { return pre + Math.round(v).toLocaleString(lang === 'en' ? 'en-GB' : 'es-ES'); };
    el.textContent = fmt(end);
    if (reduce) return;
    var o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () {
      gsap.fromTo(o, { v: 0 }, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(o.v); } });
    } });
  });

  /* ------------------------------------------------- catalogue tilt */
  var tilt = $('[data-tilt]');
  if (tilt && !reduce && matchMedia('(hover: hover)').matches) {
    var rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    var ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    gsap.set(tilt, { transformPerspective: 900 });
    tilt.addEventListener('pointermove', function (e) {
      var r = tilt.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 10);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
    });
    tilt.addEventListener('pointerleave', function () { rx(0); ry(0); });
  }

  /* =============================================================== PRODUCTS */
  var parts = window.PRODUCT_PARTS || [];
  var list = $('[data-products-list]');
  var chips = $('[data-products-chips]');
  var pig = $('#pig');
  var nowName = $('[data-now-name]'), nowCount = $('[data-now-count]');
  var activeZone = null;

  function cardHTML(p, pi, i) {
    return '<button type="button" class="pcard" data-part="' + pi + '" data-item="' + i + '">' +
      '<span class="pcard__img"><img src="' + p.img + '" alt="" loading="lazy" decoding="async" width="1000" height="520"></span>' +
      '<span class="pcard__body"><span class="pcard__name"></span><span class="pcard__alt"></span></span></button>';
  }
  list.innerHTML = parts.map(function (part, pi) {
    return '<section class="part" id="parte-' + part.zone + '" data-zone-section="' + part.zone + '">' +
      '<header class="part__head"><h3 class="part__title"></h3><span class="part__count"></span></header>' +
      '<div class="part__grid">' + part.products.map(function (p, i) { return cardHTML(p, pi, i); }).join('') + '</div></section>';
  }).join('');
  chips.innerHTML = parts.map(function (part) { return '<button type="button" data-chip="' + part.zone + '"></button>'; }).join('');

  function partName(part) { return lang === 'en' ? part.en : part.es; }
  function partAlt(part) { return lang === 'en' ? part.es : part.en; }
  function names(p) { return lang === 'en' ? p.en : p.es; }
  function altNames(p) { return lang === 'en' ? p.es : p.en; }

  function renderProductTexts() {
    if (!list) return;
    parts.forEach(function (part, pi) {
      var sec = list.children[pi];
      $('.part__title', sec).innerHTML = partName(part) + '<em>' + partAlt(part) + '</em>';
      $('.part__count', sec).textContent = part.products.length + ' ' + T('prod.refs');
      $$('.pcard', sec).forEach(function (card, i) {
        var p = part.products[i];
        $('.pcard__name', card).innerHTML = names(p).map(function (n) { return '<span>' + n + '</span>'; }).join('');
        $('.pcard__alt', card).textContent = altNames(p).join(' · ');
        card.setAttribute('aria-label', T('prod.view') + ': ' + names(p).join(', '));
      });
      var chip = $('[data-chip="' + part.zone + '"]', chips);
      chip.textContent = partName(part);
      var label = $('[data-label="' + part.zone + '"]', pig);
      if (label) label.textContent = partName(part).toUpperCase();
    });
    if (activeZone) setZone(activeZone, true);
  }

  function setZone(zone, force) {
    if (zone === activeZone && !force) return;
    activeZone = zone;
    var part = parts.filter(function (p) { return p.zone === zone; })[0];
    $$('.pig__zone', pig).forEach(function (z) { z.classList.toggle('is-on', z.dataset.zone === zone); });
    $$('.pig__labels text', pig).forEach(function (t) { t.classList.toggle('is-on', t.dataset.label === zone); });
    pig.classList.toggle('is-all', zone === 'otros');
    $$('[data-chip]', chips).forEach(function (c) { c.setAttribute('aria-current', String(c.dataset.chip === zone)); });
    if (part) {
      nowName.innerHTML = partName(part) + (zone === 'otros' ? '<em>' + T('prod.all') + '</em>' : '<em>' + partAlt(part) + '</em>');
      nowCount.textContent = part.products.length + ' ' + T('prod.refs');
      if (M && !reduce && !force) M.animate(nowName, { opacity: [0, 1], transform: ['translateY(8px)', 'translateY(0)'] }, { duration: 0.42, ease: EASE });
      var activeChip = $('[data-chip="' + zone + '"]', chips);
      if (activeChip && chips.scrollWidth > chips.clientWidth) chips.scrollTo({ left: activeChip.offsetLeft - 12, behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  // scroll-linked: the cut lights up as its products scroll past
  $$('[data-zone-section]', list).forEach(function (sec) {
    ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: function (st) { if (st.isActive) setZone(sec.dataset.zoneSection); } });
  });
  // click a cut or a chip: jump to it
  function goZone(zone) { var sec = $('#parte-' + zone); if (sec) scrollToEl(sec, -(window.innerWidth <= 860 ? 200 : 100)); }
  $$('.pig__zone', pig).forEach(function (z) { z.addEventListener('click', function () { goZone(z.dataset.zone); }); });
  chips.addEventListener('click', function (e) { var b = e.target.closest('[data-chip]'); if (b) goZone(b.dataset.chip); });

  // hovering a card previews its cut on the pig
  list.addEventListener('pointerover', function (e) {
    var c = e.target.closest('.pcard'); if (!c) return;
    var zone = parts[+c.dataset.part].zone;
    $$('.pig__zone', pig).forEach(function (z) { z.classList.toggle('is-peek', z.dataset.zone === zone); });
  });
  list.addEventListener('pointerleave', function () { $$('.pig__zone.is-peek', pig).forEach(function (z) { z.classList.remove('is-peek'); }); });

  // card entrance (micro cascade)
  if (!reduce) {
    gsap.set('.pcard', { autoAlpha: 0, y: 24 });
    ScrollTrigger.batch('.pcard', { start: 'top 92%', once: true, interval: 0.08, batchMax: 6,
      onEnter: function (b) { gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.7, ease: GSAP_EASE, stagger: 0.05, overwrite: true }); } });
  }

  // product sheet
  list.addEventListener('click', function (e) {
    var c = e.target.closest('.pcard'); if (!c) return;
    var part = parts[+c.dataset.part], p = part.products[+c.dataset.item];
    var m = $('#product-modal');
    $('[data-pm-img]', m).src = p.img;
    $('[data-pm-img]', m).alt = names(p).join(', ');
    $('[data-pm-part]', m).textContent = partName(part);
    $('[data-pm-title]', m).innerHTML = names(p).join('<br>');
    $('[data-pm-alt]', m).textContent = altNames(p).join(' · ');
    openModal(m, c);
  });

  /* ================================================================ MODALS */
  var openStack = [];
  function focusables(el) { return $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', el).filter(function (x) { return x.offsetParent !== null; }); }

  function openModal(m, opener) {
    if (!m.hidden) return;
    m._opener = opener || document.activeElement;
    m.hidden = false;
    openStack.push(m);
    if (lenis) lenis.stop();
    document.documentElement.style.overflow = 'hidden';
    var bd = $('.modal__backdrop', m), panel = $('.modal__panel', m);
    if (M && !reduce) {
      M.animate(bd, { opacity: [0, 1] }, { duration: 0.35, ease: EASE });
      M.animate(panel, { opacity: [0, 1], transform: ['translateY(28px) scale(.97)', 'translateY(0) scale(1)'] }, { duration: 0.5, ease: EASE });
      var inner = $$('.modal__title, .kicker, .body, .hook__ctas, .lang-options, .pm__alt', panel);
      if (inner.length) M.animate(inner, { opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0)'] }, { duration: 0.45, ease: EASE, delay: M.stagger ? M.stagger(0.05, { startDelay: 0.12 }) : 0.12 });
    }
    var f = focusables(panel); (f[0] || panel).focus({ preventScroll: true });
  }

  function closeModal(m) {
    if (!m || m.hidden) return Promise.resolve();
    var bd = $('.modal__backdrop', m), panel = $('.modal__panel', m);
    var done = function () {
      m.hidden = true;
      openStack = openStack.filter(function (x) { return x !== m; });
      if (!openStack.length) { if (lenis) lenis.start(); document.documentElement.style.overflow = ''; }
      if (m._opener && m._opener.focus) m._opener.focus({ preventScroll: true });
      document.dispatchEvent(new CustomEvent('modalclosed'));
    };
    if (M && !reduce) {
      M.animate(bd, { opacity: [1, 0] }, { duration: 0.25, ease: EASE_IN });
      return Promise.resolve(M.animate(panel, { opacity: [1, 0], transform: ['translateY(0) scale(1)', 'translateY(16px) scale(.98)'] }, { duration: 0.25, ease: EASE_IN })).then(done);
    }
    done(); return Promise.resolve();
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-close-modal]')) closeModal(e.target.closest('.modal'));
    if (e.target.closest('[data-open-contact]')) openModal($('#contact-modal'), e.target.closest('[data-open-contact]'));
  });
  document.addEventListener('keydown', function (e) {
    var m = openStack[openStack.length - 1];
    if (!m) return;
    if (e.key === 'Escape') { if (m.id === 'lang-modal') chooseLang(lang); else closeModal(m); }
    if (e.key === 'Tab') {
      var f = focusables(m); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* -------------------------------------------- language pop-up (on open) */
  function chooseLang(l) { applyLang(l); localStorage.setItem(LANG_KEY + '_chosen', '1'); closeModal($('#lang-modal')); }
  $$('[data-choose-lang]').forEach(function (b) { b.addEventListener('click', function () { chooseLang(b.dataset.chooseLang); }); });

  /* ------------------------------- contact hook pop-up at 5 and 10 minutes */
  var params = new URLSearchParams(location.search);
  var DEMO = params.has('demo');                         // ?demo  -> 10 s and 20 s for testing
  var MARKS = DEMO ? [10, 20] : [5 * 60, 10 * 60];       // seconds of active browsing
  var CONTACTED = 'lcm_contacted';
  var T_KEY = 'lcm_active_s', SHOWN_KEY = 'lcm_hook_shown';
  var active = +sessionStorage.getItem(T_KEY) || 0;
  var shown = +sessionStorage.getItem(SHOWN_KEY) || 0;
  if (DEMO) { active = 0; shown = 0; }

  document.addEventListener('click', function (e) { if (e.target.closest('[data-contacted]')) localStorage.setItem(CONTACTED, '1'); });

  var pendingHook = false;
  function tryShowHook() {
    if (localStorage.getItem(CONTACTED) === '1' && !DEMO) return;
    if (openStack.length) { pendingHook = true; return; }   // never stack on top of another dialog
    pendingHook = false;
    openModal($('#contact-modal'));
  }
  document.addEventListener('modalclosed', function () { if (pendingHook && !openStack.length) setTimeout(tryShowHook, 800); });

  setInterval(function () {
    if (document.hidden) return;                          // only count time the visitor is actually here
    active += 1;
    sessionStorage.setItem(T_KEY, String(active));
    if (shown < MARKS.length && active >= MARKS[shown]) {
      shown += 1;
      sessionStorage.setItem(SHOWN_KEY, String(shown));
      tryShowHook();
    }
  }, 1000);

  /* ------------------------------------------------------------------ boot */
  // active nav link (created last so pinned sections above are already measured)
  $$('.nav a[href^="#"]').forEach(function (a) {
    var sec = $(a.getAttribute('href'));
    if (!sec) return;
    ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: function (st) { a.classList.toggle('is-active', st.isActive); } });
  });

  applyLang(lang);
  setZone(parts[0] && parts[0].zone);
  if (!localStorage.getItem(LANG_KEY + '_chosen') || params.has('lang')) {
    setTimeout(function () { openModal($('#lang-modal')); }, reduce ? 0 : 700);
  }
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
