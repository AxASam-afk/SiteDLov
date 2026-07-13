/* ═══════════════════════════════════════════════════════════
   scene3d.js — Three.js : particules hero + cœur low-poly
   Style Gorillaz / streetwear / nuit étoilée
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── HERO — Champ d'étoiles / particules ─── */
  function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

    const particleCount = isMobile ? 400 : 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const palette = [
      new THREE.Color(0xD4AF37),
      new THREE.Color(0x00E5FF),
      new THREE.Color(0xFF2D6B),
      new THREE.Color(0xFFF8F0),
      new THREE.Color(0xC8FF00),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.04 : 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    /* Low-poly floating shapes (Gorillaz vibe) */
    if (!isMobile && !prefersReducedMotion) {
      const shapes = [];
      const shapeColors = [0xFF2D6B, 0x00E5FF, 0xC8FF00, 0xD4AF37];

      for (let i = 0; i < 5; i++) {
        const geo = i % 2 === 0
          ? new THREE.TetrahedronGeometry(0.15 + Math.random() * 0.2, 0)
          : new THREE.OctahedronGeometry(0.12 + Math.random() * 0.15, 0);

        const mat = new THREE.MeshBasicMaterial({
          color: shapeColors[i % shapeColors.length],
          wireframe: true,
          transparent: true,
          opacity: 0.5,
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4 - 2
        );
        mesh.userData.rotSpeed = (Math.random() - 0.5) * 0.02;
        scene.add(mesh);
        shapes.push(mesh);
      }

      scene.userData.shapes = shapes;
    }

    let mouseX = 0;
    let mouseY = 0;

    if (!prefersReducedMotion) {
      document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });
    }

    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;

        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        if (scene.userData.shapes) {
          scene.userData.shapes.forEach((s) => {
            s.rotation.x += s.userData.rotSpeed;
            s.rotation.y += s.userData.rotSpeed * 1.5;
          });
        }
      }

      renderer.render(scene, camera);
    }

    if (!prefersReducedMotion) animate();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    return { scene, camera, renderer, animate, animId };
  }

  /* ─── FOOTER — Cœur low-poly ─── */
  function initHeartScene() {
    const canvas = document.getElementById('heart-canvas');
    if (!canvas || typeof THREE === 'undefined') return null;

    const size = 120;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* Cœur low-poly via lathe + decimation manuelle */
    const heartShape = [];
    const segments = 16;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      heartShape.push(new THREE.Vector2(x * 0.03, y * 0.03));
    }

    const latheGeo = new THREE.LatheGeometry(heartShape, isMobile ? 6 : 10);
    latheGeo.computeVertexNormals();

    /* Faceted look — flat shading */
    const heartMat = new THREE.MeshPhongMaterial({
      color: 0xFF2D6B,
      emissive: 0xFF2D6B,
      emissiveIntensity: 0.3,
      flatShading: true,
      shininess: 80,
      transparent: true,
      opacity: 0.95,
    });

    const heart = new THREE.Mesh(latheGeo, heartMat);
    scene.add(heart);

    /* Wireframe overlay — streetwear edge */
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wireHeart = new THREE.Mesh(latheGeo.clone(), wireMat);
    wireHeart.scale.set(1.02, 1.02, 1.02);
    scene.add(wireHeart);

    /* Accent low-poly shard */
    const shardGeo = new THREE.TetrahedronGeometry(0.25, 0);
    const shardMat = new THREE.MeshBasicMaterial({ color: 0xC8FF00, wireframe: true });
    const shard = new THREE.Mesh(shardGeo, shardMat);
    shard.position.set(0.6, 0.5, 0.3);
    scene.add(shard);

    const light = new THREE.PointLight(0xD4AF37, 1.5, 10);
    light.position.set(2, 2, 3);
    scene.add(light);

    const light2 = new THREE.PointLight(0x00E5FF, 0.8, 10);
    light2.position.set(-2, -1, 2);
    scene.add(light2);

    scene.add(new THREE.AmbientLight(0x141932, 0.5));

    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        heart.rotation.y += 0.008;
        wireHeart.rotation.y += 0.008;
        shard.rotation.x += 0.02;
        shard.rotation.z += 0.015;
      }

      renderer.render(scene, camera);
    }

    if (!prefersReducedMotion) animate();

    return { scene, heart, animate, animId };
  }

  /* ─── Init ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeroScene();
      initHeartScene();
    });
  } else {
    initHeroScene();
    initHeartScene();
  }
})();
