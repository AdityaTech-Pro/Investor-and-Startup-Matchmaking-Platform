import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CONFIG = {
  PARTICLE_COUNT: 5000,
  PARTICLE_SIZE: 0.02,
  PARTICLE_FRICTION: 0.96,
  FORCE_STRENGTH: 0.0055,
  RESET_DISTANCE: 0.2,
  TEXTURE_SIZE: 32,
  SCROLL_THROTTLE: 16,
  MOUSE_SMOOTHING: 0.01,
};

export const ParticleAnimation = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);
  const geometryRef = useRef(null);
  const materialRef = useRef(null);
  const animationIdRef = useRef(null);
  
  // State variables
  const stateRef = useRef({
    mouseX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    mouseY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    targetMouseX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    targetMouseY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    lastScrollTime: 0,
    frameCount: 0,
    resizeTimeout: null,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // ==================== TEXTURE CREATION ====================
    const createFireTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = CONFIG.TEXTURE_SIZE;
      canvas.height = CONFIG.TEXTURE_SIZE;
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      if (!ctx) return new THREE.CanvasTexture(canvas);
      
      const centerX = CONFIG.TEXTURE_SIZE / 2;
      const grad = ctx.createRadialGradient(centerX, centerX, 0, centerX, centerX, centerX);
      grad.addColorStop(0, 'white');
      grad.addColorStop(0.3, '#ffae00');
      grad.addColorStop(0.6, '#ff4e00');
      grad.addColorStop(1, 'black');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerX, centerX, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(canvas);
    };

    // ==================== SCENE INITIALIZATION ====================
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // ==================== RENDERER SETUP ====================
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'lowp',
    });
    
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0500, 0);
    renderer.sortObjects = false;
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '1';
    containerRef.current.appendChild(renderer.domElement);

    // ==================== GEOMETRY SETUP ====================
    const geometry = new THREE.BufferGeometry();
    geometryRef.current = geometry;
    
    const positions = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
    const velocities = new Float32Array(CONFIG.PARTICLE_COUNT * 3);

    // ==================== PARTICLE RESET FUNCTION ====================
    const resetParticle = (i) => {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = Math.random() > 0.5 ? 8 : -8;
      positions[i3 + 2] = (Math.random() - 0.5) * 5;
      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;
    };

    // Initialize all particles
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      resetParticle(i);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // ==================== MATERIAL CREATION ====================
    const material = new THREE.PointsMaterial({
      size: CONFIG.PARTICLE_SIZE,
      map: createFireTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    materialRef.current = material;

    // ==================== PARTICLES CREATION ====================
    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);
    camera.position.z = 8;

    // ==================== MOUSE TO 3D CONVERSION ====================
    const getMouseTarget = () => {
      const normalizedX = (stateRef.current.mouseX / window.innerWidth) * 2 - 1;
      const normalizedY = -(stateRef.current.mouseY / window.innerHeight) * 2 + 1;

      const vFOV = camera.fov * Math.PI / 180;
      const height = 2 * Math.tan(vFOV / 2) * camera.position.z;
      const width = height * camera.aspect;
      const x = (normalizedX * width) / 2;
      const y = (normalizedY * height) / 2;

      return new THREE.Vector3(x, y, 0);
    };

    // ==================== ANIMATION LOOP ====================
    const posArray = geometry.attributes.position.array;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Smooth mouse position interpolation
      stateRef.current.mouseX += (stateRef.current.targetMouseX - stateRef.current.mouseX) * CONFIG.MOUSE_SMOOTHING;
      stateRef.current.mouseY += (stateRef.current.targetMouseY - stateRef.current.mouseY) * CONFIG.MOUSE_SMOOTHING;

      const mouseTarget = getMouseTarget();

      for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const dx = mouseTarget.x - posArray[i3];
        const dy = mouseTarget.y - posArray[i3 + 1];
        const dz = mouseTarget.z - posArray[i3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;
        const distance = Math.sqrt(distSq);

        if (distance < 0.001) {
          resetParticle(i);
          continue;
        }

        const force = CONFIG.FORCE_STRENGTH / (distance + 0.5);

        velocities[i3] += dx * force;
        velocities[i3 + 1] += dy * force;
        velocities[i3 + 2] += dz * force;

        posArray[i3] += velocities[i3];
        posArray[i3 + 1] += velocities[i3 + 1];
        posArray[i3 + 2] += velocities[i3 + 2];

        velocities[i3] *= CONFIG.PARTICLE_FRICTION;
        velocities[i3 + 1] *= CONFIG.PARTICLE_FRICTION;
        velocities[i3 + 2] *= CONFIG.PARTICLE_FRICTION;

        if (distance < CONFIG.RESET_DISTANCE) {
          resetParticle(i);
        }
      }

      (geometry.attributes.position).needsUpdate = true;
      renderer.render(scene, camera);
      stateRef.current.frameCount++;
    };

    animate();

    // ==================== EVENT HANDLERS ====================
    const handleMouseMove = (event) => {
      stateRef.current.targetMouseX = event.clientX;
      stateRef.current.targetMouseY = event.clientY;
    };

    const handleScroll = () => {
      const now = Date.now();
      if (now - stateRef.current.lastScrollTime > CONFIG.SCROLL_THROTTLE) {
        stateRef.current.lastScrollTime = now;
      }
    };

    const handleResize = () => {
      clearTimeout(stateRef.current.resizeTimeout);
      stateRef.current.resizeTimeout = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 100);
    };

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup
    return () => {
      try {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        if (stateRef.current.resizeTimeout) clearTimeout(stateRef.current.resizeTimeout);

        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }

        geometry.dispose();
        material.dispose();
        renderer.dispose();
      } catch (error) {
        console.error('Error cleaning up Three.js:', error);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1 }} />;
};
