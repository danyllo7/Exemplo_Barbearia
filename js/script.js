/* ==========================================================================
   Barbearia Elite — script.js (vanilla JS, sem dependências)
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Header: estado ao rolar ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  document.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Menu mobile ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var mainNav = document.getElementById("mainNav");

  function closeMenu() {
    menuToggle.classList.remove("open");
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  var revealTargets = document.querySelectorAll(".reveal, .line-reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Testemunhos: carrossel ---------- */
  var track = document.getElementById("testiTrack");
  var dotsWrap = document.getElementById("testiDots");
  var prevBtn = document.getElementById("testiPrev");
  var nextBtn = document.getElementById("testiNext");
  var cards = track ? Array.prototype.slice.call(track.children) : [];
  var current = 0;
  var autoTimer = null;

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = "translateX(-" + current * 100 + "%)";
    Array.prototype.slice.call(dotsWrap.children).forEach(function (dot, i) {
      dot.classList.toggle("active", i === current);
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () { goTo(current + 1); }, 6000);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  if (track && cards.length) {
    cards.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.setAttribute("aria-label", "Ver depoimento " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () { goTo(i); startAuto(); });
      dotsWrap.appendChild(dot);
    });

    prevBtn.addEventListener("click", function () { goTo(current - 1); startAuto(); });
    nextBtn.addEventListener("click", function () { goTo(current + 1); startAuto(); });

    var carousel = document.getElementById("testiCarousel");
    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);
    carousel.addEventListener("focusin", stopAuto);
    carousel.addEventListener("focusout", startAuto);

    /* swipe em ecrãs táteis */
    var touchStartX = 0;
    track.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });
    track.addEventListener("touchend", function (e) {
      var diff = e.changedTouches[0].clientX - touchStartX;
      if (diff > 40) goTo(current - 1);
      else if (diff < -40) goTo(current + 1);
      startAuto();
    }, { passive: true });

    goTo(0);
    startAuto();
  }

  /* ---------- Botão voltar ao topo ---------- */
  var backToTop = document.getElementById("backToTop");
  function onScrollBackToTop() {
    backToTop.classList.toggle("visible", window.scrollY > 700);
  }
  document.addEventListener("scroll", onScrollBackToTop, { passive: true });
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  onScrollBackToTop();

  /* ---------- Ano dinâmico no rodapé ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
