/**
 * Outbound link clicks — custom Vercel Analytics events (Pro+ for event UI).
 * Pageviews are handled by /_vercel/insights/script.js on Vercel deployments.
 */
(function () {
  var host = window.location.hostname;

  function isOutbound(href) {
    try {
      var u = new URL(href, window.location.href);
      return (
        u.protocol === "http:" ||
        (u.protocol === "https:" && u.hostname && u.hostname !== host)
      );
    } catch {
      return false;
    }
  }

  document.addEventListener(
    "click",
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a || !isOutbound(a.getAttribute("href") || a.href)) return;
      if (typeof window.va !== "function") return;
      window.va("event", {
        name: "Outbound Link",
        data: {
          url: a.href,
          text: (a.textContent || "").trim().slice(0, 80),
          page: window.location.pathname,
        },
      });
    },
    true
  );
})();
