import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { playClickSound } from '../utils/audio';

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
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Mutable refs for Three.js render loop without remounting
  const modeRef = useRef<'avatar' | 'hologram' | 'orbit'>('avatar');
  const speedRef = useRef<number>(1);
  const rotatingRef = useRef<boolean>(true);

  modeRef.current = activeMode;
  speedRef.current = speedMultiplier;
  rotatingRef.current = isRotating;

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
    scene.fog = new THREE.FogExp2(0x050508, 0.035);

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
    renderer.toneMappingExposure = 1.25;
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

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0f1123, 1.8);
    scene.add(ambientLight);

    const purpleKeyLight = new THREE.PointLight(0xa855f7, 5, 20);
    purpleKeyLight.position.set(3, 2.5, 3.5);
    scene.add(purpleKeyLight);

    const cyanRimLight = new THREE.PointLight(0x06b6d4, 5, 20);
    cyanRimLight.position.set(-3, -1, 3);
    scene.add(cyanRimLight);

    const backGlowLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
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
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 0.055;
    pedestalGroup.add(innerRing);

    // 2. 3D Cutout Portrait Plane (Ahtasham Javed)
    const portraitGroup = new THREE.Group();
    masterGroup.add(portraitGroup);

    const textureLoader = new THREE.TextureLoader();
    let portraitMat: THREE.MeshStandardMaterial;
    let portraitMesh: THREE.Mesh;

    // Default placeholder geometry
    const portraitGeo = new THREE.PlaneGeometry(2.1, 2.7);
    
    // Fallback material while texture loads
    portraitMat = new THREE.MeshStandardMaterial({
      color: 0x22223b,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
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
        portraitMat.alphaTest = 0.08;
        portraitMat.roughness = 0.25;
        portraitMat.metalness = 0.15;
        portraitMat.opacity = 1;
        portraitMat.needsUpdate = true;
        setImageLoaded(true);
      },
      undefined,
      () => {
        // Fallback
        portraitMat.color.setHex(0x9333ea);
        portraitMat.opacity = 0.8;
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

      // Floating gentle bobbing
      portraitGroup.position.y = Math.sin(elapsed * 1.8) * 0.05;

      // Mode adaptations
      const curMode = modeRef.current;
      if (curMode === 'hologram') {
        scanBeam.visible = true;
        scanMat.opacity = 0.9;
        ring1Mat.emissiveIntensity = 0.8;
        ring2Mat.emissiveIntensity = 0.8;
        portraitMat.emissive = new THREE.Color(0x06b6d4);
        portraitMat.emissiveIntensity = 0.2;
      } else if (curMode === 'orbit') {
        scanBeam.visible = false;
        ring1Mat.emissiveIntensity = 0.6;
        ring2Mat.emissiveIntensity = 0.6;
        portraitMat.emissive = new THREE.Color(0x9333ea);
        portraitMat.emissiveIntensity = 0.15;
      } else {
        // avatar mode
        scanBeam.visible = true;
        scanMat.opacity = 0.4;
        portraitMat.emissiveIntensity = 0.05;
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
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate Ahtasham's 3D avatar & scene in 360°"
      />

      {/* Floating 3D Interaction Control Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 p-1.5 rounded-full bg-black/65 dark:bg-black/75 backdrop-blur-md border border-white/10 text-xs text-slate-300 shadow-xl max-w-[94%]">
        <div className="flex items-center gap-1 px-1">
          <button
            onClick={() => {
              playClickSound();
              setActiveMode('avatar');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              activeMode === 'avatar'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Avatar
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveMode('hologram');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              activeMode === 'hologram'
                ? 'bg-cyan-600/80 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Holo Scan
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveMode('orbit');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              activeMode === 'orbit'
                ? 'bg-purple-600/80 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cyber Orbit
          </button>
        </div>

        <div className="w-[1px] h-3 bg-white/15 mx-1" />

        <button
          onClick={() => {
            playClickSound();
            setIsRotating(!isRotating);
          }}
          className={`px-2 py-1 rounded-full text-xs font-mono transition-colors ${
            isRotating ? 'text-cyan-400' : 'text-slate-500'
          }`}
          title={isRotating ? 'Pause rotation' : 'Resume rotation'}
        >
          {isRotating ? 'ROT:ON' : 'ROT:OFF'}
        </button>

        <button
          onClick={() => {
            playClickSound();
            setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1));
          }}
          className="px-2 py-1 rounded-full text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors"
          title="Cycle orbital speed"
        >
          {speedMultiplier}x
        </button>
      </div>
    </div>
  );
};
