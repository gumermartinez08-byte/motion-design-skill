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
  var LANGS = ['es', 'en', 'zh', 'ja'];
  var LOCALE = { es: 'es-ES', en: 'en-GB', zh: 'zh-CN', ja: 'ja-JP' };
  var TITLES = { es: 'Origen de confianza', en: 'A trusted origin', zh: '值得信赖的源头', ja: '信頼できる原産地' };
  var lang = localStorage.getItem(LANG_KEY) || 'es';
  var T = function (k) { return (I18N[lang] && I18N[lang][k]) || I18N.es[k] || ''; };

  function applyLang(l) {
    lang = LANGS.indexOf(l) > -1 ? l : 'es';
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) { var v = T(el.dataset.i18n); if (v) el.textContent = v; });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', T(el.dataset.i18nAria)); });
    $$('[data-set-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.setLang === lang)); });
    document.title = 'La Comarca Meats | ' + TITLES[lang];
    renderProductTexts();
    renderExplorerTexts();
    var ct = $('[data-catalog-toggle]'); if (ct) $('span', ct).textContent = T(ct.getAttribute('aria-expanded') === 'true' ? 'cat.hide' : 'cat.full');
    renderChainDetail(true);
    $$('[data-count]').forEach(function (el) { if (el._fmt) el.textContent = el._fmt(+el.dataset.count); });
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
    document.documentElement.classList.toggle('hdr-hidden', hide);
    lastY = y;
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  var nav = $('[data-nav]');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2 || !$(id)) return;
    e.preventDefault();
    scrollToEl(id, id === '#inicio' ? 0 : undefined);
  });
  $$('[data-set-lang]').forEach(function (b) { b.addEventListener('click', function () { applyLang(b.dataset.setLang); }); });

  /* ------------------------------------------------------- video sources */
  // Local copy first (video/*.mp4) if it exists, otherwise the original from lacomarcameats.com.
  // Both clips simply play in a loop: no scroll-locking, nothing to wait for.
  function setSrc(v, src) { v.src = src; v.load(); if (v.dataset.autoplay !== 'lazy') v.play().catch(function () {}); }
  $$('video[data-src-remote]').forEach(function (v) {
    var local = v.dataset.srcLocal, remote = v.dataset.srcRemote;
    if (!local || location.protocol === 'file:') { setSrc(v, remote); return; }
    fetch(local, { method: 'HEAD' }).then(function (r) { if (!r.ok) throw 0; setSrc(v, local); })
      .catch(function () { setSrc(v, remote); });
  });

  /* ------------------------------------------------------- hero */
  var hero = $('[data-hero]');
  var heroVideo = $('video', hero);
  if (!reduce) {
    // no pin: the hero scrolls away normally; video drifts and copy lifts as it leaves
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      .to('[data-hero-media]', { yPercent: 18, scale: 1.06 }, 0)
      .to('[data-hero-s1]', { yPercent: -30, autoAlpha: 0 }, 0)
      .to('.hero__foot', { autoAlpha: 0 }, 0)
      .to('[data-hero-progress]', { scaleX: 1 }, 0);
  }
  // pause video when hero is off screen (saves battery on phones)
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) heroVideo.play().catch(function () {}); else heroVideo.pause(); });
  }).observe(hero);

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
  // start buffering well before it is on screen so it is already playing when you arrive
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { cinemaVideo.preload = 'auto'; cinemaVideo.play().catch(function () {}); } else cinemaVideo.pause(); });
  }, { rootMargin: '150% 0px 150% 0px' }).observe(cinema);

  var mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    // no pin: the frame opens while the section scrolls into view, fully open when it reaches the top
    gsap.timeline({ scrollTrigger: { trigger: cinema, start: 'top 90%', end: 'top 10%', scrub: 0.4 } })
      .to('[data-cinema-frame]', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power1.out', duration: 1 }, 0)
      .to('[data-cinema-frame] video', { scale: 1, ease: 'power1.out', duration: 1 }, 0)
      .to('[data-cinema-caption]', { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.65);
    gsap.set('[data-cinema-caption]', { y: 20 });
  });

  /* --------------------------------------------------- value chain (pin) */
  var chain = $('[data-chain]');
  var steps = $$('[data-chain-step]', chain);
  var chainCur = -1;
  var detail = $('[data-chain-detail]');
  function renderChainDetail(force) {
    if (chainCur < 0 || !detail) return;
    var i = chainCur + 1;
    $('[data-chain-detail-n]').textContent = (i < 10 ? '0' : '') + i;
    $('[data-chain-detail-title]').textContent = T('chain.s' + i);
    $('[data-chain-detail-text]').textContent = T('chain.d' + i);
    if (!force && M && !reduce) M.animate($('div', detail), { opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0)'] }, { duration: 0.42, ease: EASE });
  }
  function setSteps(p) {
    var n = Math.max(1, Math.min(steps.length, Math.floor(p * steps.length) + 1));
    steps.forEach(function (s, i) { s.classList.toggle('is-on', i < n); s.classList.toggle('is-current', i === n - 1); });
    if (n - 1 !== chainCur) { chainCur = n - 1; renderChainDetail(); }
  }
  setSteps(0);
  mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', function () {
    gsap.to('[data-chain-progress]', { scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: chain, start: 'top top', end: '+=200%', pin: true, scrub: 0.5, onUpdate: function (st) { setSteps(st.progress); } } });
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
    var fmt = el._fmt = function (v) { return pre + Math.round(v).toLocaleString(LOCALE[lang]); };
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

  // Product names exist in ES/EN (catalogue). Chinese/Japanese show the English trade name + Spanish.
  function partName(part) { return T('part.' + part.zone) || part.es; }
  function partAlt(part) { return lang === 'es' ? part.en : part.es; }
  function names(p) { return lang === 'es' ? p.es : p.en; }
  function altNames(p) { return lang === 'es' ? p.en : p.es; }

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
  function openProduct(pi, i, opener) {
    var part = parts[pi], p = part.products[i];
    var m = $('#product-modal');
    $('[data-pm-img]', m).src = p.img;
    $('[data-pm-img]', m).alt = names(p).join(', ');
    $('[data-pm-part]', m).textContent = partName(part);
    $('[data-pm-title]', m).innerHTML = names(p).join('<br>');
    $('[data-pm-alt]', m).textContent = altNames(p).join(' · ');
    openModal(m, opener);
  }
  list.addEventListener('click', function (e) {
    var c = e.target.closest('.pcard'); if (!c) return;
    openProduct(+c.dataset.part, +c.dataset.item, c);
  });

  /* ============================================ BIG PIG EXPLORER */
  // The pig comes apart into its cuts as it scrolls into view (exploded butcher chart).
  // Hover / tap a cut: it pops further out and the card lists its products right there.
  var big = $('[data-bigpig]');
  var cuts = $$('.cut', big);
  var exCard = $('[data-explorer-card]'), exHint = $('[data-explorer-hint]');
  var canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var exZone = null;
  var SVGNS = 'http://www.w3.org/2000/svg';
  // inner wrapper: outer <g> carries the scroll "spread", inner <g> the hover pop
  cuts.forEach(function (c) {
    var inner = document.createElementNS(SVGNS, 'g'); inner.setAttribute('class', 'cut__in');
    while (c.firstChild) inner.appendChild(c.firstChild);
    c.appendChild(inner); c._in = inner;
  });
  function partBy(zone) { return parts.filter(function (p) { return p.zone === zone; })[0]; }
  function partIndex(zone) { for (var i = 0; i < parts.length; i++) if (parts[i].zone === zone) return i; return -1; }
  function renderExplorerTexts() {
    if (!big) return;
    exHint.textContent = T(canHover ? 'pig.hint' : 'pig.hintTouch');
    $('[data-cut-others]').textContent = T('pig.others') + ' →';
    cuts.forEach(function (c) {
      $('.cut__label', c).textContent = T('part.' + c.dataset.cut).toUpperCase();
      c.setAttribute('aria-label', T('part.' + c.dataset.cut));
    });
    if (exZone) showCut(exZone, true);
  }
  function popCut(c, on) {
    var k = on ? 0.9 : 0;
    var vars = { x: +c.dataset.dx * k, y: +c.dataset.dy * k, scale: on ? 1.04 : 1, transformOrigin: '50% 50%' };
    if (reduce) { gsap.set(c._in, vars); return; }
    vars.duration = on ? 0.55 : 0.4; vars.ease = on ? 'back.out(1.7)' : 'power3.out'; vars.overwrite = 'auto';
    gsap.to(c._in, vars);
  }
  function showCut(zone, silent) {
    var part = partBy(zone); if (!part) return;
    var changed = zone !== exZone, pi = partIndex(zone);
    exZone = zone;
    big.classList.toggle('is-all', zone === 'otros');
    cuts.forEach(function (c) { var on = c.dataset.cut === zone || zone === 'otros'; c.classList.toggle('is-on', on); if (changed || silent) popCut(c, on && zone !== 'otros'); });
    exCard.hidden = false;
    $('[data-explorer-count]').textContent = part.products.length + ' ' + T('prod.refs');
    $('[data-explorer-name]').innerHTML = partName(part) + '<em>' + partAlt(part) + '</em>';
    $('[data-explorer-items]').innerHTML = part.products.map(function (p, i) {
      return '<li><button type="button" class="exitem" data-part="' + pi + '" data-item="' + i + '">' +
        '<img src="' + p.img + '" alt="" loading="lazy"><span><strong>' + names(p).join(' · ') + '</strong><small>' + altNames(p).join(' · ') + '</small></span></button></li>';
    }).join('');
    $('[data-explorer-items]').scrollTop = 0;
    if (changed && !silent && M && !reduce) {
      M.animate(exCard, { opacity: [0.4, 1], transform: ['translateY(10px)', 'translateY(0)'] }, { duration: 0.4, ease: EASE });
      M.animate($$('.exitem', exCard).slice(0, 6), { opacity: [0, 1], transform: ['translateX(-8px)', 'translateX(0)'] }, { duration: 0.35, ease: EASE, delay: M.stagger ? M.stagger(0.035) : 0 });
    }
  }
  if (big) {
    cuts.forEach(function (c) {
      var z = c.dataset.cut;
      if (canHover) c.addEventListener('pointerenter', function () { showCut(z); });
      c.addEventListener('focus', function () { if (c.matches(':focus-visible')) showCut(z); });
      c.addEventListener('click', function () { showCut(z); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showCut(z); } });
    });
    var others = $('[data-cut-others]');
    others.addEventListener('click', function () { showCut('otros'); });
    exCard.addEventListener('click', function (e) { var b = e.target.closest('.exitem'); if (b) openProduct(+b.dataset.part, +b.dataset.item, b); });
    // scroll-linked spread: the pig unfolds into its cuts as it enters the screen
    if (!reduce) {
      gsap.timeline({ scrollTrigger: { trigger: big, start: 'top 85%', end: 'center 55%', scrub: 0.5 } })
        .fromTo(cuts, { x: 0, y: 0 }, { x: function (i, c) { return +c.dataset.dx * 0.8; }, y: function (i, c) { return +c.dataset.dy * 0.8; }, ease: 'power2.out', stagger: 0.04 });
      ScrollTrigger.create({ trigger: big, start: 'center 60%', once: true, onEnter: function () { if (!exZone) showCut('jamon'); } });
    } else {
      cuts.forEach(function (c) { gsap.set(c, { x: +c.dataset.dx * 0.6, y: +c.dataset.dy * 0.6 }); });
      showCut('jamon', true);
    }
  }

  /* ------------------------------------------------ full catalogue toggle */
  var catToggle = $('[data-catalog-toggle]'), stage = $('[data-products-stage]');
  function setCatalog(open) {
    catToggle.setAttribute('aria-expanded', String(open));
    $('span', catToggle).textContent = T(open ? 'cat.hide' : 'cat.full');
    if (open) {
      stage.hidden = false;
      ScrollTrigger.refresh();
      if (M && !reduce) M.animate(stage, { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0)'] }, { duration: 0.6, ease: EASE });
      scrollToEl(stage, -(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 80) - 10);
    } else {
      var go = function () { stage.hidden = true; ScrollTrigger.refresh(); };
      scrollToEl($('[data-catbar]'), -(window.innerHeight * 0.4));
      if (M && !reduce) Promise.resolve(M.animate(stage, { opacity: [1, 0] }, { duration: 0.25, ease: EASE_IN })).then(go); else go();
    }
  }
  catToggle.addEventListener('click', function () { setCatalog(catToggle.getAttribute('aria-expanded') !== 'true'); });
  // links pointing inside the catalogue (chips, nav) open it first
  window._openCatalog = function () { if (stage.hidden) setCatalog(true); };

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
