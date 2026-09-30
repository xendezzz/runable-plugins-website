/* Each card rests on its final frame and replays once on hover or focus. */
(()=>{
 const cards=Object.fromEntries([...document.querySelectorAll('[data-feature]')].map(el=>[el.dataset.feature,el]));
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const runs=new Map();let raf=0,last=0;const finalTime=6.5;
 const clamp=v=>Math.max(0,Math.min(1,v));
 const part=(id,name)=>cards[id].querySelector(`[data-part="${name}"]`);
 function show(el,value,offset=6){const p=1-Math.pow(1-clamp(value),3);el.style.opacity=p;el.style.transform=`translateY(${(1-p)*offset}px)`;el.style.filter=`blur(${(1-p)*3}px)`;}
 function text(el,value){if(el.textContent!==value)el.textContent=value}
 function render(id,t){
  const end=1,enter=(start,duration=.28)=>clamp((t-start)/duration)*end;
  if(id==='multimodal'){
  const prompt=cards.multimodal.querySelector('[data-type]');const promptText='Plan a quiet weekend in Kyoto using this guide and photo.';text(prompt,promptText.slice(0,Math.floor(clamp(t/1.2)*promptText.length)));
  const fileProgress=1-Math.pow(1-clamp((t-1.6)/.32),3);
  cards.multimodal.style.setProperty('--files-open',String(fileProgress*end));
  show(part('multimodal','files'),enter(1.6,.32),-18);
  }
  if(id==='research'){
  show(part('research','query'),enter(.1));show(part('research','loading'),enter(.7)*(1-clamp((t-4)/.22)));
  const researchStates=['Searching the web','Comparing sources','Writing your research brief'];text(cards.research.querySelector('[data-status]'),researchStates[Math.min(2,Math.floor(Math.max(0,t-.7)/1.1))]);show(part('research','result'),enter(4.3),10);
  }
  if(id==='tools'){
  show(part('tools','query'),enter(.1));show(part('tools','loading'),enter(.7)*(1-clamp((t-3.8)/.22)));text(cards.tools.querySelector('[data-status]'),t<2.3?'Creating your video':'Adding the finishing touches');show(part('tools','result'),enter(4.1),14);
  }
  if(id==='models'){
  const providers=['Claude','OpenAI','Gemini','Grok','DeepSeek'],index=Math.min(4,Math.floor(t/1.6));
  cards.models.querySelectorAll('[data-provider]').forEach((el,i)=>el.classList.toggle('active',i===index));text(cards.models.querySelector('[data-status]'),providers[index]);
  }
  if(id==='context'){
  show(part('context','first'),enter(.3)*.65);show(part('context','second'),enter(1.5));show(part('context','answer'),enter(2.7));
  const answer='Of course. I’ll carry the same warm, simple style into your menu.';text(cards.context.querySelector('[data-type]'),answer.slice(0,Math.floor(clamp((t-2.8)/1.5)*answer.length)));
  }
  cards[id].dataset.demoTime=t.toFixed(1);
 }
 function tick(now){
  const dt=last?Math.min((now-last)/1000,.1):0;last=now;
  for(const [id,time] of runs){const next=Math.min(finalTime,time+dt);render(id,next);if(next===finalTime){runs.delete(id);cards[id].dataset.playing="false";}else runs.set(id,next)}
  if(runs.size)raf=requestAnimationFrame(tick);else{raf=0;last=0}
 }
 function play(id){if(reduce.matches)return;cards[id].dataset.playing="true";runs.set(id,0);render(id,0);if(!raf){last=0;raf=requestAnimationFrame(tick)}}
 function settle(id){cards[id].dataset.playing="false";runs.delete(id);render(id,finalTime)}
 Object.entries(cards).forEach(([id,card])=>{
  render(id,finalTime);card.tabIndex=0;
  card.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')play(id)});
  card.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch')settle(id)});
  card.addEventListener('pointerup',event=>{if(event.pointerType==='touch')play(id)});
  card.addEventListener('focus',()=>play(id));card.addEventListener('blur',()=>settle(id));
  card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();play(id)}});
 });
 function reset(){cancelAnimationFrame(raf);raf=0;last=0;runs.clear();Object.keys(cards).forEach(settle)}
 reduce.addEventListener('change',reset);document.addEventListener('visibilitychange',()=>{if(document.hidden)reset()});
})();
