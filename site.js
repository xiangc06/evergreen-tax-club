/* ============================================================
   Evergreen Tax Club — shared behaviour
   Linked from every page. Plain JS, no dependencies.
   ============================================================ */

/* ---- Reveal on scroll --------------------------------------
   Key headings, copy blocks, images, and elements marked
   [data-reveal] rise and fade as they enter the viewport. Groups
   marked [data-reveal-group] arrive one after another.

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
  var automatic = Array.prototype.slice.call(document.querySelectorAll(
    '.hero-grid > div:first-child > *, .section-head > *, .prose > *, .cta-inner > *, .split > .ph-img'
  )).filter(function (el) {
    // A parent group already controls its children; avoid animating
    // the same element twice or giving nested content long delays.
    return !el.closest('[data-reveal-group]');
  });
  var targets = solo.concat(automatic);

  groups.forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      // 70ms apart, capped so a long ledger never crawls.
      child.style.transitionDelay = Math.min(i * 70, 420) + 'ms';
      targets.push(child);
    });
  });

  // The same node can be selected by more than one useful rule.
  targets = targets.filter(function (el, index, all) {
    return all.indexOf(el) === index;
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
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

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

/* ---- Page language ----------------------------------------
   The language chips switch the complete homepage between
   English and Chinese. The choice is saved for the next visit.
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
  var englishTitle = document.title;
  var chinese = {
    'Home':'首页','Services':'服务','How it works':'服务流程','About':'关于我们','Contact':'联系我们','Launch OpenTax demo':'启动 OpenTax 演示','Get help':'获取帮助',
    'Tax filing and financial training · Bellevue, Washington':'报税服务与财务培训 · 华盛顿州贝尔维尤',
    'English · 中文':'英文 · 中文','Evergreen Financial Training':'Evergreen 财务培训',
    'Tax help that speaks':'懂你语言的报税服务','your language.':'。',
    'Work with experienced CPAs and Enrolled Agents for tax filing, return reviews, planning, IRS correspondence, and practical financial education—with free help available for qualifying families.':'由经验丰富的注册会计师和注册税务师提供报税、税表复核、税务规划、IRS 信函协助和实用财务教育；符合条件的家庭可获得免费帮助。',
    'Get tax help':'获取报税帮助','Explore services':'查看服务','Your privacy comes first.':'我们重视您的隐私。',
    'Do not send Social Security numbers or tax documents through the public contact form.':'请勿通过公开联系表发送社会安全号码或税务文件。',
    'Primary service':'主要服务','Tax filing and review':'报税与税表复核','Professionals':'专业人员','CPAs and Enrolled Agents':'注册会计师与注册税务师',
    'Languages':'服务语言','English and Chinese':'英文与中文','Service area':'服务地区','Bellevue, Washington':'华盛顿州贝尔维尤','Established':'成立年份',
    'Start with what you need':'从您的需求开始','Choose the right path':'选择适合您的服务',
    'File my taxes':'我要报税','Ask about preparation and free filing assistance for qualifying families.':'咨询报税服务；符合条件的家庭可申请免费报税帮助。','Request help →':'申请帮助 →',
    'Review a past return':'复核往年税表','Have a credentialed professional look for missed items or unresolved problems.':'由持证专业人员检查遗漏项目或尚未解决的问题。','Request a review →':'申请复核 →',
    'Resolve a tax issue':'解决税务问题','Get guidance with planning, compliance questions, IRS notices, or an audit.':'获取税务规划、合规问题、IRS 通知或审计方面的指导。','Describe the issue →':'说明问题 →',
    'Training or membership':'培训或会员','Ask about practical education or joining the professional community.':'咨询实用财务教育或加入专业社群。','Start a conversation →':'开始咨询 →',
    'Multilingual tax assistance':'多语言报税协助',
    'Tax filing should not depend on how comfortably you read English. Assistance is available in English and Chinese, with continuity from the first conversation through review.':'报税不应受英文阅读能力限制。我们提供中英文协助，从首次沟通到最终复核都有专业人员持续跟进。',
    'Prefer another language? Ask us. We will tell you clearly whether a qualified professional is available.':'需要其他语言？请联系我们，我们会明确告知是否有合格的专业人员可以协助。',
    'Professional help for the moments that matter':'在关键时刻提供专业帮助',
    'Start with a short, non-sensitive inquiry. We confirm eligibility, cost, timing, and the secure next step before requesting documents.':'请先提交简短且不含敏感信息的咨询。索取文件前，我们会确认资格、费用、时间安排及安全的下一步流程。',
    'Tax return preparation':'税表准备与申报','Organized support for filing an accurate return, with free assistance available for qualifying low-income families.':'协助准确整理和申报税表；符合条件的低收入家庭可获得免费服务。',
    'Prior-return review':'往年税表复核','A credentialed second look at a previously filed return for omissions, compliance concerns, and possible corrections.':'由持证专业人员复核已申报税表，检查遗漏、合规风险和可能需要更正的项目。',
    'Planning and compliance':'税务规划与合规','Practical guidance before filing season and support when a tax question becomes more complicated.':'在报税季前提供实用规划，并在税务问题复杂时提供支持。',
    'IRS notices and audits':'IRS 通知与审计','Help understanding correspondence, organizing a response, and identifying the appropriate next action.':'协助理解信函内容、整理回复材料并确定合适的下一步行动。',
    'Financial and tax education':'财务与税务教育','Plain-language training that helps families and professionals understand documents, deadlines, and filing decisions.':'以清晰易懂的方式帮助家庭和专业人士理解文件、截止日期和申报决定。',
    'A careful path from first question to finished return':'从首次咨询到完成申报的严谨流程',
    'Tell us what you need':'告诉我们您的需求','Send a basic inquiry without sensitive tax information.':'提交不含敏感税务信息的基本咨询。',
    'Confirm fit and eligibility':'确认服务与资格','We clarify the service, language, timing, cost, and who will help.':'我们会确认服务内容、语言、时间、费用及负责人员。',
    'Share documents securely':'安全提交文件','If we proceed, you receive instructions for the approved secure exchange method.':'确认继续后，您会收到经批准的安全文件传输说明。',
    'Prepare and review':'准备并复核','A tax professional prepares or reviews the work and explains anything needing attention.':'税务专业人员准备或复核材料，并说明需要关注的问题。',
    'Approve the next step':'确认下一步','You review the result before filing, amendment, or any response is completed.':'在申报、更正或提交回复前，您会先审阅并确认结果。',
    'Not sure your last return was right?':'不确定上一份税表是否正确？','A rushed or self-prepared return can contain missed items or unresolved questions. A second review can give you clarity before a small problem grows.':'匆忙准备或自行申报的税表可能存在遗漏或未解决的问题。再次复核可以在小问题扩大前帮助您确认情况。',
    'Tell us which tax year concerns you. We will explain whether a review is appropriate and what happens next.':'请告诉我们您担心的报税年度。我们会说明是否适合复核以及接下来的流程。','Request a review':'申请复核',
    'About Evergreen':'关于 Evergreen','Tax professionals who teach as well as prepare':'不仅代办，也帮助您理解税务',
    'Evergreen Financial Training brings CPAs and Enrolled Agents together around practical tax help and financial education.':'Evergreen 财务培训汇集注册会计师和注册税务师，提供实用税务协助和财务教育。',
    'The goal is not only to complete paperwork, but to help people understand what is being filed and why.':'我们的目标不仅是完成表格，更要帮助每个人理解申报了什么以及为什么这样申报。',
    'Ready to begin?':'准备开始了吗？','Start with a safe, simple inquiry.':'从安全、简单的咨询开始。','Do not include Social Security numbers or attach tax documents.':'请勿填写社会安全号码或附加税务文件。','Contact Evergreen':'联系 Evergreen'
  };

  function translatePage(lang) {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      var trimmed = node.nodeValue.trim();
      if (!trimmed) continue;
      if (node._eftEnglish === undefined) node._eftEnglish = node.nodeValue;
      if (lang === 'zh' && chinese[trimmed]) {
        var lead = node.nodeValue.match(/^\s*/)[0];
        var tail = node.nodeValue.match(/\s*$/)[0];
        node.nodeValue = lead + chinese[trimmed] + tail;
      } else if (lang === 'en') {
        node.nodeValue = node._eftEnglish;
      }
    }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = lang === 'zh' ? 'Evergreen 财务培训 — 懂你语言的报税服务' : englishTitle;
    try { localStorage.setItem('eft-language', lang); } catch (err) {}
  }

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
      chip.setAttribute('aria-pressed', n === index ? 'true' : 'false');
    });
  }

  chips.forEach(function (chip, n) {
    chip.addEventListener('click', function () {
      i = n;
      translatePage(n === 1 ? 'zh' : 'en');
      paint(i);
    });
  });

  var saved = 'en';
  try { saved = localStorage.getItem('eft-language') || 'en'; } catch (err) {}
  i = saved === 'zh' ? 1 : 0;
  translatePage(saved === 'zh' ? 'zh' : 'en');
  paint(i);
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
