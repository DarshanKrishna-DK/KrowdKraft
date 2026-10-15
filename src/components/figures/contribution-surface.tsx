'use client';
import { useEffect, useRef, useState } from 'react';

// A decorative height field, deliberately independent of leaderboard metrics.
export function ContributionSurface() {
  const root = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let dispose = () => {},
      cancelled = false;
    import('three')
      .then((THREE) => {
        if (cancelled) return;
        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
        } catch {
          return;
        }
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
        renderer.setClearColor(0, 0);
        element.prepend(renderer.domElement);
        renderer.domElement.setAttribute('aria-hidden', 'true');
        const scene = new THREE.Scene(),
          camera = new THREE.OrthographicCamera(-7, 7, 5, -5, 0.1, 100);
        camera.position.set(10, 9, 10);
        camera.lookAt(0, 0.4, 0);
        const count = 41,
          positions = new Float32Array(count * count * 3),
          rest = new Float32Array(count * count);
        for (let x = 0; x < count; x++)
          for (let z = 0; z < count; z++) {
            const i = x * count + z,
              wx = (x - 20) * 0.19,
              wz = (z - 20) * 0.19;
            const y =
              1.45 * Math.exp(-((wx + 1.1) ** 2 + (wz - 0.8) ** 2) / 3) +
              0.7 * Math.exp(-((wx - 1.9) ** 2 + (wz + 1.7) ** 2) / 1.1);
            positions.set([wx, y, wz], i * 3);
            rest[i] = y;
          }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0x9d526b, size: 0.043, sizeAttenuation: true });
        const points = new THREE.Points(geometry, material);
        scene.add(points);
        const board = new THREE.Mesh(
          new THREE.BoxGeometry(8.5, 0.12, 8.5),
          new THREE.MeshStandardMaterial({ color: 0xf1ddd7, metalness: 0.16, roughness: 0.5 }),
        );
        board.position.y = -0.21;
        scene.add(board);
        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(board.geometry),
          new THREE.LineBasicMaterial({ color: 0xc9a7b3 }),
        );
        edges.position.copy(board.position);
        scene.add(edges);
        scene.add(new THREE.AmbientLight(0xfff5ef, 2));
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(-4, 9, 6);
        scene.add(light);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
          ray = new THREE.Raycaster(),
          target = new THREE.Vector3(),
          pointer = new THREE.Vector2();
        let active = false,
          visible = false,
          frame = 0,
          last = 0,
          px = 0,
          pz = 0;
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        const draw = (time: number) => {
          frame = 0;
          if (!visible || document.hidden) return;
          const dt = Math.min((time - last) / 1000 || 0.016, 0.05);
          last = time;
          let moving = false;
          for (let i = 0; i < rest.length; i++) {
            const p = i * 3,
              dx = positions[p] - px,
              dz = positions[p + 2] - pz;
            const desired = rest[i] + (active ? 0.9 * Math.exp(-(dx * dx + dz * dz) / 1.5) : 0);
            const diff = desired - positions[p + 1];
            if (Math.abs(diff) > 0.001) moving = true;
            positions[p + 1] += reduced.matches ? diff : diff * Math.min(1, dt * 9);
          }
          geometry.attributes.position.needsUpdate = true;
          renderer.render(scene, camera);
          if (moving && !reduced.matches) frame = requestAnimationFrame(draw);
        };
        const wake = () => {
          if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
        };
        const move = (event: PointerEvent) => {
          const box = element.getBoundingClientRect();
          pointer.set(
            ((event.clientX - box.left) / box.width) * 2 - 1,
            (-(event.clientY - box.top) / box.height) * 2 + 1,
          );
          ray.setFromCamera(pointer, camera);
          if (ray.ray.intersectPlane(plane, target)) {
            px = Math.max(-4, Math.min(4, target.x));
            pz = Math.max(-4, Math.min(4, target.z));
            active = true;
            wake();
          }
        };
        const leave = () => {
          active = false;
          wake();
        };
        const resize = new ResizeObserver(() => {
          const { width, height } = element.getBoundingClientRect();
          renderer.setSize(width, height);
          const aspect = width / height;
          camera.left = -5.5 * aspect;
          camera.right = 5.5 * aspect;
          camera.top = 5.5;
          camera.bottom = -5.5;
          camera.updateProjectionMatrix();
          wake();
        });
        resize.observe(element);
        const observer = new IntersectionObserver((entries) => {
          visible = entries[0].isIntersecting;
          if (!visible) {
            cancelAnimationFrame(frame);
            frame = 0;
          } else wake();
        });
        observer.observe(element);
        element.addEventListener('pointermove', move);
        element.addEventListener('pointerleave', leave);
        document.addEventListener('visibilitychange', wake);
        reduced.addEventListener('change', wake);
        setRendered(true);
        dispose = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          resize.disconnect();
          element.removeEventListener('pointermove', move);
          element.removeEventListener('pointerleave', leave);
          document.removeEventListener('visibilitychange', wake);
          reduced.removeEventListener('change', wake);
          geometry.dispose();
          material.dispose();
          board.geometry.dispose();
          board.material.dispose();
          edges.geometry.dispose();
          edges.material.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => {
        /* The static height field remains available if WebGL cannot load. */
      });
    return () => {
      cancelled = true;
      dispose();
    };
  }, []);
  return (
    <div
      ref={root}
      className="surface-scene"
      data-rendered={rendered}
      role="img"
      aria-label="An interactive isometric field of dots, rising into a sculpted landscape"
    >
      <svg className="surface-fallback" viewBox="0 0 500 360" aria-hidden="true">
        {Array.from({ length: 25 }, (_, x) =>
          Array.from({ length: 25 }, (_, y) => {
            const z = 35 * Math.exp(-((x - 9) ** 2 + (y - 15) ** 2) / 40);
            return (
              <circle
                key={x + '-' + y}
                cx={250 + (x - y) * 8}
                cy={80 + (x + y) * 4 - z}
                r="1.1"
                fill="#9d526b"
              />
            );
          }),
        )}
      </svg>
      <div className="surface-caption">
        <span>01 / Surface study</span>
        <span>Move your pointer</span>
      </div>
    </div>
  );
}
