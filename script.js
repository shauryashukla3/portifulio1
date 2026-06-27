const canvas = document.getElementById("bg3d");
const ctx = canvas.getContext("2d");
let w, h;
let particles = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  particles = Array.from({ length: Math.min(120, Math.floor(w / 9)) }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random() * 900 + 80,
    s: Math.random() * 2 + 0.8
  }));
}
resize();
window.addEventListener("resize", resize);

let pulse = 0;

function drawRoad() {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#3912a6");
  grad.addColorStop(.35, "#b947c9");
  grad.addColorStop(.62, "#241331");
  grad.addColorStop(1, "#030006");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w / 2, h * 0.64);
  for (let i = 0; i < 20; i++) {
    const y = i * 48 + (pulse % 48);
    const scale = y / 900;
    ctx.strokeStyle = `rgba(255,255,255,${0.22 - i * .008})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-80 - scale * w, y);
    ctx.lineTo(-10 - scale * 40, y);
    ctx.moveTo(80 + scale * w, y);
    ctx.lineTo(10 + scale * 40, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticles() {
  for (const p of particles) {
    p.z -= 5;
    if (p.z < 1) {
      p.z = 900;
      p.x = Math.random() * w;
      p.y = Math.random() * h;
    }

    const k = 420 / p.z;
    const x = (p.x - w / 2) * k + w / 2;
    const y = (p.y - h / 2) * k + h / 2;
    const size = p.s * k;

    ctx.fillStyle = "rgba(255,255,255,.75)";
    ctx.shadowBlur = 14;
    ctx.shadowColor = "#ff37d7";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function loop() {
  pulse += 2;
  drawRoad();
  drawParticles();
  requestAnimationFrame(loop);
}
loop();

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

musicBtn.addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();
      musicBtn.textContent = "⏸ Pause Music";
      document.body.classList.add("music-on");
    } else {
      music.pause();
      musicBtn.textContent = "▶ Play Music";
      document.body.classList.remove("music-on");
    }
  } catch {
    alert("Add assets/music.mp3 first, then try again.");
  }
});

// Mouse / touch 3D tilt
const card = document.querySelector(".glass-card");

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - .5) * 10;
  const y = (e.clientY / window.innerHeight - .5) * -10;
  card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

document.addEventListener("mouseleave", () => {
  card.style.transform = "";
});
