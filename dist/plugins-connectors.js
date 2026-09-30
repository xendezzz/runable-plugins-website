const connectorMotion = matchMedia('(prefers-reduced-motion: reduce)');
const connectorCards = [...document.querySelectorAll('.connector-card')];
const activeConnectorAnimations = new Map();
function stopConnector(card) {
 (activeConnectorAnimations.get(card) || []).forEach(animation => animation.cancel());
 activeConnectorAnimations.delete(card);
}
function playConnector(card) {
 stopConnector(card);
 if (connectorMotion.matches || !matchMedia('(hover: hover)').matches) return;
 const animations = [];
 activeConnectorAnimations.set(card, animations);
 const animate = (el, frames, options) => {
  if (el) animations.push(el.animate(frames, {easing:'cubic-bezier(.22,1,.36,1)',fill:'both',...options}));
 };
 animate(card.querySelector('.demo-panel'),[
  {opacity:0,filter:'blur(8px)',transform:'translateY(18px) rotateX(13deg) rotateY(-8deg) scale(.95)'},
  {opacity:1,filter:'blur(0px)',transform:'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)'}
 ],{duration:900});
 const cycle = 6500;
 card.querySelectorAll('.appear').forEach((el,index)=>{
  const start=(350+index*850)/cycle;
  animate(el,[
   {offset:0,opacity:0,filter:'blur(6px)',transform:'translateY(9px)'},
   {offset:start,opacity:0,filter:'blur(6px)',transform:'translateY(9px)'},
   {offset:start+700/cycle,opacity:1,filter:'blur(0px)',transform:'translateY(0)'},
   {offset:.90,opacity:1,filter:'blur(0px)',transform:'translateY(0)'},
   {offset:1,opacity:0,filter:'blur(6px)',transform:'translateY(-4px)'}
  ],{duration:cycle,iterations:Infinity});
 });
 if(card.classList.contains('feature-integrations')) {
  const track=card.querySelector('.directory-track');
  const distance=track.querySelector('.logo-grid').getBoundingClientRect().height;
  animate(track,[{transform:'translateY(0)'},{transform:`translateY(-${distance}px)`}],{duration:distance/92*1000,delay:900,iterations:Infinity,easing:'linear'});
 }
 animate(card.querySelector('.transfer-line i'),[
  {offset:0,left:'0%',opacity:0},
  {offset:.34,left:'0%',opacity:0},
  {offset:.38,left:'10%',opacity:1},
  {offset:.52,left:'90%',opacity:1},
  {offset:.56,left:'100%',opacity:0},
  {offset:1,left:'100%',opacity:0}
 ],{duration:cycle,iterations:Infinity,easing:'ease-in-out'});
}
connectorCards.forEach(card=>{
 card.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'||event.pointerType==='pen')playConnector(card)});
 card.addEventListener('pointerleave',()=>stopConnector(card));
 card.addEventListener('pointercancel',()=>stopConnector(card));
});
connectorMotion.addEventListener('change',()=>connectorCards.forEach(stopConnector));
document.addEventListener('visibilitychange',()=>{if(document.hidden)connectorCards.forEach(stopConnector)});
