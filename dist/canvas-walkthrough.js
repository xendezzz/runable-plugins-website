(()=>{
'use strict';
const playbackSpeed=1.2;
const hero=document.querySelector('.sky-hero'),dock=document.querySelector('.canvas-demo'),frame=dock.querySelector('.canvas-demo-frame'),scene=dock.querySelector('.demo-scene'),landing=dock.querySelector('.canvas-landing'),tabs=[...dock.querySelectorAll('[data-demo]')],reduce=matchMedia('(prefers-reduced-motion: reduce)');
const paths={pointer:'m4 3 15 10-7 1-3 7Z',hand:'M8 12V6a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v8-5a2 2 0 0 1 4 0v9c0 4-3 6-6 6s-5-2-7-5l-3-4a2 2 0 0 1 3-2Z',upload:'M12 15V4m-4 4 4-4 4 4M4 13v7h16v-7',image:'M17 3H4v17h17V9M4 16l5-6 6 7m0-10 3-3m0-3v6m-3-3h6',video:'M15 8H3v12h14V8l5-3v17l-5-3M14 3h6m-3-3v6',edit:'m4 16 12-12 4 4L8 20H4Zm10-10 4 4',mark:'M3 8V3h5m8 0h5v5m0 8v5h-5M8 21H3v-5',text:'M4 5h16M12 5v15m-4 0h8',download:'M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4',copy:'M8 8h12v12H8ZM4 15V4h11',eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm7 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0',expand:'M3 9V3h6m6 0h6v6m0 6v6h-6M9 21H3v-6',grid:'M3 3h18v18H3ZM3 9h18M3 15h18M9 3v18M15 3v18',arrow:'M4 12h16m-6-6 6 6-6 6',trash:'M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7'};
Object.assign(paths,{plus:'M12 5v14M5 12h14',chevron:'m6 9 6 6 6-6',clock:'M12 8v4l3 2M22 12a10 10 0 1 1-20 0 10 10 0 1 1 20 0',more:'M5 12h.01M12 12h.01M19 12h.01',check:'m5 12 4 4L19 6',play:'m8 5 11 7-11 7Z',pause:'M8 5v14M16 5v14'});
// One rounded, optically balanced 24px icon family for every control.
Object.assign(paths,{
 pointer:'M5.2 3.9c-.8-.5-1.7.2-1.4 1.1l4.4 14c.3 1 1.7 1.1 2.1.1l2.1-5.1 5.4-1.5c1-.3 1.2-1.6.3-2.1Z',
 hand:'M8 12V7a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v5-2a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-1c-2.3 0-3.8-1.2-5-3l-3-4.5a1.7 1.7 0 0 1 2.7-2L8 14',
 upload:'M12 15V3m-4 4 4-4 4 4M4 14v4a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-4',
 image:'M14 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-5M4 16l4-4a2 2 0 0 1 3 0l3 3 2-2a2 2 0 0 1 3 0l1 1M18 2v6m-3-3h6M8 8h.01',
 video:'M5 6h9a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Zm12 4 3.5-2a1 1 0 0 1 1.5.9v6.2a1 1 0 0 1-1.5.9L17 14',
 copy:'M10 8h8a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3ZM4 16a3 3 0 0 1-2-3V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 2',
 download:'M12 3v12m-4-4 4 4 4-4M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3',
 mark:'M3 8V6a3 3 0 0 1 3-3h2m8 0h2a3 3 0 0 1 3 3v2m0 8v2a3 3 0 0 1-3 3h-2M8 21H6a3 3 0 0 1-3-3v-2',
 expand:'M4 9V6a2 2 0 0 1 2-2h3m6 0h3a2 2 0 0 1 2 2v3m0 6v3a2 2 0 0 1-2 2h-3M9 20H6a2 2 0 0 1-2-2v-3',
 grid:'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM3 9h18M3 15h18M9 3v18M15 3v18'
});
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.image}"/></svg>`;

dock.querySelector('.demo-tools').innerHTML=['pointer','hand','upload','image','video'].map(n=>`<span aria-hidden="true">${icon(n)}</span>`).join('')+'<a class="demo-try-now" href="https://runable.com/sign-in?redirect=%2F&amp;signUp=true">Try now</a>';
dock.querySelector('.demo-cursor').innerHTML='<img src="assets/canvas-hero/demo-cursor.png" alt="">';
const demoCursor=dock.querySelector('.demo-cursor');
let cursorStartTimer=0;
let cursorFrame=0,cursorPose={x:55,y:75,rotation:0};
function moveCursor(x,y,onArrive){
 cancelAnimationFrame(cursorFrame);
 const from={...cursorPose},dx=x-from.x,dy=y-from.y;
 const distance=Math.hypot(dx,dy),duration=reduce.matches?0:Math.min(1600,1100+distance*10)/playbackSpeed;
 const lean=Math.max(-12,Math.min(12,dx*.35-dy*.12)),start=performance.now();
 let frozenAt=0,frozenTime=0;
 function animate(now){
  if(paused&&started&&!reduce.matches){if(!frozenAt)frozenAt=now;cursorFrame=requestAnimationFrame(animate);return}if(frozenAt){frozenTime+=now-frozenAt;frozenAt=0}
  const t=duration?Math.min(1,(now-start-frozenTime)/duration):1;
  const eased=t*t*t*(t*(t*6-15)+10);
  cursorPose={x:from.x+(x-from.x)*eased,y:from.y+(y-from.y)*eased,rotation:from.rotation*(1-eased)+lean*Math.sin(Math.PI*eased)};
  demoCursor.style.left=cursorPose.x+'%';demoCursor.style.top=cursorPose.y+'%';demoCursor.style.rotate=cursorPose.rotation+'deg';
  if(t<1)cursorFrame=requestAnimationFrame(animate);else{cursorFrame=0;if(onArrive)onArrive();}
 }
 cursorFrame=requestAnimationFrame(animate);
}
const layer=document.createElement('div');layer.className='canvas-transfer-layer';document.body.append(layer);
// Keep the original images and video elements throughout the scroll handoff.
const destinations=[[52,61,164,202],[881,69,212,119],[413,61,282,159],[235,61,159,197],[714,69,145,180]];
const cards=[...hero.querySelectorAll('.sky-media')].map((card,i)=>{const anchor=document.createElement('div');anchor.className='sky-media sky-anchor';anchor.style.cssText=card.style.cssText;anchor.dataset.nodeId=card.dataset.nodeId;anchor.setAttribute('aria-hidden','true');card.before(anchor);const target=document.createElement('div');target.className='canvas-land-slot';const [x,y,w,h]=destinations[i];target.style.cssText=`left:${x/1344*100}%;top:calc(${y}px * var(--landing-scale,1));width:${w/1344*100}%;height:auto;aspect-ratio:${w}/${h}`;landing.append(target);layer.append(card);return{card,anchor,target}});
let focus=-1,camera={x:0,y:0,scale:1},cameraFrame=0;
let progress=0,eligible=false,started=false,paused=reduce.matches,active=0,elapsed=0,last=0,stage=-1,raf=0,scrollFrame=0;
const playButton=document.createElement('button');
playButton.className='demo-playback';playButton.type='button';frame.append(playButton);
function updatePlayback(){playButton.innerHTML=icon(paused?'play':'pause');playButton.setAttribute('aria-label',paused?'Play animation':'Pause animation');dock.classList.toggle('animation-paused',paused);cards.forEach(({card})=>card.querySelectorAll('video').forEach(v=>{if(paused)v.pause();else if(eligible&&!reduce.matches)v.play().catch(()=>{})}));}
playButton.addEventListener('click',()=>{paused=!paused;if(!paused){if(active===4&&elapsed>=duration)select(0);last=0;if(eligible&&!raf)raf=requestAnimationFrame(tick)}updatePlayback()});
updatePlayback();
const clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>v*v*(3-2*v),lerp=(a,b,p)=>a+(b-a)*p;
function position(){scrollFrame=0;const dockRect=frame.getBoundingClientRect(),heroRect=hero.getBoundingClientRect(),end=scrollY+dockRect.top-innerHeight*.38;progress=reduce.matches?(dockRect.top<innerHeight*.7?1:0):ease(clamp((scrollY-(scrollY+heroRect.top))/(Math.max(1,end))));eligible=progress>.995&&dockRect.top<innerHeight*.6&&dockRect.bottom>innerHeight*.35;dock.style.setProperty('--landing-scale',frame.clientWidth/1344);dock.style.setProperty('--demo-scale',Math.min(.85,frame.clientWidth/640));cards.forEach(({card,anchor,target})=>{const a=anchor.getBoundingClientRect(),r=target.getBoundingClientRect(),b={left:r.left,top:r.top,width:r.width,height:r.height};if(progress>.995&&focus>=0){b.x=dockRect.left+camera.x+(b.left-dockRect.left)*camera.scale;b.y=dockRect.top+camera.y+(b.top-dockRect.top)*camera.scale;b.width*=camera.scale;b.height*=camera.scale;b.left=b.x;b.top=b.y;}card.style.left='0px';card.style.top='0px';card.style.width=a.width+'px';card.style.height=a.height+'px';card.style.transform=`translate3d(${lerp(a.left,b.left,progress)}px,${lerp(a.top,b.top,progress)}px,0) scale(${lerp(a.width,b.width,progress)/a.width},${lerp(a.height,b.height,progress)/a.height})`;card.classList.toggle('is-docking',progress>.02);card.style.setProperty('--float-blend',1-progress);card.style.opacity='1';card.style.visibility=heroRect.bottom<0&&dockRect.bottom<0?'hidden':'visible'});layer.style.clipPath=progress>.995?`inset(${Math.max(0,dockRect.top+1)}px ${Math.max(0,innerWidth-dockRect.right+1)}px ${Math.max(0,innerHeight-dockRect.bottom+1)}px ${Math.max(0,dockRect.left+1)}px round 7px)`:'none';if(progress<.99){focus=-1;camera={x:0,y:0,scale:1};dock.classList.remove('is-playing');started=false;elapsed=0;stage=-1}else if(eligible&&!started){started=true;elapsed=paused?0:-.25;stage=-1;if(paused){dock.classList.add('is-playing');render(active,6)}}if(eligible&&!raf){last=0;raf=requestAnimationFrame(tick)}scene.querySelectorAll('video').forEach(v=>{if(eligible&&!document.hidden&&!reduce.matches)(!v.paused||v.play().catch(()=>{}));else if(!v.paused)v.pause()});cards.forEach(({card})=>card.querySelectorAll('video').forEach(v=>{if(!document.hidden&&!reduce.matches&&(heroRect.bottom>0||eligible)&&(!paused||!started))(!v.paused||v.play().catch(()=>{}));else if(!v.paused)v.pause()}));}
function queue(){if(!scrollFrame)scrollFrame=requestAnimationFrame(position)}addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);new ResizeObserver(queue).observe(frame);
const mediaBase='assets/canvas-hero/';
['ritual-gold.png','poster-edited.png'].forEach(file=>{const image=new Image();image.src=mediaBase+file});
const originals=['image-43.png','window.mp4','book.mp4','image-44.png','image-42.png'];
function swap(index,file){const media=cards[index].card.querySelector('img,video');if(media.getAttribute('src')===mediaBase+file)return;media.style.opacity='0';setTimeout(()=>{media.src=mediaBase+file;media.style.opacity='1';if(media.tagName==='VIDEO'&&!reduce.matches)media.play().catch(()=>{});},180)}
function cameraTo(index,overview=false){
 focus=index;const r=frame.getBoundingClientRect(),slot=cards[index].target.getBoundingClientRect();
 const small=innerWidth<=700,fit=small?Math.min(.85,r.width/640):1;
 const portrait=index===0||index===3||index===4;
 const z=overview?1:Math.min((portrait?286:230)*fit/slot.height,(r.width-60)/slot.width);
 const next=overview?{x:0,y:0,scale:1}:{x:r.width/2-(slot.left-r.left+slot.width/2)*z,y:r.height/2-(slot.top-r.top+slot.height/2)*z,scale:z};
 const from={...camera},start=performance.now();cancelAnimationFrame(cameraFrame);
 let frozenAt=0,frozenTime=0;
 function move(now){if(paused&&started&&elapsed<duration&&!reduce.matches){if(!frozenAt)frozenAt=now;cameraFrame=requestAnimationFrame(move);return}if(frozenAt){frozenTime+=now-frozenAt;frozenAt=0}const t=reduce.matches?1:clamp((now-start-frozenTime)/(1600/playbackSpeed)),e=t*t*t*(t*(t*6-15)+10);camera={x:lerp(from.x,next.x,e),y:lerp(from.y,next.y,e),scale:lerp(from.scale,next.scale,e)};position();if(t<1)cameraFrame=requestAnimationFrame(move)}
 cameraFrame=requestAnimationFrame(move);
}
const context=(title,hint='',action='Apply')=>`<div class="demo-context"><span>${icon(title==='Mark Edit'?'mark':title==='Edit text'?'text':'video')}${title}</span>${hint?`<span class="context-hint">${hint}</span>`:''}<span>Cancel</span><span class="demo-apply">${action}</span></div>`;
const tools=()=>`<div class="demo-context"><span>${icon('grid')}Remove BG</span><span>${icon('edit')}Edit Image</span><span>${icon('video')}Create Video</span><span>${icon('copy')}</span><span>${icon('download')}</span><span>${icon('more')}</span></div>`;
function render(index,step){
 clearTimeout(cursorStartTimer);cancelAnimationFrame(cursorFrame);cursorFrame=0;
 dock.dataset.demo=index;dock.dataset.stage=step;
 const selected=[1,0,3,4,2][index],card=cards[selected].card;
 if(step===0){cameraTo(selected,index===4);if(index<3)swap(selected,originals[selected]);}
 cards.forEach(({card:c},i)=>{c.classList.toggle('asset-selected',index===4||i===selected);c.querySelectorAll('.asset-mark,.asset-text,.asset-sweep').forEach(e=>{const keep=i===selected&&((e.classList.contains('asset-mark')&&index===1&&step>=2&&step<6)||(e.classList.contains('asset-text')&&index===2&&step>=2&&step<6)||(e.classList.contains('asset-sweep')&&index===3&&(step===4||step===5)));if(!keep)e.remove()})});
 let html=tools();
 if(index===0){
  html='<div class="demo-context"><span>'+icon('edit')+' Edit video</span></div>';
  if(step<4)html+=`<div class="demo-composer"><div class="typed" ${step===1?'data-type="Turn this view into a moonlit journey."':''}>${step===0?'Describe how you want to edit this video…':step>1?'Turn this view into a moonlit journey.':''}</div><footer><span class="demo-model">${icon('video')}Seedance 2.5 ${icon('chevron')}</span><span>16:9</span><span>${icon('clock')} 4s</span><span class="send">${icon('arrow')}</span></footer></div>`;
  if(step===4||step===5)html+='<div class="demo-status"><i class="demo-spinner"></i> Editing video…</div>';
  if(step===6)swap(1,'night.mp4');
 }
 if(index===1){html=step===0?tools():context('Mark Edit','Add instructions to marks',step===5?'<i class="demo-spinner"></i> Applying…':'Apply');
  if(step>=2&&step<6&&!card.querySelector('.asset-mark')){const mark=document.createElement('div');mark.className='asset-mark';card.append(mark)}
  if(step===3||step===4)html+=`<div class="demo-popup demo-mark-input">${icon('plus')}<span ${step===3?'data-type="Make the lid brushed gold."':''}>${step===4?'Make the lid brushed gold.':''}</span>${icon('arrow')}</div>`;
  if(step===6)swap(0,'ritual-gold.png');
 }
 if(index===2){html=context('Edit text',step===1?'Detecting text…':'Select a text area to edit','Apply');
  if(step>=2&&step<6&&!card.querySelector('.asset-text')){const mark=document.createElement('div');mark.className='asset-text';card.append(mark)}
  if(step===3||step===4)html+=`<div class="demo-popup demo-text-popup"><p>Edit text</p><small>Original: Good ideas grow slowly…</small><div class="demo-field" ${step===3?'data-type="Make room for good ideas."':''}>${step===4?'Make room for good ideas.':''}</div><span class="save">Save changes</span></div>`;
  if(step===6)swap(3,'poster-edited.png');
 }
 if(index===3){
  card.querySelector('img').style.filter=step<6?'blur(.35px)':'none';
  if(step<4)html+=`<div class="demo-popup demo-menu"><div>${icon('expand')}Upscale</div><div>2×</div><div class="${step>=2?'active':''}">4×</div></div>`;
  if(step===4||step===5){html+='<div class="demo-status"><i class="demo-spinner"></i> Upscaling…</div>';if(!card.querySelector('.asset-sweep')){const sweep=document.createElement('div');sweep.className='asset-sweep';card.append(sweep)}}
  if(step===5)cameraTo(selected);
  if(step===6)html+='<div class="demo-toast">'+icon('check')+' 4× · Ready</div>';
 }
 if(index===4){html='';if(step>=0)html='<div class="demo-context export-context"><span>'+icon('download')+' Export</span></div>';
  if(step>=2&&step<5)html+='<div class="demo-popup demo-menu export-menu"><div>'+icon('download')+' Export all</div><div>'+icon('copy')+' Create ZIP</div></div>';
  if(step===5)html+='<div class="demo-status"><i class="demo-spinner"></i> Creating ZIP…</div>';
  if(step===6)html+='<div class="demo-toast">'+icon('check')+' All assets exported</div>';
 }
 const template=document.createElement('template');template.innerHTML=html;
 function sync(parent,next){[...next.childNodes].forEach((fresh,i)=>{const old=parent.childNodes[i];if(!old){parent.append(fresh.cloneNode(true));return}if(old.nodeType!==fresh.nodeType||old.nodeName!==fresh.nodeName||(old.nodeType===1&&old.className!==fresh.className)){old.replaceWith(fresh.cloneNode(true));return}if(old.nodeType===3){if(old.textContent!==fresh.textContent)old.textContent=fresh.textContent;return}if(old.nodeType===1){for(const a of [...old.attributes])if(!fresh.hasAttribute(a.name))old.removeAttribute(a.name);for(const a of [...fresh.attributes])if(old.getAttribute(a.name)!==a.value)old.setAttribute(a.name,a.value);sync(old,fresh)}});while(parent.childNodes.length>next.childNodes.length)parent.lastChild.remove()}
 sync(scene,template.content);
 const cursor=dock.querySelector('.demo-cursor'),r=frame.getBoundingClientRect();
 const points=index===4?[[60,30],[83,14],[84,24],[84,29],[84,29],[70,40],[75,45]]:[[50,45],[62,25],[50,48],[59,70],[65,74],[72,25],[68,55]];
 cursor.classList.remove('click');
 const clickTargets=[
  {3:'.demo-composer .send'},
  {0:'.demo-context>span:nth-child(2)',4:'.demo-apply'},
  {4:'.save',5:'.demo-apply'},
  {0:'.demo-menu>div:first-child',3:'.demo-menu>div:last-child'},
  {1:'.export-context>span',4:'.export-menu>div:last-child'}
 ];
 const target=scene.querySelector(clickTargets[index][step]||'[data-no-click-target]');
 if(target){
  // Use rendered geometry, including the mobile scene scale, rather than guessed percentages.
  const box=target.getBoundingClientRect(),bounds=dock.querySelector('.canvas-demo-ui').getBoundingClientRect();
  const tip=cursor.offsetWidth*.25;
  const x=(box.left+box.width/2-bounds.left-tip)/bounds.width*100;
  const y=(box.top+box.height/2-bounds.top-tip)/bounds.height*100;
  const travel=()=>moveCursor(x,y,()=>{
   if(!target.isConnected||Number(dock.dataset.demo)!==index||Number(dock.dataset.stage)!==step)return;
   const options={duration:reduce.matches?1:360/playbackSpeed,easing:'cubic-bezier(.4,0,.2,1)'};
   target.animate([{scale:'1'},{scale:'.90',offset:.4},{scale:'1'}],options);
   cursor.animate([{scale:'1'},{scale:'.84',offset:.4},{scale:'1'}],options);
   target.dataset.clicked='true';dock.dataset.lastPressed=target.textContent.trim()||target.className;
   if(index===2&&step===5)target.innerHTML='<i class="demo-spinner"></i> Applying…';
  });
  if(step===0&&!reduce.matches)cursorStartTimer=setTimeout(travel,1700/playbackSpeed);else travel();
 }else if(index===0&&step<3)moveCursor(48,68);else moveCursor(points[step][0],points[step][1]);
}
const seconds=[3.8,2.8,1.7,3,2.2,2.4,2.2];const boundaries=seconds.map((_,i)=>seconds.slice(0,i+1).reduce((a,b)=>a+b,0));const duration=boundaries.at(-1);
function select(index){updatePlayback();active=index;elapsed=0;stage=-1;tabs.forEach((b,i)=>{b.setAttribute('aria-selected',i===index);b.tabIndex=i===index?0:-1});frame.setAttribute('aria-labelledby','canvas-tab-'+index);if(started){stage=paused?6:0;render(active,stage)}if(eligible&&!raf&&!paused){last=0;raf=requestAnimationFrame(tick)}}
function tick(now){raf=-1;const dt=last?Math.min(.08,(now-last)/1000):0;last=now;if(!eligible||document.hidden){raf=0;return}if(!paused){elapsed+=dt*playbackSpeed;if(elapsed<0){raf=requestAnimationFrame(tick);return}dock.classList.add('is-playing');if(elapsed>=duration){if(active===4){paused=true;updatePlayback();cameraTo(2,true);raf=0;return}select(active+1);}const next=boundaries.findIndex(t=>elapsed<t);if(stage!==next){stage=next;render(active,stage)}const stageStart=stage===0?0:boundaries[stage-1];scene.querySelectorAll('[data-type]').forEach(e=>{const str=e.dataset.type;e.textContent=str.slice(0,Math.floor(clamp((elapsed-stageStart)/2.6)*str.length))})}if(!paused)raf=requestAnimationFrame(tick);else raf=0}
tabs.forEach((b,i)=>{b.addEventListener('click',()=>{paused=reduce.matches;if(progress<.995)frame.scrollIntoView({block:'center',behavior:reduce.matches?'instant':'smooth'});select(i);if(!started&&progress>.99){started=true;dock.classList.add('is-playing');render(i,paused?6:0)}});b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=(i+(e.key==='ArrowRight'?1:4))%5;select(next);tabs[next].focus()}})});
reduce.addEventListener('change',()=>{paused=reduce.matches;updatePlayback();if(paused){stage=6;render(active,6)}queue()});document.addEventListener('visibilitychange',()=>{last=0;queue()});position();
})();
