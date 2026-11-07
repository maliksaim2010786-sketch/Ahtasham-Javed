import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { playClickSound, playHoverSound } from '../utils/audio';

interface Hero3DProps {
  className?: string;
  portraitSrc?: string;
}

export const Hero3D: React.FC<Hero3DProps> = ({
  className = '',
  portraitSrc = '/assets/aistudio/a7c15d4c-657d-49ff-8146-81cda0bb2807_e1ecb5b4.png',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<'avatar' | 'hologram' | 'orbit'>('avatar');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [clearImageMode, setClearImageMode] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Mutable refs for Three.js render loop without remounting
  const modeRef = useRef<'avatar' | 'hologram' | 'orbit'>('avatar');
  const speedRef = useRef<number>(1);
  const rotatingRef = useRef<boolean>(true);
  const isHoveredRef = useRef<boolean>(false);
  const clearModeRef = useRef<boolean>(false);

  modeRef.current = activeMode;
  speedRef.current = speedMultiplier;
  rotatingRef.current = isRotating;
  isHoveredRef.current = isHovered;
  clearModeRef.current = clearImageMode;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.03);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.3, 5.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.minPolarAngle = Math.PI / 3 - 0.2;

    // Studio Quality Lighting - High brightness on front portrait
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const frontKeyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    frontKeyLight.position.set(0, 0.5, 4.5);
    scene.add(frontKeyLight);

    const purpleKeyLight = new THREE.PointLight(0xa855f7, 4.5, 20);
    purpleKeyLight.position.set(3, 2.5, 3.5);
    scene.add(purpleKeyLight);

    const cyanRimLight = new THREE.PointLight(0x06b6d4, 4.5, 20);
    cyanRimLight.position.set(-3, -1, 3);
    scene.add(cyanRimLight);

    const backGlowLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    backGlowLight.position.set(0, 3, -4);
    scene.add(backGlowLight);

    // Master World Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Procedural 3D Cyber Pedestal Base
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.y = -1.45;
    masterGroup.add(pedestalGroup);

    // Base cylinder
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.1, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c16,
      metalness: 0.95,
      roughness: 0.15,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    pedestalGroup.add(baseMesh);

    // Glowing base ring
    const baseRingGeo = new THREE.TorusGeometry(1.58, 0.025, 16, 80);
    const baseRingMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 1,
    });
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.05;
    pedestalGroup.add(baseRing);

    // Inner glowing purple ring
    const innerRingGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 64);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 1,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 0.055;
    pedestalGroup.add(innerRing);

    // 2. 3D Cutout Portrait Plane (Ahtasham Javed)
    const portraitGroup = new THREE.Group();
    masterGroup.add(portraitGroup);

    // Soft cyber aura plate behind portrait
    const auraGeo = new THREE.PlaneGeometry(2.6, 2.6);
    const auraCanvas = document.createElement('canvas');
    auraCanvas.width = 256;
    auraCanvas.height = 256;
    const aCtx = auraCanvas.getContext('2d');
    if (aCtx) {
      const g = aCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      g.addColorStop(0.45, 'rgba(168, 85, 247, 0.25)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      aCtx.fillStyle = g;
      aCtx.fillRect(0, 0, 256, 256);
    }
    const auraTex = new THREE.CanvasTexture(auraCanvas);
    auraTex.colorSpace = THREE.SRGBColorSpace;
    const auraMat = new THREE.MeshBasicMaterial({
      map: auraTex,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.position.z = -0.06;
    portraitGroup.add(auraMesh);

    const textureLoader = new THREE.TextureLoader();
    let portraitMat: THREE.MeshBasicMaterial;
    let portraitMesh: THREE.Mesh;

    // High clarity geometry
    const portraitGeo = new THREE.PlaneGeometry(2.1, 2.7);
    
    // Unlit MeshBasicMaterial ensures 100% natural colors, razor-sharp suit and face details
    portraitMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      alphaTest: 0.02,
    });
    portraitMesh = new THREE.Mesh(portraitGeo, portraitMat);
    portraitMesh.position.y = -0.05;
    portraitGroup.add(portraitMesh);

    // Load the user's high-res cut-out portrait
    textureLoader.load(
      portraitSrc,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;

        portraitMat.map = tex;
        portraitMat.color.setHex(0xffffff);
        portraitMat.transparent = true;
        portraitMat.alphaTest = 0.02;
        portraitMat.opacity = 1;
        portraitMat.needsUpdate = true;
        setImageLoaded(true);
      },
      undefined,
      () => {
        // Fallback
        portraitMat.color.setHex(0x9333ea);
        portraitMat.opacity = 0.9;
      }
    );

    // 3. Holographic Scanning Laser Line
    const scanGeo = new THREE.PlaneGeometry(2.3, 0.04);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const scanBeam = new THREE.Mesh(scanGeo, scanMat);
    scanBeam.position.z = 0.02;
    portraitGroup.add(scanBeam);

    // 4. Gyroscopic 3D Cyber Rings revolving around Ahtasham
    const ringsGroup = new THREE.Group();
    masterGroup.add(ringsGroup);

    // Main Torus Ring (Cyan)
    const ring1Geo = new THREE.TorusGeometry(1.65, 0.03, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.85,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ringsGroup.add(ring1);

    // Tilted Torus Ring (Purple)
    const ring2Geo = new THREE.TorusGeometry(1.85, 0.025, 16, 90);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 0.5,
      metalness: 0.85,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 5;
    ringsGroup.add(ring2);

    // 5. Orbital Satellites / Tech Nodes in 3D
    const nodeCount = 6;
    const nodeGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.9,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 1,
    });
    const satellitesGroup = new THREE.Group();
    masterGroup.add(satellitesGroup);

    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 1.7 + Math.sin(i * 1.5) * 0.25;
      node.position.set(
        Math.cos(angle) * radius,
        -0.4 + Math.sin(angle * 3) * 0.5,
        Math.sin(angle) * radius
      );
      satellitesGroup.add(node);
    }

    // 6. 3D Particle Nebula
    const particleCount = isSoftwareGl ? 250 : 600;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const purpleCol = new THREE.Color(0xa855f7);
    const cyanCol = new THREE.Color(0x06b6d4);
    const blueCol = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      const r = 1.3 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = r * Math.sin(phi);
      particlePositions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

      const mixVal = Math.random();
      const col = mixVal < 0.45 ? purpleCol : mixVal < 0.85 ? cyanCol : blueCol;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particlePoints);

    // Contact Ground Shadow Plate
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
      grad.addColorStop(0.3, 'rgba(168, 85, 247, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.5,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.5;
    scene.add(shadowMesh);

    // Mouse tracking for parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = nx * 0.4;
      mouse.targetY = ny * 0.25;
    };
    window.addEventListener('mousemove', handlePointerMove);

    // Dynamic smoothing variables for hover transitions
    let overlayFade = 1.0;
    let portraitScale = 1.0;

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Exponential damping for smooth mouse follow
      mouse.x = THREE.MathUtils.damp(mouse.x, mouse.targetX, 4, delta);
      mouse.y = THREE.MathUtils.damp(mouse.y, mouse.targetY, 4, delta);

      // Subtle tilt of the master group
      masterGroup.rotation.y = mouse.x * 0.5;
      masterGroup.rotation.x = -mouse.y * 0.3;

      const rotSpeed = rotatingRef.current ? speedRef.current : 0;

      // Check whether user is hovering or has toggled Clear Image Mode
      const isFocused = isHoveredRef.current || clearModeRef.current;
      const targetOverlay = isFocused ? 0.0 : 1.0;
      overlayFade = THREE.MathUtils.damp(overlayFade, targetOverlay, 8, delta);

      // Rotate gyroscopic rings
      ring1.rotation.z += 0.35 * delta * rotSpeed;
      ring1.rotation.y += 0.2 * delta * rotSpeed;

      ring2.rotation.z -= 0.45 * delta * rotSpeed;
      ring2.rotation.x += 0.25 * delta * rotSpeed;

      // Rotate satellites
      satellitesGroup.rotation.y += 0.6 * delta * rotSpeed;

      // Rotate particle nebula
      particlePoints.rotation.y += 0.08 * delta * rotSpeed;

      // Oscillate scanning laser beam
      scanBeam.position.y = Math.sin(elapsed * 2.2) * 1.15;

      // Smoothly hide rings, beam, and satellites during hover so ONLY the clear image shows
      ring1Mat.opacity = 0.85 * overlayFade;
      ring2Mat.opacity = 0.85 * overlayFade;
      ring1.visible = overlayFade > 0.01;
      ring2.visible = overlayFade > 0.01;

      scanBeam.visible = overlayFade > 0.01;
      scanMat.opacity = (modeRef.current === 'hologram' ? 0.9 : 0.4) * overlayFade;

      satellitesGroup.visible = overlayFade > 0.01;
      const sScale = Math.max(0.001, overlayFade);
      satellitesGroup.scale.set(sScale, sScale, sScale);

      // Soften particle field to keep full focus on the clear portrait
      particleMat.opacity = 0.15 + 0.6 * overlayFade;

      // Gently scale up and center portrait on hover
      const targetPortraitScale = isFocused ? 1.15 : 1.0;
      portraitScale = THREE.MathUtils.damp(portraitScale, targetPortraitScale, 6, delta);
      portraitGroup.scale.set(portraitScale, portraitScale, portraitScale);

      // Floating gentle bobbing (relaxed during clear view)
      portraitGroup.position.y = isFocused ? 0.02 : Math.sin(elapsed * 1.8) * 0.05;

      // Mode adaptations when not in clear view
      const curMode = modeRef.current;
      if (curMode === 'hologram') {
        auraMat.opacity = 0.9;
        ring1Mat.emissiveIntensity = 0.8;
        ring2Mat.emissiveIntensity = 0.8;
      } else if (curMode === 'orbit') {
        auraMat.opacity = 0.5;
        ring1Mat.emissiveIntensity = 0.6;
        ring2Mat.emissiveIntensity = 0.6;
      } else {
        // avatar mode
        auraMat.opacity = isFocused ? 0.85 : 0.6;
      }

      controls.update();
      renderer.render(scene, camera);

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      controls.dispose();

      baseGeo.dispose();
      baseMat.dispose();
      baseRingGeo.dispose();
      baseRingMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      auraGeo.dispose();
      auraMat.dispose();
      auraTex.dispose();
      portraitGeo.dispose();
      portraitMat.dispose();
      scanGeo.dispose();
      scanMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [portraitSrc]);

  return (
    <div
      className={`relative w-full h-full select-none ${className}`}
      onMouseEnter={() => {
        setIsHovered(true);
        playHoverSound();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Hover to view clean clear portrait. Drag to rotate in 360°"
      />

      {/* Floating Active Indicator when Clear View is triggered */}
      {(isHovered || clearImageMode) && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-300 uppercase">
            Solo Clear Image View
          </span>
        </div>
      )}

      {/* Floating 3D Interaction Control Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 p-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs text-slate-300 shadow-2xl max-w-[96%]">
        <div className="flex items-center gap-1 px-1">
          <button
            onClick={() => {
              playClickSound();
              setClearImageMode(!clearImageMode);
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              clearImageMode
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
            title="Click to toggle Clear Portrait View on/off"
          >
            <span>✨</span>
            <span>{clearImageMode ? 'Clear ON' : 'Clear Image'}</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode('avatar');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeMode === 'avatar' && !clearImageMode
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Avatar
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveMode('hologram');
            }}
            className={`px-2 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeMode === 'hologram' && !clearImageMode
                ? 'bg-cyan-600/80 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Holo
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveMode('orbit');
            }}
            className={`px-2 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeMode === 'orbit' && !clearImageMode
                ? 'bg-purple-600/80 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Orbit
          </button>
        </div>

        <div className="w-[1px] h-3 bg-white/15 mx-1" />

        <button
          onClick={() => {
            playClickSound();
            setIsRotating(!isRotating);
          }}
          className={`px-2 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer ${
            isRotating ? 'text-cyan-400' : 'text-slate-500'
          }`}
          title={isRotating ? 'Pause rotation' : 'Resume rotation'}
        >
          {isRotating ? 'ROT' : 'OFF'}
        </button>

        <button
          onClick={() => {
            playClickSound();
            setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1));
          }}
          className="px-2 py-1 rounded-full text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
          title="Cycle orbital speed"
        >
          {speedMultiplier}x
        </button>
      </div>
    </div>
  );
};
