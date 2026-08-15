/**
 * 3D WebGL Scene Engine for Sumit Kumar's Portfolio
 * Powered by Three.js
 */

class Portfolio3DScene {
  constructor() {
    this.container = document.getElementById('webgl-container');
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // 3D Objects
    this.laptopGroup = null;
    this.screenMesh = null;
    this.screenCanvas = null;
    this.screenCtx = null;
    this.screenTexture = null;
    this.particles = null;
    this.particleLines = null;
    this.floatingShapes = [];
    this.orbitRing = null;
    this.skillsOrbitGroup = null;

    // Code animation state on laptop screen
    this.codeLines = [
      'const engineer = {',
      '  name: "Sumit Kumar",',
      '  role: "Full Stack Developer",',
      '  stack: ["React", "Node.js", "MongoDB"],',
      '  passion: "Interactive 3D Web & APIs",',
      '  status: "Available for hire 🚀",',
      '  build: () => "Turning code into reality"',
      '};'
    ];
    this.codeCharIndex = 0;
    this.codeLineIndex = 0;
    this.lastCodeUpdate = 0;

    this.init();
  }

  init() {
    // 1. Camera Setup
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 18);

    // 2. WebGL Renderer Setup
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
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 3. Lighting Setup
    this.setupLighting();

    // 4. Create 3D Assets
    this.createLaptopScreenTexture();
    this.create3DLaptop();
    this.createFloatingShapes();
    this.createParticleStarfield();
    this.createSkillsOrbitGalaxy();

    // 5. Event Listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });

    // 6. Start Render Loop
    this.animate();
  }

  setupLighting() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Primary Cyber Cyan Point Light
    this.cyanLight = new THREE.PointLight(0x00f0ff, 3.5, 30);
    this.cyanLight.position.set(5, 4, 6);
    this.scene.add(this.cyanLight);

    // Secondary Purple / Indigo Point Light
    this.purpleLight = new THREE.PointLight(0x8a2be2, 3.2, 30);
    this.purpleLight.position.set(-6, -3, 5);
    this.scene.add(this.purpleLight);

    // Subtle Front White Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(0, 8, 12);
    this.scene.add(keyLight);
  }

  createLaptopScreenTexture() {
    this.screenCanvas = document.createElement('canvas');
    this.screenCanvas.width = 1024;
    this.screenCanvas.height = 640;
    this.screenCtx = this.screenCanvas.getContext('2d');

    // Create Canvas Texture
    this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTexture.anisotropy = 8;
    this.updateScreenCanvas();
  }

  updateScreenCanvas() {
    const ctx = this.screenCtx;
    const w = this.screenCanvas.width;
    const h = this.screenCanvas.height;

    // IDE Background
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, w, h);

    // IDE Header Bar
    ctx.fillStyle = '#161e2e';
    ctx.fillRect(0, 0, w, 44);

    // Window controls (Red, Yellow, Green dots)
    ctx.fillStyle = '#ff5f56';
    ctx.beginPath();
    ctx.arc(26, 22, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath();
    ctx.arc(48, 22, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#27c93f';
    ctx.beginPath();
    ctx.arc(70, 22, 7, 0, Math.PI * 2);
    ctx.fill();

    // Tab Header
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(100, 8, 180, 36);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px "Fira Code", monospace';
    ctx.fillText('⚡ portfolio.tsx', 120, 31);

    // Line Numbers & Code
    ctx.font = '20px "Fira Code", "Courier New", monospace';
    let y = 85;

    for (let i = 0; i <= this.codeLineIndex && i < this.codeLines.length; i++) {
      // Line number
      ctx.fillStyle = '#475569';
      ctx.fillText((i + 1).toString().padStart(2, ' '), 30, y);

      // Line content
      const fullLine = this.codeLines[i];
      const textToDraw = (i === this.codeLineIndex) ? fullLine.substring(0, this.codeCharIndex) : fullLine;

      // Color keywords
      if (textToDraw.includes('const') || textToDraw.includes('return')) {
        ctx.fillStyle = '#f472b6';
      } else if (textToDraw.includes('name:') || textToDraw.includes('role:') || textToDraw.includes('stack:') || textToDraw.includes('passion:') || textToDraw.includes('status:')) {
        ctx.fillStyle = '#38bdf8';
      } else if (textToDraw.includes('"') || textToDraw.includes("'")) {
        ctx.fillStyle = '#34d399';
      } else {
        ctx.fillStyle = '#e2e8f0';
      }

      ctx.fillText(textToDraw, 75, y);

      // Blinking cursor on current active line
      if (i === this.codeLineIndex) {
        const textWidth = ctx.measureText(textToDraw).width;
        if (Math.floor(Date.now() / 400) % 2 === 0) {
          ctx.fillStyle = '#00f0ff';
          ctx.fillRect(78 + textWidth, y - 18, 10, 22);
        }
      }

      y += 34;
    }

    // Glowing footer status bar
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, h - 28, w, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Fira Code", monospace';
    ctx.fillText('✔ TypeScript | Full Stack Mode | UTF-8 | 60 FPS', 20, h - 9);

    if (this.screenTexture) {
      this.screenTexture.needsUpdate = true;
    }
  }

  create3DLaptop() {
    this.laptopGroup = new THREE.Group();

    // Metallic Finish Material
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e2230,
      metalness: 0.85,
      roughness: 0.25,
      envMapIntensity: 1.0
    });

    const darkMetal = new THREE.MeshStandardMaterial({
      color: 0x0c0e14,
      metalness: 0.9,
      roughness: 0.4
    });

    // 1. Laptop Base Bottom Plate
    const baseGeometry = new THREE.BoxGeometry(6.4, 0.2, 4.4);
    const baseMesh = new THREE.Mesh(baseGeometry, metalMaterial);
    baseMesh.position.set(0, -0.1, 0);
    this.laptopGroup.add(baseMesh);

    // 2. Keyboard Recess & Area
    const keyboardGeometry = new THREE.BoxGeometry(5.6, 0.05, 2.5);
    const keyboardMesh = new THREE.Mesh(keyboardGeometry, darkMetal);
    keyboardMesh.position.set(0, 0.02, -0.4);
    this.laptopGroup.add(keyboardMesh);

    // Glowing Keyboard key rows
    const keyRowGeo = new THREE.BoxGeometry(5.2, 0.04, 0.32);
    const keyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a2333,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.15,
      roughness: 0.3
    });

    for (let r = 0; r < 5; r++) {
      const keyRow = new THREE.Mesh(keyRowGeo, keyMaterial);
      keyRow.position.set(0, 0.06, -1.2 + r * 0.42);
      this.laptopGroup.add(keyRow);
    }

    // 3. Trackpad
    const trackpadGeo = new THREE.BoxGeometry(1.9, 0.02, 1.2);
    const trackpadMat = new THREE.MeshStandardMaterial({
      color: 0x151922,
      metalness: 0.5,
      roughness: 0.5
    });
    const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
    trackpad.position.set(0, 0.03, 1.2);
    this.laptopGroup.add(trackpad);

    // 4. Laptop Lid / Screen Hinge & Frame
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0, -2.15); // Hinge pivot

    const lidFrameGeo = new THREE.BoxGeometry(6.4, 4.3, 0.16);
    const lidFrame = new THREE.Mesh(lidFrameGeo, metalMaterial);
    lidFrame.position.set(0, 2.15, 0);
    lidGroup.add(lidFrame);

    // Glowing Screen Display (Canvas Texture)
    const screenGeo = new THREE.PlaneGeometry(5.8, 3.8);
    const screenMat = new THREE.MeshBasicMaterial({
      map: this.screenTexture,
      side: THREE.FrontSide
    });
    this.screenMesh = new THREE.Mesh(screenGeo, screenMat);
    this.screenMesh.position.set(0, 2.15, 0.09);
    lidGroup.add(this.screenMesh);

    // Apple/Logo Glow on back of lid
    const logoGeo = new THREE.CircleGeometry(0.35, 32);
    const logoMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide
    });
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    logoMesh.position.set(0, 2.15, -0.09);
    logoMesh.rotation.y = Math.PI;
    lidGroup.add(logoMesh);

    // Screen Tilt Angle (Open Laptop at ~105 degrees)
    lidGroup.rotation.x = THREE.MathUtils.degToRad(-15);
    this.laptopGroup.add(lidGroup);

    // Position the whole laptop in the 3D scene (Hero offset right side)
    this.laptopGroup.position.set(3.2, 0.2, 3.0);
    this.laptopGroup.rotation.y = THREE.MathUtils.degToRad(-24);
    this.laptopGroup.rotation.x = THREE.MathUtils.degToRad(12);

    this.scene.add(this.laptopGroup);
  }

  createFloatingShapes() {
    // 1. Crystal Hologram Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(0.9, 0);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0088aa,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: false
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(-4.8, 2.5, 2.0);
    this.scene.add(icoMesh);
    this.floatingShapes.push({ mesh: icoMesh, rx: 0.008, ry: 0.012, speed: 1.5, basePos: icoMesh.position.clone() });

    // Wireframe Cage around Icosahedron
    const wireIcoGeo = new THREE.IcosahedronGeometry(1.15, 1);
    const wireIcoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wireIco = new THREE.Mesh(wireIcoGeo, wireIcoMat);
    wireIco.position.copy(icoMesh.position);
    this.scene.add(wireIco);
    this.floatingShapes.push({ mesh: wireIco, rx: -0.005, ry: -0.009, speed: 1.5, basePos: wireIco.position.clone() });

    // 2. Cyber Torus Knot
    const torusGeo = new THREE.TorusKnotGeometry(0.75, 0.22, 100, 16);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(5.5, -2.8, 1.5);
    this.scene.add(torusMesh);
    this.floatingShapes.push({ mesh: torusMesh, rx: 0.015, ry: 0.01, speed: 2.0, basePos: torusMesh.position.clone() });

    // 3. Octahedron Diamond
    const octaGeo = new THREE.OctahedronGeometry(0.65, 0);
    const octaMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.15
    });
    const octaMesh = new THREE.Mesh(octaGeo, octaMat);
    octaMesh.position.set(-3.5, -3.2, 4.0);
    this.scene.add(octaMesh);
    this.floatingShapes.push({ mesh: octaMesh, rx: -0.01, ry: 0.015, speed: 1.8, basePos: octaMesh.position.clone() });

    // 4. Glowing Sci-Fi Orbit Rings around Laptop
    const ringGeo = new THREE.TorusGeometry(4.8, 0.03, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.4
    });
    this.orbitRing = new THREE.Mesh(ringGeo, ringMat);
    this.orbitRing.position.set(3.2, 0.2, 3.0);
    this.orbitRing.rotation.x = Math.PI / 2.5;
    this.scene.add(this.orbitRing);

    const ringGeo2 = new THREE.TorusGeometry(5.4, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x9333ea,
      transparent: true,
      opacity: 0.35
    });
    this.orbitRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.orbitRing2.position.set(3.2, 0.2, 3.0);
    this.orbitRing2.rotation.x = -Math.PI / 3.2;
    this.orbitRing2.rotation.y = Math.PI / 6;
    this.scene.add(this.orbitRing2);
  }

  createParticleStarfield() {
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00f0ff);
    const colorPurple = new THREE.Color(0xa855f7);
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const mixedColor = Math.random() > 0.5 ? colorCyan : (Math.random() > 0.3 ? colorPurple : colorWhite);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Point Material
    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createSkillsOrbitGalaxy() {
    this.skillsOrbitGroup = new THREE.Group();

    const skills = [
      { name: 'React', color: 0x61dafb, pos: [-4, 1.5, 0] },
      { name: 'Node.js', color: 0x68a063, pos: [4, 1.2, -1] },
      { name: 'MongoDB', color: 0x4db33d, pos: [-2.5, -2, 1] },
      { name: 'Express', color: 0xffffff, pos: [2.5, -2.2, 0.5] },
      { name: 'JavaScript', color: 0xf7df1e, pos: [0, 3.2, -1.5] },
      { name: 'Three.js', color: 0x00f0ff, pos: [0, -3.5, 1.2] }
    ];

    skills.forEach((skill) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(...skill.pos);

      // Glowing Sphere
      const sphereGeo = new THREE.SphereGeometry(0.35, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: skill.color,
        emissive: skill.color,
        emissiveIntensity: 0.4,
        metalness: 0.8,
        roughness: 0.2
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      nodeGroup.add(sphere);

      // Glowing halo ring
      const haloGeo = new THREE.RingGeometry(0.42, 0.5, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: skill.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      nodeGroup.add(halo);

      this.skillsOrbitGroup.add(nodeGroup);
    });

    this.skillsOrbitGroup.position.set(0, -22, 0); // Positioned for Skills section scroll
    this.scene.add(this.skillsOrbitGroup);
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
  }

  onWindowResize() {
    this.windowHalf.x = window.innerWidth / 2;
    this.windowHalf.y = window.innerHeight / 2;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateScreenCodeAnimation(timestamp) {
    if (timestamp - this.lastCodeUpdate > 45) {
      this.lastCodeUpdate = timestamp;

      const currentLine = this.codeLines[this.codeLineIndex];
      if (this.codeCharIndex < currentLine.length) {
        this.codeCharIndex++;
      } else {
        // Next line or loop
        if (this.codeLineIndex < this.codeLines.length - 1) {
          this.codeLineIndex++;
          this.codeCharIndex = 0;
        } else if (timestamp % 5000 < 50) {
          // Reset loop after pause
          this.codeLineIndex = 0;
          this.codeCharIndex = 0;
        }
      }
      this.updateScreenCanvas();
    }
  }

  animate(timestamp = 0) {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth Mouse Interpolation (Lerp)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 1. Update Laptop Code Animation
    this.updateScreenCodeAnimation(timestamp);

    // 2. Laptop 3D Idle Floating & Mouse Parallax
    if (this.laptopGroup) {
      this.laptopGroup.position.y = 0.2 + Math.sin(elapsedTime * 1.4) * 0.18;
      this.laptopGroup.rotation.y = THREE.MathUtils.degToRad(-24) + this.mouse.x * 0.35;
      this.laptopGroup.rotation.x = THREE.MathUtils.degToRad(12) + this.mouse.y * 0.2;

      // Dynamic responsive placement for mobile vs desktop
      if (window.innerWidth < 768) {
        this.laptopGroup.position.x = 0;
        this.laptopGroup.position.z = -1.0;
        this.laptopGroup.scale.set(0.72, 0.72, 0.72);
      } else {
        this.laptopGroup.position.x = 3.2;
        this.laptopGroup.position.z = 3.0;
        this.laptopGroup.scale.set(1.0, 1.0, 1.0);
      }
    }

    // 3. Floating Geometric Shapes Rotation & Float
    this.floatingShapes.forEach((shape) => {
      shape.mesh.rotation.x += shape.rx;
      shape.mesh.rotation.y += shape.ry;
      shape.mesh.position.y = shape.basePos.y + Math.sin(elapsedTime * shape.speed) * 0.28;
    });

    // 4. Orbit Rings Rotation
    if (this.orbitRing) {
      this.orbitRing.rotation.z += 0.006;
    }
    if (this.orbitRing2) {
      this.orbitRing2.rotation.z -= 0.008;
    }

    // 5. Starfield Particle Rotation
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.02 + this.mouse.x * 0.1;
      this.particles.rotation.x = elapsedTime * 0.01 + this.mouse.y * 0.1;
    }

    // 6. Skills Galaxy Orbit Rotation
    if (this.skillsOrbitGroup) {
      this.skillsOrbitGroup.rotation.y = elapsedTime * 0.3;
      this.skillsOrbitGroup.children.forEach((child, idx) => {
        child.rotation.y += 0.02;
      });
    }

    // 7. Scroll-driven Camera Interpolation through Sections
    const targetCamY = -this.scrollProgress * 22;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 0.06;
    this.camera.position.x = this.mouse.x * 0.8;

    // Point lights dynamic color pulse
    if (this.cyanLight) {
      this.cyanLight.intensity = 3.0 + Math.sin(elapsedTime * 2) * 0.8;
    }
    if (this.purpleLight) {
      this.purpleLight.intensity = 2.8 + Math.cos(elapsedTime * 2) * 0.7;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate 3D scene when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.portfolio3D = new Portfolio3DScene();
});
