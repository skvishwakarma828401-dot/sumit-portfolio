/**
 * Futuristic Robot HUD, AI Assistant & Micro-Interaction Engine
 * Sumit Kumar — Full Stack & WebGL Engineer
 */

// ==========================================
// 1. Futuristic Loading Sequence
// ==========================================
window.addEventListener('load', () => {
  const loader = document.getElementById('nexus-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 600);
      if (window.soundFX) window.soundFX.playRobotChirp(520, 1040);
    }, 1100);
  }
});

// ==========================================
// 2. Sci-Fi Web Audio API Synthesizer
// ==========================================
class SciFiAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('robotAudioMuted') === 'true';
    this.initAudio();
  }

  initAudio() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const unlock = () => {
        if (!this.ctx) this.ctx = new AudioCtx();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        window.removeEventListener('click', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('click', unlock);
      window.addEventListener('keydown', unlock);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('robotAudioMuted', this.muted);
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.04) {
    if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playRobotChirp(f1 = 600, f2 = 900) {
    if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f1, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(f2, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playRobotScan() {
    this.playTone(420, 'triangle', 0.22, 0.03);
    setTimeout(() => this.playTone(600, 'sine', 0.18, 0.03), 80);
  }

  playKeyboardBeep() {
    const freqs = [700, 850, 950, 1100];
    const f = freqs[Math.floor(Math.random() * freqs.length)];
    this.playTone(f, 'sine', 0.04, 0.02);
  }

  playHover() {
    this.playTone(560, 'sine', 0.035, 0.015);
  }

  playClick() {
    this.playTone(880, 'triangle', 0.06, 0.03);
  }

  playModalOpen() {
    this.playRobotChirp(440, 880);
  }

  playSupercharge() {
    if (this.muted || !this.ctx) return;
    const freqs = [440, 660, 880, 1320, 1760];
    freqs.forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'sawtooth', 0.12, 0.04), idx * 60);
    });
  }

  playSuccess() {
    if (this.muted || !this.ctx) return;
    const melody = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    melody.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.2, 0.05), idx * 75);
    });
  }
}

window.soundFX = new SciFiAudioEngine();

// ==========================================
// 3. AI Assistant Dynamic Speech & Quick Commands
// ==========================================
const speechBubble = document.getElementById('ai-speech-bubble');
const speechTextEl = document.getElementById('speech-text');

const robotDialogues = {
  idle: [
    "NEXUS-AI Core active. All telemetry systems operating at 100%.",
    "Hover over elements to activate neural telemetry.",
    "Sumit specializes in full-stack MERN & WebGL 3D web applications."
  ],
  greeting: "Greetings human! I'm NEXUS-AI, Sumit's digital assistant. Welcome to his laboratory!",
  thinking: "Analyzing architecture... Processing data structures and API models 🧠",
  coding: "Compiling code... React, Node.js, Express, MongoDB active ⚡",
  working: "Running full diagnostic sweep... All services nominal!",
  success: "Transmission dispatched! Sumit has received your signal! 🚀✨",
  supercharge: "⚡ OVERCLOCKING AI REACTOR! Supercharge Protocol Engaged! ⚡"
};

let typingInterval = null;

window.updateAISpeechBubble = function(stateKey) {
  if (!speechTextEl || !speechBubble) return;

  let text = '';
  if (Array.isArray(robotDialogues[stateKey])) {
    const list = robotDialogues[stateKey];
    text = list[Math.floor(Math.random() * list.length)];
  } else {
    text = robotDialogues[stateKey] || robotDialogues.idle[0];
  }

  clearInterval(typingInterval);
  speechBubble.classList.add('active');
  speechTextEl.textContent = '';
  let charIdx = 0;

  typingInterval = setInterval(() => {
    if (charIdx < text.length) {
      speechTextEl.textContent += text.charAt(charIdx);
      charIdx++;
      if (charIdx % 3 === 0) window.soundFX.playKeyboardBeep();
    } else {
      clearInterval(typingInterval);
    }
  }, 20);
};

// Initial speech
setTimeout(() => {
  window.updateAISpeechBubble('greeting');
}, 1200);

// Quick Jump Command Chips
document.querySelectorAll('.ai-command-chip').forEach((chip) => {
  chip.addEventListener('click', (e) => {
    e.preventDefault();
    const target = chip.dataset.target;
    const action = chip.dataset.action;

    if (action === 'resume') {
      window.handleDownloadResume();
      return;
    }

    if (target) {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        if (window.robotAI) {
          window.robotAI.setRobotState('thinking', 2000);
        }
        window.soundFX.playClick();
      }
    }
  });
});

// Interactive State Buttons in Hero
document.querySelectorAll('.robot-state-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const state = btn.dataset.state;
    if (window.robotAI) {
      window.robotAI.setRobotState(state, 3500);
    }
    document.querySelectorAll('.robot-state-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 3500);
    window.soundFX.playClick();
  });
});

// ==========================================
// 4. Custom Cyber Cursor & Magnetic Snap
// ==========================================
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mousePos = { x: -100, y: -100 };
let ringPos = { x: -100, y: -100 };

if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    cursorDot.style.transform = `translate(${mousePos.x}px, ${mousePos.y}px)`;
  });

  const renderCursor = () => {
    ringPos.x += (mousePos.x - ringPos.x) * 0.2;
    ringPos.y += (mousePos.y - ringPos.y) * 0.2;
    cursorRing.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  document.querySelectorAll('a, button, .tilt-card, .service-card, .contact-pill, .control-btn, .tab-btn, .ai-command-chip').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('active');
      window.soundFX.playHover();
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('active');
    });
    el.addEventListener('click', () => {
      window.soundFX.playClick();
    });
  });
}

// ==========================================
// 5. 3D Perspective Card Tilt
// ==========================================
function init3DCardTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// ==========================================
// 6. Skills Category Filter Tabs
// ==========================================
const skillTabs = document.querySelectorAll('.skill-tab-btn');
const skillCards = document.querySelectorAll('.skill-module');

if (skillTabs.length > 0) {
  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      skillCards.forEach((card) => {
        const cardCat = card.dataset.category;
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });

      if (window.robotAI) window.robotAI.setRobotState('thinking', 1800);
      window.soundFX.playClick();
    });
  });
}

// ==========================================
// 7. Project Holo-Deck Modal Viewer
// ==========================================
const projectData = {
  rentease: {
    title: 'RentEase — AI-Powered Full-Stack Furniture Rental Platform',
    category: 'AI & Full Stack Web Platform',
    badge: 'LIVE ON RENDER',
    tech: ['Node.js', 'Express.js', 'MongoDB / Mongoose', 'JavaScript', 'HTML5', 'CSS3', 'REST API'],
    summary: 'An AI-powered full-stack furniture and appliance rental platform featuring intelligent conversational recommendations, multi-step tenure checkout, automated delivery tracking, and administrative analytics.',
    highlights: [
      'Built an intelligent customer support and furniture recommendation AI assistant with live MongoDB inventory search.',
      'Engineered multi-step checkout with tenure-based discounts (up to 35%), address validation, and simulated payment gateway.',
      'Implemented real-time order tracking dashboard with a 4-step delivery progress timeline and user order cancellation.',
      'Developed a role-based Admin Management Portal for real-time revenue analytics, order lifecycle management, and inventory CRUD.'
    ],
    github: 'https://github.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack.',
    demo: 'https://rentease-ai-full-stack.onrender.com',
    accentColor: '#00f0ff'
  },
  pathology: {
    title: 'Pathology Diagnostic Management System',
    category: 'Healthcare & Clinical Workflow Engine',
    badge: 'FULL STACK MERN/EJS',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'EJS', 'REST APIs'],
    summary: 'A comprehensive pathology management web system that streamlines diagnostic test bookings, patient medical reports, sample tracking, and automated receipt generation for clinics and laboratories.',
    highlights: [
      'Secure patient report generation & PDF receipt pipeline',
      'Admin dashboard for test catalog management and sample status updates',
      'RESTful API architecture with MongoDB schema validation via Mongoose',
      'Automated email/SMS notification system integration'
    ],
    github: 'https://github.com/sumit-kumar',
    demo: '#',
    accentColor: '#a855f7'
  },
  ecommerce: {
    title: 'MERN Stack E-Commerce Platform',
    category: 'Full Stack Shopping Platform',
    badge: 'PRODUCTION READY',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux', 'JWT'],
    summary: 'A full-stack modern online shopping platform featuring real-time product browsing, state management, secure user authentication, shopping cart, order tracking, and admin product management.',
    highlights: [
      'JWT-based secure user authentication and protected routes',
      'Dynamic search, category filtering, and product reviews system',
      'Scalable MongoDB database with optimized aggregation pipelines',
      'Interactive React UI with smooth micro-animations'
    ],
    github: 'https://github.com/sumit-kumar',
    demo: '#',
    accentColor: '#10b981'
  },
  robotai: {
    title: 'NEXUS-AI 3D Robot Developer Portfolio',
    category: 'Interactive 3D WebGL Experience',
    badge: 'FUTURISTIC THREE.JS',
    tech: ['Three.js', 'WebGL', 'JavaScript (ES6+)', 'Web Audio API', 'Procedural 3D'],
    summary: 'An articulated procedural 3D Robot assistant featuring dynamic optical canvas visor expressions, Web Audio API sound synthesis, 3D perspective physics, and cybernetic HUD controls.',
    highlights: [
      'Custom Three.js 3D Robot with real-time dynamic canvas visor expressions',
      'Procedural joint articulation & inverse-kinematic gestures (waving, thinking, coding)',
      'Built-in Web Audio API sound synthesizer with zero audio file dependencies',
      'High-performance 60 FPS rendering with WebGL DPR clamping & mobile scaling'
    ],
    github: 'https://github.com/sumit-kumar',
    demo: '#home',
    accentColor: '#00f0ff'
  }
};

const modal = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalTitle = document.getElementById('modal-title');
const modalCategory = document.getElementById('modal-category');
const modalBadge = document.getElementById('modal-badge');
const modalSummary = document.getElementById('modal-summary');
const modalTechList = document.getElementById('modal-tech-list');
const modalHighlights = document.getElementById('modal-highlights');
const modalGithub = document.getElementById('modal-github');
const modalDemo = document.getElementById('modal-demo');

function openProjectModal(projectId) {
  const p = projectData[projectId];
  if (!p || !modal) return;

  modalTitle.textContent = p.title;
  modalCategory.textContent = p.category;
  if (modalBadge) modalBadge.textContent = p.badge;
  modalSummary.textContent = p.summary;

  modalTechList.innerHTML = p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
  modalHighlights.innerHTML = p.highlights.map(h => `<li>${h}</li>`).join('');

  modalGithub.href = p.github;
  modalDemo.href = p.demo;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (window.robotAI) window.robotAI.setRobotState('coding', 3000);
  window.soundFX.playModalOpen();
}

function closeProjectModal() {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal();
  });
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
    closeProjectModal();
  }
});

document.querySelectorAll('.open-modal-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const pid = btn.dataset.project;
    openProjectModal(pid);
  });
});

// ==========================================
// 8. Recruiter Resume Download Action
// ==========================================
window.handleDownloadResume = function() {
  window.soundFX.playRobotChirp(600, 1200);
  if (window.robotAI) window.robotAI.setRobotState('success', 3500);

  // Trigger direct download of public/resume.pdf
  const link = document.createElement('a');
  link.href = 'resume.pdf';
  link.download = 'Sumit_Kumar_FullStack_Resume.pdf';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });
  }
};

document.querySelectorAll('.resume-download-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.handleDownloadResume();
  });
});

// ==========================================
// 9. Sound Mute / Unmute Controller
// ==========================================
const soundToggleBtn = document.getElementById('soundToggleBtn');
if (soundToggleBtn) {
  const updateSoundIcon = () => {
    if (window.soundFX.muted) {
      soundToggleBtn.innerHTML = `<span>🔇</span><span class="ctrl-label">Muted</span>`;
      soundToggleBtn.classList.add('muted');
    } else {
      soundToggleBtn.innerHTML = `<span>🔊</span><span class="ctrl-label">Audio ON</span>`;
      soundToggleBtn.classList.remove('muted');
    }
  };
  updateSoundIcon();

  soundToggleBtn.addEventListener('click', () => {
    window.soundFX.toggleMute();
    updateSoundIcon();
    if (!window.soundFX.muted) window.soundFX.playRobotChirp(700, 1000);
  });
}

// ==========================================
// 10. Cyber Theme Switcher (4 Presets)
// ==========================================
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themes = [
  { id: 'theme-cyberpunk', name: 'Cyberpunk Neon', icon: '⚡' },
  { id: 'theme-emerald', name: 'Quantum Emerald', icon: '💎' },
  { id: 'theme-supernova', name: 'Supernova Orange', icon: '🔥' },
  { id: 'theme-stealth', name: 'Obsidian Stealth', icon: '🌙' }
];
let currentThemeIndex = 0;

const savedTheme = localStorage.getItem('nexusTheme') || 'theme-cyberpunk';
document.body.className = savedTheme;
currentThemeIndex = themes.findIndex(t => t.id === savedTheme) >= 0 ? themes.findIndex(t => t.id === savedTheme) : 0;

function updateThemeButton() {
  if (!themeToggleBtn) return;
  const current = themes[currentThemeIndex];
  themeToggleBtn.innerHTML = `<span>${current.icon}</span><span class="ctrl-label">${current.name}</span>`;
}
updateThemeButton();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[currentThemeIndex];
    document.body.className = nextTheme.id;
    localStorage.setItem('nexusTheme', nextTheme.id);
    updateThemeButton();
    window.soundFX.playClick();
  });
}

// ==========================================
// 11. Contact Form Submission with Express Backend & Celebration
// ==========================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = contactForm.elements['name']?.value.trim();
    const email = contactForm.elements['email']?.value.trim();
    const message = contactForm.elements['message']?.value.trim();

    if (!name || !email || !message) {
      showFormStatus('⚠️ All telemetry parameters (Name, Email, Message) are required.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="btn-spinner"></span> Transmitting Signal...`;
    showFormStatus('🛰️ Encoding transmission across subspace channels...', 'info');

    if (window.robotAI) window.robotAI.setRobotState('thinking', 2000);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signal transmission failed.');
      }

      showFormStatus('✨ Subspace transmission verified! Sumit has received your message and will respond shortly.', 'success');
      contactForm.reset();

      if (window.robotAI) window.robotAI.setRobotState('success', 4500);
      window.soundFX.playSuccess();

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.65 }
        });
      }
    } catch (err) {
      showFormStatus(`❌ Transmission Error: ${err.message || 'Server unreachable.'}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Transmit Message</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
    }
  });
}

function showFormStatus(msg, type) {
  if (!formStatus) return;
  formStatus.textContent = msg;
  formStatus.className = `form-status ${type}`;
}

// ==========================================
// 12. Matrix Rain Canvas Easter Egg
// ==========================================
window.triggerMatrixEffect = function() {
  if (document.getElementById('matrix-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '99999';
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0.9';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const characters = '0123456789ABCDEF01アイウエオカキクケコサシスセソタチツテトナニヌネノSUMIT';
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  let frameCount = 0;
  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff66';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    frameCount++;
    if (frameCount < 280) {
      requestAnimationFrame(draw);
    } else {
      canvas.style.transition = 'opacity 1s ease';
      canvas.style.opacity = '0';
      setTimeout(() => canvas.remove(), 1000);
    }
  };
  draw();
};

// ==========================================
// 13. Keyboard Shortcuts & Console Easter Egg
// ==========================================
window.addEventListener('keydown', (e) => {
  // If user is typing in form inputs, do not trigger shortcuts
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

  const key = e.key.toLowerCase();
  if (key === 'm') {
    window.triggerMatrixEffect();
    if (window.robotAI) window.robotAI.setRobotState('coding', 3000);
  } else if (key === 'r') {
    if (window.robotAI) window.robotAI.setRobotState('idle', 1000);
  } else if (key === 'h') {
    if (window.robotAI) window.robotAI.setRobotState('greeting', 3000);
  } else if (key === 'p') {
    if (window.robotAI) window.robotAI.setRobotState('supercharge', 4500);
  }
});

// Developer Console ASCII Art
console.log(`
%c
  _   _ _______   ___   _ ____        _    ___ 
 | \\ | | ____\\ \\ / / | | / ___|      / \\  |_ _|
 |  \\| |  _|  \\ V /| | | \\___ \\     / _ \\  | | 
 | |\\  | |___  | | | |_| |___) |   / ___ \\ | | 
 |_| \\_|_____| |_|  \\___/|____/   /_/   \\_\\___|
                                               
 ⚡ SUMIT KUMAR — Full Stack Developer & 3D WebGL Engineer
 🚀 NEXUS-AI Engine v4.5 Active
 📧 Contact: skvishwakarma828401@gmail.com
 💡 Press 'M' for Matrix Mode, 'P' for Supercharge Mode!
`, 'color: #00f0ff; font-weight: bold; background: #05070e; padding: 12px;');

// ==========================================
// 14. Scroll Progress Bar & Active Link Tracking
// ==========================================
const scrollProgressBar = document.getElementById('scroll-progress-bar');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuBtn.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.classList.remove('active');
    });
  });
}

window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  if (scrollProgressBar) {
    scrollProgressBar.style.width = `${progress}%`;
  }

  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 150;
    const sectionId = current.getAttribute('id');
    const navItem = document.querySelector(`.nav-links a[href*='${sectionId}']`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navItem?.classList.add('active');
    } else {
      navItem?.classList.remove('active');
    }
  });
});

// Dynamic Current Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
  init3DCardTilt();
});