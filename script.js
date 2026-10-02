const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// Reveal sections as she scrolls.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, {threshold: .12});
$$('.reveal').forEach(el => observer.observe(el));

$$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
  document.getElementById(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth'});
}));

// Custom cursor on desktop.
document.addEventListener('pointermove', e => {
  $$('.cursor').forEach((c,i) => {
    c.style.left = `${e.clientX}px`; c.style.top = `${e.clientY}px`;
    c.style.transform = `translate(${-50 + i*12}%, ${-50 + i*12}%)`;
  });
});

const noBtn = $('#noBtn');
const yesBtn = $('#yesBtn');
const proposal = $('#proposal');
const finale = $('#finale');
const hint = $('#hint');
let noMoves = 0;

function jumpNoButton() {
  const pad = 14;
  const rect = noBtn.getBoundingClientRect();
  const maxX = Math.max(pad, window.innerWidth - rect.width - pad);
  const maxY = Math.max(pad, window.innerHeight - rect.height - pad);
  // Keep it completely unpredictable while still safely inside the viewport.
  const x = pad + Math.random() * (maxX - pad);
  const y = pad + Math.random() * (maxY - pad);
  noBtn.style.position = 'fixed';
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = 'none';
  noBtn.style.zIndex = '50';
  noMoves++;
  hint.textContent = noMoves < 3 ? 'Nice try. 👀' : noMoves < 6 ? 'You really thought I would let you click that? 😂' : 'The universe seems to have opinions. 💜';
}

// Mouse, touch, and keyboard-focus attempts all make NO jump.
noBtn.addEventListener('pointerdown', e => { e.preventDefault(); jumpNoButton(); });
noBtn.addEventListener('mouseenter', jumpNoButton);
noBtn.addEventListener('focus', jumpNoButton);
noBtn.addEventListener('touchstart', e => { e.preventDefault(); jumpNoButton(); }, {passive:false});

// Only YES advances.
yesBtn.addEventListener('click', () => {
  proposal.style.display = 'none';
  finale.setAttribute('aria-hidden','false');
  finale.classList.add('show');
  document.body.classList.add('official-mode');
  // Keep the user inside the official section. The finale is a fixed overlay,
  // so clicking YES never jumps back to the top of the page.
  document.documentElement.scrollTop = document.documentElement.scrollTop;
  document.body.scrollTop = document.body.scrollTop;
  burst();
});

$('#lastBtn').addEventListener('click', () => $('#letter').classList.toggle('show'));

function burst(){
  const chars = ['♥','✦','•','❤','✧'];
  for(let i=0;i<55;i++){
    const el=document.createElement('span');
    el.textContent=chars[Math.floor(Math.random()*chars.length)];
    Object.assign(el.style,{position:'fixed',left:'50%',top:'50%',zIndex:100,fontSize:`${10+Math.random()*18}px`,color:['#fff','#d7b1ff','#ff8bcf'][i%3],pointerEvents:'none',transition:'transform 1.5s ease,opacity 1.5s ease'});
    document.body.appendChild(el);
    requestAnimationFrame(()=>{el.style.transform=`translate(${(Math.random()-.5)*90}vw,${(Math.random()-.5)*90}vh) rotate(${Math.random()*600-300}deg)`;el.style.opacity='0'});
    setTimeout(()=>el.remove(),1600);
  }
}
