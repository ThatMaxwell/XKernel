/* XKernel site: quiet motion, driven by scroll. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
  };

  /* ---------- nav ---------- */
  const nav = $('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- split the hero headline into characters ---------- */
  function split(el) {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map(line => line.trim().split(' ').map(word =>
      `<span class="wd">${[...word].map(c => `<span class="ch">${c}</span>`).join('')}</span>`).join(' ')).join('<br>');
    return $$('.ch', el);
  }

  if (!hasGsap || reduce) {
    document.documentElement.classList.add('no-intro');
    $$('.bt').forEach(t => (t.style.opacity = 1));
    layoutTiles(4);
    $$('.strike li').forEach(li => li.classList.add('gone'));
    $('.sub-end')?.classList.add('show');
    return;
  }

  document.documentElement.classList.add('js');
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  let lenis = null; window.__lenis = () => lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -40 }); }
    }));
  }

  /* ---------- intro: the XKernel first boot, once per visit ---------- */
  const intro = $('#intro');
  const chars = split($('.hero h1'));
  gsap.set(chars, { yPercent: 110, opacity: 0 });
  gsap.set(['.tag', '.lede', '.cta', '.status'], { opacity: 0, y: 16 });
  gsap.set('.hero .t', { opacity: 0, filter: 'blur(14px)', scale: .94 });
  gsap.set('.hero-screen', { opacity: 0, y: 30 });

  function heroIn() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.tag', { opacity: 1, y: 0, duration: .8 })
      .to(chars, { yPercent: 0, opacity: 1, duration: 1.1, stagger: .018 }, '-=.5')
      .to('.lede', { opacity: 1, y: 0, duration: .9 }, '-=.7')
      .to('.cta', { opacity: 1, y: 0, duration: .9 }, '-=.7')
      .to('.status', { opacity: 1, y: 0, duration: .9 }, '-=.7')
      .to('.hero-screen', { opacity: 1, y: 0, duration: 1.2 }, .2)
      .to('.hero .t', { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1, stagger: .16 }, .5);
  }

  function endIntro() {
    if (intro.classList.contains('done')) return;
    intro.classList.add('done');
    document.body.classList.remove('locked');
    lenis?.start();
    store.set('xk-intro', '1');
    heroIn();
  }

  if (store.get('xk-intro')) {
    intro.remove();
    heroIn();
  } else {
    document.body.classList.add('locked');
    lenis?.stop();
    const tl = gsap.timeline({ onComplete: endIntro });
    // boot: the X appears and fades, then the words, then they collapse back into the X
    tl.fromTo('.intro-logo', { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' }, .3)
      .to('.intro-logo', { opacity: 0, scale: 1.04, duration: .8, ease: 'power2.in' }, 2.1)
      .fromTo('.intro-words .w1', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 3.1)
      .fromTo('.intro-words .w2', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 3.9)
      .to('.intro-words', { scale: .06, opacity: 0, filter: 'blur(6px)', duration: .9, ease: 'power3.in' }, 6.2)
      .fromTo('.intro-logo', { scale: .4, opacity: 0, rotate: -45, immediateRender: false }, { scale: 1, opacity: 1, rotate: 0, duration: .9, ease: 'power3.out' }, 6.8)
      .to('.intro-logo', { scale: 1.06, opacity: 0, duration: .7 }, 8.1);
    const skip = () => { tl.kill(); endIntro(); };
    $('.intro-skip').addEventListener('click', skip);
    addEventListener('keydown', function k(e) { if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') { removeEventListener('keydown', k); skip(); } });
  }

  /* ---------- subtraction: the desktop dissolves as you scroll ---------- */
  const parts = [['.d-bar'], ['.d-dock'], ['.d-search'], ['.d-assist'], ['.d-feed', '.d-icons']];
  const items = $$('.strike li');
  ScrollTrigger.create({
    trigger: '.subtract', start: 'top top', end: 'bottom bottom',
    onUpdate(self) {
      const p = self.progress;
      parts.forEach((sel, i) => {
        const gone = p > .1 + i * .14;
        sel.forEach(s => $(`.desk ${s}`).classList.toggle('vanish', gone));
        items[i].classList.toggle('gone', gone);
      });
      $('.sub-end').classList.toggle('show', p > .82);
    },
  });

  /* ---------- tiling: kernels split the screen, dwindle-style ---------- */
  // rects in % of the screen: [left, top, width, height]
  const G = 1.5, F = 100 - 2 * G, HALF = (F - G) / 2, Q = (HALF - G) / 2;
  const R = {
    full: [G, G, F, F],
    left: [G, G, HALF, F], right: [G + HALF + G, G, HALF, F],
    rt: [G + HALF + G, G, HALF, HALF], rb: [G + HALF + G, G + HALF + G, HALF, HALF],
    rbl: [G + HALF + G, G + HALF + G, Q, HALF], rbr: [G + HALF + G + Q + G, G + HALF + G, Q, HALF],
  };
  const css = ([l, t, w, h]) => ({ left: l + '%', top: t + '%', width: w + '%', height: h + '%' });
  function layoutTiles(n) {
    const set = (el, r) => Object.assign(el.style, { left: r[0] + '%', top: r[1] + '%', width: r[2] + '%', height: r[3] + '%' });
    const [b1, b2, b3, b4] = $$('.bt');
    if (!b1) return;
    set(b1, n === 1 ? R.full : R.left); set(b2, n <= 2 ? R.right : R.rt); set(b3, n <= 3 ? R.rb : R.rbl); set(b4, R.rbr);
  }
  const [b1, b2, b3, b4] = $$('.bt');
  gsap.set(b1, { ...css(R.full) }); gsap.set(b2, { ...css(R.right) }); gsap.set(b3, { ...css(R.rb) }); gsap.set(b4, { ...css(R.rbr) });
  gsap.set([b1, b2, b3, b4], { opacity: 0, filter: 'blur(12px)', scale: .96 });
  gsap.timeline({ scrollTrigger: { trigger: '.tiling', start: 'top top', end: 'bottom bottom', scrub: .6 } })
    .to(b1, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1 })
    .to({}, { duration: .4 })
    .to(b1, { ...css(R.left), duration: 1, ease: 'power3.inOut' }, 'split1')
    .to(b2, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1 }, 'split1+=.2')
    .to({}, { duration: .4 })
    .to(b2, { ...css(R.rt), duration: 1, ease: 'power3.inOut' }, 'split2')
    .to(b3, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1 }, 'split2+=.2')
    .to({}, { duration: .4 })
    .to(b3, { ...css(R.rbl), duration: 1, ease: 'power3.inOut' }, 'split3')
    .to(b4, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1 }, 'split3+=.2')
    .to({}, { duration: .6 });
  gsap.from('.tile-copy > *', { opacity: 0, y: 24, stagger: .12, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.tiling', start: 'top 60%' } });

  /* ---------- the stack builds from the hardware up ---------- */
  gsap.from($$('.layer').reverse(), { opacity: 0, y: 30, filter: 'blur(8px)', stagger: .12, duration: .9, ease: 'power3.out',
    scrollTrigger: { trigger: '.stack', start: 'top 75%' } });
  gsap.from('.fact', { opacity: 0, y: 24, stagger: .14, duration: .9, ease: 'power3.out',
    scrollTrigger: { trigger: '.facts', start: 'top 75%' } });

  /* ---------- always there: kernels fall asleep and wake, on loop ---------- */
  const sleepTl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: 'power2.inOut' } });
  sleepTl.to({}, { duration: 1.6 })
    .to('.st', { opacity: 0, filter: 'blur(16px)', scale: .96, duration: .9, stagger: .25 })
    .to('.asleep', { opacity: 1, duration: .8 }, '-=.2')
    .to({}, { duration: 1.6 })
    .to('.asleep', { opacity: 0, duration: .6 })
    .to('.st', { opacity: 1, filter: 'blur(0px)', scale: 1, duration: .9, stagger: .22 });
  ScrollTrigger.create({ trigger: '.sleepdemo', start: 'top 85%', end: 'bottom 15%',
    onToggle: s => (s.isActive ? sleepTl.play() : sleepTl.pause()) });

  /* ---------- generic reveals ---------- */
  const reveal = $$('section:not(.hero):not(.subtract):not(.tiling) h2, section .kicker, .narrow, .always .two p, .shot, .paper, .track li, .beast, .foot-row, .foot .fine, .anything .fine')
    .filter(el => !el.closest('.tile-pin') && !el.closest('.sub-pin'));
  reveal.forEach(el => el.classList.add('reveal'));
  ScrollTrigger.batch(reveal, {
    start: 'top 88%',
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .08, overwrite: true }),
  });

  /* ---------- small parallax ---------- */
  gsap.to('.hero-screen .screen', { rotateY: 0, rotateX: 0, y: -40, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.fromTo('.marquee .row', { x: 0 }, { x: -120, ease: 'none',
    scrollTrigger: { trigger: '.anything', start: 'top bottom', end: 'bottom top', scrub: true } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
