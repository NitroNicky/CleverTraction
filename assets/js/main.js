/* Clever Traction — site interactions */
(function () {
  "use strict";

  // Contact form destination. Replace with a form endpoint (e.g. Formspree) to post directly.
  var CONTACT_EMAIL = "hello@clevertraction.com";
  var FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");

  // Year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Header border on scroll
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
  function closeNav() { toggle.setAttribute("aria-expanded", "false"); links.classList.remove("open"); }
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    links.classList.toggle("open", !open);
  });
  links.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });

  // Tier buttons preselect interest in the form
  var interest = document.getElementById("interest");
  document.querySelectorAll("[data-interest]").forEach(function (btn) {
    btn.addEventListener("click", function () { interest.value = btn.getAttribute("data-interest"); });
  });

  // Reveal on scroll
  var revealTargets = document.querySelectorAll(
    ".section-head, .pillar, .contrast, .tier, .addon, .manifesto blockquote, .manifesto-body, .stat, .timeline li, .fit-col, .faq details, .form"
  );
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    revealTargets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 70 + "ms";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  // Count-up numbers
  var counters = document.querySelectorAll("[data-count]");
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduce) { el.textContent = target; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-count"); });
  }

  // Contact form
  var form = document.getElementById("contact-form");
  var status = form.querySelector(".form-status");

  function setStatus(msg, isError) {
    status.textContent = msg;
    status.classList.toggle("error", !!isError);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    form.name.classList.toggle("invalid", !name);
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    form.email.classList.toggle("invalid", !emailOk);
    if (!name || !emailOk) { setStatus("Please add your name and a valid work email.", true); return; }

    var data = {
      name: name,
      email: email,
      company: form.company.value.trim(),
      interest: form.interest.value,
      message: form.message.value.trim()
    };

    if (FORM_ENDPOINT) {
      setStatus("Sending…");
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error("bad status");
        form.reset();
        setStatus("Thanks — we'll be in touch within one business day.");
      }).catch(function () {
        setStatus("Something went wrong. Please email " + CONTACT_EMAIL + " directly.", true);
      });
      return;
    }

    // Fallback: open the visitor's email client with a pre-filled message.
    var subject = "Traction enquiry — " + data.interest + (data.company ? " (" + data.company + ")" : "");
    var body =
      "Name: " + data.name + "\n" +
      "Email: " + data.email + "\n" +
      "Company: " + (data.company || "-") + "\n" +
      "Interested in: " + data.interest + "\n\n" +
      (data.message || "");
    window.location.href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    setStatus("Your email app should open with your message. If it doesn't, write to " + CONTACT_EMAIL + ".");
  });
})();
