(() => {
  const root = document.documentElement;
  const body = document.body;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  if (!hasGSAP || reduceMotion) root.classList.remove("js");

  /* ---------------------------------------------------------
     Smooth scroll
     --------------------------------------------------------- */
  let lenis = null;
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis && !reduceMotion) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  const header = $("#header");
  const headerOffset = () => header.offsetHeight - 1;

  const scrollToEl = (el) => {
    if (lenis) lenis.scrollTo(el, { offset: -headerOffset(), duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerOffset(), behavior: "smooth" });
  };

  const lockScroll = (lock) => {
    body.classList.toggle("no-scroll", lock);
    if (lenis) (lock ? lenis.stop() : lenis.start());
  };

  /* ---------------------------------------------------------
     Header + mobile nav
     --------------------------------------------------------- */
  const topbar = $(".topbar");
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > topbar.offsetHeight);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = $(".burger");
  const setNav = (open) => {
    body.classList.toggle("nav-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  burger.addEventListener("click", () => setNav(!body.classList.contains("nav-open")));

  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      setNav(false);
      if (typeof closeLightbox === "function") closeLightbox();
      scrollToEl(target);
    })
  );

  /* ---------------------------------------------------------
     Decoration showcase gallery
     --------------------------------------------------------- */
  const CATEGORIES = {
    housewarming: { label: "Housewarming" },
    lighting: { label: "Lighting" },
    "name-board": { label: "Entrance Decor" },
    "office-inauguration": { label: "Office Inauguration" },
    wedding: { label: "Wedding" },
  };

  const LOOKS = [
    { id: "hw-intro", cat: "housewarming", file: "intro", title: "Housewarming decor" },
    { id: "hw-1", cat: "housewarming", file: "1", title: "Housewarming decor" },
    { id: "hw-2", cat: "housewarming", file: "2", title: "Housewarming decor" },
    { id: "hw-3", cat: "housewarming", file: "3", title: "Housewarming decor" },
    { id: "hw-4", cat: "housewarming", file: "4", title: "Housewarming decor" },
    { id: "hw-5", cat: "housewarming", file: "5", title: "Housewarming decor" },
    { id: "hw-6", cat: "housewarming", file: "6", title: "Housewarming decor" },
    { id: "hw-7", cat: "housewarming", file: "7", title: "Housewarming decor" },
    { id: "hw-8", cat: "housewarming", file: "8", title: "Housewarming decor" },

    { id: "lt-intro", cat: "lighting", file: "intro", title: "Lighting decor" },
    { id: "lt-1", cat: "lighting", file: "1", title: "Lighting decor" },
    { id: "lt-2", cat: "lighting", file: "2", title: "Lighting decor" },
    { id: "lt-3", cat: "lighting", file: "3", title: "Lighting decor" },
    { id: "lt-4", cat: "lighting", file: "4", title: "Lighting decor" },
    { id: "lt-5", cat: "lighting", file: "5", title: "Lighting decor" },
    { id: "lt-6", cat: "lighting", file: "6", title: "Lighting decor" },
    { id: "lt-7", cat: "lighting", file: "7", title: "Lighting decor" },
    { id: "lt-8", cat: "lighting", file: "8", title: "Lighting decor" },
    { id: "lt-9", cat: "lighting", file: "9", title: "Lighting decor" },
    { id: "lt-10", cat: "lighting", file: "10", title: "Lighting decor" },

    { id: "nb-intro", cat: "name-board", file: "intro", title: "Entrance Decor" },
    { id: "nb-1", cat: "name-board", file: "1", title: "Entrance Decor" },
    { id: "nb-2", cat: "name-board", file: "2", title: "Entrance Decor" },
    { id: "nb-3", cat: "name-board", file: "3", title: "Entrance Decor" },
    { id: "nb-4", cat: "name-board", file: "4", title: "Entrance Decor" },
    { id: "nb-5", cat: "name-board", file: "5", title: "Entrance Decor" },
    { id: "nb-6", cat: "name-board", file: "6", title: "Entrance Decor" },
    { id: "nb-7", cat: "name-board", file: "7", title: "Entrance Decor" },
    { id: "nb-8", cat: "name-board", file: "8", title: "Entrance Decor" },
    { id: "nb-9", cat: "name-board", file: "9", title: "Entrance Decor" },
    { id: "nb-10", cat: "name-board", file: "10", title: "Entrance Decor" },

    { id: "oi-intro", cat: "office-inauguration", file: "intro", title: "Office inauguration decor" },
    { id: "oi-1", cat: "office-inauguration", file: "1", title: "Office inauguration decor" },
    { id: "oi-2", cat: "office-inauguration", file: "2", title: "Office inauguration decor" },
    { id: "oi-3", cat: "office-inauguration", file: "3", title: "Office inauguration decor" },
    { id: "oi-4", cat: "office-inauguration", file: "4", title: "Office inauguration decor" },
    { id: "oi-5", cat: "office-inauguration", file: "5", title: "Office inauguration decor" },
    { id: "oi-6", cat: "office-inauguration", file: "6", title: "Office inauguration decor" },
    { id: "oi-7", cat: "office-inauguration", file: "7", title: "Office inauguration decor" },
    { id: "oi-8", cat: "office-inauguration", file: "8", title: "Office inauguration decor" },
    { id: "oi-9", cat: "office-inauguration", file: "9", title: "Office inauguration decor" },

    { id: "wd-intro", cat: "wedding", file: "intro", title: "Wedding decor" },
    { id: "wd-1", cat: "wedding", file: "1", title: "Wedding decor" },
    { id: "wd-2", cat: "wedding", file: "2", title: "Wedding decor" },
    { id: "wd-3", cat: "wedding", file: "3", title: "Wedding decor" },
    { id: "wd-4", cat: "wedding", file: "4", title: "Wedding decor" },
    { id: "wd-5", cat: "wedding", file: "5", title: "Wedding decor" },
    { id: "wd-6", cat: "wedding", file: "6", title: "Wedding decor" },
    { id: "wd-7", cat: "wedding", file: "7", title: "Wedding decor" },
    { id: "wd-8", cat: "wedding", file: "8", title: "Wedding decor" },
    { id: "wd-9", cat: "wedding", file: "9", title: "Wedding decor" },
    { id: "wd-10", cat: "wedding", file: "10", title: "Wedding decor" },
  ];

  const showcaseGrid = $("#showcase-grid");
  const isFeatured = (look) => look.file === "intro" || look.file === "1" || look.file === "2" || look.file === "3";

  const interleaveByCat = (items, getCat) => {
    const buckets = {};
    items.forEach((item) => {
      const cat = getCat(item);
      (buckets[cat] ||= []).push(item);
    });
    const cats = Object.keys(buckets);
    const mixed = [];
    let i = 0;
    let more = true;
    while (more) {
      more = false;
      cats.forEach((cat) => {
        if (buckets[cat][i]) {
          mixed.push(buckets[cat][i]);
          more = true;
        }
      });
      i += 1;
    }
    return mixed;
  };

  const orderedLooks = (() => {
    const featured = interleaveByCat(LOOKS.filter(isFeatured), (l) => l.cat);
    const rest = LOOKS.filter((l) => !isFeatured(l));
    return [...featured, ...rest];
  })();

  const renderShowcase = () => {
    if (!showcaseGrid) return;
    showcaseGrid.innerHTML = orderedLooks.map((look) => {
      const cat = CATEGORIES[look.cat];
      const img = `assets/showcase/${look.cat}/${look.file}.webp`;
      const featured = isFeatured(look) ? "1" : "0";
      const hidden = featured === "1" ? "" : " is-hidden";
      return `
        <article class="style-card${hidden}" data-cat="${look.cat}" data-featured="${featured}">
          <div class="style-card__img">
            <img src="${img}" alt="${look.title}" loading="lazy" width="960" height="720" />
            <span class="chip">${cat.label}</span>
          </div>
        </article>`;
    }).join("");
  };
  renderShowcase();

  /* ---------------------------------------------------------
     Showcase lightbox
     --------------------------------------------------------- */
  const lightbox = $(".lightbox");
  const lightboxImg = $(".lightbox__img");
  const lightboxPrev = $(".lightbox__nav--prev");
  const lightboxNext = $(".lightbox__nav--next");
  let lightboxOpen = false;
  let lightboxIndex = 0;

  const visibleShowcaseImgs = () =>
    $$(".style-card:not(.is-hidden) img").map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt || "",
    }));

  const showLightboxAt = (index, animate = true) => {
    const items = visibleShowcaseImgs();
    if (!items.length || !lightboxImg) return;
    lightboxIndex = (index + items.length) % items.length;
    const item = items[lightboxIndex];
    const swap = () => {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    };
    if (animate && hasGSAP && lightboxOpen) {
      gsap.to(lightboxImg, {
        opacity: 0, duration: 0.15, onComplete: () => {
          swap();
          gsap.to(lightboxImg, { opacity: 1, duration: 0.25 });
        },
      });
    } else swap();
  };

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImg) return;
    showLightboxAt(index, false);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxOpen = true;
    lockScroll(true);
    if (hasGSAP) {
      gsap.fromTo(".lightbox__backdrop", { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(".lightbox__figure", { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(".lightbox__nav", { opacity: 0 }, { opacity: 1, duration: 0.35, delay: 0.1 });
    }
  };

  const closeLightbox = () => {
    if (!lightboxOpen) return;
    lightboxOpen = false;
    const done = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.removeAttribute("src");
    };
    if (hasGSAP) {
      gsap.to(".lightbox__backdrop", { opacity: 0, duration: 0.25 });
      gsap.to(".lightbox__nav", { opacity: 0, duration: 0.2 });
      gsap.to(".lightbox__figure", { opacity: 0, scale: 0.96, duration: 0.25, ease: "power2.in", onComplete: done });
    } else done();
    lockScroll(false);
  };

  const stepLightbox = (dir) => {
    if (!lightboxOpen) return;
    showLightboxAt(lightboxIndex + dir);
  };

  $$(".style-card").forEach((card, i) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "View larger image");
    const open = () => {
      const visible = $$(".style-card:not(.is-hidden)");
      const idx = visible.indexOf(card);
      openLightbox(idx < 0 ? i : idx);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  if (lightbox) {
    $$("[data-close]", lightbox).forEach((el) => el.addEventListener("click", closeLightbox));
    if (lightboxPrev) lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(-1); });
    if (lightboxNext) lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(1); });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      setNav(false);
    } else if (lightboxOpen && e.key === "ArrowLeft") {
      e.preventDefault();
      stepLightbox(-1);
    } else if (lightboxOpen && e.key === "ArrowRight") {
      e.preventDefault();
      stepLightbox(1);
    }
  });

  /* ---------------------------------------------------------
     Showcase filters
     --------------------------------------------------------- */
  const filterBtns = $$(".filters button");
  let cards = $$(".style-card");

  const applyFilter = (f) => {
    const btn = filterBtns.find((b) => b.dataset.filter === f) || filterBtns[0];
    filterBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
    cards = $$(".style-card");
    let show;
    if (f === "all") {
      show = interleaveByCat(
        cards.filter((c) => c.dataset.featured === "1"),
        (c) => c.dataset.cat
      );
    } else {
      show = cards.filter((c) => c.dataset.cat === f);
    }
    const hide = cards.filter((c) => !show.includes(c));

    const reveal = () => {
      hide.forEach((c) => c.classList.add("is-hidden"));
      show.forEach((c) => {
        showcaseGrid.appendChild(c);
        c.classList.remove("is-hidden");
        if (hasGSAP) gsap.set(c, { clearProps: "opacity,visibility,transform" });
      });
      if (hasGSAP) {
        gsap.fromTo(show, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.04, ease: "power3.out" });
        ScrollTrigger.refresh();
      }
    };

    if (hasGSAP) {
      const visible = cards.filter((c) => !c.classList.contains("is-hidden"));
      if (!visible.length) reveal();
      else {
        gsap.to(visible, {
          autoAlpha: 0, y: 16, duration: 0.18, stagger: { amount: 0.12 }, ease: "power2.in", onComplete: reveal,
        });
      }
    } else reveal();
  };

  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-active")) return;
      applyFilter(btn.dataset.filter);
    })
  );

  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-jump-filter]");
    if (!link) return;
    const f = link.dataset.jumpFilter;
    if (f) setTimeout(() => applyFilter(f), 50);
  });

  /* ---------------------------------------------------------
     Specialities carousel (continuous auto-scroll)
     --------------------------------------------------------- */
  const carousel = $("[data-carousel]");
  if (carousel) {
    const track = $("[data-carousel-track]", carousel);
    if (track && !reduceMotion) {
      const originals = [...track.children];
      originals.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.tabIndex = -1;
        track.appendChild(clone);
      });
      track.classList.add("is-ready");
    }
  }

  /* ---------------------------------------------------------
     Reviews slider
     --------------------------------------------------------- */
  const reviews = $$(".review");
  const reviewDots = $$(".reviews__dots button");
  let reviewIdx = 0;
  let reviewTimer;
  const showReview = (i) => {
    reviewIdx = (i + reviews.length) % reviews.length;
    reviews.forEach((r, k) => r.classList.toggle("is-active", k === reviewIdx));
    reviewDots.forEach((d, k) => d.classList.toggle("is-active", k === reviewIdx));
  };
  const autoReview = () => {
    clearInterval(reviewTimer);
    if (!reduceMotion) reviewTimer = setInterval(() => showReview(reviewIdx + 1), 5500);
  };
  reviewDots.forEach((d, i) => d.addEventListener("click", () => { showReview(i); autoReview(); }));
  autoReview();

  /* ---------------------------------------------------------
     Consultation form
     --------------------------------------------------------- */
  const form = $(".form");
  const msg = $(".form__msg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("[required]", form).forEach((field) => {
      const valid = field.value.trim() && field.checkValidity();
      field.classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });
    msg.classList.toggle("is-error", !ok);
    if (!ok) {
      msg.textContent = "Please fill in your name, a valid email and phone number.";
      return;
    }
    msg.textContent = "Thank you! Our designer will call you within 24 hours.";
    form.reset();
  });
  $$("input, textarea", form).forEach((f) => f.addEventListener("input", () => f.classList.remove("is-invalid")));

  /* ---------------------------------------------------------
     Animations (GSAP)
     --------------------------------------------------------- */
  const counters = $$("[data-count]");
  const runCounters = () =>
    counters.forEach((el) => {
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0", 10);
      if (!hasGSAP || reduceMotion) return (el.textContent = end.toFixed(dec));
      const obj = { v: 0 };
      gsap.to(obj, { v: end, duration: 2, ease: "power2.out", onUpdate: () => (el.textContent = obj.v.toFixed(dec)) });
    });

  if (!hasGSAP || reduceMotion) {
    runCounters();
    return;
  }

  // home / hero intro
  gsap
    .timeline({ defaults: { ease: "power4.out" }, delay: 0.08 })
    .fromTo(".hero .eyebrow", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 })
    .fromTo(".hero__title", { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.95 }, 0.08)
    .fromTo(".hero__lead", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75 }, 0.2)
    .fromTo(".hero__actions", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.32)
    .fromTo(".hero__img", { autoAlpha: 0, x: 28 }, { autoAlpha: 1, x: 0, duration: 1.05, ease: "power3.out" }, 0.12)
    .fromTo(".value-prop", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.07 }, 0.55)
    .fromTo(".speciality-card", { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 }, 0.7);

  runCounters();

  // generic reveals (outside hero)
  const fromVars = { up: { y: 50 }, left: { x: -80 }, right: { x: 80 } };
  $$("[data-anim]")
    .filter((el) => !el.closest(".hero"))
    .forEach((el) => {
      gsap.fromTo(
        el,
        { ...fromVars[el.dataset.anim], autoAlpha: 0 },
        {
          x: 0, y: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
    });

  // staggered groups — cards slide in from alternating sides
  const batchReveal = (selector, vars, stagger = 0.1) => {
    gsap.set(selector, { autoAlpha: 0, ...vars });
    ScrollTrigger.batch(selector, {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.9, stagger, ease: "power3.out", overwrite: true }),
    });
  };
  $$(".style-card:not(.is-hidden)").forEach((card, i) => {
    gsap.from(card, {
      autoAlpha: 0,
      y: 40,
      x: i % 2 ? 36 : -36,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 92%", once: true },
    });
  });
  batchReveal(".service-card", { y: 80, rotation: (i) => (i % 2 ? 3 : -3) }, 0.12);
  batchReveal(".check", { x: -40 }, 0.08);
  batchReveal(".area", { y: 30, scale: 0.94 }, 0.06);
  batchReveal(".footer__grid > *", { y: 40 }, 0.1);

  // parallax
  gsap.to(".hero__big img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.fromTo(".cta-banner__bg", { yPercent: -10 }, { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".cta-banner", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.fromTo(".why__inset", { y: 60 }, { y: -20, ease: "none", scrollTrigger: { trigger: ".why", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.fromTo(".about__frame img", { scale: 1.08 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "center center", scrub: true } });

  // active nav link
  const navLinks = $$(".nav a");
  ["home", "about", "specialities", "styles", "contact"].forEach((id) => {
    ScrollTrigger.create({
      trigger: `#${id}`,
      start: "top 45%",
      end: "bottom 45%",
      onToggle: (self) => self.isActive && navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${id}`)),
    });
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
