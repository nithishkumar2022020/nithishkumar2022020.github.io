
const root=document.getElementById('hero-robot');
try{
const THREE=await import('./three.module.js');
const host=root.querySelector('.robot-render');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;host.appendChild(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(3.6,2.9,9.3);camera.lookAt(0,1.65,0);camera.zoom=1.35;camera.updateProjectionMatrix();
scene.add(new THREE.HemisphereLight(0xcfe2ed,0x15181c,2));const key=new THREE.DirectionalLight(0xffffff,4.5);key.position.set(-3,6,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.normalBias=.025;scene.add(key);const rim=new THREE.DirectionalLight(0x75d9bd,3.5);rim.position.set(3,4,-4);scene.add(rim);const fill=new THREE.DirectionalLight(0x99b8df,1.8);fill.position.set(-4,2,-2);scene.add(fill);
const silver=new THREE.MeshStandardMaterial({color:0x89949f,metalness:.68,roughness:.32}),dark=new THREE.MeshStandardMaterial({color:0x252b33,metalness:.65,roughness:.36}),rubber=new THREE.MeshStandardMaterial({color:0x13171e,roughness:.8}),mint=new THREE.MeshStandardMaterial({color:0x8ce7ca,emissive:0x3bad88,emissiveIntensity:.6,roughness:.3}),glass=new THREE.MeshStandardMaterial({color:0x1a3440,metalness:.65,roughness:.13}),white=new THREE.MeshStandardMaterial({color:0xbec9cf,metalness:.45,roughness:.25});
const inkMaterial=new THREE.MeshStandardMaterial({color:0x35434b,metalness:.7,roughness:.38});
const shellMaterial=new THREE.MeshStandardMaterial({color:0xd6ddd6,metalness:.22,roughness:.42});
const tealMaterial=new THREE.MeshStandardMaterial({color:0x347d82,metalness:.4,roughness:.35});
const amberMaterial=new THREE.MeshStandardMaterial({color:0xffbd58,emissive:0xf4a235,emissiveIntensity:.4,roughness:.35});
const insetMaterial=new THREE.MeshStandardMaterial({color:0x151c23,roughness:.82});
const lensMaterial=new THREE.MeshStandardMaterial({color:0x153743,metalness:.6,roughness:.16});
const outlineMaterial=new THREE.MeshBasicMaterial({color:0x718b94,side:THREE.BackSide});
const mutedOutline=new THREE.MeshBasicMaterial({color:0x859ba4,side:THREE.BackSide});
const mintMaterial=new THREE.MeshBasicMaterial({color:0x83dfc0});
function mesh(geo,mat,parent=bot){
 const accent=mat===mint;
 const m=new THREE.Mesh(geo,accent?mintMaterial:(mat===white||mat===silver)?shellMaterial:mat===glass?lensMaterial:mat===rubber?insetMaterial:inkMaterial);
 if(!accent){const hull=new THREE.Mesh(geo,(mat===rubber||mat===dark)?mutedOutline:outlineMaterial);hull.scale.setScalar(1.018);m.add(hull);}
 parent.add(m);return m;
}
function rounded(w,h,d,r=.08){const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);const g=new THREE.ExtrudeGeometry(s,{depth:d-.06,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.03,bevelThickness:.03,curveSegments:10});g.translate(0,0,-d/2+.03);return g}
const bot=new THREE.Group();scene.add(bot);
const torso=new THREE.Group();bot.add(torso);torso.position.y=1.32;
// Tapered, compact equipment chest; no humanoid arms.
const bodyShape=new THREE.Shape();bodyShape.moveTo(-.38,.35);bodyShape.lineTo(.38,.35);bodyShape.lineTo(.4,-.06);bodyShape.lineTo(.23,-.38);bodyShape.lineTo(-.23,-.38);bodyShape.lineTo(-.4,-.06);bodyShape.closePath();
const bodyGeo=new THREE.ExtrudeGeometry(bodyShape,{depth:.43,bevelEnabled:true,bevelSegments:1,bevelSize:.025,bevelThickness:.025});bodyGeo.translate(0,0,-.215);mesh(bodyGeo,silver,torso);
const chest=mesh(rounded(.43,.2,.09,.025),white,torso);chest.position.set(0,.15,.26);chest.material=tealMaterial;
const display=mesh(new THREE.BoxGeometry(.29,.075,.015),dark,torso);display.position.set(0,.16,.32);
for(let i=0;i<3;i++){const slot=mesh(new THREE.BoxGeometry(.05,.025,.018),i===0?mint:glass,torso);slot.position.set(-.1+i*.09,.16,.335);slot.material=i===0?amberMaterial:mintMaterial}
for(let i=0;i<4;i++){const vent=mesh(new THREE.BoxGeometry(.3-i*.035,.016,.025),white,torso);vent.position.set(0,-.07-i*.06,.257)}
for(let side of [-1,1]){const rail=mesh(rounded(.08,.34,.1,.025),dark,torso);rail.position.set(side*.45,.08,-.04);rail.material=tealMaterial;}
// Exposed neck strut with a pivot and a second actuator.
function rodBetween(a,b,r,mat,parent=bot){const delta=b.clone().sub(a);const m=mesh(new THREE.CylinderGeometry(r,r,1,10),mat,parent);m.position.copy(a).add(b).multiplyScalar(.5);m.scale.y=delta.length();m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m}
rodBetween(new THREE.Vector3(0,1.65,-.05),new THREE.Vector3(0,2.02,-.12),.055,dark);
rodBetween(new THREE.Vector3(.1,1.65,.04),new THREE.Vector3(.1,2.01,-.02),.024,white);
const head=new THREE.Group();head.position.set(0,2.12,-.08);bot.add(head);
mesh(rounded(1.25,.36,.43,.025),white,head);
const bottomPlate=mesh(new THREE.BoxGeometry(1.15,.04,.36),dark,head);bottomPlate.material=tealMaterial;bottomPlate.position.y=-.2;
const eyes=[];
for(let i=0;i<2;i++){const eye=new THREE.Group();eye.position.set(i?.28:-.25,.015,.245);head.add(eye);const size=i?.13:.16;
 const barrel=mesh(new THREE.CylinderGeometry(size,size,.09,32),white,eye);barrel.rotation.x=Math.PI/2;
 const lens=mesh(new THREE.CylinderGeometry(size*.76,size*.76,.02,32),glass,eye);lens.rotation.x=Math.PI/2;lens.position.z=.055;
 const rim=mesh(new THREE.TorusGeometry(size*.7,.007,8,32),i?white:mint,eye);rim.position.z=.07;
 const center=mesh(new THREE.CircleGeometry(size*.42,24),glass,eye);center.position.z=.075;eyes.push(eye);
}
const antennas=[];
for(let side of [-1,1]){for(let row=0;row<3;row++)for(let col=0;col<3;col++){const hole=mesh(new THREE.CircleGeometry(.009,8),white,head);hole.position.set(side*(.49+col*.025),-.025+row*.03,.249)}
 const antennaGroup=new THREE.Group();antennaGroup.position.set(side*.49,.2,-.11);head.add(antennaGroup);antennas.push(antennaGroup);
 const antenna=rodBetween(new THREE.Vector3(0,0,0),new THREE.Vector3(side*.07,.44,-.03),.007,white,antennaGroup);
 const tip=mesh(new THREE.SphereGeometry(.017,10,10),side===1?mint:white,antennaGroup);tip.position.set(side*.07,.45,-.03);tip.material=side===1?amberMaterial:mintMaterial;
 const ear=mesh(new THREE.CylinderGeometry(.072,.072,.06,20),dark,head);ear.rotation.z=Math.PI/2;ear.position.set(side*.67,.025,-.04);
}
const happyEyes=eyes.map((eye,i)=>{
 const size=i?.066:.081;
 const caret=new THREE.Line(new THREE.BufferGeometry().setFromPoints([
 new THREE.Vector3(-size,-.014,.092),new THREE.Vector3(0,.032,.092),new THREE.Vector3(size,-.014,.092)
 ]),new THREE.LineBasicMaterial({color:0x9cffe0}));caret.visible=false;eye.add(caret);return caret;
});
// Two articulated bird-like legs. Foot targets drive the knee geometry.
const feet=[],arms=[];
for(let side of [-1,1]){
 const leg=new THREE.Group();leg.position.set(side*.35,0,0);bot.add(leg);
 const hip=mesh(new THREE.SphereGeometry(.1,16,12),white,leg);hip.position.set(0,1.02,0);
 const thigh=mesh(new THREE.CylinderGeometry(.045,.045,1,12),white,leg);
 const shin=mesh(rounded(.14,1,.14,.025),silver,leg);shin.material=tealMaterial;
 const knee=mesh(new THREE.CylinderGeometry(.11,.11,.16,20),dark,leg);knee.rotation.z=Math.PI/2;
 const ankle=mesh(new THREE.CylinderGeometry(.075,.075,.12,16),white,leg);ankle.rotation.z=Math.PI/2;
 const foot=mesh(rounded(.25,.13,.44,.025),white,leg);
 const toe=mesh(new THREE.BoxGeometry(.19,.025,.045),mint,leg);toe.material=tealMaterial;
 const cableGeo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3()]);const cable=new THREE.Line(cableGeo,new THREE.LineBasicMaterial({color:0x60747f}));leg.add(cable);
 feet.push({leg,thigh,shin,knee,ankle,foot,toe,cable});
}
function placeSegment(m,a,b){let delta=b.clone().sub(a);m.position.copy(a).add(b).multiplyScalar(.5);m.scale.y=delta.length();m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize())}
// Only a soft pool of light beneath the robot reveals the floor.
const lightCanvas=document.createElement('canvas');lightCanvas.width=256;lightCanvas.height=256;
const lightCtx=lightCanvas.getContext('2d');const glow=lightCtx.createRadialGradient(128,128,12,128,128,120);
glow.addColorStop(0,'rgba(143,182,174,.24)');glow.addColorStop(.3,'rgba(109,148,142,.14)');glow.addColorStop(.65,'rgba(90,117,116,.05)');glow.addColorStop(1,'rgba(90,117,116,0)');
lightCtx.fillStyle=glow;lightCtx.fillRect(0,0,256,256);
const pool=new THREE.Mesh(new THREE.PlaneGeometry(2.5,1.9),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(lightCanvas),transparent:true,depthWrite:false}));pool.rotation.x=-Math.PI/2;pool.position.y=.003;scene.add(pool);
const contactCanvas=document.createElement('canvas');contactCanvas.width=128;contactCanvas.height=128;const contactCtx=contactCanvas.getContext('2d'),contactGrad=contactCtx.createRadialGradient(64,64,3,64,64,60);contactGrad.addColorStop(0,'rgba(0,0,0,.8)');contactGrad.addColorStop(.5,'rgba(0,0,0,.3)');contactGrad.addColorStop(1,'rgba(0,0,0,0)');contactCtx.fillStyle=contactGrad;contactCtx.fillRect(0,0,128,128);const contactTexture=new THREE.CanvasTexture(contactCanvas);
const footShadows=[-1,1].map(()=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(.55,.7),new THREE.MeshBasicMaterial({map:contactTexture,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=.006;scene.add(m);return m;});
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let t=0,last=0;const state={playing:!reducedMotion.matches,speed:1};
function sync(){}
let visible=false;
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;last=0;},{threshold:.01}).observe(root);
document.addEventListener('visibilitychange',()=>{last=0;});
const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
let frameClock=0;const frameInterval=1000/60;
function frame(now){requestAnimationFrame(frame);if(frameClock&&now-frameClock<frameInterval)return;frameClock=now-((now-frameClock)%frameInterval);if(!visible||document.hidden||innerWidth<768){last=0;return;}const dt=last?Math.min(.15,(now-last)/1000):0;last=now;if(state.playing)t+=dt*state.speed;const p=Math.min(t,13.5);
let x=0,hy=0,hz=0,heading=0,walking=false,cycle=0,greeting=false;
// Reference: 44 px/s at the design scale; 11.5 rad/s duck gait.
const viewportHeight=host.clientHeight||290;
const unitsToPixels=camera.zoom*viewportHeight/(2*Math.tan(35*Math.PI/360)*camera.position.length());
const worldSpeed=44/unitsToPixels;
const restingX=-1.65;const travelDistance=5.6-restingX;const entranceTime=travelDistance/worldSpeed;
// Derive travel timing from the actual rendered stage instead of fixed easing.
const arrival=entranceTime,helloStart=arrival+.45,helloEnd=helloStart+2,exitStart=helloEnd+.45,endTime=exitStart+entranceTime;
const time=reducedMotion.matches?helloStart+.3:t%(endTime+.65);
if(time<arrival){x=Math.max(restingX,5.6-worldSpeed*time);heading=-1.35;walking=true;cycle=time*11.5;}
else if(time<helloStart){x=restingX;heading=-1.35+1.77*ease((time-arrival)/.45);}
else if(time<helloEnd){x=restingX;heading=.42;greeting=true;const q=(time-helloStart)/2;hz=Math.sin(q*Math.PI*2)*.16;}
else if(time<exitStart){x=restingX;heading=.42+(.95-.42)*ease((time-helloEnd)/.45);}
else{x=Math.min(5.6,restingX+worldSpeed*(time-exitStart));heading=.95;walking=time<endTime;cycle=(time-exitStart)*11.5;}
const step=walking?Math.sin(cycle):0;
const waddle=walking?Math.cos(cycle):0;
const greetAge=greeting?time-helloStart:0;
// Each jump has anticipation, a ballistic flight, and an absorbed landing.
const jumpDuration=.96;
const jumpIndex=Math.min(1,Math.floor(greetAge/jumpDuration));
const jumpTime=greetAge-jumpIndex*jumpDuration;
let excitedHop=0,crouch=0,tuck=0;
if(greeting&&greetAge<jumpDuration*2){
 if(jumpTime<.2){const q=jumpTime/.2;crouch=.18*ease(q);}
 else if(jumpTime<.75){
  const q=(jumpTime-.2)/.55;
  excitedHop=(jumpIndex===0?.86:1.02)*4*q*(1-q);
  tuck=Math.sin(q*Math.PI)*.19;
 }else{
  const q=(jumpTime-.75)/.21;
  crouch=.19*Math.sin(q*Math.PI)*Math.exp(-q*.7);
 }
}
const landingSquash=crouch*.12;
const bounce=(walking?Math.abs(step)*.042:0)+excitedHop-crouch;
const forwardPitch=walking?THREE.MathUtils.degToRad(4.5+Math.cos(cycle*2)*3.5):0;
const neckBob=walking?THREE.MathUtils.degToRad(Math.sin(cycle*2)*5.5):0;
const headCounter=walking?THREE.MathUtils.degToRad(-Math.sin(cycle*2)*4.5):0;
bot.position.set(x,bounce,walking?waddle*.045:0);bot.rotation.set(0,heading+step*.025,walking?waddle*.065:0);
// Pitch the chassis forward but stabilize the sensor head, like the SVG reference.
torso.rotation.set(forwardPitch,0,0);torso.scale.y=1-landingSquash;
head.position.y=2.12+(walking?bounce*.15:0);head.rotation.set(-.07-forwardPitch+neckBob+headCounter,hy,hz);
happyEyes.forEach(caret=>caret.visible=greeting);
const greetingAge=greeting?time-helloStart:0;
const wiggle=greeting?THREE.MathUtils.degToRad(Math.sin(greetingAge*9)*9*Math.max(0,1-greetingAge/2)):0;
antennas.forEach((antenna,i)=>{antenna.rotation.z=wiggle*(i?1:-1);});

feet.forEach((part,i)=>{
 const phase=cycle+(i?Math.PI:0),side=i?1:-1,stride=walking?Math.sin(phase)*.18:0,lift=walking?Math.pow(Math.max(0,Math.cos(phase)),.72)*.065:0;
 part.leg.position.x=side*(.36+(walking?Math.max(0,Math.cos(phase))*.052:0));
 const hip=new THREE.Vector3(0,1.02,0),ankle=new THREE.Vector3(0,.15+lift+crouch+tuck,stride-(greeting?tuck*.6:0));
 const dz=ankle.z-hip.z,dy=ankle.y-hip.y,dist=Math.hypot(dz,dy),length=.5;
 const mid=hip.clone().add(ankle).multiplyScalar(.5),bend=Math.sqrt(Math.max(.002,length*length-dist*dist/4));
 const knee=mid.clone().add(new THREE.Vector3(0,-dz/dist*bend,dy/dist*bend));
 placeSegment(part.thigh,hip,knee);placeSegment(part.shin,knee,ankle);part.knee.position.copy(knee);part.ankle.position.copy(ankle);
 part.foot.position.set(0,.065+lift+crouch+tuck,stride+.08-(greeting?tuck*.6:0));part.foot.rotation.set(greeting?-tuck*.9:walking?Math.max(0,Math.cos(phase))*.08:0,side*.3,side*(walking?Math.max(0,Math.cos(phase))*.13:0));part.toe.position.set(side*.06,.048+lift+crouch+tuck,stride+.28-(greeting?tuck*.6:0));part.toe.rotation.y=side*.3;
 part.cable.geometry.setFromPoints([hip.clone().add(new THREE.Vector3(.11,0,0)),knee.clone().add(new THREE.Vector3(.11,0,-.07)),ankle.clone().add(new THREE.Vector3(.11,0,0))]);
});
pool.position.x=x;pool.position.z=bot.position.z;pool.material.opacity=time>exitStart+entranceTime*.7?Math.max(0,1-(time-exitStart-entranceTime*.7)/(entranceTime*.3)):1;pool.scale.setScalar(1-excitedHop*.2);
feet.forEach((part,i)=>{const wp=part.foot.getWorldPosition(new THREE.Vector3());footShadows[i].position.set(wp.x,.006,wp.z);footShadows[i].material.opacity=Math.max(.15,1-(wp.y-.065)*3);footShadows[i].rotation.z=-heading;});
const w=host.clientWidth,h=host.clientHeight;if(w&&h){if(renderer.domElement.width!==Math.round(w*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(h*renderer.getPixelRatio())){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}renderer.render(scene,camera)}
}requestAnimationFrame(frame);
}catch(error){root.hidden=true;console.error('Robot companion unavailable:',error)}
