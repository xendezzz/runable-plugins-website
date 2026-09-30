(()=>{const hero=document.querySelector('.sky-hero'),reduce=matchMedia('(prefers-reduced-motion: reduce)'),cards=[...hero.querySelectorAll('.sky-media')];let x=0,y=0,cx=0,cy=0,raf=0,visible=true;function size(){const w=hero.clientWidth,small=w<=700,s=small?w/700:Math.min(w/1440,1.35);hero.style.setProperty('--sky-scale',s);hero.style.height=(small?1050:969)*s+'px'}size();addEventListener('resize',size);function tick(){cx+=(x-cx)*.085;cy+=(y-cy)*.085;cards.forEach(c=>{const d=+c.dataset.depth,p=c.querySelector('.sky-parallax');p.style.setProperty('--mx',cx*d+'px');p.style.setProperty('--my',cy*d+'px');p.style.setProperty('--rx',-cy*3+'deg');p.style.setProperty('--ry',cx*4+'deg')});if(Math.abs(x-cx)+Math.abs(y-cy)>.001)raf=requestAnimationFrame(tick);else raf=0}hero.addEventListener('pointermove',e=>{if(reduce.matches||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();x=(e.clientX-r.left)/r.width*2-1;y=(e.clientY-r.top)/r.height*2-1;if(!raf)raf=requestAnimationFrame(tick)});hero.addEventListener('pointerleave',()=>{x=y=0;if(!raf&&!reduce.matches)raf=requestAnimationFrame(tick)});cards.forEach(card=>{
 const media=card.querySelector('img,video');
 const wrapper=document.createElement('div');wrapper.className='sky-hover-tilt';
 media.before(wrapper);wrapper.append(media);
 let targetX=0,targetY=0,currentX=0,currentY=0,tiltFrame=0,lastTime=0;
 function easeTilt(time){
  const dt=lastTime?Math.min(40,time-lastTime):16;lastTime=time;
  const blend=1-Math.exp(-dt/115);
  currentX+=(targetX-currentX)*blend;currentY+=(targetY-currentY)*blend;
  wrapper.style.setProperty('--hover-rx',currentX+'deg');wrapper.style.setProperty('--hover-ry',currentY+'deg');
  if(Math.abs(targetX-currentX)+Math.abs(targetY-currentY)>.01)tiltFrame=requestAnimationFrame(easeTilt);
  else{tiltFrame=0;lastTime=0}
 }
 function animateTilt(){if(!tiltFrame)tiltFrame=requestAnimationFrame(easeTilt)}
 card.addEventListener('pointermove',event=>{
  if(reduce.matches||event.pointerType==='touch')return;
  const r=card.getBoundingClientRect();
  targetX=Math.max(-1,Math.min(1,1-(event.clientY-r.top)/r.height*2))*7;
  targetY=Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1))*9;
  card.classList.add('is-hovered');animateTilt();
 });
 card.addEventListener('pointerleave',()=>{targetX=targetY=0;card.classList.remove('is-hovered');animateTilt()});
 reduce.addEventListener('change',()=>{if(reduce.matches){cancelAnimationFrame(tiltFrame);tiltFrame=0;lastTime=0;currentX=currentY=targetX=targetY=0;wrapper.style.setProperty('--hover-rx','0deg');wrapper.style.setProperty('--hover-ry','0deg');card.classList.remove('is-hovered')}});
});

function playback(){hero.querySelectorAll('video').forEach(v=>{if(visible&&!document.hidden&&!reduce.matches)v.play().catch(()=>{});else v.pause()})}new IntersectionObserver(([e])=>{visible=e.isIntersecting;playback()},{threshold:.05}).observe(hero);document.addEventListener('visibilitychange',playback);reduce.addEventListener('change',()=>{playback();x=y=0;if(reduce.matches)cancelAnimationFrame(raf)});})();
