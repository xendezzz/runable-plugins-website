/* A local, scripted product story. Inputs and export actions are demonstrations. */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const story=$('#story');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
let currentStage=-1,currentStatus=-1,queued=false;
const states=['Reading your brand brief','Researching coffee shop inspiration','Building your website','Adding the finishing touches'];
function metrics(){const start=story.offsetTop-80,end=story.offsetTop+story.offsetHeight-innerHeight;return {start,end,length:end-start};}
function update(){queued=false;const m=metrics(),p=clamp((scrollY-m.start)/m.length);const stage=p<.36?0:p<.56?1:2;
 const mode=stage===0?(p<.12?'type':p<.24?'voice':'upload'):'type';
 $('.minimal-demo').dataset.inputMode=mode;
 $('.story-send').setAttribute('aria-label',mode==='type'?'Preview speaking':mode==='voice'?'Preview image upload':'Watch Runable work');
 const outputMode=p<.66?'website':p<.74?'publish':p<.83?'report':p<.92?'download':'menu';
 setOutputMode(outputMode,stage);
 $('.sequence-progress>span').style.width=`${p*100}%`;
 if(currentStage!==stage){currentStage=stage;$('.demo-frame').dataset.stage=stage;$$('.scene').forEach((e,i)=>e.inert=i!==stage);$$('.step').forEach((e,i)=>e.classList.toggle('active',i===stage));}

 const w=clamp((p-.36)/.20),idx=Math.min(3,Math.floor(w*4));if(idx!==currentStatus){currentStatus=idx;$('#status-text').textContent=states[idx];if(!reduced){$('.status-pill').animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'});}}
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(update)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('load',schedule);document.fonts.ready.then(schedule);
function jump(step){const m=metrics();scrollTo({top:m.start+m.length*[.04,.44,.60][step],behavior:reduced?'instant':'smooth'});}
$$('[data-jump]').forEach(b=>b.addEventListener('click',()=>jump(Number(b.dataset.jump))));
$('.send').addEventListener('click',()=>{scrollTo({top:0,behavior:'instant'});update();window.runableHero?.restart()});
$('.attach').addEventListener('click',()=>{scrollTo({top:0,behavior:'instant'});update();window.runableHero?.showBrief()});
function jumpInput(fraction){const m=metrics();scrollTo({top:m.start+m.length*fraction,behavior:reduced?'instant':'smooth'})}
$('.story-attach').addEventListener('click',()=>jumpInput(.28));
$('.story-send').addEventListener('click',()=>{const mode=$('.minimal-demo').dataset.inputMode;if(mode==='type')jumpInput(.18);else if(mode==='voice')jumpInput(.28);else jump(1)});
let lastOutputMode='',menuTimer,publishClickTimer,publishDoneTimer;
function publishPreview(){
 clearTimeout(publishDoneTimer);
 $('.output-publish').dataset.state='loading';$('.publish-label').textContent='Publish';$('.output-publish').setAttribute('aria-busy','true');
 publishDoneTimer=setTimeout(()=>{$('.output-publish').dataset.state='public';$('.publish-label').textContent='Public';$('.output-publish').setAttribute('aria-busy','false')},reduced?0:1400);
}
$('.output-publish').addEventListener('click',()=>{clearTimeout(publishClickTimer);publishPreview()});
function setReportMenu(open){$('#report-download-menu').hidden=!open;$('.report-download').setAttribute('aria-expanded',String(open))}
function setOutputMode(mode,stage){
 const key=stage+':'+mode;if(key===lastOutputMode)return;lastOutputMode=key;clearTimeout(menuTimer);clearTimeout(publishClickTimer);clearTimeout(publishDoneTimer);
 $('.output-publish').dataset.state='idle';$('.publish-label').textContent='Publish';$('.output-publish').setAttribute('aria-busy','false');
 $('.minimal-demo').dataset.outputMode=mode;
 const report=stage===2&&['report','download','menu'].includes(mode);
 $('.full-report').inert=!report;$('.full-website').inert=stage!==2||report;
 $('.output-publish').inert=stage!==2||mode!=='publish';$('.output-download').inert=stage!==2||!['download','menu'].includes(mode);
 setReportMenu(false);
 if(stage===2&&mode==='publish')publishClickTimer=setTimeout(publishPreview,reduced?0:1000);
 if(stage===2&&mode==='menu')menuTimer=setTimeout(()=>setReportMenu(true),reduced?0:1000);
}
$('.report-download').addEventListener('click',()=>{clearTimeout(menuTimer);setReportMenu($('#report-download-menu').hidden)});
addEventListener('keydown',e=>{if(e.key==='Escape')setReportMenu(false)});
update();
