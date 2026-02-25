// script.js

function setActiveNav() {
  const path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const links = document.querySelectorAll("nav a");
  links.forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.setAttribute("aria-current", "page");
  });
}

function menuFilterInit() {
  const filter = document.getElementById("menuFilter");
  const cards = document.querySelectorAll("[data-menu-item]");

  if (!filter || cards.length === 0) return;

  filter.addEventListener("change", () => {
    const value = filter.value;

    cards.forEach(card => {
      const tags = (card.getAttribute("data-tags") || "").split(",").map(s => s.trim());
      const show = value === "all" || tags.includes(value);
      card.style.display = show ? "" : "none";
    });
  });
}

function contactFormInit() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const msg = document.getElementById("contactMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.elements["name"]?.value.trim();
    const phone = form.elements["phone"]?.value.trim();
    const email = form.elements["email"]?.value.trim();
    const details = form.elements["details"]?.value.trim();

    const inquiryTypes = Array.from(form.querySelectorAll('input[name="inquiry"]:checked')).map(i => i.value);

    if (!name || !email || !details) {
      msg.className = "notice bad";
      msg.textContent = "Please fill out Name, Email, and Description before submitting.";
      return;
    }

    // front-end only: show confirmation
    msg.className = "notice good";
    msg.textContent = `Thanks, ${name}! We received your message${inquiryTypes.length ? " (" + inquiryTypes.join(", ") + ")" : ""}.`;

    form.reset();
  });
}

function feedbackFormInit() {
  const form = document.getElementById("feedbackForm");
  if (!form) return;

  const msg = document.getElementById("feedbackMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.elements["name"]?.value.trim();
    const rating = form.elements["rating"]?.value;
    const comments = form.elements["comments"]?.value.trim();

    if (!rating || !comments) {
      msg.className = "notice bad";
      msg.textContent = "Please select a rating and write a comment.";
      return;
    }

    // store locally (still front-end only)
    const entry = {
      name: name || "Anonymous",
      rating: Number(rating),
      comments,
      createdAt: new Date().toISOString()
    };

    const key = "unkoe_feedback";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.unshift(entry);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 20)));

    msg.className = "notice good";
    msg.textContent = "Mahalo! Your feedback was saved locally in this browser (front-end only).";

    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  menuFilterInit();
  contactFormInit();
  feedbackFormInit();
});