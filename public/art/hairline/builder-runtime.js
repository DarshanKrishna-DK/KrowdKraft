/* hairline kernel sha256:3a19aa2640ba8c6c306184d05fddfbd4f3323a6ebd9217dd3cbb38e9db74991c */
/*
 * HL: everything a figure may call. Read this index; the code under it is the
 * package's src/core, unchanged, and a figure should not need to read it.
 *
 * Every figure is drawn in a 400 × 320 viewBox. World space is x/y on the
 * ground and z up. Plates are filled with the ground colour and painted back
 * to front, so a nearer one covers a farther one: append in that order. At
 * the default camera, Cam(45, 0.5, S), +x runs down to the right and +y down
 * to the left, so the corner with the largest x and y is nearest the viewer:
 * append by ascending x + y, from the far corner (smallest x and y) to it.
 *
 * Camera
 *   Cam(azDeg, k, S)                       a camera: azimuth in degrees, k = sin(elevation) (0.5 is the 2:1 view), S = scale
 *   fit(C, points, cx, cy)                 centres the box of [x, y, z] points on (cx, cy); call it once, before proj
 *                                          it only centres, it never scales: choose S by trying values, with the most extreme pose in points.
 *                                          The six figures use S 1.42 to 2.12; the boxes they fit come out 230 to 310 wide and 180 to 245 tall
 *   proj(C)                                returns P(x, y, z), which gives [sx, sy]
 *   unproj(C, sx, sy, z)                   the world [x, y] under a screen point, on the plane at height z
 *   facing(C)                              returns front(sample): whether a ring sample faces the camera
 * Rounded solids
 *   rrect(u0, v0, u1, v1, r, n)            a rounded rectangle, as a ring of samples {u, v, nu, nv}
 *   circ(R, n)                             a circle, as a ring
 *   rings(x0, y0, x1, y1, r, b)            [ring, inner]: a rounded footprint and its crease ring, inset by b
 *                                          r, the corner radius, is cut to half the shorter side. b, the crease's inset in world units
 *                                          (0.6 to 2.2 in the figures), must stay under half the shorter side or the crease turns inside out
 *   prism(P, front, ring, inner, z0, z1)   {sil, crease}: a solid standing from z0 to z1, as two path strings
 *   ringAt(P, ring, z)                     the ring's points, projected at height z
 *   run(ring, keep)                        the one cyclic run of samples that pass keep
 *   hull(points)                           the convex hull of screen points
 *   extremes(P, ring)                      [left, right, nearest] samples: where dashed drops fall from
 *   fillet(points, radii, n)               rounds every vertex of a closed polygon; returns the new points
 *                                          radii is an array, one radius per vertex, each cut to half its shorter edge; a single number gives NaN.
 *                                          n is the steps round each corner, default 4: each vertex becomes n + 1 points
 *   ghost(P, front, ring, z0, depth)       a reflection's path {d, y0, y1}; reflect() draws it for you
 * Paths and numbers
 *   poly(points)                           a closed path string
 *   open(points)                           an open polyline string
 *   seg(a, b)                              one segment between two screen points [sx, sy], as its own subpath; project world points with P first
 *   clamp(v, a, b)
 *   lerp(a, b, t)
 *   rad(deg)
 *   r2(n)                                  two decimals
 * The continuous clock: one spring per moving number
 *   spring(x, opts)                        at rest on x; write .t to retarget; opts {k, c, m, eps}, default k 100, c 18, m 1
 *   stepS(sp, dt)                          advances by dt seconds; returns whether it is still moving
 * The discrete clock: a 700ms tween on (.32, .72, 0, 1)
 *   tween(v, dur)                          at rest on v; dur defaults to 700 (ms)
 *   tset(tw, to, now, delay)               retargets from where it is, after delay ms: the stagger
 *                                          the same target again does nothing, so calling it on every pointer move is safe
 *   tval(tw, now)                          its value at now
 *   tdone(tw, now)                         whether it has landed
 *   bezier(x1, y1, x2, y2)                 a CSS cubic-bezier, as a function of progress
 *   EASE_LIFT                              the lift curve itself
 *   reducedMotion()                        true when the reader asked for less motion; springs and tweens already land at once
 *   setReducedMotion(on)                   the loop's business, not a figure's
 * Drawing
 *   mk(tag, attrs, parent)                 one svg element: the only way a figure makes a node
 *   solid(parent)                          {g, sil, cr}: a group holding a silhouette path and a crease path
 *   put(solid, paths)                      writes prism()'s {sil, crease} into solid()'s {sil, cr}: sil into sil, crease into cr
 *   flatDot(parent, C, r, cls)             a dot lying on the ground plane; cls is "dot", "dot m" or "dot off"
 *   place(el, point)                       moves a dot or a circle to [sx, sy]
 *   reflect(svg, parent, P, front, ring, z0, depth)   a fading mirror under a solid
 *   fade(svg, y0, y1, a0)                  a vertical fade, as a mask; returns the value for a mask attribute
 * Life
 *   register(stage, tick)                  joins the one frame loop; tick(dt in seconds, now in ms) returns true to ask for another frame; gives {wake, unregister}
 *   pointer(stage, handlers)               {move(point), down(point), leave()}, points in viewBox units; returns its disposer
 *   disposer()                             {add, on, dispose}: collects tear-down, so destroy is bag.dispose
 * The bench's business, not a figure's
 *   css(lightDark)
 *   inject(root)
 *   tour(stage, stops, onStop)             an unseen pointer that walks the stops, [x, y] in viewBox units or null to leave, and gives way to a real one; onStop(i) on each arrival; returns {stop}
 *   LAP                                    the default stops: a diamond around the centre, then a leave
 *
 * Classes, on path, polygon, ellipse and line. They are the whole palette; a
 * figure sets no colour, width or fill of its own.
 *     (none)   filled with the ground colour, medium stroke
 *     sil      the silhouette's stroke        hi    the bright stroke: the only highlight
 *     lo       the dim stroke                 nf    no fill        fo   fill only, no stroke
 *     dash     a dashed guide
 *     dot      a bright dot                   dot m   a medium dot     dot off   a dim dot
 */
var HL = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/hairline/src/core/kernel.ts
  var kernel_exports = {};
  __export(kernel_exports, {
    Cam: () => Cam,
    EASE_LIFT: () => EASE_LIFT,
    LAP: () => LAP,
    bezier: () => bezier,
    circ: () => circ,
    clamp: () => clamp,
    css: () => css,
    disposer: () => disposer,
    extremes: () => extremes,
    facing: () => facing,
    fade: () => fade,
    fillet: () => fillet,
    fit: () => fit,
    flatDot: () => flatDot,
    ghost: () => ghost,
    hull: () => hull,
    inject: () => inject,
    lerp: () => lerp,
    mk: () => mk,
    open: () => open,
    place: () => place,
    pointer: () => pointer,
    poly: () => poly,
    prism: () => prism,
    proj: () => proj,
    put: () => put,
    r2: () => r2,
    rad: () => rad,
    reducedMotion: () => reducedMotion,
    reflect: () => reflect,
    register: () => register,
    ringAt: () => ringAt,
    rings: () => rings,
    rrect: () => rrect,
    run: () => run,
    seg: () => seg,
    setReducedMotion: () => setReducedMotion,
    solid: () => solid,
    spring: () => spring,
    stepS: () => stepS,
    tdone: () => tdone,
    tour: () => tour,
    tset: () => tset,
    tval: () => tval,
    tween: () => tween,
    unproj: () => unproj
  });

  // packages/hairline/src/core/iso.ts
  var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  var lerp = (a, b, t) => a + (b - a) * t;
  var rad = (d) => d * Math.PI / 180;
  var r2 = (n) => Math.round(n * 100) / 100;
  var poly = (pts) => "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L") + "Z";
  var seg = (a, b) => `M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`;
  var open = (pts) => pts.length < 2 ? "" : "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L");
  var Cam = (azDeg, k, S) => ({ az: rad(azDeg), k, S, ox: 0, oy: 0 });
  function proj(C) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    return (x, y, z) => {
      const X = x * c - y * s, Y = x * s + y * c;
      return [C.ox + C.S * X, C.oy + C.S * (Y * C.k - z * zf)];
    };
  }
  function unproj(C, sx, sy, z) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const X = (sx - C.ox) / C.S, Y = ((sy - C.oy) / C.S + z * zf) / C.k;
    return [X * c + Y * s, -X * s + Y * c];
  }
  function fit(C, pts, cx, cy) {
    C.ox = 0;
    C.oy = 0;
    const P = proj(C);
    let a = 1e9, b = -1e9, c = 1e9, d = -1e9;
    for (const p of pts) {
      const q = P(p[0], p[1], p[2]);
      a = Math.min(a, q[0]);
      b = Math.max(b, q[0]);
      c = Math.min(c, q[1]);
      d = Math.max(d, q[1]);
    }
    C.ox = cx - (a + b) / 2;
    C.oy = cy - (c + d) / 2;
  }
  function rrect(u0, v0, u1, v1, r, n = 4) {
    r = Math.max(0, Math.min(r, (u1 - u0) / 2, (v1 - v0) / 2));
    const out = [];
    for (const [cu, cv, a0] of [[u1 - r, v1 - r, 0], [u0 + r, v1 - r, 90], [u0 + r, v0 + r, 180], [u1 - r, v0 + r, 270]])
      for (let k = 0; k <= n; k++) {
        const a = rad(a0 + 90 * k / n), ca = Math.cos(a), sa = Math.sin(a);
        out.push({ u: cu + r * ca, v: cv + r * sa, nu: ca, nv: sa });
      }
    return out;
  }
  function circ(R, n = 96) {
    const out = [];
    for (let k = 0; k < n; k++) {
      const a = k / n * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      out.push({ u: R * ca, v: R * sa, nu: ca, nv: sa });
    }
    return out;
  }
  function hull(input) {
    const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const x = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const p of pts) {
      while (lo.length > 1 && x(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
      lo.push(p);
    }
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i];
      while (up.length > 1 && x(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop();
      up.push(p);
    }
    lo.pop();
    up.pop();
    return lo.concat(up);
  }
  var ringAt = (P, ring, z) => ring.map((q) => P(q.u, q.v, z));
  var facing = (C) => {
    const s = Math.sin(C.az), c = Math.cos(C.az);
    return (q) => q.nu * s + q.nv * c >= -1e-6;
  };
  function run(ring, keep) {
    const n = ring.length;
    let s = -1;
    for (let i = 0; i < n; i++) if (keep(ring[i]) && !keep(ring[(i + n - 1) % n])) {
      s = i;
      break;
    }
    if (s < 0) return keep(ring[0]) ? ring.slice() : [];
    const out = [];
    for (let k = 0; k < n && keep(ring[(s + k) % n]); k++) out.push(ring[(s + k) % n]);
    return out;
  }
  function prism(P, front, ring, inner, z0, z1) {
    return {
      sil: poly(hull(ringAt(P, ring, z1).concat(ringAt(P, ring, z0)))),
      crease: inner ? open(ringAt(P, run(inner, front), z1)) : ""
    };
  }
  var rings = (x0, y0, x1, y1, r, b) => [
    rrect(x0, y0, x1, y1, r),
    rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.3, r - b))
  ];
  function extremes(P, ring) {
    const pr = ring.map((q) => P(q.u, q.v, 0));
    let a = 0, b = 0, c = 0;
    pr.forEach((p, k) => {
      if (p[0] < pr[a][0]) a = k;
      if (p[0] > pr[b][0]) b = k;
      if (p[1] > pr[c][1]) c = k;
    });
    return [ring[a], ring[b], ring[c]];
  }
  function fillet(pts, rs, n = 4) {
    const m = pts.length, out = [];
    for (let i = 0; i < m; i++) {
      const a = pts[(i + m - 1) % m], p = pts[i], b = pts[(i + 1) % m];
      const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
      const t = Math.min(rs[i], la / 2, lb / 2);
      const p1 = [p[0] + (a[0] - p[0]) / la * t, p[1] + (a[1] - p[1]) / la * t];
      const p2 = [p[0] + (b[0] - p[0]) / lb * t, p[1] + (b[1] - p[1]) / lb * t];
      for (let k = 0; k <= n; k++) {
        const s = k / n, w = 1 - s;
        out.push([w * w * p1[0] + 2 * w * s * p[0] + s * s * p2[0], w * w * p1[1] + 2 * w * s * p[1] + s * s * p2[1]]);
      }
    }
    return out;
  }
  function ghost(P, front, ring, z0, depth) {
    const f = run(ring, front), lowP = ringAt(P, f, z0 - depth);
    return {
      d: open(lowP) + [f[0], f[f.length - 1]].map((q) => seg(P(q.u, q.v, z0), P(q.u, q.v, z0 - depth))).join(""),
      y0: Math.min(...ringAt(P, f, z0).map((p) => p[1])),
      y1: Math.max(...lowP.map((p) => p[1])) + 2
    };
  }

  // packages/hairline/src/core/motion.ts
  var reduced = false;
  var setReducedMotion = (on) => {
    reduced = on;
  };
  var reducedMotion = () => reduced;
  function spring(x, o = {}) {
    return { x, v: 0, t: x, k: o.k ?? 100, c: o.c ?? 18, m: o.m ?? 1, eps: o.eps ?? 0.01 };
  }
  function stepS(sp, dt) {
    if (reduced) {
      sp.x = sp.t;
      sp.v = 0;
      return false;
    }
    const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = (-sp.k * (sp.x - sp.t) - sp.c * sp.v) / sp.m;
      sp.v += a * h;
      sp.x += sp.v * h;
    }
    if (Math.abs(sp.x - sp.t) < sp.eps && Math.abs(sp.v) < sp.eps * 10) {
      sp.x = sp.t;
      sp.v = 0;
      return false;
    }
    return true;
  }
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const X = (u) => ((ax * u + bx) * u + cx) * u;
    const Y = (u) => ((ay * u + by) * u + cy) * u;
    const dX = (u) => (3 * ax * u + 2 * bx) * u + cx;
    return (t) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      let u = t;
      for (let i = 0; i < 8; i++) {
        const e = X(u) - t;
        if (Math.abs(e) < 1e-5) break;
        const d = dX(u);
        if (Math.abs(d) < 1e-6) break;
        u -= e / d;
      }
      if (!(u >= 0 && u <= 1) || Math.abs(X(u) - t) > 1e-4) {
        let lo = 0, hi = 1;
        u = t;
        for (let i = 0; i < 24; i++) {
          if (X(u) < t) lo = u;
          else hi = u;
          u = (lo + hi) / 2;
        }
      }
      return Y(u);
    };
  }
  var EASE_LIFT = bezier(0.32, 0.72, 0, 1);
  var tween = (v, dur = 700) => ({ from: v, to: v, t0: -1e9, dur });
  var tval = (tw, now) => {
    const p = clamp((now - tw.t0) / tw.dur, 0, 1);
    return tw.from + (tw.to - tw.from) * (reduced ? 1 : EASE_LIFT(p));
  };
  var tset = (tw, to, now, delay) => {
    if (tw.to === to) return;
    tw.from = tval(tw, now);
    tw.to = to;
    tw.t0 = now + delay;
  };
  var tdone = (tw, now) => reduced || now >= tw.t0 + tw.dur;

  // packages/hairline/src/core/stage.ts
  var NS = "http://www.w3.org/2000/svg";
  function mk(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, String(attrs[k]));
    if (parent) parent.appendChild(e);
    return e;
  }
  function solid(parent) {
    const g = mk("g", {}, parent);
    return { g, sil: mk("path", { class: "sil" }, g), cr: mk("path", { class: "nf lo" }, g) };
  }
  var put = (el, s) => {
    el.sil.setAttribute("d", s.sil);
    el.cr.setAttribute("d", s.crease);
  };
  var flatDot = (parent, C, r, cls) => mk("ellipse", { rx: r2(r * C.S), ry: r2(r * C.S * C.k), class: cls }, parent);
  var place = (el, q) => {
    el.setAttribute("cx", String(r2(q[0])));
    el.setAttribute("cy", String(r2(q[1])));
  };
  var fid = 0;
  function fade(svg, y0, y1, a0 = 0.7) {
    const id = "hl-fd" + ++fid, defs = mk("defs", {}, svg);
    const lg = mk("linearGradient", { id: id + "g", gradientUnits: "userSpaceOnUse", x1: 0, y1: r2(y0), x2: 0, y2: r2(y1) }, defs);
    mk("stop", { offset: 0, "stop-color": "#fff", "stop-opacity": a0 }, lg);
    mk("stop", { offset: 1, "stop-color": "#fff", "stop-opacity": 0 }, lg);
    const m = mk("mask", { id, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 400, height: 320 }, defs);
    mk("rect", { x: 0, y: 0, width: 400, height: 320, fill: `url(#${id}g)` }, m);
    return `url(#${id})`;
  }
  function reflect(svg, parent, P, front, ring, z0, depth) {
    const r = ghost(P, front, ring, z0, depth);
    const gh = mk("g", { class: "ghost", mask: fade(svg, r.y0, r.y1) }, parent);
    mk("path", { d: r.d }, gh);
  }
  var boards = [];
  var byStage = /* @__PURE__ */ new Map();
  var raf = 0;
  var last = 0;
  var io = null;
  var rm = null;
  function frame(now) {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1e3));
    last = now;
    let any = false;
    for (const b of boards.slice()) if (b.vis && b.awake) {
      try {
        b.awake = !!b.tick(dt, now);
      } catch (err) {
        b.awake = false;
        setTimeout(() => {
          throw err;
        });
      }
      any = any || b.awake;
    }
    raf = any ? requestAnimationFrame(frame) : 0;
  }
  function wake(b) {
    b.awake = true;
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }
  var onMotion = () => {
    setReducedMotion(!!rm?.matches);
    boards.forEach(wake);
  };
  function start() {
    if (io) return;
    io = new IntersectionObserver((es) => {
      for (const e of es) {
        const set = byStage.get(e.target);
        if (!set) continue;
        for (const b of set) {
          b.vis = e.isIntersecting;
          if (b.vis) wake(b);
        }
      }
    }, { rootMargin: "80px" });
    rm = matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(rm.matches);
    rm.addEventListener("change", onMotion);
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    io?.disconnect();
    io = null;
    rm?.removeEventListener("change", onMotion);
    rm = null;
  }
  function register(stage, tick) {
    start();
    const b = { stage, tick, vis: false, awake: true };
    boards.push(b);
    const peers = byStage.get(stage);
    if (peers) {
      for (const p of peers) b.vis = p.vis;
      peers.add(b);
      if (b.vis) wake(b);
    } else {
      byStage.set(stage, /* @__PURE__ */ new Set([b]));
      io.observe(stage);
    }
    tick(0, performance.now());
    let gone = false;
    return {
      wake: () => {
        if (!gone) wake(b);
      },
      unregister: () => {
        if (gone) return;
        gone = true;
        boards = boards.filter((x) => x !== b);
        const set = byStage.get(stage);
        if (set) {
          set.delete(b);
          if (!set.size) {
            byStage.delete(stage);
            io?.unobserve(stage);
          }
        }
        if (!boards.length) stop();
      }
    };
  }
  var handlers = /* @__PURE__ */ new WeakMap();
  var touring = /* @__PURE__ */ new WeakMap();
  function pointer(stage, on) {
    handlers.set(stage, on);
    let tm = 0;
    const pt = (e) => {
      const r = stage.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width * 400, (e.clientY - r.top) / r.height * 320];
    };
    const move = (e) => {
      clearTimeout(tm);
      touring.get(stage)?.hold();
      on.move(pt(e), e);
    };
    const down = (e) => {
      clearTimeout(tm);
      touring.get(stage)?.hold();
      if (e.pointerType !== "mouse") stage.releasePointerCapture?.(e.pointerId);
      if (on.down) on.down(pt(e), e);
      else on.move(pt(e), e);
    };
    const leave = (e) => {
      clearTimeout(tm);
      tm = window.setTimeout(() => {
        on.leave(e);
        touring.get(stage)?.release();
      }, e.pointerType === "mouse" ? 0 : 1400);
    };
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointerleave", leave);
    return () => {
      clearTimeout(tm);
      if (handlers.get(stage) === on) handlers.delete(stage);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointerleave", leave);
    };
  }
  var LAP = [[128, 150], [200, 118], [272, 150], [200, 206], null];
  var TRAVEL = 900;
  var DWELL = 1200;
  var REST = 1800;
  var RESUME = 1200;
  var STAGGER = 450;
  var GHOST = { pointerType: "ghost" };
  var started = 0;
  function entry([x, y]) {
    const dx = x - 200, dy = y - 160;
    if (!dx && !dy) return [200, 320];
    const k = Math.min(dx ? (dx > 0 ? 200 : -200) / dx : Infinity, dy ? (dy > 0 ? 160 : -160) / dy : Infinity);
    return [200 + dx * k, 160 + dy * k];
  }
  function tour(stage, stops, onStop) {
    let i = 0;
    let wait = RESUME + STAGGER * (started++ % 4);
    let t = -1;
    let at = null;
    let origin = [200, 320];
    let hand = false, keys = stage.contains(stage.ownerDocument.activeElement);
    let gone = false;
    const leave = () => {
      at = null;
      t = -1;
      handlers.get(stage)?.leave(GHOST);
    };
    const tick = (dt) => {
      if (hand || keys || !stops.length) return false;
      if (reducedMotion()) {
        if (at) leave();
        return false;
      }
      if (wait > 0) {
        wait -= dt * 1e3;
        return true;
      }
      const stop2 = stops[i];
      if (stop2 === null) {
        if (at) leave();
        onStop?.(i);
        i = (i + 1) % stops.length;
        wait = REST;
        return true;
      }
      const h = handlers.get(stage);
      if (!h) return true;
      if (t < 0) {
        origin = at ?? entry(stop2);
        t = 0;
      }
      t = Math.min(TRAVEL, t + dt * 1e3);
      const k = EASE_LIFT(t / TRAVEL);
      at = [origin[0] + (stop2[0] - origin[0]) * k, origin[1] + (stop2[1] - origin[1]) * k];
      h.move(at, GHOST);
      if (t < TRAVEL) return true;
      onStop?.(i);
      i = (i + 1) % stops.length;
      t = -1;
      wait = DWELL;
      return true;
    };
    const take = () => {
      at = null;
      t = -1;
    };
    const give = () => {
      if (hand || keys) return;
      i = 0;
      t = -1;
      wait = RESUME;
      board.wake();
    };
    const me = {
      hold: () => {
        hand = true;
        take();
      },
      release: () => {
        if (!hand) return;
        hand = false;
        give();
      }
    };
    const focusIn = () => {
      keys = true;
      take();
    };
    const focusOut = (e) => {
      if (keys && !stage.contains(e.relatedTarget)) {
        keys = false;
        give();
      }
    };
    stage.addEventListener("focusin", focusIn);
    stage.addEventListener("focusout", focusOut);
    touring.set(stage, me);
    const board = register(stage, tick);
    return {
      stop: () => {
        if (gone) return;
        gone = true;
        board.unregister();
        stage.removeEventListener("focusin", focusIn);
        stage.removeEventListener("focusout", focusOut);
        if (touring.get(stage) === me) touring.delete(stage);
        if (at) leave();
      }
    };
  }
  function disposer() {
    let fns = [];
    return {
      add: (fn) => {
        fns.push(fn);
      },
      on: (target, type, fn, opts) => {
        const h = fn;
        target.addEventListener(type, h, opts);
        fns.push(() => target.removeEventListener(type, h, opts));
      },
      dispose: () => {
        const run2 = fns;
        fns = [];
        for (let i = run2.length - 1; i >= 0; i--) run2[i]();
      }
    };
  }

  // packages/hairline/src/core/styles.ts
  var LIGHT = { plate: "#ffffff", hi: "#232327", edge: "#a4a4ac", mid: "#c3c3c9", lo: "#e0e0e4" };
  var DARK = { plate: "#08090a", hi: "#d0d6e0", edge: "#5b5d64", mid: "#3e3e44", lo: "#29292d" };
  var KEYS = ["plate", "hi", "edge", "mid", "lo"];
  var vars = (p) => KEYS.map((k) => `--hl-${k}:var(--hairline-${k},${p[k]});`).join("");
  var EASE = "cubic-bezier(0.5,0,0.1,1)";
  var SVG = ":where([data-hairline]>svg)";
  function css(lightDark) {
    const both = Object.fromEntries(KEYS.map((k) => [k, `light-dark(${LIGHT[k]},${DARK[k]})`]));
    return [
      // the box, and the palette: light unless something below says otherwise
      `:where([data-hairline]){display:block;position:relative;aspect-ratio:5/4;touch-action:pan-y;user-select:none;-webkit-user-select:none;--hl-sw:var(--hairline-stroke,0.9);${vars(LIGHT)}}`,
      // the page's color-scheme
      lightDark ? `:where([data-hairline]){${vars(both)}}` : "",
      // an ancestor that says dark
      `:where(.dark,[data-theme="dark"]) :where([data-hairline]){${vars(DARK)}}`,
      // the figure's own theme option
      `:where([data-hairline][data-hairline-theme="light"]){${vars(LIGHT)}}`,
      `:where([data-hairline][data-hairline-theme="dark"]){${vars(DARK)}}`,
      `:where([data-hairline]:focus-visible){outline:1.5px solid var(--hl-hi);outline-offset:2px}`,
      `${SVG}{position:absolute;inset:0;width:100%;height:100%;display:block}`,
      // Riffle's live region: read, not seen
      `:where([data-hairline]>[data-hairline-live]){position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`,
      // the drawing: plates are filled with the plate colour and painted back to front
      `${SVG} :where(path,polygon,ellipse,line){fill:var(--hl-plate);stroke:var(--hl-mid);stroke-width:var(--hl-sw);vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round;transition:stroke 260ms ${EASE}}`,
      `${SVG} :where(.nf){fill:none}`,
      `${SVG} :where(.fo){stroke:none}`,
      `${SVG} :where(.sil){stroke:var(--hl-edge)}`,
      `${SVG} :where(.hi){stroke:var(--hl-hi)}`,
      `${SVG} :where(.lo){stroke:var(--hl-lo)}`,
      `${SVG} :where(.dash){stroke-dasharray:1 3}`,
      `${SVG} :where(.dot){stroke:none;fill:var(--hl-hi);transition:fill 260ms ${EASE}}`,
      `${SVG} :where(.dot.m){fill:var(--hl-edge)}`,
      `${SVG} :where(.dot.off){fill:var(--hl-lo)}`,
      `${SVG} :where(.ghost path){fill:none;stroke:var(--hl-mid)}`
    ].join("");
  }
  var done = /* @__PURE__ */ new WeakSet();
  function inject(root) {
    if (done.has(root)) return;
    done.add(root);
    const doc = root.nodeType === 9 ? root : root.ownerDocument;
    const win = doc.defaultView;
    const text = css(!!win?.CSS?.supports?.("color", "light-dark(#000,#fff)"));
    if (win && "adoptedStyleSheets" in root) {
      try {
        const sheet = new win.CSSStyleSheet();
        sheet.replaceSync(text);
        root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
        return;
      } catch {
      }
    }
    const style = doc.createElement("style");
    style.setAttribute("data-hairline-style", "");
    style.textContent = text;
    (root.nodeType === 9 ? doc.head ?? doc.documentElement : root).appendChild(style);
  }
  return __toCommonJS(kernel_exports);
})();
/* /hairline kernel */

(() => {
function hairline(figure) { window.krowdBuilder = figure; }
/* A builder at a desk. Moving across the keys draws the hands toward your idea. */
const { Cam, fit, proj, facing, rrect, rings, prism, solid, put, poly, open, hull,
  ringAt, run, fillet, seg, clamp, spring, stepS, mk, pointer, register, disposer } = HL;

function mount({ stage, svg, read }, value) {
  const bag = disposer(), C = Cam(45, .5, 1.65);
  fit(C, [[-3,77,56],[133,-2,61],[20,14,127],[99,14,127],[65,112,0],[125,70,0]], 200, 163);
  const P = proj(C), front = facing(C), root = mk("g", {}, svg);
  const path = (d, cls = "sil", parent = root) => mk("path", {d, class: cls}, parent);
  const block = (x, y, w, d, z, h, radius = 3, parent = root) => {
    const [ring, inner] = rings(x, y, x+w, y+d, radius, .7);
    const s = solid(parent); put(s, prism(P, front, ring, inner, z, z+h)); return s;
  };
  const plane = (pts, y, cls = "sil", parent = root, radius = 3) =>
    path(poly(fillet(pts, pts.map(() => radius), 8).map(([x,z]) => P(x,y,z))), cls, parent);
  const oval = (x,y,z,rx,rz,cls="sil",parent=root) => {
    const points = Array.from({length:64},(_,i) => {const a=i*Math.PI/32; return P(x+Math.cos(a)*rx,y,z+Math.sin(a)*rz);});
    return path(poly(points),cls,parent);
  };
  // Back-to-front: desk feet, risers, desktop, monitor, keyboard, seated builder.
  block(4,8,8,10,0,58,3); block(117,8,8,10,0,58,3);
  block(117,60,8,10,0,58,3);
  block(-3,-2,136,79,56,5,7);
  block(39,12,42,22,61,3,6); block(56,19,9,7,64,17,3);
  // A monitor with a recessed display and a small power switch, all in one plane.
  plane([[20,79],[99,79],[99,127],[20,127]],14,"lo");
  plane([[20,79],[99,79],[99,127],[20,127]],17);
  plane([[24,84],[95,84],[95,123],[24,123]],17.1,"nf lo",root,3);
  const monitorLines = [];
  [0,1,2,3,4].forEach(i => monitorLines.push(path(seg(P(31+i%2*6,17.2,116-i*6),P(70+(i%3)*6,17.2,116-i*6)),"nf lo")));
  const power = oval(90,17.3,81.5,.65,.65,"hi");
  // Ceramic cup and handle, part of an ordinary working desk.
  const cup = rrect(108,31,122,45,7,14), inset = rrect(109.2,32.2,120.8,43.8,5.8,14);
  const mug = solid(root); put(mug,prism(P,front,cup,inset,61,76));
  path(poly(ringAt(P,inset,76)),"nf lo");
  oval(124,38,68.5,3.2,4.5,"nf");
  block(26,45,67,23,61,2.2,3);
  const keyGroup = mk("g",{},root), keys=[];
  for(let row=0;row<3;row++) for(let col=0;col<9;col++) {
    const x=30+col*6.6,y=48+row*5.3;
    const key=path(poly(ringAt(P,rrect(x,y,x+4.6,y+3.2,1,4),63.5)),"nf lo",keyGroup);
    keys.push({x:x+2.3,y:y+1.6,key});
  }
  // Seat and five-star base are readable below the desk.
  const base = [[65,92,8],[39,107,1],[65,92,8],[91,108,1],[65,92,8],[85,75,1],[65,92,8],[47,78,1]];
  path(open(base.map(p=>P(...p))),"nf");
  block(61,88,7,8,8,27,3); block(45,80,42,29,33,5,8);
  // Trousers bend forward from the seat. Rounded footwear meets the floor.
  plane([[43,37],[56,36],[58,16],[49,6],[41,9],[47,21]],81,"sil",root,5);
  block(35,70,20,14,1,7,6);
  plane([[71,36],[83,38],[88,22],[81,6],[70,7],[75,22]],90,"sil",root,5);
  block(64,83,23,14,1,7,6);
  // Hoodie silhouette: broad shoulders, relaxed sleeves, and a curved hem.
  const body = mk("g",{},root);
  plane([[47,39],[80,39],[85,52],[82,76],[74,87],[55,88],[43,76],[41,56]],98,"sil",body,7);
  path(open([P(45,98.2,46),P(61,98.2,43),P(79,98.2,46)]),"nf lo",body);
  // Two arms reach around the torso toward the keyboard, moving with the same spring.
  const arms = [path("","sil"),path("","sil")];
  const cuffs = [path("","nf lo"),path("","nf lo")];
  const head = mk("g",{},root);
  plane([[59,83],[72,83],[73,96],[59,96]],93,"sil",head,3);
  oval(65,91,106,15,19,"sil",head);
  // Hairline and headphone band make the human recognisable from the back.
  path(open(Array.from({length:33},(_,i)=>{const a=Math.PI*i/32;return P(65+Math.cos(a)*16.7,93,105+Math.sin(a)*20.5);})),"nf",head);
  plane([[49,99],[54,99],[54,111],[49,111]],94,"sil",head,2);
  plane([[77,99],[82,99],[82,111],[77,111]],94,"sil",head,2);
  path(open([P(53,91.2,114),P(57,91.2,118),P(71,91.2,117),P(77,91.2,112)]),"nf lo",head);
  const armPose = spring(0); let reach=value, last=NaN, active=false;
  const restKey=P(61,58,64);
  function draw(amount) {
    if(Math.abs(amount-last)<.0001)return;
    last=amount;
    [0,1].forEach(i=>{
      const x=i?80:44, hand=i?73:49, shift=amount*(i?1:.65);
      const pts=[[x,96,77],[x+(i?8:-7),86,65],[hand+shift,58,65],[hand+shift-5,56,63],[x+(i?2:-10),76,59],[x-5,96,67]];
      const projected=pts.map(p=>P(...p));
      arms[i].setAttribute("d",poly(fillet(projected,projected.map(()=>2.6),8)));
      cuffs[i].setAttribute("d",seg(P(hand+shift,64,65),P(hand+shift-5,63,62)));
    });
    head.setAttribute("transform",`translate(${amount*.07},${Math.abs(amount)*.04})`);
    keys.forEach(k=>k.key.classList.toggle("hi",active && Math.abs(k.x-(61+amount))<4 && Math.abs(k.y-54)<3));
  }
  const B=register(stage,dt=>{const moving=stepS(armPose,dt);draw(armPose.x);return moving;});
  bag.add(B.unregister);
  bag.add(pointer(stage,{
    move:([x,y])=>{
      active=Math.abs(x-restKey[0])<100&&Math.abs(y-restKey[1])<78;
      armPose.t=active?clamp((x-restKey[0])*.35+reach*.7,-reach,reach):0;
      power.classList.toggle("hi",!active);
      read.textContent=active?"building":"rest";B.wake();
    },
    leave:()=>{active=false;armPose.t=0;power.classList.add("hi");read.textContent="rest";last=NaN;B.wake();},
  }));
  draw(0);read.textContent="rest";bag.add(()=>svg.replaceChildren());
  return {set:v=>{reach=v;armPose.t=clamp(armPose.t,-reach,reach);B.wake();},destroy:bag.dispose};
}

hairline({name:"builder",means:"A builder at a desk: move across the keyboard and the hands follow your next idea.",rules:[1,3,7,8,9,10],range:[4,10,16],tour:[[186,173],[225,157],[155,178],null],mount});

})();
