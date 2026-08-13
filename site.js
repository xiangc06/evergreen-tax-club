/* ============================================================
   Evergreen Tax Club — shared behaviour
   Linked from every page. Plain JS, no dependencies.
   ============================================================ */

/* ---- Reveal on scroll --------------------------------------
   Elements marked [data-reveal] rise and fade as they enter the
   viewport. Groups marked [data-reveal-group] do the same, their
   children arriving one after another.

   The hidden starting state lives behind the .anim class, added
   here rather than in the HTML. If this script never runs, or the
   visitor has asked for reduced motion, nothing is hidden and the
   page renders complete — which also keeps the content visible to
   crawlers.
   ---------------------------------------------------------- */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('anim');

  var solo = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('[data-reveal-group]'));
  var targets = solo.slice();

  groups.forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      // 55ms apart, capped so a long ledger never crawls.
      child.style.transitionDelay = Math.min(i * 55, 440) + 'ms';
      targets.push(child);
    });
  });

  targets.forEach(function (el) { el.classList.add('reveal'); });

  var revealed = 0;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealed++;
      io.unobserve(entry.target);   // reveal once; never re-hide
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  targets.forEach(function (el) { io.observe(el); });

  // Backstop. Hidden content that never reveals is far worse than
  // content that simply appears, so if nothing at all has been
  // revealed shortly after load — meaning the observer is not
  // working in this browser — drop the effect and show everything.
  setTimeout(function () {
    if (revealed > 0) return;
    io.disconnect();
    targets.forEach(function (el) {
      el.style.transitionDelay = '0ms';
      el.classList.add('is-in');
    });
  }, 1600);
})();

/* ---- Mobile navigation ------------------------------------
   Present on every page. (The previous site had this on the
   homepage only, which left About and Contact with no nav
   at all on a phone.)
   ---------------------------------------------------------- */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Close' : 'Menu';
  });

  // Close the menu when a link is chosen.
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    }
  });
})();

/* ---- Language band ----------------------------------------
   Cycles "free tax help" through the languages the club serves.
   Pauses on hover/focus and does nothing at all when the visitor
   has asked for reduced motion — the first entry stays put.
   ---------------------------------------------------------- */
(function () {
  var stage = document.querySelector('[data-lang-stage]');
  if (!stage) return;

  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-lang-chip]'));
  var phrases;

  try {
    phrases = JSON.parse(stage.getAttribute('data-lang-stage'));
  } catch (err) {
    return;
  }
  if (!phrases || !phrases.length) return;

  var word = stage.querySelector('.lang-word');
  var tongue = stage.querySelector('.tongue');
  var text = stage.querySelector('.lang-text');
  if (!word || !tongue || !text) return;

  var i = 0;
  var timer = null;

  function paint(index) {
    var item = phrases[index];
    tongue.textContent = item.language;
    text.textContent = item.phrase;
    if (item.lang) text.setAttribute('lang', item.lang);

    word.classList.remove('lang-fade');
    void word.offsetWidth; // restart the animation
    word.classList.add('lang-fade');

    chips.forEach(function (chip, n) {
      chip.classList.toggle('is-on', n === index);
    });
  }

  function advance() {
    i = (i + 1) % phrases.length;
    paint(i);
  }

  paint(0);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;

  // Slow enough to read and not flicker. With only two languages
  // this alternates rather than cycles, so it needs more room than
  // a longer list would.
  function start() {
    if (!timer) timer = setInterval(advance, 3800);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }

  start();

  var band = stage.closest('.langs') || stage;
  band.addEventListener('mouseenter', stop);
  band.addEventListener('mouseleave', start);
  band.addEventListener('focusin', stop);
  band.addEventListener('focusout', start);

  // Stop cycling while the tab is in the background.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });

  // Let a visitor jump straight to a language.
  chips.forEach(function (chip, n) {
    chip.addEventListener('click', function () {
      i = n;
      paint(i);
    });
  });
})();

/* ---- Contact form ------------------------------------------
   There is no server behind this site, so the form composes a
   pre-filled email rather than posting anywhere. The previous
   version discarded whatever the visitor typed; this carries it
   into the message body.

   To accept messages without the visitor's email client, replace
   this with a hosted form service (Formspree, Netlify Forms) and
   point the <form action> at it.
   ---------------------------------------------------------- */
(function () {
  var form = document.querySelector('[data-mailto-form]');
  if (!form) return;

  var to = form.getAttribute('data-mailto-form');
  var status = form.querySelector('[data-form-status]');
  var topicField = form.elements.topic;
  var topicFromUrl = new URLSearchParams(window.location.search).get('topic');

  if (topicField && topicFromUrl) {
    Array.prototype.some.call(topicField.options, function (option) {
      if (option.value !== topicFromUrl) return false;
      topicField.value = topicFromUrl;
      return true;
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) status.textContent = 'Complete the required fields before continuing.';
      return;
    }

    var name = (form.elements.name.value || '').trim();
    var email = (form.elements.email.value || '').trim();
    var topic = (form.elements.topic.value || '').trim();
    var language = (form.elements.language.value || '').trim();
    var message = (form.elements.message.value || '').trim();

    // Catch common nine-digit identifiers before they enter an email draft.
    // This is a warning, not a guarantee; the form never accepts attachments.
    if (/\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/.test(message)) {
      if (status) status.textContent = 'Remove any Social Security or tax identification number before continuing.';
      form.elements.message.focus();
      return;
    }

    var subject = topic ? topic + ' — ' + (name || 'Website enquiry') : 'Website enquiry';

    var body =
      'Name: ' + (name || '(not given)') + '\n' +
      'Email: ' + (email || '(not given)') + '\n' +
      'Topic: ' + (topic || '(not given)') + '\n\n' +
      'Preferred language: ' + (language || '(not given)') + '\n\n' +
      message;

    if (status) {
      status.textContent = 'Opening your email app with this message ready to send.';
    }

    window.location.href =
      'mailto:' + to +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });
})();
