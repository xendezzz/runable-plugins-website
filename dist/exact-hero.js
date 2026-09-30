/* Authored timeline follows the requested choreography. Figma 1038:12902 supplies the exact resting geometry and all message text. */
(()=>{
 const root=document.querySelector('.exact-hero'),tape=root.querySelector('.exact-chat-tape'),input=root.querySelector('.exact-input-surface'),prompt=input.querySelector('.composer-prompt');
 const messages=[...root.querySelectorAll('.exact-message')],firstUser=root.querySelector('.exact-user-first'),secondUser=root.querySelector('.exact-user-second'),firstAssistant=root.querySelector('.exact-assistant-first'),secondAssistant=root.querySelector('.exact-assistant-second');
 const responses=[...root.querySelectorAll('.exact-response')];let originalResponses=responses.map(n=>n.textContent);
 let firstPrompt=firstUser.querySelector('p').textContent,briefPrompt=[...secondUser.querySelectorAll('p')].map(p=>p.textContent).join('\n');
 const completed=root.querySelector('.exact-completed'),tools=[...secondAssistant.querySelectorAll('.exact-tool')];
 const scenarios=[
  {id:'coffee',prompt:firstPrompt,followup:secondUser.querySelector('p').textContent,attachment:secondUser.querySelectorAll('p')[1].textContent,responses:[...originalResponses],completed:'Completed 10 steps',tools:tools.map(el=>el.lastElementChild.textContent)},
  {id:'trip',prompt:'Plan a five-day trip to Japan for me. I love neighborhood cafés, good food, and finding places off the usual tourist trail.',followup:'Let’s stick to Tokyo and Kyoto. Keep the mornings relaxed and leave room for a little wandering.',attachment:'',responses:[
   'I’ll shape a route around the things you enjoy, with time to explore between stops. I’ll look into neighborhoods, cafés, and local food spots, then work out how to split five days between Tokyo and Kyoto without making the trip feel rushed.',
   'Slow mornings it is. I’ll group nearby spots together and build a day-by-day itinerary with travel notes and room to wander.'
  ],completed:'Mapped out your route',tools:['Exploring Tokyo and Kyoto','Finding cafés and local favorites','Building your five-day itinerary']},
  {id:'research',prompt:'How can cities stay cooler during heatwaves? Research the most promising ideas and explain what actually makes a difference.',followup:'Compare trees, cool roofs, and reflective streets. Include the trade-offs and link to the original studies.',attachment:'',responses:[
   'I’ll look at the evidence behind each approach and separate measured results from predictions. I’ll compare where they work best, what they cost to maintain, and who benefits, so the research goes beyond a list of ideas.',
   'I’ll put the findings side by side, highlight the limits of each study, and turn the research into a clear brief with sources you can follow.'
  ],completed:'Outlined the key questions',tools:['Finding studies and field trials','Comparing evidence and trade-offs','Writing your research brief']},
  {id:'playlist',prompt:'Make me a playlist for a slow Sunday morning. Warm, mellow, a little soulful—something to put on while I make coffee.',followup:'Mix familiar favorites with a few discoveries. About an hour, and nothing that gets too loud too quickly.',attachment:'',responses:[
   'I’ll start with gentle acoustic sounds, bring in a little soul and laid-back jazz, then let the playlist settle into an easy rhythm. I’ll look for a mix of familiar voices and new discoveries that feel good together from one track to the next.',
   'I’ll keep the transitions soft and the energy steady. Your Sunday soundtrack is taking shape—about an hour, from the first cup to the last track.'
  ],completed:'Found your Sunday mood',tools:['Finding mellow tracks and new voices','Arranging a gentle listening flow','Curating your one-hour playlist']}
 ];
 let scenarioIndex=0;
 function measureResponses(){
  responses.forEach((el,i)=>{el.style.minHeight='0';el.textContent=originalResponses[i];el.style.minHeight=`${el.offsetHeight}px`});
 }
 function setScenario(index){
  scenarioIndex=index;const scene=scenarios[index];
  firstPrompt=scene.prompt;briefPrompt=[scene.followup,scene.attachment].filter(Boolean).join('\n');originalResponses=scene.responses;
  firstUser.querySelector('p').textContent=scene.prompt;
  const paragraphs=secondUser.querySelectorAll('p');paragraphs[0].textContent=scene.followup;paragraphs[1].textContent=scene.attachment;paragraphs[1].hidden=!scene.attachment;
  completed.querySelector('span').textContent=scene.completed;
  tools.forEach((el,i)=>el.lastElementChild.textContent=scene.tools[i]);
  root.dataset.scenario=scene.id;
  root.querySelector('.exact-chat-viewport').setAttribute('aria-label',`A conversation with Runable: ${['building a coffee shop website','planning a trip','researching cooler cities','curating a playlist'][index]}`);
  measureResponses();
 }
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const timing={input:0.15,inputDuration:1.05,typeOne:1.5,typeOneEnd:4.7,userOne:5,assistantOne:6,replyOne:6.55,replyOneEnd:13.7,completed:14.1,typeTwo:15.1,typeTwoEnd:18.4,userTwo:18.8,assistantTwo:19.8,replyTwo:20.2,replyTwoEnd:22.5,tools:[23,24.3,25.6],end:27};
 let elapsed=0,last=0,raf=0,ready=false,cycle=0;
 const logos=["claude-a.svg","openai.svg","gemini.svg","grok.svg","deepseek.svg"];
 const modelIcons=[...root.querySelectorAll(".exact-model-icon")];
 modelIcons.forEach(holder=>{holder.replaceChildren(...logos.map((name,i)=>{const img=document.createElement("img");img.src=`assets/exact-hero/${name}`;img.alt="";img.className=i===0?"active":"";return img}));});
 let activeLogo=0;
 const unit=v=>Math.max(0,Math.min(1,v)),ease=v=>1-Math.pow(1-unit(v),3),progress=(t,start,duration)=>unit((t-start)/duration);
 const setText=(el,value)=>{if(el.textContent!==value)el.textContent=value};
 const reveal=(el,t,start,duration=.85,side=0)=>{const p=ease(progress(t,start,duration));el.style.opacity=p?1:0;const inner=el.querySelector('.exact-message-entrance')||el;inner.style.opacity=p;inner.style.filter=`blur(${(1-p)*10}px)`;inner.style.transform=`translate(${(1-p)*side}px,${(1-p)*7}px)`;};
 function typeText(el,text,t,start,end){setText(el,text.slice(0,Math.floor(progress(t,start,end-start)*text.length)))}
 function render(t){
  reveal(input,t,timing.input,timing.inputDuration,0);
  reveal(firstUser,t,timing.userOne,.9,32);
  reveal(firstAssistant,t,timing.assistantOne,1,-28);
  reveal(secondUser,t,timing.userTwo,.9,32);
  reveal(secondAssistant,t,timing.assistantTwo,1,-28);
  typeText(responses[0],originalResponses[0],t,timing.replyOne,timing.replyOneEnd);
  typeText(responses[1],originalResponses[1],t,timing.replyTwo,timing.replyTwoEnd);
  reveal(completed,t,timing.completed,.65,-12);tools.forEach((el,i)=>reveal(el,t,timing.tools[i],.7,-12));
  const viewport=root.querySelector('.exact-chat-viewport');
  const positionFor=el=>viewport.clientHeight-el.offsetTop-el.offsetHeight-14;
  const stops=[firstUser,firstAssistant,secondUser,secondAssistant].map(positionFor);
  let shift=stops[0];
  shift+=(stops[1]-stops[0])*ease(progress(t,5.9,1));
  shift+=(stops[2]-stops[1])*ease(progress(t,18.5,.9));
  shift+=(stops[3]-stops[2])*ease(progress(t,19.7,1.1));
  tape.style.transform=`translateY(${shift}px)`;
  const firstTyping=t>=timing.typeOne&&t<timing.userOne,secondTyping=t>=timing.typeTwo&&t<timing.userTwo;
  input.classList.toggle('is-typing',firstTyping||secondTyping);
  input.classList.toggle('is-sending',(t>4.85&&t<5.2)||(t>18.65&&t<19));
  if(root.dataset.migrating!=='true'){
   if(firstTyping)typeText(prompt,firstPrompt,t,timing.typeOne,timing.typeOneEnd);
   else if(secondTyping)typeText(prompt,briefPrompt,t,timing.typeTwo,timing.typeTwoEnd);
   else setText(prompt,'Type your idea here...');
  }else setText(prompt,scenarios[0].prompt);
  const exit=1-ease(progress(t,timing.end+3.4,.6));
  tape.style.opacity=exit;tape.style.filter=`blur(${(1-exit)*6}px)`;
  input.style.opacity=String(Number(input.style.opacity)*exit);
  root.dataset.animationTime=t.toFixed(2);
  root.dataset.animationState=t<0?'waiting':t>=timing.end?'complete':'playing';
  root.dataset.animationCycle=String(cycle);
  const logoIndex=reducedMotion.matches?0:Math.floor(Math.max(0,t-timing.assistantOne)/2.4)%logos.length;
  if(logoIndex!==activeLogo){modelIcons.forEach(holder=>[...holder.children].forEach((img,i)=>img.classList.toggle('active',i===logoIndex)));activeLogo=logoIndex;}
 }
 function frame(now){
  if(!last)last=now;
  const dt=Math.min((now-last)/1000,.1);last=now;
  if(!document.hidden&&root.dataset.migrating!=='true')elapsed+=dt;
  if(elapsed>=timing.end+4){elapsed=0;cycle++;setScenario((scenarioIndex+1)%scenarios.length);}
  // Hold for four seconds, then advance to the next conversation.
  render(elapsed);
  raf=requestAnimationFrame(frame);
 }
 function restart(at=0){cancelAnimationFrame(raf);elapsed=reducedMotion.matches?timing.end:at;last=0;render(elapsed);if(!reducedMotion.matches)raf=requestAnimationFrame(frame);}
 function size(){
  const w=root.clientWidth;
  if(w>760){root.style.setProperty('--hero-scale',String(Math.min(1,w/1454,innerHeight/969)));root.style.removeProperty('--chat-scale')}
  else{root.style.setProperty('--hero-scale','1');root.style.setProperty('--chat-scale',String(Math.min(1,(w-36)/484)));root.style.setProperty('--chat-height',`${Math.max(100,root.clientHeight-490)}px`)}
 }
 window.runableHero={restart:()=>restart(),showBrief:()=>restart(15.1)};
 size();addEventListener('resize',()=>{size();if(ready){measureResponses();render(elapsed)}});
 document.fonts.ready.then(()=>{
  setScenario(0);
  ready=true;
  // Begin immediately after the CTA entrance, including when fonts load late.
  const entrance=root.querySelector('.exact-start').getAnimations();
  Promise.allSettled(entrance.map(animation=>animation.finished)).then(()=>restart());
 });
 reducedMotion.addEventListener('change',()=>{if(ready)restart()});
 document.addEventListener('visibilitychange',()=>{last=0});
})();
