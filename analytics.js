(function initAnalytics(root) {
  "use strict";

  if (root.DailyLogicAnalytics) return;
  const enabled = ["dailylogiclab.com", "www.dailylogiclab.com"].includes(root.location.hostname);
  const language = document.documentElement.lang.toLowerCase() || "en";
  root.DailyLogicAnalytics = Object.freeze({ enabled, language });

  if (!enabled) {
    // Preview pages never load Google's tag or queue production events.
    // Preserve callbacks so unavailable analytics cannot hold up Checkout.
    root.gtag = function disabledAnalytics(command, name, params) {
      if (command === "get" && typeof arguments[3] === "function") arguments[3](undefined);
      if (command === "event" && typeof params?.event_callback === "function") params.event_callback();
    };
    return;
  }

  root.dataLayer = root.dataLayer || [];
  root.gtag = function gtag() { root.dataLayer.push(arguments); };
  root.gtag("js", new Date());
  root.gtag("config", "G-6NY29HPM34");
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-6NY29HPM34";
  document.head.appendChild(script);
})(window);
