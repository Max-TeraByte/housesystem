import { intlLocale, t } from "./i18n.js";

const THEME_KEY = "nhes.house.theme";

export function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  apply(stored || (media.matches ? "dark" : "light"));
  media.addEventListener("change", (event) => {
    if (!localStorage.getItem(THEME_KEY)) apply(event.matches ? "dark" : "light");
  });
}

export function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  apply(next);
  return next;
}

function apply(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#121311" : "#f6f6f4");
  document.querySelectorAll("[data-theme-icon]").forEach((node) => {
    node.innerHTML = theme === "dark" ? ICON_SUN : ICON_MOON;
  });
}

const ICON_SUN =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const ICON_MOON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z"/></svg>';

const numberCache = new Map();

function numberFormatter() {
  const code = intlLocale();
  if (!numberCache.has(code)) numberCache.set(code, new Intl.NumberFormat(code));
  return numberCache.get(code);
}

export function formatPoints(value) {
  return numberFormatter().format(Math.round(Number(value) || 0));
}

export function formatSigned(value) {
  const n = Math.round(Number(value) || 0);
  return (n > 0 ? "+" : n < 0 ? "−" : "") + numberFormatter().format(Math.abs(n));
}

export function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "number") return new Date(value);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateTime(value) {
  const date = toDate(value);
  if (!date) return "—";
  return date.toLocaleString(intlLocale(), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export function formatRelative(value) {
  const date = toDate(value);
  if (!date) return "—";
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 45) return t("time.justNow");
  const units = [
    ["minute", 60],
    ["hour", 3600],
    ["day", 86400],
    ["week", 604800],
    ["month", 2629800],
    ["year", 31557600]
  ];
  let chosen = units[0];
  for (const unit of units) {
    if (seconds >= unit[1]) chosen = unit;
  }
  const amount = Math.round(seconds / chosen[1]);
  return new Intl.RelativeTimeFormat(intlLocale(), { numeric: "auto" }).format(-amount, chosen[0]);
}

export function ordinal(n) {
  if (intlLocale().startsWith("es")) return `${n}º`;
  const suffixes = ["th", "st", "nd", "rd"];
  const value = Math.abs(n) % 100;
  return n + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

export function animateNumber(element, to, duration = 950) {
  const from = Number(element.dataset.value || 0);
  const target = Math.round(Number(to) || 0);
  element.dataset.value = String(target);
  if (from === target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.textContent = formatPoints(target);
    return;
  }
  const start = performance.now();
  function frame(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatPoints(from + (target - from) * eased);
    if (progress < 1) requestAnimationFrame(frame);
    else element.textContent = formatPoints(target);
  }
  requestAnimationFrame(frame);
}

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
  });
}

const AUTH_ERROR_KEYS = {
  "auth/invalid-email": "error.invalid-email",
  "auth/user-disabled": "error.user-disabled",
  "auth/user-not-found": "error.wrong-password",
  "auth/wrong-password": "error.wrong-password",
  "auth/invalid-credential": "error.wrong-password",
  "auth/too-many-requests": "error.too-many-requests",
  "auth/network-request-failed": "error.network",
  "auth/missing-password": "error.missing-password",
  "auth/operation-not-allowed": "error.operation-not-allowed"
};

export function authErrorMessage(code) {
  return t(AUTH_ERROR_KEYS[code] || "error.generic");
}
