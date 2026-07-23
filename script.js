/* =========================================================
   CONFIG — hier alles für dich anpassen (Name, Projekte, Links)
   ========================================================= */
const CONFIG = {
  name: "opsec",
  mail: "hello@opsec.studio",
  about: "Ein Studio für durchdachtes Web — von der ersten Skizze bis zur letzten Mikro-Interaktion. Rein, präzise, zeitlos.",
  services: [
    { k: "Strategy & Identity", v: "01" },
    { k: "Web Design & Art Direction", v: "02" },
    { k: "Frontend Engineering", v: "03" },
    { k: "Motion & Interaction", v: "04" },
    { k: "Creative Coding", v: "05" },
  ],
  marquee: ["Web Design", "Branding", "Motion", "Creative Code", "Art Direction", "Typography", "Experience"],
  projects: [
    { title: "Aurora Commerce", tag: "E-Commerce", c1: "#e9ddc9", c2: "#b08d57" },
    { title: "Maison Editorial", tag: "Magazine", c1: "#dfe6e4", c2: "#7c8b86" },
    { title: "Noir Studio", tag: "Branding", c1: "#efe3d6", c2: "#9a7b4f" },
    { title: "Lumen App", tag: "Product", c1: "#e7e2ea", c2: "#8a7fa6" },
    { title: "Atlas Travel", tag: "Platform", c1: "#e3eae9", c2: "#5f8f86" },
    { title: "Form Atelier", tag: "Portfolio", c1: "#f0e6da", c2: "#b9885a" },
  ],
  socials: [
    { label: "GitHub", url: "https://github.com/opsec-6209" },
    { label: "Instagram", url: "#" },
    { label: "LinkedIn", url: "#" },
    { label: "X / Twitter", url: "#" },
  ],
};

/* ---------- Render dynamischen Content ---------- */
function render() {
  document.querySelectorAll("[data-name]").forEach((e) => (e.textContent = CONFIG.name));
  document.querySelectorAll("[data-name-about]").forEach((e) => (e.textContent = CONFIG.about));

  const marquee = document.getElementById("marqueeTrack");
  const mItems = CONFIG.marquee.concat(CONFIG.marquee);
  marquee.innerHTML = mItems.map((t) => `<span>${t}</span>`).join("");

  const list = document.getElementById("aboutList");
  list.innerHTML = CONFIG.services
    .map((s) => `<li><span class="k">${s.k}</span><span class="v">${s.v}</span></li>`)
    .join("");

  const grid = document.getElementById("workGrid");
  grid.innerHTML = CONFIG.projects
    .map(
      (p, i) => `
      <a class="card reveal" data-reveal href="#work" data-magnetic>
        <div class="card__media">
          <div class="card__art" style="background:linear-gradient(135deg,${p.c1},${p.c2})"></div>
          <span class="card__index">0${i + 1}</span>
          <span class="card__view">View ↗</span>
        </div>
        <div class="card__body">
          <span class="card__title">${p.title}</span>
          <span class="card__tag">${p.tag}</span>
        </div>
      </a>`
    )
    .join("");

  const soc = document.getElementById("socials");
  soc.innerHTML = CONFIG.socials
    .map((s) => `<a href="${s.url}" target="_blank" rel="noopener" data-magnetic>${s.label}</a>`)
    .join("");

  document.getElementById("year").textContent = new Date().getFullYear();
  document.title = `${CONFIG.name}° — Studio`;
}

/* ---------- Preloader ---------- */
function preload() {
  const pre = document.getElementById("preloader");
  const count = document.getElementById("preCount");
  const bar = document.getElementById("preBar");
  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 14 + 4;
    if (p >= 100) {
      p = 100;
      clearInterval(tick);
      setTimeout(() => {
        pre.classList.add("done");
        document.body.classList.add("loaded");
        revealHero();
        setTimeout(() => pre.remove(), 1200);
      }, 300);
    }
    count.textContent = Math.floor(p);
    bar.style.width = p + "%";
  }, 130);
}

/* ---------- Reveal Observer ---------- */
let io;
function setupReveal() {
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          if (e.target.hasAttribute("data-count")) animateCount(e.target);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll("[data-reveal], [data-reveal-line]").forEach((el, i) => {
    io.observe(el);
  });
  document.querySelectorAll(".card").forEach((el) => io.observe(el));
}

function revealHero() {
  document.querySelectorAll(".hero [data-reveal-line]").forEach((el, i) => {
    el.style.transitionDelay = i * 0.08 + "s";
    el.classList.add("in");
  });
  document.querySelectorAll(".hero [data-reveal]").forEach((el, i) => {
    el.style.transitionDelay = 0.3 + i * 0.1 + "s";
    el.classList.add("in");
  });
}

/* ---------- Counter ---------- */
function animateCount(el) {
  const target = +el.getAttribute("data-count");
  const dur = 1600;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(eased * target);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* ---------- Custom Cursor ---------- */
function setupCursor() {
  const dot = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  if (!dot) return;
  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;
  addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  addEventListener("mousedown", () => ring.classList.add("down"));
  addEventListener("mouseup", () => ring.classList.remove("down"));
  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();
  document.querySelectorAll("a, button, [data-magnetic], .card").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });
}

/* ---------- Magnetic ---------- */
function setupMagnetic() {
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0,0)";
      el.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
      setTimeout(() => (el.style.transition = ""), 600);
    });
  });
}

/* ---------- Nav ---------- */
function setupNav() {
  const nav = document.getElementById("nav");
  addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", scrollY > 60);
  });
}

/* ---------- Smooth anchor (offset) ---------- */
function setupLinks() {
  document.querySelectorAll("[data-link], a[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  render();
  setupReveal();
  setupCursor();
  setupMagnetic();
  setupNav();
  setupLinks();
  preload();
});
