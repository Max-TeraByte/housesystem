import { db, collection, doc, onSnapshot, getDocs, query, orderBy, limit } from "./firebase.js";
import { HOUSES, HOUSE_BY_ID, SCHOOL_NAME } from "./config.js";
import { t, tn, applyStaticText, buildLanguageSwitch, onLocaleChange } from "./i18n.js";
import {
  initTheme,
  toggleTheme,
  formatPoints,
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
  compare: document.getElementById("compareList"),
  stats: document.getElementById("statGrid"),
  error: document.getElementById("errorSlot"),
  liveDot: document.getElementById("liveDot"),
  liveLabel: document.getElementById("liveLabel"),
  total: document.getElementById("totalPoints"),
  updated: document.getElementById("updatedAt"),
  seasonLabel: document.getElementById("seasonLabel"),
  leaderCard: document.getElementById("leaderCard"),
  leaderLogo: document.getElementById("leaderLogo"),
  leaderName: document.getElementById("leaderName"),
  leaderDetail: document.getElementById("leaderDetail"),
  leaderPoints: document.getElementById("leaderPoints"),
  champions: document.getElementById("championsList"),
  championsSection: document.getElementById("championsSection"),
  footer: document.getElementById("footerLine"),
  themeToggle: document.getElementById("themeToggle"),
  languageSlot: document.getElementById("languageSlot")
};

els.themeToggle.addEventListener("click", () => toggleTheme());
els.languageSlot.append(buildLanguageSwitch(() => redraw()));

const houseState = new Map(HOUSES.map((h) => [h.id, { ...h, points: 0, updatedAt: null, exists: false }]));
let lastTouched = null;
let seasonLabel = "";
let schoolName = SCHOOL_NAME;
let championRows = [];
let connectionState = "connecting";

applyStaticText();
renderSkeleton();
renderCompare();
renderStats();

function redraw() {
  applyStaticText();
  document.title = `${t("page.title")} · ${schoolName}`;
  renderSkeleton();
  renderCompare();
  setStatus(connectionState);
  render();
  renderChampions();
}

onLocaleChange(() => redraw());

function renderSkeleton() {
  els.grid.innerHTML = HOUSES.map(
    (house) => `
      <article class="house-card" data-house="${house.id}" data-rank="0" style="--house-color: var(--house-${house.id})">
        <span class="house-card__rank" data-role="rank">&mdash;</span>
        <svg class="house-card__crown" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 8.5l4 3.2L12 4l5 7.7 4-3.2-1.7 10H4.7z" />
        </svg>
        <img
          class="house-card__logo"
          src="${house.logo}"
          alt="${escapeHtml(house.name)}"
          loading="lazy"
          decoding="async"
          onerror="this.replaceWith(Object.assign(document.createElement('h3'), { className: 'house-card__name', textContent: '${house.name}' }))"
        />
        <h3 class="sr-only">${house.name}</h3>
        <div class="house-card__points count-up skeleton" data-role="points" data-value="0">0000</div>
        <div class="house-card__unit">${escapeHtml(t("standings.points"))}</div>
        <div class="house-card__bar"><span data-role="bar"></span></div>
        <div class="house-card__gap" data-role="gap"></div>
      </article>`
  ).join("");
}

function renderCompare() {
  els.compare.innerHTML = HOUSES.map(
    (house) => `
      <div class="compare__row" data-house="${house.id}" style="--house-color: var(--house-${house.id})">
        <span class="compare__name">${house.name}</span>
        <span class="compare__track"><span class="compare__fill" data-role="fill"></span></span>
        <span class="compare__value" data-role="value">&mdash;</span>
      </div>`
  ).join("");
}

function setStatus(state) {
  connectionState = state;
  els.liveDot.dataset.state = state;
  els.liveLabel.textContent =
    state === "live" ? t("hero.live") : state === "connecting" ? t("hero.connecting") : t("hero.offline");
}

function showError(messageKey) {
  els.error.innerHTML = `
    <div class="notice notice--error" role="alert" style="margin-bottom: 20px">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <circle cx="12" cy="12" r="9" /><path d="M12 7.6v5.2M12 16.4h.01" />
      </svg>
      <span>${escapeHtml(t(messageKey))}</span>
    </div>`;
}

function clearError() {
  els.error.innerHTML = "";
}

onSnapshot(
  collection(db, "houses"),
  (snapshot) => {
    clearError();
    setStatus("live");
    snapshot.docs.forEach((document_) => {
      const data = document_.data();
      const base = HOUSE_BY_ID[document_.id];
      if (!base) return;
      houseState.set(document_.id, {
        ...base,
        points: Number(data.points) || 0,
        lastDelta: Number(data.lastDelta) || 0,
        updatedAt: toDate(data.updatedAt),
        exists: true
      });
    });
    const touched = [...houseState.values()].filter((h) => h.updatedAt).sort((a, b) => b.updatedAt - a.updatedAt)[0];
    lastTouched = touched || null;
    render();
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
    els.footer.textContent = `${schoolName} · ${t("brand.sub")}`;
    document.title = `${t("page.title")} · ${schoolName}`;
  },
  () => {}
);

loadChampions();

async function loadChampions() {
  try {
    const snapshot = await getDocs(query(collection(db, "seasons"), orderBy("endedAt", "desc"), limit(8)));
    championRows = snapshot.docs
      .map((document_) => document_.data())
      .filter((season) => season.endedAt && season.championHouseId);
    renderChampions();
  } catch (error) {
    els.championsSection.hidden = true;
  }
}

function renderChampions() {
  if (!championRows.length) {
    els.championsSection.hidden = true;
    return;
  }
  els.championsSection.hidden = false;
  els.champions.innerHTML = championRows
    .map((season) => {
      const house = HOUSE_BY_ID[season.championHouseId];
      if (!house) return "";
      return `
        <div class="champion-row">
          <img class="champion-row__logo" src="${house.logo}" alt="" aria-hidden="true" loading="lazy" />
          <div>
            <div class="champion-row__house">${house.name}</div>
            <div class="champion-row__season">${escapeHtml(season.label || season.id || "")}</div>
          </div>
          <div class="champion-row__points">${escapeHtml(formatPoints(season.championPoints || 0))}</div>
        </div>`;
    })
    .join("");
}

function render() {
  const houses = [...houseState.values()];
  const ranked = [...houses].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  const max = Math.max(1, ...houses.map((h) => h.points));
  const total = houses.reduce((sum, h) => sum + h.points, 0);
  const leader = ranked[0];
  const runnerUp = ranked[1];

  const rankOf = new Map();
  let position = 0;
  let previousPoints = null;
  ranked.forEach((house, index) => {
    if (house.points !== previousPoints) {
      position = index + 1;
      previousPoints = house.points;
    }
    rankOf.set(house.id, position);
  });

  ranked.forEach((house) => {
    const card = els.grid.querySelector(`[data-house="${house.id}"]`);
    if (!card) return;
    card.style.order = String(rankOf.get(house.id));
    card.dataset.rank = String(rankOf.get(house.id));
    card.querySelector('[data-role="rank"]').textContent = total > 0 ? ordinal(rankOf.get(house.id)) : "—";
    const pointsEl = card.querySelector('[data-role="points"]');
    pointsEl.classList.remove("skeleton");
    animateNumber(pointsEl, house.points);
    card.querySelector('[data-role="bar"]').style.width = `${Math.max(2, (house.points / max) * 100)}%`;
    const gapEl = card.querySelector('[data-role="gap"]');
    if (total === 0) {
      gapEl.textContent = t("standings.notStarted");
    } else if (house.id === leader.id) {
      const lead = runnerUp ? house.points - runnerUp.points : 0;
      gapEl.textContent = lead > 0 ? t("standings.ahead", { points: formatPoints(lead) }) : t("standings.tied");
    } else {
      gapEl.textContent = t("standings.behind", { points: formatPoints(leader.points - house.points) });
    }
  });

  HOUSES.forEach((house) => {
    const state = houseState.get(house.id);
    const row = els.compare.querySelector(`[data-house="${house.id}"]`);
    if (!row) return;
    row.style.order = String(rankOf.get(house.id));
    row.querySelector('[data-role="fill"]').style.width = `${Math.max(1.5, (state.points / max) * 100)}%`;
    row.querySelector('[data-role="value"]').textContent = formatPoints(state.points);
  });

  els.total.textContent = formatPoints(total);
  els.updated.textContent = lastTouched ? formatRelative(lastTouched.updatedAt) : "—";
  if (lastTouched) els.updated.parentElement.title = formatDateTime(lastTouched.updatedAt);

  if (total > 0 && leader) {
    els.leaderLogo.src = leader.logo;
    els.leaderLogo.alt = leader.name;
    els.leaderName.textContent = leader.name;
    els.leaderPoints.textContent = formatPoints(leader.points);
    els.leaderCard.style.setProperty("--house-color", `var(--house-${leader.id})`);
    const tie = runnerUp && runnerUp.points === leader.points;
    els.leaderDetail.textContent = tie
      ? t("leader.tie", { house: runnerUp.name })
      : runnerUp
        ? t("leader.clear", {
            points: tn("points", leader.points - runnerUp.points, { count: formatPoints(leader.points - runnerUp.points) }),
            house: runnerUp.name
          })
        : t("leader.alone");
  } else {
    els.leaderName.textContent = t("leader.none");
    els.leaderPoints.textContent = formatPoints(0);
    els.leaderDetail.textContent = t("leader.noneDetail");
  }

  renderStats(houses, ranked, total);
}

function renderStats(houses, ranked, total) {
  if (!houses) {
    els.stats.innerHTML = Array.from({ length: 4 })
      .map(
        () => `
        <div class="stat">
          <div class="stat__label">&nbsp;</div>
          <div class="stat__value skeleton">0000</div>
          <div class="stat__hint">&nbsp;</div>
        </div>`
      )
      .join("");
    return;
  }

  const average = total / (houses.length || 1);
  const spread = ranked.length ? ranked[0].points - ranked[ranked.length - 1].points : 0;
  const share = total > 0 ? (ranked[0].points / total) * 100 : 0;

  const cards = [
    { label: t("facts.total"), value: formatPoints(total), hint: t("facts.totalHint") },
    { label: t("facts.average"), value: formatPoints(Math.round(average)), hint: t("facts.averageHint") },
    {
      label: t("facts.spread"),
      value: formatPoints(spread),
      hint:
        spread === 0
          ? t("facts.spreadLevel")
          : t("facts.spreadHint", { first: ranked[0].name, last: ranked[ranked.length - 1].name })
    },
    {
      label: t("facts.share"),
      value: `${share.toFixed(1)}%`,
      hint: total > 0 ? t("facts.shareHint", { house: ranked[0].name }) : t("facts.shareNone")
    }
  ];

  els.stats.innerHTML = cards
    .map(
      (card) => `
      <div class="stat">
        <div class="stat__label">${escapeHtml(card.label)}</div>
        <div class="stat__value">${escapeHtml(card.value)}</div>
        <div class="stat__hint">${escapeHtml(card.hint)}</div>
      </div>`
    )
    .join("");
}

window.addEventListener("online", () => setStatus("live"));
window.addEventListener("offline", () => setStatus("offline"));

setInterval(() => {
  if (lastTouched) els.updated.textContent = formatRelative(lastTouched.updatedAt);
}, 30000);
