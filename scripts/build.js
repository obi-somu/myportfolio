const fs = require("fs");
const path = require("path");

const root = process.cwd();
const requiredFiles = [
  "index.html",
  "__forms.html",
  "favicon.svg",
  "robots.txt",
  "sitemap.xml",
  "netlify.toml",
  "css/style.css",
  "js/app.js",
  "js/auth-redirect.js",
  "js/admin-login.js",
  "content/site.json",
  "admin/index.html",
  "admin/config.yml",
  "admin-login/index.html",
  "admin-login/admin-login.css",
  "assets/profile-pic.jpg",
  "assets/resume.pdf",
  "assets/og-clinton-obi.jpg",
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) throw new Error(`Missing required files: ${missing.join(", ")}`);

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const assertIncludes = (content, expected, label) => {
  if (!content.includes(expected)) throw new Error(`${label} is missing: ${expected}`);
};

const content = JSON.parse(read("content/site.json"));
const home = read("index.html");
const app = read("js/app.js");
const admin = read("admin/index.html");
const adminLogin = read("admin-login/index.html");
const redirects = read("netlify.toml");

assertIncludes(home, 'rel="canonical"', "SEO metadata");
assertIncludes(home, 'property="og:image"', "Open Graph metadata");
assertIncludes(home, 'name="twitter:card"', "Twitter metadata");
assertIncludes(home, 'type="application/ld+json"', "structured data");
assertIncludes(home, 'autocomplete="name"', "contact form");
assertIncludes(home, 'autocomplete="email"', "contact form");
assertIncludes(home, "case-study-list", "proof-led project layout");
assertIncludes(home, "Digital Marketing Executive", "Novotel role title");
assertIncludes(app, 'event.key === "Escape"', "mobile navigation keyboard handling");
assertIncludes(app, 'aria-expanded', "mobile navigation state handling");
assertIncludes(admin, "decap-cms@3.15.1", "pinned Decap CMS dependency");
assertIncludes(adminLogin, "noindex, nofollow", "admin login robots protection");
assertIncludes(redirects, 'Role = ["admin"]', "admin role redirects");
assertIncludes(redirects, "/admin-login/index.html", "public administrator sign-in fallback");
assertIncludes(redirects, "Content-Security-Policy", "security headers");
assertIncludes(redirects, "X-Content-Type-Options", "security headers");

if (content.experience?.[0]?.period !== "Nov 2025 – Early 2026") {
  throw new Error("Novotel employment status must end in early 2026.");
}
if (content.location !== "Malta" || content.basedIn !== "Malta") {
  throw new Error("Public location must be shown as Malta only.");
}
if (content.projects.some((project) => !project.challenge || !project.contribution || !project.outcome)) {
  throw new Error("Every project must include challenge, contribution and outcome proof.");
}
if (!content.projects?.length || content.projects.some((project) => project.image || !/^https:\/\//.test(project.url))) {
  throw new Error("Projects must use real HTTPS destinations and code-native visuals.");
}
if (content.projects.some((project) => project.url.includes("#contact"))) {
  throw new Error("Project calls to action must not point to the contact section.");
}

const jpegDimensions = (buffer) => {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
};

const socialCard = jpegDimensions(fs.readFileSync(path.join(root, "assets/og-clinton-obi.jpg")));
if (!socialCard || socialCard.width !== 1200 || socialCard.height !== 630) {
  throw new Error("Social card must be 1200 × 630 pixels.");
}

console.log("Portfolio build checks passed: content, security, SEO, accessibility and assets verified.");
