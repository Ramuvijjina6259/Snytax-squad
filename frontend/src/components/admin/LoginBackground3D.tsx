import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LoginBackground3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    
    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 2000);
    camera.position.z = 800;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050505, 1); // Strict premium dark monochrome background
    container.appendChild(renderer.domElement);

    // --- Particle System Setup ---
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Position points randomly in a broad sphere/cube range
      positions[i * 3] = (Math.random() - 0.5) * 1500;     // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1500; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1500; // Z

      // Dynamic velocities for slight floating turbulence
      velocities.push({
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Clean monochrome particle style
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2.2,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- Subtle plexus lines connecting nearby particles ---
    // Creating faint lines creates a high-quality "syntax/networking" tech feeling
    const lineCount = 150;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(lineCount * 2 * 3); // 2 points per line, 3 coordinates
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- Interactive Parallax & Animation Properties ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- Resize Event ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow overall rotation of the coordinate system
      particles.rotation.y += 0.0006;
      particles.rotation.x += 0.0002;
      lines.rotation.y += 0.0006;
      lines.rotation.x += 0.0002;

      // Animate individual particles slightly for natural floating dynamics
      const positionsArr = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positionsArr[i * 3] += velocities[i].x;
        positionsArr[i * 3 + 1] += velocities[i].y;
        positionsArr[i * 3 + 2] += velocities[i].z;

        // Wrap around boundaries
        if (Math.abs(positionsArr[i * 3]) > 750) positionsArr[i * 3] *= -0.95;
        if (Math.abs(positionsArr[i * 3 + 1]) > 750) positionsArr[i * 3 + 1] *= -0.95;
        if (Math.abs(positionsArr[i * 3 + 2]) > 750) positionsArr[i * 3 + 2] *= -0.95;
      }
      geometry.attributes.position.needsUpdate = true;

      // Update lines based on nearby particles
      let lineIndex = 0;
      const linePosArr = lineGeometry.attributes.position.array as Float32Array;

      // Connect particles that are close to each other
      for (let i = 0; i < particleCount && lineIndex < lineCount; i++) {
        const x1 = positionsArr[i * 3];
        const y1 = positionsArr[i * 3 + 1];
        const z1 = positionsArr[i * 3 + 2];

        for (let j = i + 1; j < particleCount && lineIndex < lineCount; j++) {
          const x2 = positionsArr[j * 3];
          const y2 = positionsArr[j * 3 + 1];
          const z2 = positionsArr[j * 3 + 2];

          // Compute Euclidean distance square
          const distSq = (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2;
          if (distSq < 15000) { // square of distance ~120px
            // Start node of line segment
            linePosArr[lineIndex * 6] = x1;
            linePosArr[lineIndex * 6 + 1] = y1;
            linePosArr[lineIndex * 6 + 2] = z1;
            // End node of line segment
            linePosArr[lineIndex * 6 + 3] = x2;
            linePosArr[lineIndex * 6 + 4] = y2;
            linePosArr[lineIndex * 6 + 5] = z2;
            lineIndex++;
          }
        }
      }
      lineGeometry.attributes.position.needsUpdate = true;

      // Smooth lag interpolation for parallax movement
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      // Restrict translation range to keep form elements centered
      camera.position.x = targetX * 0.75;
      camera.position.y = -targetY * 0.75;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Clean up WebGL resources
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
}
