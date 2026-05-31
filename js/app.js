const fallbackData = {
  brand: "Clinton Obi",
  name: "Clinton Obi",
  location: "Malta",
  headline: "IT Support and Digital Marketing professional focused on technical support, SEO, content strategy, data and AI-supported workflows.",
  intro: "I help organisations solve technical problems, improve digital visibility, organise content systems and use data-backed workflows to make better decisions.",
  availability: "Open to IT Support and Digital Marketing opportunities in Malta and Europe.",
  about: "I am a Computer Science graduate and multidisciplinary professional with experience across IT support, digital marketing, logistics, technical operations, content systems and business development.",
  profileImage: "assets/profile-pic.jpg",
  cv: "assets/resume.pdf",
  contactText: "For IT Support, Digital Marketing, SEO, content strategy or operations-focused opportunities, contact me directly.",
  metrics: [],
  experience: [],
  projects: [],
  certifications: [],
  skills: [],
  contactLinks: []
};

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const listItems = (items = []) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

const renderMetrics = (metrics = []) => {
  const target = document.getElementById("metrics");
  if (!target) return;
  target.innerHTML = metrics
    .map((item) => `<div class="metric"><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></div>`)
    .join("");
};

const renderExperience = (items = []) => {
  const target = document.getElementById("experience-list");
  if (!target) return;
  target.innerHTML = items
    .map(
      (item) => `
        <article class="card">
          <h3>${escapeHtml(item.role)}</h3>
          <p class="meta">${escapeHtml(item.company)} · ${escapeHtml(item.period)}</p>
          <ul>${listItems(item.bullets)}</ul>
        </article>`
    )
    .join("");
};

const renderProjects = (items = []) => {
  const target = document.getElementById("project-list");
  if (!target) return;
  target.innerHTML = items
    .map(
      (item) => `
        <article class="card">
          ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" />` : ""}
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          ${item.url ? `<a class="text-link" href="${escapeHtml(item.url)}">${escapeHtml(item.label || "View")}</a>` : ""}
        </article>`
    )
    .join("");
};

const renderCertifications = (items = []) => {
  const target = document.getElementById("certification-list");
  if (!target) return;
  target.innerHTML = items.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("");
};

const renderSkills = (groups = []) => {
  const target = document.getElementById("skill-list");
  if (!target) return;
  target.innerHTML = groups
    .map(
      (group) => `
        <div class="skill-column">
          <h3>${escapeHtml(group.group)}</h3>
          <ul>${(group.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>`
    )
    .join("");
};

const renderContactLinks = (links = []) => {
  const target = document.getElementById("contact-links");
  if (!target) return;
  target.innerHTML = links
    .map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`)
    .join("");
};

const applyContent = (data) => {
  setText('[data-text="brand"]', data.brand);
  setText('[data-text="name"]', data.name);
  setText('[data-text="location"]', data.location);
  setText('[data-text="headline"]', data.headline);
  setText('[data-text="intro"]', data.intro);
  setText('[data-text="availability"]', data.availability);
  setText('[data-text="about"]', data.about);
  setText('[data-text="contactText"]', data.contactText);

  const profile = document.querySelector('[data-image="profile"]');
  if (profile && data.profileImage) profile.src = data.profileImage;

  const cv = document.querySelector('[data-link="cv"]');
  if (cv && data.cv) cv.href = data.cv;

  renderMetrics(data.metrics);
  renderExperience(data.experience);
  renderProjects(data.projects);
  renderCertifications(data.certifications);
  renderSkills(data.skills);
  renderContactLinks(data.contactLinks);
};

const initialiseMenu = () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => nav.classList.remove("is-open")));
};

const initialiseNetlifyIdentity = () => {
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", (user) => {
      if (!user && window.location.hash.includes("invite_token")) {
        window.netlifyIdentity.open("signup");
      }
    });
  }
};

(async function init() {
  initialiseMenu();
  initialiseNetlifyIdentity();
  document.getElementById("year").textContent = new Date().getFullYear();
  try {
    const response = await fetch("content/site.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Content file not found");
    const data = await response.json();
    applyContent({ ...fallbackData, ...data });
  } catch (error) {
    applyContent(fallbackData);
  }
})();
