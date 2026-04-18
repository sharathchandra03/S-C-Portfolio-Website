    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ─── LENIS SMOOTH SCROLL ───
    const lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // ─── SMOOTH SCROLL PROGRESS ───
    let rafPending = false;
    window.addEventListener('scroll', () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrolled = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
        document.getElementById('scroll-progress').style.width = scrolled + '%';
        rafPending = false;
      });
    }, { passive: true });

    // ─── CUSTOM CURSOR ───
    const dot = document.getElementById('cursor-dot');
    const glow = document.getElementById('cursor-glow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    let cursorRafId = null;
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
      if (!cursorRafId) cursorRafId = requestAnimationFrame(animateCursor);
    });

    function animateCursor() {
      const dx = mouseX - glowX;
      const dy = mouseY - glowY;
      glowX += dx * 0.22;
      glowY += dy * 0.22;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        cursorRafId = requestAnimationFrame(animateCursor);
      } else {
        cursorRafId = null;
      }
    }

    // Hover states
    document.querySelectorAll('a, button, .service-card, .price-card, .team-card, .faq-item, .social-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hover');
        glow.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hover');
        glow.classList.remove('hover');
      });
    });

    // Show orbs after load
    setTimeout(() => {
      document.querySelectorAll('.parallax-orb').forEach(o => o.classList.add('loaded'));
    }, 300);

    // Parallax orbs on scroll (via Lenis)
    lenis.on('scroll', ({ scroll }) => {
      document.getElementById('pOrb1').style.transform = `translateY(${scroll * 0.08}px)`;
      document.getElementById('pOrb2').style.transform = `translateY(${-scroll * 0.05}px)`;
    });

    // ─── GSAP SCROLL REVEAL ───
    // Generic reveals
    gsap.utils.toArray('.reveal').forEach((el, i) => {
      const delay = el.classList.contains('reveal-delay-3') ? 0.45
        : el.classList.contains('reveal-delay-2') ? 0.3
          : el.classList.contains('reveal-delay-1') ? 0.15 : 0;
      const isCard = el.classList.contains('team-card') || el.classList.contains('service-card') || el.classList.contains('price-card');
      gsap.fromTo(el, {
        opacity: 0,
        y: 60,
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: delay,
        ease: 'power3.out',
        clearProps: isCard ? 'transform' : '',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Hero content staggered entrance
    gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.2 });
    gsap.from('.hero h1', { opacity: 0, y: 50, duration: 1, ease: 'power3.out', delay: 0.4 });
    gsap.from('.hero-sub', { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', delay: 0.65 });
    gsap.from('.hero-cta-group', { opacity: 0, y: 25, duration: 0.8, ease: 'power3.out', delay: 0.85 });
    gsap.from('.hero-stats', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 1.05 });
    gsap.from('.hero-card-float', { opacity: 0, x: 60, duration: 1.2, ease: 'power3.out', delay: 0.6 });
    gsap.from('.float-card-2', { opacity: 0, x: 40, y: -20, duration: 1, ease: 'power3.out', delay: 0.9 });
    gsap.from('.float-card-3', { opacity: 0, x: -40, y: 20, duration: 1, ease: 'power3.out', delay: 1.1 });

    // Floating animation on hero cards
    gsap.to('.hero-card-float', { y: -12, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.float-card-2', { y: 10, x: -5, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 });
    gsap.to('.float-card-3', { y: -8, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 });

    // Nav is always visible (no entrance animation to avoid opacity:0 issue)

    // Service cards stagger
    gsap.utils.toArray('.service-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Result numbers stagger
    gsap.utils.toArray('.result-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7,
          delay: i * 0.12,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // ─── ORBITAL TIMELINE ───
    (function () {
      const steps = [
        {
          id: 1, title: 'Discovery Call', badge: 'Free · 30 min', emoji: '🔍',
          color: '#FF5C1A', glow: 'rgba(255,92,26,0.4)',
          relatedIds: [2],
          content: 'We learn your business, goals, target audience, and current digital presence in a zero-pressure 30-minute audit call. No pitches - just clarity on where you stand and where you could be.',
        },
        {
          id: 2, title: 'Deep Audit', badge: 'Day 1–2', emoji: '🔬',
          color: '#7C3AED', glow: 'rgba(124,58,237,0.4)',
          relatedIds: [1, 3],
          content: 'Full teardown of your website health, SEO gaps, ad account structure, social performance, and competitor landscape. We find exactly where your money is leaking and where the real opportunity is.',
        },
        {
          id: 3, title: 'Custom Strategy', badge: 'Week 1', emoji: '🗺️',
          color: '#00D4FF', glow: 'rgba(0,212,255,0.35)',
          relatedIds: [2, 4],
          content: 'A tailored 90-day growth roadmap covering channel mix, content calendar, budget allocation, KPIs, and measurable milestones - built specifically for your business goals.',
        },
        {
          id: 4, title: 'Brand & Creative', badge: 'Week 1–2', emoji: '🎨',
          color: '#F5C518', glow: 'rgba(245,197,24,0.35)',
          relatedIds: [3, 5],
          content: 'We develop your ad creatives, social templates, video scripts, landing page copy, and brand visuals - everything aligned to your voice and engineered to convert.',
        },
        {
          id: 5, title: 'Campaign Launch', badge: 'Week 2', emoji: '🚀',
          color: '#FF5C1A', glow: 'rgba(255,92,26,0.4)',
          relatedIds: [4, 6],
          content: 'Campaigns go live across Google, Meta, Instagram - wherever your audience lives. SEO work begins. WhatsApp automation deploys. Every piece runs on the roadmap with precision.',
        },
        {
          id: 6, title: 'Optimize & Test', badge: 'Ongoing', emoji: '⚡',
          color: '#7C3AED', glow: 'rgba(124,58,237,0.4)',
          relatedIds: [5, 7],
          content: 'Daily performance monitoring, weekly A/B tests on creatives and targeting, and rapid creative iteration to squeeze maximum ROI from every rupee spent.',
        },
        {
          id: 7, title: 'Scale & Report', badge: 'Monthly', emoji: '📈',
          color: '#22c55e', glow: 'rgba(34,197,94,0.35)',
          relatedIds: [6, 1],
          content: 'Monthly strategy reviews, transparent performance dashboards, and scaling what\'s working - so your growth compounds month after month with zero guesswork.',
        },
      ];

      const orbitEl = document.getElementById('orbitalOrbit');
      const infoEl = document.getElementById('orbitalInfo');
      const cardEl = document.getElementById('orbitalCard');
      if (!orbitEl || !infoEl || !cardEl) return;

      let rotAngle = 0;
      let autoRotate = true;
      let activeId = null;
      const nodeEls = {};

      function getRadius() {
        const w = orbitEl.offsetWidth;
        if (w < 380) return 120;
        if (w < 600) return 155;
        return 200;
      }

      function updateRing() {
        const r = getRadius();
        const ring = document.getElementById('orbitalRing');
        if (ring) { ring.style.width = (r * 2) + 'px'; ring.style.height = (r * 2) + 'px'; }
      }
      updateRing();
      window.addEventListener('resize', updateRing);

      // Build nodes
      steps.forEach(step => {
        const node = document.createElement('div');
        node.className = 'orbital-node';
        node.innerHTML = `
          <div class="orbital-node-btn" style="border-color:${step.color};color:${step.color}"></div>
          <div class="orbital-node-label">${step.title}</div>
        `;
        node.querySelector('.orbital-node-btn').textContent = step.emoji;
        node.addEventListener('click', e => { e.stopPropagation(); toggleStep(step.id); });
        orbitEl.appendChild(node);
        nodeEls[step.id] = { wrap: node, btn: node.querySelector('.orbital-node-btn'), lbl: node.querySelector('.orbital-node-label') };
      });

      document.getElementById('orbitalCanvas').addEventListener('click', function (e) {
        if (!e.target.closest('.orbital-node') && !e.target.closest('.orbital-card-overlay')) deactivate();
      });

      function toggleStep(id) { activeId === id ? deactivate() : activateStep(id); }

      window.orbitalActivate = function (id) { activateStep(id); };

      function activateStep(id) {
        activeId = id;
        autoRotate = false;

        // Snap active node to top (270° = 12 o'clock) and apply immediately
        const idx = steps.findIndex(s => s.id === id);
        rotAngle = 270 - (idx / steps.length) * 360;
        updatePositions(); // flush positions synchronously so nodes are in place before card appears

        const step = steps.find(s => s.id === id);

        steps.forEach(s => {
          const { btn, lbl } = nodeEls[s.id];
          btn.classList.remove('active', 'related');
          btn.style.cssText = `border-color:${s.color};color:${s.color};background:var(--surface);box-shadow:none`;
          lbl.classList.remove('lit');
          if (s.id === id) {
            btn.classList.add('active');
            btn.style.cssText = `border-color:${step.color};background:${step.color};color:#fff;box-shadow:0 0 22px ${step.glow}`;
            lbl.classList.add('lit');
          } else if (step.relatedIds.includes(s.id)) {
            btn.classList.add('related');
          }
        });

        // Render card inside the orbit area
        const rel = step.relatedIds.map(rid => steps.find(s => s.id === rid));
        cardEl.className = 'orbital-card-overlay active';
        cardEl.innerHTML = `
          <div class="orbital-info-inner" style="border-color:${step.color}44">
            <div class="orbital-info-header">
              <span class="orbital-info-emoji">${step.emoji}</span>
              <div>
                <div class="orbital-info-num">Step 0${step.id}</div>
                <div class="orbital-info-title" style="color:${step.color}">${step.title}</div>
              </div>
              <span class="orbital-info-badge" style="color:${step.color};border-color:${step.color}44;background:${step.color}18">${step.badge}</span>
            </div>
            <p class="orbital-info-text">${step.content}</p>
            ${rel.length ? `<div class="orbital-info-connected">
              <span>Connected:</span>
              ${rel.map(r => `<button class="orbital-conn-btn" onclick="event.stopPropagation();orbitalActivate(${r.id})" style="color:${r.color};border-color:${r.color}44">${r.emoji} ${r.title}</button>`).join('')}
            </div>` : ''}
          </div>`;

        infoEl.innerHTML = '<p class="orbital-hint">Click outside the card or on another node to continue</p>';
      }

      function deactivate() {
        activeId = null;
        autoRotate = true;
        steps.forEach(s => {
          const { btn, lbl } = nodeEls[s.id];
          btn.classList.remove('active', 'related');
          btn.style.cssText = `border-color:${s.color};color:${s.color};background:var(--surface);box-shadow:none`;
          lbl.classList.remove('lit');
        });
        cardEl.className = 'orbital-card-overlay';
        cardEl.innerHTML = '';
        infoEl.innerHTML = '<p class="orbital-hint">Click any step to explore the details</p>';
      }

      function updatePositions() {
        const total = steps.length;
        const r = getRadius();
        const activeStep = activeId ? steps.find(s => s.id === activeId) : null;
        steps.forEach((step, i) => {
          const angle = ((i / total) * 360 + rotAngle) % 360;
          const rad   = (angle * Math.PI) / 180;
          const x = r * Math.cos(rad);
          const y = r * Math.sin(rad);
          const baseOp = Math.max(0.4, 0.4 + 0.6 * ((1 + Math.sin(rad)) / 2));
          const opacity = activeId === null ? baseOp
            : (activeId === step.id || activeStep?.relatedIds.includes(step.id)) ? 1 : 0.22;
          const el = nodeEls[step.id].wrap;
          el.style.transform = `translate(${x}px, ${y}px)`;
          el.style.opacity   = opacity;
        });
      }

      let orbVisible = false;
      let orbRafId = null;
      const orbObserver = new IntersectionObserver(entries => {
        orbVisible = entries[0].isIntersecting;
        if (orbVisible && !orbRafId) orbRafId = requestAnimationFrame(animate);
      }, { threshold: 0 });
      orbObserver.observe(document.getElementById('orbitalCanvas'));

      function animate() {
        if (!orbVisible) { orbRafId = null; return; }
        if (autoRotate) rotAngle = (rotAngle + 0.22) % 360;
        updatePositions();
        orbRafId = requestAnimationFrame(animate);
      }
      orbRafId = requestAnimationFrame(animate);
    }());


    // ─── PROCESS FALLING PATTERN ───
    (function () {
      const el = document.getElementById('processFalling');
      if (!el) return;

      const C = 'rgba(255,92,26,0.45)'; // subtle orange brand color

      // Each row: [Y in tile, tile-height] - 12 rows matching the component
      const rows = [
        [235,235],[252,252],[150,150],[253,253],[204,204],
        [134,134],[179,179],[299,299],[215,215],[281,281],
        [158,158],[210,210]
      ];

      // 3 gradients per row: left line, right line, center dot
      const images = rows.flatMap(([y]) => [
        `radial-gradient(4px 100px at 0px ${y}px, ${C}, transparent)`,
        `radial-gradient(4px 100px at 300px ${y}px, ${C}, transparent)`,
        `radial-gradient(1.5px 1.5px at 150px ${(y/2).toFixed(1)}px, ${C} 100%, transparent 150%)`
      ]);

      const sizes = rows.flatMap(([y, h]) => [
        `300px ${h}px`, `300px ${h}px`, `300px ${h}px`
      ]);

      // Start / end positions from the original component (drives the falling motion)
      const start = '0px 220px,3px 220px,151.5px 337.5px,25px 24px,28px 24px,176.5px 150px,50px 16px,53px 16px,201.5px 91px,75px 224px,78px 224px,226.5px 230.5px,100px 19px,103px 19px,251.5px 121px,125px 120px,128px 120px,276.5px 187px,150px 31px,153px 31px,301.5px 120.5px,175px 235px,178px 235px,326.5px 384.5px,200px 121px,203px 121px,351.5px 228.5px,225px 224px,228px 224px,376.5px 364.5px,250px 26px,253px 26px,401.5px 105px,275px 75px,278px 75px,426.5px 180px';
      const end   = '0px 6800px,3px 6800px,151.5px 6917.5px,25px 13632px,28px 13632px,176.5px 13758px,50px 5416px,53px 5416px,201.5px 5491px,75px 17175px,78px 17175px,226.5px 17301.5px,100px 5119px,103px 5119px,251.5px 5221px,125px 8428px,128px 8428px,276.5px 8495px,150px 9876px,153px 9876px,301.5px 9965.5px,175px 13391px,178px 13391px,326.5px 13540.5px,200px 14741px,203px 14741px,351.5px 14848.5px,225px 18770px,228px 18770px,376.5px 18910.5px,250px 5082px,253px 5082px,401.5px 5161px,275px 6375px,278px 6375px,426.5px 6480px';

      // Inject keyframes + apply styles via a <style> tag
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fallingPattern {
          from { background-position: ${start} }
          to   { background-position: ${end}   }
        }
      `;
      document.head.appendChild(style);

      el.style.backgroundImage    = images.join(', ');
      el.style.backgroundSize     = sizes.join(', ');
      el.style.backgroundRepeat   = 'repeat';
      el.style.animation          = 'fallingPattern 150s linear infinite';
      el.style.backgroundColor    = 'transparent';

      // Pause when off-screen
      const obs = new IntersectionObserver(entries => {
        el.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
      }, { threshold: 0 });
      obs.observe(el.closest('section'));
    }());

    // ─── PAUSE FALLING PATTERN DURING SCROLL (eliminates jank) ───
    (function () {
      const falling = document.getElementById('processFalling');
      if (!falling) return;
      let resumeTimer = null;
      window.addEventListener('scroll', () => {
        falling.style.animationPlayState = 'paused';
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          falling.style.animationPlayState = 'running';
        }, 180);
      }, { passive: true });
    }());

    // Marquee track hover pause
    const marqueeTrack = document.getElementById('marqueeTrack');
    if (marqueeTrack) {
      marqueeTrack.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
      marqueeTrack.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
    }

    // ─── NAV LIMELIGHT ───
    (function () {
      const limelight = document.getElementById('navLimelight');
      const navLinks = document.querySelectorAll('.nav-links a');
      const navInner = document.querySelector('.nav-inner');
      if (!limelight || !navInner) return;

      // Pre-cache section offsets (recomputed only on resize)
      const sectionIds = ['services', 'why', 'pricing', 'automation', 'team', 'faq', 'contact'];
      let sectionTops = [];
      function cacheSectionTops() {
        sectionTops = sectionIds.map(id => {
          const el = document.getElementById(id);
          return el ? { id, top: el.offsetTop } : null;
        }).filter(Boolean);
      }
      cacheSectionTops();
      window.addEventListener('resize', cacheSectionTops, { passive: true });

      function moveLimelight(linkEl) {
        const navRect = navInner.getBoundingClientRect();
        const linkRect = linkEl.getBoundingClientRect();
        const left = linkRect.left - navRect.left + linkRect.width / 2 - 22;
        limelight.style.left = left + 'px';
        limelight.style.opacity = '1';
        navLinks.forEach(a => a.classList.remove('nav-active'));
        linkEl.classList.add('nav-active');
      }

      // Click lock - prevents scroll from overriding clicked link during Lenis scroll
      let clickLockTimer = null;
      let clickLocked = false;

      navLinks.forEach(a => {
        a.addEventListener('click', () => {
          moveLimelight(a);
          clickLocked = true;
          clearTimeout(clickLockTimer);
          clickLockTimer = setTimeout(() => { clickLocked = false; }, 1400);
        });
      });

      // Throttled scroll handler - runs at most once per rAF
      let scrollRafPending = false;
      window.addEventListener('scroll', () => {
        if (scrollRafPending || clickLocked) return;
        scrollRafPending = true;
        requestAnimationFrame(() => {
          scrollRafPending = false;
          const offset = window.scrollY + 130;
          let active = null;
          for (let i = sectionTops.length - 1; i >= 0; i--) {
            if (sectionTops[i].top <= offset) { active = sectionTops[i].id; break; }
          }
          if (active) {
            const link = document.querySelector(`.nav-links a[href="#${active}"]`);
            if (link) moveLimelight(link);
          } else {
            limelight.style.opacity = '0';
            navLinks.forEach(a => a.classList.remove('nav-active'));
          }
        });
      }, { passive: true });
    }());

    // ─── LOGO SCROLL TO TOP ───
    document.getElementById('logoLink').addEventListener('click', function (e) {
      e.preventDefault();
      lenis.scrollTo(0, { duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      document.getElementById('navLimelight').style.opacity = '0';
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('nav-active'));
    });

    // ─── HOVER GLOW BUTTONS ───
    (function () {
      document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
        const glow = document.createElement('span');
        glow.className = 'btn-glow-el';
        btn.insertBefore(glow, btn.firstChild);

        btn.addEventListener('mousemove', e => {
          const r = btn.getBoundingClientRect();
          glow.style.left = (e.clientX - r.left) + 'px';
          glow.style.top  = (e.clientY - r.top)  + 'px';
          glow.style.opacity = '1';
        });
        btn.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
      });
    }());

    // ─── NAV SCROLL EFFECT ───
    (function() {
      const navbar = document.getElementById('navbar');
      let navRafPending = false;
      window.addEventListener('scroll', () => {
        if (navRafPending) return;
        navRafPending = true;
        requestAnimationFrame(() => {
          navRafPending = false;
          navbar.classList.toggle('scrolled', scrollY > 60);
        });
      }, { passive: true });
    }());

    // ─── MOBILE MENU ───
    function toggleMobile() {
      const m = document.getElementById('mobileMenu');
      m.style.display = m.style.display === 'none' ? 'flex' : 'none';
      m.style.flexDirection = 'column';
    }

    // ─── PRICING SECTION ───
    (function() {
      // -- Sparkles canvas --
      const canvas = document.getElementById('priceCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let W, H, sparks = [];

      function resizeCanvas() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      function randBetween(a, b) { return a + Math.random() * (b - a); }

      function createSpark() {
        return {
          x: randBetween(0, W),
          y: randBetween(0, H),
          r: randBetween(0.6, 1.8),
          alpha: 0,
          maxAlpha: randBetween(0.4, 0.9),
          life: 0,
          maxLife: randBetween(60, 160),
          vx: randBetween(-0.15, 0.15),
          vy: randBetween(-0.4, -0.1),
          color: Math.random() > 0.55 ? '#FF5C1A' : '#fff'
        };
      }

      for (let i = 0; i < 55; i++) {
        const s = createSpark();
        s.life = Math.floor(Math.random() * s.maxLife);
        s.alpha = (s.life / s.maxLife) * s.maxAlpha;
        sparks.push(s);
      }

      let sparksVisible = false;
      const sparksObserver = new IntersectionObserver(entries => {
        sparksVisible = entries[0].isIntersecting;
        if (sparksVisible) requestAnimationFrame(animateSparks);
      }, { threshold: 0 });
      sparksObserver.observe(canvas);

      let sparksRafId = null;
      function animateSparks() {
        if (!sparksVisible) { sparksRafId = null; return; }
        ctx.clearRect(0, 0, W, H);
        // Draw orange sparks first, then white (avoid repeated shadow switches)
        ['#FF5C1A', '#fff'].forEach(col => {
          ctx.fillStyle = col;
          ctx.shadowColor = col;
          sparks.forEach((s, i) => {
            if (s.color !== col) return;
            s.life++;
            const t = s.life / s.maxLife;
            s.alpha = t < 0.3 ? (t / 0.3) * s.maxAlpha : t > 0.7 ? ((1 - t) / 0.3) * s.maxAlpha : s.maxAlpha;
            s.x += s.vx;
            s.y += s.vy;
            ctx.globalAlpha = s.alpha;
            ctx.shadowBlur = s.r * 4;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
            if (s.life >= s.maxLife) sparks[i] = createSpark();
          });
        });
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        sparksRafId = requestAnimationFrame(animateSparks);
      }

      // -- VCR heading reveal --
      const heading = document.getElementById('priceHeading');
      if (heading) {
        const obs = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            heading.classList.add('revealed');
            obs.disconnect();
          }
        }, { threshold: 0.3 });
        obs.observe(heading);
      }

      // -- Toggle pill positioning --
      const wrap    = document.getElementById('priceToggleWrap');
      const pill    = document.getElementById('ptogglePill');
      const btnM    = document.getElementById('ptoggleMonthly');
      const btnQ    = document.getElementById('ptoggleQuarterly');

      function positionPill(target) {
        const wRect = wrap.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        pill.style.width     = tRect.width + 'px';
        pill.style.transform = `translateX(${tRect.left - wRect.left - 4}px)`;
      }

      // Position on load after layout
      requestAnimationFrame(() => positionPill(btnM));
      window.addEventListener('resize', () => {
        positionPill(document.querySelector('.ptoggle-btn.active'));
      });

      // -- Digit-slot roller --
      function buildSlots(el) {
        const raw = el.dataset.monthly || el.textContent.trim();
        el.innerHTML = '';
        [...raw].forEach(ch => {
          if (/\d/.test(ch)) {
            const slot = document.createElement('span');
            slot.className = 'digit-slot';
            const strip = document.createElement('span');
            strip.className = 'digit-strip';
            for (let i = 0; i <= 9; i++) {
              const d = document.createElement('span');
              d.textContent = i;
              strip.appendChild(d);
            }
            const n = parseInt(ch);
            strip.style.transform = `translateY(-${n * 10}%)`;
            slot.appendChild(strip);
            el.appendChild(slot);
          } else {
            const s = document.createElement('span');
            s.className = 'price-num-static';
            s.textContent = ch;
            el.appendChild(s);
          }
        });
      }

      function rollTo(el, newText) {
        const strips = el.querySelectorAll('.digit-strip');
        const digits = [...newText].filter(c => /\d/.test(c));
        if (strips.length !== digits.length) {
          el.dataset.monthly = el.dataset.monthly; // keep data
          buildSlots(el);
          return;
        }
        digits.forEach((d, i) => {
          strips[i].style.transform = `translateY(-${parseInt(d) * 10}%)`;
        });
      }

      // Initialise slots for each price number
      document.querySelectorAll('.price-num').forEach(el => buildSlots(el));

      let pricingMode = 'monthly';

      window.setPriceBilling = function(mode) {
        if (mode === pricingMode) return;
        pricingMode = mode;
        const isQ = mode === 'quarterly';
        btnM.classList.toggle('active', !isQ);
        btnQ.classList.toggle('active',  isQ);
        positionPill(isQ ? btnQ : btnM);
        document.querySelectorAll('.price-num').forEach(el => {
          const target = isQ ? el.dataset.quarterly : el.dataset.monthly;
          rollTo(el, target);
        });
      };
    })();

    // ─── SPLINE: preload asset, start WebGL only near FAQ, fully stop when far away ───
    (function () {
      const viewer = document.getElementById('faqSplineViewer');
      const loader = document.getElementById('faqSplineLoader');
      const wrap   = viewer ? viewer.closest('.faq-spline-wrap') || viewer.parentElement : null;
      if (!viewer || !wrap) return;

      const SPLINE_SRC = viewer.dataset.splineSrc;
      let loaded = false;
      let active = false;

      function stripBranding() {
        const sr = viewer.shadowRoot;
        if (!sr) return;
        let s = sr.querySelector('#snc-hide-brand');
        if (!s) { s = document.createElement('style'); s.id = 'snc-hide-brand'; sr.appendChild(s); }
        s.textContent = `
          #logo, .logo, [class*="logo"], [id*="logo"],
          a[href*="spline"], [class*="watermark"], [class*="brand"],
          [class*="Built"], [class*="built"],
          div[style*="z-index: 10000"], div[style*="z-index:10000"],
          div[style*="position: fixed"], div[style*="position:fixed"]
          { display:none !important; opacity:0 !important; pointer-events:none !important }
        `;
        sr.querySelectorAll('a, [class*="logo"], [class*="brand"], [class*="watermark"]').forEach(el => {
          if (el.textContent.toLowerCase().includes('spline') || el.href?.includes('spline')) {
            el.style.cssText = 'display:none!important';
          }
        });
      }

      function hideLoader() {
        if (!loader) return;
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 800);
      }

      function startViewer() {
        if (active) return;
        active = true;
        if (!loaded) {
          viewer.addEventListener('load', function onLoad() {
            loaded = true;
            hideLoader();
            stripBranding();
            [100, 300, 600, 1200, 2500, 5000].forEach(t => setTimeout(stripBranding, t));
            if (viewer.shadowRoot) {
              new MutationObserver(stripBranding).observe(viewer.shadowRoot, { childList: true, subtree: true });
            }
          }, { once: true });
          setTimeout(hideLoader, 15000);
        }
        viewer.setAttribute('url', SPLINE_SRC);
      }

      function stopViewer() {
        if (!active) return;
        active = false;
        // Removing url fully kills the WebGL render loop - reloads from cache when restored
        viewer.removeAttribute('url');
        // Show loader again so there's no blank flash when coming back
        if (loaded && loader) { loader.style.display = 'flex'; loader.style.opacity = '1'; }
      }

      // Start loading immediately so robot is ready when user arrives
      startViewer();

      // Stop WebGL when user is far from FAQ, restart from cache when coming back
      new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) startViewer();
        else stopViewer();
      }, { threshold: 0, rootMargin: '600px 0px' }).observe(wrap);
    }());

    // ─── FAQ ───
    function toggleFaq(el) {
      const wasOpen = el.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-icon').textContent = '+'; });
      if (!wasOpen) { el.classList.add('open'); el.querySelector('.faq-icon').textContent = '−'; }
    }

    // ─── FORM SUBMIT ───
    const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwIAuU40eWiudcykr_oeFkG1zuk18_5WDJvxPme3dCnHDtLkrM4X1jg75DWjmtsEEb-/exec';

    async function handleForm(event) {
      const btn = event.target.closest('button');

      const name     = document.getElementById('f-name').value.trim();
      const business = document.getElementById('f-business').value.trim();
      const email    = document.getElementById('f-email').value.trim();
      const phone    = document.getElementById('f-phone').value.trim();
      const service  = document.getElementById('f-service').value;
      const budget   = document.getElementById('f-budget').value;
      const goals    = document.getElementById('f-goals').value.trim();

      if (!name || !email || !phone) {
        alert('Please fill in your Name, Email, and Phone number.');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending...';

      const date = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      try {
        const params = new URLSearchParams({
          date,
          name,
          businessname:     business,
          email,
          phone,
          serviceintrested: service,
          monthlybudget:    budget,
          businessgoals:    goals
        });
        await fetch(SHEET_URL + '?' + params.toString(), { mode: 'no-cors' });

        btn.textContent = '✅ Message Sent!';
        btn.style.background = '#22c55e';
        ['f-name','f-business','f-email','f-phone','f-goals'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('f-service').selectedIndex = 0;
        document.getElementById('f-budget').selectedIndex = 0;

      } catch (err) {
        alert('Could not send message. Please check your internet connection.');
        btn.textContent = '❌ Failed · Retry';
        btn.style.background = '#ef4444';
      }

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Send Message & Book Call';
        btn.style.background = '';
      }, 3500);
    }

    // ─── SERVICE CARD SPOTLIGHT ───
    document.querySelectorAll('.service-card').forEach(card => {
      const spotlight = card.querySelector('.service-spotlight');
      if (!spotlight) return;
      let spotPending = false;
      card.addEventListener('mousemove', e => {
        if (spotPending) return;
        spotPending = true;
        requestAnimationFrame(() => {
          spotPending = false;
          const rect = card.getBoundingClientRect();
          spotlight.style.left = (e.clientX - rect.left) + 'px';
          spotlight.style.top  = (e.clientY - rect.top)  + 'px';
        });
      });
    });

    // ─── 3D CARD TILT ───
    document.querySelectorAll('.service-card, .price-card, .team-card').forEach(card => {
      let tiltPending = false;
      card.addEventListener('mousemove', e => {
        if (tiltPending) return;
        tiltPending = true;
        requestAnimationFrame(() => {
          tiltPending = false;
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, translateY: -8, duration: 0.4, ease: 'power2.out', transformPerspective: 1000 });
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, translateY: 0, duration: 0.6, ease: 'power3.out', transformPerspective: 1000 });
      });
    });

    // ─── MAGNETIC CTA BUTTONS ───
    document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
      let magPending = false;
      btn.addEventListener('mousemove', e => {
        if (magPending) return;
        magPending = true;
        requestAnimationFrame(() => {
          magPending = false;
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.3;
          const y = (e.clientY - r.top - r.height / 2) * 0.3;
          gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
      });
    });

    // ─── COUNTER ANIMATION ───
    function animateCount(el, target, suffix) {
      let n = 0;
      const step = Math.max(1, Math.ceil(target / 80));
      const iv = setInterval(() => {
        n = Math.min(n + step, target);
        el.innerHTML = n + suffix;
        if (n >= target) clearInterval(iv);
      }, 20);
    }
    const nums = document.querySelectorAll('.stat-item .num, .result-num');
    const io2 = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.counted) {
          e.target.dataset.counted = 1;
          const t = e.target.textContent;
          if (t.includes('200')) animateCount(e.target, 200, '<span>+</span>');
          else if (t.includes('5×') || t.includes('5')) animateCount(e.target, 5, '<span>×</span>');
          else if (t.includes('98')) animateCount(e.target, 98, '<span>%</span>');
          else if (t.includes('312')) animateCount(e.target, 312, '<span class="accent">%</span>');
          else if (t.includes('48')) animateCount(e.target, 48, '<span class="accent">hr</span>');
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(n => io2.observe(n));

    // Section label strobe-in
    gsap.utils.toArray('.section-label').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // ─── SMOOTH ANCHOR NAVIGATION ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -80, duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        }
      });
    });

    // ─── GOOEY TEXT MORPH ───
    (function () {
      const texts = [
        'Big Together.',
        'Iconic Together.',
        'Legendary Together.',
        'Fearless Together.',
        'Unstoppable Together.',
        'Viral Together.',
        'Dominant Together.',
        'Bold Together.',
        'Remarkable Together.',
        'Extraordinary Together.',
        'Record-Breaking Together.',
        'Unforgettable Together.',
      ];
      const morphTime = 1.2;
      const cooldownTime = 2.2;

      const t1 = document.getElementById('gooey-t1');
      const t2 = document.getElementById('gooey-t2');
      if (!t1 || !t2) return;

      let textIndex = 0;
      let morph = 0;
      let cooldown = cooldownTime;
      let lastTime = performance.now();
      let gooeyVisible = false;
      let gooeyRafId = null;

      t1.textContent = texts[0];
      t2.textContent = texts[1];

      new IntersectionObserver(entries => {
        gooeyVisible = entries[0].isIntersecting;
        if (gooeyVisible && !gooeyRafId) { lastTime = performance.now(); gooeyRafId = requestAnimationFrame(animate); }
      }, { threshold: 0 }).observe(t1.closest('section') || t1.parentElement);

      function setMorph(fraction) {
        t2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        t2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
        const f2 = 1 - fraction;
        t1.style.filter = `blur(${Math.min(8 / f2 - 8, 100)}px)`;
        t1.style.opacity = `${Math.pow(f2, 0.4) * 100}%`;
      }

      function doCooldown() {
        morph = 0;
        t2.style.filter = '';
        t2.style.opacity = '100%';
        t1.style.filter = '';
        t1.style.opacity = '0%';
      }

      function animate(now) {
        if (!gooeyVisible) { gooeyRafId = null; return; }
        gooeyRafId = requestAnimationFrame(animate);
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        const wasCooling = cooldown > 0;
        cooldown -= dt;
        if (cooldown <= 0) {
          if (wasCooling) {
            textIndex = (textIndex + 1) % texts.length;
            t1.textContent = texts[textIndex];
            t2.textContent = texts[(textIndex + 1) % texts.length];
          }
          morph -= cooldown;
          cooldown = 0;
          let fraction = morph / morphTime;
          if (fraction > 1) {
            cooldown = cooldownTime;
            fraction = 1;
          }
          setMorph(fraction);
        } else {
          doCooldown();
        }
      }
    }());

    // ─── CONTACT: INFINITE GRID ───
    (function initContactGrid() {
      const inner   = document.getElementById('contactInner');
      const cgBase  = document.getElementById('cgBase');
      const cgHover = document.getElementById('cgHover');
      if (!inner || !cgBase || !cgHover) return;

      let gx = 0, gy = 0;
      let mx = -999, my = -999;

      inner.addEventListener('mousemove', function(e) {
        const r = inner.getBoundingClientRect();
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
      });

      inner.addEventListener('mouseleave', function() {
        mx = -999; my = -999;
      });

      let gridVisible = false;
      let gridRafId = null;
      new IntersectionObserver(entries => {
        gridVisible = entries[0].isIntersecting;
        if (gridVisible && !gridRafId) gridRafId = requestAnimationFrame(tick);
      }, { threshold: 0 }).observe(inner);

      function tick() {
        if (!gridVisible) { gridRafId = null; return; }
        gx = (gx + 0.5) % 40;
        gy = (gy + 0.5) % 40;
        const pos = gx + 'px ' + gy + 'px';
        cgBase.style.backgroundPosition  = pos;
        cgHover.style.backgroundPosition = pos;
        const mask = 'radial-gradient(300px circle at ' + mx + 'px ' + my + 'px, black, transparent)';
        cgHover.style.webkitMaskImage = mask;
        cgHover.style.maskImage       = mask;
        gridRafId = requestAnimationFrame(tick);
      }
    }());

    // ─── LIGHTNING SPLIT COMPARISON ───
    (function initLightningSplit() {
      const container = document.getElementById('lightningSplit');
      if (!container) return;

      // Skip on touch/mobile – mobile CSS already handles layout
      if (window.matchMedia('(max-width: 768px)').matches) return;

      const leftPanel  = document.getElementById('lsPanelLeft');
      const rightPanel = document.getElementById('lsPanelRight');
      const poly1 = document.getElementById('lsPoly1');
      const poly2 = document.getElementById('lsPoly2');
      const poly3 = document.getElementById('lsPoly3');

      const CFG = {
        segments: 48,
        amps:   [0.4, -0.8,  0.6],
        freqs:  [0.7,  2.7,  3.9],
        speeds: [-1.32, 0.42, 0.95],
        shimmer: { speed: 4.2, freq: 8.5, amp: 0.25 },
        easeStiffness: 6,
        clipOffset: 25,
      };

      let targetPos  = 60;
      let displayPos = 60;
      let time = 0;
      let lastTs = 0;
      let splitVisible = false;
      let splitRafId = null;
      new IntersectionObserver(entries => {
        splitVisible = entries[0].isIntersecting;
        if (splitVisible && !splitRafId) splitRafId = requestAnimationFrame(function(ts) { lastTs = ts; splitRafId = requestAnimationFrame(tick); });
      }, { threshold: 0 }).observe(container);

      function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

      function tick(ts) {
        if (!splitVisible) { splitRafId = null; return; }
        const dt = Math.min(0.05, (ts - lastTs) / 1000);
        lastTs = ts;
        time += dt;

        displayPos += (targetPos - displayPos) * (1 - Math.exp(-CFG.easeStiffness * dt));

        const topX    = clamp(displayPos, 0, 100);
        const bottomX = clamp(displayPos - CFG.clipOffset, 0, 100);
        const pts = [];

        for (let i = 0; i <= CFG.segments; i++) {
          const t = i / CFG.segments;
          const base = topX * (1 - t) + bottomX * t;
          let off = 0;
          for (let k = 0; k < CFG.amps.length; k++) {
            off += CFG.amps[k] * Math.sin(2 * Math.PI * (CFG.freqs[k] * t + CFG.speeds[k] * time) + k * 1.3);
          }
          off += CFG.shimmer.amp * Math.sin(2 * Math.PI * (CFG.shimmer.freq * t + CFG.shimmer.speed * time));
          pts.push({ x: clamp(base + off, 0, 100), y: t * 100 });
        }

        const polyStr = pts.map(p => p.x + ',' + p.y).join(' ');
        poly1.setAttribute('points', polyStr);
        poly2.setAttribute('points', polyStr);
        poly3.setAttribute('points', polyStr);

        const edgeStr = pts.map(p => p.x + '% ' + p.y + '%').join(', ');
        // Left panel: everything to the LEFT of the wave
        const leftClip = 'polygon(0% 0%, ' + edgeStr + ', 0% 100%)';
        leftPanel.style.clipPath = leftClip;
        leftPanel.style.webkitClipPath = leftClip;
        // Right panel: everything to the RIGHT of the wave (mirror)
        const rightClip = 'polygon(' + edgeStr + ', 100% 100%, 100% 0%)';
        rightPanel.style.clipPath = rightClip;
        rightPanel.style.webkitClipPath = rightClip;

        splitRafId = requestAnimationFrame(tick);
      }

      container.addEventListener('mousemove', function(e) {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        targetPos = x < 50 ? 110 : 20;
        container.classList.add('ls-active');
      });

      container.addEventListener('mouseleave', function() {
        targetPos = 60;
        container.classList.remove('ls-active');
      });
    }());

    // ─── HERO VIDEO AUTOPLAY RECOVERY ───
    (function() {
      var video = document.getElementById('heroVideo');
      if (!video) return;
      function tryPlay() { if (video.paused) video.play().catch(function(){}); }
      document.addEventListener('visibilitychange', function() { if (!document.hidden) tryPlay(); });
      window.addEventListener('pageshow', tryPlay);
      var ioV = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) tryPlay();
      }, { threshold: 0.1 });
      ioV.observe(video);
    }());

