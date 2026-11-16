// ===== common.js - small helpers shared by every page =====

// ---- saving and loading (data lives only in THIS browser, via localStorage) ----
function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;   // turn the saved text back into real data
  } catch (err) {
    return fallback;                            // if anything goes wrong, start fresh
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));   // turn data into text and store it
}

// a simple unique id for every task / reason / planner item
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// makes user text safe before we put it inside HTML
function esc(text) {
  const box = document.createElement("div");
  box.textContent = text;
  return box.innerHTML;
}

// ---- date helpers (dates are stored as text like "2026-11-20") ----
function toKey(dateObj) {
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day_num = String(dateObj.getDate()).padStart(2, "0");
  return dateObj.getFullYear() + "-" + month + "-" + day_num;
}

function parseKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// how many days from today until the deadline (negative = already passed)
function daysLeft(key) {
  if (!key) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseKey(key) - today) / 86400000);
}

// turns a deadline into a friendly sentence + a colour class
function dueLabel(key) {
  const n = daysLeft(key);
  const nice = parseKey(key).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  if (n < 0) return { cls: "late", text: "Was due " + nice + " (" + (-n) + " day" + (n === -1 ? "" : "s") + " ago)" };
  if (n === 0) return { cls: "late", text: "Due today (" + nice + ")" };
  if (n === 1) return { cls: "soon", text: "Due tomorrow (" + nice + ")" };
  if (n <= 3) return { cls: "soon", text: "Due in " + n + " days (" + nice + ")" };
  return { cls: "ok", text: "Due in " + n + " days (" + nice + ")" };
}

// ---- the navigation bar (same on every page) ----
const PAGES = [
  ["index.html", "Home"],
  ["calendar.html", "Calendar"],
  ["why.html", "My Why"],
  ["planner.html", "Planner"],
  ["focus.html", "Focus"],
  ["about.html", "About"]
];

function drawNav() {
  const current = location.pathname.split("/").pop() || "index.html";   // which page are we on?
  let linksHtml = "";
  PAGES.forEach(function (page) {
    const isActive = page[0] === current ? "active" : "";
    linksHtml += '<a class="' + isActive + '" href="' + page[0] + '">' + page[1] + "</a>";
  });
  document.getElementById("nav").innerHTML =
    '<a class="brand" href="index.html">Class Board</a><div class="links">' + linksHtml + "</div>";
}

drawNav();
