/* ============================================================
   FutureWorld Robotics — shared site behaviours
   particle field · scroll reveal · nav hide · mobile menu · password gate
   ============================================================ */

/* ---------- PASSWORD GATE (Phase 1 — Omar only, low-security) ----------
   Change the password by replacing PASS_HASH with the SHA-256 hex of your
   new password. Generate one at any "sha256 online" tool, or ask Jack.
   Current password: futureworld2027
*/
const PASS_HASH = "43680b5c6581c435d765a689fae615903eaab6f3f7611228ac67ba33dbf86f84";
const GATE_KEY  = "fwr_unlocked";

async function sha256(str){
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
(function gate(){
  return; // PASSWORD GATE DISABLED — site is public. To re-enable, delete this line.
  if(sessionStorage.getItem(GATE_KEY)==="1") return;
  document.documentElement.classList.add("pre-gate");
  document.addEventListener("DOMContentLoaded",()=>{
    document.body.classList.add("locked");
    const g=document.createElement("div");
    g.id="gate";
    g.innerHTML=`
      <div class="gate-card">
        <img src="assets/Logo.png" alt="FutureWorld Robotics">
        <h2>Private investor data room</h2>
        <p>This material is confidential and shared by invitation only. Please enter the access password to continue.</p>
        <div class="err" id="gateErr"></div>
        <input id="gatePw" type="password" placeholder="Access password" autocomplete="off" autofocus>
        <button id="gateBtn">Enter</button>
        <div class="lock">🔒 FutureWorld Robotics · Confidential</div>
      </div>`;
    document.body.appendChild(g);
    const pw=g.querySelector("#gatePw"), btn=g.querySelector("#gateBtn"), err=g.querySelector("#gateErr");
    async function tryUnlock(){
      const h=await sha256(pw.value.trim());
      if(h===PASS_HASH){
        sessionStorage.setItem(GATE_KEY,"1");
        g.remove(); document.body.classList.remove("locked");
      } else { err.textContent="Incorrect password. Please try again."; pw.value=""; pw.focus(); }
    }
    btn.addEventListener("click",tryUnlock);
    pw.addEventListener("keydown",e=>{if(e.key==="Enter")tryUnlock();});
  });
})();

/* ---------- particle field ---------- */
function initParticles(){
  const c=document.getElementById('particles'); if(!c) return;
  const x=c.getContext('2d'); let w,h,pts;
  function size(){w=c.width=innerWidth;h=c.height=innerHeight;
    pts=Array.from({length:Math.min(70,Math.floor(w/22))},()=>({
      x:Math.random()*w,y:Math.random()*h,
      vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.5+.5}));}
  size();addEventListener('resize',size);
  function loop(){x.clearRect(0,0,w,h);
    for(const p of pts){p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
      x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fillStyle='rgba(46,117,182,.40)';x.fill();}
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<120){x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);
        x.strokeStyle='rgba(46,117,182,'+(.10*(1-d/120))+')';x.stroke();}}
    requestAnimationFrame(loop);}
  loop();
}

/* ---------- scroll reveal ---------- */
function initReveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

/* ---------- nav hide on scroll + mobile menu ---------- */
function initNav(){
  const navEl=document.querySelector('nav'); let lastY=window.scrollY;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    if(y>lastY && y>140){navEl.classList.add('hidden');} else {navEl.classList.remove('hidden');}
    lastY=y;
  },{passive:true});
  const burger=document.querySelector('.burger'),mm=document.querySelector('.mobile-menu'),mc=document.querySelector('.mobile-close');
  if(burger&&mm){
    burger.addEventListener('click',()=>{mm.classList.add('open');mc&&mc.classList.add('show');});
    mc&&mc.addEventListener('click',()=>{mm.classList.remove('open');mc.classList.remove('show');});
    mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mm.classList.remove('open');mc&&mc.classList.remove('show');}));
  }
}

/* ---------- hero sound toggle ---------- */
function initSound(){
  const vid=document.querySelector('.hero-video'),sb=document.getElementById('soundBtn');
  if(sb&&vid){sb.addEventListener('click',()=>{vid.muted=!vid.muted;if(!vid.muted)vid.play().catch(()=>{});sb.textContent=vid.muted?'🔇':'🔊';});}
}

/* ---------- back-to-top button ---------- */
function initToTop(){
  const b=document.createElement('button');
  b.id='toTop'; b.setAttribute('aria-label','Back to top'); b.innerHTML='↑';
  document.body.appendChild(b);
  b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll',()=>{
    if(window.scrollY>420)b.classList.add('show'); else b.classList.remove('show');
  },{passive:true});
}

document.addEventListener('DOMContentLoaded',()=>{initParticles();initReveal();initNav();initSound();initToTop();});
