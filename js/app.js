const setText = (key, value) => {
  if (typeof value !== "string" || !value.trim()) return;
  document.querySelectorAll(`[data-text="${key}"]`).forEach((element) => {
    element.textContent = value;
  });
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const safeUrl = (value = "") => {
  const url = String(value).trim();
  return /^(https?:\/\/|mailto:|\/|#)/i.test(url) ? escapeHtml(url) : "#";
};

const renderProjects = (items) => {
  if (!Array.isArray(items) || !items.length) return;
  const target = document.getElementById("project-list");
  if (!target) return;
  target.innerHTML = items
    .map(
      (item, index) => `
        <article class="project-card">
          <div class="project-visual" aria-hidden="true">
            <span class="project-number">${escapeHtml(item.number || String(index + 1).padStart(2, "0"))}</span>
            <strong>${escapeHtml(item.mark || "CO")}</strong>
            <span class="project-type">${escapeHtml(item.type || "Selected work")}</span>
          </div>
          <div class="project-copy">
            <p>${escapeHtml(item.type || "Selected work")}</p>
            <h3>${escapeHtml(item.title)}</h3>
            <p class="project-description">${escapeHtml(item.description)}</p>
            <a href="${safeUrl(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.label || "View project")} <span aria-hidden="true">↗</span></a>
          </div>
        </article>`
    )
    .join("");
};

const renderExperience = (items) => {
  if (!Array.isArray(items) || !items.length) return;
  const target = document.getElementById("experience-list");
  if (!target) return;
  target.innerHTML = items
    .map(
      (item) => `
        <article class="timeline-item">
          <p class="timeline-period">${escapeHtml(item.period)}</p>
          <div><h3>${escapeHtml(item.role)}</h3><p class="timeline-company">${escapeHtml(item.company)}</p></div>
          <div>
            <p class="timeline-summary">${escapeHtml(item.summary)}</p>
            <ul class="tag-list" aria-label="${escapeHtml(item.role)} skills">
              ${(item.tags || []).map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}
            </ul>
          </div>
        </article>`
    )
    .join("");
};

const renderSkills = (groups) => {
  if (!Array.isArray(groups) || !groups.length) return;
  const target = document.getElementById("skill-list");
  if (!target) return;
  target.innerHTML = groups
    .map(
      (group, index) => `
        <article class="skill-card">
          <span aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
          <h3>${escapeHtml(group.group)}</h3>
          <ul>${(group.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </article>`
    )
    .join("");
};

const renderCertifications = (items) => {
  if (!Array.isArray(items) || !items.length) return;
  const target = document.getElementById("certification-list");
  if (!target) return;
  target.innerHTML = items
    .map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(item)}</li>`)
    .join("");
};

const renderContactLinks = (links) => {
  if (!Array.isArray(links) || !links.length) return;
  const target = document.getElementById("contact-links");
  if (!target) return;
  target.innerHTML = links
    .map((link) => {
      const url = safeUrl(link.url);
      const external = url.startsWith("http") ? ' target="_blank" rel="noopener"' : "";
      return `<a href="${url}"${external}>${escapeHtml(link.label)}</a>`;
    })
    .join("");
};

const applyContent = (data) => {
  ["name", "location", "basedIn", "headlinePrimary", "headlineAccent", "intro", "availability", "aboutLead", "aboutDetail", "contactText"].forEach((key) => setText(key, data[key]));

  const profile = document.querySelector('[data-image="profile"]');
  if (profile && data.profileImage) {
    profile.src = safeUrl(data.profileImage);
    profile.alt = data.name ? `${data.name} portrait` : "Clinton Obi portrait";
  }

  const cv = document.querySelector('[data-link="cv"]');
  if (cv && data.cv) cv.href = safeUrl(data.cv);

  renderProjects(data.projects);
  renderExperience(data.experience);
  renderSkills(data.skills);
  renderCertifications(data.certifications);
  renderContactLinks(data.contactLinks);
};

const initialiseMenu = () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-navigation");
  if (!toggle || !nav) return;

  const closeMenu = (returnFocus = false) => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu()));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (nav.classList.contains("is-open") && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) closeMenu();
  });
};

const initialiseContactForm = () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = form.querySelector(".form-status");
  const submit = form.querySelector('button[type="submit"]');
  const defaultText = submit?.innerHTML || "Send message";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (status) {
      status.textContent = "";
      status.dataset.state = "";
    }
    if (submit) {
      submit.disabled = true;
      submit.textContent = "Sending…";
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      if (status) {
        status.textContent = "Message sent. I will reply by email.";
        status.dataset.state = "success";
      }
    } catch (error) {
      if (status) {
        status.textContent = "The message could not be sent. Please email realclintonobi@gmail.com directly.";
        status.dataset.state = "error";
      }
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.innerHTML = defaultText;
      }
    }
  });
};

(async function initialiseSite() {
  initialiseMenu();
  initialiseContactForm();
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  try {
    const response = await fetch("/content/site.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Content unavailable");
    applyContent(await response.json());
  } catch (error) {
    console.info("Using embedded portfolio content.");
  }
})();
