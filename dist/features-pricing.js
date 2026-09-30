(()=>{
 const section=document.querySelector('#pricing');
 section.querySelectorAll('[data-billing]').forEach(button=>button.addEventListener('click',()=>{
  const period=button.dataset.billing,annual=period==='annually';
  section.querySelectorAll('[data-billing]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  section.querySelectorAll('.plan-price').forEach(price=>{
   price.querySelector('b').textContent=price.querySelector('b').dataset[period];
   price.querySelector('small').textContent=annual?'/year':'/month';
   price.querySelector('del').hidden=!annual;
  });
 }));
})();

