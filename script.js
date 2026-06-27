const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let W, H, stars = [], rain = [], t = 0;

function resize(){
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
  stars = Array.from({length: Math.min(170, Math.floor(W/6))}, () => ({
    x: Math.random()*W, y: Math.random()*H, z: Math.random()*900+80, s: Math.random()*2+.6
  }));
  rain = Array.from({length: 95}, () => ({
    x: Math.random()*W, y: Math.random()*H, l: Math.random()*22+8, sp: Math.random()*8+5
  }));
}
resize();
addEventListener("resize", resize);

function background(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,"#07011c");
  g.addColorStop(.35,"#14105a");
  g.addColorStop(.62,"#10001f");
  g.addColorStop(1,"#020006");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  // moon
  ctx.fillStyle = "rgba(255,255,255,.85)";
  ctx.beginPath();
  ctx.arc(W*.77,H*.11,34,0,Math.PI*2);
  ctx.fill();
  ctx.fillStyle = "#07011c";
  ctx.beginPath();
  ctx.arc(W*.79,H*.095,34,0,Math.PI*2);
  ctx.fill();

  // buildings
  for(let i=0;i<12;i++){
    const bw = W/12 + 8;
    const x = i*bw - 20;
    const bh = H*(.25 + ((i*73)%35)/100);
    ctx.fillStyle = "rgba(5,0,18,.82)";
    ctx.fillRect(x,H-bh,bw,bh);

    for(let y=H-bh+22;y<H-20;y+=28){
      for(let xx=x+10;xx<x+bw-10;xx+=26){
        if((xx+y+i+t)%4<2){
          ctx.fillStyle = Math.random()>.5 ? "rgba(255,35,218,.65)" : "rgba(0,170,255,.65)";
          ctx.fillRect(xx,y,10,14);
        }
      }
    }
  }

  // wet road
  ctx.fillStyle = "rgba(0,0,0,.5)";
  ctx.fillRect(0,H*.72,W,H*.28);
  for(let i=0;i<18;i++){
    ctx.strokeStyle = `rgba(255,43,214,${.05+i*.008})`;
    ctx.beginPath();
    ctx.moveTo(0,H*.74+i*18);
    ctx.lineTo(W,H*.72+i*22);
    ctx.stroke();
  }
}

function starTunnel(){
  for(const p of stars){
    p.z -= 6;
    if(p.z<1){p.z=900;p.x=Math.random()*W;p.y=Math.random()*H}
    const k = 430/p.z;
    const x = (p.x-W/2)*k + W/2;
    const y = (p.y-H/2)*k + H/2;
    ctx.fillStyle = "rgba(255,255,255,.75)";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#ff2bd6";
    ctx.beginPath();
    ctx.arc(x,y,p.s*k,0,Math.PI*2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

function drawRain(){
  ctx.strokeStyle = "rgba(180,220,255,.35)";
  ctx.lineWidth = 1;
  for(const r of rain){
    r.y += r.sp;
    r.x += 1.4;
    if(r.y>H){r.y=-20;r.x=Math.random()*W}
    ctx.beginPath();
    ctx.moveTo(r.x,r.y);
    ctx.lineTo(r.x-7,r.y+r.l);
    ctx.stroke();
  }
}

function neonCar(){
  const x = W*.72 + Math.sin(t*.015)*18;
  const y = H*.72;
  ctx.save();
  ctx.translate(x,y);
  const sc = Math.min(W/850,1);
  ctx.scale(sc,sc);
  ctx.shadowBlur = 30;
  ctx.shadowColor = "#ff2bd6";
  ctx.fillStyle = "#080012";
  ctx.beginPath();
  ctx.roundRect(-180,-45,360,78,22);
  ctx.fill();
  ctx.fillStyle = "#160022";
  ctx.beginPath();
  ctx.roundRect(-80,-95,150,55,22);
  ctx.fill();
  ctx.fillStyle = "#ff2bd6";
  ctx.fillRect(80,-5,90,10);
  ctx.fillStyle = "#00a6ff";
  ctx.fillRect(-170,-5,70,10);
  ctx.restore();
  ctx.shadowBlur = 0;
}

function loop(){
  t++;
  background();
  starTunnel();
  drawRain();
  neonCar();
  requestAnimationFrame(loop);
}
loop();

// views counter saved in browser
const viewEl = document.getElementById("views");
let views = Number(localStorage.getItem("shrey_views") || 28) + 1;
localStorage.setItem("shrey_views", views);
viewEl.textContent = views;

// try autoplay. Browsers usually block sound, so muted autoplay starts.
// Button unmutes. On some browsers, real sound still needs 1 tap.
const song = document.getElementById("song");
const btn = document.getElementById("unmuteBtn");

window.addEventListener("load", async () => {
  try { await song.play(); } catch(e) {}
});

btn.addEventListener("click", async () => {
  song.muted = false;
  try { await song.play(); } catch(e) {}
  btn.style.display = "none";
});

// desktop 3D movement
const box = document.querySelector(".profile-box");
document.addEventListener("mousemove", e => {
  if(innerWidth < 700) return;
  const ry = (e.clientX/innerWidth - .5) * 8;
  const rx = (e.clientY/innerHeight - .5) * -6;
  box.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
});
document.addEventListener("mouseleave", () => box.style.transform = "");
