import { db, collection, doc, onSnapshot } from "./firebase.js";
import { HOUSES, HOUSE_BY_ID, SCHOOL_NAME } from "./config.js";
import { t, applyStaticText, buildLanguageSwitch, onLocaleChange } from "./i18n.js";
import {
  initTheme,
  toggleTheme,
  formatPoints,
  formatSigned,
  formatRelative,
  formatDateTime,
  animateNumber,
  escapeHtml,
  ordinal,
  toDate
} from "./util.js";

initTheme();

const els = {
  grid: document.getElementById("houseGrid"),
  error: document.getElementById("errorSlot"),
  liveDot: document.getElementById("liveDot"),
  liveLabel: document.getElementById("liveLabel"),
  updated: document.getElementById("updatedAt"),
  updatedWrap: document.getElementById("updatedWrap"),
  seasonLabel: document.getElementById("seasonLabel"),
  themeToggle: document.getElementById("themeToggle"),
  languageSlot: document.getElementById("languageSlot"),
  sheetRoot: document.getElementById("sheetRoot"),
  sheetClose: document.getElementById("sheetClose"),
  sheetLogo: document.getElementById("sheetLogo"),
  sheetHouse: document.getElementById("sheetHouse"),
  sheetPoints: document.getElementById("sheetPoints"),
  sheetList: document.getElementById("sheetList")
};

const houseState = new Map(HOUSES.map((house) => [house.id, { ...house, points: 0, recentChanges: [], updatedAt: null }]));

let lastTouched = null;
let seasonLabel = "";
let schoolName = SCHOOL_NAME;
let openHouseId = null;
let connectionState = "connecting";

els.themeToggle.addEventListener("click", () => toggleTheme());
els.languageSlot.append(buildLanguageSwitch(() => redraw()));

applyStaticText();
renderCards();

function redraw() {
  applyStaticText();
  document.title = `${t("page.title")} · ${schoolName}`;
  if (seasonLabel) els.seasonLabel.textContent = seasonLabel;
  setStatus(connectionState);
  renderCards();
  render();
  if (openHouseId) renderSheet(openHouseId);
}

onLocaleChange(() => redraw());

function renderCards() {
  els.grid.innerHTML = HOUSES.map(
    (house) => `
      <button
        class="house"
        type="button"
        data-house="${house.id}"
        data-rank="0"
        style="--house-color: var(--house-${house.id})"
        aria-label="${escapeHtml(house.name)}"
      >
        <span class="house__rank" data-role="rank">&mdash;</span>
        <svg class="house__crown" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 8.5l4 3.2L12 4l5 7.7 4-3.2-1.7 10H4.7z" />
        </svg>
        <img class="house__logo" src="${house.logo}" alt="" loading="eager" decoding="async" />
        <span class="house__name">${escapeHtml(house.name)}</span>
        <span class="house__points skeleton" data-role="points" data-value="0">0000</span>
        <span class="house__unit">${escapeHtml(t("standings.points"))}</span>
        <span class="house__bar"><span data-role="bar"></span></span>
      </button>`
  ).join("");

  els.grid.querySelectorAll(".house").forEach((card) => {
    card.addEventListener("click", () => openSheet(card.dataset.house));
  });
}

function setStatus(state) {
  connectionState = state;
  els.liveDot.dataset.state = state;
  els.liveLabel.textContent =
    state === "live" ? t("hero.live") : state === "connecting" ? t("hero.connecting") : t("hero.offline");
}

function showError(messageKey) {
  els.error.innerHTML = `
    <div class="notice notice--error" role="alert">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <circle cx="12" cy="12" r="9" /><path d="M12 7.6v5.2M12 16.4h.01" />
      </svg>
      <span>${escapeHtml(t(messageKey))}</span>
    </div>`;
}

onSnapshot(
  collection(db, "houses"),
  (snapshot) => {
    els.error.innerHTML = "";
    setStatus("live");
    snapshot.docs.forEach((document_) => {
      const base = HOUSE_BY_ID[document_.id];
      if (!base) return;
      const data = document_.data();
      houseState.set(document_.id, {
        ...base,
        points: Number(data.points) || 0,
        recentChanges: Array.isArray(data.recentChanges) ? data.recentChanges : [],
        updatedAt: toDate(data.updatedAt)
      });
    });
    lastTouched = [...houseState.values()].filter((h) => h.updatedAt).sort((a, b) => b.updatedAt - a.updatedAt)[0] || null;
    render();
    if (openHouseId) renderSheet(openHouseId);
  },
  (error) => {
    setStatus("error");
    showError(error.code === "permission-denied" ? "error.notPublished" : "error.unreachable");
  }
);

onSnapshot(
  doc(db, "config", "system"),
  (snapshot) => {
    if (!snapshot.exists()) return;
    const data = snapshot.data();
    seasonLabel = data.seasonLabel || "";
    schoolName = data.schoolName || SCHOOL_NAME;
    if (seasonLabel) els.seasonLabel.textContent = seasonLabel;
    document.title = `${t("page.title")} · ${schoolName}`;
  },
  () => {}
);

function render() {
  const houses = [...houseState.values()];
  const ranked = [...houses].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  const max = Math.max(1, ...houses.map((house) => house.points));
  const total = houses.reduce((sum, house) => sum + house.points, 0);

  const rankOf = new Map();
  let position = 0;
  let previous = null;
  ranked.forEach((house, index) => {
    if (house.points !== previous) {
      position = index + 1;
      previous = house.points;
    }
    rankOf.set(house.id, position);
  });

  ranked.forEach((house) => {
    const card = els.grid.querySelector(`[data-house="${house.id}"]`);
    if (!card) return;
    const rank = rankOf.get(house.id);
    card.style.order = String(rank);
    card.dataset.rank = String(rank);
    card.querySelector('[data-role="rank"]').textContent = total > 0 ? ordinal(rank) : "—";
    const points = card.querySelector('[data-role="points"]');
    points.classList.remove("skeleton");
    animateNumber(points, house.points);
    card.querySelector('[data-role="bar"]').style.width = `${Math.max(2, (house.points / max) * 100)}%`;
  });

  els.updated.textContent = lastTouched ? formatRelative(lastTouched.updatedAt) : "—";
  if (lastTouched) els.updatedWrap.title = formatDateTime(lastTouched.updatedAt);
}

function openSheet(houseId) {
  openHouseId = houseId;
  renderSheet(houseId);
  els.sheetRoot.hidden = false;
  document.body.style.overflow = "hidden";
  els.sheetClose.focus();
}

function closeSheet() {
  openHouseId = null;
  els.sheetRoot.hidden = true;
  document.body.style.overflow = "";
}

function renderSheet(houseId) {
  const house = houseState.get(houseId);
  if (!house) return;

  els.sheetLogo.src = house.logo;
  els.sheetLogo.alt = house.name;
  els.sheetHouse.textContent = house.name;
  els.sheetPoints.textContent = formatPoints(house.points);

  const changes = [...(house.recentChanges || [])]
    .map((change) => ({
      delta: Math.round(Number(change.delta) || 0),
      reason: typeof change.reason === "string" ? change.reason : "",
      category: typeof change.category === "string" ? change.category : "",
      at: toDate(change.at)
    }))
    .sort((a, b) => (b.at?.getTime() || 0) - (a.at?.getTime() || 0))
    .slice(0, 5);

  if (!changes.length) {
    els.sheetList.innerHTML = `<div class="sheet__empty">${escapeHtml(t("board.noChanges"))}</div>`;
    return;
  }

  els.sheetList.innerHTML = changes
    .map((change) => {
      return `
        <div class="change">
          <span class="change__delta" data-sign="${change.delta > 0 ? "pos" : change.delta < 0 ? "neg" : "zero"}">
            ${escapeHtml(formatSigned(change.delta))}
          </span>
          <span class="change__body">
            <span class="change__reason"${change.reason ? "" : ' data-empty="true"'}>${escapeHtml(change.reason || t("board.noReason"))}</span>
            <span class="change__meta">
              ${change.category ? `<span class="chip">${escapeHtml(change.category)}</span>` : ""}
              ${change.at ? `<span title="${escapeHtml(formatDateTime(change.at))}">${escapeHtml(formatRelative(change.at))}</span>` : ""}
            </span>
          </span>
        </div>`;
    })
    .join("");
}

els.sheetClose.addEventListener("click", closeSheet);
els.sheetRoot.addEventListener("mousedown", (event) => {
  if (event.target === els.sheetRoot) closeSheet();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && openHouseId) closeSheet();
});

window.addEventListener("online", () => setStatus("live"));
window.addEventListener("offline", () => setStatus("offline"));

setInterval(() => {
  if (lastTouched) els.updated.textContent = formatRelative(lastTouched.updatedAt);
  if (openHouseId) renderSheet(openHouseId);
}, 30000);
