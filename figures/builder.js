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
