// An uneven group of city blocks. Selection raises one, while its neighbours hold.
const { Cam, fit, proj, facing, rings, prism, solid, put, mk, tween, tset, tval, tdone, register, pointer, disposer, clamp } = HL;
function mount({stage,svg,read},value) {
  const bag=disposer(),C=Cam(45,.5,2.1);
  fit(C,[[-51,-47,0],[53,49,0],[-51,49,0],[53,-47,0],[0,0,76]],200,166);
  const P=proj(C),front=facing(C),group=mk("g",{},svg);
  put(solid(group),prism(P,front,...rings(-51,-47,53,49,9,1.4),0,4));
  let lift=value,active=-1;
  const blocks=[[-32,-26,24,20],[-1,-29,43,22],[29,-22,28,19],[-30,9,34,23],[4,3,52,22],[31,15,20,19],[0,32,17,20]]
    .map(([x,y,h,w],i)=>({x,y,h,w,i,tw:tween(h),last:-1})).sort((a,b)=>a.x+a.y-b.x-b.y)
    .map(block=>({...block,shape:solid(group)}));
  const loop=register(stage,(_dt,now)=>{
    let moving=false;
    blocks.forEach(block=>{const z=tval(block.tw,now);if(z!==block.last){put(block.shape,prism(P,front,...rings(block.x-block.w/2,block.y-block.w/2,block.x+block.w/2,block.y+block.w/2,4,1.2),4,z));block.last=z;}moving ||= !tdone(block.tw,now);});
    return moving;
  });
  function choose(index,force=false){
    if(index===active&&!force)return;active=index;
    blocks.forEach(block=>{tset(block.tw,block.h+(block.i===index?lift:0),performance.now(),0);block.shape.sil.classList.toggle("hi",block.i===(index<0?4:index));});
    read.textContent=index<0?"rest":String(index+1).padStart(2,"0");loop.wake();
  }
  choose(-1,true);
  bag.add(pointer(stage,{move:([x,y])=>{let index=-1,best=38;blocks.forEach(block=>{const p=P(block.x,block.y,block.h),d=Math.hypot(x-p[0],y-p[1]);if(d<best){best=d;index=block.i;}});choose(index);},leave:()=>choose(-1)}));
  bag.add(loop.unregister);bag.add(()=>svg.replaceChildren());
  return {set:v=>{lift=clamp(v,8,24);choose(active,true);},destroy:bag.dispose};
}
hairline({name:"blocks",means:"An uneven city of rounded blocks; the block nearest your pointer rises.",rules:[1,3,5,8,9],range:[8,16,24],tour:[[247,141],[156,173],[223,210],null],mount});
