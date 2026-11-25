import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CONFIG = {
  PARTICLE_COUNT: 6000,
  PARTICLE_SIZE: 0.02,
  PARTICLE_FRICTION: 0.98,
  FORCE_STRENGTH: 0.0055,
  RESET_DISTANCE: 0.2,
  TEXTURE_SIZE: 32,
  SCROLL_THROTTLE: 16,
  MOUSE_SMOOTHING: 0.025,
};

export const ThreeAnimation = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // State variables
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let targetMouseX = mouseX;
      let targetMouseY = mouseY;
      let scrollProgress = 0;
      let lastScrollTime = 0;
      let frameCount = 0;
      let resizeTimeout = null;

      // Scene initialization
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      });
      rendererRef.current = renderer;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.sortObjects = false;
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.position = 'fixed';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.zIndex = '1';
      containerRef.current.appendChild(renderer.domElement);

      // Create fire texture
      const createFireTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = CONFIG.TEXTURE_SIZE;
        canvas.height = CONFIG.TEXTURE_SIZE;
        const ctx = canvas.getContext('2d', { willReadFrequently: false });
        const centerX = CONFIG.TEXTURE_SIZE / 2;
        const grad = ctx.createRadialGradient(
          centerX,
          centerX,
          0,
          centerX,
          centerX,
          centerX
        );
        
        // Light theme colors
        grad.addColorStop(0, 'rgba(59, 130, 246, 1)');
        grad.addColorStop(0.3, 'rgba(139, 92, 246, 0.8)');
        grad.addColorStop(0.6, 'rgba(59, 130, 246, 0.3)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerX, centerX, 0, Math.PI * 2);
        ctx.fill();
        return new THREE.CanvasTexture(canvas);
      };

      // Geometry setup
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
      const velocities = new Float32Array(CONFIG.PARTICLE_COUNT * 3);

      // Particle reset function
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

      // Material creation
      const material = new THREE.PointsMaterial({
        size: CONFIG.PARTICLE_SIZE * 1.5,
        map: createFireTexture(),
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      // Particles creation
      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      camera.position.z = 8;

      // Mouse to 3D conversion
      const getMouseTarget = () => {
        const normalizedX = (mouseX / window.innerWidth) * 2 - 1;
        const normalizedY = -(mouseY / window.innerHeight) * 2 + 1;

        const vFOV = (camera.fov * Math.PI) / 180;
        const height = 2 * Math.tan(vFOV / 2) * camera.position.z;
        const width = height * camera.aspect;

        const x = (normalizedX * width) / 2;
        const y = (normalizedY * height) / 2;

        return new THREE.Vector3(x, y, 0);
      };

      // Animation loop
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);

        mouseX += (targetMouseX - mouseX) * CONFIG.MOUSE_SMOOTHING;
        mouseY += (targetMouseY - mouseY) * CONFIG.MOUSE_SMOOTHING;

        const posArray = geometry.attributes.position.array;
        const mouseTarget = getMouseTarget();

        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          const dx = mouseTarget.x - posArray[i3];
          const dy = mouseTarget.y - posArray[i3 + 1];
          const dz = mouseTarget.z - posArray[i3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;
          const distance = Math.sqrt(distSq);
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
        frameCount++;
      };

      animate();

      // Event handlers
      const handleMouseMove = (event) => {
        targetMouseX = event.clientX;
        targetMouseY = event.clientY;
      };

      const handleScroll = () => {
        const now = Date.now();
        if (now - lastScrollTime > CONFIG.SCROLL_THROTTLE) {
          scrollProgress =
            window.scrollY / (document.body.scrollHeight - window.innerHeight);
          lastScrollTime = now;
        }
      };

      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
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
          if (resizeTimeout) clearTimeout(resizeTimeout);

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
    } catch (error) {
      console.error('Error initializing Three.js animation:', error);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100vh', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        zIndex: 1 
      }} 
    />
  );
};
