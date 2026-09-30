const editor = document.querySelector('#plugin-prompt');
const menu = document.querySelector('#mention-menu');
const mentionStatus = document.querySelector('#mention-status');
let mentionRange = null, activeOption = 0, matches = [];
const pluginNames = ['Google','Slack','Microsoft','Asana','Salesforce','Supabase','Shopify','Discord','PayPal','PostHog','Linear','Reddit','GitLab','Pinterest','Webflow','Stripe','Coinbase','Algolia','Google Analytics','Zoom'];
function closeMentions(){menu.hidden=true;editor.setAttribute('aria-expanded','false');editor.removeAttribute('aria-activedescendant');mentionRange=null;}
function renderMentions(query='') {
  matches=pluginNames.filter(n=>n.toLowerCase().includes(query.toLowerCase()));activeOption=0;
  menu.innerHTML='<div class="mention-heading">Plugins</div>'+matches.map((name,i)=>`<button type="button" role="option" id="mention-${i}" aria-selected="${i===0}" data-name="${name}"><img src="assets/plugins/brands/${name.toLowerCase().replaceAll(' ','-')}.svg" alt=""><span>${name}</span></button>`).join('')+(!matches.length?'<p class="mention-empty">No plugins found</p>':'');
  menu.hidden=false;editor.setAttribute('aria-expanded','true');if(matches.length)editor.setAttribute('aria-activedescendant','mention-0');
}
function inspectMention(){
  const selection=getSelection();if(!selection.rangeCount)return closeMentions();
  const caret=selection.getRangeAt(0);if(caret.startContainer.nodeType!==3)return closeMentions();
  const before=caret.startContainer.textContent.slice(0,caret.startOffset);const match=before.match(/(?:^|\s)@([^@\n]*)$/);
  if(!match)return closeMentions();
  mentionRange=caret.cloneRange();mentionRange.setStart(caret.startContainer,caret.startOffset-match[1].length-1);renderMentions(match[1]);
}
function choosePlugin(name){
  if(!mentionRange)return;
  mentionRange.deleteContents();const chip=document.createElement('span');chip.className='mention-chip';chip.contentEditable='false';
  const img=document.createElement('img');img.src=`assets/plugins/brands/${name.toLowerCase().replaceAll(' ','-')}.svg`;img.alt='';chip.append(img,document.createTextNode(name));
  mentionRange.insertNode(chip);const space=document.createTextNode('\u00a0');chip.after(space);const caret=document.createRange();caret.setStartAfter(space);caret.collapse(true);const selection=getSelection();selection.removeAllRanges();selection.addRange(caret);editor.focus();closeMentions();updateEmpty();
}
function updateEmpty(){editor.classList.toggle('has-content',!!editor.textContent.trim());}
editor.addEventListener('input',()=>{updateEmpty();inspectMention();mentionStatus.textContent='';});
editor.addEventListener('keydown',e=>{
 if(menu.hidden)return;
 if(e.key==='Escape'){e.preventDefault();closeMentions();return;}
 if((e.key==='ArrowDown'||e.key==='ArrowUp')&&matches.length){e.preventDefault();activeOption=(activeOption+(e.key==='ArrowDown'?1:-1)+matches.length)%matches.length;menu.querySelectorAll('[role=option]').forEach((b,i)=>b.setAttribute('aria-selected',i===activeOption));editor.setAttribute('aria-activedescendant','mention-'+activeOption);menu.querySelector('#mention-'+activeOption).scrollIntoView({block:'nearest'});}
 if(e.key==='Enter'&&matches.length){e.preventDefault();choosePlugin(matches[activeOption]);}
});
editor.addEventListener('paste',e=>{e.preventDefault();const text=e.clipboardData.getData('text/plain');const sel=getSelection();if(!sel.rangeCount)return;const range=sel.getRangeAt(0);range.deleteContents();const node=document.createTextNode(text);range.insertNode(node);range.setStartAfter(node);range.collapse(true);sel.removeAllRanges();sel.addRange(range);updateEmpty();inspectMention();});
menu.addEventListener('mousedown',e=>e.preventDefault());menu.addEventListener('click',e=>{const b=e.target.closest('[data-name]');if(b)choosePlugin(b.dataset.name);});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.plugin-composer'))closeMentions();});
const sampleDisplay = document.querySelector('#sample-prompt');
const samples = [
 {plugin:'Slack',prompt:'Summarize my latest team updates.'},
 {plugin:'Microsoft',prompt:'Prepare me for tomorrow’s meetings.'},
 {plugin:'Shopify',prompt:'Find this week’s top-selling products.'},
 {plugin:'Linear',prompt:'Summarize my open issues.'}
];
let sampleIndex=0,letter=0,stage='mention';
function sampleChip(name){
 const chip=document.createElement('span');chip.className='mention-chip';
 const img=document.createElement('img');img.src=`assets/plugins/brands/${name.toLowerCase().replaceAll(' ','-')}.svg`;img.alt='';
 chip.append(img,document.createTextNode(name));return chip;
}
function sampleIsVisible(){return document.activeElement!==editor&&!editor.textContent.trim();}
function syncSampleVisibility(){const visible=sampleIsVisible();sampleDisplay.hidden=!visible;editor.classList.toggle('showing-sample',visible);}
editor.addEventListener('focus',syncSampleVisibility);editor.addEventListener('blur',syncSampleVisibility);editor.addEventListener('input',syncSampleVisibility);
function typeSample(){
 syncSampleVisibility();
 if(!sampleIsVisible()){setTimeout(typeSample,300);return;}
 const sample=samples[sampleIndex];let delay=65;
 if(stage==='mention'){
   sampleDisplay.textContent=('@'+sample.plugin).slice(0,++letter);
   if(letter===sample.plugin.length+1){stage='chip';delay=550;}
 }else if(stage==='chip'){
   sampleDisplay.replaceChildren(sampleChip(sample.plugin),document.createTextNode(' '));
   stage='prompt';letter=0;delay=450;
 }else if(stage==='prompt'){
   sampleDisplay.lastChild.textContent=' '+sample.prompt.slice(0,++letter);
   if(letter===sample.prompt.length){stage='hold';delay=2800;}
 }else{
   sampleIndex=(sampleIndex+1)%samples.length;letter=0;stage='mention';sampleDisplay.replaceChildren();delay=350;
 }
 setTimeout(typeSample,delay);
}
if(matchMedia('(prefers-reduced-motion: reduce)').matches){sampleDisplay.replaceChildren(sampleChip(samples[0].plugin),document.createTextNode(' '+samples[0].prompt));syncSampleVisibility();}else typeSample();
document.querySelector('#plugin-send').addEventListener('click',()=>{if(!editor.textContent.trim()){editor.focus();return;}closeMentions();sessionStorage.setItem('runable-plugin-prompt',editor.innerText);mentionStatus.textContent='Prompt saved in this preview. Connect your apps in Runable to run it.';});
