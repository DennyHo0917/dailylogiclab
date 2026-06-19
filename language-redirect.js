(function () {
  const CHOICE_KEY = "dll-language-choice";
  const SUPPORTED_LOCALES = new Set(["en", "de", "es", "fr", "ja", "pt-br", "zh-cn"]);
  const LANGUAGE_TO_LOCALE = {
    de: "de",
    es: "es",
    fr: "fr",
    ja: "ja",
    pt: "pt-br",
    "pt-br": "pt-br",
    zh: "zh-cn",
    "zh-cn": "zh-cn",
    "zh-hans": "zh-cn",
    "zh-sg": "zh-cn"
  };
  const DEFAULT_PAGE_KEYS = {
    "/": "",
    "/index.html": "",
    "/about": "about",
    "/about/": "about",
    "/about.html": "about",
    "/contact": "contact",
    "/contact/": "contact",
    "/contact.html": "contact",
    "/privacy-policy": "privacy-policy",
    "/privacy-policy/": "privacy-policy",
    "/privacy-policy.html": "privacy-policy"
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest("a[hreflang]");
    if (!link) return;
    saveChoice(normalizeLocale(link.getAttribute("hreflang")));
  });

  const pageKey = DEFAULT_PAGE_KEYS[location.pathname];
  if (pageKey === undefined || getCurrentLocale() !== "en") return;

  const targetLocale = readChoice() || getBrowserLocale();
  if (targetLocale === "en") return;

  const targetPath = pageKey ? `/${targetLocale}/${pageKey}` : `/${targetLocale}/`;
  if (targetPath !== location.pathname) {
    location.replace(`${targetPath}${location.search}${location.hash}`);
  }

  function getCurrentLocale() {
    const pathLocale = location.pathname.split("/").filter(Boolean)[0];
    return SUPPORTED_LOCALES.has(pathLocale) ? pathLocale : "en";
  }

  function getBrowserLocale() {
    const languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (const language of languages) {
      const locale = normalizeLocale(language);
      if (locale) return locale;
    }
    return "en";
  }

  function normalizeLocale(language) {
    const tag = String(language || "").toLowerCase();
    if (SUPPORTED_LOCALES.has(tag)) return tag;
    if (LANGUAGE_TO_LOCALE[tag]) return LANGUAGE_TO_LOCALE[tag];
    const primary = tag.split("-")[0];
    return LANGUAGE_TO_LOCALE[primary] || (primary === "en" ? "en" : "");
  }

  function readChoice() {
    try {
      return normalizeLocale(localStorage.getItem(CHOICE_KEY));
    } catch (error) {
      return "";
    }
  }

  function saveChoice(locale) {
    if (!locale) return;
    try {
      localStorage.setItem(CHOICE_KEY, locale);
    } catch (error) {
      // Ignore private-mode storage failures.
    }
  }
})();
