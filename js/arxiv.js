// Recent preprints from arXiv, rendered as compact one-liners.
//
// arXiv publishes each author id as a JSONP file at
// https://arxiv.org/a/<id>.js that calls jsonarXivFeed(feed). We load that
// file directly and render the entries ourselves rather than using arXiv's
// myarticles.js, whose inline-styled markup is hard to restyle.
(function () {
  var AUTHOR_ID = "yu_j_8";
  var MAX_ENTRIES = 3;
  var LIST_URL = "https://arxiv.org/a/" + AUTHOR_ID;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function link(href, text, cls) {
    var a = el("a", cls, text);
    a.href = href;
    return a;
  }

  var loaded = false;

  // Shown when the arXiv script is blocked, fails, or never calls back.
  function showFallback() {
    if (loaded) return;
    var root = document.getElementById("arxivfeed");
    if (!root) return;
    root.innerHTML = "";
    root.appendChild(link(LIST_URL, "See my preprints on arXiv \u2192", "arxiv-more"));
  }

  window.jsonarXivFeed = function (feed) {
    var root = document.getElementById("arxivfeed");
    if (!root || !feed || !feed.entries) return;
    loaded = true;

    var entries = feed.entries.slice(0, MAX_ENTRIES);
    var list = el("ul", "arxiv-list");
    entries.forEach(function (p) {
      var li = el("li", "arxiv-entry");
      li.appendChild(el("span", "arxiv-year", (p.published || "").slice(0, 4)));
      li.appendChild(link(p.id, p.title, "arxiv-title"));
      if (p.formats && p.formats.pdf) {
        li.appendChild(link(p.formats.pdf, "pdf", "arxiv-pdf"));
      }
      list.appendChild(li);
    });

    root.innerHTML = "";
    root.appendChild(list);
    root.appendChild(link(LIST_URL, "All preprints on arXiv →", "arxiv-more"));
  };

  var s = document.createElement("script");
  s.src = LIST_URL + ".js";
  s.async = true;
  s.onerror = showFallback;
  document.head.appendChild(s);
  // Some blockers swallow the request without firing onerror.
  setTimeout(showFallback, 5000);
})();
