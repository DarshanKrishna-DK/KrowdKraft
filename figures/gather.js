// Seven pegs on a low plinth. One connection exists; a nearby open pair joins.
const { Cam, fit, proj, facing, rings, prism, solid, put, mk, tween, tset, tval, tdone, register, pointer, disposer, clamp } = HL;
function mount({ stage, svg, read }, value) {
  const bag = disposer(), C = Cam(45, .5, 2.05);
  fit(C, [[-57,-48,0],[58,57,0],[-57,57,0],[58,-48,0],[0,0,36]], 200, 165);
  const P = proj(C), front = facing(C), group = mk("g", {}, svg);
  const base = rings(-57,-48,58,57,10,1.4);
  put(solid(group), prism(P, front, ...base, 0, 5));
  const nodes = [[-37,-20,18],[0,-27,22],[33,-21,17],[-30,16,19],[9,8,24],[39,20,16],[-4,38,18]];
  const pairs = [[0,1],[1,2],[3,4],[4,5],[4,6],[0,3],[2,5]];
  let width = value, active = -1;
  const links = pairs.map(([a,b], i) => ({ a: nodes[a], b: nodes[b], shape: solid(group), tw: tween(i === 0 ? 1 : 0), last: -1 }));
  nodes.toSorted((a,b) => a[0]+a[1]-b[0]-b[1]).forEach(([x,y,h]) => {
    put(solid(group), prism(P, front, ...rings(x-8,y-8,x+8,y+8,6,1), 5, h));
  });
  function draw(link, amount) {
    if (amount < .001) { put(link.shape, { sil: "", crease: "" }); return; }
    const [x,y] = link.a, dx = link.b[0]-x, dy = link.b[1]-y, length = Math.hypot(dx,dy), c = dx/length, s = dy/length;
    const transform = ring => ring.map(q => ({ u:x+q.u*c-q.v*s, v:y+q.u*s+q.v*c, nu:q.nu*c-q.nv*s, nv:q.nu*s+q.nv*c }));
    const rr = rings(0,-width,length*amount,width,Math.min(width, length*amount/2), Math.min(.7,length*amount/4,width/2));
    const height = Math.min(link.a[2],link.b[2]);
    put(link.shape, prism(P, front, ...rr.map(transform), height-4, height));
  }
  const loop = register(stage, (_dt,now) => {
    let moving = false;
    links.forEach(link => { const t = tval(link.tw,now); if (t !== link.last) { draw(link,t); link.last=t; } moving ||= !tdone(link.tw,now); });
    return moving;
  });
  function choose(index) {
    if (index === active) return;
    active = index;
    links.forEach((link,i) => { tset(link.tw, i === 0 || i === index ? 1 : 0, performance.now(), 0); link.shape.sil.classList.toggle("hi", i === (index < 0 ? 0 : index)); });
    read.textContent = index < 0 ? "rest" : "links 2"; loop.wake();
  }
  links[0].shape.sil.classList.add("hi"); read.textContent = "rest";
  bag.add(pointer(stage, { move: ([x,y]) => {
    let index = -1, best = 52;
    links.forEach((link,i) => { if (!i) return; const p = P((link.a[0]+link.b[0])/2,(link.a[1]+link.b[1])/2,12), d = Math.hypot(x-p[0],y-p[1]); if (d < best) { best=d; index=i; } });
    choose(index);
  }, leave: () => choose(-1) }));
  bag.add(loop.unregister); bag.add(() => svg.replaceChildren());
  return { set: v => { width=clamp(v,2.5,4.5); links.forEach(link => link.last=-1); loop.wake(); }, destroy: bag.dispose };
}
hairline({ name: "gather", means: "Seven nodes gather on a plinth; move between two to make another connection.", rules: [1,4,5,7,9], range: [2.5,3.5,4.5], tour: [[248,156],[164,173],[200,202],null], mount });
