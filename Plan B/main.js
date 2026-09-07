/* global gsap, ScrollTrigger */

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// User requested animations; don't hard-disable them when OS "Reduce motion" is enabled.
const motionEnabled = true;
const LOADING_MS = 3200; // cinematic "slow loading" feel (full landscape sequence)

function $(sel, root = document) {
  return root.querySelector(sel);
}
function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function initYear() {
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

function initPreloader() {
  const preloader = $("#preloader");
  const fill = $("#preloader-fill");
  const pctEl = $("#preloader-pct");
  const scene = $(".preloader-scene");

  if (!motionEnabled || !preloader || !fill || !pctEl) {
    if (preloader) preloader.style.display = "none";
    document.body.classList.remove("is-loading");
    return Promise.resolve();
  }

  document.body.classList.add("is-loading");

  return new Promise((resolve) => {
    const state = { p: 0 };

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        document.body.classList.remove("is-loading");
        resolve();
      },
    });

    tl.fromTo(preloader, { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0);

    if (scene) {
      const m1 = $(".pl-m1", scene);
      const m2 = $(".pl-m2", scene);
      const m3 = $(".pl-m3", scene);
      const haze = $(".pl-haze", scene);
      const stars = $(".pl-stars", scene);
      const scan = $(".pl-scan", scene);

      if (stars) tl.fromTo(stars, { opacity: 0 }, { opacity: 0.55, duration: 0.8, ease: "sine.out" }, 0);
      if (haze) tl.fromTo(haze, { opacity: 0, scale: 1.02 }, { opacity: 0.35, scale: 1, duration: 1.0 }, 0);

      // slow drift (feels like a landscape reveal)
      if (m1) tl.fromTo(m1, { y: 16 }, { y: 0, duration: 2.1, ease: "sine.out" }, 0);
      if (m2) tl.fromTo(m2, { y: 22 }, { y: 0, duration: 2.4, ease: "sine.out" }, 0);
      if (m3) tl.fromTo(m3, { y: 28 }, { y: 0, duration: 2.7, ease: "sine.out" }, 0);

      if (scan) {
        tl.fromTo(scan, { y: -40, opacity: 0.05 }, { y: 40, opacity: 0.16, duration: 2.8, ease: "none" }, 0);
      }

      if (haze) {
        tl.to(haze, { x: 18, y: -6, duration: LOADING_MS / 1000, ease: "none" }, 0);
      }
    }

    tl.to(
      state,
      {
        p: 100,
        duration: LOADING_MS / 1000,
        ease: "power1.inOut",
        onUpdate: () => {
          const p = Math.round(state.p);
          fill.style.width = `${p}%`;
          pctEl.textContent = `${p}%`;
        },
      },
      0,
    );

    // subtle cinematic grade pulse
    // removed initial glow effect on load

    tl.to(preloader, { opacity: 0, duration: 0.5 }, "+=0.05");
    tl.set(preloader, { display: "none" });
  });
}

function initScrollMeter() {
  const meter = $("#scroll-meter");
  if (!meter) return;
  ScrollTrigger.create({
    start: 0,
    end: () => document.documentElement.scrollHeight - window.innerHeight,
    onUpdate: (self) => {
      meter.style.width = `${Math.round(self.progress * 100)}%`;
    },
  });
}

function initSectionReveals() {
  if (!motionEnabled) return;

  const sections = $all("section, header .mx-auto");
  sections.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 84%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
}

function initHeroEntrance() {
  if (!motionEnabled) return;

  const header = $("header");
  const hero = $("main > section");
  if (!hero) return;

  const badge = hero.querySelector(".inline-flex");
  const h1 = hero.querySelector("h1");
  const p = hero.querySelector("p");
  const buttons = hero.querySelectorAll(".btn");
  const stats = hero.querySelectorAll(".card.card-soft");
  const rightCard = hero.querySelector(".card.card-glass");

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  tl.fromTo(header, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0);
  if (badge) tl.fromTo(badge, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.1);
  if (h1) tl.fromTo(h1, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 0.15);
  if (p) tl.fromTo(p, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, 0.25);

  if (buttons?.length) {
    tl.fromTo(
      buttons,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
      0.32,
    );
  }

  if (stats?.length) {
    tl.fromTo(
      stats,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
      0.42,
    );
  }

  if (rightCard) tl.fromTo(rightCard, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.35);
}

function initNavMicro() {
  if (!motionEnabled) return;
  const navLinks = $all("nav a.navlink");
  if (!navLinks.length) return;

  navLinks.forEach((a) => {
    a.addEventListener("mouseenter", () => gsap.to(a, { duration: 0.22, y: -1, ease: "power2.out" }));
    a.addEventListener("mouseleave", () => gsap.to(a, { duration: 0.22, y: 0, ease: "power2.out" }));
  });
}

function initParallaxGlow() {
  if (!motionEnabled) return;
  const blobs = $all(".card-glass > .absolute");
  if (!blobs.length) return;

  blobs.forEach((b) => {
    gsap.to(b, {
      y: -14,
      duration: 1,
      ease: "none",
      scrollTrigger: {
        trigger: b.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  });
}

function initProjectHoverMotion() {
  if (!motionEnabled) return;
  const cards = $all(".project-card");
  cards.forEach((card) => {
    const thumb = $(".project-thumb", card);
    if (!thumb) return;

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rotY = (px - 0.5) * 8;
      const rotX = -(py - 0.5) * 6;
      gsap.to(card, { rotateX: rotX, rotateY: rotY, transformPerspective: 900, duration: 0.28, ease: "power2.out" });
      gsap.to(thumb, { y: (py - 0.5) * 10, duration: 0.28, ease: "power2.out" });
    };

    const reset = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.35, ease: "power2.out" });
      gsap.to(thumb, { y: 0, duration: 0.35, ease: "power2.out" });
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", reset);
  });
}

function initTimelineScrub() {
  const items = $all(".timeline-item");
  if (!items.length) return;

  items.forEach((item) => {
    if (!motionEnabled) return;

    gsap.fromTo(
      item,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: { trigger: item, start: "top 80%" },
      },
    );
  });
}

function initRenderQueue() {
  const rows = $all(".render-row");
  if (!rows.length) return;

  const colorMap = {
    cyan: ["rgba(33,246,255,0.95)", "rgba(167,139,250,0.55)"],
    pink: ["rgba(255,59,212,0.95)", "rgba(33,246,255,0.55)"],
    violet: ["rgba(167,139,250,0.95)", "rgba(255,59,212,0.55)"],
    lime: ["rgba(119,255,102,0.90)", "rgba(33,246,255,0.45)"],
  };

  rows.forEach((row) => {
    const pct = clamp(Number(row.dataset.pct || 0), 0, 100);
    const fill = $(".render-fill", row);
    const colorKey = (row.dataset.color || "cyan").toLowerCase();
    const grad = colorMap[colorKey] || colorMap.cyan;

    if (fill) {
      fill.style.background = `linear-gradient(90deg, ${grad[0]}, ${grad[1]})`;
      fill.style.boxShadow = `0 0 24px ${grad[0].replace("0.95", "0.18").replace("0.90", "0.16")}`;
    }

    if (!motionEnabled) {
      if (fill) fill.style.width = `${pct}%`;
      return;
    }

    gsap.fromTo(
      fill,
      { width: "0%" },
      {
        width: `${pct}%`,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: { trigger: row, start: "top 86%" },
      },
    );
  });
}

function initProjectCardAccents() {
  const cards = $all(".project-card");
  cards.forEach((card) => {
    const accent = (card.dataset.accent || "cyan").toLowerCase();
    const glow =
      accent === "pink"
        ? "0 0 0 1px rgba(255,59,212,0.18), 0 0 34px rgba(255,59,212,0.12)"
        : accent === "violet"
          ? "0 0 0 1px rgba(167,139,250,0.16), 0 0 34px rgba(167,139,250,0.10)"
          : "0 0 0 1px rgba(33,246,255,0.16), 0 0 34px rgba(33,246,255,0.10)";

    card.addEventListener("mouseenter", () => {
      card.style.boxShadow = glow;
    });
    card.addEventListener("mouseleave", () => {
      card.style.boxShadow = "";
    });
  });
}

initYear();
initPreloader().then(() => {
  initHeroEntrance();
  initNavMicro();
  initScrollMeter();
  initSectionReveals();
  initParallaxGlow();
  initTimelineScrub();
  initRenderQueue();
  initProjectCardAccents();
  initProjectHoverMotion();
});

