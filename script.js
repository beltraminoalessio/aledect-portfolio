document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const navBrandSubEl = document.getElementById('nav-brand-sub');
  const searchInput = document.getElementById('site-search');
  const projectCards = document.querySelectorAll('.project-card');

  const langContainer = document.getElementById('lang-container');
  const langBtn = document.getElementById('lang-btn');
  const langItems = document.querySelectorAll('.dropdown-item');
  const currentLangText = document.getElementById('current-lang-text');

    const path = window.location.pathname.toLowerCase();
  let currentSection = 'about';

  if (path.includes('skills.html')) {
    currentSection = 'skills';
  } else if (path.includes('projects.html')) {
    currentSection = 'projects';
  } else if (path.includes('commits.html')) {
    currentSection = 'commits';
  } else if (path.includes('terminal.html')) {
    currentSection = 'terminal';
  } else if (path.includes('about.html')) {
    currentSection = 'about';
  }

  navLinks.forEach(link => {
    const section = link.getAttribute('data-section');
    if (section === currentSection) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  if (navBrandSubEl) {
    navBrandSubEl.textContent = currentSection;
  }

    const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (window.location.hash === '#main-content') {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

    const siteDictionaries = {
    en: {
      aboutRole: "IT Enthusiast · Hardware & Code",
      aboutBio: [
        "Hi, I'm Alessio, a 16-year-old from Italy.",
        "I really like computer science, and ever since I was little, I've always been curious about computers, how they were built, and how they worked on both the hardware and software sides.",
        "One of the things I like to do most is building PCs—choosing components, checking compatibility, and handling the assembly myself.",
        "Every now and then, I create small projects using HTML, CSS, and JavaScript, or build programs in Rust. Just things I enjoy completing."
      ],
      skillsSubtitle: "Technical skills & tools I tinker with.",

      project1Summary: "Platinum+ Optimizer is an advanced application designed to optimize Windows at a deep level by applying carefully selected low-level and high-level system configurations, including optimizations affecting the Windows kernel, operating system behavior, and core system architecture.",
      project1Visit: "Visit Now ↗",
      project1Source: "Source Code",
      comingSoon: "Coming Soon...",
      commitsThRepo: "REPOSITORY & HASH",
      commitsThMsg: "COMMIT MESSAGE",
      commitsThDate: "DATE",
      commitsLoading: "Loading commits from GitHub...",
      commitsEmpty: "No recent public commits found on GitHub.",
      footerVersion: "v1.0 · Updated 21 Oct 2026"
    },
    it: {
      aboutRole: "Appassionato di Informatica · Hardware & Code",
      aboutBio: [
        "Ciao, sono Alessio, un ragazzo di 16 anni italiano.",
        "Mi piace molto l'informatica e, fin da piccolo, sono sempre stato curioso riguardo ai computer, come fossero costruiti e come funzionassero sia dal punto di vista hardware che software.",
        "Una delle cose che preferisco fare è assemblare PC: scegliere i componenti, verificare la compatibilità e occuparmi personalmente del montaggio.",
        "Ogni tanto creo piccoli progetti usando HTML, CSS e JavaScript, oppure realizzo programmi in Rust. Semplicemente cose che mi diverto a portare a termine."
      ],
      skillsSubtitle: "Competenze tecniche e strumenti con cui smanetto.",

      project1Summary: "Platinum+ Optimizer è un'applicazione avanzata progettata per ottimizzare Windows a livello profondo, applicando configurazioni di sistema di basso e alto livello attentamente selezionate, incluse ottimizzazioni che intervengono sul kernel di Windows, sul comportamento del sistema operativo e sull'architettura di sistema principale.",
      project1Visit: "Visita Ora ↗",
      project1Source: "Codice Sorgente",
      comingSoon: "In arrivo...",
      commitsThRepo: "REPOSITORY & HASH",
      commitsThMsg: "MESSAGGIO DI COMMIT",
      commitsThDate: "DATA",
      commitsLoading: "Caricamento commit da GitHub...",
      commitsEmpty: "Nessun commit pubblico recente trovato su GitHub.",
      footerVersion: "v1.0 · Aggiornato 21 Ottobre 2026"
    }
  };

  function updatePageDictionaryContent(langCode) {
    const dict = langCode === 'it' ? siteDictionaries.it : siteDictionaries.en;

        const roleEl = document.getElementById('about-role-text');
    if (roleEl) roleEl.textContent = dict.aboutRole;

    const bioBoxEl = document.getElementById('about-bio-box');
    if (bioBoxEl) {
      bioBoxEl.innerHTML = dict.aboutBio.map(p => `<p>${p}</p>`).join('');
    }

        const skillsSubEl = document.getElementById('skills-subtitle');
    if (skillsSubEl) skillsSubEl.textContent = dict.skillsSubtitle;


        const summaryEl = document.getElementById('project-1-summary');
    if (summaryEl) summaryEl.textContent = dict.project1Summary;

    const btnVisitEl = document.getElementById('project-1-btn-live');
    if (btnVisitEl) btnVisitEl.textContent = dict.project1Visit;

    const btnSourceEl = document.getElementById('project-1-btn-source');
    if (btnSourceEl) btnSourceEl.textContent = dict.project1Source;

    document.querySelectorAll('.project-coming-title').forEach(el => { el.textContent = dict.comingSoon; });
    document.querySelectorAll('.project-coming-btn').forEach(el => { el.textContent = dict.comingSoon; });

        const thRepo = document.getElementById('commits-th-repo');
    if (thRepo) thRepo.textContent = dict.commitsThRepo;

    const thMsg = document.getElementById('commits-th-msg');
    if (thMsg) thMsg.textContent = dict.commitsThMsg;

    const thDate = document.getElementById('commits-th-date');
    if (thDate) thDate.textContent = dict.commitsThDate;

    if (liveCommitsData && liveCommitsData.length > 0) {
      renderCommitsTable(liveCommitsData);
    } else {
      const statusMsg = document.getElementById('commits-status-msg');
      if (statusMsg) {
        statusMsg.textContent = dict.commitsLoading;
      }
    }

        const footerVer = document.querySelector('.footer-version');
    if (footerVer) footerVer.textContent = dict.footerVersion;
  }

    const GITHUB_USERNAME = 'beltraminoalessio';
  let liveCommitsData = null;

  function formatTimeAgo(isoStr, lang) {
    try {
      const now = Date.now();
      const diffMs = now - new Date(isoStr).getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (lang === 'it') {
        if (diffMin < 1) return 'adesso';
        if (diffMin < 60) return `${diffMin}m fa`;
        if (diffHours < 24) return `${diffHours}h fa`;
        if (diffDays === 1) return 'ieri';
        if (diffDays < 30) return `${diffDays}gg fa`;
        return '';
      } else {
        if (diffMin < 1) return 'just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'yesterday';
        if (diffDays < 30) return `${diffDays}d ago`;
        return '';
      }
    } catch (e) {
      return '';
    }
  }

  function formatCommitDate(isoStr, lang) {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      const monthsEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthsIT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
      const day = String(d.getDate()).padStart(2, '0');
      const year = d.getFullYear();
      const mIdx = d.getMonth();

      if (lang === 'it') {
        return `${day} ${monthsIT[mIdx]} ${year}`;
      } else {
        return `${monthsEN[mIdx]} ${day}, ${year}`;
      }
    } catch (e) {
      return isoStr;
    }
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderCommitsTable(commits) {
    const tbody = document.getElementById('commits-tbody');
    if (!tbody || !commits || commits.length === 0) return;

    tbody.innerHTML = commits.map(c => `
      <tr class="commit-row" tabindex="0" role="link" data-url="${escapeHtml(c.commitUrl)}" aria-label="Commit ${escapeHtml(c.hash)} in ${escapeHtml(c.repo)}: ${escapeHtml(c.message)}">
        <td class="commit-repo">
          <span class="repo-str">${escapeHtml(c.repo)}</span>
          <span class="hash-str">${escapeHtml(c.hash)}</span>
        </td>
        <td class="commit-msg">${escapeHtml(c.message)}</td>
        <td class="commit-date">${formatCommitDate(c.date, activeLanguage)}</td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.commit-row').forEach(row => {
      const url = row.getAttribute('data-url');
      if (!url) return;
      row.addEventListener('click', () => {
        window.open(url, '_blank', 'noopener,noreferrer');
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      });
    });
  }


  async function loadGitHubCommits() {
    const tbody = document.getElementById('commits-tbody');
    if (!tbody) return;

    // 3-minute session cache TTL
    try {
      const cached = sessionStorage.getItem('gh_commits_cache');
      const cacheTime = sessionStorage.getItem('gh_commits_time');
      if (cached && cacheTime && (Date.now() - parseInt(cacheTime, 10) < 3 * 60 * 1000)) {
        liveCommitsData = JSON.parse(cached);
        renderCommitsTable(liveCommitsData);
        return;
      }
    } catch (e) {}

    // Primary: user public events
    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
      if (res.ok) {
        const events = await res.json();
        const commits = [];

        if (Array.isArray(events)) {
          for (const event of events) {
            if (event.type === 'PushEvent' && event.payload && Array.isArray(event.payload.commits)) {
              const repoFullName = event.repo ? event.repo.name : '';
              const repoName = repoFullName.replace(`${GITHUB_USERNAME}/`, '');
              for (const c of event.payload.commits) {
                commits.push({
                  repo: repoName || 'repository',
                  repoUrl: `https://github.com/${repoFullName}`,
                  hash: c.sha ? c.sha.substring(0, 7) : 'commit',
                  commitUrl: `https://github.com/${repoFullName}/commit/${c.sha}`,
                  message: (c.message || 'update').split('\n')[0],
                  date: event.created_at
                });
                if (commits.length >= 8) break;
              }
            }
            if (commits.length >= 8) break;
          }
        }

        if (commits.length > 0) {
          liveCommitsData = commits;
          try {
            sessionStorage.setItem('gh_commits_cache', JSON.stringify(commits));
            sessionStorage.setItem('gh_commits_time', String(Date.now()));
          } catch (e) {}
          renderCommitsTable(liveCommitsData);
          return;
        }
      }
    } catch (err) {
      console.info('Events API note:', err.message);
    }

    // Fallback: per-repository commit history
    try {
      const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=4`);
      if (reposRes.ok) {
        const repos = await reposRes.json();
        if (Array.isArray(repos) && repos.length > 0) {
          const allCommits = [];
          for (const repo of repos.slice(0, 3)) {
            try {
              const cRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=3`);
              if (cRes.ok) {
                const cData = await cRes.json();
                if (Array.isArray(cData)) {
                  for (const item of cData) {
                    allCommits.push({
                      repo: repo.name,
                      repoUrl: repo.html_url,
                      hash: item.sha ? item.sha.substring(0, 7) : 'commit',
                      commitUrl: item.html_url,
                      message: item.commit ? item.commit.message.split('\n')[0] : 'update',
                      date: item.commit && item.commit.author ? item.commit.author.date : (item.commit && item.commit.committer ? item.commit.committer.date : repo.pushed_at)
                    });
                  }
                }
              }
            } catch (err) {}
          }

          if (allCommits.length > 0) {
            allCommits.sort((a, b) => new Date(b.date) - new Date(a.date));
            liveCommitsData = allCommits.slice(0, 8);
            try {
              sessionStorage.setItem('gh_commits_cache', JSON.stringify(liveCommitsData));
              sessionStorage.setItem('gh_commits_time', String(Date.now()));
            } catch (e) {}
            renderCommitsTable(liveCommitsData);
            return;
          }
        }
      }
    } catch (err) {
      console.info('Repos API note:', err.message);
    }

        const dict = activeLanguage === 'it' ? siteDictionaries.it : siteDictionaries.en;
    const statusMsg = document.getElementById('commits-status-msg');
    if (statusMsg) {
      statusMsg.textContent = dict.commitsEmpty;
    }
  }

    loadGitHubCommits();

    let isTranslateEngineLoaded = false;
  let activeLanguage = 'en';
  let isInternalAction = false;
  let isProgrammaticChange = false;

  const langDisplayMap = {
    'en': 'English',
    'it': 'Italiano',
    'es': 'Español',
    'de': 'Deutsch',
    'fr': 'Français',
    'pt': 'Português',
    'ru': 'Русский',
    'ja': '日本語',
    'zh-CN': '中文 (简体)',
    'ko': '한국어',
    'ar': 'العربية',
    'tr': 'Türkçe',
    'nl': 'Nederlands',
    'pl': 'Polski',
    'sv': 'Svenska'
  };

  function normalizeLangCode(lang) {
    if (!lang) return 'en';
    const l = lang.toLowerCase().trim();
    if (l.startsWith('it')) return 'it';
    if (l.startsWith('en')) return 'en';
    if (l.startsWith('es')) return 'es';
    if (l.startsWith('de')) return 'de';
    if (l.startsWith('fr')) return 'fr';
    if (l.startsWith('pt')) return 'pt';
    if (l.startsWith('ru')) return 'ru';
    if (l.startsWith('ja')) return 'ja';
    if (l.startsWith('zh')) return 'zh-CN';
    if (l.startsWith('ko')) return 'ko';
    if (l.startsWith('ar')) return 'ar';
    if (l.startsWith('tr')) return 'tr';
    if (l.startsWith('nl')) return 'nl';
    if (l.startsWith('pl')) return 'pl';
    if (l.startsWith('sv')) return 'sv';
    return 'en';
  }

  function updateSelectorUIOnly(langCode) {
    const code = normalizeLangCode(langCode);
    activeLanguage = code;
    try {
      localStorage.setItem('portfolio_lang', code);
    } catch (e) {}

    const labelText = langDisplayMap[code] || 'English';
    if (currentLangText) {
      currentLangText.textContent = labelText;
    }

    langItems.forEach(item => {
      if (item.getAttribute('data-value') === code) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  function clearGoogleTranslateCookies() {
    const hostname = window.location.hostname;
    const domains = ['', hostname, `.${hostname}`];
    const paths = ['/', window.location.pathname];

    domains.forEach(d => {
      paths.forEach(p => {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${d ? `domain=${d};` : ''} path=${p};`;
      });
    });
  }

  function setGoogleTranslateCookie(langCode) {
    if (!langCode || langCode === 'en' || langCode === 'it') {
      clearGoogleTranslateCookies();
      return;
    }
    const hostname = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    if (hostname) {
      document.cookie = `googtrans=/en/${langCode}; domain=${hostname}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; domain=.${hostname}; path=/;`;
    }
  }

  function initGoogleTranslateEngine(targetLang, callback) {
    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'es,de,fr,pt,ru,ja,zh-CN,ko,ar,tr,nl,pl,sv',
        autoDisplay: false
      }, 'google_translate_element');

      if (callback) callback();
    };

    if (!isTranslateEngineLoaded) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
      isTranslateEngineLoaded = true;
    } else if (callback) {
      callback();
    }
  }

  function attachGoogleTranslateComboListener() {
    const googCombo = document.querySelector('.goog-te-combo');
    if (googCombo && !googCombo.dataset.synced) {
      googCombo.dataset.synced = 'true';
      googCombo.addEventListener('change', () => {
        if (isProgrammaticChange || isInternalAction) return;
        const val = normalizeLangCode(googCombo.value || 'en');
        if (val !== activeLanguage) {
          applyLanguage(val, true);
        }
      });
    }
  }

  let translatePollInterval = null;

  function triggerGoogleTranslate(langCode) {
    function fire() {
      const googCombo = document.querySelector('.goog-te-combo');
      if (googCombo) {
        attachGoogleTranslateComboListener();
        if (langCode === 'en' || langCode === 'it' || !langCode) {
          if (googCombo.value !== '') {
            isProgrammaticChange = true;
            googCombo.value = '';
            googCombo.dispatchEvent(new Event('change'));
            setTimeout(() => { isProgrammaticChange = false; }, 50);
          }
          return true;
        } else {
          const optExists = Array.from(googCombo.options).some(o => o.value === langCode);
          if (optExists) {
            if (googCombo.value !== langCode) {
              isProgrammaticChange = true;
              googCombo.value = langCode;
              googCombo.dispatchEvent(new Event('change'));
              setTimeout(() => { isProgrammaticChange = false; }, 50);
            }
            return true;
          }
        }
      }
      return false;
    }

    if (translatePollInterval) {
      clearInterval(translatePollInterval);
      translatePollInterval = null;
    }

    if (!fire()) {
      initGoogleTranslateEngine(langCode, () => {
        if (translatePollInterval) {
          clearInterval(translatePollInterval);
        }
        let attempts = 0;
        translatePollInterval = setInterval(() => {
          attempts++;
          if (fire() || attempts >= 30) {
            clearInterval(translatePollInterval);
            translatePollInterval = null;
          }
        }, 100);
      });
    }
  }


  function applyLanguage(langCode, save = true) {
    const code = normalizeLangCode(langCode);
    activeLanguage = code;
    isInternalAction = true;

    if (save) {
      try {
        localStorage.setItem('portfolio_lang', code);
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
    }

        updateSelectorUIOnly(code);

        document.documentElement.lang = code;

        updatePageDictionaryContent(code);

    // Native dictionary for en/it; external translation engine for remaining locales
    if (code === 'en' || code === 'it') {
      clearGoogleTranslateCookies();
      document.querySelectorAll('font').forEach(font => {
        if (font.parentNode) {
          font.replaceWith(...font.childNodes);
        }
      });
      document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
      setTimeout(() => {
        updatePageDictionaryContent(code);
        isInternalAction = false;
      }, 50);
    } else {
      setGoogleTranslateCookie(code);
      triggerGoogleTranslate(code);
      setTimeout(() => {
        isInternalAction = false;
      }, 200);
    }
  }

  // Sync language state if altered externally by browser translation extensions
  const htmlObserver = new MutationObserver(() => {
    if (isInternalAction) return;

    const htmlEl = document.documentElement;
    const currentHtmlLang = htmlEl.getAttribute('lang') || htmlEl.lang || 'en';
    const isTranslated = htmlEl.classList.contains('translated-ltr') || htmlEl.classList.contains('translated-rtl');

    let detected = 'en';
    if (isTranslated || currentHtmlLang !== 'en') {
      detected = normalizeLangCode(currentHtmlLang);
    }

    if (detected !== activeLanguage) {
      updateSelectorUIOnly(detected);
      if (detected === 'it' || detected === 'en') {
        updatePageDictionaryContent(detected);
      }
    }
  });

  htmlObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang', 'class']
  });

  if (langBtn && langContainer) {
    function openLangDropdown() {
      langContainer.classList.add('open');
      langBtn.setAttribute('aria-expanded', 'true');
      const activeItem = langContainer.querySelector('.dropdown-item.active') || langItems[0];
      if (activeItem) activeItem.focus();
    }

    function closeLangDropdown(focusButton = false) {
      langContainer.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
      if (focusButton) langBtn.focus();
    }

    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (langContainer.classList.contains('open')) {
        closeLangDropdown(false);
      } else {
        openLangDropdown();
      }
    });

    langBtn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLangDropdown();
      }
    });

    langItems.forEach((item, index) => {
      item.setAttribute('tabindex', '-1');
      item.setAttribute('role', 'option');

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const langCode = item.getAttribute('data-value');
        closeLangDropdown(true);
        applyLanguage(langCode, true);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIdx = (index + 1) % langItems.length;
          langItems[nextIdx].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIdx = (index - 1 + langItems.length) % langItems.length;
          langItems[prevIdx].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          langItems[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          langItems[langItems.length - 1].focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const langCode = item.getAttribute('data-value');
          closeLangDropdown(true);
          applyLanguage(langCode, true);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeLangDropdown(true);
        } else if (e.key === 'Tab') {
          closeLangDropdown(false);
        }
      });
    });

        document.addEventListener('click', (e) => {
      if (!langContainer.contains(e.target)) {
        closeLangDropdown(false);
      }
    });


        let savedLang = 'en';
    try {
      const stored = localStorage.getItem('portfolio_lang');
      if (stored) {
        savedLang = stored;
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    applyLanguage(savedLang, false);

        if (savedLang !== 'en') {
      initGoogleTranslateEngine(savedLang, () => {
        triggerGoogleTranslate(savedLang);
      });
    }

    // Re-apply language on bfcache restore
    window.addEventListener('pageshow', () => {
      let currentSaved = 'en';
      try {
        currentSaved = localStorage.getItem('portfolio_lang') || activeLanguage;
      } catch (e) {}
      applyLanguage(currentSaved, false);
    });
  }

    const terminalWorkspace = document.getElementById('terminal-workspace');
  const panicOverlay = document.getElementById('self-destruct-overlay');
  const panicCountdownEl = document.getElementById('panic-countdown');
  const panicRebootBtn = document.getElementById('panic-reboot-btn');

  if (terminalWorkspace) {
    let terminalCount = 0;
    let topZIndex = 100;
    let isSelfDestructing = false;
    let isSystemDestroyed = false;
    let panicTimer = null;

    let activeDragSession = null;
    let activeResizeSession = null;

    // Global pointer tracking across all terminal instances
    window.addEventListener('mousemove', (e) => {
      if (activeDragSession) {
        e.preventDefault();
        activeDragSession.onMove(e.clientX, e.clientY);
      } else if (activeResizeSession) {
        e.preventDefault();
        activeResizeSession.onMove(e.clientX, e.clientY);
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (activeDragSession && e.touches.length === 1) {
        activeDragSession.onMove(e.touches[0].clientX, e.touches[0].clientY);
      } else if (activeResizeSession && e.touches.length === 1) {
        activeResizeSession.onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    window.addEventListener('mouseup', () => {
      if (activeDragSession) {
        activeDragSession.onEnd();
        activeDragSession = null;
      }
      if (activeResizeSession) {
        activeResizeSession.onEnd();
        activeResizeSession = null;
      }
    });

    window.addEventListener('touchend', () => {
      if (activeDragSession) {
        activeDragSession.onEnd();
        activeDragSession = null;
      }
      if (activeResizeSession) {
        activeResizeSession.onEnd();
        activeResizeSession = null;
      }
    });



    function getFormattedTimestamp() {
      const now = new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = days[now.getDay()];
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${dayName} at ${hours}:${minutes} ${ampm}`;
    }

    function getHelpCommandsHtml() {
      return `<div class="term-help-block"><div class="term-help-title">commands:</div><div class="term-help-table"><span class="term-help-cmd">help</span><span class="term-help-desc">show this command list</span><span class="term-help-cmd">ls</span><span class="term-help-desc">list directory files (-l, -la)</span><span class="term-help-cmd">echo</span><span class="term-help-desc">display line of text</span><span class="term-help-cmd">about</span><span class="term-help-desc">about me + story</span><span class="term-help-cmd">skills</span><span class="term-help-desc">technical skills & tools</span><span class="term-help-cmd">projects</span><span class="term-help-desc">featured software projects</span><span class="term-help-cmd">contact</span><span class="term-help-desc">email + telegram + discord</span><span class="term-help-cmd">github</span><span class="term-help-desc">redirection to profile</span><span class="term-help-cmd">discord</span><span class="term-help-desc">redirection to server</span><span class="term-help-cmd">youtube</span><span class="term-help-desc">redirection to channel</span><span class="term-help-cmd">telegram</span><span class="term-help-desc">redirection to telegram</span><span class="term-help-cmd">tiktok</span><span class="term-help-desc">redirection to tiktok</span><span class="term-help-cmd">commits</span><span class="term-help-desc">recent public git commits</span><span class="term-help-cmd">whoami</span><span class="term-help-desc">display identity details</span><span class="term-help-cmd">terminal</span><span class="term-help-desc">spawn a new floating terminal window</span><span class="term-help-cmd">clear</span><span class="term-help-desc">clear terminal screen</span><span class="term-help-cmd">exit</span><span class="term-help-desc">close this terminal instance</span></div></div>`;
    }




    function createTerminalWindow(isCascaded = false) {
      terminalCount++;
      const instanceId = terminalCount;
      topZIndex++;

      const winEl = document.createElement('div');
      winEl.className = 'minimal-term-window active-window notranslate';
      winEl.setAttribute('translate', 'no');
      winEl.id = `term-win-${instanceId}`;
      winEl.style.zIndex = String(topZIndex);


      // Viewport workspace bounds calculation to prevent UI overlap
      function getWorkspaceBounds() {
        const navbar = document.querySelector('.top-navbar');
        const sidebar = document.querySelector('.sidebar');
        const footer = document.querySelector('.global-footer');
        const contentNav = document.querySelector('.content-nav');

                const topLimit = (navbar ? navbar.getBoundingClientRect().bottom : 42) + 10;

                let leftLimit = 12;
        if (sidebar && window.innerWidth > 768) {
          const sRect = sidebar.getBoundingClientRect();
          leftLimit = Math.max(leftLimit, sRect.right + 16);
        }

                const rightLimit = window.innerWidth - 12;

                let bottomLimit = window.innerHeight - 14;
        if (contentNav) {
          const cRect = contentNav.getBoundingClientRect();
          if (cRect.top > 0 && cRect.top < window.innerHeight) {
            bottomLimit = Math.min(bottomLimit, cRect.top - 8);
          }
        } else if (footer) {
          const fRect = footer.getBoundingClientRect();
          if (fRect.top > 0 && fRect.top < window.innerHeight) {
            bottomLimit = Math.min(bottomLimit, fRect.top - 8);
          }
        }

        return { topLimit, leftLimit, rightLimit, bottomLimit };
      }

      if (isCascaded) {
        const bounds = getWorkspaceBounds();
        const offsetStep = ((instanceId - 1) % 5) * 26;
        winEl.style.position = 'fixed';
        winEl.style.top = `${Math.min(bounds.bottomLimit - 240, bounds.topLimit + 16 + offsetStep)}px`;
        winEl.style.left = `${Math.min(bounds.rightLimit - 340, bounds.leftLimit + 16 + offsetStep)}px`;
        winEl.style.margin = '0';
      }

      winEl.innerHTML = `
        <div class="win-resize-handle win-resize-top" data-dir="n"></div>
        <div class="win-resize-handle win-resize-bottom" data-dir="s"></div>
        <div class="win-resize-handle win-resize-left" data-dir="w"></div>
        <div class="win-resize-handle win-resize-right" data-dir="e"></div>
        <div class="win-resize-handle win-resize-top-left" data-dir="nw"></div>
        <div class="win-resize-handle win-resize-top-right" data-dir="ne"></div>
        <div class="win-resize-handle win-resize-bottom-left" data-dir="sw"></div>
        <div class="win-resize-handle win-resize-bottom-right" data-dir="se"></div>

        <div class="term-titlebar" title="Drag to move · Double-click for Fullscreen">
          <div class="term-titlebar-left">
            <span class="term-prompt-arrow">&gt;_</span>
            <span class="term-window-title">TERMINAL ${instanceId > 1 ? '#' + instanceId : ''}</span>
          </div>
          <div class="term-window-actions">
            <button type="button" class="term-btn-clean btn-fullscreen" title="Toggle Fullscreen">□</button>
            <button type="button" class="term-btn-clean btn-close" title="Close Terminal">✕</button>
          </div>
        </div>

        <div class="term-body">
          <div class="term-output">
            <div class="term-output-block">${getHelpCommandsHtml()}</div>
          </div>
          <div class="term-input-line">
            <div class="term-prompt">
              <span class="prompt-red">aledect@aledect:~/terminal$</span>
            </div>
            <div class="term-input-container">
              <input 
                type="text" 
                class="term-input" 
                autocomplete="off" 
                autocorrect="off" 
                autocapitalize="off" 
                spellcheck="false" 
                aria-label="Terminal input"
              />
            </div>
          </div>
        </div>

        <div class="term-bottom-bar">
          <span class="term-timestamp">${getFormattedTimestamp()}</span>
          <div class="term-resize-grip" title="Drag to Resize">⋰</div>
        </div>
      `;

      terminalWorkspace.appendChild(winEl);

      const titlebar = winEl.querySelector('.term-titlebar');
      const body = winEl.querySelector('.term-body');
      const output = winEl.querySelector('.term-output');
      const input = winEl.querySelector('.term-input');
      const btnFullscreen = winEl.querySelector('.btn-fullscreen');
      const btnClose = winEl.querySelector('.btn-close');
      const timestampEl = winEl.querySelector('.term-timestamp');

      let cmdHistory = [];
      let historyIdx = -1;
      let currentInputDraft = '';

            const timeInterval = setInterval(() => {
        if (!document.body.contains(winEl)) {
          clearInterval(timeInterval);
          return;
        }
        timestampEl.textContent = getFormattedTimestamp();
      }, 30000);

      function scrollToBottom() {
        body.scrollTop = body.scrollHeight;
      }

      function bringToFront() {
        topZIndex++;
        winEl.style.zIndex = String(topZIndex);
        document.querySelectorAll('.minimal-term-window').forEach(w => w.classList.remove('active-window'));
        winEl.classList.add('active-window');
      }

      winEl.addEventListener('mousedown', bringToFront);

            body.addEventListener('click', () => {
        if (!window.getSelection().toString()) {
          input.focus();
        }
      });

            function toggleFullscreen() {
        const isCurrentlyMax = winEl.classList.contains('fullscreen');
        if (!isCurrentlyMax) {
                    const rect = winEl.getBoundingClientRect();
          winEl.dataset.prevLeft = `${rect.left}px`;
          winEl.dataset.prevTop = `${rect.top}px`;
          winEl.dataset.prevWidth = `${rect.width}px`;
          winEl.dataset.prevHeight = `${rect.height}px`;
          winEl.dataset.prevPos = winEl.style.position || '';

          winEl.classList.add('fullscreen');
          btnFullscreen.textContent = '❐';
        } else {
          winEl.classList.remove('fullscreen');
          btnFullscreen.textContent = '□';
          if (winEl.dataset.prevPos) winEl.style.position = winEl.dataset.prevPos;
          if (winEl.dataset.prevLeft) winEl.style.left = winEl.dataset.prevLeft;
          if (winEl.dataset.prevTop) winEl.style.top = winEl.dataset.prevTop;
          if (winEl.dataset.prevWidth) winEl.style.width = winEl.dataset.prevWidth;
          if (winEl.dataset.prevHeight) winEl.style.height = winEl.dataset.prevHeight;
        }
        input.focus();
      }

            titlebar.addEventListener('dblclick', (e) => {
        if (e.target.closest('.term-btn-clean')) return;
        toggleFullscreen();
      });

      btnFullscreen.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFullscreen();
      });

            function closeTerminalInstance() {
        if (activeDragSession && activeDragSession.winEl === winEl) {
          activeDragSession = null;
        }
        if (activeResizeSession && activeResizeSession.winEl === winEl) {
          activeResizeSession = null;
        }
        clearInterval(timeInterval);
        const allWindows = document.querySelectorAll('.minimal-term-window');
        if (allWindows.length > 1) {
          winEl.remove();
        } else {
          winEl.remove();
          window.location.href = 'about.html';
        }
      }

      btnClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTerminalInstance();
      });


            function onDragStart(clientX, clientY) {
        if (winEl.classList.contains('fullscreen') || window.innerWidth <= 768) return;
        winEl.classList.add('dragging');
        bringToFront();

        const rect = winEl.getBoundingClientRect();
        winEl.style.position = 'fixed';
        winEl.style.left = `${rect.left}px`;
        winEl.style.top = `${rect.top}px`;
        winEl.style.margin = '0';

        activeDragSession = {
          winEl,
          startX: clientX,
          startY: clientY,
          startLeft: rect.left,
          startTop: rect.top,
          onMove(cx, cy) {
            const deltaX = cx - this.startX;
            const deltaY = cy - this.startY;
            let newLeft = this.startLeft + deltaX;
            let newTop = this.startTop + deltaY;

            const bounds = getWorkspaceBounds();
            const termRect = winEl.getBoundingClientRect();
            const maxLeft = Math.max(bounds.leftLimit, bounds.rightLimit - termRect.width);
            const maxTop = Math.max(bounds.topLimit, bounds.bottomLimit - termRect.height);

            newLeft = Math.max(bounds.leftLimit, Math.min(newLeft, maxLeft));
            newTop = Math.max(bounds.topLimit, Math.min(newTop, maxTop));

            winEl.style.left = `${newLeft}px`;
            winEl.style.top = `${newTop}px`;
          },
          onEnd() {
            winEl.classList.remove('dragging');
          }
        };
      }

      titlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.term-btn-clean')) return;
        onDragStart(e.clientX, e.clientY);
      });

      titlebar.addEventListener('touchstart', (e) => {
        if (e.target.closest('.term-btn-clean')) return;
        if (e.touches.length === 1) {
          onDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

            const MIN_WIDTH = 280;
      const MIN_HEIGHT = 180;

      function onResizeStart(e, dir) {
        if (winEl.classList.contains('fullscreen') || window.innerWidth <= 768) return;
        e.preventDefault();
        e.stopPropagation();
        winEl.classList.add('resizing');
        bringToFront();


        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = winEl.getBoundingClientRect();

        winEl.style.position = 'fixed';
        winEl.style.left = `${rect.left}px`;
        winEl.style.top = `${rect.top}px`;
        winEl.style.margin = '0';

        activeResizeSession = {
          winEl,
          dir,
          startX: clientX,
          startY: clientY,
          initLeft: rect.left,
          initTop: rect.top,
          initWidth: rect.width,
          initHeight: rect.height,
          onMove(cx, cy) {
            const deltaX = cx - this.startX;
            const deltaY = cy - this.startY;
            const bounds = getWorkspaceBounds();

            let newW = this.initWidth;
            let newH = this.initHeight;
            let newL = this.initLeft;
            let newT = this.initTop;

                        if (this.dir.includes('e')) {
              newW = Math.max(MIN_WIDTH, Math.min(this.initWidth + deltaX, bounds.rightLimit - this.initLeft));
            }

                        if (this.dir.includes('s')) {
              newH = Math.max(MIN_HEIGHT, Math.min(this.initHeight + deltaY, bounds.bottomLimit - this.initTop));
            }

                        if (this.dir.includes('w')) {
              const maxLeftMove = this.initWidth - MIN_WIDTH;
              const clampDeltaX = Math.min(deltaX, maxLeftMove);
              const proposedLeft = this.initLeft + clampDeltaX;
              if (proposedLeft >= bounds.leftLimit) {
                newL = proposedLeft;
                newW = this.initWidth - (newL - this.initLeft);
              } else {
                newL = bounds.leftLimit;
                newW = this.initWidth + (this.initLeft - bounds.leftLimit);
              }
            }

                        if (this.dir.includes('n')) {
              const maxTopMove = this.initHeight - MIN_HEIGHT;
              const clampDeltaY = Math.min(deltaY, maxTopMove);
              const proposedTop = this.initTop + clampDeltaY;
              if (proposedTop >= bounds.topLimit) {
                newT = proposedTop;
                newH = this.initHeight - (newT - this.initTop);
              } else {
                newT = bounds.topLimit;
                newH = this.initHeight + (this.initTop - bounds.topLimit);
              }
            }

            winEl.style.width = `${newW}px`;
            winEl.style.height = `${newH}px`;
            winEl.style.left = `${newL}px`;
            winEl.style.top = `${newT}px`;
          },
          onEnd() {
            winEl.classList.remove('resizing');
          }
        };
      }

            winEl.querySelectorAll('.win-resize-handle').forEach(handle => {
        const dir = handle.getAttribute('data-dir');
        handle.addEventListener('mousedown', (e) => onResizeStart(e, dir));
        handle.addEventListener('touchstart', (e) => {
          if (e.touches.length === 1) onResizeStart(e, dir);
        }, { passive: false });
      });


      function appendOutputEntry(rawCmd, outputHtml) {
        const entry = document.createElement('div');
        entry.className = 'term-cmd-entry';
        entry.innerHTML = `
          <div class="term-cmd-header">
            <div class="term-prompt">
              <span class="prompt-red">aledect@aledect:~/terminal$</span>
            </div>
            <span class="term-cmd-text">${escapeHtml(rawCmd)}</span>
          </div>
          ${outputHtml ? `<div class="term-output-block">${outputHtml}</div>` : ''}
        `;
        output.appendChild(entry);
        scrollToBottom();
      }

      function executeCommand(rawInput) {
        const trimmed = rawInput.trim();
        if (!trimmed) {
          appendOutputEntry('', '');
          return;
        }

        cmdHistory.push(trimmed);
        historyIdx = cmdHistory.length;

        const parts = trimmed.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

                if (isSystemDestroyed) {
          if (cmd === 'reboot' || cmd === 'restart' || cmd === 'reload') {
            window.location.reload();
            return;
          }
          appendOutputEntry(rawInput, `bash: ${escapeHtml(cmd)}: command not found`);
          input.value = '';
          return;
        }

        function handleRm(rmArgs, isSudo = false) {
          const validShortFlags = new Set(['r', 'R', 'f', 'i', 'I', 'd', 'v']);
          const validLongFlags = new Set([
            '--force',
            '--recursive',
            '--no-preserve-root',
            '--preserve-root',
            '--verbose',
            '--dir',
            '--help',
            '--version'
          ]);

          let hasInvalidOption = false;
          let invalidOptionMsg = '';
          const singleFlagArgs = [];
          const longFlagArgs = [];
          const operands = [];
          let stopFlags = false;

          for (const arg of rmArgs) {
            if (stopFlags) {
              operands.push(arg);
              continue;
            }
            if (arg === '--') {
              stopFlags = true;
              continue;
            }
            if (arg.startsWith('--')) {
              if (!validLongFlags.has(arg)) {
                hasInvalidOption = true;
                invalidOptionMsg = `rm: unrecognized option '${escapeHtml(arg)}'\nTry 'rm --help' for more information.`;
                break;
              }
              longFlagArgs.push(arg);
            } else if (arg.startsWith('-') && arg.length > 1) {
              for (let i = 1; i < arg.length; i++) {
                const ch = arg[i];
                if (!validShortFlags.has(ch)) {
                  hasInvalidOption = true;
                  invalidOptionMsg = `rm: invalid option -- '${escapeHtml(ch)}'\nTry 'rm --help' for more information.`;
                  break;
                }
              }
              if (hasInvalidOption) break;
              singleFlagArgs.push(arg);
            } else {
              operands.push(arg);
            }
          }

          if (hasInvalidOption) {
            return { output: invalidOptionMsg };
          }

          if (longFlagArgs.includes('--help')) {
            return {
              output: `Usage: rm [OPTION]... [FILE]...\nRemove (unlink) the FILE(s).\n\n  -f, --force           ignore nonexistent files and arguments, never prompt\n  -i                    prompt before every removal\n  -I                    prompt once before removing more than three files\n  -r, -R, --recursive   remove directories and their contents recursively\n  -d, --dir             remove empty directories\n  -v, --verbose         explain what is being done\n      --no-preserve-root  do not treat '/' specially\n      --preserve-root   do not remove '/' (default)\n      --help            display this help and exit\n      --version         output version information and exit\n\nBy default, rm does not remove directories. Use --recursive (-r or -R)\nto remove each listed directory, too.`
            };
          }

          if (longFlagArgs.includes('--version')) {
            return {
              output: `rm (GNU coreutils) 9.5\nCopyright (C) 2024 Free Software Foundation, Inc.\nLicense GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.\nThis is free software: you are free to change and redistribute it.\nThere is NO WARRANTY, to the extent permitted by law.`
            };
          }

          if (operands.length === 0) {
            return {
              output: `rm: missing operand\nTry 'rm --help' for more information.`
            };
          }

          const allFlagChars = singleFlagArgs.map(f => f.slice(1)).join('');
          const isRecursive = allFlagChars.includes('r') || allFlagChars.includes('R') || longFlagArgs.includes('--recursive');
          const isForce = allFlagChars.includes('f') || longFlagArgs.includes('--force');

          // Match recursive root destruction targets
          const isRootTarget = operands.some(op => op === '/' || op === '/*' || op === '*' || op === '/*/' || op === '~/*' || op === '/.');
          
          if (isRecursive && isRootTarget) {
            if (isSudo) {
              return { isDestructive: true };
            } else {
              const hasNoPreserve = longFlagArgs.includes('--no-preserve-root');
              if (operands.includes('/') && !hasNoPreserve) {
                return {
                  output: `rm: it is dangerous to operate recursively on '/'\nrm: use --no-preserve-root to override this failsafe\nrm: cannot remove '/': Permission denied (must run as root with sudo)`
                };
              }
              return {
                output: `rm: cannot remove '/boot': Permission denied\nrm: cannot remove '/etc': Permission denied\nrm: cannot remove '/root': Permission denied\nrm: cannot remove '/sys': Permission denied\nrm: cannot remove '/usr': Permission denied\nrm: cannot remove '/var': Permission denied\nrm: cannot remove '/': Permission denied (must run with sudo)`
              };
            }
          }

                    const protectedFiles = [
            'about.html', 'skills.html', 'projects.html', 'commits.html', 
            'terminal.html', 'script.js', 'style.css', 'README.md', 
            'images', '.git', '.gitignore'
          ];
          const errorLines = [];

          for (const op of operands) {
            if (protectedFiles.includes(op)) {
              errorLines.push(`rm: cannot remove '${escapeHtml(op)}': Permission denied`);
            } else if (!isForce) {
              errorLines.push(`rm: cannot remove '${escapeHtml(op)}': No such file or directory`);
            }
          }

          return { output: errorLines.join('\n') };
        }

        let outputHtml = '';

        switch (cmd) {
          case 'rm':
            const rmRes = handleRm(args, false);
            outputHtml = rmRes.output;
            break;

          case 'sudo':
            if (args.length === 0) {
              outputHtml = `usage: sudo command [arguments...]`;
            } else if (args[0].toLowerCase() === 'rm') {
              const sudoRmRes = handleRm(args.slice(1), true);
              if (sudoRmRes.isDestructive) {
                input.value = '';
                triggerSelfDestructSequence(trimmed);
                return;
              }
              outputHtml = sudoRmRes.output;
            } else {
              outputHtml = `aledect is not root.`;
            }
            break;
          case 'help':
          case 'man':
          case '?':
            outputHtml = getHelpCommandsHtml();
            break;

          case 'terminal':
          case 'term':
            const newPid = 1024 + (terminalCount * 137);
            outputHtml = `[process] allocated /dev/pts/${terminalCount + 1} (PID ${newPid})`;
            createTerminalWindow(true);
            break;

          case 'about':
            outputHtml = `<span class="term-highlight">Alessio Beltramino</span> — <span class="term-dim">IT Enthusiast · Hardware & Code</span>

Hi, I'm Alessio, a 16-year-old from Italy.
I really like computer science, and ever since I was little, I've always been curious about computers, how they were built, and how they worked on both the hardware and software sides.

One of the things I like to do most is building PCs—choosing components, checking compatibility, and handling the assembly myself.

Every now and then, I create small projects using HTML, CSS, and JavaScript, or build programs in Rust. Just things I enjoy completing.`;
            break;

          case 'skills':
          case 'skill':
            outputHtml = `<span class="term-highlight">PROGRAMMING:</span>  Rust, HTML, CSS, JavaScript, Batch, PowerShell
<span class="term-highlight">WINDOWS:</span>      Windows customization, Windows deployment, Custom ISO creation, Windows troubleshooting
<span class="term-highlight">HARDWARE:</span>     PC building, Component compatibility, Hardware troubleshooting, PC upgrades, Benchmarking
<span class="term-highlight">TOOLS:</span>        Git, GitHub, Visual Studio Code, NTLite, Autoruns, DISM, OSCDIMG`;
            break;

          case 'projects':
          case 'project':
            outputHtml = `<span class="term-highlight">PROJECTS:</span>

<span class="term-highlight">1. Platinum+ Optimizer</span>
Advanced application designed to optimize Windows at a deep level (kernel, OS behavior, core system architecture).
<span class="term-dim">LINK:</span> <a href="https://github.com/beltraminoalessio" target="_blank" rel="noopener noreferrer" class="term-url">https://github.com/beltraminoalessio</a>

<span class="term-highlight">2. Coming Soon...</span>
Upcoming project currently in development.`;
            break;


          case 'contact':
            outputHtml = `<span class="term-dim">EMAIL:</span>     <a href="mailto:beltraminoalessio@gmail.com" class="term-url">beltraminoalessio@gmail.com</a>
<span class="term-dim">TELEGRAM:</span>  <a href="https://t.me/aledect" target="_blank" rel="noopener noreferrer" class="term-url">https://t.me/aledect</a>
<span class="term-dim">DISCORD:</span>   <a href="https://discord.com/invite/rMZPgAJvPF" target="_blank" rel="noopener noreferrer" class="term-url">https://discord.gg/rMZPgAJvPF</a>`;
            break;

          case 'social':
            outputHtml = `<span class="term-dim">YOUTUBE:</span>   <a href="https://www.youtube.com/@Aledect" target="_blank" rel="noopener noreferrer" class="term-url">https://youtube.com/@Aledect</a>
<span class="term-dim">DISCORD:</span>   <a href="https://discord.com/invite/rMZPgAJvPF" target="_blank" rel="noopener noreferrer" class="term-url">https://discord.gg/rMZPgAJvPF</a>
<span class="term-dim">GITHUB:</span>    <a href="https://github.com/beltraminoalessio" target="_blank" rel="noopener noreferrer" class="term-url">https://github.com/beltraminoalessio</a>
<span class="term-dim">TIKTOK:</span>    <a href="https://www.tiktok.com/@aledect" target="_blank" rel="noopener noreferrer" class="term-url">https://tiktok.com/@aledect</a>
<span class="term-dim">TELEGRAM:</span>  <a href="https://t.me/aledect" target="_blank" rel="noopener noreferrer" class="term-url">https://t.me/aledect</a>
<span class="term-dim">EMAIL:</span>     <a href="mailto:beltraminoalessio@gmail.com" class="term-url">beltraminoalessio@gmail.com</a>`;
            break;

          case 'github':
            outputHtml = `exec xdg-open https://github.com/beltraminoalessio`;
            window.open('https://github.com/beltraminoalessio', '_blank');
            break;

          case 'discord':
            outputHtml = `exec xdg-open https://discord.com/invite/rMZPgAJvPF`;
            window.open('https://discord.com/invite/rMZPgAJvPF', '_blank');
            break;

          case 'youtube':
            outputHtml = `exec xdg-open https://www.youtube.com/@Aledect`;
            window.open('https://www.youtube.com/@Aledect', '_blank');
            break;

          case 'telegram':
            outputHtml = `exec xdg-open https://t.me/aledect`;
            window.open('https://t.me/aledect', '_blank');
            break;

          case 'tiktok':
            outputHtml = `exec xdg-open https://www.tiktok.com/@aledect`;
            window.open('https://www.tiktok.com/@aledect', '_blank');
            break;

          case 'email':
            outputHtml = `exec mailto:beltraminoalessio@gmail.com`;
            window.location.href = 'mailto:beltraminoalessio@gmail.com';
            break;

          case 'whoami':
            if (args.length > 0) {
              if (args[0] === '--help') {
                outputHtml = `Usage: whoami [OPTION]...\nPrint the user name associated with the current effective user ID.\n\n      --help     display this help and exit\n      --version  output version information and exit`;
              } else if (args[0].startsWith('--')) {
                outputHtml = `whoami: unrecognized option '${escapeHtml(args[0])}'\nTry 'whoami --help' for more information.`;
              } else if (args[0].startsWith('-')) {
                outputHtml = `whoami: invalid option -- '${escapeHtml(args[0].replace(/^-+/, '')[0] || '')}'\nTry 'whoami --help' for more information.`;
              } else {
                outputHtml = `whoami: extra operand '${escapeHtml(args[0])}'\nTry 'whoami --help' for more information.`;
              }
            } else {
              outputHtml = `aledect`;
            }
            break;

          case 'pwd':
            if (args.includes('--help')) {
              outputHtml = `pwd: pwd [-LP]\n    Print the name of the current working directory.`;
            } else {
              outputHtml = `/home/aledect/terminal`;
            }
            break;

          case 'id':
            if (args.includes('--help')) {
              outputHtml = `Usage: id [OPTION]... [USER]...\nPrint user and group information for the current user, or for each specified USER.\n\n  -u, --user     print only the effective user ID\n  -g, --group    print only the effective group ID\n  -G, --groups   print all group IDs\n  -n, --name     print a name instead of a number, for -ugG\n      --help     display this help and exit`;
            } else if (args.includes('-u') || args.includes('-un') || args.includes('--user')) {
              outputHtml = (args.includes('-n') || args.includes('-un')) ? 'aledect' : '1000';
            } else if (args.includes('-g') || args.includes('-gn') || args.includes('--group')) {
              outputHtml = (args.includes('-n') || args.includes('-gn')) ? 'aledect' : '1000';
            } else if (args.some(a => a.startsWith('-') && !['-u', '-g', '-G', '-n', '-un', '-gn', '-Gn', '--user', '--group', '--groups', '--name', '--help'].includes(a))) {
              const inv = args.find(a => a.startsWith('-'));
              outputHtml = `id: invalid option -- '${escapeHtml(inv.replace(/^-+/, '')[0] || '')}'\nTry 'id --help' for more information.`;
            } else {
              outputHtml = `uid=1000(aledect) gid=1000(aledect) groups=1000(aledect),4(adm),27(sudo),100(users)`;
            }
            break;

          case 'commits':
          case 'git':
            if (liveCommitsData && liveCommitsData.length > 0) {
              outputHtml = liveCommitsData.slice(0, 5).map(c => `commit <span class="term-highlight">${escapeHtml(c.hash)}</span> (${escapeHtml(c.repo)})\nAuthor: Alessio Beltramino\nDate:   ${escapeHtml(c.date)}\n\n    ${escapeHtml(c.message)}\n    <a href="${c.commitUrl}" target="_blank" rel="noopener noreferrer" class="term-url">${c.commitUrl}</a>`).join('\n\n');
            } else {
              outputHtml = `fatal: no commit history available in local cache.`;
            }
            break;

          case 'clear':
          case 'cls':
            output.innerHTML = '';
            input.value = '';
            return;

          case 'exit':
          case 'quit':
          case 'close':
            closeTerminalInstance();
            return;

          case 'history':
            if (cmdHistory.length === 0) {
              outputHtml = `<span class="term-dim">no commands in history.</span>`;
            } else {
              outputHtml = cmdHistory.map((c, i) => `<span class="term-dim">${String(i + 1).padStart(4, ' ')}</span>  ${escapeHtml(c)}`).join('\n');
            }
            break;

          case 'ls':
          case 'dir':
          case 'll':
            const validShortFlags = new Set(['a', 'l', '1', 'h', 'A', 'r', 't', 'd', 'F', 'p']);
            const validLongFlags = new Set(['--all', '--almost-all', '--help', '--version', '--format=long', '--human-readable', '--reverse']);

            let hasInvalidOption = false;
            let invalidOptionMsg = '';

            const singleFlagArgs = [];
            const longFlagArgs = [];
            const targetPaths = [];

            for (const arg of args) {
              if (arg === '--') {
                continue;
              }
              if (arg.startsWith('--')) {
                if (!validLongFlags.has(arg)) {
                  hasInvalidOption = true;
                  invalidOptionMsg = `${cmd}: unrecognized option '${escapeHtml(arg)}'\nTry '${cmd} --help' for more information.`;
                  break;
                }
                longFlagArgs.push(arg);
              } else if (arg.startsWith('-') && arg.length > 1) {
                                for (let i = 1; i < arg.length; i++) {
                  const ch = arg[i];
                  if (!validShortFlags.has(ch)) {
                    hasInvalidOption = true;
                    invalidOptionMsg = `${cmd}: invalid option -- '${escapeHtml(ch)}'\nTry '${cmd} --help' for more information.`;
                    break;
                  }
                }
                if (hasInvalidOption) break;
                singleFlagArgs.push(arg);
              } else {
                targetPaths.push(arg);
              }
            }

            if (hasInvalidOption) {
              outputHtml = invalidOptionMsg;
              break;
            }

            if (longFlagArgs.includes('--help')) {
              outputHtml = `Usage: ${cmd} [OPTION]... [FILE]...\nList information about the FILEs (the current directory by default).\n\n  -a, --all                  do not ignore entries starting with .\n  -A, --almost-all           do not list implied . and ..\n  -l                         use a long listing format\n  -1                         list one file per line\n  -h, --human-readable       with -l, print sizes in human readable format\n      --help                 display this help and exit\n      --version              output version information and exit`;
              break;
            }

            if (longFlagArgs.includes('--version')) {
              outputHtml = `${cmd} (GNU coreutils) 9.5\nCopyright (C) 2024 Free Software Foundation, Inc.\nLicense GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.\nThis is free software: you are free to change and redistribute it.\nThere is NO WARRANTY, to the extent permitted by law.`;
              break;
            }

            const allFlagChars = singleFlagArgs.map(f => f.slice(1)).join('');

            const isLong = cmd === 'll' || allFlagChars.includes('l') || longFlagArgs.includes('--format=long');
            const isAll = allFlagChars.includes('a') || longFlagArgs.includes('--all');
            const isAlmostAll = allFlagChars.includes('A') || longFlagArgs.includes('--almost-all');
            const isSingleCol = allFlagChars.includes('1');
            const isHuman = allFlagChars.includes('h') || longFlagArgs.includes('--human-readable');
            const isReverse = allFlagChars.includes('r') || longFlagArgs.includes('--reverse');

            const allFilesMap = {
              '.': { name: '.', size: 4096, type: 'd', hidden: true, isDot: true },
              '..': { name: '..', size: 4096, type: 'd', hidden: true, isDot: true },
              '.git': { name: '.git', size: 4096, type: 'd', hidden: true, isDot: false },
              '.gitignore': { name: '.gitignore', size: 128, type: '-', hidden: true, isDot: false },
              'about.html': { name: 'about.html', size: 15381, type: '-', hidden: false, isDot: false },
              'images': { name: 'images', size: 4096, type: 'd', hidden: false, isDot: false },
              'skills.html': { name: 'skills.html', size: 14890, type: '-', hidden: false, isDot: false },
              'projects.html': { name: 'projects.html', size: 13890, type: '-', hidden: false, isDot: false },
              'commits.html': { name: 'commits.html', size: 14210, type: '-', hidden: false, isDot: false },
              'README.md': { name: 'README.md', size: 2048, type: '-', hidden: false, isDot: false },
              'script.js': { name: 'script.js', size: 56368, type: '-', hidden: false, isDot: false },
              'style.css': { name: 'style.css', size: 37908, type: '-', hidden: false, isDot: false },
              'terminal.html': { name: 'terminal.html', size: 13420, type: '-', hidden: false, isDot: false }
            };

                        if (targetPaths.length > 0) {
              const invalidTarget = targetPaths.find(p => !allFilesMap[p]);
              if (invalidTarget) {
                outputHtml = `${cmd}: cannot access '${escapeHtml(invalidTarget)}': No such file or directory`;
                break;
              }
            }

            let selectedFiles = Object.values(allFilesMap);
            if (targetPaths.length > 0) {
              selectedFiles = targetPaths.map(p => allFilesMap[p]);
            } else if (isAll) {
                          } else if (isAlmostAll) {
              selectedFiles = selectedFiles.filter(f => !f.isDot);
            } else {
              selectedFiles = selectedFiles.filter(f => !f.hidden);
            }

            if (isReverse) {
              selectedFiles = selectedFiles.reverse();
            }

            function formatSize(bytes) {
              if (!isHuman) return String(bytes).padStart(6, ' ');
              if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)}M`.padStart(6, ' ');
              if (bytes >= 1024) return `${Math.round(bytes / 1024)}K`.padStart(6, ' ');
              return `${bytes}B`.padStart(6, ' ');
            }

            if (isLong) {
              const lines = selectedFiles.map(f => {
                const perms = f.type === 'd' ? 'drwxr-xr-x' : '-rw-r--r--';
                const links = f.type === 'd' ? '4' : '1';
                const sizeStr = formatSize(f.size);
                return `${perms} ${links} aledect aledect ${sizeStr} Aug 13 21:30 ${f.name}`;
              });
              outputHtml = `total ${isAll ? 144 : (isAlmostAll ? 136 : 128)}\n` + lines.join('\n');
            } else if (isSingleCol) {
              outputHtml = selectedFiles.map(f => f.name).join('\n');
            } else {
              outputHtml = selectedFiles.map(f => f.name).join('   ');
            }
            break;

          case 'echo':
            outputHtml = escapeHtml(args.join(' '));
            break;

          default:
            outputHtml = `bash: ${escapeHtml(cmd)}: command not found`;
            break;

        }

        appendOutputEntry(rawInput, outputHtml);
        input.value = '';
      }

            input.addEventListener('keydown', (e) => {
        if (isSelfDestructing) {
          e.preventDefault();
          return;
        }

        if (e.key === 'Enter') {
          const value = input.value;
          executeCommand(value);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (cmdHistory.length > 0) {
            if (historyIdx === cmdHistory.length) {
              currentInputDraft = input.value;
            }
            if (historyIdx > 0) {
              historyIdx--;
              input.value = cmdHistory[historyIdx];
            }
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (cmdHistory.length > 0) {
            if (historyIdx < cmdHistory.length - 1) {
              historyIdx++;
              input.value = cmdHistory[historyIdx];
            } else if (historyIdx === cmdHistory.length - 1) {
              historyIdx = cmdHistory.length;
              input.value = currentInputDraft;
            }
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          const currentVal = input.value.trim().toLowerCase();
          if (!currentVal) return;

          const validCmds = [
            'help', 'ls', 'dir', 'll', 'pwd', 'id', 'rm', 'echo', 'terminal', 'about', 'skills', 'projects', 'project', 'contact', 'social', 'github', 
            'discord', 'youtube', 'telegram', 'tiktok', 'email', 'commits', 
            'whoami', 'clear', 'history', 'sudo', 'exit'
          ];

          const parts = currentVal.split(/\s+/);
          if (parts.length === 1) {
            const match = validCmds.find(c => c.startsWith(parts[0]));
            if (match) {
              input.value = match;
            }
          }
        } else if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
          e.preventDefault();
          output.innerHTML = '';
          input.value = '';
        }
      });



            setTimeout(() => {
        input.focus();
      }, 50);

      return winEl;
    }

        function triggerSelfDestructSequence(cmdText = 'sudo rm -rf /*') {
      if (isSelfDestructing) return;
      isSelfDestructing = true;
      document.querySelectorAll('.term-input').forEach(inp => {
        inp.disabled = true;
        inp.blur();
      });

      const deletionFiles = [
        "rm: removing '/boot/vmlinuz-linux'",
        "rm: removing '/boot/initramfs-linux.img'",
        "rm: removing '/boot/initramfs-linux-fallback.img'",
        "rm: removing '/boot/efi/EFI/BOOT/BOOTX64.EFI'",
        "rm: removing '/boot/efi/EFI/arch/grubx64.efi'",
        "rm: removing '/boot/grub/grub.cfg'",
        "rm: removing '/boot/grub/x86_64-efi/normal.mod'",
        "rm: removing '/etc/fstab'",
        "rm: removing '/etc/shadow'",
        "rm: removing '/etc/passwd'",
        "rm: removing '/etc/group'",
        "rm: removing '/etc/gshadow'",
        "rm: removing '/etc/sudoers'",
        "rm: removing '/etc/hostname'",
        "rm: removing '/etc/hosts'",
        "rm: removing '/etc/resolv.conf'",
        "rm: removing '/etc/locale.gen'",
        "rm: removing '/etc/locale.conf'",
        "rm: removing '/etc/vconsole.conf'",
        "rm: removing '/etc/environment'",
        "rm: removing '/etc/profile'",
        "rm: removing '/etc/bash.bashrc'",
        "rm: removing '/etc/pacman.conf'",
        "rm: removing '/etc/pacman.d/mirrorlist'",
        "rm: removing '/etc/systemd/system/default.target'",
        "rm: removing '/etc/systemd/system/multi-user.target.wants/NetworkManager.service'",
        "rm: removing '/etc/systemd/system/multi-user.target.wants/sshd.service'",
        "rm: removing '/etc/systemd/journald.conf'",
        "rm: removing '/etc/systemd/logind.conf'",
        "rm: removing '/etc/security/limits.conf'",
        "rm: removing '/etc/pam.d/system-auth'",
        "rm: removing '/etc/pam.d/su'",
        "rm: removing '/etc/pam.d/login'",
        "rm: removing '/bin/bash'",
        "rm: removing '/bin/sh'",
        "rm: removing '/bin/zsh'",
        "rm: removing '/bin/systemctl'",
        "rm: removing '/bin/journalctl'",
        "rm: removing '/bin/ls'",
        "rm: removing '/bin/cat'",
        "rm: removing '/bin/cp'",
        "rm: removing '/bin/mv'",
        "rm: removing '/bin/chmod'",
        "rm: removing '/bin/chown'",
        "rm: removing '/bin/mkdir'",
        "rm: removing '/bin/ps'",
        "rm: removing '/bin/kill'",
        "rm: removing '/bin/mount'",
        "rm: removing '/bin/umount'",
        "rm: removing '/bin/grep'",
        "rm: removing '/bin/sed'",
        "rm: removing '/bin/awk'",
        "rm: removing '/bin/tar'",
        "rm: removing '/bin/gzip'",
        "rm: removing '/bin/sudo'",
        "rm: removing '/sbin/init'",
        "rm: removing '/sbin/reboot'",
        "rm: removing '/sbin/poweroff'",
        "rm: removing '/sbin/modprobe'",
        "rm: removing '/sbin/insmod'",
        "rm: removing '/sbin/rmmod'",
        "rm: removing '/sbin/ip'",
        "rm: removing '/sbin/iptables'",
        "rm: removing '/sbin/fdisk'",
        "rm: removing '/sbin/mkfs.ext4'",
        "rm: removing '/sbin/fsck'",
        "rm: removing '/usr/bin/python3.12'",
        "rm: removing '/usr/bin/python3'",
        "rm: removing '/usr/bin/node'",
        "rm: removing '/usr/bin/npm'",
        "rm: removing '/usr/bin/gcc'",
        "rm: removing '/usr/bin/g++'",
        "rm: removing '/usr/bin/make'",
        "rm: removing '/usr/bin/git'",
        "rm: removing '/usr/bin/curl'",
        "rm: removing '/usr/bin/wget'",
        "rm: removing '/usr/bin/ssh'",
        "rm: removing '/usr/bin/sshd'",
        "rm: removing '/usr/bin/vim'",
        "rm: removing '/usr/bin/nano'",
        "rm: removing '/usr/bin/htop'",
        "rm: removing '/usr/bin/tmux'",
        "rm: removing '/usr/lib/libc.so.6'",
        "rm: removing '/usr/lib/libm.so.6'",
        "rm: removing '/usr/lib/libpthread.so.0'",
        "rm: removing '/usr/lib/libdl.so.2'",
        "rm: removing '/usr/lib/libssl.so.3'",
        "rm: removing '/usr/lib/libcrypto.so.3'",
        "rm: removing '/usr/lib/libz.so.1'",
        "rm: removing '/usr/lib/libsystemd.so.0'",
        "rm: removing '/usr/lib/libudev.so.1'",
        "rm: removing '/usr/lib/libglib-2.0.so.0'",
        "rm: removing '/usr/lib/libX11.so.6'",
        "rm: removing '/usr/lib/libwayland-client.so.0'",
        "rm: removing '/usr/lib/modules/6.12.8-arch1-1/kernel/drivers/gpu/drm/i915/i915.ko.zst'",
        "rm: removing '/usr/lib/modules/6.12.8-arch1-1/kernel/drivers/gpu/drm/nouveau/nouveau.ko.zst'",
        "rm: removing '/usr/lib/modules/6.12.8-arch1-1/kernel/drivers/net/ethernet/intel/e1000e/e1000e.ko.zst'",
        "rm: removing '/usr/lib/modules/6.12.8-arch1-1/kernel/drivers/net/wireless/intel/iwlwifi/iwlwifi.ko.zst'",
        "rm: removing '/usr/lib/modules/6.12.8-arch1-1/kernel/drivers/usb/host/xhci-hcd.ko.zst'",
        "rm: removing '/usr/lib/modules/6.12.8-arch1-1/kernel/drivers/nvme/host/nvme.ko.zst'",
        "rm: removing '/usr/lib/modules/6.12.8-arch1-1/kernel/fs/ext4/ext4.ko.zst'",
        "rm: removing '/usr/lib/modules/6.12.8-arch1-1/kernel/fs/btrfs/btrfs.ko.zst'",
        "rm: removing '/usr/share/zoneinfo/UTC'",
        "rm: removing '/usr/share/zoneinfo/Europe/Rome'",
        "rm: removing '/usr/share/locale/en/LC_MESSAGES'",
        "rm: removing '/var/log/syslog'",
        "rm: removing '/var/log/messages'",
        "rm: removing '/var/log/journal'",
        "rm: removing '/var/log/auth.log'",
        "rm: removing '/var/log/pacman.log'",
        "rm: removing '/var/cache/pacman/pkg'",
        "rm: removing '/var/lib/systemd'",
        "rm: removing '/var/lib/NetworkManager'",
        "rm: removing '/var/spool/mail'",
        "rm: removing '/home/aledect/.bashrc'",
        "rm: removing '/home/aledect/.profile'",
        "rm: removing '/home/aledect/.ssh/id_rsa'",
        "rm: removing '/home/aledect/.ssh/authorized_keys'",
        "rm: removing '/home/aledect/.config'",
        "rm: removing '/home/aledect/desktop/aledect/script.js'",
        "rm: removing '/home/aledect/desktop/aledect/style.css'",
        "rm: removing '/home/aledect/desktop/aledect/about.html'",
        "rm: removing '/home/aledect/desktop/aledect/skills.html'",
        "rm: removing '/home/aledect/desktop/aledect/projects.html'",
        "rm: removing '/home/aledect/desktop/aledect/commits.html'",
        "rm: removing '/home/aledect/desktop/aledect/terminal.html'",
        "rm: removing '/root/.bashrc'",

        "rm: removing '/root/.profile'",
        "rm: removing '/dev/null'",
        "rm: removing '/dev/zero'",
        "rm: removing '/dev/urandom'",
        "rm: removing '/dev/tty'",
        "rm: removing '/dev/pts/0'",
        "rm: removing '/dev/pts/1'",
        "rm: removing '/bin/rm'",
        "rm: cannot remove '/proc/kcore': Operation not permitted",
        "rm: cannot remove '/sys/firmware/efi/efivars': Read-only file system",
        "rm: cannot remove '/dev/pts/ptmx': Device or resource busy",
        "rm: error while loading shared libraries: libc.so.6: cannot open shared object file: No such file or directory",
        "/bin/sh: error while loading shared libraries: libc.so.6: cannot open shared object file: No such file or directory"
      ];


      const activeOutput = document.querySelector('.active-window .term-output') || document.querySelector('.term-output');
      const activeBody = document.querySelector('.active-window .term-body') || document.querySelector('.term-body');

      if (activeOutput) {
        const entry = document.createElement('div');
        entry.className = 'term-cmd-entry';
        entry.innerHTML = `
          <div class="term-cmd-header">
            <div class="term-prompt">
              <span class="prompt-red">aledect@aledect:~/terminal$</span>
            </div>
            <span class="term-cmd-text">${escapeHtml(cmdText)}</span>
          </div>
          <div class="term-output-block" id="rm-deletion-stream"></div>
        `;
        activeOutput.appendChild(entry);
      }


      const streamBox = document.getElementById('rm-deletion-stream');
      let idx = 0;

      const footerEl = document.querySelector('.global-footer');
      const contentNavEl = document.querySelector('.content-nav');
      const navbarEl = document.querySelector('.top-navbar');
      const sidebarEl = document.querySelector('.sidebar');
      const mainContentEl = document.querySelector('.main-content');

            const deleteInterval = setInterval(() => {
        if (idx < deletionFiles.length) {
          if (streamBox) {
            const line = document.createElement('div');
            const lineText = deletionFiles[idx];
            const isError = lineText.includes('cannot') || lineText.includes('error') || lineText.includes('Kernel panic');
            line.className = isError ? 'term-error' : 'term-dim';
            line.textContent = lineText;
            streamBox.appendChild(line);
            if (activeBody) {
              activeBody.scrollTop = activeBody.scrollHeight;
            }
          }

                    if (idx === 25 && footerEl) {
            footerEl.classList.add('element-corrupted');
            setTimeout(() => { if (footerEl) footerEl.style.display = 'none'; }, 200);
          } else if (idx === 55 && contentNavEl) {

            contentNavEl.classList.add('element-corrupted');
            setTimeout(() => { if (contentNavEl) contentNavEl.style.display = 'none'; }, 200);
          } else if (idx === 85 && navbarEl) {
            navbarEl.classList.add('element-corrupted');
            setTimeout(() => { if (navbarEl) navbarEl.style.display = 'none'; }, 200);
          } else if (idx === 115 && sidebarEl) {
                        sidebarEl.style.display = 'none';
          }

          idx++;
        } else {
          clearInterval(deleteInterval);

                    document.body.classList.add('site-blackout');
          isSystemDestroyed = true;
          isSelfDestructing = false;

                    document.querySelectorAll('.term-input').forEach(inp => {
            inp.disabled = false;
          });
          const currentInput = document.querySelector('.active-window .term-input') || document.querySelector('.term-input');
          if (currentInput) {
            currentInput.disabled = false;
            currentInput.focus();
          }

                    document.querySelectorAll('.term-btn-clean').forEach(btn => {
            btn.style.display = 'none';
          });
        }
      }, 20);

    }

        createTerminalWindow(false);
  }

    document.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    const isTyping = activeEl && (
      activeEl.tagName === 'INPUT' || 
      activeEl.tagName === 'TEXTAREA' || 
      activeEl.isContentEditable
    );
    if (isTyping) return;

    // Alt + [1-5] direct section navigation
    const sections = {
      '1': 'about.html',
      '2': 'skills.html',
      '3': 'projects.html',
      '4': 'commits.html',
      '5': 'terminal.html'
    };

    if (e.altKey && sections[e.key]) {
      e.preventDefault();
      window.location.href = sections[e.key];
      return;
    }

    // Arrow key sequential navigation
    if (e.key === 'ArrowLeft') {
      const prevLink = document.querySelector('.content-nav-link.prev');
      if (prevLink) {
        e.preventDefault();
        prevLink.click();
      }
    } else if (e.key === 'ArrowRight') {
      const nextLink = document.querySelector('.content-nav-link.next');
      if (nextLink) {
        e.preventDefault();
        nextLink.click();
      }
    }
  });
});


