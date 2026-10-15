'use client';
import { useEffect, useRef, useState } from 'react';
const labels = [
  'An open book turning its pages beside a curious walking workshop robot',
  'An active coding workstation beside a workshop robot checking its wrist display',
  'A presentation board, microphone and a workshop robot walking over to wave hello',
];
export function ChapterScene({ chapter }: { chapter: number }) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cancelled = false,
      dispose = () => {};
    setReady(false);
    Promise.all([import('three'), import('three/addons/geometries/RoundedBoxGeometry.js')])
      .then(([T, { RoundedBoxGeometry }]) => {
        if (cancelled) return;
        let renderer: InstanceType<typeof T.WebGLRenderer>;
        try {
          renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
        } catch {
          return;
        }
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        renderer.setClearColor(0, 0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = T.PCFShadowMap;
        el.prepend(renderer.domElement);
        renderer.domElement.setAttribute('aria-hidden', 'true');
        renderer.domElement.dataset.activity = ['learn', 'build', 'share'][chapter];
        const scene = new T.Scene(),
          camera = new T.OrthographicCamera(-5.8, 5.8, 4.5, -4.5, 0.1, 100);
        camera.position.set(10, 10, 13);
        camera.lookAt(0, 0.8, 0);
        const group = new T.Group();
        scene.add(group);
        const cream = new T.MeshPhysicalMaterial({
          color: 0xf4d9df,
          metalness: 0.12,
          roughness: 0.32,
          clearcoat: 0.8,
        });
        const pink = new T.MeshPhysicalMaterial({
          color: 0xb56e94,
          metalness: 0.35,
          roughness: 0.3,
          clearcoat: 1,
        });
        const deep = new T.MeshStandardMaterial({ color: 0x332435, metalness: 0.4, roughness: 0.45 });
        const paper = new T.MeshStandardMaterial({ color: 0xf6ece8, roughness: 0.65 });
        const screen = new T.MeshStandardMaterial({ color: 0x191821, roughness: 0.2 });
        const lit = new T.MeshStandardMaterial({
          color: 0xffc6df,
          emissive: 0xa43d78,
          emissiveIntensity: 0.6,
        });
        const materials = [cream, pink, deep, paper, screen, lit];
        let animateProps = (_time: number, _still: boolean) => {};
        const box = (
          w: number,
          h: number,
          d: number,
          x: number,
          y: number,
          z: number,
          mat: import('three').Material = cream,
          parent = group,
          r = 0.06,
        ) => {
          const mesh = new T.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 3, h / 3, d / 3)), mat);
          mesh.position.set(x, y, z);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          parent.add(mesh);
          return mesh;
        };
        box(7.4, 0.26, 5.4, 0, -0.15, 0, deep);
        box(7.1, 0.045, 5.1, 0, 0.01, 0, pink);
        // Surface registration dots sit flush on the platform.
        const dotGeo = new T.SphereGeometry(0.018, 6, 4);
        for (let x = -3; x <= 3; x += 0.4)
          for (let z = -2; z <= 2; z += 0.4) {
            const dot = new T.Mesh(dotGeo, cream);
            dot.position.set(x, 0.05, z);
            group.add(dot);
          }
        if (chapter === 0) {
          const books = new T.Group();
          books.position.set(-1.8, 0, -0.9);
          group.add(books);
          for (let i = 0; i < 3; i++) {
            const b = new T.Group();
            b.rotation.y = i * 0.12;
            b.position.y = 0.16 + i * 0.26;
            books.add(b);
            box(2.2, 0.23, 1.7, 0, 0, 0, i % 2 ? pink : deep, b);
            box(2.08, 0.15, 1.6, 0.04, 0, 0.03, paper, b);
            box(0.09, 0.23, 1.7, -1.05, 0, 0, pink, b);
          }
          const open = new T.Group();
          open.position.set(0.25, 0.52, 0.8);
          open.rotation.x = -0.22;
          group.add(open);
          for (const side of [-1, 1]) {
            const leaf = new T.Group();
            leaf.rotation.z = side * -0.12;
            open.add(leaf);
            box(1.65, 0.12, 2.25, side * 0.83, 0, 0, pink, leaf);
            box(1.5, 0.13, 2.1, side * 0.81, 0.13, 0, paper, leaf);
            for (let i = 0; i < 7; i++)
              box(
                1.05,
                0.012,
                0.025,
                side * 0.82,
                0.205,
                -0.72 + i * 0.19,
                i === 0 ? pink : deep,
                leaf,
                0.001,
              );
          }
          box(0.09, 0.03, 2.3, 0, 0.25, 0.1, pink, open);
          const turningPage = new T.Group();
          turningPage.position.y = 0.23;
          open.add(turningPage);
          box(1.47, 0.018, 2.06, 0.755, 0, 0, paper, turningPage, 0.004);
          for (let line = 0; line < 6; line++)
            box(1.01, 0.006, 0.02, 0.76, 0.012, -0.69 + line * 0.2, line ? deep : pink, turningPage, 0.001);
          animateProps = (time, still) => {
            const cycle = time % 8;
            const progress = Math.min(1, Math.max(0, (cycle - 2) / 2.2));
            turningPage.rotation.z = still ? 0.08 : progress * progress * (3 - 2 * progress) * Math.PI;
            turningPage.visible = still || cycle < 4.3;
          };
        } else if (chapter === 1) {
          const laptop = new T.Group();
          laptop.position.set(-0.65, 0, 0.1);
          laptop.rotation.y = -0.16;
          group.add(laptop);
          box(3.4, 0.17, 2.3, 0, 0.18, 0.5, cream, laptop);
          const display = new T.Group();
          display.position.set(0, 1.45, -0.54);
          display.rotation.x = -0.16;
          laptop.add(display);
          box(3.4, 2.5, 0.16, 0, 0, 0, pink, display);
          box(3.12, 2.2, 0.05, 0, 0, 0.11, screen, display);
          for (let row = 0; row < 7; row++) {
            box(
              0.4 + (row % 3) * 0.45,
              0.055,
              0.02,
              -0.7 + (row % 2) * 0.18,
              0.7 - row * 0.23,
              0.15,
              row % 2 ? cream : lit,
              display,
              0.01,
            );
          }
          const typingKeys: import('three').Mesh[] = [];
          for (let row = 0; row < 4; row++)
            for (let col = 0; col < 11; col++) {
              const key = box(
                0.23,
                0.035,
                0.23,
                -1.3 + col * 0.26,
                0.29,
                -0.3 + row * 0.29,
                deep,
                laptop,
                0.025,
              );
              if (row === 1 && [2, 5, 8].includes(col)) typingKeys.push(key);
            }
          box(0.95, 0.015, 0.43, 0, 0.28, 1.14, pink, laptop);
          const cursor = box(0.055, 0.14, 0.02, -0.36, -0.68, 0.15, lit, display, 0.005);
          animateProps = (time, still) => {
            cursor.visible = still || time % 1.15 < 0.72;
            typingKeys.forEach((key, index) => {
              const pressed = !still && Math.floor(time * 3.5) % 6 === index;
              key.position.y = pressed ? 0.27 : 0.29;
              key.material = pressed ? pink : deep;
            });
          };
          for (let i = 0; i < 3; i++) {
            box(0.68, 0.68, 0.68, 1.9 + (i % 2) * 0.7, 0.4 + Math.floor(i / 2) * 0.72, -1.1, pink);
            box(0.2, 0.055, 0.2, 1.9 + (i % 2) * 0.7, 0.77 + Math.floor(i / 2) * 0.72, -1.1, cream);
          }
        } else {
          box(3.4, 0.12, 1.2, -0.7, 0.15, -0.8, deep);
          box(0.15, 1.6, 0.15, -0.7, 0.95, -0.8, pink);
          box(4, 2.5, 0.17, -0.7, 2, -0.8, cream);
          box(3.7, 2.18, 0.045, -0.7, 2, -0.69, screen);
          const bars: import('three').Mesh[] = [];
          for (let i = 0; i < 3; i++) {
            bars.push(
              box(
                0.7,
                0.5 + i * 0.36,
                0.05,
                -1.7 + i,
                0.96 + (0.5 + i * 0.36) / 2,
                -0.64,
                i === 2 ? lit : pink,
              ),
            );
          }
          for (let i = 0; i < 3; i++) box(0.25, 0.07, 0.045, -1.7 + i, 2.84, -0.64, cream);
          box(0.85, 0.14, 0.85, 1.65, 0.15, 1, pink);
          const stem = new T.Mesh(new T.CylinderGeometry(0.065, 0.065, 1.55, 16), cream);
          stem.position.set(1.65, 0.98, 1);
          group.add(stem);
          const mic = new T.Mesh(new T.CapsuleGeometry(0.22, 0.55, 8, 16), deep);
          mic.position.set(1.65, 1.9, 1);
          group.add(mic);
          for (let i = 0; i < 5; i++) box(0.35, 0.02, 0.02, 1.65, 1.7 + i * 0.1, 1.22, pink);
          animateProps = (time, still) => {
            bars.forEach((bar, index) => {
              const scale = still ? 1 : 1 + Math.sin(time * 1.2 - index * 0.8) * 0.09;
              bar.scale.y = scale;
              bar.position.y = 0.96 + ((0.5 + index * 0.36) * scale) / 2;
            });
          };
        }
        // The right-hand lane stays clear of the book, laptop, microphone and platform edge.
        const robot = new T.Group();
        robot.position.set(2.72, 0.035, 1.7);
        robot.scale.setScalar(0.88);
        group.add(robot);
        const torso = new T.Group();
        robot.add(torso);
        box(0.67, 0.42, 0.56, 0, 0.63, 0, pink, torso, 0.12);
        box(0.22, 0.09, 0.035, 0, 0.66, 0.3, cream, torso, 0.02);
        const head = new T.Group();
        head.position.set(0, 1.09, 0);
        torso.add(head);
        box(1.1, 0.75, 0.76, 0, 0, 0, cream, head, 0.2);
        box(0.88, 0.48, 0.07, 0, 0, 0.395, screen, head, 0.14);
        const eyes = new T.Group();
        head.add(eyes);
        const eyeMeshes = [-1, 1].map((side) =>
          box(0.095, 0.16, 0.025, side * 0.2, 0.055, 0.44, lit, eyes, 0.035),
        );
        const mouth = new T.Group();
        mouth.position.set(0, -0.12, 0.44);
        head.add(mouth);
        box(0.15, 0.025, 0.02, 0, -0.015, 0, lit, mouth, 0.008);
        for (const side of [-1, 1]) {
          const corner = box(0.075, 0.025, 0.02, side * 0.095, 0.005, 0, lit, mouth, 0.008);
          corner.rotation.z = side * 0.55;
        }
        const antenna = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 0.17, 8), pink);
        antenna.position.y = 0.45;
        head.add(antenna);
        const signal = new T.Mesh(new T.SphereGeometry(0.065, 12, 8), lit);
        signal.position.y = 0.56;
        head.add(signal);
        const arms = [-1, 1].map((side) => {
          const arm = new T.Group();
          arm.position.set(side * 0.41, 0.73, 0);
          torso.add(arm);
          box(0.15, 0.29, 0.17, 0, -0.13, 0, cream, arm, 0.055);
          box(0.19, 0.15, 0.21, 0, -0.32, 0.015, pink, arm, 0.055);
          if (side === -1) box(0.11, 0.085, 0.025, 0, -0.23, 0.1, lit, arm, 0.02);
          return arm;
        });
        const legs = [-1, 1].map((side) => {
          const leg = new T.Mesh(new T.CylinderGeometry(0.07, 0.075, 1, 10), pink);
          leg.castShadow = true;
          robot.add(leg);
          const foot = box(0.25, 0.12, 0.38, side * 0.2, 0.07, 0.055, cream, robot, 0.05);
          return { leg, foot, side };
        });
        const up = new T.Vector3(0, 1, 0);
        const ankle = new T.Vector3();
        const hip = new T.Vector3();
        const bone = new T.Vector3();
        const smooth = (value: number) => value * value * (3 - 2 * value);
        let lastExpression = '',
          lastPatrol = '';
        const pose = (time: number, still: boolean, pointerX: number) => {
          const cycle = time % 14;
          let distance = 0,
            direction = 0,
            walking = false,
            turning = false;
          let z = 1.7,
            yaw = 0,
            patrol = 'greeting';
          if (!still && cycle < 3.6) {
            distance = smooth(cycle / 3.6) * 1.55;
            z = 0.15 + distance;
            walking = true;
            patrol = 'outbound';
          } else if (!still && cycle >= 6 && cycle < 6.8) {
            yaw = smooth((cycle - 6) / 0.8) * Math.PI;
            turning = true;
            patrol = 'turning';
          } else if (!still && cycle >= 6.8 && cycle < 10.4) {
            distance = smooth((cycle - 6.8) / 3.6) * 1.55;
            z = 1.7 - distance;
            yaw = Math.PI;
            direction = 1;
            walking = true;
            patrol = 'inbound';
          } else if (!still && cycle >= 10.4 && cycle < 11.2) {
            z = 0.15;
            yaw = Math.PI + smooth((cycle - 10.4) / 0.8) * Math.PI;
            turning = true;
            patrol = 'turning';
          } else if (!still && cycle >= 11.2) {
            z = 0.15;
            yaw = Math.PI * 2;
            patrol = 'looking-around';
          }
          const idle = !walking && !turning;
          const stride = distance / 0.31;
          // Settle both feet before each turn, including the loop boundary.
          const gait = walking
            ? smooth(Math.min(1, Math.max(0, Math.min(distance, 1.55 - distance) / 0.2)))
            : 0;
          const swing = Math.sin(stride * Math.PI * 2) * gait;
          robot.position.z = z;
          robot.rotation.y = yaw;
          torso.position.y = walking ? Math.abs(swing) * 0.012 : 0;
          torso.rotation.z = walking ? swing * 0.025 : 0;
          legs.forEach(({ leg, foot, side }, index) => {
            const phase = (stride + index * 0.5 + direction * 0.5) % 1;
            const lift = phase >= 0.5 ? Math.sin((phase - 0.5) * Math.PI * 2) * 0.1 * gait : 0;
            const step =
              (phase < 0.5 ? 0.08 - phase * 0.32 : -0.08 + smooth((phase - 0.5) * 2) * 0.16) * gait;
            foot.position.set(side * 0.2, 0.07 + lift, 0.055 + step);
            foot.rotation.x = phase >= 0.5 ? Math.sin((phase - 0.5) * Math.PI * 2) * -0.12 * gait : 0;
            ankle.set(side * 0.2, 0.16 + lift, step);
            hip.set(side * 0.2, 0.47, 0);
            bone.subVectors(hip, ankle);
            leg.position.copy(ankle).add(hip).multiplyScalar(0.5);
            leg.scale.y = bone.length();
            leg.quaternion.setFromUnitVectors(up, bone.normalize());
          });
          arms[0].rotation.set(swing * 0.28, 0, 0.1);
          arms[1].rotation.set(-swing * 0.28, 0, -0.1);
          head.rotation.set(
            0,
            still ? 0.24 : pointerX * 0.7 + (idle ? Math.sin(time * 0.7) * 0.16 + 0.22 : 0),
            0,
          );
          let expression = 'attentive';
          if (idle && chapter === 0) {
            head.rotation.z = still ? -0.12 : Math.sin(time * 1.1) * 0.13;
            arms[0].rotation.x = -0.75;
            arms[0].rotation.z = -0.2;
            expression = 'curious';
          } else if (idle && chapter === 1) {
            head.rotation.x = 0.18;
            head.rotation.y = -0.18;
            arms[0].rotation.x = -1.05;
            arms[0].rotation.z = -0.3;
            expression = 'focused';
          } else if (idle && chapter === 2) {
            arms[1].rotation.x = -0.3;
            arms[1].rotation.z = still ? 2.15 : 2.15 + Math.sin(time * 5) * 0.25;
            expression = 'happy';
          }
          const blinkPhase = time % 4.7;
          const blink = still
            ? 1
            : blinkPhase > 4.48
              ? Math.max(0.08, Math.abs(blinkPhase - 4.59) / 0.11)
              : 1;
          eyeMeshes.forEach((eye, index) => {
            eye.scale.y =
              blink * (expression === 'happy' ? 0.55 : expression === 'curious' && index === 1 ? 1.35 : 1);
            eye.scale.x = expression === 'happy' ? 1.25 : 1;
            eye.position.x = (index ? 0.2 : -0.2) + (still ? 0 : pointerX * 0.12);
          });
          mouth.scale.set(expression === 'focused' ? 0.65 : 1, expression === 'happy' ? 1.35 : 1, 1);
          animateProps(time, still);
          if (expression !== lastExpression) {
            renderer.domElement.dataset.expression = expression;
            lastExpression = expression;
          }
          if (patrol !== lastPatrol) {
            renderer.domElement.dataset.patrol = patrol;
            lastPatrol = patrol;
          }
        };
        scene.add(new T.AmbientLight(0xffe9f2, 2.2));
        const sun = new T.DirectionalLight(0xffffff, 4.3);
        sun.position.set(-3, 9, 5);
        sun.castShadow = true;
        sun.shadow.mapSize.set(1024, 1024);
        sun.shadow.camera.left = -7;
        sun.shadow.camera.right = 7;
        sun.shadow.camera.top = 7;
        sun.shadow.camera.bottom = -7;
        sun.shadow.bias = -0.0005;
        scene.add(sun);
        const rim = new T.DirectionalLight(0xe3a6cd, 2);
        rim.position.set(5, 4, -4);
        scene.add(rim);
        let frame = 0,
          visible = false,
          contextLost = false,
          targetX = 0,
          pointerX = 0,
          elapsed = 0,
          lastTick = 0,
          lastRender = 0;
        const mq = matchMedia('(prefers-reduced-motion: reduce)');
        const frameInterval = 1000 / 30;
        const canRender = () => visible && !document.hidden && !contextLost;
        const draw = (now: number) => {
          frame = 0;
          if (!canRender()) return;
          if (mq.matches) {
            pose(0, true, 0);
            renderer.render(scene, camera);
            lastTick = 0;
            return;
          }
          if (lastTick) elapsed += Math.min((now - lastTick) / 1000, 0.12);
          lastTick = now;
          if (now - lastRender >= frameInterval) {
            pointerX += (targetX - pointerX) * 0.16;
            pose(elapsed, false, pointerX);
            renderer.render(scene, camera);
            lastRender = now - ((now - lastRender) % frameInterval);
          }
          frame = requestAnimationFrame(draw);
        };
        const wake = () => {
          if (!canRender()) {
            cancelAnimationFrame(frame);
            frame = 0;
            lastTick = 0;
            renderer.domElement.dataset.motion = contextLost ? 'unavailable' : 'paused';
            return;
          }
          renderer.domElement.dataset.motion = mq.matches ? 'reduced' : 'running';
          if (!frame) frame = requestAnimationFrame(draw);
        };
        const pointer = (e: PointerEvent) => {
          if (mq.matches) return;
          const r = el.getBoundingClientRect();
          targetX = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5));
        };
        const leave = () => {
          targetX = 0;
        };
        const resize = new ResizeObserver(() => {
          const { width, height } = el.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height);
          const a = width / height;
          camera.left = -4.8 * a;
          camera.right = 4.8 * a;
          camera.top = 4.8;
          camera.bottom = -4.8;
          camera.updateProjectionMatrix();
          wake();
        });
        resize.observe(el);
        const observer = new IntersectionObserver((entries) => {
          visible = entries[0].isIntersecting;
          wake();
        });
        observer.observe(el);
        const lost = (e: Event) => {
          e.preventDefault();
          contextLost = true;
          setReady(false);
          wake();
        };
        const restored = () => {
          contextLost = false;
          setReady(true);
          wake();
        };
        renderer.domElement.addEventListener('webglcontextlost', lost);
        renderer.domElement.addEventListener('webglcontextrestored', restored);
        el.addEventListener('pointermove', pointer);
        el.addEventListener('pointerleave', leave);
        document.addEventListener('visibilitychange', wake);
        mq.addEventListener('change', wake);
        setReady(true);
        dispose = () => {
          cancelAnimationFrame(frame);
          resize.disconnect();
          observer.disconnect();
          el.removeEventListener('pointermove', pointer);
          el.removeEventListener('pointerleave', leave);
          document.removeEventListener('visibilitychange', wake);
          mq.removeEventListener('change', wake);
          renderer.domElement.removeEventListener('webglcontextlost', lost);
          renderer.domElement.removeEventListener('webglcontextrestored', restored);
          const geometries = new Set<import('three').BufferGeometry>();
          scene.traverse((o) => {
            if (o instanceof T.Mesh) geometries.add(o.geometry);
          });
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((m) => m.dispose());
          sun.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });
    return () => {
      cancelled = true;
      dispose();
    };
  }, [chapter]);
  return (
    <div ref={root} className="chapter-scene" role="img" aria-label={labels[chapter]} data-rendered={ready}>
      <div className={'scene-fallback scene-fallback-' + chapter} aria-hidden="true">
        <span>{['{ learn }', '< build />', '{ share }'][chapter]}</span>
      </div>
      <span className="scene-label">
        {['A place to learn', 'A place to make', 'A place to share'][chapter]}
      </span>
    </div>
  );
}
