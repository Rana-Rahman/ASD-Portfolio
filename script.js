"use strict";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Theme toggle (remembers choice) ---------- */
const themeBtn = $("#themeToggle");
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("theme", theme); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeBtn.addEventListener("click", () =>
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark")
);

/* ---------- Mobile menu ---------- */
const navLinks = $("#navLinks");
$("#menuBtn").addEventListener("click", () => navLinks.classList.toggle("open"));
$$("#navLinks a").forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));

/* ---------- Typing effect ---------- */
const roles = ["Software Engineer", "Frontend Developer", "Aspiring Full Stack Developer", "Problem Solver"];
const typed = $("#typed");
let r = 0, c = 0, deleting = false;

function type() {
  const word = roles[r];
  typed.textContent = word.slice(0, c);
  if (!deleting && c < word.length) { c++; setTimeout(type, 90); }
  else if (!deleting) { deleting = true; setTimeout(type, 1400); }
  else if (c > 0) { c--; setTimeout(type, 45); }
  else { deleting = false; r = (r + 1) % roles.length; setTimeout(type, 300); }
}
type();

/* ---------- Scroll: navbar, progress bar, back-to-top, active link ---------- */
const nav = $("#nav");
const progress = $("#progress");
const toTop = $("#toTop");
const sections = $$("main section[id]");
const links = $$("#navLinks a");

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  nav.classList.toggle("scrolled", y > 30);
  toTop.classList.toggle("show", y > 500);

  let current = "";
  sections.forEach((s) => { if (y >= s.offsetTop - 140) current = s.id; });
  links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- Reveal on scroll + skill bars + counters ---------- */
function animateCount(el) {
  const target = +el.dataset.count;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const t = setInterval(() => {
    n += step;
    if (n >= target) { n = target; clearInterval(t); }
    el.textContent = n;
  }, 40);
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("visible");
      $$(".track i", el).forEach((b) => (b.style.width = b.dataset.w + "%"));
      $$("[data-count]", el).forEach(animateCount);
      io.unobserve(el);
    });
  },
  { threshold: 0.15 }
);
$$(".reveal").forEach((el) => io.observe(el));

/* ---------- Project filter ---------- */
$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  $$("#filters button").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  const f = btn.dataset.filter;
  $$(".project").forEach((p) => p.classList.toggle("hide", f !== "all" && p.dataset.cat !== f));
});

/* ---------- Contact form (validation + mailto) ---------- */
const form = $("#contactForm");
const msg = $("#formMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const text = $("#message").value.trim();
  msg.className = "form-msg";

  if (!name || !email || !text) {
    msg.textContent = "Please fill in all fields.";
    msg.classList.add("error");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.textContent = "Please enter a valid email address.";
    msg.classList.add("error");
    return;
  }
  // Opens the visitor's email app. Replace the address with your own.
  const to = "asadurrahman219@gmail.com";
  const subject = encodeURIComponent("Portfolio message from " + name);
  const body = encodeURIComponent(text + "\n\nFrom: " + name + " (" + email + ")");
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  msg.textContent = "Thanks! Your email app should open now.";
  msg.classList.add("ok");
  form.reset();
});

/* ---------- CV button (replace with your real file) ---------- */
$("#cvBtn").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Add your CV file (e.g. cv.pdf) to this folder and set the button's href to \"cv.pdf\".");
});

/* ---------- Footer year ---------- */
$("#year").textContent = new Date().getFullYear();
