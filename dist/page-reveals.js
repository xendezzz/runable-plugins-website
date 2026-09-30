/* Reveal content once as it enters the viewport; keep demo choreography independent. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const selectors=[
 '.story-intro h2','.story-intro-aside>p','.story-intro-aside>a','.minimal-demo','.step-heading','.step-description>p',
 '.possibilities .section-heading h2','.feature-section-aside>p','.feature-section-aside>a',
 '.live-feature-cards .cap-visual','.live-feature-cards article>h3','.live-feature-cards article>p',
 '.faq h2','.faq-items>details',
 '.closing-cta>.eyebrow','.closing-cta>h2','.closing-cta>p','.closing-cta>a','.closing-cta>.cta-caption',
 '#pricing>h2','.billing-toggle','.plan-offer','.plan-title','.plan-price','.plan-buy','.plan-credits','.plan-highlight','.plan-body li','.plan-details details','.pricing-links','.pricing-sales',
 '.footer-brand-block>*','.footer-directory>div:not(.footer-brand-block)>h3','.footer-directory>div:not(.footer-brand-block)>a','.footer-bottom','.footer-mantra'
 ];
 const targets=[...document.querySelectorAll(selectors.join(','))];
 if(reduced.matches)return;
 targets.forEach(el=>el.classList.add('reveal-pending'));
 const animations=new Set();
 const observer=new IntersectionObserver(entries=>{
  let index=0;
  entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top).forEach(entry=>{
   const el=entry.target;observer.unobserve(el);el.classList.remove('reveal-pending');
   // Animate only entrance properties; avoid changing scroll layout or existing transforms.
   const animation=el.animate([{opacity:0,filter:'blur(9px)',translate:'0 14px'},{opacity:1,filter:'blur(0px)',translate:'0 0'}],{duration:850,delay:Math.min(index++*75,450),easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
   animations.add(animation);animation.finished.then(()=>{animation.cancel();animations.delete(animation)}).catch(()=>animations.delete(animation));
  });
 },{threshold:.08,rootMargin:'0px 0px -20px 0px'});
 targets.forEach(el=>observer.observe(el));
 // Keyboard navigation must never land on hidden content.
 document.addEventListener('focusin',event=>{const el=event.target.closest('.reveal-pending');if(el){el.classList.remove('reveal-pending');observer.unobserve(el)}});
 reduced.addEventListener('change',event=>{if(event.matches){observer.disconnect();targets.forEach(el=>el.classList.remove('reveal-pending'));animations.forEach(animation=>animation.cancel())}});
})();
