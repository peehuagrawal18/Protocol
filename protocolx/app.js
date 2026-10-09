/**
 * PROTOCOL-X: Application Controller & State Manager
 * Handles UI interactions, local persistence, real-time triage, editing,
 * and Student USN Authentication & Profile Management.
 */

(function () {
  'use strict';

  // Storage Keys
  const SESSION_KEY = 'protocolx_active_session_usn';
  const PROFILE_KEY_PREFIX = 'protocolx_profile_';
  const WORKSPACE_KEY_PREFIX = 'protocolx_workspace_';

  // Default Profiles
  const DEFAULT_USERS = {
    '1BY23CS042': {
      usn: '1BY23CS042',
      name: 'Prashant Kumar',
      email: 'prashant.cs23@bmsit.in',
      avatar: '👨‍💻'
    },
    '1BY23IS019': {
      usn: '1BY23IS019',
      name: 'Ananya Sharma',
      email: 'ananya.is23@bmsit.in',
      avatar: '👩‍💻'
    },
    '1BY23AI005': {
      usn: '1BY23AI005',
      name: 'Aarav Patel',
      email: 'aarav.ai23@bmsit.in',
      avatar: '🤖'
    }
  };

  // Current Active User Profile
  let currentUser = { ...DEFAULT_USERS['1BY23CS042'] };
  let modalSelectedAvatar = '👨‍💻';

  // Workspace State (per USN)
  let appState = {
    currentPresetId: 'hackathon',
    userHandle: 'prashant',
    activeFilter: 'all',
    searchQuery: '',
    messages: [],
    deadlines: [],
    tasks: [],
    decisions: [],
    summary: {
      overview: '',
      highlights: []
    },
    lastSaved: null
  };

  // DOM Elements
  const userHandleInput = document.getElementById('userHandleInput');
  const presetSelect = document.getElementById('presetSelect');
  const openImportModalBtn = document.getElementById('openImportModalBtn');
  const simulateIncomingBtn = document.getElementById('simulateIncomingBtn');
  const saveChangesBtn = document.getElementById('saveChangesBtn');
  const exportBriefBtn = document.getElementById('exportBriefBtn');
  const privacyAuditBtn = document.getElementById('privacyAuditBtn');
  const regenerateSummaryBtn = document.getElementById('regenerateSummaryBtn');
  const emptyTrashBtn = document.getElementById('emptyTrashBtn');
  const resetPresetBtn = document.getElementById('resetPresetBtn');
  const quickAddTaskBtn = document.getElementById('quickAddTaskBtn');
  const searchInput = document.getElementById('searchInput');

  // Top Right Profile Widget Elements
  const userProfileWidget = document.getElementById('userProfileWidget');
  const headerUserAvatar = document.getElementById('headerUserAvatar');
  const headerUserName = document.getElementById('headerUserName');
  const headerUserUsn = document.getElementById('headerUserUsn');

  // Profile Modal Elements
  const profileModal = document.getElementById('profileModal');
  const profileAvatarPreview = document.getElementById('profileAvatarPreview');
  const profilePreviewName = document.getElementById('profilePreviewName');
  const profilePreviewUsn = document.getElementById('profilePreviewUsn');
  const profileNameInput = document.getElementById('profileNameInput');
  const profileUsnInput = document.getElementById('profileUsnInput');
  const profileEmailInput = document.getElementById('profileEmailInput');
  const profilePhotoFileInput = document.getElementById('profilePhotoFileInput');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const profileLogoutBtn = document.getElementById('profileLogoutBtn');
  const logoutUsnLabel = document.getElementById('logoutUsnLabel');
  const avatarGridList = document.getElementById('avatarGridList');

  // Auth Modal Elements (Login Gate)
  const authModal = document.getElementById('authModal');
  const loginForm = document.getElementById('loginForm');
  const loginUsnInput = document.getElementById('loginUsnInput');
  const loginNameInput = document.getElementById('loginNameInput');
  const loginEmailInput = document.getElementById('loginEmailInput');

  // Metrics elements
  const metricUrgentCount = document.getElementById('metricUrgentCount');
  const metricMentionCount = document.getElementById('metricMentionCount');
  const metricDeadlineCount = document.getElementById('metricDeadlineCount');
  const metricNoisePercent = document.getElementById('metricNoisePercent');
  const metricTimeSaved = document.getElementById('metricTimeSaved');
  const summaryTextarea = document.getElementById('summaryTextarea');
  const summaryHighlightsList = document.getElementById('summaryHighlightsList');
  const deadlinesList = document.getElementById('deadlinesList');
  const tasksList = document.getElementById('tasksList');
  const userTaskCount = document.getElementById('userTaskCount');
  const deadlinesCountBadge = document.getElementById('deadlinesCountBadge');
  const lastSavedIndicator = document.getElementById('lastSavedIndicator');

  // Column lists
  const listImportant = document.getElementById('listImportant');
  const listLater = document.getElementById('listLater');
  const listTrash = document.getElementById('listTrash');

  // Badge counts
  const badgeImportantCount = document.getElementById('badgeImportantCount');
  const badgeLaterCount = document.getElementById('badgeLaterCount');
  const badgeTrashCount = document.getElementById('badgeTrashCount');
  const chipCountAll = document.getElementById('chipCountAll');
  const chipCountImportant = document.getElementById('chipCountImportant');
  const chipCountLater = document.getElementById('chipCountLater');
  const chipCountTrash = document.getElementById('chipCountTrash');
  const chipCountMentions = document.getElementById('chipCountMentions');

  // Other Modals
  const importModal = document.getElementById('importModal');
  const privacyModal = document.getElementById('privacyModal');
  const addTaskModal = document.getElementById('addTaskModal');
  const pasteChatTextarea = document.getElementById('pasteChatTextarea');
  const executeImportBtn = document.getElementById('executeImportBtn');
  const confirmAddTaskBtn = document.getElementById('confirmAddTaskBtn');
  const newTaskInput = document.getElementById('newTaskInput');
  const newTaskAssignee = document.getElementById('newTaskAssignee');
  const newTaskDeadline = document.getElementById('newTaskDeadline');
  const clearStorageBtn = document.getElementById('clearStorageBtn');
  const privacyStorageSize = document.getElementById('privacyStorageSize');
  const toastContainer = document.getElementById('toastContainer');

  /**
   * Initialize Application
   */
  function init() {
    setupEventListeners();
    setupProfileAndAuthEvents();
    checkAuthSessionAndLoad();
  }

  /**
   * Check Active Student Session or Show Auth Login Modal
   */
  function checkAuthSessionAndLoad() {
    const activeUsn = localStorage.getItem(SESSION_KEY);

    if (!activeUsn) {
      // First visit or logged out -> Show Auth Modal
      showAuthModal();
      return;
    }

    // Load Profile
    loadUserProfile(activeUsn);
    hideAuthModal();
    loadWorkspaceForUser();
  }

  /**
   * Load User Profile by USN
   */
  function loadUserProfile(usn) {
    const stored = localStorage.getItem(PROFILE_KEY_PREFIX + usn);
    if (stored) {
      try {
        currentUser = JSON.parse(stored);
      } catch (e) {
        currentUser = DEFAULT_USERS[usn] || { usn: usn, name: 'Student', email: '', avatar: '👨‍💻' };
      }
    } else if (DEFAULT_USERS[usn]) {
      currentUser = { ...DEFAULT_USERS[usn] };
    } else {
      currentUser = {
        usn: usn,
        name: 'Student ' + usn,
        email: `${usn.toLowerCase()}@college.edu`,
        avatar: '🎓'
      };
    }

    // Persist session and profile
    localStorage.setItem(SESSION_KEY, currentUser.usn);
    localStorage.setItem(PROFILE_KEY_PREFIX + currentUser.usn, JSON.stringify(currentUser));

    updateProfileHeaderWidget();
  }

  /**
   * Update the Topmost Right Profile Widget
   */
  function updateProfileHeaderWidget() {
    if (headerUserAvatar) {
      renderAvatarElement(headerUserAvatar, currentUser.avatar);
    }
    if (headerUserName) {
      headerUserName.textContent = currentUser.name || 'Student';
    }
    if (headerUserUsn) {
      headerUserUsn.textContent = currentUser.usn;
    }
    if (logoutUsnLabel) {
      logoutUsnLabel.textContent = currentUser.usn;
    }
    if (userHandleInput) {
      const handle = (currentUser.name ? currentUser.name.split(' ')[0] : currentUser.usn).toLowerCase();
      userHandleInput.value = handle;
    }
  }

  /**
   * Update the Welcome Banner text and avatar
   */
  function renderWelcomeBanner() {
    const welcomeName = document.getElementById('welcomeUserName');
    const welcomeSub  = document.getElementById('welcomeSubtitle');
    const welcomeAvt  = document.getElementById('welcomeAvatarBadge');

    if (welcomeName) welcomeName.textContent = currentUser.name || 'Student';
    if (welcomeSub)  welcomeSub.textContent = `USN: ${currentUser.usn}\u00a0|\u00a0 Your personalised triage dashboard is ready \u2014 100% local, zero cloud.`;
    if (welcomeAvt)  renderAvatarElement(welcomeAvt, currentUser.avatar || '\ud83d\udc68\u200d\ud83d\udcbb');
  }

  /**
   * Live clock in the welcome banner (ticks every minute)
   */
  (function startWelcomeClock() {
    function tick() {
      const el = document.getElementById('welcomeCurrentTime');
      if (el) {
        el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      }
    }
    tick();
    setInterval(tick, 30000);
  })();

  /**
   * Render the full unsummarised raw chat stream below the triage board.
   * Colour-codes each bubble by triage category (important / later / trash).
   */
  function renderRawChatStream() {
    const container = document.getElementById('rawChatStream');
    const countEl   = document.getElementById('rawChatCount');
    const sortSel   = document.getElementById('rawChatSortSelect');
    if (!container) return;

    const sortMode = sortSel ? sortSel.value : 'original';
    let messages = [...appState.messages];

    if (sortMode === 'urgent') {
      messages.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));
    } else if (sortMode === 'mentions') {
      messages.sort((a, b) => {
        if (a.isMention && !b.isMention) return -1;
        if (!a.isMention && b.isMention) return 1;
        return (b.urgencyScore || 0) - (a.urgencyScore || 0);
      });
    }

    if (countEl) countEl.textContent = messages.length;
    container.innerHTML = '';

    if (messages.length === 0) {
      container.innerHTML = '<div style="text-align:center; color:var(--text-dim); padding:2rem 1rem; font-size:0.84rem;">No messages loaded yet. Select a scenario or paste a chat.</div>';
      return;
    }

    const pillConfig = {
      important: { label: '🔴 Important', bg: 'rgba(244,63,94,0.18)', color: '#f87171', border: 'rgba(244,63,94,0.35)' },
      later:     { label: '🟡 Read Later', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.35)' },
      trash:     { label: '🗑️ Noise',     bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' }
    };

    messages.forEach(msg => {
      const pill = pillConfig[msg.category] || pillConfig.later;
      const bubble = document.createElement('div');
      bubble.className = 'raw-msg-bubble' +
        (msg.isDirectMention ? ' is-mention' : '') +
        (msg.category === 'important' && !msg.isDirectMention ? ' is-urgent' : '');

      bubble.innerHTML = `
        <span class="raw-msg-avatar">${escapeHTML(msg.avatar || '\ud83d\udcac')}</span>
        <div class="raw-msg-body">
          <div class="raw-msg-meta">
            <span class="raw-msg-sender">${escapeHTML(msg.sender || 'Unknown')}</span>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="raw-msg-time">${escapeHTML(msg.time || '')}</span>
              <span class="raw-msg-triage-pill"
                    title="Triage bucket"
                    style="background:${pill.bg}; color:${pill.color}; border:1px solid ${pill.border};">
                ${pill.label}
              </span>
              ${msg.isMention ? '<span class="mention-pill" style="font-size:0.66rem;">@You</span>' : ''}
            </div>
          </div>
          <div class="raw-msg-text">${escapeHTML(msg.content || '')}</div>
        </div>
      `;
      container.appendChild(bubble);
    });
  }

  /**
   * Renders avatar (either image tag for data-url, or emoji text)
   */
  function renderAvatarElement(container, avatarVal) {
    if (!avatarVal) avatarVal = '👨‍💻';
    if (avatarVal.startsWith('data:image') || avatarVal.startsWith('http')) {
      container.innerHTML = `<img src="${avatarVal}" class="profile-avatar-img" alt="Avatar">`;
    } else {
      container.textContent = avatarVal;
    }
  }

  /**
   * Show/Hide Auth Modal
   */
  function showAuthModal() {
    if (authModal) authModal.classList.remove('hidden');
  }

  function hideAuthModal() {
    if (authModal) authModal.classList.add('hidden');
  }

  /**
   * Load Workspace for Current Logged-in User
   */
  function loadWorkspaceForUser() {
    const storageKey = WORKSPACE_KEY_PREFIX + currentUser.usn;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        appState = { ...appState, ...parsed };
        presetSelect.value = appState.currentPresetId || 'hackathon';
        renderAll();
        showToast(`Welcome back, ${currentUser.name}! (${currentUser.usn})`, 'success');
        return;
      } catch (e) {
        console.error('Failed to parse workspace state for user', e);
      }
    }

    // Default load preset for new session
    loadPreset(presetSelect.value || 'hackathon', false);
    showToast(`Logged in as ${currentUser.name} (${currentUser.usn})`, 'success');
  }

  /**
   * Get user identifiers to feed into NLP mention detector
   */
  function getUserIdentifiers() {
    return {
      usn: currentUser.usn,
      name: currentUser.name,
      handle: userHandleInput ? userHandleInput.value.trim() : (currentUser.name.split(' ')[0])
    };
  }

  /**
   * Load a preset scenario and run local NLP engine
   */
  function loadPreset(presetId, showNotification = true) {
    const dataset = window.PRESET_DATASETS[presetId];
    if (!dataset) return;

    appState.currentPresetId = presetId;
    appState.userHandle = (currentUser.name ? currentUser.name.split(' ')[0] : currentUser.usn).toLowerCase();

    // Process using Local NLP Engine with multi-identifier aliases (Name, USN, handle)
    const identifiers = getUserIdentifiers();
    const processed = window.LocalNLPEngine.processChat(dataset.messages, identifiers);

    appState.messages = processed.messages;
    appState.deadlines = processed.deadlines;
    appState.tasks = processed.tasks;
    appState.decisions = processed.decisions;
    appState.summary = processed.summary;
    appState.lastSaved = new Date().toLocaleTimeString();

    renderAll();
    saveToLocalStorage(false);
    if (showNotification) {
      showToast(`Loaded "${dataset.name}" scenario`, 'success');
    }
  }

  /**
   * Save State to HTML5 LocalStorage under user's USN
   */
  function saveToLocalStorage(showFeedback = true) {
    const storageKey = WORKSPACE_KEY_PREFIX + currentUser.usn;
    appState.summary.overview = summaryTextarea.value;
    appState.lastSaved = new Date().toLocaleTimeString();

    const serializable = {
      currentPresetId: appState.currentPresetId,
      userHandle: userHandleInput.value.trim() || currentUser.usn,
      messages: appState.messages,
      deadlines: appState.deadlines,
      tasks: appState.tasks,
      decisions: appState.decisions,
      summary: appState.summary,
      lastSaved: appState.lastSaved
    };

    localStorage.setItem(storageKey, JSON.stringify(serializable));
    lastSavedIndicator.textContent = `Saved locally at ${appState.lastSaved}`;

    if (showFeedback) {
      showToast('All changes & edits saved to local storage!', 'success');
    }
  }

  /**
   * Render everything
   */
  function renderAll() {
    renderMetrics();
    renderSummary();
    renderDeadlinesAndTasks();
    renderMessageLists();
    updateFilterChipCounts();
    renderWelcomeBanner();
    renderRawChatStream();
  }

  /**
   * Render Top Metrics
   */
  function renderMetrics() {
    const importantMsgs = appState.messages.filter(m => m.category === 'important');
    const mentionsMsgs = appState.messages.filter(m => m.isMention);
    const trashMsgs = appState.messages.filter(m => m.category === 'trash');

    metricUrgentCount.textContent = importantMsgs.length;
    metricMentionCount.textContent = mentionsMsgs.length;
    metricDeadlineCount.textContent = appState.deadlines.length;

    const noisePercent = appState.messages.length > 0
      ? Math.round((trashMsgs.length / appState.messages.length) * 100)
      : 0;
    metricNoisePercent.textContent = `${noisePercent}%`;

    const minsSaved = Math.max(1, Math.round(appState.messages.length * 0.8));
    metricTimeSaved.textContent = minsSaved;
  }

  /**
   * Render Executive Brief
   */
  function renderSummary() {
    summaryTextarea.value = appState.summary.overview || '';

    summaryHighlightsList.innerHTML = '';
    if (appState.summary.highlights && appState.summary.highlights.length > 0) {
      appState.summary.highlights.forEach(h => {
        const item = document.createElement('div');
        item.style.fontSize = '0.78rem';
        item.style.color = '#c7d2fe';
        item.style.background = 'rgba(99, 102, 241, 0.08)';
        item.style.padding = '0.3rem 0.5rem';
        item.style.borderRadius = 'var(--radius-sm)';
        item.style.border = '1px solid rgba(99, 102, 241, 0.2)';
        item.textContent = h;
        summaryHighlightsList.appendChild(item);
      });
    }
  }

  /**
   * Render Deadlines and Action Items
   */
  function renderDeadlinesAndTasks() {
    // Deadlines
    deadlinesList.innerHTML = '';
    deadlinesCountBadge.textContent = appState.deadlines.length;

    if (appState.deadlines.length === 0) {
      deadlinesList.innerHTML = '<div style="font-size: 0.78rem; color: var(--text-dim); padding: 0.5rem 0;">No upcoming deadlines identified.</div>';
    } else {
      appState.deadlines.forEach(dl => {
        const item = document.createElement('div');
        item.className = 'deadline-item';
        item.innerHTML = `
          <div class="deadline-text">
            <span>⏰</span>
            <span>${escapeHTML(dl.text)}</span>
            <span style="font-size: 0.72rem; color: var(--text-dim); font-weight: normal;">(${escapeHTML(dl.sender)})</span>
          </div>
          <button class="btn-text-action" title="Jump to source message" data-jump-msg="${dl.messageId}">View ➔</button>
        `;
        deadlinesList.appendChild(item);
      });
    }

    // Tasks Checklist
    tasksList.innerHTML = '';
    const userTasks = appState.tasks.filter(t => t.assignedToUser);
    userTaskCount.textContent = userTasks.length;

    if (appState.tasks.length === 0) {
      tasksList.innerHTML = '<div style="font-size: 0.78rem; color: var(--text-dim); padding: 0.5rem 0;">No action items detected.</div>';
    } else {
      appState.tasks.forEach(t => {
        const item = document.createElement('div');
        item.className = `task-item ${t.completed ? 'completed' : ''}`;
        item.innerHTML = `
          <input type="checkbox" class="task-checkbox" data-task-id="${t.id}" ${t.completed ? 'checked' : ''}>
          <span class="task-label" data-task-id="${t.id}">${escapeHTML(t.taskText)}</span>
          ${t.assignedToUser ? '<span class="task-badge-user">For You</span>' : ''}
          ${t.deadline ? `<span style="font-size: 0.68rem; color: #fde68a;">⏰ ${escapeHTML(t.deadline)}</span>` : ''}
          <button class="btn-text-action" data-delete-task="${t.id}" title="Remove task" style="font-size: 0.8rem;">×</button>
        `;
        tasksList.appendChild(item);
      });
    }
  }

  /**
   * Render Message Columns
   */
  function renderMessageLists() {
    listImportant.innerHTML = '';
    listLater.innerHTML = '';
    listTrash.innerHTML = '';

    const query = appState.searchQuery.toLowerCase().trim();
    const filter = appState.activeFilter;

    let importantCount = 0;
    let laterCount = 0;
    let trashCount = 0;

    appState.messages.forEach(msg => {
      // Check filters
      if (filter === 'important' && msg.category !== 'important') return;
      if (filter === 'later' && msg.category !== 'later') return;
      if (filter === 'trash' && msg.category !== 'trash') return;
      if (filter === 'mentions' && !msg.isMention) return;
      if (filter === 'deadlines' && (!msg.deadlines || msg.deadlines.length === 0)) return;

      // Check search query
      if (query) {
        const matchesContent = (msg.content || '').toLowerCase().includes(query);
        const matchesSender = (msg.sender || '').toLowerCase().includes(query);
        if (!matchesContent && !matchesSender) return;
      }

      // Count per column
      if (msg.category === 'important') importantCount++;
      else if (msg.category === 'later') laterCount++;
      else if (msg.category === 'trash') trashCount++;

      // Create card
      const card = createMessageCardElement(msg);

      if (msg.category === 'important') {
        listImportant.appendChild(card);
      } else if (msg.category === 'later') {
        listLater.appendChild(card);
      } else if (msg.category === 'trash') {
        listTrash.appendChild(card);
      }
    });

    badgeImportantCount.textContent = importantCount;
    badgeLaterCount.textContent = laterCount;
    badgeTrashCount.textContent = trashCount;

    // Empty state placeholders if needed
    if (listImportant.children.length === 0) {
      listImportant.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 2rem 1rem; font-size: 0.82rem;">No important messages in this view.</div>';
    }
    if (listLater.children.length === 0) {
      listLater.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 2rem 1rem; font-size: 0.82rem;">No deferred messages in this view.</div>';
    }
    if (listTrash.children.length === 0) {
      listTrash.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 2rem 1rem; font-size: 0.82rem;">Trash is empty. Clean conversation!</div>';
    }
  }

  /**
   * Creates a Message Card DOM node with all action controls
   */
  function createMessageCardElement(msg) {
    const card = document.createElement('div');
    card.className = `message-card ${msg.isMention ? 'highlight-mention' : ''} ${msg.category === 'important' ? 'highlight-urgent' : ''}`;
    card.id = `msg-card-${msg.id}`;

    // Urgency badge class
    let urgencyClass = 'urgency-low';
    if (msg.urgencyScore >= 70) urgencyClass = 'urgency-high';
    else if (msg.urgencyScore >= 35) urgencyClass = 'urgency-med';

    const deadlineBadgeHtml = msg.deadlines && msg.deadlines.length > 0
      ? `<span class="deadline-pill">⏰ ${escapeHTML(msg.deadlines[0].matchedText)}</span>`
      : '';

    const mentionBadgeHtml = msg.isMention
      ? `<span class="mention-pill">@Mentioned</span>`
      : '';

    // Entity tags
    let entityTagsHtml = '';
    if (msg.decisions && msg.decisions.length > 0) {
      entityTagsHtml += `<span class="entity-tag decision">🤝 Decision Recorded</span>`;
    }
    if (msg.tasks && msg.tasks.length > 0) {
      entityTagsHtml += `<span class="entity-tag task">⚡ Action Required</span>`;
    }

    // Move buttons based on current category
    let moveButtonsHtml = '';
    if (msg.category !== 'important') {
      moveButtonsHtml += `<button class="btn-move to-urgent" data-move-to="important" data-msg-id="${msg.id}" title="Move to Important">🔴 Urgent</button>`;
    }
    if (msg.category !== 'later') {
      moveButtonsHtml += `<button class="btn-move to-later" data-move-to="later" data-msg-id="${msg.id}" title="Move to Read Later">🟡 Later</button>`;
    }
    if (msg.category !== 'trash') {
      moveButtonsHtml += `<button class="btn-move to-trash" data-move-to="trash" data-msg-id="${msg.id}" title="Move to Trash">🗑️ Trash</button>`;
    }

    card.innerHTML = `
      <div class="message-top-row">
        <div class="sender-info">
          <span class="sender-avatar">${msg.avatar || '💬'}</span>
          <span class="sender-name">${escapeHTML(msg.sender || 'Unknown')}</span>
          <span class="msg-time">${escapeHTML(msg.time || '')}</span>
        </div>
        <div class="msg-indicators">
          <span class="urgency-pill ${urgencyClass}" title="Calculated urgency & relevance score">${msg.urgencyScore || 0}% Urgency</span>
          ${mentionBadgeHtml}
          ${deadlineBadgeHtml}
        </div>
      </div>

      <div class="message-content" id="msg-text-${msg.id}" title="Click 'Edit' below to modify text">${escapeHTML(msg.content)}</div>

      ${entityTagsHtml ? `<div class="entity-tags-row">${entityTagsHtml}</div>` : ''}

      <div class="card-actions-row">
        <div class="move-buttons-group">
          ${moveButtonsHtml}
        </div>
        <div class="card-utility-actions">
          <button class="btn-text-action" data-edit-msg="${msg.id}">✏️ Edit</button>
          <button class="btn-text-action" data-delete-msg="${msg.id}" title="Permanently delete">✕</button>
        </div>
      </div>
    `;

    return card;
  }

  /**
   * Update chip counters in toolbar
   */
  function updateFilterChipCounts() {
    chipCountAll.textContent = appState.messages.length;
    chipCountImportant.textContent = appState.messages.filter(m => m.category === 'important').length;
    chipCountLater.textContent = appState.messages.filter(m => m.category === 'later').length;
    chipCountTrash.textContent = appState.messages.filter(m => m.category === 'trash').length;
    chipCountMentions.textContent = appState.messages.filter(m => m.isMention).length;
  }

  /**
   * Profile & Authentication Events
   */
  function setupProfileAndAuthEvents() {
    // Top Right Profile Widget click -> Open Profile Modal
    if (userProfileWidget) {
      userProfileWidget.addEventListener('click', () => {
        openProfileModal();
      });
    }

    // Avatar Selection Grid in Profile Modal
    if (avatarGridList) {
      avatarGridList.addEventListener('click', (e) => {
        const btn = e.target.closest('.avatar-choice-btn');
        if (!btn) return;
        avatarGridList.querySelectorAll('.avatar-choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        modalSelectedAvatar = btn.getAttribute('data-avatar');
        renderAvatarElement(profileAvatarPreview, modalSelectedAvatar);
      });
    }

    // Custom Photo File Input (Converts local file to base64 Data URL)
    if (profilePhotoFileInput) {
      profilePhotoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (evt) {
          modalSelectedAvatar = evt.target.result;
          renderAvatarElement(profileAvatarPreview, modalSelectedAvatar);
          // Deselect emojis
          avatarGridList.querySelectorAll('.avatar-choice-btn').forEach(b => b.classList.remove('selected'));
          showToast('Custom photo loaded! Click Save to apply.', 'success');
        };
        reader.readAsDataURL(file);
      });
    }

    // Save Profile Changes Button
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener('click', () => {
        const newName = profileNameInput.value.trim() || currentUser.name;
        const newUsn = (profileUsnInput.value.trim() || currentUser.usn).toUpperCase();
        const newEmail = profileEmailInput.value.trim() || currentUser.email;

        currentUser.name = newName;
        currentUser.usn = newUsn;
        currentUser.email = newEmail;
        currentUser.avatar = modalSelectedAvatar;

        // Persist
        localStorage.setItem(SESSION_KEY, currentUser.usn);
        localStorage.setItem(PROFILE_KEY_PREFIX + currentUser.usn, JSON.stringify(currentUser));

        updateProfileHeaderWidget();
        closeModal(profileModal);

        // Re-process messages with new user name & USN aliases
        const identifiers = getUserIdentifiers();
        const processed = window.LocalNLPEngine.processChat(appState.messages, identifiers);
        appState.messages = processed.messages;
        appState.deadlines = processed.deadlines;
        appState.tasks = processed.tasks;
        appState.summary = processed.summary;

        renderAll();
        saveToLocalStorage(false);
        showToast(`Profile updated for USN: ${currentUser.usn}!`, 'success');
      });
    }

    // Profile Logout Button (Logout with just the USN)
    if (profileLogoutBtn) {
      profileLogoutBtn.addEventListener('click', () => {
        const usnLoggedOut = currentUser.usn;
        closeModal(profileModal);
        localStorage.removeItem(SESSION_KEY);
        showAuthModal();
        showToast(`Logged out from USN: ${usnLoggedOut}`, 'urgent');
      });
    }

    // Demo USN 1-Click Login Buttons
    document.querySelectorAll('[data-demo-usn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const usn = btn.getAttribute('data-demo-usn');
        const name = btn.getAttribute('data-demo-name');
        const email = btn.getAttribute('data-demo-email');
        const avatar = btn.getAttribute('data-demo-avatar');

        currentUser = {
          usn: usn,
          name: name,
          email: email,
          avatar: avatar
        };

        localStorage.setItem(SESSION_KEY, usn);
        localStorage.setItem(PROFILE_KEY_PREFIX + usn, JSON.stringify(currentUser));

        updateProfileHeaderWidget();
        hideAuthModal();
        loadWorkspaceForUser();
      });
    });

    // Custom USN Login Form Submit
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usn = (loginUsnInput.value.trim() || '').toUpperCase();
        if (!usn) {
          alert('Please enter a valid College USN');
          return;
        }

        const name = loginNameInput.value.trim() || ('Student ' + usn);
        const email = loginEmailInput.value.trim() || (`${usn.toLowerCase()}@college.edu`);

        currentUser = {
          usn: usn,
          name: name,
          email: email,
          avatar: '🎓'
        };

        localStorage.setItem(SESSION_KEY, usn);
        localStorage.setItem(PROFILE_KEY_PREFIX + usn, JSON.stringify(currentUser));

        updateProfileHeaderWidget();
        hideAuthModal();
        loadWorkspaceForUser();
      });
    }
  }

  /**
   * Open & Populate Profile Modal
   */
  function openProfileModal() {
    profileNameInput.value = currentUser.name || '';
    profileUsnInput.value = currentUser.usn || '';
    profileEmailInput.value = currentUser.email || '';
    profilePreviewName.textContent = currentUser.name || 'Student';
    profilePreviewUsn.textContent = `USN: ${currentUser.usn}`;
    modalSelectedAvatar = currentUser.avatar || '👨‍💻';

    renderAvatarElement(profileAvatarPreview, modalSelectedAvatar);

    // Highlight matching emoji button if applicable
    if (avatarGridList) {
      avatarGridList.querySelectorAll('.avatar-choice-btn').forEach(btn => {
        if (btn.getAttribute('data-avatar') === modalSelectedAvatar) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      });
    }

    openModal(profileModal);
  }

  /**
   * Setup UI Event Listeners
   */
  function setupEventListeners() {
    // Preset change
    presetSelect.addEventListener('change', (e) => {
      loadPreset(e.target.value);
    });

    // Reset current scenario
    resetPresetBtn.addEventListener('click', () => {
      if (confirm('Reset messages and clear local edits for this scenario?')) {
        loadPreset(presetSelect.value);
      }
    });

    // User handle change (re-scans mentions instantly)
    userHandleInput.addEventListener('input', () => {
      const handle = userHandleInput.value.trim();
      if (!handle) return;
      appState.userHandle = handle;
      // Re-scan with new handle
      const identifiers = getUserIdentifiers();
      const processed = window.LocalNLPEngine.processChat(appState.messages, identifiers);
      appState.messages = processed.messages;
      appState.deadlines = processed.deadlines;
      appState.tasks = processed.tasks;
      appState.summary = processed.summary;
      renderAll();
      saveToLocalStorage(false);
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value;
      renderMessageLists();
    });

    // Filter Chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        appState.activeFilter = chip.getAttribute('data-filter');
        renderMessageLists();
      });
    });

    // Save Changes Button (explicit save requested by user)
    saveChangesBtn.addEventListener('click', () => {
      saveToLocalStorage(true);
    });

    // Summary Textarea editing
    summaryTextarea.addEventListener('input', () => {
      appState.summary.overview = summaryTextarea.value;
      saveToLocalStorage(false);
    });

    // Re-summarize button
    regenerateSummaryBtn.addEventListener('click', () => {
      const summary = window.LocalNLPEngine.generateExecutiveSummary(
        appState.messages,
        currentUser.name ? currentUser.name.split(' ')[0] : currentUser.usn,
        appState.tasks,
        appState.deadlines,
        appState.decisions
      );
      appState.summary = summary;
      renderSummary();
      saveToLocalStorage(false);
      showToast('Executive TL;DR re-synthesized from current messages', 'success');
    });

    // Empty Trash
    emptyTrashBtn.addEventListener('click', () => {
      const trashCount = appState.messages.filter(m => m.category === 'trash').length;
      if (trashCount === 0) {
        showToast('Trash is already empty', 'success');
        return;
      }
      appState.messages = appState.messages.filter(m => m.category !== 'trash');
      renderAll();
      saveToLocalStorage(false);
      showToast(`Purged ${trashCount} noise message(s) from local workspace`, 'success');
    });

    // Simulate incoming message
    simulateIncomingBtn.addEventListener('click', () => {
      simulateIncomingLiveMessage();
    });

    // Export Executive Brief
    exportBriefBtn.addEventListener('click', () => {
      exportBriefingMarkdown();
    });

    // Delegated click handler for columns (move, edit, delete)
    document.querySelector('.app-main').addEventListener('click', (e) => {
      // 1. Move message button
      const moveBtn = e.target.closest('[data-move-to]');
      if (moveBtn) {
        const msgId = moveBtn.getAttribute('data-msg-id');
        const targetCategory = moveBtn.getAttribute('data-move-to');
        moveMessageToCategory(msgId, targetCategory);
        return;
      }

      // 2. Edit message text
      const editBtn = e.target.closest('[data-edit-msg]');
      if (editBtn) {
        const msgId = editBtn.getAttribute('data-edit-msg');
        promptEditMessage(msgId);
        return;
      }

      // 3. Delete message
      const delBtn = e.target.closest('[data-delete-msg]');
      if (delBtn) {
        const msgId = delBtn.getAttribute('data-delete-msg');
        deleteMessage(msgId);
        return;
      }

      // 4. Task checkbox toggle
      if (e.target.classList.contains('task-checkbox')) {
        const taskId = e.target.getAttribute('data-task-id');
        toggleTask(taskId, e.target.checked);
        return;
      }

      // 5. Delete task
      const delTaskBtn = e.target.closest('[data-delete-task]');
      if (delTaskBtn) {
        const taskId = delTaskBtn.getAttribute('data-delete-task');
        deleteTask(taskId);
        return;
      }

      // 6. Jump to message from deadline
      const jumpBtn = e.target.closest('[data-jump-msg]');
      if (jumpBtn) {
        const msgId = jumpBtn.getAttribute('data-jump-msg');
        jumpToMessage(msgId);
        return;
      }
    });

    // Modals handling
    openImportModalBtn.addEventListener('click', () => openModal(importModal));
    privacyAuditBtn.addEventListener('click', () => {
      updatePrivacyStorageEstimate();
      openModal(privacyModal);
    });
    quickAddTaskBtn.addEventListener('click', () => openModal(addTaskModal));

    // Close buttons for modals
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        closeModal(document.getElementById(modalId));
      });
    });

    // Click backdrop to close
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal(backdrop);
      });
    });

    // Raw Chat Stream: collapse/expand toggle
    const rawChatToggleBtn = document.getElementById('rawChatToggleBtn');
    const rawChatStream    = document.getElementById('rawChatStream');
    if (rawChatToggleBtn && rawChatStream) {
      rawChatToggleBtn.addEventListener('click', () => {
        const collapsed = rawChatStream.classList.toggle('collapsed');
        rawChatToggleBtn.textContent = collapsed ? '▼ Expand' : '▲ Collapse';
      });
    }

    // Raw Chat Stream: sort selection
    const rawChatSortSelect = document.getElementById('rawChatSortSelect');
    if (rawChatSortSelect) {
      rawChatSortSelect.addEventListener('change', () => renderRawChatStream());
    }

    // Import Execution
    executeImportBtn.addEventListener('click', () => {
      const text = pasteChatTextarea.value.trim();
      if (!text) {
        alert('Please paste chat messages first.');
        return;
      }
      processImportedText(text);
      closeModal(importModal);
      pasteChatTextarea.value = '';
    });

    // Add Task Confirmation
    confirmAddTaskBtn.addEventListener('click', () => {
      const taskText = newTaskInput.value.trim();
      if (!taskText) return;
      const assignee = newTaskAssignee.value.trim() || currentUser.name || currentUser.usn;
      const deadline = newTaskDeadline.value.trim() || null;

      const newTask = {
        id: `task-custom-${Date.now()}`,
        messageId: null,
        sender: 'Manual Entry',
        taskText: taskText,
        completed: false,
        assignedToUser: assignee.toLowerCase().includes(currentUser.name.toLowerCase()) || assignee.toLowerCase().includes(currentUser.usn.toLowerCase()),
        priority: 'Normal',
        deadline: deadline
      };

      appState.tasks.unshift(newTask);
      renderDeadlinesAndTasks();
      saveToLocalStorage(true);
      closeModal(addTaskModal);
      newTaskInput.value = '';
      newTaskDeadline.value = '';
      showToast('Custom action item added!', 'success');
    });

    // Clear Storage button
    clearStorageBtn.addEventListener('click', () => {
      if (confirm('Erase all cached messages and summaries from this browser?')) {
        localStorage.clear();
        loadPreset('hackathon');
        closeModal(privacyModal);
        showToast('Local browser storage wiped clean.', 'urgent');
      }
    });
  }

  /**
   * Move a message between Important, Later, and Trash
   */
  function moveMessageToCategory(msgId, targetCategory) {
    const msg = appState.messages.find(m => m.id === msgId);
    if (!msg) return;

    msg.category = targetCategory;

    // Recalculate summary & stats
    const identifiers = getUserIdentifiers();
    const processed = window.LocalNLPEngine.processChat(appState.messages, identifiers);
    appState.summary = processed.summary;

    renderAll();
    saveToLocalStorage(false);

    const labels = {
      important: '🔴 Important (Action Required)',
      later: '🟡 Not Required Now (Read Later)',
      trash: '🗑️ Trash'
    };
    showToast(`Moved message to ${labels[targetCategory]}`, 'success');
  }

  /**
   * Inline Edit Message Content
   */
  function promptEditMessage(msgId) {
    const msg = appState.messages.find(m => m.id === msgId);
    if (!msg) return;

    const newContent = prompt('Edit message content:', msg.content);
    if (newContent !== null && newContent.trim() !== '') {
      msg.content = newContent.trim();

      // Re-run single message analysis
      const identifiers = getUserIdentifiers();
      const updatedMsg = window.LocalNLPEngine.analyzeSingleMessage(msg, identifiers);
      Object.assign(msg, updatedMsg);

      // Re-sync full pipeline
      const processed = window.LocalNLPEngine.processChat(appState.messages, identifiers);
      appState.deadlines = processed.deadlines;
      appState.tasks = processed.tasks;
      appState.decisions = processed.decisions;
      appState.summary = processed.summary;

      renderAll();
      saveToLocalStorage(true);
      showToast('Message text edited & priorities updated locally!', 'success');
    }
  }

  /**
   * Delete message
   */
  function deleteMessage(msgId) {
    appState.messages = appState.messages.filter(m => m.id !== msgId);
    appState.deadlines = appState.deadlines.filter(d => d.messageId !== msgId);
    appState.tasks = appState.tasks.filter(t => t.messageId !== msgId);

    renderAll();
    saveToLocalStorage(false);
    showToast('Message removed from workspace', 'urgent');
  }

  /**
   * Toggle Task
   */
  function toggleTask(taskId, isChecked) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = isChecked;
      renderDeadlinesAndTasks();
      saveToLocalStorage(false);
      showToast(isChecked ? 'Task marked as completed! 🎉' : 'Task reopened', 'success');
    }
  }

  /**
   * Delete Task
   */
  function deleteTask(taskId) {
    appState.tasks = appState.tasks.filter(t => t.id !== taskId);
    renderDeadlinesAndTasks();
    saveToLocalStorage(false);
  }

  /**
   * Jump to card
   */
  function jumpToMessage(msgId) {
    const card = document.getElementById(`msg-card-${msgId}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.outline = '3px solid #f59e0b';
      setTimeout(() => {
        card.style.outline = '';
      }, 2000);
    } else {
      // Reset filter to 'all'
      appState.activeFilter = 'all';
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      document.querySelector('[data-filter="all"]').classList.add('active');
      renderMessageLists();
      setTimeout(() => {
        const c = document.getElementById(`msg-card-${msgId}`);
        if (c) {
          c.scrollIntoView({ behavior: 'smooth', block: 'center' });
          c.style.outline = '3px solid #f59e0b';
          setTimeout(() => { c.style.outline = ''; }, 2000);
        }
      }, 100);
    }
  }

  /**
   * Process Imported raw text
   */
  function processImportedText(text) {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    const newMessages = [];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    lines.forEach((line, index) => {
      let sender = 'Colleague';
      let content = line;
      let time = timeStr;

      const standardMatch = line.match(/^\[?(.*?[ap]m|\d{1,2}:\d{2})\]?\s*([^:]+):\s*(.+)$/i);
      if (standardMatch) {
        time = standardMatch[1].trim();
        sender = standardMatch[2].trim();
        content = standardMatch[3].trim();
      } else {
        const simpleMatch = line.match(/^([^:]+):\s*(.+)$/);
        if (simpleMatch) {
          sender = simpleMatch[1].trim();
          content = simpleMatch[2].trim();
        }
      }

      newMessages.push({
        id: `import-${Date.now()}-${index}`,
        sender: sender,
        time: time,
        content: content,
        avatar: getAvatarForSender(sender)
      });
    });

    if (newMessages.length === 0) return;

    appState.messages = newMessages;
    const identifiers = getUserIdentifiers();
    const processed = window.LocalNLPEngine.processChat(newMessages, identifiers);
    appState.messages = processed.messages;
    appState.deadlines = processed.deadlines;
    appState.tasks = processed.tasks;
    appState.decisions = processed.decisions;
    appState.summary = processed.summary;

    renderAll();
    saveToLocalStorage(true);
    showToast(`Successfully analyzed ${newMessages.length} imported messages locally!`, 'success');
  }

  /**
   * Live Simulation of Incoming Message
   */
  let simIndex = 0;
  function simulateIncomingLiveMessage() {
    const namePrefix = currentUser.name ? currentUser.name.split(' ')[0] : currentUser.usn;
    const simulatedFeed = [
      {
        sender: 'Kavita (DevOps)',
        content: `🚨 ALERT: Memory leak detected in container pod #4. @${namePrefix} (USN: ${currentUser.usn}) please inspect before 3:30 PM!`,
        avatar: '👩‍💻'
      },
      {
        sender: 'Dev (Frontend)',
        content: 'Has anyone seen the office dog today? So cute! 🐶',
        avatar: '🧑'
      },
      {
        sender: 'Ananya (PM)',
        content: 'DECISION: We are postponing the beta rollout until tomorrow 9:00 AM.',
        avatar: '👩‍💼'
      },
      {
        sender: 'Sameer (Design)',
        content: 'Quick coffee break if anyone wants to join downstairs ☕',
        avatar: '🎨'
      },
      {
        sender: 'Aarav (Lead Org)',
        content: `URGENT: @${currentUser.usn} the API keys for the submission portal need immediate rotation before 5:00 PM!`,
        avatar: '👨‍💻'
      }
    ];

    const raw = simulatedFeed[simIndex % simulatedFeed.length];
    simIndex++;

    const newMsg = {
      id: `live-${Date.now()}`,
      sender: raw.sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: raw.content,
      avatar: raw.avatar
    };

    appState.messages.unshift(newMsg);

    // Re-run pipeline
    const identifiers = getUserIdentifiers();
    const processed = window.LocalNLPEngine.processChat(appState.messages, identifiers);
    appState.messages = processed.messages;
    appState.deadlines = processed.deadlines;
    appState.tasks = processed.tasks;
    appState.decisions = processed.decisions;
    appState.summary = processed.summary;

    renderAll();
    saveToLocalStorage(false);

    const analyzed = appState.messages.find(m => m.id === newMsg.id);
    const categoryName = analyzed ? analyzed.category.toUpperCase() : 'TRIAGED';
    showToast(`New live message received & classified into [${categoryName}]`, 'success');
  }

  /**
   * Export Executive Brief as Markdown file
   */
  function exportBriefingMarkdown() {
    let md = `# PROTOCOL-X: Executive Triage Report\n`;
    md += `Generated: ${new Date().toLocaleString()} (100% Local On-Device AI)\n`;
    md += `Student: ${currentUser.name} | USN: ${currentUser.usn} | Email: ${currentUser.email}\n\n`;

    md += `## ⚡ Executive TL;DR\n`;
    md += `${appState.summary.overview || 'No overview available.'}\n\n`;

    if (appState.deadlines.length > 0) {
      md += `## ⏰ Detected Deadlines & Cutoffs\n`;
      appState.deadlines.forEach(dl => {
        md += `- **${dl.text}** (${dl.sender}): "${dl.context}"\n`;
      });
      md += `\n`;
    }

    if (appState.tasks.length > 0) {
      md += `## ✅ Action Items & Tasks\n`;
      appState.tasks.forEach(t => {
        const check = t.completed ? '[x]' : '[ ]';
        const target = t.assignedToUser ? '**(Assigned to You)**' : '';
        md += `- ${check} ${t.taskText} ${target}\n`;
      });
      md += `\n`;
    }

    md += `## 🔴 High-Priority / Important Messages\n`;
    const important = appState.messages.filter(m => m.category === 'important');
    if (important.length === 0) {
      md += `*None.*\n`;
    } else {
      important.forEach(m => {
        md += `### [${m.time}] ${m.sender} (Urgency: ${m.urgencyScore}%)\n`;
        md += `> ${m.content}\n\n`;
      });
    }

    md += `## 🟡 Not Required Now (Read Later)\n`;
    const later = appState.messages.filter(m => m.category === 'later');
    later.forEach(m => {
      md += `- [${m.time}] **${m.sender}**: ${m.content}\n`;
    });
    md += `\n`;

    md += `## 🗑️ Filtered Out Noise (${appState.messages.filter(m => m.category === 'trash').length} items)\n`;
    md += `*Casual chit-chat, greetings, coffee runs filtered to preserve attention.*\n`;

    // Download blob
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Executive_Briefing_${currentUser.usn}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Executive report downloaded as Markdown!', 'success');
  }

  /**
   * Helper: update storage estimation
   */
  function updatePrivacyStorageEstimate() {
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const val = localStorage.getItem(key);
      totalBytes += new Blob([key, val]).size;
    }
    const kb = (totalBytes / 1024).toFixed(1);
    privacyStorageSize.textContent = `${kb} KB (${totalBytes} bytes)`;
  }

  /**
   * Modal controls
   */
  function openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  /**
   * Toast notification
   */
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'urgent' ? '⚠️' : '✅';
    toast.innerHTML = `<span>${icon}</span><span>${escapeHTML(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  }

  function getAvatarForSender(sender) {
    const s = sender.toLowerCase();
    if (s.includes('lead') || s.includes('aarav') || s.includes('alex')) return '👨‍💻';
    if (s.includes('design') || s.includes('sneha')) return '👩‍🎨';
    if (s.includes('sponsor') || s.includes('pooja')) return '💼';
    if (s.includes('sre') || s.includes('devops') || s.includes('david')) return '🛠️';
    if (s.includes('product') || s.includes('pm')) return '📊';
    if (s.includes('bot') || s.includes('alert')) return '🤖';
    return '💬';
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Launch on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
