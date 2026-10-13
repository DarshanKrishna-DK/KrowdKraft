// Two islands with an open gap. A single bridge grows from one bank to the other.
const { Cam, fit, proj, facing, rings, prism, solid, put, mk, tween, tset, tval, tdone, register, pointer, disposer, clamp } = HL;
function mount({stage,svg,read},value){
  const bag=disposer(),C=Cam(45,.5,2.25);
  fit(C,[[-64,-30,0],[64,34,0],[-64,34,0],[64,-30,0],[0,0,34]],200,162);
  const P=proj(C),front=facing(C),group=mk("g",{},svg);
  [-1,1].forEach(side=>{const x0=side<0?-64:20,x1=side<0?-20:64;put(solid(group),prism(P,front,...rings(x0,-30,x1,34,8,1.3),0,7));});
  const bridge=solid(group),tw=tween(0);let width=value,last=-1,active=-1;
  const nodes=[[-47,-15,23],[-34,13,19],[-51,20,14],[39,-13,28],[50,14,20],[29,21,16]]
    .sort((a,b)=>a[0]+a[1]-b[0]-b[1]).map(([x,y,h],i)=>{const shape=solid(group);put(shape,prism(P,front,...rings(x-7,y-7,x+7,y+7,5,1),7,h));return{shape,i};});
  const loop=register(stage,(_dt,now)=>{
    const t=tval(tw,now);if(t!==last){
      if(t<.001)put(bridge,{sil:"",crease:""});
      else put(bridge,prism(P,front,...rings(-24,-width,-24+48*t,width,Math.min(3,24*t),Math.min(.8,12*t)),7,11));
      last=t;
    }return !tdone(tw,now);
  });
  function choose(next){if(next===active)return;active=next;tset(tw,next===1?1:0,performance.now(),0);
    bridge.sil.classList.toggle("hi",next===1);nodes[1].shape.sil.classList.toggle("hi",next!==1);
    read.textContent=next<0?"rest":next===1?"linked":"open";loop.wake();}
  nodes[1].shape.sil.classList.add("hi");read.textContent="rest";
  const center=P(0,0,10);
  bag.add(pointer(stage,{move:([x,y])=>choose(Math.hypot(x-center[0],y-center[1])<70?1:0),leave:()=>choose(-1)}));
  bag.add(loop.unregister);bag.add(()=>svg.replaceChildren());
  return{set:v=>{width=clamp(v,4,8);last=-1;loop.wake();},destroy:bag.dispose};
}
hairline({name:"bridge",means:"Two groups have room between them; move into the gap to build a bridge.",rules:[1,4,5,7,8,9],range:[4,6,8],tour:[[200,165],[247,178],[104,175],null],mount});
