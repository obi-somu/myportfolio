const fs = require("fs");
const path = require("path");

const requiredFiles = [
  "index.html",
  "css/style.css",
  "js/app.js",
  "content/site.json",
  "admin/index.html",
  "admin/config.yml"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/site.json"), "utf8"));
console.log("Static portfolio build check passed.");
