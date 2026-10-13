// Seven seats form an incomplete ring. The eighth slides into the open place.
const { Cam, fit, proj, facing, rings, rrect, prism, solid, put, mk, poly, ringAt, tween, tset, tval, tdone, register, pointer, disposer, clamp } = HL;
function mount({stage,svg,read},value){
  const bag=disposer(),C=Cam(45,.5,2.25);
  fit(C,[[-53,-53,0],[85,53,0],[-53,53,0],[85,-53,0],[0,0,30]],200,165);
  const P=proj(C),front=facing(C),group=mk("g",{},svg);
  put(solid(group),prism(P,front,rrect(-51,-51,51,51,49,18),rrect(-49.6,-49.6,49.6,49.6,47.6,18),0,4));
  mk("path",{d:poly(ringAt(P,rrect(28,-9,46,9,6,6),4.3)),class:"lo nf dash"},group);
  let distance=value,active=-1,last=-1;
  const positions=Array.from({length:7},(_,i)=>{const angle=(i+1)*Math.PI/4;return{x:37*Math.cos(angle),y:37*Math.sin(angle),h:16+(i%3)*2};});
  const nodes=positions.map(p=>({...p,shape:solid(group)}));
  nodes.forEach(n=>put(n.shape,prism(P,front,...rings(n.x-8,n.y-8,n.x+8,n.y+8,6,1),4,n.h)));
  const loose=solid(group),tw=tween(0);loose.sil.classList.add("hi");
  const loop=register(stage,(_dt,now)=>{
    const t=tval(tw,now);if(t!==last){const x=37+distance*(1-t),y=-25*(1-t);
      put(loose,prism(P,front,...rings(x-8,y-8,x+8,y+8,6,1),4,21));
      [...nodes.map(n=>({order:n.x+n.y,g:n.shape.g})),{order:x+y,g:loose.g}].sort((a,b)=>a.order-b.order).forEach(n=>group.append(n.g));last=t;
    }return !tdone(tw,now);
  });
  function choose(next){if(next===active)return;active=next;tset(tw,next===1?1:0,performance.now(),0);read.textContent=next<0?"rest":next===1?"seated":"open";loop.wake();}
  read.textContent="rest";
  bag.add(pointer(stage,{move:([x,y])=>{const a=P(37+distance,-25,21),b=P(37,0,21);choose(Math.min(Math.hypot(x-a[0],y-a[1]),Math.hypot(x-b[0],y-b[1]))<48?1:0);},leave:()=>choose(-1)}));
  bag.add(loop.unregister);bag.add(()=>svg.replaceChildren());
  return{set:v=>{distance=clamp(v,18,34);last=-1;loop.wake();},destroy:bag.dispose};
}
hairline({name:"seat",means:"One place is open in a ring of nodes; the loose node slides in to complete it.",rules:[1,4,5,6,8,9],range:[18,26,34],tour:[[307,166],[255,187],[113,164],null],mount});
