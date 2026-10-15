/** Rounded pins rise around a fixed ground-plane pointer; two quiet peaks compose rest. */
const { Cam, clamp, facing, fit, prism, proj, rings, unproj, spring, stepS,
  flatDot, mk, place, pointer, put, register, disposer, solid } = HL;
const N = 7, CELL = 16, FOOT = 10, EXT = N * CELL, HMAX = 47;
function mount({ stage, svg, read }, value) {
  const bag = disposer(), C = Cam(45, 0.5, 1.76);
  fit(C, [[-6,-6,-5],[EXT+6,EXT+6,-5],[EXT+6,-6,-5],[-6,EXT+6,-5],[0,0,HMAX]],200,146);
  const P = proj(C), front = facing(C), g = mk('g',{},svg), pins = [];
  const [plate, crease] = rings(-6,-6,EXT+6,EXT+6,9,1.8);
  put(solid(g),prism(P,front,plate,crease,-5,0));
  let radius = value * CELL, over = null, chosen = null;
  for(let sum=0;sum<=2*(N-1);sum++)for(let i=0;i<N;i++) {
    const j=sum-i;
    if(j<0||j>=N)continue;
    const x=(i+.5)*CELL,y=(j+.5)*CELL;
    const rest=6+24*Math.exp(-((i-1.5)**2+(j-4.5)**2)/3.7)+12*Math.exp(-((i-5)**2+(j-1)**2)/1.8);
    const [ring,inner]=rings(x-FOOT/2,y-FOOT/2,x+FOOT/2,y+FOOT/2,4.9,.8);
    pins.push({i,j,x,y,rest,ring,inner,sp:spring(rest,{eps:.04}),el:solid(g),drawn:NaN});
  }
  const peak=pins.reduce((a,b)=>a.rest>b.rest?a:b),mark=flatDot(g,C,.85,'dot');
  chosen=peak;
  function draw(pin) {
    const h=clamp(pin.sp.x,.6,HMAX);
    if(h!==pin.drawn){pin.drawn=h;put(pin.el,prism(P,front,pin.ring,pin.inner,0,h));}
    pin.el.sil.classList.toggle('hi',pin===chosen);
  }
  const loop=register(stage,dt=>{
    let moving=false;
    for(const pin of pins){if(stepS(pin.sp,dt))moving=true;draw(pin);}
    chosen.el.g.after(mark);
    place(mark,P(chosen.x,chosen.y,clamp(chosen.sp.x,.6,HMAX)));
    return moving;
  });
  bag.add(loop.unregister);
  function retarget(){
    chosen=over?pins.reduce((a,b)=>Math.hypot(a.x-over[0],a.y-over[1])<Math.hypot(b.x-over[0],b.y-over[1])?a:b):peak;
    for(const pin of pins){
      const distance=over?Math.hypot(pin.x-over[0],pin.y-over[1])/radius:0;
      pin.sp.t=over?clamp(5+42*Math.exp(-distance*distance*2),5,HMAX):pin.rest;
    }
    read.textContent=over?'pin '+(chosen.i+1)+'·'+(chosen.j+1):'rest';
    loop.wake();
  }
  bag.add(pointer(stage,{
    move:p=>{const point=unproj(C,p[0],p[1],0);over=[clamp(point[0],0,EXT),clamp(point[1],0,EXT)];retarget();},
    leave:()=>{over=null;retarget();}
  }));
  bag.add(()=>svg.replaceChildren());
  retarget();
  return {set:v=>{radius=v*CELL;retarget();},destroy:bag.dispose};
}
hairline({
  name:'pin-field',
  means:'A bed of rounded pins rises around the pointer and settles into two small peaks.',
  rules:[1,3,4,5,6,7,8,9],
  range:[1.5,2.7,4.5],
  tour:[[134,140],[260,154],[200,210],null],
  mount,
});
