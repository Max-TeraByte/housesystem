import {
  db,
  auth,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail
} from "./firebase.js";
import { HOUSE_BY_ID } from "./config.js";
import { t, applyStaticText, buildLanguageSwitch, onLocaleChange } from "./i18n.js";
import {
  initTheme,
  toggleTheme,
  formatPoints,
  formatSigned,
  formatDateTime,
  formatRelative,
  escapeHtml,
  authErrorMessage,
  toDate
} from "./util.js";

initTheme();

const EMAIL_KEY = "nhes.house.staffEmail";

const signInView = document.getElementById("signInView");
const staffView = document.getElementById("staffView");
const form = document.getElementById("signInForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const signInButton = document.getElementById("signInButton");
const authError = document.getElementById("authError");
const togglePassword = document.getElementById("togglePassword");
const resetLink = document.getElementById("resetLink");
const signOutButton = document.getElementById("signOutButton");
const whoami = document.getElementById("whoami");
const roleChip = document.getElementById("roleChip");
const staffMessage = document.getElementById("staffMessage");
const staffContent = document.getElementById("staffContent");
const staffStats = document.getElementById("staffStats");
const ledgerBody = document.getElementById("ledgerBody");
const ledgerCount = document.getElementById("ledgerCount");

let lastRender = null;

document.getElementById("themeToggle2").addEventListener("click", () => toggleTheme());
document.getElementById("languageSlot").append(buildLanguageSwitch(() => redraw()));
document.getElementById("languageSlotAuth").append(buildLanguageSwitch(() => redraw()));

applyStaticText();

function redraw() {
  applyStaticText();
  document.title = `${t("staff.title")} · ${t("brand.school")}`;
  if (lastRender) {
    renderStats(lastRender.houses, lastRender.entries);
    renderLedger(lastRender.entries);
  }
}

onLocaleChange(() => redraw());

const savedEmail = localStorage.getItem(EMAIL_KEY);
if (savedEmail) {
  emailInput.value = savedEmail;
  rememberInput.checked = true;
}

togglePassword.addEventListener("click", () => {
  const shown = passwordInput.type === "text";
  passwordInput.type = shown ? "password" : "text";
  togglePassword.setAttribute("aria-label", t(shown ? "staff.showPassword" : "staff.hidePassword"));
  passwordInput.focus();
});

function setAuthError(message, tone = "error") {
  if (!message) {
    authError.hidden = true;
    authError.innerHTML = "";
    return;
  }
  authError.hidden = false;
  authError.innerHTML =
    tone === "error"
      ? `<div class="notice notice--error" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <circle cx="12" cy="12" r="9" /><path d="M12 7.6v5.2M12 16.4h.01" />
          </svg>
          <span>${escapeHtml(message)}</span>
        </div>`
      : `<div class="notice"><span>${escapeHtml(message)}</span></div>`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setAuthError("");
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) {
    setAuthError(t("staff.needBoth"));
    return;
  }
  signInButton.disabled = true;
  signInButton.textContent = t("staff.signingIn");
  try {
    await setPersistence(auth, rememberInput.checked ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    if (rememberInput.checked) localStorage.setItem(EMAIL_KEY, email);
    else localStorage.removeItem(EMAIL_KEY);
  } catch (error) {
    setAuthError(authErrorMessage(error.code));
    passwordInput.value = "";
    passwordInput.focus();
  } finally {
    signInButton.disabled = false;
    signInButton.textContent = t("staff.signIn");
  }
});

resetLink.addEventListener("click", async (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  if (!email) {
    setAuthError(t("staff.needEmailFirst"));
    emailInput.focus();
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    setAuthError(t("staff.resetSent", { email }), "info");
  } catch (error) {
    setAuthError(authErrorMessage(error.code));
  }
});

signOutButton.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    staffView.hidden = true;
    signInView.hidden = false;
    passwordInput.value = "";
    lastRender = null;
    return;
  }
  signInView.hidden = true;
  staffView.hidden = false;
  whoami.textContent = user.email || user.uid;
  await loadRecord(user);
});

async function loadRecord(user) {
  staffMessage.innerHTML = "";
  staffContent.hidden = true;

  let admin = null;
  try {
    const snapshot = await getDoc(doc(db, "admins", user.uid));
    if (snapshot.exists()) admin = snapshot.data();
  } catch (error) {
    admin = null;
  }

  if (!admin || admin.active === false) {
    roleChip.textContent = t("staff.roleNone");
    staffMessage.innerHTML = `
      <div class="notice" style="margin-bottom: 20px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
          <circle cx="12" cy="12" r="9" /><path d="M12 7.6v5.2M12 16.4h.01" />
        </svg>
        <span>
          ${escapeHtml(t("staff.noAccess"))}
          <a href="index.html" style="text-decoration: underline; text-underline-offset: 3px">${escapeHtml(t("staff.noAccessLink"))}</a>.
        </span>
      </div>`;
    return;
  }

  roleChip.textContent = admin.role === "owner" ? t("staff.roleOwner") : t("staff.roleCoordinator");
  if (admin.name) whoami.textContent = `${admin.name} (${user.email})`;

  try {
    const [houseSnapshot, ledgerSnapshot] = await Promise.all([
      getDocs(collection(db, "houses")),
      getDocs(query(collection(db, "transactions"), orderBy("createdAt", "desc"), limit(60)))
    ]);

    const houses = houseSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    const entries = ledgerSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    lastRender = { houses, entries };
    renderStats(houses, entries);
    renderLedger(entries);
    staffContent.hidden = false;
  } catch (error) {
    staffMessage.innerHTML = `
      <div class="notice notice--error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
          <circle cx="12" cy="12" r="9" /><path d="M12 7.6v5.2M12 16.4h.01" />
        </svg>
        <span>${escapeHtml(t("staff.loadFailed"))} ${escapeHtml(t("staff.tryAgain"))}</span>
      </div>`;
  }
}

function renderStats(houses, entries) {
  const total = houses.reduce((sum, h) => sum + (Number(h.points) || 0), 0);
  const now = Date.now();
  const week = entries.filter((e) => {
    const date = toDate(e.createdAt);
    return date && now - date.getTime() < 7 * 86400000;
  });
  const awarded = week.reduce((sum, e) => sum + Math.max(0, Number(e.delta) || 0), 0);
  const latest = entries[0];
  const latestHouse = latest ? HOUSE_BY_ID[latest.houseId] : null;

  const cards = [
    { label: t("staff.statTotal"), value: formatPoints(total), hint: t("staff.statTotalHint") },
    { label: t("staff.statShown"), value: formatPoints(entries.length), hint: t("staff.statShownHint") },
    { label: t("staff.statWeek"), value: formatPoints(awarded), hint: t("staff.statWeekHint", { count: week.length }) },
    {
      label: t("staff.statLast"),
      value: latest ? formatRelative(latest.createdAt) : "—",
      hint: latest
        ? t("staff.statLastHint", {
            house: latestHouse ? latestHouse.name : latest.houseName || latest.houseId || "",
            actor: latest.actorName || latest.actorEmail || ""
          })
        : t("staff.statLastNone")
    }
  ];

  staffStats.innerHTML = cards
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

function renderLedger(entries) {
  ledgerCount.textContent = t(entries.length === 1 ? "staff.entriesShownOne" : "staff.entriesShown", {
    count: formatPoints(entries.length)
  });

  if (!entries.length) {
    ledgerBody.innerHTML = `
      <tr><td colspan="6">
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 4.5h14v15H5zM8.5 9h7M8.5 12.5h7M8.5 16h4" />
          </svg>
          <div>${escapeHtml(t("staff.noEntries"))}</div>
        </div>
      </td></tr>`;
    return;
  }

  ledgerBody.innerHTML = entries
    .map((entry) => {
      const house = HOUSE_BY_ID[entry.houseId];
      const delta = Number(entry.delta) || 0;
      const voided = entry.voided === true;
      return `
        <tr${voided ? ' style="opacity: 0.52"' : ""}>
          <td class="nowrap" title="${escapeHtml(formatDateTime(entry.createdAt))}">${escapeHtml(formatRelative(entry.createdAt))}</td>
          <td style="--house-color: var(--house-${escapeHtml(entry.houseId || "wolves")})">
            <span class="cell-house">${escapeHtml(house ? house.name : entry.houseName || entry.houseId || "—")}</span>
          </td>
          <td><span class="delta" data-sign="${delta > 0 ? "pos" : delta < 0 ? "neg" : "zero"}">${escapeHtml(formatSigned(delta))}</span>${voided ? ` <span class="chip">${escapeHtml(t("staff.voided"))}</span>` : ""}</td>
          <td>${entry.category ? `<span class="chip">${escapeHtml(entry.category)}</span>` : '<span class="muted">—</span>'}</td>
          <td>${entry.reason ? escapeHtml(entry.reason) : `<span class="muted">${escapeHtml(t("staff.noReason"))}</span>`}${entry.note ? `<div class="muted" style="margin-top: 3px">${escapeHtml(entry.note)}</div>` : ""}</td>
          <td class="nowrap">${escapeHtml(entry.actorName || entry.actorEmail || "—")}</td>
        </tr>`;
    })
    .join("");
}
