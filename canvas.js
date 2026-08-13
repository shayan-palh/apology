/**
 * Friendship Apology Canvas Engine: Floating Petals, Sparkling Stars, & Cascading Flower Shower
 */

const petalsCanvas = document.getElementById('petals-canvas');
const petalsCtx = petalsCanvas ? petalsCanvas.getContext('2d') : null;

const fireworksCanvas = document.getElementById('fireworks-canvas');
const fireworksCtx = fireworksCanvas ? fireworksCanvas.getContext('2d') : null;

let width = window.innerWidth;
let height = window.innerHeight;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;

  if (petalsCanvas) {
    petalsCanvas.width = width;
    petalsCanvas.height = height;
  }
  if (fireworksCanvas) {
    fireworksCanvas.width = width;
    fireworksCanvas.height = height;
  }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const PETAL_COUNT = 45;
const STAR_COUNT = 45;

const petals = [];
const stars = [];

class Petal {
  constructor(fromTop = false) {
    this.reset(fromTop);
  }

  reset(fromTop = false) {
    this.x = Math.random() * width;
    this.y = fromTop ? -30 - Math.random() * 300 : Math.random() * height;
    this.size = 10 + Math.random() * 18;
    this.speedY = 1.5 + Math.random() * 3.0;
    this.speedX = (Math.random() - 0.5) * 2.2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.06;
    this.oscillationSpeed = 0.02 + Math.random() * 0.03;
    this.oscillationStep = Math.random() * Math.PI * 2;
    this.opacity = 0.7 + Math.random() * 0.3;

    // Vibrant Floral Colors (Sakura Pink, Rose, Sunflower Gold, Lavender, Emerald)
    const colors = [
      { r: 255, g: 105, b: 180 }, // Vibrant Pink
      { r: 255, g: 182, b: 193 }, // Soft Sakura
      { r: 244, g: 208, b: 104 }, // Golden Sunflower
      { r: 167, g: 139, b: 250 }, // Soft Lavender
      { r: 255, g: 77,  b: 109 }  // Bright Rose
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.oscillationStep += this.oscillationSpeed;
    this.x += this.speedX + Math.sin(this.oscillationStep) * 1.5;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;

    if (this.y > height + 30 || this.x < -30 || this.x > width + 30) {
      this.reset(true);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;

    // Beautiful Flower Petal Path
    ctx.beginPath();
    ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size * 1.5);
    ctx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
    ctx.fill();

    // Subtle Petal Highlight
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.arc(0, this.size * 0.4, this.size * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class Star {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 0.5;
    this.alpha = Math.random();
    this.alphaSpeed = 0.005 + Math.random() * 0.015;
  }

  update() {
    this.alpha += this.alphaSpeed;
    if (this.alpha > 1 || this.alpha < 0.1) {
      this.alphaSpeed = -this.alphaSpeed;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < PETAL_COUNT; i++) petals.push(new Petal(false));
for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());

function animateBackground() {
  if (petalsCtx) {
    petalsCtx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      star.update();
      star.draw(petalsCtx);
    });

    petals.forEach(petal => {
      petal.update();
      petal.draw(petalsCtx);
    });
  }

  requestAnimationFrame(animateBackground);
}

animateBackground();

// --- Continuous Flower Shower Engine ---
let showerInterval = null;

export function triggerFlowerShower() {
  // 1. Instantly spawn 120 extra flower petals raining from top
  for (let i = 0; i < 120; i++) {
    setTimeout(() => {
      petals.push(new Petal(true));
    }, i * 20);
  }

  // 2. Keep raining flowers continuously for 10 seconds!
  if (showerInterval) clearInterval(showerInterval);
  let count = 0;
  showerInterval = setInterval(() => {
    petals.push(new Petal(true));
    count++;
    if (count > 60) clearInterval(showerInterval);
  }, 100);
}
