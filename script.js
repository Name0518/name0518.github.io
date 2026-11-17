(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ *
   * Translations (bilingual dictionary)
   * ------------------------------------------------------------------ */
  var I18N = {
    en: {
      nav_code: "Code",
      nav_photography: "Photography",
      nav_models: "3D Models",
      nav_languages: "Languages",
      menu_open: "Open menu",
      lang_switch: "中文",
      lang_switch_aria: "Switch to Chinese",
      bubble1_intro: "Hello, my name is...",
      bubble2_intro: "I am a...",
      role_dev: "Software Developer",
      role_photo: "Photographer",
      role_3d: "3D Modeller",
      role_lang: "Language Learner",
      tagline: "Always believe that something wonderful is about to happen",
      code_title: "Personal Projects",
      code_desc:
        "A collection of everything worth mentioning from high school to now — not much to look at, just honest, no-frills work.",
      code_tech: "Tech Stack",
      p_commute_t: "Commute App",
      p_commute_d: "Making Commutes Easier",
      p_vn_t: "Visual Novel",
      p_vn_d: "Fully customizable game engine for your visual novels",
      p_ai_t: "AI Agent",
      p_ai_d: "ReAct agent with RAG, LangGraph and DeepSeek",
      p_clear_t: "ClearPath",
      p_clear_d: "Accessible Toronto trip planner for wheelchair users",
      photo_title: "Photography",
      photo_desc:
        "A plain little hobby — no budget for a new camera, no scenery for inspiration. It's all technique, composition, and my love and curiosity for this land.",
      photo_devices: "Gear I Use",
      contact_title: "Interested? Reach out:",
      footer: "© 2026 Koumatsu-Sensei. All rights reserved."
    },
    zh: {
      nav_code: "代码",
      nav_photography: "摄影",
      nav_models: "3D 模型",
      nav_languages: "语言",
      menu_open: "打开菜单",
      lang_switch: "English",
      lang_switch_aria: "切换到英文",
      bubble1_intro: "你好，我叫……",
      bubble2_intro: "我是……",
      role_dev: "软件开发者",
      role_photo: "摄影师",
      role_3d: "3D 建模师",
      role_lang: "语言学习者",
      tagline: "永远相信，美好的事情即将发生",
      code_title: "个人项目简介",
      code_desc: "其中包含了高中至今值得一提的所有项目，观赏性不大，主打一个朴实无华。",
      code_tech: "常用技术",
      p_commute_t: "通勤应用",
      p_commute_d: "让通勤更轻松",
      p_vn_t: "视觉小说",
      p_vn_d: "可完全自定义的视觉小说游戏引擎",
      p_ai_t: "AI 智能体",
      p_ai_d: "基于 RAG、LangGraph 与 DeepSeek 的 ReAct 智能体",
      p_clear_t: "ClearPath",
      p_clear_d: "面向轮椅使用者的多伦多无障碍出行规划",
      photo_title: "摄影合集",
      photo_desc: "平平无奇的爱好，没钱买新机，没风景找灵感，全是技巧，构图，以及我对这片土地的爱与探索欲。",
      photo_devices: "常用设备",
      contact_title: "有兴趣可以联系：",
      footer: "© 2026 Koumatsu-Sensei. 保留所有权利。"
    }
  };

  /* ------------------------------------------------------------------ *
   * Language switching
   * ------------------------------------------------------------------ */
  var STORAGE_KEY = "koumatsu-lang";

  function detectLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "zh" || saved === "en") return saved;
    } catch (e) {
      /* ignore */
    }
    var nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    return nav.indexOf("zh") === 0 ? "zh" : "en";
  }

  function applyLang(lang) {
    var dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (dict[key] != null) el.setAttribute("aria-label", dict[key]);
    });
  }

  function initI18n() {
    var lang = detectLang();
    applyLang(lang);

    var toggle = document.querySelector("[data-lang-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var cur = (document.documentElement.lang || "en").toLowerCase();
        var next = cur.indexOf("zh") === 0 ? "en" : "zh";
        applyLang(next);
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {
          /* ignore */
        }
      });
    }
  }

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
        el.style.setProperty("--d", i * 120 + "ms");
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

  initI18n();
  initNav();
  initReveal();
  initParallax();
  initBackground();
})();
