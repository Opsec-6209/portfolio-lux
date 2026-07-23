/* ═══════════════════════════════════════════
   opsec_6209 — LUX Portfolio Interactions
═══════════════════════════════════════════ */

(() => {
  "use strict";

  window.addEventListener("error", (e) => {
    let d = document.getElementById("err");
    if (!d) {
      d = document.createElement("div");
      d.id = "err";
      d.style.cssText =
        "position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#c0392b;color:#fff;font:13px/1.5 monospace;padding:12px 16px;white-space:pre-wrap";
      document.body.appendChild(d);
    }
    d.textContent += "JS ERROR: " + (e.message || e.error) + "\n";
  });

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ── Loader ── */
  const loader = $("#loader");
  const loaderProgress = $("#loaderProgress");
  const loaderCount = $("#loaderCount");

  document.body.classList.add("loading");

  let progress = 0;
  const loaderInterval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderInterval);
      finishLoader();
    }
    loaderProgress.style.width = progress + "%";
    loaderCount.textContent = Math.floor(progress);
  }, 80);

  function finishLoader() {
    setTimeout(() => {
      loader.classList.add("done");
      document.body.classList.remove("loading");
      document.body.classList.add("loaded");
      initCounters();
      requestAnimationFrame(() => {
        $$(".hero .reveal").forEach((el, i) => {
          setTimeout(() => el.classList.add("visible"), 200 + i * 120);
        });
      });
    }, 350);
  }

  /* ── Custom Cursor ── */
  const cursor = $("#cursor");
  const follower = $("#cursorFollower");
  let mx = 0, my = 0, fx = 0, fy = 0;
  let hovering = false;

  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
    });

    function animateFollower() {
      fx += (mx - fx) * 0.14;
      fy += (my - fy) * 0.14;
      follower.style.left = fx + "px";
      follower.style.top = fy + "px";
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = "a, button, .skill-chip, .project, .about-card, .contact-card, .magnetic";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) {
        hovering = true;
        cursor.classList.add("hover");
        follower.classList.add("hover");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) {
        hovering = false;
        cursor.classList.remove("hover");
        follower.classList.remove("hover");
      }
    });
  }

  /* ── Magnetic Buttons ── */
  $$(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
      el.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
      setTimeout(() => (el.style.transition = ""), 500);
    });
  });

  /* ── Nav Scroll ── */
  const nav = $("#nav");
  let lastScroll = 0;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      nav.classList.toggle("scrolled", y > 40);
      lastScroll = y;
    },
    { passive: true }
  );

  /* ── Mobile Menu ── */
  const burger = $("#burger");
  const mobileMenu = $("#mobileMenu");

  burger?.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    burger.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  $$(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      burger.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ── Scroll Reveal ── */
  const revealEls = $$(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => {
    if (!el.closest(".hero")) revealObserver.observe(el);
  });

  /* ── Counters ── */
  function initCounters() {
    $$("[data-count]").forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  }

  /* ── Smooth Anchor Scroll ── */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id === "#" || id === "#top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ── Project Card Tilt ── */
  if (window.matchMedia("(pointer: fine)").matches) {
    $$("[data-project]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-8px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
        setTimeout(() => (card.style.transition = ""), 600);
      });
    });
  }

  /* ── Parallax Orbs ── */
  const orbs = $$(".orb");
  if (orbs.length && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "mousemove",
      (e) => {
        const cx = (e.clientX / window.innerWidth - 0.5) * 2;
        const cy = (e.clientY / window.innerHeight - 0.5) * 2;
        orbs.forEach((orb, i) => {
          const f = (i + 1) * 12;
          orb.style.translate = `${cx * f}px ${cy * f}px`;
        });
      },
      { passive: true }
    );
  }

  /* ── Active Nav Link ── */
  const sections = $$("section[id]");
  const navLinks = $$(".nav-link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          link.style.color = href === `#${id}` ? "var(--ink)" : "";
        });
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  /* ── Page Visibility — pause marquee when hidden ── */
  const marquee = $(".marquee-track");
  document.addEventListener("visibilitychange", () => {
    if (marquee) marquee.style.animationPlayState = document.hidden ? "paused" : "running";
  });
})();
