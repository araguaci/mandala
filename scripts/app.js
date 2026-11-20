import {
  COLLECTIONS,
  GRABOVOI_CODES,
  SOLFEGGIO_FREQUENCIES,
  SPEED_PRESETS,
  getCollectionImages
} from './catalog.js';
import { SolfeggioEngine } from './audio.js';

const STORAGE_KEY = 'mandala_v2_prefs';

const DEFAULT_STATE = {
  collection: 'mandala',
  speedMs: 1500,
  fitContain: false,
  shuffle: false,
  breathing: true,
  rotating: false,
  showCodes: true,
  intention: '',
  codeIntervalMs: 4000,
  frequency: 639,
  volume: 0.3,
  syncFreqWithCollection: true,
  timerMinutes: 0
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : { ...DEFAULT_STATE };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function savePrefs(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable
  }
}

class MandalaApp {
  constructor() {
    this.state = loadPrefs();
    this.audio = new SolfeggioEngine();
    this.images = [];
    this.currentIndex = 0;
    this.activeLayer = 0;
    this.isPlaying = true;
    this.isZen = false;
    this.isDrawerOpen = false;
    this.slideTimer = null;
    this.codeTimer = null;
    this.idleTimer = null;
    this.sessionInterval = null;
    this.sessionSecondsLeft = 0;
    this.preloaded = new Set();
    this.deferredInstallPrompt = null;

    this._applyUrlShortcuts();

    this.el = {
      stage: document.getElementById('stage'),
      layers: [
        document.getElementById('layer-a'),
        document.getElementById('layer-b')
      ],
      intentionOverlay: document.getElementById('intention-overlay'),
      intentionText: document.getElementById('intention-text'),
      codeDisplay: document.getElementById('code-display'),
      timerBadge: document.getElementById('timer-badge'),
      toast: document.getElementById('toast'),
      // Dock buttons
      btnPrev: document.getElementById('btn-prev'),
      btnPlay: document.getElementById('btn-play'),
      btnNext: document.getElementById('btn-next'),
      btnAudio: document.getElementById('btn-audio'),
      audioLabel: document.getElementById('audio-freq-label'),
      btnZen: document.getElementById('btn-zen'),
      btnFullscreen: document.getElementById('btn-fullscreen'),
      btnInstallDock: document.getElementById('btn-install-dock'),
      btnInstallDrawer: document.getElementById('btn-install-drawer'),
      pwaInstallSection: document.getElementById('pwa-install-section'),
      btnSettings: document.getElementById('btn-settings'),
      // Drawer
      drawer: document.getElementById('drawer'),
      drawerBackdrop: document.getElementById('drawer-backdrop'),
      btnCloseDrawer: document.getElementById('btn-close-drawer'),
      collectionGrid: document.getElementById('collection-grid'),
      speedSlider: document.getElementById('speed-slider'),
      speedValue: document.getElementById('speed-value'),
      speedPresets: document.getElementById('speed-presets'),
      freqGrid: document.getElementById('freq-grid'),
      volumeSlider: document.getElementById('volume-slider'),
      volumeValue: document.getElementById('volume-value'),
      timerGrid: document.getElementById('timer-grid'),
      intentionInput: document.getElementById('intention-input'),
      chkCodes: document.getElementById('chk-codes'),
      chkFit: document.getElementById('chk-fit'),
      chkShuffle: document.getElementById('chk-shuffle'),
      chkBreathing: document.getElementById('chk-breathing'),
      chkRotating: document.getElementById('chk-rotating'),
      chkSyncFreq: document.getElementById('chk-sync-freq')
    };

    this._buildDynamicControls();
    this._bindEvents();
    this._applyStateToUI();
    this._loadCollection(this.state.collection);
    this._startSlideshow();
    this._startCodes();
    this._resetIdleTimer();
    this._setupPwaInstall();
    this._registerServiceWorker();
    if (this._startInZen) this.toggleZen(true);
  }

  _applyUrlShortcuts() {
    const params = new URLSearchParams(window.location.search);
    const col = params.get('collection');
    if (col && (col === 'all' || COLLECTIONS[col])) {
      this.state.collection = col;
    }
    const freq = Number(params.get('freq'));
    if (SOLFEGGIO_FREQUENCIES.some((f) => f.hz === freq)) {
      this.state.frequency = freq;
    }
    if (params.get('zen') === '1') {
      this._startInZen = true;
    }
  }

  _setupPwaInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (this.el.btnInstallDock) this.el.btnInstallDock.hidden = false;
      if (this.el.pwaInstallSection) this.el.pwaInstallSection.hidden = false;
    });

    const triggerInstall = async () => {
      if (!this.deferredInstallPrompt) return;
      this.deferredInstallPrompt.prompt();
      const { outcome } = await this.deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        this.showToast('Mandala instalado com sucesso');
      }
      this.deferredInstallPrompt = null;
      if (this.el.btnInstallDock) this.el.btnInstallDock.hidden = true;
      if (this.el.pwaInstallSection) this.el.pwaInstallSection.hidden = true;
    };

    this.el.btnInstallDock?.addEventListener('click', triggerInstall);
    this.el.btnInstallDrawer?.addEventListener('click', triggerInstall);

    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      if (this.el.btnInstallDock) this.el.btnInstallDock.hidden = true;
      if (this.el.pwaInstallSection) this.el.pwaInstallSection.hidden = true;
    });

    window.addEventListener('offline', () => this.showToast('Modo offline ativo'));
    window.addEventListener('online', () => this.showToast('Conexão restabelecida'));
  }

  _buildDynamicControls() {
    // Coleções
    const colItems = [
      ...Object.values(COLLECTIONS),
      {
        id: 'all',
        label: 'Todas',
        subtitle: '164 imagens',
        defaultFreq: 963
      }
    ];
    this.el.collectionGrid.innerHTML = colItems
      .map(
        (c) => `
      <button type="button" class="chip" data-collection="${c.id}">
        <span class="chip-title">${c.label}</span>
        <span class="chip-sub">${c.subtitle}</span>
      </button>`
      )
      .join('');

    // Presets de velocidade
    this.el.speedPresets.innerHTML = SPEED_PRESETS.map(
      (p) => `
      <button type="button" class="chip compact" data-speed="${p.ms}">
        <span class="chip-title">${p.label}</span>
        <span class="chip-sub">${p.ms >= 1000 ? p.ms / 1000 + 's' : p.ms + 'ms'}</span>
      </button>`
    ).join('');

    // Frequências Solfeggio
    this.el.freqGrid.innerHTML = SOLFEGGIO_FREQUENCIES.map(
      (f) => `
      <button type="button" class="chip" data-freq="${f.hz}">
        <span class="chip-title">${f.name}</span>
        <span class="chip-sub">${f.label}</span>
      </button>`
    ).join('');

    // Timer presets
    const timers = [
      { min: 0, label: 'Livre' },
      { min: 5, label: '5 min' },
      { min: 10, label: '10 min' },
      { min: 15, label: '15 min' },
      { min: 20, label: '20 min' },
      { min: 30, label: '30 min' }
    ];
    this.el.timerGrid.innerHTML = timers
      .map(
        (t) => `
      <button type="button" class="chip compact" data-timer="${t.min}">
        <span class="chip-title">${t.label}</span>
      </button>`
      )
      .join('');
  }

  _bindEvents() {
    // Dock
    this.el.btnPlay.addEventListener('click', () => this.togglePlay());
    this.el.btnPrev.addEventListener('click', () => this.step(-1));
    this.el.btnNext.addEventListener('click', () => this.step(1));
    this.el.btnAudio.addEventListener('click', () => this.toggleAudio());
    this.el.btnZen.addEventListener('click', () => this.toggleZen());
    this.el.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    this.el.btnSettings.addEventListener('click', () => this.setDrawer(true));
    this.el.btnCloseDrawer.addEventListener('click', () => this.setDrawer(false));
    this.el.drawerBackdrop.addEventListener('click', () => this.setDrawer(false));

    // Clique no palco sai do modo Zen
    this.el.stage.addEventListener('click', () => {
      if (this.isZen) this.toggleZen(false);
    });

    // Coleções
    this.el.collectionGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-collection]');
      if (!btn) return;
      const id = btn.dataset.collection;
      this.state.collection = id;
      if (this.state.syncFreqWithCollection) {
        const defaultFreq = id === 'all' ? 963 : COLLECTIONS[id]?.defaultFreq || 639;
        this._setFrequency(defaultFreq);
      }
      this._loadCollection(id);
      this._persistAndSync();
    });

    // Velocidade
    this.el.speedSlider.addEventListener('input', (e) => {
      this.state.speedMs = Number(e.target.value);
      this._updateSpeedUI();
      this._startSlideshow();
      savePrefs(this.state);
    });

    this.el.speedPresets.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-speed]');
      if (!btn) return;
      this.state.speedMs = Number(btn.dataset.speed);
      this._updateSpeedUI();
      this._startSlideshow();
      savePrefs(this.state);
    });

    // Frequência Solfeggio
    this.el.freqGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-freq]');
      if (!btn) return;
      this._setFrequency(Number(btn.dataset.freq));
      if (!this.audio.isPlaying) {
        this.toggleAudio(true);
      }
      this._persistAndSync();
    });

    // Volume
    this.el.volumeSlider.addEventListener('input', (e) => {
      this.state.volume = Number(e.target.value) / 100;
      this.audio.setVolume(this.state.volume);
      this.el.volumeValue.textContent = `${Math.round(this.state.volume * 100)}%`;
      savePrefs(this.state);
    });

    // Timer
    this.el.timerGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-timer]');
      if (!btn) return;
      this.setSessionTimer(Number(btn.dataset.timer));
    });

    // Intenção
    this.el.intentionInput.addEventListener('input', (e) => {
      this.state.intention = e.target.value.trim();
      this._updateIntentionOverlay();
      savePrefs(this.state);
    });

    // Checkboxes
    const bindToggle = (el, key, onChange) => {
      el.addEventListener('change', (e) => {
        this.state[key] = e.target.checked;
        onChange?.();
        savePrefs(this.state);
      });
    };

    bindToggle(this.el.chkCodes, 'showCodes', () => this._updateIntentionOverlay());
    bindToggle(this.el.chkFit, 'fitContain', () => this._applyStageClasses());
    bindToggle(this.el.chkShuffle, 'shuffle');
    bindToggle(this.el.chkBreathing, 'breathing', () => this._applyStageClasses());
    bindToggle(this.el.chkRotating, 'rotating', () => this._applyStageClasses());
    bindToggle(this.el.chkSyncFreq, 'syncFreqWithCollection');

    // Auto-hide UI por inatividade
    ['mousemove', 'pointerdown', 'touchstart', 'keydown'].forEach((evt) => {
      window.addEventListener(evt, () => this._resetIdleTimer(), { passive: true });
    });

    // Atalhos de teclado
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'ArrowRight') {
        this.step(1);
      } else if (e.code === 'ArrowLeft') {
        this.step(-1);
      } else if (e.key.toLowerCase() === 'm') {
        this.toggleAudio();
      } else if (e.key.toLowerCase() === 'f') {
        this.toggleFullscreen();
      } else if (e.key.toLowerCase() === 'h') {
        this.toggleZen();
      } else if (e.code === 'Escape') {
        if (this.isDrawerOpen) this.setDrawer(false);
        else if (this.isZen) this.toggleZen(false);
      }
    });
  }

  _applyStateToUI() {
    this.el.intentionInput.value = this.state.intention;
    this.el.chkCodes.checked = this.state.showCodes;
    this.el.chkFit.checked = this.state.fitContain;
    this.el.chkShuffle.checked = this.state.shuffle;
    this.el.chkBreathing.checked = this.state.breathing;
    this.el.chkRotating.checked = this.state.rotating;
    this.el.chkSyncFreq.checked = this.state.syncFreqWithCollection;
    this.el.volumeSlider.value = String(Math.round(this.state.volume * 100));
    this.el.volumeValue.textContent = `${Math.round(this.state.volume * 100)}%`;
    this.el.audioLabel.textContent = `${this.state.frequency} Hz`;

    this._updateSpeedUI();
    this._applyStageClasses();
    this._updateIntentionOverlay();
    this._highlightActiveChips();
  }

  _persistAndSync() {
    savePrefs(this.state);
    this._highlightActiveChips();
  }

  _highlightActiveChips() {
    this.el.collectionGrid.querySelectorAll('[data-collection]').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.collection === this.state.collection);
    });
    this.el.freqGrid.querySelectorAll('[data-freq]').forEach((el) => {
      el.classList.toggle('is-active', Number(el.dataset.freq) === this.state.frequency);
    });
    this.el.timerGrid.querySelectorAll('[data-timer]').forEach((el) => {
      el.classList.toggle('is-active', Number(el.dataset.timer) === this.state.timerMinutes);
    });
  }

  _updateSpeedUI() {
    const ms = this.state.speedMs;
    this.el.speedSlider.value = String(ms);
    this.el.speedValue.textContent = ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;

    // Ajusta suavidade do crossfade proporcionalmente à velocidade
    const fadeMs = Math.min(1200, Math.max(60, Math.round(ms * 0.55)));
    document.documentElement.style.setProperty('--transition-img', `${fadeMs}ms`);

    this.el.speedPresets.querySelectorAll('[data-speed]').forEach((el) => {
      el.classList.toggle('is-active', Number(el.dataset.speed) === ms);
    });
  }

  _applyStageClasses() {
    this.el.stage.classList.toggle('fit-contain', this.state.fitContain);
    this.el.stage.classList.toggle('is-breathing', this.state.breathing);
    this.el.stage.classList.toggle('is-rotating', this.state.rotating);
  }

  _updateIntentionOverlay() {
    this.el.intentionText.textContent = this.state.intention;
    this.el.codeDisplay.style.display = this.state.showCodes ? '' : 'none';
    const hasContent = this.state.showCodes || Boolean(this.state.intention);
    this.el.intentionOverlay.classList.toggle('is-hidden', !hasContent);
  }

  _loadCollection(collectionId) {
    this.images = getCollectionImages(collectionId);
    this.currentIndex = 0;
    this._showImage(this.images[0]);
    this._preloadAround(0);
  }

  _preloadAround(index) {
    if (!this.images.length) return;
    for (let offset = 1; offset <= 4; offset++) {
      const src = this.images[(index + offset) % this.images.length];
      if (!this.preloaded.has(src)) {
        const img = new Image();
        img.src = src;
        this.preloaded.add(src);
      }
    }
  }

  _showImage(src) {
    if (!src) return;
    const nextLayerIdx = this.activeLayer === 0 ? 1 : 0;
    const currentEl = this.el.layers[this.activeLayer];
    const nextEl = this.el.layers[nextLayerIdx];

    const reveal = () => {
      nextEl.src = src;
      nextEl.classList.add('is-active');
      currentEl.classList.remove('is-active');
      this.activeLayer = nextLayerIdx;
    };

    if (this.preloaded.has(src)) {
      reveal();
    } else {
      const loader = new Image();
      loader.onload = () => {
        this.preloaded.add(src);
        reveal();
      };
      loader.src = src;
    }
  }

  step(delta = 1) {
    if (!this.images.length) return;
    if (this.state.shuffle && delta > 0) {
      let next = Math.floor(Math.random() * this.images.length);
      if (next === this.currentIndex && this.images.length > 1) {
        next = (next + 1) % this.images.length;
      }
      this.currentIndex = next;
    } else {
      this.currentIndex = (this.currentIndex + delta + this.images.length) % this.images.length;
    }
    this._showImage(this.images[this.currentIndex]);
    this._preloadAround(this.currentIndex);
  }

  _startSlideshow() {
    clearInterval(this.slideTimer);
    if (!this.isPlaying) return;
    this.slideTimer = setInterval(() => this.step(1), this.state.speedMs);
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    this.el.btnPlay.classList.toggle('is-active', !this.isPlaying);
    this.el.btnPlay.setAttribute('aria-label', this.isPlaying ? 'Pausar' : 'Reproduzir');
    this.el.btnPlay.innerHTML = this.isPlaying
      ? '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
      : '<svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"/></svg>';

    if (this.isPlaying) this._startSlideshow();
    else clearInterval(this.slideTimer);
  }

  _setFrequency(hz) {
    this.state.frequency = hz;
    this.el.audioLabel.textContent = `${hz} Hz`;
    this.audio.setFrequency(hz);
  }

  toggleAudio(forceState) {
    const shouldPlay = typeof forceState === 'boolean' ? forceState : !this.audio.isPlaying;
    if (shouldPlay) {
      this.audio.start(this.state.frequency, this.state.volume);
      this.el.btnAudio.classList.add('is-active');
      this.showToast(`Solfeggio ${this.state.frequency} Hz ativado`);
    } else {
      this.audio.stop();
      this.el.btnAudio.classList.remove('is-active');
    }
  }

  _startCodes() {
    clearInterval(this.codeTimer);
    let idx = 0;
    this.el.codeDisplay.textContent = GRABOVOI_CODES[0];

    this.codeTimer = setInterval(() => {
      if (!this.state.showCodes) return;
      idx = Math.floor(Math.random() * GRABOVOI_CODES.length);
      this.el.codeDisplay.classList.add('is-fading');
      setTimeout(() => {
        this.el.codeDisplay.textContent = GRABOVOI_CODES[idx];
        this.el.codeDisplay.classList.remove('is-fading');
      }, 280);
    }, this.state.codeIntervalMs);
  }

  setSessionTimer(minutes) {
    clearInterval(this.sessionInterval);
    this.state.timerMinutes = minutes;
    this._persistAndSync();

    if (minutes <= 0) {
      this.sessionSecondsLeft = 0;
      this.el.timerBadge.hidden = true;
      return;
    }

    this.sessionSecondsLeft = minutes * 60;
    this.el.timerBadge.hidden = false;
    this._renderTimer();
    this.showToast(`Sessão de ${minutes} min iniciada`);

    this.sessionInterval = setInterval(() => {
      this.sessionSecondsLeft--;
      if (this.sessionSecondsLeft <= 0) {
        clearInterval(this.sessionInterval);
        this.el.timerBadge.hidden = true;
        this.state.timerMinutes = 0;
        this._highlightActiveChips();
        this.audio.playBell();
        if (this.audio.isPlaying) this.toggleAudio(false);
        this.showToast('Sessão concluída — Namastê');
      } else {
        this._renderTimer();
      }
    }, 1000);
  }

  _renderTimer() {
    const m = Math.floor(this.sessionSecondsLeft / 60);
    const s = this.sessionSecondsLeft % 60;
    this.el.timerBadge.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  toggleZen(forceState) {
    this.isZen = typeof forceState === 'boolean' ? forceState : !this.isZen;
    document.body.classList.toggle('zen-mode', this.isZen);
    if (this.isZen) {
      this.setDrawer(false);
      this.showToast('Modo Zen — clique ou pressione H para sair');
    }
  }

  setDrawer(open) {
    this.isDrawerOpen = open;
    this.el.drawer.classList.toggle('is-open', open);
    this.el.drawerBackdrop.classList.toggle('is-open', open);
    if (open) document.body.classList.remove('ui-idle');
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  _resetIdleTimer() {
    document.body.classList.remove('ui-idle');
    clearTimeout(this.idleTimer);
    if (this.isDrawerOpen) return;
    this.idleTimer = setTimeout(() => {
      if (!this.isDrawerOpen) {
        document.body.classList.add('ui-idle');
      }
    }, 3500);
  }

  showToast(message) {
    this.el.toast.textContent = message;
    this.el.toast.classList.add('is-visible');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.el.toast.classList.remove('is-visible');
    }, 2400);
  }

  _registerServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MandalaApp();
});
