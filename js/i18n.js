const STORAGE_KEY = "nhes.house.language";

export const DEFAULT_LOCALE = "es";

export const LOCALES = [
  { id: "es", label: "Español", short: "ES", intl: "es" },
  { id: "en", label: "English", short: "EN", intl: "en-GB" }
];

const DICTIONARIES = {
  es: {
    "page.title": "Clasificación de Casas",
    "page.description":
      "Clasificación en vivo de las casas del North Hill Education System: Wolves, Falcons, Lions y Bears.",
    "brand.school": "North Hill Education System",
    "brand.sub": "Sistema de Casas",
    "nav.staffSignIn": "Acceso del personal",
    "nav.standings": "Clasificación",
    "nav.toggleDark": "Cambiar modo oscuro",
    "nav.language": "Idioma",
    "hero.eyebrow": "Sistema de Casas",
    "hero.title": "Clasificación de Casas",
    "hero.lede": "Puntos ganados por las cuatro casas en deporte, estudios, conducta y servicio a lo largo del año escolar.",
    "hero.connecting": "Conectando…",
    "hero.live": "En vivo",
    "hero.offline": "Sin conexión",
    "hero.totalAwarded": "Total otorgado",
    "hero.updated": "Actualizado",
    "standings.title": "Clasificación actual",
    "standings.note": "Se actualiza sola, no hace falta recargar la página.",
    "standings.points": "Puntos",
    "standings.ahead": "{points} por delante",
    "standings.behind": "{points} por detrás",
    "standings.tied": "Empatada en el primer puesto",
    "standings.notStarted": "Temporada no iniciada",
    "leader.label": "Va en primer lugar",
    "leader.waiting": "Esperando la clasificación…",
    "leader.points": "Puntos",
    "leader.tie": "Empatada con {house} en lo más alto de la tabla.",
    "leader.clear": "{points} por delante de {house}.",
    "leader.alone": "En lo más alto de la tabla.",
    "leader.none": "Aún sin puntos",
    "leader.noneDetail": "La clasificación aparecerá en cuanto se otorguen los primeros puntos.",
    "compare.title": "Lado a lado",
    "facts.title": "De un vistazo",
    "facts.total": "Puntos otorgados en total",
    "facts.totalHint": "Entre las cuatro casas esta temporada",
    "facts.average": "Promedio por casa",
    "facts.averageHint": "Media de puntos por casa",
    "facts.spread": "Del primero al último",
    "facts.spreadLevel": "Todas las casas empatadas",
    "facts.spreadHint": "{first} por delante de {last}",
    "facts.share": "Porcentaje del líder",
    "facts.shareHint": "{house} tiene este porcentaje de todos los puntos",
    "facts.shareNone": "Esperando los primeros puntos",
    "champions.title": "Campeonas anteriores",
    "champions.note": "Temporadas terminadas",
    "notice.readOnly":
      "Esta página es solo de lectura. Los puntos se otorgan y se corrigen únicamente desde la consola de administración del Sistema de Casas, donde cada cambio queda registrado con el nombre del coordinador que lo hizo.",
    "error.notPublished": "La clasificación aún no está publicada. Vuelva a mirar en un rato.",
    "error.unreachable": "No se pudo conectar con el marcador. Revise su conexión e inténtelo de nuevo.",
    "footer.line": "North Hill Education System · Sistema de Casas",
    "staff.title": "Acceso del personal",
    "staff.sub": "Acceso de solo lectura al registro de puntos. Los puntos se otorgan desde la consola de administración.",
    "staff.email": "Correo electrónico de la escuela",
    "staff.emailPlaceholder": "nombre@escuela.edu",
    "staff.password": "Contraseña",
    "staff.passwordPlaceholder": "Escriba su contraseña",
    "staff.showPassword": "Mostrar contraseña",
    "staff.hidePassword": "Ocultar contraseña",
    "staff.keepSignedIn": "Mantener la sesión iniciada en este dispositivo",
    "staff.signIn": "Iniciar sesión",
    "staff.signingIn": "Iniciando sesión…",
    "staff.forgot": "¿Olvidó su contraseña?",
    "staff.backToStandings": "Volver a la clasificación",
    "staff.needBoth": "Escriba su correo electrónico y su contraseña.",
    "staff.needEmailFirst": "Escriba primero su correo electrónico y luego elija ¿Olvidó su contraseña?",
    "staff.resetSent": "Se envió un enlace para restablecer la contraseña a {email}.",
    "staff.recordTitle": "Registro de puntos",
    "staff.recordSub": "Vista de solo lectura para el personal",
    "staff.signedInAs": "Sesión iniciada como",
    "staff.signOut": "Cerrar sesión",
    "staff.roleStaff": "personal",
    "staff.roleOwner": "administrador del sistema",
    "staff.roleCoordinator": "coordinador",
    "staff.roleNone": "sin acceso",
    "staff.readOnlyBanner":
      "Esta vista no puede cambiar ningún valor. Otorgar, ajustar y revertir puntos solo es posible desde la consola de escritorio del Sistema de Casas.",
    "staff.noAccess":
      "Ha iniciado sesión, pero esta cuenta no está en la lista de coordinadores del Sistema de Casas, así que el registro detallado no está disponible. La clasificación pública siempre está abierta en",
    "staff.noAccessLink": "la página de clasificación",
    "staff.loadFailed": "No se pudo cargar el registro.",
    "staff.tryAgain": "Inténtelo de nuevo.",
    "staff.statTotal": "Puntos totales registrados",
    "staff.statTotalHint": "Las cuatro casas",
    "staff.statShown": "Registros visibles",
    "staff.statShownHint": "Actividad más reciente",
    "staff.statWeek": "Otorgados esta semana",
    "staff.statWeekHint": "{count} registros en los últimos 7 días",
    "staff.statLast": "Último cambio",
    "staff.statLastNone": "Aún no hay registros",
    "staff.statLastHint": "{house} por {actor}",
    "staff.recentActivity": "Actividad reciente",
    "staff.entriesShown": "{count} registros más recientes",
    "staff.entriesShownOne": "{count} registro más reciente",
    "staff.colWhen": "Cuándo",
    "staff.colHouse": "Casa",
    "staff.colChange": "Cambio",
    "staff.colCategory": "Categoría",
    "staff.colReason": "Motivo",
    "staff.colActor": "Registrado por",
    "staff.noEntries": "Aún no se han registrado puntos.",
    "staff.noReason": "Sin motivo indicado",
    "staff.voided": "anulado",
    "notFound.title": "Página no encontrada",
    "notFound.text": "La página que busca no existe en el sitio del Sistema de Casas.",
    "notFound.action": "Ir a la clasificación",
    "points_one": "{count} punto",
    "points_other": "{count} puntos",
    "time.justNow": "ahora mismo",
    "error.invalid-email": "Ese correo electrónico no es válido.",
    "error.user-disabled": "Esta cuenta ha sido deshabilitada.",
    "error.wrong-password": "El correo o la contraseña no son correctos.",
    "error.missing-password": "Escriba su contraseña.",
    "error.too-many-requests": "Demasiados intentos. Espere un momento e inténtelo de nuevo.",
    "error.network": "Error de red. Revise su conexión e inténtelo de nuevo.",
    "error.operation-not-allowed": "El inicio de sesión con correo no está habilitado en este proyecto.",
    "error.generic": "No se pudo iniciar sesión. Inténtelo de nuevo."
  },
  en: {
    "page.title": "House Standings",
    "page.description":
      "Live house point standings for the North Hill Education System House System: Wolves, Falcons, Lions and Bears.",
    "brand.school": "North Hill Education System",
    "brand.sub": "House System",
    "nav.staffSignIn": "Staff sign in",
    "nav.standings": "Standings",
    "nav.toggleDark": "Toggle dark mode",
    "nav.language": "Language",
    "hero.eyebrow": "House System",
    "hero.title": "House Standings",
    "hero.lede": "Points earned by the four houses across sport, academics, conduct and service throughout the school year.",
    "hero.connecting": "Connecting…",
    "hero.live": "Live",
    "hero.offline": "Offline",
    "hero.totalAwarded": "Total awarded",
    "hero.updated": "Updated",
    "standings.title": "Current standings",
    "standings.note": "Updates automatically — no need to refresh.",
    "standings.points": "Points",
    "standings.ahead": "{points} ahead",
    "standings.behind": "{points} behind",
    "standings.tied": "Tied for the lead",
    "standings.notStarted": "Season not started",
    "leader.label": "Currently leading",
    "leader.waiting": "Waiting for standings…",
    "leader.points": "Points",
    "leader.tie": "Level with {house} at the top of the table.",
    "leader.clear": "{points} clear of {house}.",
    "leader.alone": "Holding the top of the table.",
    "leader.none": "No points yet",
    "leader.noneDetail": "Standings will appear as soon as the first points are awarded.",
    "compare.title": "Side by side",
    "facts.title": "At a glance",
    "facts.total": "Total points awarded",
    "facts.totalHint": "Across all four houses this season",
    "facts.average": "House average",
    "facts.averageHint": "Mean points per house",
    "facts.spread": "First to last",
    "facts.spreadLevel": "All houses level",
    "facts.spreadHint": "{first} leads {last}",
    "facts.share": "Leader's share",
    "facts.shareHint": "{house} holds this share of all points",
    "facts.shareNone": "Awaiting first points",
    "champions.title": "Past champions",
    "champions.note": "Completed seasons",
    "notice.readOnly":
      "This page is read-only. House points are awarded and amended only from the House System administration console, where every change is recorded against the coordinator who made it.",
    "error.notPublished": "The standings are not published yet. Please check back shortly.",
    "error.unreachable": "Could not reach the scoreboard. Please check your connection and try again.",
    "footer.line": "North Hill Education System · House System",
    "staff.title": "Staff sign in",
    "staff.sub": "Read-only access to the house points record. Points are awarded from the administration console.",
    "staff.email": "School email",
    "staff.emailPlaceholder": "name@northhill.edu",
    "staff.password": "Password",
    "staff.passwordPlaceholder": "Enter your password",
    "staff.showPassword": "Show password",
    "staff.hidePassword": "Hide password",
    "staff.keepSignedIn": "Keep me signed in on this device",
    "staff.signIn": "Sign in",
    "staff.signingIn": "Signing in…",
    "staff.forgot": "Forgot your password?",
    "staff.backToStandings": "Back to standings",
    "staff.needBoth": "Please enter your email and password.",
    "staff.needEmailFirst": "Enter your email address first, then select Forgot your password.",
    "staff.resetSent": "A password reset link has been sent to {email}.",
    "staff.recordTitle": "Points record",
    "staff.recordSub": "Read-only staff view",
    "staff.signedInAs": "Signed in as",
    "staff.signOut": "Sign out",
    "staff.roleStaff": "staff",
    "staff.roleOwner": "system administrator",
    "staff.roleCoordinator": "coordinator",
    "staff.roleNone": "no access",
    "staff.readOnlyBanner":
      "This view cannot change any value. Awarding, adjusting and reversing points is only possible from the House System desktop console.",
    "staff.noAccess":
      "You are signed in, but this account is not on the House System coordinator roster, so the detailed record is not available. The public standings are always open at",
    "staff.noAccessLink": "the standings page",
    "staff.loadFailed": "Could not load the record.",
    "staff.tryAgain": "Please try again.",
    "staff.statTotal": "Total points on record",
    "staff.statTotalHint": "All four houses",
    "staff.statShown": "Entries shown",
    "staff.statShownHint": "Most recent activity",
    "staff.statWeek": "Awarded this week",
    "staff.statWeekHint": "{count} entries in the last 7 days",
    "staff.statLast": "Last change",
    "staff.statLastNone": "No entries yet",
    "staff.statLastHint": "{house} by {actor}",
    "staff.recentActivity": "Recent activity",
    "staff.entriesShown": "{count} most recent entries",
    "staff.entriesShownOne": "{count} most recent entry",
    "staff.colWhen": "When",
    "staff.colHouse": "House",
    "staff.colChange": "Change",
    "staff.colCategory": "Category",
    "staff.colReason": "Reason",
    "staff.colActor": "Recorded by",
    "staff.noEntries": "No points have been recorded yet.",
    "staff.noReason": "No reason given",
    "staff.voided": "voided",
    "notFound.title": "Page not found",
    "notFound.text": "The page you were looking for does not exist on the House System site.",
    "notFound.action": "Go to the standings",
    "points_one": "{count} point",
    "points_other": "{count} points",
    "time.justNow": "just now",
    "error.invalid-email": "That email address is not valid.",
    "error.user-disabled": "This account has been disabled.",
    "error.wrong-password": "Email or password is incorrect.",
    "error.missing-password": "Please enter your password.",
    "error.too-many-requests": "Too many attempts. Please wait a moment and try again.",
    "error.network": "Network error. Check your connection and try again.",
    "error.operation-not-allowed": "Email sign-in is not enabled for this project.",
    "error.generic": "Unable to sign in. Please try again."
  }
};

function readStored() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (DICTIONARIES[stored]) return stored;
  } catch (error) {
    return DEFAULT_LOCALE;
  }
  return DEFAULT_LOCALE;
}

let active = readStored();
const listeners = new Set();

export function currentLocale() {
  return active;
}

export function intlLocale() {
  const match = LOCALES.find((entry) => entry.id === active);
  return match ? match.intl : "es";
}

export function setLocale(next) {
  if (!DICTIONARIES[next] || next === active) return active;
  active = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch (error) {
    void error;
  }
  document.documentElement.lang = next;
  listeners.forEach((fn) => fn(next));
  return active;
}

export function onLocaleChange(handler) {
  listeners.add(handler);
  return () => listeners.delete(handler);
}

export function t(key, params) {
  const dictionary = DICTIONARIES[active] || DICTIONARIES[DEFAULT_LOCALE];
  const template = dictionary[key] ?? DICTIONARIES[DEFAULT_LOCALE][key] ?? DICTIONARIES.en[key] ?? key;
  if (!params) return template;
  return String(template).replace(/\{(\w+)\}/g, (match, name) => {
    return Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match;
  });
}

export function tn(key, count, params) {
  return t(key + (Math.abs(Number(count)) === 1 ? "_one" : "_other"), { count, ...(params || {}) });
}

export function applyStaticText(scope = document) {
  scope.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  scope.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });
  scope.querySelectorAll("[data-i18n-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nLabel));
  });
  scope.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.setAttribute("title", t(node.dataset.i18nTitle));
  });
}

export function buildLanguageSwitch(onChange) {
  const group = document.createElement("div");
  group.className = "lang-switch";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", t("nav.language"));

  LOCALES.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = entry.short;
    button.title = entry.label;
    button.setAttribute("aria-label", entry.label);
    button.setAttribute("aria-pressed", active === entry.id ? "true" : "false");
    button.addEventListener("click", () => {
      setLocale(entry.id);
      [...group.children].forEach((node, index) => {
        node.setAttribute("aria-pressed", LOCALES[index].id === active ? "true" : "false");
      });
      if (typeof onChange === "function") onChange(active);
    });
    group.append(button);
  });

  return group;
}

document.documentElement.lang = active;
