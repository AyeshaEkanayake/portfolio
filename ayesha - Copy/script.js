/* =========================
   script.js (UPDATED)
   - Mobile nav
   - Scroll progress
   - Reveal animations
   - Skill bars animation
   - Realtime stats (auto counts)
   - Count-up animation (uses data-count)
   - Modals
   - Hosted contact form (Formspree) + status
   - Back-to-top smooth scroll
   - 3D tilt hero card
========================= */

// Mobile nav
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

// Close nav on link click (mobile)
navLinks?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll progress
const progressBar = document.querySelector(".scroll-progress span");
window.addEventListener("scroll", () => {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${p}%`;
});

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// Animated skill bars (when visible)
const barEls = document.querySelectorAll(".bar");
const barIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const fill = e.target.querySelector("i");
      const level = e.target.getAttribute("data-level") || "70";
      if (fill) fill.style.width = `${level}%`;
      barIO.unobserve(e.target);
    });
  },
  { threshold: 0.35 }
);
barEls.forEach((el) => barIO.observe(el));

/* =========================
   Realtime Stats (AUTO)
   Make sure your stats have:
   <span class="num" id="statProjects" data-count="0">0</span>
   <span class="num" id="statSkills" data-count="0">0</span>
   <span class="num" id="statCerts" data-count="0">0</span>
========================= */
function updateRealtimeStats() {
  const projects = document.querySelectorAll("#projects .project").length;

  const skillBars = document.querySelectorAll("#skills .bar").length;
  const skillPills = document.querySelectorAll("#skills .pill2").length;
  const skills = skillBars + skillPills;

  const certs = document.querySelectorAll(
    "#education .card:nth-child(2) .nice-list li"
  ).length;

  const statProjects = document.getElementById("statProjects");
  const statSkills = document.getElementById("statSkills");
  const statCerts = document.getElementById("statCerts");

  if (statProjects) statProjects.dataset.count = String(projects);
  if (statSkills) statSkills.dataset.count = String(skills);
  if (statCerts) statCerts.dataset.count = String(certs);
}

// run on load
updateRealtimeStats();

// update if DOM changes (if you add items later)
const statsObserver = new MutationObserver(() => updateRealtimeStats());
statsObserver.observe(document.body, { childList: true, subtree: true });

/* =========================
   Count up stats (when visible)
========================= */
function animateCount(el, to) {
  const start = 0;
  const duration = 900;
  const t0 = performance.now();

  function tick(t) {
    const p = Math.min((t - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(start + (to - start) * eased);
    el.textContent = String(val);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countEls = document.querySelectorAll("[data-count]");
const countIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      animateCount(el, parseInt(el.dataset.count || "0", 10));
      countIO.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
countEls.forEach((el) => countIO.observe(el));

/* =========================
   Modals
========================= */
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add("open");
  m.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal(m) {
  m.classList.remove("open");
  m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".open-modal").forEach((btn) => {
  btn.addEventListener("click", () => openModal(btn.dataset.modal));
});

document.querySelectorAll(".modal").forEach((m) => {
  m.addEventListener("click", (e) => {
    if (e.target === m) closeModal(m);
  });
  m.querySelector(".modal-close")?.addEventListener("click", () => closeModal(m));
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.open").forEach((m) => closeModal(m));
  }
});

/* =========================
   Contact Form (HOSTED Formspree)
   - Use this if your form is:
     <form id="hostedForm" action="https://formspree.io/f/XXXX" method="POST">
   - And status element:
     <p id="formStatus" class="form-hint muted"></p>
========================= */
const hostedForm = document.getElementById("hostedForm");
const formStatus = document.getElementById("formStatus");

hostedForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (formStatus) {
    formStatus.textContent = "Sending...";
    formStatus.style.opacity = "0.9";
  }

  const data = new FormData(hostedForm);

  try {
    const res = await fetch(hostedForm.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      hostedForm.reset();
      if (formStatus) formStatus.textContent = "✅ Message sent successfully! I’ll reply soon.";
    } else {
      if (formStatus) formStatus.textContent = "⚠️ Failed to send. Please try again.";
    }
  } catch (err) {
    if (formStatus) formStatus.textContent = "⚠️ Network error. Please try again later.";
  }
});

/* =========================
   Back to top (smooth)
========================= */
document.querySelector(".to-top")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================
   3D Tilt for hero card
   Add class: tilt-card to your hero-card
========================= */
const tiltCard = document.querySelector(".tilt-card");

if (tiltCard) {
  const maxTilt = 10;

  tiltCard.addEventListener("mousemove", (e) => {
    const r = tiltCard.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const cx = r.width / 2;
    const cy = r.height / 2;

    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;

    const rotY = dx * maxTilt;
    const rotX = -dy * maxTilt;

    tiltCard.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
  });

  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
}
