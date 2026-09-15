const menu=document.querySelector('.menu');
const links=document.querySelector('.links');
const refinements=document.createElement('link');
refinements.rel='stylesheet';
refinements.href='refinements.css';
document.head.append(refinements);
if(links){
  const page=location.pathname.split('/').pop()||'index.html';
  const items=[['index.html','Home'],['car.html','The Car'],['team.html','The Team'],['journey.html','The Journey'],['partner.html','Partner with us']];
  links.replaceChildren(...items.map(([href,label])=>{
    const link=document.createElement('a');
    link.href=href;
    link.textContent=label;
    if(href==='partner.html') link.classList.add('mobile-partner');
    if(page===href) link.classList.add('active');
    return link;
  }));
}
if(menu&&!menu.hasAttribute('aria-expanded')) menu.setAttribute('aria-expanded','false');
if(menu&&links) menu.addEventListener('click',()=>{
  const isOpen=links.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(isOpen));
});
document.querySelectorAll('.links a').forEach(link=>link.addEventListener('click',()=>links.classList.remove('open')));
document.querySelectorAll('.links a').forEach(link=>link.addEventListener('click',()=>menu?.setAttribute('aria-expanded','false')));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&links?.classList.contains('open')){
    links.classList.remove('open');
    menu?.setAttribute('aria-expanded','false');
    menu?.focus();
  }
});
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const nav=document.querySelector('nav');
if(nav) window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40),{passive:true});
document.querySelectorAll('.brand img').forEach(logo=>{
  logo.style.transform='none';
  logo.style.filter='brightness(0) invert(1)';
  logo.style.backfaceVisibility='visible';
});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.1,rootMargin:'0px 0px 20% 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
if(document.title.startsWith('The Team')){
  const main=document.querySelector('main');
  const oldHero=document.querySelector('.inner-hero');
  const cover=document.createElement('section');
  cover.className='team-cover';
  cover.innerHTML='<div class="team-cover-overlay"></div><div class="team-cover-copy"><div class="eyebrow mono">The people behind the build</div><h1 class="team-cover-title">Meet the<br><em>team.</em></h1><p>Team Velocity / VNIT Nagpur</p></div><span class="team-cover-scroll mono">Scroll to reveal ↓</span>';
  main.insertBefore(cover,main.firstChild);
  oldHero?.remove();
  document.querySelector('.team-section')?.setAttribute('id','team');
  window.addEventListener('scroll',()=>{const p=Math.min(window.scrollY/(window.innerHeight*.65),1);cover.style.opacity=String(1-p*.72);cover.style.transform=`scale(${1-p*.04})`},{passive:true});
}
const councilYear=document.querySelector('#council-year');
if(councilYear) councilYear.addEventListener('change',()=>document.querySelectorAll('[data-council]').forEach(panel=>panel.hidden=panel.dataset.council!==councilYear.value));
if(document.title.startsWith('The Journey')){
  document.body.classList.add('journey-page');
  const archivePhotos=[['assets/journey-photos/baja-2010.png','cover','center','1450 / 1160'],['assets/journey-photos/supra-2011.png','cover','center','1570 / 600'],['assets/journey-photos/rebuild-2018.png','cover','center','1570 / 1178'],['assets/journey-photos/supra-2019.png','cover','center','1450 / 1178']];
  document.querySelectorAll('.tl-card--placeholder').forEach((card,index)=>{
    const [photo,size,position,ratio]=archivePhotos[index]||[];
    if(!photo)return;
    card.classList.add('has-source-photo');
    card.style.setProperty('--archive-photo',`url("${photo}")`);
    card.style.setProperty('--archive-size',size);
    card.style.setProperty('--archive-position',position);
    card.style.setProperty('--archive-ratio',ratio);
    const note=card.querySelector('.placeholder-note');
    if(note)note.textContent='Original archive image';
  });
}
if(document.title.startsWith('Team Velocity')){
  const updatesNote=document.querySelector('.event-feature');
  if(updatesNote&&!document.querySelector('.social-links')){
    const social=document.createElement('div');
    social.className='social-links mono';
    social.innerHTML='<span>Follow the build</span><a href="https://www.instagram.com/vnit_racing/" target="_blank" rel="noreferrer"><svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5ZM17.8 6.3a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2Z"/></svg>Instagram ↗</a><a href="https://www.linkedin.com/company/teamvelocity-vnitracing/" target="_blank" rel="noreferrer"><svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.1 3.5A1.6 1.6 0 1 1 3.5 5.1a1.6 1.6 0 0 1 1.6-1.6ZM3.7 8h2.8v12H3.7V8Zm4.6 0H11v1.6h.1c.4-.8 1.5-2 3.3-2 3.5 0 4.1 2.3 4.1 5.3V20h-2.8v-6.3c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V20H8.3V8Z"/></svg>LinkedIn ↗</a>';
    updatesNote.insertAdjacentElement('afterend',social);
  }
}
if(false&&document.title.startsWith('The Team')){
  const profileLinks=()=>'<p class="member-socials"><a href="#" aria-label="Instagram profile placeholder"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5ZM17.8 6.3a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2Z"/></svg></a><a href="#" aria-label="LinkedIn profile placeholder"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.1 3.5A1.6 1.6 0 1 1 3.5 5.1a1.6 1.6 0 0 1 1.6-1.6ZM3.7 8h2.8v12H3.7V8Zm4.6 0H11v1.6h.1c.4-.8 1.5-2 3.3-2 3.5 0 4.1 2.3 4.1 5.3V20h-2.8v-6.3c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V20H8.3V8Z"/></svg></a></p>';
  document.querySelector('.team-head>p')?.remove();
  document.querySelectorAll('.team-card').forEach(card=>{
    card.querySelector('.member-index,.member-bio')?.remove();
    card.insertAdjacentHTML('beforeend',profileLinks());
  });
  const lastYear=document.querySelector('[data-council="2025-26"]');
  if(lastYear){
    lastYear.classList.add('council-advisory');
    lastYear.removeAttribute('data-council');
    lastYear.querySelector('.council-panel-head')?.remove();
    lastYear.querySelectorAll('.council-grid div').forEach(card=>{
      card.insertAdjacentHTML('beforeend',profileLinks());
    });
    const pastArchive=lastYear.closest('.past-councils');
    const advisory=document.createElement('section');
    advisory.className='past-councils advisory-section';
    advisory.innerHTML='<div class="shell"><div class="past-head"><div><div class="eyebrow mono">Advisory</div><h2 class="display">Council 2025–26.</h2></div></div></div>';
    advisory.querySelector('.shell').append(lastYear);
    pastArchive?.parentElement?.insertBefore(advisory,pastArchive);
    councilYear?.querySelector('option[value="2025-26"]')?.remove();
    if(councilYear){
      councilYear.value='2024-25';
      councilYear.dispatchEvent(new Event('change'));
    }
  }
}
