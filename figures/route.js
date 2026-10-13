// Five capped pins along a bent, dashed route; the nearest pin rises alone.
const { Cam, fit, proj, facing, rings, prism, solid, put, mk, open, tween, tset, tval, tdone, register, pointer, disposer, clamp } = HL;
function mount({ stage, svg, read }, value) {
  const bag = disposer(), C = Cam(45,.5,2);
  fit(C, [[-57,-42,0],[57,45,0],[-57,45,0],[57,-42,0],[0,0,56]],200,165);
  const P = proj(C), front = facing(C), group = mk("g",{},svg);
  const points = [[-42,-24],[-15,-24],[9,-2],[37,0],[37,31]];
  const plate = rings(-57,-42,57,45,10,1.3);
  put(solid(group),prism(P,front,...plate,0,4));
  mk("path",{ d:open(points.map(([x,y]) => P(x,y,4.4))), class:"dash nf" },group);
  let lift=value, active=-1;
  const pins = points.map(([x,y],i) => ({ x,y,rest:i===1?6:0, stem:solid(group),cap:solid(group),tw:tween(i===1?6:0),last:-1 }));
  const loop=register(stage,(_dt,now) => {
    let moving=false;
    pins.forEach(pin => {
      const z=tval(pin.tw,now);
      if (z !== pin.last) {
        put(pin.stem,prism(P,front,...rings(pin.x-2,pin.y-2,pin.x+2,pin.y+2,1.5,.5),4+z,22+z));
        put(pin.cap,prism(P,front,...rings(pin.x-7,pin.y-7,pin.x+7,pin.y+7,5,1),22+z,28+z)); pin.last=z;
      }
      moving ||= !tdone(pin.tw,now);
    }); return moving;
  });
  function choose(index,force=false) {
    if (index===active && !force) return;
    active=index;
    pins.forEach((pin,i) => { tset(pin.tw,pin.rest+(i===index?lift:0),performance.now(),0); pin.cap.sil.classList.toggle("hi",i===(index<0?1:index)); });
    read.textContent=index<0?"rest":String(index+1).padStart(2,"0"); loop.wake();
  }
  choose(-1,true);
  bag.add(pointer(stage,{ move:([x,y]) => {
    let index=-1,best=42;
    pins.forEach((pin,i) => { const p=P(pin.x,pin.y,28+pin.rest),d=Math.hypot(x-p[0],y-p[1]); if(d<best){best=d;index=i;} }); choose(index);
  }, leave:()=>choose(-1) }));
  bag.add(loop.unregister); bag.add(()=>svg.replaceChildren());
  return { set:v=>{lift=clamp(v,8,22);choose(active,true);}, destroy:bag.dispose };
}
hairline({ name:"route", means:"Five pins trace the rooms where people meet; the nearest pin lifts from the route.", rules:[1,3,4,7,8], range:[8,14,22], tour:[[178,152],[251,162],[210,214],null], mount });
