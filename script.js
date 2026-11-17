(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ *
   * Mobile navigation
   * ------------------------------------------------------------------ */
  function initNav() {
    var header = document.querySelector(".header");
    var toggle = document.querySelector(".nav-toggle");
    if (!header || !toggle) return;

    function close() {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    header.querySelectorAll(".navbar a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ------------------------------------------------------------------ *
   * Scroll reveal (fade + translate, staggered within each grid)
   * ------------------------------------------------------------------ */
  function initReveal() {
    var els = document.querySelectorAll(".reveal, .reveal-left");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("show"); });
      return;
    }

    document.querySelectorAll(".project_grid").forEach(function (grid) {
      grid.querySelectorAll(".reveal, .reveal-left").forEach(function (el, i) {
        el.style.setProperty("--d", i * 90 + "ms");
      });
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * Parallax on the landing bubbles (desktop, fine pointer, lerped)
   * ------------------------------------------------------------------ */
  function initParallax() {
    var main = document.querySelector(".mainLanding");
    var front = document.querySelector(".bubble1");
    var back = document.querySelector(".bubble2");
    var canParallax =
      !reducedMotion &&
      window.matchMedia("(min-width: 768px) and (hover: hover)").matches;

    if (!canParallax || !main || !front || !back) return;

    var mx = 0, my = 0, cx = 0, cy = 0, raf = null;
    var lerp = function (a, b, t) { return a + (b - a) * t; };

    function tick() {
      cx = lerp(cx, mx, 0.08);
      cy = lerp(cy, my, 0.08);
      front.style.transform = "translate3d(" + (-cx).toFixed(2) + "px," + (-cy).toFixed(2) + "px,0)";
      back.style.transform = "translate3d(" + cx.toFixed(2) + "px," + cy.toFixed(2) + "px,0)";
      raf = requestAnimationFrame(tick);
    }

    main.addEventListener("mousemove", function (e) {
      var r = main.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 44;
      my = ((e.clientY - r.top) / r.height - 0.5) * 44;
    });
    main.addEventListener("mouseleave", function () {
      mx = 0;
      my = 0;
    });

    raf = requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------ *
   * Cross-fade the page background according to the active section
   * ------------------------------------------------------------------ */
  function initBackground() {
    var layers = Array.prototype.slice.call(document.querySelectorAll(".bg__layer"));
    if (layers.length < 2) return;

    var zones = [
      { id: "main", bg: "images/main.jpg" },
      { id: "code", bg: "images/programmador.jpg" },
      { id: "photography", bg: "images/droneBackground.jpg" },
      { id: "contact", bg: "images/sponsorbanner.png" }
    ]
      .map(function (z) {
        return { bg: z.bg, el: document.getElementById(z.id) };
      })
      .filter(function (z) { return z.el; });

    var active = 0;
    var current = zones.length ? zones[0].bg : "";

    function setBg(url) {
      if (!url || url === current) return;
      current = url;
      var next = layers[active ^ 1];
      next.style.backgroundImage = "url('" + url + "')";
      layers[active].classList.remove("is-active");
      next.classList.add("is-active");
      active ^= 1;
    }

    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY + window.innerHeight * 0.4;
      var target = zones[0];
      for (var i = 0; i < zones.length; i++) {
        var top = zones[i].el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) target = zones[i];
      }
      setBg(target.bg);
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  initNav();
  initReveal();
  initParallax();
  initBackground();
})();
