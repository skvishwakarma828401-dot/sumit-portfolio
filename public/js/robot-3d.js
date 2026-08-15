/**
 * Cinematic 3D Robot & AI Assistant Engine ("NEXUS-AI") for Sumit Kumar's Portfolio
 * Powered by Three.js
 */

class Robot3DEngine {
  constructor() {
    this.container = document.getElementById('webgl-container');
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.currentSection = 'home';
    this.windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // 3D Robot Hierarchy
    this.robotGroup = new THREE.Group();
    this.headGroup = new THREE.Group();
    this.torsoGroup = new THREE.Group();
    this.coreMesh = null;
    this.corePointLight = null;
    this.coreRings = [];

    // Visor Dynamic Canvas Texture
    this.visorCanvas = null;
    this.visorCtx = null;
    this.visorTexture = null;
    this.visorMesh = null;

    // Articulated Arms
    this.leftShoulder = new THREE.Group();
    this.leftArm = new THREE.Group();
    this.leftForearm = new THREE.Group();
    this.leftHand = new THREE.Group();

    this.rightShoulder = new THREE.Group();
    this.rightArm = new THREE.Group();
    this.rightForearm = new THREE.Group();
    this.rightHand = new THREE.Group();

    // Thrusters & Holographic HUD
    this.thrusterGroup = new THREE.Group();
    this.orbitRings = [];
    this.holoElements = [];
    this.ambientParticles = null;

    // Robot AI State
    // States: 'idle', 'greeting', 'thinking', 'coding', 'working', 'success', 'supercharge'
    this.state = 'idle';
    this.stateTimer = 0;
    this.blinkTimer = 0;
    this.isBlinking = false;
    this.scanOffset = 0;
    this.matrixChars = '010101XYZSK99';
    this.lastClickTime = 0;

    this.init();
  }

  init() {
    // 1. Perspective Camera
    this.camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 16);

    // 2. High-Performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.container.appendChild(this.renderer.domElement);

    // 3. Cinematic Studio Lighting
    this.setupCinematicLighting();

    // 4. Construct Robot & Environment
    this.createVisorTexture();
    this.buildArticulatedRobot();
    this.createHolographicHUD();
    this.createCyberStarfield();

    // 5. Event Listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    window.addEventListener('click', this.onCanvasClick.bind(this));

    // 6. Start Render Loop
    this.animate();
  }

  setupCinematicLighting() {
    // Ambient Soft Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Key Cyan / Sapphire Light
    this.cyanLight = new THREE.PointLight(0x00f0ff, 4.2, 38);
    this.cyanLight.position.set(5.5, 5, 8);
    this.scene.add(this.cyanLight);

    // Rim Ultraviolet / Magenta Light
    this.purpleLight = new THREE.PointLight(0xa855f7, 3.8, 38);
    this.purpleLight.position.set(-6, -4, 6);
    this.scene.add(this.purpleLight);

    // Quantum Arc Reactor Inner Point Light
    this.corePointLight = new THREE.PointLight(0x00f0ff, 2.5, 8);
    this.corePointLight.position.set(0, 0.15, 1.1);
    this.torsoGroup.add(this.corePointLight);

    // Directional Key Light from Top-Front
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight.position.set(2, 10, 14);
    this.scene.add(dirLight);
  }

  // ==========================================
  // Dynamic Canvas Visor Texture (Expressions)
  // ==========================================
  createVisorTexture() {
    this.visorCanvas = document.createElement('canvas');
    this.visorCanvas.width = 512;
    this.visorCanvas.height = 256;
    this.visorCtx = this.visorCanvas.getContext('2d');

    this.visorTexture = new THREE.CanvasTexture(this.visorCanvas);
    this.visorTexture.anisotropy = 4;
    this.updateVisorExpression();
  }

  updateVisorExpression() {
    const ctx = this.visorCtx;
    const w = this.visorCanvas.width;
    const h = this.visorCanvas.height;

    // Dark cyber visor glass
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, w, h);

    // Subtle holographic grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const eyeCyan = '#00f0ff';
    const eyePurple = '#a855f7';
    const eyeGold = '#fbbf24';
    const eyeRose = '#f43f5e';

    ctx.shadowBlur = 20;

    if (this.state === 'greeting') {
      // Happy Eyes: ^  ^
      ctx.strokeStyle = eyeCyan;
      ctx.shadowColor = eyeCyan;
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';

      // Left Eye
      ctx.beginPath();
      ctx.moveTo(140, 140);
      ctx.lineTo(185, 92);
      ctx.lineTo(230, 140);
      ctx.stroke();

      // Right Eye
      ctx.beginPath();
      ctx.moveTo(282, 140);
      ctx.lineTo(327, 92);
      ctx.lineTo(372, 140);
      ctx.stroke();

      // Digital blush
      ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
      ctx.beginPath();
      ctx.arc(130, 165, 16, 0, Math.PI * 2);
      ctx.arc(382, 165, 16, 0, Math.PI * 2);
      ctx.fill();

    } else if (this.state === 'thinking') {
      // Thinking / Analyzing: ? _ ? with radar sweep
      ctx.fillStyle = eyePurple;
      ctx.shadowColor = eyePurple;

      ctx.font = 'bold 64px "Space Grotesk", monospace';
      ctx.fillText('?', 160, 140);
      ctx.fillText('?', 320, 140);

      // Radar scanline
      this.scanOffset = (this.scanOffset + 9) % w;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.scanOffset, 15);
      ctx.lineTo(this.scanOffset, h - 15);
      ctx.stroke();

    } else if (this.state === 'coding') {
      // Matrix code stream on visor
      ctx.fillStyle = '#34d399';
      ctx.shadowColor = '#34d399';
      ctx.font = '17px "Fira Code", monospace';
      for (let i = 0; i < 8; i++) {
        ctx.fillText(`const engineer = { role: "FullStack", stack: "MERN" };`, 25, 55 + i * 24);
      }

    } else if (this.state === 'success') {
      // Star Eyes: ★  ★
      ctx.fillStyle = eyeGold;
      ctx.shadowColor = eyeGold;
      ctx.font = 'bold 76px monospace';
      ctx.fillText('★', 150, 145);
      ctx.fillText('★', 300, 145);

    } else if (this.state === 'supercharge') {
      // Overclocked Neon Rainbow Pulses
      ctx.fillStyle = eyeRose;
      ctx.shadowColor = eyeCyan;
      ctx.font = 'bold 70px "Space Grotesk", monospace';
      ctx.fillText('⚡', 155, 145);
      ctx.fillText('⚡', 305, 145);

    } else if (this.state === 'working') {
      // Equalizer Audio / Diagnostic Waveform
      ctx.fillStyle = eyeCyan;
      ctx.shadowColor = eyeCyan;
      const numBars = 12;
      const barW = 16;
      for (let i = 0; i < numBars; i++) {
        const barH = 20 + Math.sin(Date.now() * 0.009 + i) * 55;
        ctx.fillRect(150 + i * 20, 128 - barH / 2, barW, barH);
      }

    } else {
      // Default Idle State: Glowing Optical Eye Capsules with Cursor Look-At & Blink
      if (this.isBlinking) {
        ctx.strokeStyle = eyeCyan;
        ctx.shadowColor = eyeCyan;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(145, 128);
        ctx.lineTo(215, 128);
        ctx.moveTo(295, 128);
        ctx.lineTo(365, 128);
        ctx.stroke();
      } else {
        ctx.fillStyle = eyeCyan;
        ctx.shadowColor = eyeCyan;

        // Left Eye Capsule
        ctx.beginPath();
        ctx.roundRect(145, 95, 70, 66, 18);
        ctx.fill();

        // Right Eye Capsule
        ctx.beginPath();
        ctx.roundRect(295, 95, 70, 66, 18);
        ctx.fill();

        // Pupils reacting to cursor position in 3D space
        ctx.fillStyle = '#ffffff';
        const pupX = this.mouse.x * 14;
        const pupY = -this.mouse.y * 12;
        ctx.beginPath();
        ctx.arc(180 + pupX, 128 + pupY, 14, 0, Math.PI * 2);
        ctx.arc(330 + pupX, 128 + pupY, 14, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (this.visorTexture) {
      this.visorTexture.needsUpdate = true;
    }
  }

  // ==========================================
  // Procedural Articulated Robot Construction
  // ==========================================
  buildArticulatedRobot() {
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x182030,
      metalness: 0.88,
      roughness: 0.22,
      envMapIntensity: 1.3
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x090c14,
      metalness: 0.92,
      roughness: 0.38
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.96,
      roughness: 0.12
    });

    const glowCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const glowPurpleMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });

    // ----------------------------------------------------
    // 1. HEAD & OPTICAL VISOR
    // ----------------------------------------------------
    this.headGroup.position.set(0, 2.2, 0);

    // Helmet Base
    const helmetGeo = new THREE.CylinderGeometry(1.32, 1.22, 1.6, 32);
    const helmet = new THREE.Mesh(helmetGeo, titaniumMat);
    this.headGroup.add(helmet);

    // Helmet Top Dome
    const domeGeo = new THREE.SphereGeometry(1.32, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, titaniumMat);
    dome.position.set(0, 0.8, 0);
    this.headGroup.add(dome);

    // Curved Visor Faceplate
    const visorGeo = new THREE.CylinderGeometry(1.34, 1.24, 1.1, 32, 1, false, -Math.PI / 2.6, Math.PI / 1.3);
    const visorMat = new THREE.MeshBasicMaterial({
      map: this.visorTexture,
      side: THREE.DoubleSide
    });
    this.visorMesh = new THREE.Mesh(visorGeo, visorMat);
    this.visorMesh.position.set(0, 0.05, 0.05);
    this.headGroup.add(this.visorMesh);

    // Antenna Audio Sensors
    [-1.48, 1.48].forEach((xSide) => {
      const earGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.35, 16);
      const ear = new THREE.Mesh(earGeo, darkMat);
      ear.rotation.z = Math.PI / 2;
      ear.position.set(xSide, 0.1, 0);
      this.headGroup.add(ear);

      const antStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8);
      const antStem = new THREE.Mesh(antStemGeo, chromeMat);
      antStem.position.set(xSide * 1.1, 0.6, 0);
      antStem.rotation.z = xSide > 0 ? -0.2 : 0.2;
      this.headGroup.add(antStem);

      const tipGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const tip = new THREE.Mesh(tipGeo, glowCyanMat);
      tip.position.set(xSide * 1.2, 1.05, 0);
      this.headGroup.add(tip);
    });

    this.robotGroup.add(this.headGroup);

    // Neck Hub
    const neckGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.45, 24);
    const neck = new THREE.Mesh(neckGeo, darkMat);
    neck.position.set(0, 1.25, 0);
    this.robotGroup.add(neck);

    // ----------------------------------------------------
    // 2. TORSO & QUANTUM ARC REACTOR
    // ----------------------------------------------------
    this.torsoGroup.position.set(0, 0, 0);

    // Chest Armor Plating
    const chestGeo = new THREE.BoxGeometry(2.85, 2.2, 1.85);
    const chest = new THREE.Mesh(chestGeo, titaniumMat);
    this.torsoGroup.add(chest);

    // Collar Armor
    const collarGeo = new THREE.BoxGeometry(2.4, 0.3, 1.7);
    const collar = new THREE.Mesh(collarGeo, darkMat);
    collar.position.set(0, 1.1, 0);
    this.torsoGroup.add(collar);

    // Quantum Arc Reactor Core
    const coreLensGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.16, 32);
    const coreLensMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    this.coreMesh = new THREE.Mesh(coreLensGeo, coreLensMat);
    this.coreMesh.rotation.x = Math.PI / 2;
    this.coreMesh.position.set(0, 0.15, 0.94);
    this.torsoGroup.add(this.coreMesh);

    // Core Outer Rotating Ring
    const coreRingGeo = new THREE.TorusGeometry(0.74, 0.08, 16, 32);
    const coreRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7
    });
    const coreRing = new THREE.Mesh(coreRingGeo, coreRingMat);
    coreRing.position.set(0, 0.15, 0.96);
    this.torsoGroup.add(coreRing);
    this.coreRings.push(coreRing);

    // Jet Battery Exhaust Pack
    const jetPackGeo = new THREE.BoxGeometry(2.0, 1.8, 0.6);
    const jetPack = new THREE.Mesh(jetPackGeo, darkMat);
    jetPack.position.set(0, 0, -1.15);
    this.torsoGroup.add(jetPack);

    this.robotGroup.add(this.torsoGroup);

    // ----------------------------------------------------
    // 3. ARTICULATED LEFT ARM
    // ----------------------------------------------------
    this.leftShoulder.position.set(-1.75, 0.8, 0);

    const pauldronGeo = new THREE.SphereGeometry(0.66, 24, 16);
    const pauldronLeft = new THREE.Mesh(pauldronGeo, titaniumMat);
    this.leftShoulder.add(pauldronLeft);

    this.leftArm.position.set(-0.2, -0.6, 0);
    const armGeo = new THREE.CylinderGeometry(0.32, 0.28, 1.1, 16);
    const armLeft = new THREE.Mesh(armGeo, darkMat);
    armLeft.position.set(0, -0.4, 0);
    this.leftArm.add(armLeft);

    this.leftForearm.position.set(0, -0.9, 0);
    const forearmGeo = new THREE.CylinderGeometry(0.3, 0.26, 1.0, 16);
    const forearmLeft = new THREE.Mesh(forearmGeo, titaniumMat);
    forearmLeft.position.set(0, -0.4, 0);
    this.leftForearm.add(forearmLeft);

    this.leftHand.position.set(0, -0.9, 0);
    const handGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const handLeft = new THREE.Mesh(handGeo, chromeMat);
    this.leftHand.add(handLeft);

    this.leftForearm.add(this.leftHand);
    this.leftArm.add(this.leftForearm);
    this.leftShoulder.add(this.leftArm);
    this.robotGroup.add(this.leftShoulder);

    // ----------------------------------------------------
    // 4. ARTICULATED RIGHT ARM
    // ----------------------------------------------------
    this.rightShoulder.position.set(1.75, 0.8, 0);

    const pauldronRight = new THREE.Mesh(pauldronGeo, titaniumMat);
    this.rightShoulder.add(pauldronRight);

    this.rightArm.position.set(0.2, -0.6, 0);
    const armRight = new THREE.Mesh(armGeo, darkMat);
    armRight.position.set(0, -0.4, 0);
    this.rightArm.add(armRight);

    this.rightForearm.position.set(0, -0.9, 0);
    const forearmRight = new THREE.Mesh(forearmGeo, titaniumMat);
    forearmRight.position.set(0, -0.4, 0);
    this.rightForearm.add(forearmRight);

    this.rightHand.position.set(0, -0.9, 0);
    const handRight = new THREE.Mesh(handGeo, chromeMat);
    this.rightHand.add(handRight);

    this.rightForearm.add(this.rightHand);
    this.rightArm.add(this.rightForearm);
    this.rightShoulder.add(this.rightArm);
    this.robotGroup.add(this.rightShoulder);

    // ----------------------------------------------------
    // 5. ANTI-GRAVITY MAGNETIC THRUSTER BASE
    // ----------------------------------------------------
    this.thrusterGroup.position.set(0, -1.3, 0);

    const pelvisGeo = new THREE.CylinderGeometry(0.92, 0.62, 0.7, 24);
    const pelvis = new THREE.Mesh(pelvisGeo, darkMat);
    this.thrusterGroup.add(pelvis);

    const magRingGeo = new THREE.TorusGeometry(1.22, 0.09, 16, 40);
    const magRing1 = new THREE.Mesh(magRingGeo, glowCyanMat);
    magRing1.rotation.x = Math.PI / 2;
    magRing1.position.set(0, -0.5, 0);
    this.thrusterGroup.add(magRing1);

    const magRing2 = new THREE.Mesh(magRingGeo, glowPurpleMat);
    magRing2.rotation.x = Math.PI / 2;
    magRing2.scale.set(0.75, 0.75, 0.75);
    magRing2.position.set(0, -0.9, 0);
    this.thrusterGroup.add(magRing2);

    this.robotGroup.add(this.thrusterGroup);

    // Position the robot in the 3D scene (Hero offset)
    this.robotGroup.position.set(3.4, 0, 2.5);
    this.scene.add(this.robotGroup);
  }

  // ==========================================
  // Holographic HUD Rings & Cyber Starfield
  // ==========================================
  createHolographicHUD() {
    // Rotating Orbital Sci-Fi Rings
    const ringGeo1 = new THREE.TorusGeometry(4.6, 0.025, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.4
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.3;
    this.scene.add(ring1);
    this.orbitRings.push({ mesh: ring1, rx: 0.004, rz: 0.006 });

    const ringGeo2 = new THREE.TorusGeometry(5.2, 0.02, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.35
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 2.8;
    ring2.rotation.y = Math.PI / 5;
    this.scene.add(ring2);
    this.orbitRings.push({ mesh: ring2, rx: -0.005, rz: -0.004 });

    // Floating 3D Wireframe Prisms
    const prismGeo = new THREE.OctahedronGeometry(0.85, 0);
    const prismMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.position.set(-4.8, 2.6, 1.5);
    this.scene.add(prism);
    this.holoElements.push({ mesh: prism, rx: 0.01, ry: 0.015, basePos: prism.position.clone() });

    const knotGeo = new THREE.TorusKnotGeometry(0.68, 0.18, 80, 16);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.5,
      metalness: 0.85,
      roughness: 0.2
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.set(5.8, -2.8, 1.2);
    this.scene.add(knot);
    this.holoElements.push({ mesh: knot, rx: -0.012, ry: 0.008, basePos: knot.position.clone() });
  }

  createCyberStarfield() {
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00f0ff);
    const colorPurple = new THREE.Color(0xa855f7);
    const colorBlue = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const mixed = Math.random() > 0.5 ? colorCyan : (Math.random() > 0.3 ? colorPurple : colorBlue);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.ambientParticles = new THREE.Points(geometry, material);
    this.scene.add(this.ambientParticles);
  }

  // ==========================================
  // Public AI State Controller & Easter Eggs
  // ==========================================
  setRobotState(newState, duration = 3000) {
    this.state = newState;
    this.stateTimer = Date.now() + duration;
    this.updateVisorExpression();

    if (window.soundFX) {
      if (newState === 'greeting') window.soundFX.playRobotChirp(880, 1100);
      else if (newState === 'thinking') window.soundFX.playRobotScan();
      else if (newState === 'coding') window.soundFX.playKeyboardBeep();
      else if (newState === 'success') window.soundFX.playSuccess();
      else if (newState === 'supercharge') window.soundFX.playSupercharge();
    }

    if (window.updateAISpeechBubble) {
      window.updateAISpeechBubble(newState);
    }
  }

  onCanvasClick(e) {
    const now = Date.now();
    if (now - this.lastClickTime < 350) {
      // Double Click Easter Egg -> Supercharge Matrix Mode!
      this.setRobotState('supercharge', 4500);
      if (window.triggerMatrixEffect) window.triggerMatrixEffect();
    }
    this.lastClickTime = now;
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX - this.windowHalf.x) / this.windowHalf.x;
    this.mouse.targetY = (e.clientY - this.windowHalf.y) / this.windowHalf.y;
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      this.mouse.targetX = (e.touches[0].clientX - this.windowHalf.x) / this.windowHalf.x;
      this.mouse.targetY = (e.touches[0].clientY - this.windowHalf.y) / this.windowHalf.y;
    }
  }

  onScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = docHeight > 0 ? window.scrollY / docHeight : 0;

    const sections = ['home', 'about', 'skills', 'projects', 'services', 'experience', 'contact'];
    const scrollY = window.pageYOffset;

    for (const secId of sections) {
      const el = document.getElementById(secId);
      if (el) {
        const top = el.offsetTop - 180;
        const height = el.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          if (this.currentSection !== secId) {
            this.currentSection = secId;
            this.onSectionChange(secId);
          }
          break;
        }
      }
    }
  }

  onSectionChange(secId) {
    if (secId === 'home') {
      this.setRobotState('greeting', 2500);
    } else if (secId === 'about') {
      this.setRobotState('thinking', 2200);
    } else if (secId === 'skills') {
      this.setRobotState('working', 2500);
    } else if (secId === 'projects') {
      this.setRobotState('coding', 3000);
    } else if (secId === 'services') {
      this.setRobotState('thinking', 2000);
    } else if (secId === 'contact') {
      this.setRobotState('greeting', 2500);
    }
  }

  onWindowResize() {
    this.windowHalf.x = window.innerWidth / 2;
    this.windowHalf.y = window.innerHeight / 2;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ==========================================
  // Main Animation Loop (60 FPS)
  // ==========================================
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Mouse Lerp Damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // State Timeout -> return to idle
    if (this.state !== 'idle' && Date.now() > this.stateTimer) {
      this.state = 'idle';
      this.updateVisorExpression();
    }

    // Visor Periodic Blinking
    if (this.state === 'idle') {
      this.blinkTimer += delta;
      if (this.blinkTimer > 3.8) {
        this.isBlinking = true;
        this.updateVisorExpression();
        if (this.blinkTimer > 4.0) {
          this.isBlinking = false;
          this.blinkTimer = 0;
          this.updateVisorExpression();
        }
      }
    } else {
      this.updateVisorExpression();
    }

    // ----------------------------------------------------
    // ROBOT KINEMATICS & CINEMATIC MOTION
    // ----------------------------------------------------
    const isMobile = window.innerWidth < 768;

    const floatY = Math.sin(elapsedTime * 1.6) * 0.24;
    const breathScale = 1.0 + Math.sin(elapsedTime * 2.2) * 0.015;

    this.robotGroup.position.y = floatY;
    this.torsoGroup.scale.set(breathScale, breathScale, breathScale);

    if (isMobile) {
      this.robotGroup.position.x = 0;
      this.robotGroup.position.z = -1.2;
      this.robotGroup.scale.set(0.68, 0.68, 0.68);
    } else {
      let targetX = 3.4;
      let targetZ = 2.5;
      let targetRotY = THREE.MathUtils.degToRad(-18);

      if (this.currentSection === 'about') {
        targetX = -3.8;
        targetRotY = THREE.MathUtils.degToRad(22);
      } else if (this.currentSection === 'skills') {
        targetX = 3.6;
        targetRotY = THREE.MathUtils.degToRad(-20);
      } else if (this.currentSection === 'projects') {
        targetX = -3.5;
        targetRotY = THREE.MathUtils.degToRad(18);
      } else if (this.currentSection === 'services') {
        targetX = 3.6;
        targetRotY = THREE.MathUtils.degToRad(-15);
      } else if (this.currentSection === 'contact') {
        targetX = -3.2;
        targetRotY = THREE.MathUtils.degToRad(20);
      }

      this.robotGroup.position.x += (targetX - this.robotGroup.position.x) * 0.05;
      this.robotGroup.position.z += (targetZ - this.robotGroup.position.z) * 0.05;
      this.robotGroup.rotation.y += (targetRotY + this.mouse.x * 0.28 - this.robotGroup.rotation.y) * 0.05;
    }

    // Head Cursor Look-At Damping
    this.headGroup.rotation.y = this.mouse.x * 0.55;
    this.headGroup.rotation.x = -this.mouse.y * 0.35;

    // Articulated Arm Poses
    if (this.state === 'greeting') {
      this.rightShoulder.rotation.z = THREE.MathUtils.degToRad(45);
      this.rightShoulder.rotation.x = THREE.MathUtils.degToRad(-20);
      this.rightArm.rotation.z = THREE.MathUtils.degToRad(80);
      this.rightForearm.rotation.z = Math.sin(elapsedTime * 8) * 0.45 + 0.3;
      this.leftShoulder.rotation.z = THREE.MathUtils.degToRad(-10);

    } else if (this.state === 'thinking') {
      this.headGroup.rotation.z = 0.22;
      this.rightShoulder.rotation.x = THREE.MathUtils.degToRad(40);
      this.rightShoulder.rotation.z = THREE.MathUtils.degToRad(-25);
      this.rightArm.rotation.x = THREE.MathUtils.degToRad(55);
      this.rightForearm.rotation.x = THREE.MathUtils.degToRad(50);
      this.leftShoulder.rotation.z = 0;

    } else if (this.state === 'coding') {
      const typeL = Math.sin(elapsedTime * 14) * 0.15;
      const typeR = Math.cos(elapsedTime * 14) * 0.15;

      this.leftShoulder.rotation.x = THREE.MathUtils.degToRad(45) + typeL;
      this.leftShoulder.rotation.z = THREE.MathUtils.degToRad(15);
      this.leftForearm.rotation.x = THREE.MathUtils.degToRad(40) + typeL;

      this.rightShoulder.rotation.x = THREE.MathUtils.degToRad(45) + typeR;
      this.rightShoulder.rotation.z = THREE.MathUtils.degToRad(-15);
      this.rightForearm.rotation.x = THREE.MathUtils.degToRad(40) + typeR;

    } else if (this.state === 'success') {
      this.leftShoulder.rotation.z = THREE.MathUtils.degToRad(-60);
      this.rightShoulder.rotation.z = THREE.MathUtils.degToRad(60);
      this.leftForearm.rotation.z = THREE.MathUtils.degToRad(-30);
      this.rightForearm.rotation.z = THREE.MathUtils.degToRad(30);
      this.robotGroup.position.y += Math.abs(Math.sin(elapsedTime * 6)) * 0.35;

    } else if (this.state === 'supercharge') {
      this.robotGroup.rotation.y += 0.08;
      this.leftShoulder.rotation.z = Math.sin(elapsedTime * 8) * 0.5;
      this.rightShoulder.rotation.z = -Math.sin(elapsedTime * 8) * 0.5;
      this.robotGroup.position.y += Math.sin(elapsedTime * 8) * 0.4;

    } else if (this.state === 'working') {
      this.robotGroup.rotation.y += 0.04;
      this.leftShoulder.rotation.z = Math.sin(elapsedTime * 3) * 0.2;
      this.rightShoulder.rotation.z = -Math.sin(elapsedTime * 3) * 0.2;

    } else {
      this.leftShoulder.rotation.z = THREE.MathUtils.degToRad(-8) + Math.sin(elapsedTime * 1.5) * 0.05;
      this.leftShoulder.rotation.x = 0;
      this.leftArm.rotation.z = 0;
      this.leftForearm.rotation.x = THREE.MathUtils.degToRad(10);

      this.rightShoulder.rotation.z = THREE.MathUtils.degToRad(8) - Math.sin(elapsedTime * 1.5) * 0.05;
      this.rightShoulder.rotation.x = 0;
      this.rightArm.rotation.z = 0;
      this.rightForearm.rotation.x = THREE.MathUtils.degToRad(10);
    }

    // Arc Reactor Pulse
    if (this.coreMesh) {
      const corePulse = 1.0 + Math.sin(elapsedTime * 3) * 0.22;
      this.coreMesh.scale.set(corePulse, corePulse, corePulse);
    }
    if (this.corePointLight) {
      this.corePointLight.intensity = 2.5 + Math.sin(elapsedTime * 3) * 1.2;
    }
    this.coreRings.forEach((r, idx) => {
      r.rotation.z += 0.025 * (idx % 2 === 0 ? 1 : -1);
    });

    // Orbit Rings Rotation
    this.orbitRings.forEach((orb) => {
      orb.mesh.rotation.x += orb.rx;
      orb.mesh.rotation.z += orb.rz;
    });

    // Ambient Hologram Prisms
    this.holoElements.forEach((h) => {
      h.mesh.rotation.x += h.rx;
      h.mesh.rotation.y += h.ry;
      h.mesh.position.y = h.basePos.y + Math.sin(elapsedTime * 1.8) * 0.28;
    });

    // Starfield Parallax
    if (this.ambientParticles) {
      this.ambientParticles.rotation.y = elapsedTime * 0.02 + this.mouse.x * 0.08;
      this.ambientParticles.rotation.x = elapsedTime * 0.01 + this.mouse.y * 0.08;
    }

    // Scroll Camera Lerp
    const targetCamY = -this.scrollProgress * 26;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 0.06;
    this.camera.position.x = this.mouse.x * 0.6;

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.robotAI = new Robot3DEngine();
});
